import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchGeAreas } from "@/lib/api";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { BookOpen } from "lucide-react";
import type { GeArea } from "@/lib/program";

export const Route = createFileRoute("/ge")({
  component: GePage,
  head: () => ({
    meta: [
      { title: "GE Requirements — Norco College Engineering" },
      {
        name: "description",
        content:
          "Browse RCCD General Education and CalGETC areas and the courses that satisfy each one for UC/CSU/IGETC transfer.",
      },
    ],
  }),
});

const SYSTEM_META: Record<
  "RCCD" | "CalGETC",
  { label: string; subtitle: string; tagClass: string }
> = {
  RCCD: {
    label: "RCCD General Education",
    subtitle: "Riverside Community College District · 2024–2025",
    tagClass: "bg-primary/10 text-primary",
  },
  CalGETC: {
    label: "CalGETC",
    subtitle: "California General Education Transfer Curriculum",
    tagClass: "bg-accent/30 text-accent-foreground",
  },
};

function GePage() {
  const { data: geAreas = [] } = useQuery({ queryKey: ["ge_areas"], queryFn: fetchGeAreas });

  const groups: Array<{ system: "RCCD" | "CalGETC"; areas: GeArea[] }> = (
    ["RCCD", "CalGETC"] as const
  )
    .map((system) => ({ system, areas: geAreas.filter((a) => a.system === system) }))
    .filter((g) => g.areas.length > 0);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="border-b border-border bg-paper">
          <div className="mx-auto max-w-6xl px-6 py-12">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              General Education
            </p>
            <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight text-foreground text-balance">
              GE Requirements
            </h1>
            <p className="mt-3 max-w-2xl text-base text-muted-foreground">
              Browse the RCCD GE pattern and CalGETC areas. Pick one eligible course per slot in
              your pathway.
            </p>
          </div>
        </section>

        {groups.map(({ system, areas }) => {
          const meta = SYSTEM_META[system];
          return (
            <section key={system} className="mx-auto max-w-6xl px-6 py-10">
              <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2 border-b border-border pb-3">
                <div>
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${meta.tagClass}`}
                  >
                    {system}
                  </span>
                  <h2 className="mt-2 font-serif text-2xl font-semibold text-foreground">
                    {meta.label}
                  </h2>
                  <p className="text-xs text-muted-foreground">{meta.subtitle}</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  {areas.length} area{areas.length === 1 ? "" : "s"}
                </p>
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                {areas.map((area) => (
                  <article
                    key={`${system}-${area.id}`}
                    className="overflow-hidden rounded-lg border border-border bg-card shadow-sm"
                  >
                    <header className="flex items-start justify-between gap-3 border-b border-border bg-secondary/50 px-5 py-4">
                      <div>
                        <p className="font-mono text-xs font-semibold text-primary">
                          {system} · Area {area.id}
                        </p>
                        <h3 className="mt-0.5 font-serif text-xl font-semibold leading-tight text-foreground">
                          {area.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-1.5 rounded-full bg-card px-2.5 py-1 text-xs text-muted-foreground">
                        <BookOpen className="h-3.5 w-3.5" />
                        {area.courses.length}
                      </div>
                    </header>
                    <div className="max-h-72 overflow-y-auto px-5 py-3">
                      <ul className="space-y-1.5 text-sm text-foreground/85">
                        {area.courses.map((c, i) => (
                          <li
                            key={i}
                            className="border-b border-border/60 pb-1.5 last:border-0"
                          >
                            {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}

        {groups.length === 0 && (
          <section className="mx-auto max-w-6xl px-6 py-10">
            <p className="text-sm text-muted-foreground">No GE areas yet.</p>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
