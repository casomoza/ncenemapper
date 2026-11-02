import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchPrograms } from "@/lib/api";
import { NORCO_SCHOOLS, normalizeCluster } from "@/lib/schools";
import { buildMasterList, frequencyLabel, masterTermMarks, programRotationRows } from "@/lib/rotation-pdf";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { ChevronDown, Download, FileSpreadsheet, Search } from "lucide-react";

const TERMS = ["Fall", "Winter", "Spring", "Summer"] as const;

export const Route = createFileRoute("/counselor")({
  validateSearch: (s: Record<string, unknown>) => ({ school: typeof s.school === "string" ? s.school : undefined }),
  component: CounselorPage,
  head: () => ({
    meta: [
      { title: "Counselor Course Rotation — Norco College Pathways" },
      { name: "description", content: "Live term-by-term course rotation for every Norco College school and program, for counselors." },
      { property: "og:title", content: "Counselor Course Rotation — Norco College Pathways" },
      { property: "og:description", content: "Live term-by-term course rotation for every Norco College school and program, for counselors." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function CounselorPage() {
  const { school } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [busy, setBusy] = useState(false);
  // Always live: never serve cached data — refetch every time the page mounts or regains focus.
  const { data: all = [], isLoading, error, dataUpdatedAt } = useQuery({
    queryKey: ["counselor-programs"],
    queryFn: fetchPrograms,
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: "always",
  });
  const programs = useMemo(() => all.filter((p) => p.isPublic !== false), [all]);
  const schools = useMemo(() => {
    const keys = new Set(programs.map((p) => normalizeCluster(p.cluster)));
    return [...NORCO_SCHOOLS.filter((s) => keys.has(s)), ...[...keys].filter((k) => !(NORCO_SCHOOLS as readonly string[]).includes(k)).sort()];
  }, [programs]);
  const selected = useMemo(
    () => programs.filter((p) => normalizeCluster(p.cluster) === school).sort((a, b) => a.name.localeCompare(b.name)),
    [programs, school],
  );
  const master = useMemo(() => buildMasterList(selected), [selected]);
  // Sections start collapsed; counselors expand only what they need.
  const [gridOpen, setGridOpen] = useState(false);
  const [openPrograms, setOpenPrograms] = useState<Set<string>>(new Set());
  const [pendingScroll, setPendingScroll] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  useEffect(() => {
    if (!pendingScroll) return;
    const t = setTimeout(() => {
      document.getElementById(pendingScroll)?.scrollIntoView({ behavior: "smooth", block: "start" });
      setPendingScroll(null);
    }, 60);
    return () => clearTimeout(t);
  }, [pendingScroll, selected, openPrograms]);
  const toggleProgram = (id: string) =>
    setOpenPrograms((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  // Cross-school search over program names, course codes and course titles.
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    const out: { key: string; programId: string; school: string; program: string; course?: { code: string; title: string }; rowIdx?: number }[] = [];
    for (const p of programs) {
      const sch = normalizeCluster(p.cluster);
      if (p.name.toLowerCase().includes(q)) out.push({ key: `p-${p.id}`, programId: p.id, school: sch, program: p.name });
      programRotationRows(p).forEach((c, i) => {
        if (c.code.toLowerCase().includes(q) || c.title.toLowerCase().includes(q))
          out.push({ key: `c-${p.id}-${i}`, programId: p.id, school: sch, program: p.name, course: { code: c.code, title: c.title }, rowIdx: i });
      });
    }
    return out.slice(0, 50);
  }, [programs, query]);
  function jumpTo(r: (typeof results)[number]) {
    navigate({ search: { school: r.school } });
    setOpenPrograms((prev) => new Set(prev).add(r.programId));
    setPendingScroll(r.rowIdx != null ? `row-${r.programId}-${r.rowIdx}` : `program-${r.programId}`);
    setQuery("");
  }

  async function download() {
    if (!school || !selected.length) return;
    setBusy(true);
    try {
      const { createRotationPdf } = await import("@/lib/rotation-pdf");
      const doc = await createRotationPdf(selected, `${school} — Course Rotation`, { includeMasterList: true });
      doc.save(`rotation-${school.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.pdf`);
    } finally {
      setBusy(false);
    }
  }

  async function downloadXlsx() {
    if (!school || !selected.length) return;
    setBusy(true);
    try {
      const { downloadRotationXlsx } = await import("@/lib/rotation-xlsx");
      await downloadRotationXlsx(selected, school);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-3xl font-bold text-primary">Counselor course rotation</h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Which terms each required and elective course is offered, read live from the current catalog every time this page loads.
          General Education courses are excluded.
        </p>
        <div className="mt-6 flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1 text-sm font-medium">
            School / pathway
            <select
              aria-label="School"
              className="min-w-80 rounded-md border border-input bg-card px-3 py-2"
              value={school ?? ""}
              onChange={(e) => navigate({ search: { school: e.target.value || undefined } })}
            >
              <option value="">Select a school…</option>
              {schools.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>
          {school && selected.length > 0 && (
            <button
              onClick={download}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60"
            >
              <Download className="h-4 w-4" /> {busy ? "Generating…" : "Download current PDF"}
            </button>
          )}
          {school && selected.length > 0 && (
            <button
              onClick={downloadXlsx}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-md border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-accent disabled:opacity-60"
            >
              <FileSpreadsheet className="h-4 w-4" /> Download as Excel
            </button>
          )}
        </div>
        <div className="relative mt-4 max-w-xl">
          <label className="flex items-center gap-2 rounded-md border border-input bg-card px-3 py-2 text-sm">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              aria-label="Search all schools"
              placeholder="Search all schools by course code, title, or program…"
              className="w-full bg-transparent outline-none"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
          {query.trim().length >= 2 && (
            <ul role="listbox" className="absolute z-30 mt-1 max-h-96 w-full overflow-auto rounded-md border border-border bg-card shadow-lg">
              {results.length === 0 && <li className="px-3 py-2 text-sm text-muted-foreground">No matches</li>}
              {results.map((r) => (
                <li key={r.key}>
                  <button type="button" onClick={() => jumpTo(r)} className="w-full px-3 py-2 text-left text-sm hover:bg-accent">
                    {r.course ? (
                      <><span className="font-semibold">{r.course.code}</span> <span className="text-foreground/80">{r.course.title.length > 80 ? r.course.title.slice(0, 80) + "…" : r.course.title}</span></>
                    ) : (
                      <span className="font-semibold">{r.program}</span>
                    )}
                    <span className="block text-xs text-muted-foreground">{r.course ? `${r.program} · ` : "Program · "}{r.school}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        {dataUpdatedAt > 0 && <p className="mt-2 text-xs text-muted-foreground">Data loaded {new Date(dataUpdatedAt).toLocaleString()}</p>}
        {isLoading && <p className="mt-8 text-muted-foreground">Loading current course data…</p>}
        {error && <p role="alert" className="mt-8 text-destructive">Could not load course data. Please refresh.</p>}
        {!isLoading && !school && <p className="mt-8 text-muted-foreground">Choose a school to see its course rotation.</p>}
        {school && !isLoading && selected.length === 0 && <p className="mt-8 text-muted-foreground">No public programs in this school.</p>}

        {selected.length > 0 && (
          <>
            <section className="mt-10">
              <SectionToggle open={gridOpen} onClick={() => setGridOpen((o) => !o)} className="text-xl font-bold text-primary">School-wide term grid</SectionToggle>
              <p className="text-sm text-muted-foreground">{master.length} unique courses across {selected.length} programs. ✓ = offered that term.</p>
              {gridOpen && <RotationTable
                head={["Course", "Title", "Units", ...TERMS, "Frequency", "Program(s)"]}
                rows={master.map((m) => [m.code, m.title, m.units, ...masterTermMarks(m), m.terms.length ? `${m.terms.length}x/year` : "Not set", m.programs.join("; ")])}
                termStart={3}
              />}
            </section>
            <section className="mt-12">
              <h2 className="text-xl font-bold text-primary">By program</h2>
              {selected.map((p) => {
                const courses = programRotationRows(p);
                return (
                  <div key={p.id} id={`program-${p.id}`} className="mt-6 scroll-mt-4">
                    <SectionToggle open={openPrograms.has(p.id)} onClick={() => toggleProgram(p.id)} className="text-lg font-semibold">{p.name}</SectionToggle>
                    <p className="text-xs text-muted-foreground">
                      {p.degreeType} · {courses.length} courses ·{" "}
                      <Link to="/programs/$programId" params={{ programId: p.id }} className="underline hover:text-primary">View pathway map</Link>
                    </p>
                    {openPrograms.has(p.id) && <RotationTable
                      rowIdPrefix={`row-${p.id}`}
                      head={["Course", "Title", "Units", "Type", "Mapped", ...TERMS, "Frequency"]}
                      rows={courses.map((c) => [c.code, c.title, c.units, c.type, c.mapped, ...TERMS.map((t) => (c.terms.includes(t) ? "X" : "")), frequencyLabel(c.terms)])}
                      termStart={5}
                    />}
                  </div>
                );
              })}
            </section>
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

function SectionToggle({ open, onClick, className, children }: { open: boolean; onClick: () => void; className: string; children: React.ReactNode }) {
  return (
    <button type="button" aria-expanded={open} onClick={onClick} className={`flex items-center gap-2 text-left hover:text-primary ${className}`}>
      <ChevronDown className={`h-5 w-5 shrink-0 transition-transform ${open ? "" : "-rotate-90"}`} />
      {children}
    </button>
  );
}

// The table scrolls inside a height-capped box so its header row can stay frozen (sticky) while scrolling.
function RotationTable({ head, rows, termStart, rowIdPrefix }: { head: string[]; rows: string[][]; termStart: number; rowIdPrefix?: string }) {
  return (
    <div className="mt-3 max-h-[70vh] overflow-auto rounded-md border border-border">
      <table className="w-full text-sm">
        <thead className="sticky top-0 z-10 bg-primary text-primary-foreground">
          <tr>{head.map((h) => <th key={h} className="sticky top-0 bg-primary px-2 py-2 text-left font-semibold">{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} id={rowIdPrefix ? `${rowIdPrefix}-${i}` : undefined} className="scroll-mt-12 border-t border-border odd:bg-card">
              {r.map((cell, j) => {
                const isTerm = j >= termStart && j < termStart + 4;
                return (
                  <td key={j} className={`px-2 py-1.5 ${j === 0 ? "font-semibold whitespace-nowrap" : ""} ${isTerm ? "text-center font-bold text-primary" : ""} ${isTerm && cell ? "bg-accent" : ""}`}>
                    {isTerm ? (cell ? "✓" : "") : cell}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
