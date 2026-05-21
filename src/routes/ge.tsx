import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchGeAreas } from "@/lib/api";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { BookOpen } from "lucide-react";

export const Route = createFileRoute("/ge")({
  component: GePage,
  head: () => ({
    meta: [
      { title: "RCCD General Education Requirements — Norco College Engineering" },
      {
        name: "description",
        content:
          "Browse the seven RCCD General Education areas and the courses that satisfy each one for UC/CSU/IGETC transfer.",
      },
    ],
  }),
});

function GePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="border-b border-border bg-paper">
          <div className="mx-auto max-w-6xl px-6 py-12">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Riverside Community College District · 2024–2025
            </p>
            <h1 className="mt-3 font-serif text-4xl font-semibold leading-tight text-foreground text-balance">
              General Education Requirements
            </h1>
            <p className="mt-3 max-w-2xl text-base text-muted-foreground">
              Courses that satisfy the RCCD GE pattern for UC / CSU / IGETC transfer. Pick one
              eligible course per GE slot in your pathway.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-10">
          <div className="grid gap-5 md:grid-cols-2">
            {geAreas.map((area) => (
              <article
                key={area.id}
                className="overflow-hidden rounded-lg border border-border bg-card shadow-sm"
              >
                <header className="flex items-start justify-between gap-3 border-b border-border bg-secondary/50 px-5 py-4">
                  <div>
                    <p className="font-mono text-xs font-semibold text-primary">
                      Area {area.id}
                    </p>
                    <h2 className="mt-0.5 font-serif text-xl font-semibold leading-tight text-foreground">
                      {area.title}
                    </h2>
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
      </main>

      <SiteFooter />
    </div>
  );
}
