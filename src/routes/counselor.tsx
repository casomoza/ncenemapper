import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchPrograms } from "@/lib/api";
import { NORCO_SCHOOLS, normalizeCluster } from "@/lib/schools";
import { buildMasterList, masterTermMarks, rotationCourses } from "@/lib/rotation-pdf";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { Download } from "lucide-react";

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
        </div>
        {dataUpdatedAt > 0 && <p className="mt-2 text-xs text-muted-foreground">Data loaded {new Date(dataUpdatedAt).toLocaleString()}</p>}
        {isLoading && <p className="mt-8 text-muted-foreground">Loading current course data…</p>}
        {error && <p role="alert" className="mt-8 text-destructive">Could not load course data. Please refresh.</p>}
        {!isLoading && !school && <p className="mt-8 text-muted-foreground">Choose a school to see its course rotation.</p>}
        {school && !isLoading && selected.length === 0 && <p className="mt-8 text-muted-foreground">No public programs in this school.</p>}

        {selected.length > 0 && (
          <>
            <section className="mt-10">
              <h2 className="text-xl font-bold text-primary">School-wide term grid</h2>
              <p className="text-sm text-muted-foreground">{master.length} unique courses across {selected.length} programs. ✓ = offered that term.</p>
              <RotationTable
                head={["Course", "Title", "Units", ...TERMS, "Frequency", "Program(s)"]}
                rows={master.map((m) => [m.code, m.title, m.units, ...masterTermMarks(m), `${m.terms.length}x/year`, m.programs.join("; ")])}
                termStart={3}
              />
            </section>
            <section className="mt-12">
              <h2 className="text-xl font-bold text-primary">By program</h2>
              {selected.map((p) => {
                const courses = rotationCourses(p.courses).sort((a, b) => a.year - b.year || a.code.localeCompare(b.code));
                return (
                  <div key={p.id} className="mt-6">
                    <h3 className="text-lg font-semibold">
                      <Link to="/programs/$programId" params={{ programId: p.id }} className="hover:text-primary">{p.name}</Link>
                    </h3>
                    <p className="text-xs text-muted-foreground">{p.degreeType} · {courses.length} courses</p>
                    <RotationTable
                      head={["Course", "Title", "Units", "Type", "Mapped", ...TERMS, "Frequency"]}
                      rows={courses.map((c) => {
                        const off = c.termsOffered ?? [c.semester];
                        return [
                          c.code, c.title, String(c.units),
                          /^ELEC\s/i.test(c.code) ? "Elective" : c.optional ? "Core (optional)" : "Core",
                          `Y${c.year} ${c.semester}`,
                          ...TERMS.map((t) => (off.includes(t) ? "X" : "")),
                          off.length === 1 ? "Once a year" : `${off.length} terms`,
                        ];
                      })}
                      termStart={5}
                    />
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

function RotationTable({ head, rows, termStart }: { head: string[]; rows: string[][]; termStart: number }) {
  return (
    <div className="mt-3 overflow-x-auto rounded-md border border-border">
      <table className="w-full text-sm">
        <thead className="bg-primary text-primary-foreground">
          <tr>{head.map((h) => <th key={h} className="px-2 py-2 text-left font-semibold">{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-border odd:bg-card">
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
