import { useState, useMemo } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchPrograms } from "@/lib/api";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { NORCO_SCHOOLS } from "@/lib/schools";
import { ArrowRight, ArrowLeft, GraduationCap, BookOpen, Layers, Search, X } from "lucide-react";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "Norco College Engineering — Program Pathways" },
      {
        name: "description",
        content:
          "Map out your engineering degree at Norco College. See semester-by-semester course pathways, prerequisites, and certificate requirements.",
      },
    ],
  }),
});

// Normalise a stored cluster value to its canonical NORCO_SCHOOLS name.
// Handles old records that are missing the "School of " prefix.
function normalizeCluster(raw: string): string {
  if (!raw) return "Unassigned";
  // Exact match first
  if ((NORCO_SCHOOLS as readonly string[]).includes(raw)) return raw;
  // Try prepending "School of " — handles "Applied Technologies & Apprenticeships" etc.
  const withPrefix = `School of ${raw}`;
  if ((NORCO_SCHOOLS as readonly string[]).includes(withPrefix)) return withPrefix;
  // Try stripping "School of " and comparing the tail — reverse direction
  const tail = raw.replace(/^School of /i, "");
  const match = NORCO_SCHOOLS.find((s) => s.replace(/^School of /i, "") === tail);
  if (match) return match;
  return raw;
}

function HomePage() {
  const { data: programs = [], isLoading } = useQuery({
    queryKey: ["programs"],
    queryFn: fetchPrograms,
  });
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Group programs by school, preserving the canonical school order.
  // normalizeCluster handles programs with old cluster values (missing "School of ").
  const schools = useMemo(() => {
    const countMap = new Map<string, number>();
    for (const p of programs) {
      const key = normalizeCluster(p.cluster?.trim() || "");
      countMap.set(key, (countMap.get(key) ?? 0) + 1);
    }
    // Canonical schools first (in order), then any truly unrecognised values
    const ordered: string[] = [
      ...NORCO_SCHOOLS.filter((s) => countMap.has(s)),
      ...[...countMap.keys()].filter((k) => !(NORCO_SCHOOLS as readonly string[]).includes(k)),
    ];
    return ordered.map((name) => ({ name, count: countMap.get(name) ?? 0 }));
  }, [programs]);

  const searchResults = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return [];
    return programs.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.cluster ?? "").toLowerCase().includes(q) ||
        (p.degreeType ?? "").toLowerCase().includes(q),
    );
  }, [programs, search]);

  const visiblePrograms = useMemo(
    () =>
      selectedCluster
        ? programs.filter((p) => normalizeCluster(p.cluster?.trim() || "") === selectedCluster)
        : [],
    [programs, selectedCluster],
  );

  const isSearching = search.trim().length > 0;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="bg-paper border-b border-border">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Norco College · Program Pathways
            </p>
            <h1 className="mt-3 max-w-3xl font-serif text-5xl font-semibold leading-[1.05] text-foreground text-balance">
              Your Mustang Journey<br />at a Glance
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-foreground/75">
              Clear, term-by-term course pathways that show exactly what to take, when to take
              it, and which certificate or degree requirements each course satisfies.
            </p>

            <div className="mt-8 max-w-lg">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search programs…"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    if (e.target.value.trim()) setSelectedCluster(null);
                  }}
                  className="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-10 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-12">
          {isSearching ? (
            <>
              <div className="mb-6">
                <h2 className="font-serif text-2xl font-semibold text-foreground">
                  Search results
                </h2>
                <p className="text-sm text-muted-foreground">
                  {searchResults.length === 0
                    ? "No programs match your search."
                    : `${searchResults.length} program${searchResults.length === 1 ? "" : "s"} found`}
                </p>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                {searchResults.map((p) => (
                  <Link
                    key={p.id}
                    to="/programs/$programId"
                    params={{ programId: p.id }}
                    className="group relative overflow-hidden rounded-lg border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg"
                  >
                    <div className="absolute inset-x-0 top-0 h-1 bg-primary" />
                    <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-primary">
                      <Layers className="h-3.5 w-3.5" />
                      {p.cluster}
                    </div>
                    <h3 className="mt-2 font-serif text-2xl font-semibold leading-tight text-foreground">
                      {p.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">{p.degreeType}</p>
                    <p className="mt-4 line-clamp-2 text-sm text-foreground/75">
                      {p.description}
                    </p>
                    <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-sm">
                      <div className="flex items-center gap-4 text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <GraduationCap className="h-4 w-4" />
                          {p.totalUnits} units
                        </span>
                        <span>{p.courses.length} courses</span>
                      </div>
                      <span className="flex items-center gap-1 font-medium text-primary transition-transform group-hover:translate-x-0.5">
                        View pathway <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          ) : selectedCluster === null ? (
            <>
              <div className="mb-6">
                <h2 className="font-serif text-2xl font-semibold text-foreground">
                  Career and Academic Pathways
                </h2>
                <p className="text-sm text-muted-foreground">
                  Choose a school to see its programs.
                </p>
              </div>

              {isLoading ? (
                <p className="text-sm text-muted-foreground">Loading schools…</p>
              ) : schools.length === 0 ? (
                <p className="text-sm text-muted-foreground">No programs yet.</p>
              ) : (
                <div className="grid gap-5 md:grid-cols-2">
                  {schools.map((s) => (
                    <button
                      key={s.name}
                      type="button"
                      onClick={() => setSelectedCluster(s.name)}
                      className="group relative overflow-hidden rounded-lg border border-border bg-card p-6 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg"
                    >
                      <div className="absolute inset-x-0 top-0 h-1 bg-primary" />
                      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-primary">
                        <BookOpen className="h-3.5 w-3.5" />
                        School
                      </div>
                      <h3 className="mt-2 font-serif text-xl font-semibold leading-snug text-foreground">
                        {s.name}
                      </h3>
                      <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-sm">
                        <span className="text-muted-foreground">
                          {s.count} {s.count === 1 ? "program" : "programs"}
                        </span>
                        <span className="flex items-center gap-1 font-medium text-primary transition-transform group-hover:translate-x-0.5">
                          View programs <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <>
              <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                  <button
                    type="button"
                    onClick={() => setSelectedCluster(null)}
                    className="mb-2 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                  >
                    <ArrowLeft className="h-4 w-4" /> All schools
                  </button>
                  <h2 className="font-serif text-2xl font-semibold text-foreground">
                    {selectedCluster}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Choose a program to view its pathway.
                  </p>
                </div>
              </div>

              {visiblePrograms.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No programs assigned to this school yet.
                </p>
              ) : (
                <div className="grid gap-5 md:grid-cols-2">
                  {visiblePrograms.map((p) => (
                    <Link
                      key={p.id}
                      to="/programs/$programId"
                      params={{ programId: p.id }}
                      className="group relative overflow-hidden rounded-lg border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg"
                    >
                      <div className="absolute inset-x-0 top-0 h-1 bg-primary" />
                      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-primary">
                        <Layers className="h-3.5 w-3.5" />
                        {p.cluster}
                      </div>
                      <h3 className="mt-2 font-serif text-2xl font-semibold leading-tight text-foreground">
                        {p.name}
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">{p.degreeType}</p>
                      <p className="mt-4 line-clamp-2 text-sm text-foreground/75">
                        {p.description}
                      </p>
                      <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-sm">
                        <div className="flex items-center gap-4 text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <GraduationCap className="h-4 w-4" />
                            {p.totalUnits} units
                          </span>
                          <span>{p.courses.length} courses</span>
                        </div>
                        <span className="flex items-center gap-1 font-medium text-primary transition-transform group-hover:translate-x-0.5">
                          View pathway <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
