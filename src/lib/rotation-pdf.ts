import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Course, Program } from "@/lib/program";
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

/** Build a branded rotation report covering one or more programs. */
export async function createRotationPdf(programs: Program[], reportTitle: string): Promise<jsPDF> {
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
    `Course rotation report  |  Staff planning reference  |  Generated ${new Date().toLocaleDateString()}`,
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
    const courses = rotationCourses(program.courses).sort(
      (a, b) => a.year - b.year || a.code.localeCompare(b.code),
    );
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
    const singleTerm = courses.filter((c) => normalizeTermsOffered(c.semester, c.termsOffered).length === 1).length;
    doc.text(
      `${program.degreeType}  |  ${program.cluster}  |  ${courses.length} courses listed  |  ${singleTerm} offered in only one term`,
      margin,
      y + 12,
    );

    const body = courses.length
      ? courses.map((c) => {
          const offered = normalizeTermsOffered(c.semester, c.termsOffered);
          return [
            c.code.replace(/^ELEC\s+/i, "ELEC "),
            c.title,
            String(c.units),
            typeLabel(c),
            `Y${c.year} ${c.semester}`,
            ...TERMS.map((t) => (offered.includes(t) ? "X" : "")),
            offered.length === 1 ? "Once a year" : `${offered.length} terms`,
          ];
        })
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

  const pageCount = doc.getNumberOfPages();
  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(...BRAND.MUTED);
    doc.text("Norco College Program Pathways · Course rotation (staff reference) · Schedules subject to change.", margin, pageHeight - 12);
    doc.text(`Page ${page} of ${pageCount}`, pageWidth - margin, pageHeight - 12, { align: "right" });
  }
  return doc;
}
