import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import * as XLSX from "xlsx";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Download, FileSpreadsheet, FileDown } from "lucide-react";

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

type GeAreaRow = {
  area_code?: string;
  system?: string;
  title?: string;
  units_note?: string;
  sort_order?: number | string;
};

type GeCourseRow = {
  area_code?: string;
  code?: string;
  description?: string;
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

function normSystem(v: unknown): "RCCD" | "CalGETC" {
  const s = String(v ?? "").trim().toLowerCase();
  if (s === "calgetc" || s === "cal-getc" || s === "cal getc") return "CalGETC";
  return "RCCD";
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

      const progSheet = wb.Sheets["Programs"];
      const courseSheet = wb.Sheets["Courses"];
      const geAreaSheet = wb.Sheets["GE Areas"];
      const geCourseSheet = wb.Sheets["GE Courses"];

      if (!progSheet && !geAreaSheet) {
        throw new Error('Missing "Programs" or "GE Areas" sheet');
      }

      const programs = progSheet
        ? XLSX.utils.sheet_to_json<ProgramRow>(progSheet, { defval: "" })
        : [];
      const courses = courseSheet
        ? XLSX.utils.sheet_to_json<CourseRow>(courseSheet, { defval: "" })
        : [];
      const geAreas = geAreaSheet
        ? XLSX.utils.sheet_to_json<GeAreaRow>(geAreaSheet, { defval: "" })
        : [];
      const geCourses = geCourseSheet
        ? XLSX.utils.sheet_to_json<GeCourseRow>(geCourseSheet, { defval: "" })
        : [];

      addLog(
        `Parsed ${programs.length} programs, ${courses.length} courses, ${geAreas.length} GE areas, ${geCourses.length} GE course rows`,
      );

      // === Programs + Courses ===
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

      // === GE Areas + GE Courses ===
      const geCoursesByArea = new Map<
        string,
        { codes: string[]; descriptions: Record<string, string> }
      >();
      for (const c of geCourses) {
        const ac = String(c.area_code ?? "").trim();
        const code = String(c.code ?? "").trim();
        if (!ac || !code) continue;
        if (!geCoursesByArea.has(ac))
          geCoursesByArea.set(ac, { codes: [], descriptions: {} });
        const entry = geCoursesByArea.get(ac)!;
        entry.codes.push(code);
        const desc = String(c.description ?? "").trim();
        if (desc) entry.descriptions[code] = desc;
      }

      for (const a of geAreas) {
        const area_code = String(a.area_code ?? "").trim();
        if (!area_code) {
          addLog("Skipped GE area with empty area_code");
          continue;
        }
        const grouped = geCoursesByArea.get(area_code);
        const payload = {
          area_code,
          system: normSystem(a.system),
          title: String(a.title ?? "").trim() || area_code,
          units_note: String(a.units_note ?? "").trim(),
          sort_order: Number(a.sort_order) || 0,
          courses: grouped?.codes ?? [],
          course_descriptions: (grouped?.descriptions ?? {}) as Record<string, string>,
        };

        const { data: existing } = await supabase
          .from("ge_areas")
          .select("id")
          .eq("area_code", area_code)
          .maybeSingle();

        if (existing) {
          const { error } = await supabase
            .from("ge_areas")
            .update(payload)
            .eq("id", existing.id);
          if (error) {
            addLog(`GE area ${area_code}: ${error.message}`);
            continue;
          }
        } else {
          const { error } = await supabase.from("ge_areas").insert(payload);
          if (error) {
            addLog(`GE area ${area_code}: ${error.message}`);
            continue;
          }
        }
        addLog(`✓ ${payload.system} ${area_code}`);
      }

      addLog("Done.");
      qc.invalidateQueries({ queryKey: ["programs"] });
      qc.invalidateQueries({ queryKey: ["ge_areas"] });
      qc.invalidateQueries({ queryKey: ["ge_areas_admin"] });
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
    const geAreas = XLSX.utils.json_to_sheet([
      {
        area_code: "1A",
        system: "RCCD",
        title: "English Composition",
        units_note: "3 units",
        sort_order: 0,
      },
      {
        area_code: "1A-CGETC",
        system: "CalGETC",
        title: "English Composition",
        units_note: "3 units",
        sort_order: 0,
      },
    ]);
    const geCs = XLSX.utils.json_to_sheet([
      {
        area_code: "1A",
        code: "ENG 1A",
        description: "Reading and writing college-level prose.",
      },
      {
        area_code: "1A-CGETC",
        code: "ENG 1A",
        description: "Reading and writing college-level prose.",
      },
    ]);
    XLSX.utils.book_append_sheet(wb, progs, "Programs");
    XLSX.utils.book_append_sheet(wb, cs, "Courses");
    XLSX.utils.book_append_sheet(wb, geAreas, "GE Areas");
    XLSX.utils.book_append_sheet(wb, geCs, "GE Courses");
    XLSX.writeFile(wb, "pathways-template.xlsx");
  }

  async function exportExisting() {
    setBusy(true);
    setLog([]);
    try {
      const { data: progs, error: pErr } = await supabase
        .from("programs")
        .select("*")
        .order("name");
      if (pErr) throw pErr;
      const { data: courses, error: cErr } = await supabase
        .from("courses")
        .select("*")
        .order("sort_order");
      if (cErr) throw cErr;
      const { data: geData, error: geErr } = await supabase
        .from("ge_areas")
        .select("*")
        .order("sort_order");
      if (geErr) throw geErr;

      const idToSlug = new Map<string, string>();
      const progRows = (progs ?? []).map((p: any) => {
        idToSlug.set(p.id, p.slug);
        return {
          slug: p.slug,
          name: p.name,
          degree_type: p.degree_type ?? "",
          total_units: p.total_units ?? 0,
          cluster: p.cluster ?? "",
          description: p.description ?? "",
          outcomes: (p.outcomes ?? []).join("\n"),
        };
      });
      const courseRows = (courses ?? []).map((c: any) => ({
        program_slug: idToSlug.get(c.program_id) ?? "",
        code: c.code,
        title: c.title,
        units: c.units,
        year: c.year,
        semester: c.semester,
        category: c.category,
        prerequisite: c.prerequisite ?? "",
        satisfies: (c.satisfies ?? []).join("\n"),
        description: c.description ?? "",
        optional: c.optional ?? false,
        note: c.note ?? "",
        sort_order: c.sort_order ?? 0,
      }));

      const geAreaRows = (geData ?? []).map((a: any) => ({
        area_code: a.area_code,
        system: a.system ?? "RCCD",
        title: a.title ?? "",
        units_note: a.units_note ?? "",
        sort_order: a.sort_order ?? 0,
      }));
      const geCourseRows: { area_code: string; code: string; description: string }[] = [];
      for (const a of geData ?? []) {
        const descs = ((a as any).course_descriptions ?? {}) as Record<string, string>;
        for (const code of ((a as any).courses ?? []) as string[]) {
          geCourseRows.push({
            area_code: (a as any).area_code,
            code,
            description: descs[code] ?? "",
          });
        }
      }

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(progRows), "Programs");
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(courseRows), "Courses");
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(geAreaRows), "GE Areas");
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(geCourseRows), "GE Courses");
      const stamp = new Date().toISOString().slice(0, 10);
      XLSX.writeFile(wb, `pathways-export-${stamp}.xlsx`);
      addLog(
        `Exported ${progRows.length} programs, ${courseRows.length} courses, ${geAreaRows.length} GE areas, ${geCourseRows.length} GE course rows.`,
      );
    } catch (e) {
      addLog(`Error: ${(e as Error).message}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-6 rounded-lg border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <FileSpreadsheet className="mt-0.5 h-5 w-5 text-primary" />
          <div>
            <h2 className="font-serif text-lg text-foreground">Import / Export Excel</h2>
            <p className="text-sm text-muted-foreground">
              One .xlsx with sheets <strong>Programs</strong>, <strong>Courses</strong>,{" "}
              <strong>GE Areas</strong>, and <strong>GE Courses</strong>. Programs match by{" "}
              <code>slug</code>; GE areas match by <code>area_code</code>. Any sheet you omit
              is left untouched.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportExisting}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm hover:bg-accent/30 disabled:opacity-60"
          >
            <FileDown className="h-4 w-4" /> Export current
          </button>
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
