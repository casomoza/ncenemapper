import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { fetchGeAreas, type DbGeArea } from "@/lib/api";
import { Plus, Trash2, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/admin/ge")({
  component: AdminGePage,
  head: () => ({ meta: [{ title: "Admin · GE Areas — Norco College Pathways" }] }),
});

type EditableArea = {
  id?: string;
  area_code: string;
  title: string;
  units_note: string;
  courses: string[];
  sort_order: number;
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
    mutationFn: async () => {
      const nextOrder = (areas[areas.length - 1]?.sort_order ?? -1) + 1;
      const { error } = await supabase.from("ge_areas").insert({
        area_code: `new-${Date.now()}`,
        title: "New GE Area",
        units_note: "",
        courses: [],
        sort_order: nextOrder,
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
        <div className="mt-4 flex items-center justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-primary">Admin</p>
            <h1 className="font-serif text-3xl font-semibold text-foreground">
              RCCD GE Areas
            </h1>
            <p className="text-sm text-muted-foreground">
              Edit the General Education area list shown on /ge and in course pop-ups.
            </p>
          </div>
          <button
            onClick={() => createArea.mutate()}
            disabled={createArea.isPending}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-burgundy disabled:opacity-60"
          >
            <Plus className="h-4 w-4" /> Add area
          </button>
        </div>

        <div className="mt-8 grid gap-5">
          {areas.map((a) => (
            <AreaEditor key={a.id} area={a} />
          ))}
          {areas.length === 0 && (
            <p className="text-sm text-muted-foreground">No GE areas yet.</p>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function AreaEditor({ area }: { area: DbGeArea }) {
  const qc = useQueryClient();
  const [form, setForm] = useState<EditableArea>(area);
  const [coursesText, setCoursesText] = useState((area.courses ?? []).join("\n"));
  const [savedAt, setSavedAt] = useState<number | null>(null);

  useEffect(() => {
    setForm(area);
    setCoursesText((area.courses ?? []).join("\n"));
  }, [area.id]);

  const save = useMutation({
    mutationFn: async () => {
      const courses = coursesText
        .split("\n")
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      const { error } = await supabase
        .from("ge_areas")
        .update({
          area_code: form.area_code,
          title: form.title,
          units_note: form.units_note,
          courses,
          sort_order: form.sort_order,
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
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="grid gap-3 md:grid-cols-4">
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
        <label className="block text-xs font-medium">
          Courses (one per line)
        </label>
        <textarea
          value={coursesText}
          onChange={(e) => setCoursesText(e.target.value)}
          rows={Math.min(20, Math.max(4, coursesText.split("\n").length))}
          className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-xs"
        />
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
  );
}
