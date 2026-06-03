import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { fetchGeAreas, type DbGeArea } from "@/lib/api";
import { Plus, Trash2, ArrowLeft, ChevronDown } from "lucide-react";

export const Route = createFileRoute("/admin/ge")({
  component: AdminGePage,
  head: () => ({ meta: [{ title: "Admin · GE Areas — Norco College Pathways" }] }),
});

type GeSystem = "RCCD" | "CalGETC";

type EditableArea = {
  id?: string;
  area_code: string;
  title: string;
  units_note: string;
  courses: string[];
  course_descriptions: Record<string, string>;
  sort_order: number;
  system: GeSystem;
};

function AdminGePage() {
  const { user, isAdmin, loading } = useAuth();
  const qc = useQueryClient();

  const { data: areas = [] } = useQuery({
    queryKey: ["ge_areas_admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ge_areas")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data as DbGeArea[];
    },
    enabled: !!user && isAdmin,
  });

  const createArea = useMutation({
    mutationFn: async (system: GeSystem) => {
      const sameSystem = areas.filter((a) => (a.system ?? "RCCD") === system);
      const nextOrder = (sameSystem[sameSystem.length - 1]?.sort_order ?? -1) + 1;
      const { error } = await supabase.from("ge_areas").insert({
        area_code: `new-${Date.now()}`,
        title: `New ${system} Area`,
        units_note: "",
        courses: [],
        course_descriptions: {},
        sort_order: nextOrder,
        system,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ge_areas_admin"] });
      qc.invalidateQueries({ queryKey: ["ge_areas"] });
    },
    onError: (e: Error) => alert(e.message),
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="mx-auto max-w-2xl flex-1 px-6 py-16 text-center">
          <h1 className="font-serif text-3xl text-foreground">Admin access required</h1>
          <Link to="/admin" className="mt-4 inline-block text-sm text-primary hover:underline">
            ← Back to admin
          </Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
        <Link
          to="/admin"
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to admin
        </Link>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-primary">Admin</p>
            <h1 className="font-serif text-3xl font-semibold text-foreground">GE Areas</h1>
            <p className="text-sm text-muted-foreground">
              Edit RCCD GE and CalGETC area lists shown on /ge and in course pop-ups.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => createArea.mutate("RCCD")}
              disabled={createArea.isPending}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-burgundy disabled:opacity-60"
            >
              <Plus className="h-4 w-4" /> Add RCCD area
            </button>
            <button
              onClick={() => createArea.mutate("CalGETC")}
              disabled={createArea.isPending}
              className="inline-flex items-center gap-1.5 rounded-md border border-primary bg-card px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10 disabled:opacity-60"
            >
              <Plus className="h-4 w-4" /> Add CalGETC area
            </button>
          </div>
        </div>

        {(["RCCD", "CalGETC"] as const).map((system) => {
          const list = areas.filter((a) => (a.system ?? "RCCD") === system);
          return (
            <section key={system} className="mt-10">
              <div className="mb-3 flex items-baseline justify-between border-b border-border pb-2">
                <h2 className="font-serif text-xl font-semibold text-foreground">
                  {system === "RCCD" ? "RCCD General Education" : "CalGETC"}
                </h2>
                <span className="text-xs text-muted-foreground">
                  {list.length} area{list.length === 1 ? "" : "s"}
                </span>
              </div>
              <div className="grid gap-5">
                {list.map((a) => (
                  <AreaEditor key={a.id} area={a} />
                ))}
                {list.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No {system} areas yet.
                  </p>
                )}
              </div>
            </section>
          );
        })}

      </main>
      <SiteFooter />
    </div>
  );
}

function AreaEditor({ area }: { area: DbGeArea }) {
  const qc = useQueryClient();
  const toEditable = (a: DbGeArea): EditableArea => ({
    ...a,
    course_descriptions: (a.course_descriptions ?? {}) as Record<string, string>,
    system: (a.system ?? "RCCD") as GeSystem,
  });
  const [form, setForm] = useState<EditableArea>(toEditable(area));
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setForm(toEditable(area));
  }, [area.id]);

  const save = useMutation({
    mutationFn: async () => {
      const courses = form.courses
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      // Drop descriptions for codes no longer in the list
      const descriptions: Record<string, string> = {};
      for (const code of courses) {
        const v = form.course_descriptions[code];
        if (v && v.trim().length > 0) descriptions[code] = v;
      }
      const { error } = await supabase
        .from("ge_areas")
        .update({
          area_code: form.area_code,
          title: form.title,
          units_note: form.units_note,
          courses,
          course_descriptions: descriptions,
          sort_order: form.sort_order,
          system: form.system,
        })
        .eq("id", area.id);
      if (error) throw error;
    },
    onSuccess: () => {
      setSavedAt(Date.now());
      qc.invalidateQueries({ queryKey: ["ge_areas_admin"] });
      qc.invalidateQueries({ queryKey: ["ge_areas"] });
    },
    onError: (e: Error) => alert(e.message),
  });

  const del = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("ge_areas").delete().eq("id", area.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ge_areas_admin"] });
      qc.invalidateQueries({ queryKey: ["ge_areas"] });
    },
    onError: (e: Error) => alert(e.message),
  });

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between p-5 text-left hover:bg-accent/40 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="rounded bg-primary/10 px-2 py-0.5 font-mono text-xs text-primary">
            {area.area_code}
          </span>
          <span className="font-medium text-foreground">{area.title}</span>
          <span className="text-xs text-muted-foreground">
            {(area.system ?? "RCCD") === "RCCD" ? "RCCD GE" : "CalGETC"}
          </span>
        </div>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="border-t border-border p-5">
          <div className="grid gap-3 md:grid-cols-5">
            <div>
              <label className="block text-xs font-medium">System</label>
              <select
                value={form.system}
                onChange={(e) =>
                  setForm({ ...form, system: e.target.value as GeSystem })
                }
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="RCCD">RCCD GE</option>
                <option value="CalGETC">CalGETC</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium">Area code</label>
              <input
                value={form.area_code}
                onChange={(e) => setForm({ ...form, area_code: e.target.value })}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-medium">Title</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium">Sort order</label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) =>
                  setForm({ ...form, sort_order: Number(e.target.value) || 0 })
                }
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div className="mt-3">
            <label className="block text-xs font-medium">Units note</label>
            <input
              value={form.units_note}
              onChange={(e) => setForm({ ...form, units_note: e.target.value })}
              placeholder="e.g. 3-4 units"
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium">Courses</label>
              <button
                type="button"
                onClick={() =>
                  setForm({ ...form, courses: [...form.courses, ""] })
                }
                className="text-xs font-medium text-primary hover:underline"
              >
                + Add course
              </button>
            </div>
            <div className="mt-2 space-y-3">
              {form.courses.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  No courses yet. Click "Add course" to add one.
                </p>
              )}
              {form.courses.map((code, idx) => (
                <div
                  key={idx}
                  className="rounded-md border border-border bg-background/40 p-3"
                >
                  <div className="flex items-start gap-2">
                    <input
                      value={code}
                      onChange={(e) => {
                        const next = [...form.courses];
                        const oldCode = next[idx];
                        next[idx] = e.target.value;
                        const desc = { ...form.course_descriptions };
                        if (oldCode && oldCode !== e.target.value) {
                          const prev = desc[oldCode];
                          delete desc[oldCode];
                          if (prev) desc[e.target.value] = prev;
                        }
                        setForm({ ...form, courses: next, course_descriptions: desc });
                      }}
                      placeholder="e.g. ENG 1A — College Composition"
                      className="flex-1 rounded-md border border-input bg-background px-3 py-1.5 font-mono text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const next = form.courses.filter((_, i) => i !== idx);
                        const desc = { ...form.course_descriptions };
                        delete desc[code];
                        setForm({ ...form, courses: next, course_descriptions: desc });
                      }}
                      className="rounded-md border border-destructive/40 px-2 py-1.5 text-xs text-destructive hover:bg-destructive/10"
                      aria-label="Remove course"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <textarea
                    value={form.course_descriptions[code] ?? ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        course_descriptions: {
                          ...form.course_descriptions,
                          [code]: e.target.value,
                        },
                      })
                    }
                    placeholder="Course description shown when a student opens this course on a program map."
                    rows={2}
                    className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-xs"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <button
              onClick={() => {
                if (confirm(`Delete GE area "${form.title}"?`)) del.mutate();
              }}
              className="inline-flex items-center gap-1.5 rounded-md border border-destructive/50 px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </button>
            <div className="flex items-center gap-3">
              {savedAt && (
                <span className="text-xs text-muted-foreground">Saved</span>
              )}
              <button
                onClick={() => save.mutate()}
                disabled={save.isPending}
                className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:bg-burgundy disabled:opacity-60"
              >
                {save.isPending ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
