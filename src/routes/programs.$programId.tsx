import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { fetchProgramBySlug } from "@/lib/api";
import { groupByTerm, type Course } from "@/lib/program";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { CourseCard } from "@/components/CourseCard";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Printer, Download, GraduationCap, Award, Filter, ChevronDown, ChevronUp } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const TERM_ORDER: Record<string, number> = { Summer: 0, Fall: 1, Winter: 2, Spring: 3 };

function getGeChoice(programId: string, code: string): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(`ge-choice:${programId}:${code}`);
}

// Normalize satisfies tags so minor variants (e.g. "UCR TAG Requirement" vs
// "UCR TAG Requirements") collapse into a single filter option.
function normalizeTag(raw: string): string {
  return raw
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\bUC\s*TAG\b/gi, "UCR TAG")
    .replace(/\bUCR\s*Tag\b/g, "UCR TAG")
    .replace(/Requirements?$/i, "Requirements")
    .replace(/UC Pathways\s*\+?/i, "UC Pathways+")
    .replace(/A\.S\.?\s*Pre-?Engineering/i, "A.S. Pre-Engineering");
}

function courseTags(c: Course): string[] {
  return (c.satisfies ?? [])
    .map(normalizeTag)
    // Filter out long descriptive strings and prerequisite notes that aren't requirement tags
    .filter((t) => t.length > 0 && t.length <= 60 && !/prerequisite/i.test(t));
}

export const Route = createFileRoute("/programs/$programId")({
  component: ProgramPage,
  head: () => ({
    meta: [{ title: "Program — Norco College Engineering" }],
  }),
});

const TERM_STYLE: Record<string, { bg: string; ring: string; text: string }> = {
  Fall: { bg: "bg-[color:var(--term-fall)]/8", ring: "ring-[color:var(--term-fall)]/30", text: "text-[color:var(--term-fall)]" },
  Winter: { bg: "bg-[color:var(--term-winter)]/8", ring: "ring-[color:var(--term-winter)]/30", text: "text-[color:var(--term-winter)]" },
  Spring: { bg: "bg-[color:var(--term-spring)]/8", ring: "ring-[color:var(--term-spring)]/30", text: "text-[color:var(--term-spring)]" },
  Summer: { bg: "bg-[color:var(--term-summer)]/8", ring: "ring-[color:var(--term-summer)]/30", text: "text-[color:var(--term-summer)]" },
};

function ProgramPage() {
  const { programId } = Route.useParams();
  const { data: program, isLoading, error } = useQuery({
    queryKey: ["program", programId],
    queryFn: () => fetchProgramBySlug(programId),
  });

  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const c of program?.courses ?? []) for (const t of courseTags(c)) set.add(t);
    return Array.from(set).sort();
  }, [program]);

  const [activeTags, setActiveTags] = useState<Set<string> | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [pdfOpen, setPdfOpen] = useState(false);
  const [pdfTitle, setPdfTitle] = useState("");
  const [pdfIncludeSummary, setPdfIncludeSummary] = useState(true);
  const [pdfShowSatisfies, setPdfShowSatisfies] = useState(true);
  const [pdfShowTerms, setPdfShowTerms] = useState(true);
  const [pdfShowGe, setPdfShowGe] = useState(true);
  const effectiveActive = activeTags ?? new Set(allTags);

  const visibleCourses = useMemo(() => {
    if (!program) return [];
    return program.courses.filter((c) => {
      const tags = courseTags(c);
      if (tags.length === 0) return true; // courses with no tags always shown
      return tags.some((t) => effectiveActive.has(t));
    });
  }, [program, effectiveActive]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="mx-auto flex-1 px-6 py-16 text-muted-foreground">Loading…</main>
        <SiteFooter />
      </div>
    );
  }
  if (error || !program) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="font-serif text-3xl text-foreground">Program not found</h1>
          <Link to="/" className="mt-4 inline-block text-primary hover:underline">
            ← Back to programs
          </Link>
        </div>
      </div>
    );
  }
  const terms = groupByTerm(visibleCourses);
  const years = Array.from(new Set(terms.map((t) => t.year))).sort();

  function downloadPdf() {
    if (!program) return;
    const doc = new jsPDF({ unit: "pt", format: "letter" });
    const margin = 40;
    let y = margin;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(program.name, margin, y);
    y += 20;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(90);
    doc.text(`${program.degreeType} · ${program.cluster}`, margin, y);
    y += 14;
    doc.text(`Total units: ${program.totalUnits} · Courses shown: ${visibleCourses.length}`, margin, y);
    y += 18;

    const active = activeTags ?? new Set(allTags);
    if (allTags.length > 0) {
      doc.setFontSize(10);
      doc.setTextColor(60);
      const filterLabel =
        active.size === allTags.length
          ? "Filters: All requirements"
          : `Filters: ${Array.from(active).join(", ") || "None"}`;
      const lines = doc.splitTextToSize(filterLabel, 540 - margin);
      doc.text(lines, margin, y);
      y += lines.length * 12 + 6;
    }

    const visibleTerms = groupByTerm(visibleCourses);
    const visibleYears = Array.from(new Set(visibleTerms.map((t) => t.year))).sort();

    for (const yr of visibleYears) {
      const yrTerms = visibleTerms.filter((t) => t.year === yr);
      const yrUnits = yrTerms.reduce((s, t) => s + t.courses.reduce((a, c) => a + c.units, 0), 0);
      if (y > 720) { doc.addPage(); y = margin; }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(20);
      doc.text(`Year ${yr}  (${yrUnits} units)`, margin, y);
      y += 6;

      const sortedTerms = [...yrTerms].sort(
        (a, b) => (TERM_ORDER[a.semester] ?? 9) - (TERM_ORDER[b.semester] ?? 9),
      );
      for (const t of sortedTerms) {
        const rows = t.courses.map((c) => {
          const choice = getGeChoice(programId, c.code);
          const title = choice ? `${c.title}  →  ${choice}` : c.title;
          return [c.code, title, String(c.units), c.satisfies.join("; ")];
        });
        autoTable(doc, {
          startY: y + 8,
          head: [[`${t.semester} ${t.year}`, "Title", "Units", "Satisfies"]],
          body: rows,
          theme: "grid",
          styles: { fontSize: 9, cellPadding: 4, overflow: "linebreak" },
          headStyles: { fillColor: [124, 30, 48], textColor: 255 },
          columnStyles: {
            0: { cellWidth: 70, fontStyle: "bold" },
            1: { cellWidth: 240 },
            2: { cellWidth: 40, halign: "center" },
            3: { cellWidth: 180 },
          },
          margin: { left: margin, right: margin },
        });
        // @ts-expect-error lastAutoTable is attached by plugin
        y = doc.lastAutoTable.finalY + 10;
        if (y > 720) { doc.addPage(); y = margin; }
      }
      y += 6;
    }

    doc.save(`${program.id}-pathway.pdf`);
  }


  function toggleTag(tag: string) {
    setActiveTags((prev) => {
      const base = new Set(prev ?? allTags);
      if (base.has(tag)) base.delete(tag);
      else base.add(tag);
      return base;
    });
  }


  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="border-b border-border bg-paper">
          <div className="mx-auto max-w-6xl px-6 py-10">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              <ArrowLeft className="h-4 w-4" /> All programs
            </Link>
            <div className="mt-4 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="max-w-2xl">
                <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  {program.cluster}
                </p>
                <h1 className="mt-2 font-serif text-4xl font-semibold leading-tight text-foreground text-balance">
                  {program.name}
                </h1>
                <p className="mt-2 text-base text-muted-foreground">{program.degreeType}</p>
                <p className="mt-4 text-base leading-relaxed text-foreground/80">
                  {program.description}
                </p>
              </div>

              <aside className="rounded-lg border border-border bg-card p-5 shadow-sm md:min-w-[260px]">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <GraduationCap className="h-4 w-4 text-primary" />
                  Program at a glance
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-xs text-muted-foreground">Total units</dt>
                    <dd className="font-serif text-2xl text-primary">{program.totalUnits}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Courses</dt>
                    <dd className="font-serif text-2xl text-primary">{program.courses.length}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Years</dt>
                    <dd className="font-serif text-2xl text-primary">{years.length}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Terms</dt>
                    <dd className="font-serif text-2xl text-primary">{terms.length}</dd>
                  </div>
                </dl>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="mt-5 inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-primary bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-burgundy"
                >
                  <Printer className="h-4 w-4" /> Print pathway
                </button>
                <button
                  type="button"
                  onClick={downloadPdf}
                  className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-primary bg-card px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
                >
                  <Download className="h-4 w-4" /> Download PDF
                </button>
              </aside>
            </div>

            {program.outcomes.length > 0 && (
              <div className="mt-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Outcomes
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {program.outcomes.map((o: string, i: number) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 rounded-full border border-accent/50 bg-accent/15 px-3 py-1 text-sm text-accent-foreground"
                    >
                      <Award className="h-3.5 w-3.5" /> {o}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-10">
          {allTags.length > 0 && (
            <div className="mb-6 rounded-lg border border-border bg-card shadow-sm">
              <button
                type="button"
                onClick={() => setFilterOpen((o) => !o)}
                className="flex w-full items-center justify-between gap-2 px-4 py-3 text-sm font-semibold text-foreground"
              >
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-primary" />
                  Filter courses by requirement
                  <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs font-normal text-muted-foreground">
                    {effectiveActive.size} / {allTags.length}
                  </span>
                </div>
                {filterOpen ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </button>
              {filterOpen && (
                <div className="border-t border-border px-4 pb-4 pt-3">
                  <div className="flex flex-wrap gap-x-5 gap-y-2">
                    {allTags.map((tag) => {
                      const checked = effectiveActive.has(tag);
                      return (
                        <label
                          key={tag}
                          className="flex cursor-pointer items-center gap-2 text-sm text-foreground/85"
                        >
                          <Checkbox
                            checked={checked}
                            onCheckedChange={() => toggleTag(tag)}
                          />
                          {tag}
                        </label>
                      );
                    })}
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      Showing {visibleCourses.length} of {program.courses.length} courses. Core courses with no requirement tag are always shown.
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveTags(null)}
                      className="text-xs font-medium text-primary hover:underline"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {years.map((year) => {
            const yearTerms = terms.filter((t) => t.year === year);
            const yearUnits = yearTerms.reduce(
              (sum, t) => sum + t.courses.reduce((s, c) => s + c.units, 0),
              0,
            );
            return (
              <div key={year} className="mb-10">
                <div className="mb-4 flex items-baseline justify-between border-b border-border pb-2">
                  <h2 className="font-serif text-2xl font-semibold text-foreground">
                    Year {year}
                  </h2>
                  <span className="font-mono text-xs text-muted-foreground">
                    {yearUnits} units · {yearTerms.length} terms
                  </span>
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {yearTerms.map((t) => {
                    const style = TERM_STYLE[t.semester] ?? TERM_STYLE.Fall;
                    const termUnits = t.courses.reduce((s, c) => s + c.units, 0);
                    return (
                      <div
                        key={`${t.year}-${t.semester}`}
                        className={`rounded-lg border border-border bg-card p-3 shadow-sm ring-1 ring-inset ${style.ring}`}
                      >
                        <div className={`mb-3 flex items-center justify-between rounded-md px-2 py-1.5 ${style.bg}`}>
                          <h3 className={`font-serif text-base font-semibold ${style.text}`}>
                            {t.semester}
                          </h3>
                          <span className="font-mono text-[10px] font-semibold text-muted-foreground">
                            {termUnits} units
                          </span>
                        </div>
                        <div className="space-y-2">
                          {t.courses.map((c) => (
                            <CourseCard key={c.code} course={c} programId={programId} />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <div className="mt-8 rounded-lg border border-border bg-card p-5 text-sm">
            <p className="font-semibold text-foreground">Legend</p>
            <div className="mt-3 flex flex-wrap gap-4 text-foreground/75">
              <span className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-sm bg-primary" /> Core engineering course
              </span>
              <span className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-sm bg-accent" /> General Education (GE)
              </span>
              <span className="flex items-center gap-2">
                <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
                  Prereq
                </span>
                Course has a prerequisite
              </span>
              <span className="text-muted-foreground">Click any course for details.</span>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
