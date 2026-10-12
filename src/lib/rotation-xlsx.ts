import type { Program } from "@/lib/program";
import { normalizeTermsOffered } from "@/lib/api";
import { buildMasterList, masterTermMarks, rotationCourses } from "@/lib/rotation-pdf";

const TERMS = ["Fall", "Winter", "Spring", "Summer"] as const;
const CLARET = "891728";
const BURGUNDY = "4E0715";
const GOLD_FILL = "FAF4DA";
const ALT_FILL = "FAF8F3";

type Cell = string | number;

/** Rows for the school-wide term grid sheet (same columns as the PDF grid). */
export function gridRows(programs: Program[]): Cell[][] {
  return buildMasterList(programs).map((m) => [
    m.code, m.title, m.units, ...masterTermMarks(m), `${m.terms.length}x/year`, m.programs.join("\n"),
  ]);
}

/** Rows for the combined per-program sheet (PDF per-program columns plus a Program column). */
export function programRows(programs: Program[]): Cell[][] {
  return [...programs].sort((a, b) => a.name.localeCompare(b.name)).flatMap((p) =>
    rotationCourses(p.courses)
      .sort((a, b) => a.year - b.year || a.code.localeCompare(b.code))
      .map((c) => {
        const off = normalizeTermsOffered(c.semester, c.termsOffered);
        return [
          p.name, p.degreeType, c.code, c.title, c.units,
          /^ELEC\s/i.test(c.code) ? "Elective" : c.optional ? "Core (optional)" : "Core",
          `Y${c.year} ${c.semester}`,
          ...TERMS.map((t) => (off.includes(t) ? "X" : "")),
          off.length === 1 ? "Once a year" : `${off.length} terms`,
        ];
      }),
  );
}

/** Build and download a branded rotation workbook for the given programs. */
export async function downloadRotationXlsx(programs: Program[], school: string): Promise<void> {
  const XLSX = await import("xlsx-js-style");
  const generatedAt = new Date().toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" });
  const border = { style: "thin", color: { rgb: "D9D2C3" } };
  const borders = { top: border, bottom: border, left: border, right: border };

  const sheet = (title: string, sub: string, head: string[], rows: Cell[][], termStart: number, widths: number[]) => {
    const aoa: Cell[][] = [[title], [sub], [`Generated on ${generatedAt}`], [], head, ...rows];
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    ws["!cols"] = widths.map((wch) => ({ wch }));
    ws["!merges"] = [0, 1, 2].map((r) => ({ s: { r, c: 0 }, e: { r, c: head.length - 1 } }));
    ws["!freeze"] = { xSplit: 0, ySplit: 5 };
    ws["!views"] = [{ state: "frozen", ySplit: 5 }];
    ws["!autofilter"] = { ref: XLSX.utils.encode_range({ s: { r: 4, c: 0 }, e: { r: 4 + rows.length, c: head.length - 1 } }) };
    const set = (r: number, c: number, s: object) => {
      const ref = XLSX.utils.encode_cell({ r, c });
      if (!ws[ref]) ws[ref] = { t: "s", v: "" };
      ws[ref].s = s;
    };
    set(0, 0, { font: { name: "Arial", bold: true, sz: 16, color: { rgb: BURGUNDY } } });
    set(1, 0, { font: { name: "Arial", sz: 9, color: { rgb: "6B6157" } } });
    set(2, 0, { font: { name: "Arial", bold: true, sz: 10, color: { rgb: CLARET } } });
    head.forEach((_, c) => set(4, c, {
      font: { name: "Arial", bold: true, sz: 10, color: { rgb: "FFFFFF" } },
      fill: { patternType: "solid", fgColor: { rgb: CLARET } },
      alignment: { vertical: "center", horizontal: c >= termStart && c < termStart + 4 ? "center" : "left" },
      border: borders,
    }));
    rows.forEach((row, i) => row.forEach((v, c) => {
      const isTerm = c >= termStart && c < termStart + 4;
      const fill = isTerm && v === "X" ? GOLD_FILL : i % 2 ? ALT_FILL : "FFFFFF";
      set(5 + i, c, {
        font: { name: "Arial", sz: 9, bold: c === (termStart === 3 ? 0 : 2) || (isTerm && v === "X"), color: { rgb: isTerm ? BURGUNDY : "2B2420" } },
        fill: { patternType: "solid", fgColor: { rgb: fill } },
        alignment: { vertical: "center", wrapText: true, horizontal: isTerm ? "center" : "left" },
        border: borders,
      });
    }));
    return ws;
  };

  const sorted = [...programs].sort((a, b) => a.name.localeCompare(b.name));
  const grid = gridRows(sorted);
  const byProgram = programRows(sorted);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, sheet(
    `${school} — Course Rotation`,
    `Department term grid: ${grid.length} unique required/elective courses across ${sorted.length} programs (GE excluded). X = offered that term.`,
    ["Course", "Title", "Units", ...TERMS, "Frequency", "Program(s)"], grid, 3,
    [16, 40, 8, 8, 8, 8, 8, 11, 50],
  ), "Term Grid");
  XLSX.utils.book_append_sheet(wb, sheet(
    `${school} — By Program`,
    `Each program's required and elective courses (GE excluded). X = offered that term. Use the filter arrows to view one program.`,
    ["Program", "Degree", "Course", "Title", "Units", "Type", "Mapped", ...TERMS, "Frequency"], byProgram, 7,
    [34, 24, 16, 40, 7, 15, 13, 8, 8, 8, 8, 12],
  ), "By Program");
  XLSX.writeFile(wb, `rotation-${school.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.xlsx`);
}
