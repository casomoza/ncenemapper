import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Course, Program } from "@/lib/program";
import { findElectiveGroup } from "@/lib/program";
import { normalizeTermsOffered } from "@/lib/api";
import { BRAND, loadNorcoLogo, addNorcoLogo } from "@/lib/pathway-pdf";

const TERMS = ["Fall", "Winter", "Spring", "Summer"] as const;

/** Major/certificate-required courses and electives only — General Education excluded. */
export function rotationCourses(courses: Course[]): Course[] {
  return courses.filter((c) => {
    if (/^(CalGETC\s|RCCD GE)/i.test(c.code)) return false;
    if (/^ELEC\s/i.test(c.code)) return true;
    return c.category !== "ge";
  });
}

function typeLabel(c: Course): string {
  if (/^ELEC\s/i.test(c.code)) return "Elective";
  return c.optional ? "Core (optional)" : "Core";
}

export type MasterCourse = {
  code: string;
  title: string;
  units: string;
  terms: string[];
  programs: string[];
};

export type RotationRow = { code: string; title: string; units: string; type: string; mapped: string; terms: string[] };

/** "N terms" / "Once a year" label for a per-program rotation row. */
export function frequencyLabel(terms: string[]): string {
  if (terms.length === 0) return "Not set";
  return terms.length === 1 ? "Once a year" : `${terms.length} terms`;
}

/**
 * Per-program rotation rows. Elective placeholders stay as ONE summarized slot
 * ("Choose 9 units from: ADJ-8, ADJ-12, …") whose terms are the union of the
 * options' real terms — never the placeholder's own blanket terms.
 */
export function programRotationRows(program: Program): RotationRow[] {
  return rotationCourses(program.courses)
    .sort((a, b) => a.year - b.year || a.code.localeCompare(b.code))
    .map((c) => {
      const group = findElectiveGroup(program, c.code);
      const base = { code: c.code.replace(/^ELEC\s+/i, "ELEC "), units: String(c.units), type: typeLabel(c), mapped: `Y${c.year} ${c.semester}` };
      if (group) {
        const set = new Set(group.options.flatMap((o) => o.terms));
        const lead = group.unitsNote ? `${group.unitsNote} from` : "Choose from";
        return { ...base, title: `${group.title || "Elective"} — ${lead}: ${group.options.map((o) => o.code).join(", ")}`, terms: TERMS.filter((t) => set.has(t)) };
      }
      return { ...base, title: c.title, terms: normalizeTermsOffered(c.semester, c.termsOffered) };
    });
}

/**
 * Deduplicate rotation courses across programs by course code (case-insensitive).
 * Elective placeholders are expanded into their individual qualifying courses with
 * their own term availability; a placeholder with no defined group is kept as-is.
 */
export function buildMasterList(programs: Program[]): MasterCourse[] {
  const map = new Map<string, { code: string; title: string; units: Set<string>; terms: Set<string>; programs: Set<string> }>();
  const add = (rawCode: string, title: string, units: string | null, terms: string[], programName: string) => {
    const code = rawCode.trim().replace(/\s+/g, " ");
    const key = code.toUpperCase();
    let e = map.get(key);
    if (!e) {
      e = { code, title, units: new Set(), terms: new Set(), programs: new Set() };
      map.set(key, e);
    }
    if (!e.title && title) e.title = title;
    if (units !== null) e.units.add(units);
    for (const term of terms) e.terms.add(term);
    e.programs.add(programName);
  };
  for (const p of programs) {
    for (const c of rotationCourses(p.courses)) {
      const group = findElectiveGroup(p, c.code);
      if (group) {
        for (const o of group.options) add(o.code, o.title, null, o.terms, p.name);
      } else {
        add(c.code, c.title, String(c.units), normalizeTermsOffered(c.semester, c.termsOffered), p.name);
      }
    }
  }
  return [...map.values()]
    .map((e) => ({
      code: e.code,
      title: e.title,
      units: e.units.size ? [...e.units].join(" / ") : "—",
      terms: TERMS.filter((t) => e.terms.has(t)),
      programs: [...e.programs].sort((a, b) => a.localeCompare(b)),
    }))
    .sort((a, b) => a.code.localeCompare(b.code));
}

/** Shared term order for the department's at-a-glance grid. */
export function masterTermMarks(course: MasterCourse): string[] {
  return TERMS.map((term) => course.terms.includes(term) ? "X" : "");
}

/** Build a branded rotation report covering one or more programs. */
export async function createRotationPdf(
  programs: Program[],
  reportTitle: string,
  options: { includeMasterList?: boolean } = {},
): Promise<jsPDF> {
  const generatedAt = new Date().toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" });
  const logo = await loadNorcoLogo();
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "letter" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 34;
  const brandBar = () => {
    doc.setFillColor(...BRAND.CLARET);
    doc.rect(0, 0, pageWidth, 7, "F");
  };

  // Cover header
  brandBar();
  if (logo) addNorcoLogo(doc, logo, margin, 20, 112, 40);
  const titleX = logo ? 160 : margin;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.setTextColor(...BRAND.BURGUNDY);
  doc.text(reportTitle, titleX, 34, { maxWidth: pageWidth - titleX - margin });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...BRAND.MUTED);
  doc.text(
    `Course rotation report  |  Staff planning reference  |  Generated on ${generatedAt}`,
    titleX,
    52,
  );
  doc.setFontSize(7.5);
  doc.text(
    "Shows the terms each required and elective course is expected to be offered. General Education courses are excluded. \"X\" = offered that term.",
    margin,
    76,
    { maxWidth: pageWidth - margin * 2 },
  );

  let y = 92;
  const sorted = [...programs].sort((a, b) => a.name.localeCompare(b.name));
  sorted.forEach((program, idx) => {
    const courses = programRotationRows(program);
    if (idx > 0) {
      y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 26;
      if (y > pageHeight - 120) {
        doc.addPage();
        brandBar();
        y = 32;
      }
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...BRAND.BURGUNDY);
    doc.text(program.name, margin, y);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...BRAND.MUTED);
    const singleTerm = courses.filter((c) => c.terms.length === 1).length;
    doc.text(
      `${program.degreeType}  |  ${program.cluster}  |  ${courses.length} courses listed  |  ${singleTerm} offered in only one term`,
      margin,
      y + 12,
    );

    const body = courses.length
      ? courses.map((c) => [c.code, c.title, c.units, c.type, c.mapped, ...TERMS.map((t) => (c.terms.includes(t) ? "X" : "")), frequencyLabel(c.terms)])
      : [["—", "No required or elective courses on file", "", "", "", "", "", "", "", ""]];

    autoTable(doc, {
      startY: y + 18,
      head: [["Course", "Title", "Units", "Type", "Mapped", ...TERMS, "Frequency"]],
      body,
      theme: "grid",
      margin: { left: margin, right: margin, bottom: 30, top: 24 },
      styles: { font: "helvetica", fontSize: 7.5, cellPadding: 3, textColor: BRAND.INK, valign: "middle" },
      headStyles: { fillColor: BRAND.CLARET, textColor: [255, 255, 255], fontStyle: "bold" },
      alternateRowStyles: { fillColor: [250, 248, 243] },
      columnStyles: {
        0: { cellWidth: 78, fontStyle: "bold" },
        2: { cellWidth: 34, halign: "center" },
        3: { cellWidth: 70 },
        4: { cellWidth: 62 },
        5: { cellWidth: 42, halign: "center", fontStyle: "bold" },
        6: { cellWidth: 42, halign: "center", fontStyle: "bold" },
        7: { cellWidth: 42, halign: "center", fontStyle: "bold" },
        8: { cellWidth: 42, halign: "center", fontStyle: "bold" },
        9: { cellWidth: 62 },
      },
      didParseCell: (data) => {
        if (data.section === "body" && data.column.index >= 5 && data.column.index <= 8 && data.cell.raw === "X") {
          data.cell.styles.fillColor = [250, 244, 218];
          data.cell.styles.textColor = BRAND.BURGUNDY;
        }
      },
      rowPageBreak: "avoid",
      didDrawPage: brandBar,
    });
  });

  if (options.includeMasterList) {
    const master = buildMasterList(sorted);
    const sectionHeader = (title: string, sub: string) => {
      doc.addPage();
      brandBar();
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(...BRAND.BURGUNDY);
      doc.text(title, margin, 34);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...BRAND.MUTED);
      doc.text(sub, margin, 48, { maxWidth: pageWidth - margin * 2 });
    };
    const tableBase = {
      theme: "grid" as const,
      margin: { left: margin, right: margin, bottom: 30, top: 24 },
      styles: { font: "helvetica", fontSize: 7.5, cellPadding: 3, textColor: BRAND.INK, valign: "middle" as const },
      headStyles: { fillColor: BRAND.CLARET, textColor: [255, 255, 255] as [number, number, number], fontStyle: "bold" as const },
      alternateRowStyles: { fillColor: [250, 248, 243] as [number, number, number] },
      rowPageBreak: "avoid" as const,
      didDrawPage: brandBar,
    };
    sectionHeader(
      "Department master list — term grid",
      `${master.length} unique required/elective courses across ${sorted.length} programs (GE excluded). X = offered that term; terms combine offerings across programs.`,
    );
    autoTable(doc, {
      ...tableBase,
      startY: 60,
      head: [["Course", "Title", "Units", ...TERMS, "Frequency", "Program(s)"]],
      body: master.map((course) => [course.code, course.title, course.units, ...masterTermMarks(course), course.terms.length ? `${course.terms.length}x/year` : "Not set", course.programs.join("\n")]),
      columnStyles: {
        0: { cellWidth: 78, fontStyle: "bold" },
        2: { cellWidth: 32, halign: "center" },
        3: { cellWidth: 36, halign: "center", fontStyle: "bold" },
        4: { cellWidth: 36, halign: "center", fontStyle: "bold" },
        5: { cellWidth: 36, halign: "center", fontStyle: "bold" },
        6: { cellWidth: 36, halign: "center", fontStyle: "bold" },
        7: { cellWidth: 48, halign: "center" },
        8: { cellWidth: 210 },
      },
      didParseCell: (data) => {
        if (data.section === "body" && data.column.index >= 3 && data.column.index <= 6 && data.cell.raw === "X") {
          data.cell.styles.fillColor = [250, 244, 218];
          data.cell.styles.textColor = BRAND.BURGUNDY;
        }
      },
    });

  }

  const pageCount = doc.getNumberOfPages();
  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(...BRAND.MUTED);
    doc.text(`Norco College Program Pathways · Course rotation · Generated on ${generatedAt} · Schedules subject to change.`, margin, pageHeight - 12);
    doc.text(`Page ${page} of ${pageCount}`, pageWidth - margin, pageHeight - 12, { align: "right" });
  }
  return doc;
}
