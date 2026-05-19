import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchPrograms } from "@/lib/api";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { ArrowRight, GraduationCap, Layers } from "lucide-react";

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

function HomePage() {
  const { data: programs = [], isLoading } = useQuery({
    queryKey: ["programs"],
    queryFn: fetchPrograms,
  });
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="bg-paper border-b border-border">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Norco College · Engineering
            </p>
            <h1 className="mt-3 max-w-3xl font-serif text-5xl font-semibold leading-[1.05] text-foreground text-balance">
              Map your path from first semester to transfer.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-foreground/75">
              Clear, term-by-term course pathways that show exactly what to take, when to take
              it, and which certificate or degree requirements each course satisfies.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-12">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-foreground">Programs</h2>
              <p className="text-sm text-muted-foreground">
                Choose a program to view its pathway.
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {programs.map((p) => (
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
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
