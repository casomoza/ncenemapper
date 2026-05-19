import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getProgram, groupByTerm } from "@/lib/program";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { CourseCard } from "@/components/CourseCard";
import { ArrowLeft, Printer, GraduationCap, Award } from "lucide-react";

export const Route = createFileRoute("/programs/$programId")({
  loader: ({ params }) => {
    const p = getProgram(params.programId);
    if (!p) throw notFound();
    return { program: p };
  },
  component: ProgramPage,
  notFoundComponent: () => (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="font-serif text-3xl text-foreground">Program not found</h1>
        <Link to="/" className="mt-4 inline-block text-primary hover:underline">
          ← Back to programs
        </Link>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-2xl text-foreground">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <Link to="/" className="mt-4 inline-block text-primary hover:underline">
          ← Back to programs
        </Link>
      </div>
    </div>
  ),
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.program.name ?? "Program"} — Norco College Engineering` },
      {
        name: "description",
        content:
          loaderData?.program.description ?? "Program pathway at Norco College Engineering.",
      },
    ],
  }),
});

const TERM_STYLE: Record<string, { bg: string; ring: string; text: string }> = {
  Fall: { bg: "bg-[color:var(--term-fall)]/8", ring: "ring-[color:var(--term-fall)]/30", text: "text-[color:var(--term-fall)]" },
  Winter: { bg: "bg-[color:var(--term-winter)]/8", ring: "ring-[color:var(--term-winter)]/30", text: "text-[color:var(--term-winter)]" },
  Spring: { bg: "bg-[color:var(--term-spring)]/8", ring: "ring-[color:var(--term-spring)]/30", text: "text-[color:var(--term-spring)]" },
  Summer: { bg: "bg-[color:var(--term-summer)]/8", ring: "ring-[color:var(--term-summer)]/30", text: "text-[color:var(--term-summer)]" },
};

function ProgramPage() {
  const { program } = Route.useLoaderData();
  const terms = groupByTerm(program.courses);
  const years = Array.from(new Set(terms.map((t) => t.year))).sort();

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
              </aside>
            </div>

            {program.outcomes.length > 0 && (
              <div className="mt-8">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Outcomes
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {program.outcomes.map((o, i) => (
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
                            <CourseCard key={c.code} course={c} />
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
