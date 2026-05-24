import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import * as XLSX from "xlsx";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Download, FileSpreadsheet } from "lucide-react";

type ProgramRow = {
  slug?: string;
  name?: string;
  degree_type?: string;
  total_units?: number | string;
  cluster?: string;
  description?: string;
  outcomes?: string;
};

type CourseRow = {
  program_slug?: string;
  code?: string;
  title?: string;
  units?: number | string;
  year?: number | string;
  semester?: string;
  category?: string;
  prerequisite?: string;
  satisfies?: string;
  description?: string;
  optional?: boolean | string;
  note?: string;
  sort_order?: number | string;
};

function splitLines(v: unknown): string[] {
  if (!v) return [];
  return String(v)
    .split(/\r?\n|;/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function toBool(v: unknown): boolean {
  if (typeof v === "boolean") return v;
  const s = String(v ?? "").trim().toLowerCase();
  return s === "true" || s === "yes" || s === "y" || s === "1";
}

export function ProgramExcelImport() {
  const qc = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  function addLog(line: string) {
    setLog((l) => [...l, line]);
  }

  async function handleFile(file: File) {
    setBusy(true);
    setLog([]);
    try {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: "array" });

      const progSheet = wb.Sheets["Programs"] ?? wb.Sheets[wb.SheetNames[0]];
      const courseSheet = wb.Sheets["Courses"];
      if (!progSheet) throw new Error('Missing "Programs" sheet');

      const programs = XLSX.utils.sheet_to_json<ProgramRow>(progSheet, { defval: "" });
      const courses = courseSheet
        ? XLSX.utils.sheet_to_json<CourseRow>(courseSheet, { defval: "" })
        : [];

      addLog(`Parsed ${programs.length} programs, ${courses.length} courses`);

      // Upsert programs by slug
      const slugToId = new Map<string, string>();
      for (const p of programs) {
        const slug = String(p.slug ?? "").trim();
        if (!slug) {
          addLog(`Skipped program with empty slug`);
          continue;
        }
        const payload = {
          slug,
          name: String(p.name ?? "").trim() || slug,
          degree_type: String(p.degree_type ?? "").trim(),
          total_units: Number(p.total_units) || 0,
          cluster: String(p.cluster ?? "").trim(),
          description: String(p.description ?? ""),
          outcomes: splitLines(p.outcomes),
        };
        const { data: existing } = await supabase
          .from("programs")
          .select("id")
          .eq("slug", slug)
          .maybeSingle();
        let id: string | undefined;
        if (existing) {
          const { error } = await supabase.from("programs").update(payload).eq("id", existing.id);
          if (error) {
            addLog(`Program ${slug}: ${error.message}`);
            continue;
          }
          id = existing.id;
        } else {
          const { data, error } = await supabase
            .from("programs")
            .insert(payload)
            .select("id")
            .single();
          if (error) {
            addLog(`Program ${slug}: ${error.message}`);
            continue;
          }
          id = data.id;
        }
        slugToId.set(slug, id!);
        addLog(`✓ Program ${slug}`);

      }

      // Resolve any course program_slugs not yet in map (existing programs not in upload)
      const missing = Array.from(
        new Set(
          courses
            .map((c) => String(c.program_slug ?? "").trim())
            .filter((s) => s && !slugToId.has(s)),
        ),
      );
      if (missing.length) {
        const { data: existing } = await supabase
          .from("programs")
          .select("id, slug")
          .in("slug", missing);
        existing?.forEach((p) => slugToId.set(p.slug, p.id));
      }

      // Upsert courses — we use (program_id, code) as identity by deleting existing matches first
      // Group by program for fewer round trips
      const byProgram = new Map<string, CourseRow[]>();
      for (const c of courses) {
        const slug = String(c.program_slug ?? "").trim();
        const id = slugToId.get(slug);
        if (!id) {
          addLog(`Skipped course ${c.code} — unknown program_slug "${slug}"`);
          continue;
        }
        if (!byProgram.has(id)) byProgram.set(id, []);
        byProgram.get(id)!.push(c);
      }

      for (const [programId, rows] of byProgram) {
        const codes = rows.map((r) => String(r.code ?? "").trim()).filter(Boolean);
        if (codes.length) {
          // Remove any existing courses with these codes so we can re-insert cleanly
          const { error: delErr } = await supabase
            .from("courses")
            .delete()
            .eq("program_id", programId)
            .in("code", codes);
          if (delErr) {
            addLog(`Clear existing for ${programId}: ${delErr.message}`);
          }
        }
        const inserts = rows
          .map((c, i) => {
            const code = String(c.code ?? "").trim();
            if (!code) return null;
            return {
              program_id: programId,
              code,
              title: String(c.title ?? "").trim() || code,
              units: Number(c.units) || 0,
              year: Number(c.year) || 1,
              semester: String(c.semester ?? "Fall").trim() || "Fall",
              category: String(c.category ?? "core").trim() || "core",
              prerequisite: String(c.prerequisite ?? "").trim() || null,
              satisfies: splitLines(c.satisfies),
              description: String(c.description ?? "") || null,
              optional: toBool(c.optional),
              note: String(c.note ?? "") || null,
              sort_order: Number(c.sort_order) || i,
            };
          })
          .filter(Boolean);
        if (inserts.length) {
          const { error } = await supabase.from("courses").insert(inserts as any);
          if (error) {
            addLog(`Insert courses for ${programId}: ${error.message}`);
          } else {
            addLog(`✓ ${inserts.length} courses for program ${programId.slice(0, 8)}…`);
          }
        }
      }

      addLog("Done.");
      qc.invalidateQueries({ queryKey: ["programs"] });
    } catch (e) {
      addLog(`Error: ${(e as Error).message}`);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function downloadTemplate() {
    const wb = XLSX.utils.book_new();
    const progs = XLSX.utils.json_to_sheet([
      {
        slug: "example-program",
        name: "Example Program",
        degree_type: "AA-T",
        total_units: 60,
        cluster: "Arts & Humanities",
        description: "Short description shown on the program page.",
        outcomes: "Outcome 1\nOutcome 2\nOutcome 3",
      },
    ]);
    const cs = XLSX.utils.json_to_sheet([
      {
        program_slug: "example-program",
        code: "ENG-1A",
        title: "English Composition",
        units: 4,
        year: 1,
        semester: "Fall",
        category: "core",
        prerequisite: "",
        satisfies: "RCCD GE 1A",
        description: "Reading and writing college-level prose.",
        optional: false,
        note: "",
        sort_order: 1,
      },
      {
        program_slug: "example-program",
        code: "RCCD GE 3",
        title: "Arts & Humanities elective",
        units: 3,
        year: 1,
        semester: "Spring",
        category: "ge",
        prerequisite: "",
        satisfies: "",
        description: "",
        optional: false,
        note: "",
        sort_order: 2,
      },
    ]);
    XLSX.utils.book_append_sheet(wb, progs, "Programs");
    XLSX.utils.book_append_sheet(wb, cs, "Courses");
    XLSX.writeFile(wb, "programs-template.xlsx");
  }

  return (
    <div className="mt-6 rounded-lg border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <FileSpreadsheet className="mt-0.5 h-5 w-5 text-primary" />
          <div>
            <h2 className="font-serif text-lg text-foreground">Import from Excel</h2>
            <p className="text-sm text-muted-foreground">
              Upload an .xlsx with sheets <strong>Programs</strong> and <strong>Courses</strong>.
              Programs are matched by <code>slug</code> (new ones are created, existing ones
              updated). For each program in the upload, listed courses replace existing courses
              with the same code.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={downloadTemplate}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm hover:bg-accent/30"
          >
            <Download className="h-4 w-4" /> Template
          </button>
          <button
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-burgundy disabled:opacity-60"
          >
            <Upload className="h-4 w-4" /> {busy ? "Importing…" : "Upload .xlsx"}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
        </div>
      </div>
      {log.length > 0 && (
        <pre className="mt-4 max-h-60 overflow-auto rounded-md bg-muted/40 p-3 text-xs">
          {log.join("\n")}
        </pre>
      )}
    </div>
  );
}
