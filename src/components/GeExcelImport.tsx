import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import * as XLSX from "xlsx";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Download, FileSpreadsheet, FileDown } from "lucide-react";

type AreaRow = {
  area_code?: string;
  system?: string;
  title?: string;
  units_note?: string;
  sort_order?: number | string;
};

type CourseRow = {
  area_code?: string;
  code?: string;
  description?: string;
};

function normSystem(v: unknown): "RCCD" | "CalGETC" {
  const s = String(v ?? "").trim().toLowerCase();
  if (s === "calgetc" || s === "cal-getc" || s === "cal getc") return "CalGETC";
  return "RCCD";
}

export function GeExcelImport() {
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

      const areaSheet = wb.Sheets["GE Areas"] ?? wb.Sheets[wb.SheetNames[0]];
      const courseSheet = wb.Sheets["GE Courses"];
      if (!areaSheet) throw new Error('Missing "GE Areas" sheet');

      const areas = XLSX.utils.sheet_to_json<AreaRow>(areaSheet, { defval: "" });
      const courses = courseSheet
        ? XLSX.utils.sheet_to_json<CourseRow>(courseSheet, { defval: "" })
        : [];

      addLog(`Parsed ${areas.length} areas, ${courses.length} course rows`);

      // Group courses by area_code, preserve order
      const coursesByArea = new Map<
        string,
        { codes: string[]; descriptions: Record<string, string> }
      >();
      for (const c of courses) {
        const ac = String(c.area_code ?? "").trim();
        const code = String(c.code ?? "").trim();
        if (!ac || !code) continue;
        if (!coursesByArea.has(ac))
          coursesByArea.set(ac, { codes: [], descriptions: {} });
        const entry = coursesByArea.get(ac)!;
        entry.codes.push(code);
        const desc = String(c.description ?? "").trim();
        if (desc) entry.descriptions[code] = desc;
      }

      for (const a of areas) {
        const area_code = String(a.area_code ?? "").trim();
        if (!area_code) {
          addLog("Skipped area with empty area_code");
          continue;
        }
        const grouped = coursesByArea.get(area_code);
        const payload = {
          area_code,
          system: normSystem(a.system),
          title: String(a.title ?? "").trim() || area_code,
          units_note: String(a.units_note ?? "").trim(),
          sort_order: Number(a.sort_order) || 0,
          courses: grouped?.codes ?? [],
          course_descriptions: (grouped?.descriptions ?? {}) as Record<
            string,
            string
          >,
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
            addLog(`Area ${area_code}: ${error.message}`);
            continue;
          }
        } else {
          const { error } = await supabase.from("ge_areas").insert(payload);
          if (error) {
            addLog(`Area ${area_code}: ${error.message}`);
            continue;
          }
        }
        addLog(`✓ ${payload.system} ${area_code}`);
      }

      addLog("Done.");
      qc.invalidateQueries({ queryKey: ["ge_areas_admin"] });
      qc.invalidateQueries({ queryKey: ["ge_areas"] });
    } catch (e) {
      addLog(`Error: ${(e as Error).message}`);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function downloadTemplate() {
    const wb = XLSX.utils.book_new();
    const areas = XLSX.utils.json_to_sheet([
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
    const cs = XLSX.utils.json_to_sheet([
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
    XLSX.utils.book_append_sheet(wb, areas, "GE Areas");
    XLSX.utils.book_append_sheet(wb, cs, "GE Courses");
    XLSX.writeFile(wb, "ge-areas-template.xlsx");
  }

  async function exportExisting() {
    setBusy(true);
    setLog([]);
    try {
      const { data, error } = await supabase
        .from("ge_areas")
        .select("*")
        .order("sort_order");
      if (error) throw error;

      const areaRows = (data ?? []).map((a: any) => ({
        area_code: a.area_code,
        system: a.system ?? "RCCD",
        title: a.title ?? "",
        units_note: a.units_note ?? "",
        sort_order: a.sort_order ?? 0,
      }));
      const courseRows: { area_code: string; code: string; description: string }[] = [];
      for (const a of data ?? []) {
        const descs = (a.course_descriptions ?? {}) as Record<string, string>;
        for (const code of (a.courses ?? []) as string[]) {
          courseRows.push({
            area_code: a.area_code,
            code,
            description: descs[code] ?? "",
          });
        }
      }

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(areaRows), "GE Areas");
      XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(courseRows), "GE Courses");
      const stamp = new Date().toISOString().slice(0, 10);
      XLSX.writeFile(wb, `ge-areas-export-${stamp}.xlsx`);
      addLog(`Exported ${areaRows.length} areas and ${courseRows.length} courses.`);
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
            <h2 className="font-serif text-lg text-foreground">Import / Export GE Areas</h2>
            <p className="text-sm text-muted-foreground">
              Upload an .xlsx with sheets <strong>GE Areas</strong> and{" "}
              <strong>GE Courses</strong>. Areas are matched by{" "}
              <code>area_code</code> (new ones created, existing ones updated).
              For each area in the upload, listed courses fully replace its
              course list.
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
