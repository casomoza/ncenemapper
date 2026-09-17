import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Course, Program } from "@/lib/program";

const CLARET: [number, number, number] = [137, 23, 40];
const BURGUNDY: [number, number, number] = [78, 7, 21];
const GOLD: [number, number, number] = [224, 186, 113];
const INK: [number, number, number] = [36, 30, 28];
const MUTED: [number, number, number] = [102, 90, 82];
const TERM_ORDER = ["Summer", "Fall", "Winter", "Spring"];

type PdfOptions = {
  title: string;
  includeSummary: boolean;
  showSatisfies: boolean;
  showTerms: boolean;
  showCheckboxes: boolean;
  counselorNotice: string;
  activeFilters: string;
  logoDataUrl?: string;
  selectedCourse: (course: Course) => { code: string; title: string };
};

type PdfProgram = Pick<Program, "id" | "name" | "degreeType" | "cluster" | "description" | "totalUnits">;

function categoryLabel(course: Course): string {
  if (/^ELEC\s/i.test(course.code)) return "Elective";
  return course.category === "core" ? "Core" : "GE";
}

function courseLabels(course: Course): string[] {
  const labels = [categoryLabel(course)];
  if (course.dualEnrollment) labels.push("Dual Enroll");
  const offered = Array.from(new Set([course.semester, ...(course.termsOffered ?? [])]));
  if (offered.length > 1) labels.push(`Flexible: ${offered.join(", ")}`);
  if (course.optional) labels.push("Optional");
  return labels;
}

export function createPathwayPdf(
  program: PdfProgram,
  courses: Course[],
  options: PdfOptions,
): jsPDF {
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "letter" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 34;
  const contentWidth = pageWidth - margin * 2;

  const addBrand = () => {
    doc.setFillColor(...CLARET);
    doc.rect(0, 0, pageWidth, 7, "F");
  };

  addBrand();
  if (options.logoDataUrl) {
    doc.addImage(options.logoDataUrl, "PNG", margin, 20, 112, 40, undefined, "FAST");
  } else {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(...CLARET);
    doc.text("NORCO COLLEGE", margin, 43);
  }

  const titleX = options.logoDataUrl ? 160 : margin;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.setTextColor(...BURGUNDY);
  doc.text(doc.splitTextToSize(options.title || program.name, pageWidth - titleX - margin), titleX, 31);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...MUTED);
  doc.text(`${program.degreeType}  |  ${program.cluster}`, titleX, 53, { maxWidth: pageWidth - titleX - margin });

  const includedUnits = courses.reduce((sum, course) => sum + course.units, 0);
  let y = 76;
  doc.setFillColor(250, 244, 218);
  doc.setDrawColor(...GOLD);
  doc.roundedRect(margin, y, contentWidth, 34, 3, 3, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...BURGUNDY);
  doc.text(`${includedUnits} units shown  |  ${courses.length} courses  |  Program total: ${program.totalUnits} units`, margin + 10, y + 13);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...INK);
  doc.text(doc.splitTextToSize(options.counselorNotice, contentWidth - 20), margin + 10, y + 25);
  y += 44;

  if (options.includeSummary) {
    const summary = [
      program.description,
      `Requirements shown: ${options.activeFilters}`,
      "This PDF reflects the selected requirements, course choices, and personal term arrangement shown on the map.",
    ].filter(Boolean).join("  ");
    doc.setFontSize(7.5);
    doc.setTextColor(...MUTED);
    const lines = doc.splitTextToSize(summary, contentWidth);
    doc.text(lines.slice(0, 4), margin, y);
    y += Math.min(lines.length, 4) * 9 + 8;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(...BURGUNDY);
  doc.text("Course pathway", margin, y);
  y += 6;

  const years = Array.from(new Set(courses.map((course) => course.year))).sort((a, b) => a - b);
  const mapFontSize = courses.length > 34 ? 6 : courses.length > 24 ? 6.5 : 7;
  const mapRows = years.map((year) => {
    const yearCourses = courses.filter((course) => course.year === year);
    const yearUnits = yearCourses.reduce((sum, course) => sum + course.units, 0);
    const termCells = TERM_ORDER.map((term) => {
      const termCourses = yearCourses.filter((course) => course.semester === term);
      if (termCourses.length === 0) return "—";
      const termUnits = termCourses.reduce((sum, course) => sum + course.units, 0);
      return [
        `${termUnits} units`,
        ...termCourses.map((course) => {
          const selected = options.selectedCourse(course);
          const prerequisite = course.prerequisite ? `\nPrereq: ${course.prerequisite}` : "";
          return `${selected.code} · ${selected.title} (${course.units})\n${courseLabels(course).join(" | ")}${prerequisite}`;
        }),
      ].join("\n\n");
    });
    return [`Year ${year}\n${yearUnits} units`, ...termCells];
  });

  autoTable(doc, {
    startY: y,
    head: [["Year", ...TERM_ORDER]],
    body: mapRows,
    theme: "grid",
    margin: { left: margin, right: margin, bottom: 30 },
    styles: { font: "helvetica", fontSize: mapFontSize, cellPadding: 3, textColor: INK, valign: "top", overflow: "linebreak" },
    headStyles: { fillColor: CLARET, textColor: [255, 255, 255], fontStyle: "bold", halign: "center" },
    columnStyles: { 0: { cellWidth: 48, fontStyle: "bold", fillColor: [250, 244, 218] } },
    rowPageBreak: "avoid",
    didDrawPage: addBrand,
  });

  doc.addPage();
  addBrand();
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...BURGUNDY);
  doc.text("Course details", margin, 28);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...MUTED);
  doc.text("Plain-text labels replace interactive map controls in this print version.", margin, 40);

  const detailHead = [
    ...(options.showCheckboxes ? ["Done"] : []),
    ...(options.showTerms ? ["Year / Term"] : ["Year"]),
    "Course",
    "Title",
    "Units",
    "Print notes",
    ...(options.showSatisfies ? ["Satisfies"] : []),
  ];
  const sortedCourses = [...courses].sort((a, b) =>
    a.year - b.year || TERM_ORDER.indexOf(a.semester) - TERM_ORDER.indexOf(b.semester),
  );
  const detailRows = sortedCourses.map((course) => {
    const selected = options.selectedCourse(course);
    const notes = [...courseLabels(course), ...(course.prerequisite ? [`Prereq: ${course.prerequisite}`] : [])].join("; ");
    return [
      ...(options.showCheckboxes ? ["[  ]"] : []),
      options.showTerms ? `Y${course.year} · ${course.semester}` : `Year ${course.year}`,
      selected.code,
      selected.title,
      String(course.units),
      notes,
      ...(options.showSatisfies ? [(course.satisfies ?? []).join("; ")] : []),
    ];
  });
  const compact = courses.length > 36;
  autoTable(doc, {
    startY: 48,
    head: [detailHead],
    body: detailRows,
    theme: "grid",
    margin: { left: margin, right: margin, bottom: 30 },
    styles: { font: "helvetica", fontSize: compact ? 5.7 : 6.5, cellPadding: compact ? 1.6 : 2.1, overflow: "linebreak", textColor: INK, valign: "middle" },
    headStyles: { fillColor: CLARET, textColor: [255, 255, 255], fontStyle: "bold" },
    alternateRowStyles: { fillColor: [250, 248, 243] },
    columnStyles: options.showCheckboxes ? { 0: { cellWidth: 24, halign: "center" }, 1: { cellWidth: 52 }, 2: { cellWidth: 60 }, 4: { cellWidth: 28, halign: "center" } } : { 0: { cellWidth: 52 }, 1: { cellWidth: 60 }, 3: { cellWidth: 28, halign: "center" } },
    rowPageBreak: "avoid",
    didDrawPage: addBrand,
  });

  const pageCount = doc.getNumberOfPages();
  for (let page = 1; page <= pageCount; page += 1) {
    doc.setPage(page);
    doc.setDrawColor(220, 210, 195);
    doc.line(margin, 588, pageWidth - margin, 588);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6.5);
    doc.setTextColor(...MUTED);
    doc.text("Norco College Program Pathways · Information is advisory; confirm requirements with a counselor.", margin, 600);
    doc.text(`Page ${page} of ${pageCount}`, pageWidth - margin, 600, { align: "right" });
  }

  return doc;
}