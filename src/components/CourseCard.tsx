import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Course } from "@/lib/program";
import { fetchGeAreas } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const isGeSlot = (code: string) => /^RCCD GE/i.test(code);

export function CourseCard({ course }: { course: Course }) {
  const [open, setOpen] = useState(false);
  const { data: geAreas } = useQuery({
    queryKey: ["ge_areas"],
    queryFn: fetchGeAreas,
    staleTime: 5 * 60 * 1000,
  });
  const geArea = (() => {
    if (!isGeSlot(course.code) || !geAreas) return undefined;
    const m = course.code.match(/(\d+[A-Za-z]?)/);
    if (!m) return undefined;
    return geAreas.find((a) => a.id === m[1]);
  })();
  const isCore = course.category === "core";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`group relative w-full overflow-hidden rounded-md border bg-card text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md ${
          course.optional ? "border-dashed border-accent/70" : "border-border"
        }`}
      >
        <div
          className={`h-1 w-full ${isCore ? "bg-primary" : "bg-accent"}`}
          aria-hidden
        />
        <div className="p-3">
          <div className="flex items-start justify-between gap-2">
            <span className="font-mono text-xs font-semibold tracking-tight text-primary">
              {course.code}
            </span>
            <span className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[10px] font-medium text-secondary-foreground">
              {course.units} {course.units === 1 ? "unit" : "units"}
            </span>
          </div>
          <p className="mt-1 line-clamp-2 text-sm font-medium leading-snug text-foreground">
            {course.title}
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide ${
                isCore
                  ? "bg-primary/10 text-primary"
                  : "bg-accent/30 text-accent-foreground"
              }`}
            >
              {isCore ? "Core" : "GE"}
            </span>
            {course.optional && (
              <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent-foreground">
                Optional
              </span>
            )}
            {course.prerequisite && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                Prereq: {course.prerequisite}
              </span>
            )}
          </div>
        </div>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <p className="font-mono text-xs font-semibold text-primary">
              {course.code} &middot; {course.units} units &middot; Year {course.year} {course.semester}
            </p>
            <DialogTitle className="font-serif text-2xl">{course.title}</DialogTitle>
            {course.description && (
              <DialogDescription className="text-sm leading-relaxed text-foreground/80">
                {course.description}
              </DialogDescription>
            )}
          </DialogHeader>

          <div className="space-y-3 text-sm">
            {course.note && (
              <div className="rounded-md border border-accent/50 bg-accent/15 p-3 text-xs leading-relaxed text-accent-foreground">
                <span className="font-semibold uppercase tracking-wide">Note · </span>
                {course.note}
              </div>
            )}
            {course.prerequisite && (
              <div>
                <span className="font-semibold text-foreground">Prerequisite: </span>
                <span className="font-mono">{course.prerequisite}</span>
              </div>
            )}
            {course.satisfies.length > 0 && (
              <div>
                <p className="mb-1 font-semibold text-foreground">Satisfies</p>
                <ul className="flex flex-wrap gap-1.5">
                  {course.satisfies.map((s, i) => (
                    <li
                      key={i}
                      className="rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-xs text-primary"
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {geArea && (
              <div className="rounded-md border border-accent/40 bg-accent/10 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-accent-foreground">
                  GE Area {geArea.id} · {geArea.title}
                </p>
                <p className="mt-2 text-xs text-foreground/80">
                  {geArea.courses.length} eligible course{geArea.courses.length === 1 ? "" : "s"}. Choose one with your counselor.
                </p>
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs font-medium text-primary hover:underline">
                    See options
                  </summary>
                  <ul className="mt-2 max-h-48 space-y-1 overflow-y-auto text-xs text-foreground/80">
                    {geArea.courses.map((c, i) => (
                      <li key={i} className="border-b border-border/60 pb-1 last:border-0">
                        {c}
                      </li>
                    ))}
                  </ul>
                </details>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
