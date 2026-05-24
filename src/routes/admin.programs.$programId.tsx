import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { fetchDbProgramBySlug, fetchDbCourses, type DbCourse, type DbProgram } from "@/lib/api";
import { ArrowLeft, Plus, Trash2, Save } from "lucide-react";

export const Route = createFileRoute("/admin/programs/$programId")({
  component: AdminProgramPage,
});

const SEMESTERS = ["Summer", "Fall", "Winter", "Spring"];
const CATEGORIES = ["core", "ge"];

function AdminProgramPage() {
  const { programId } = Route.useParams();
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: program } = useQuery({
    queryKey: ["admin-program", programId],
    queryFn: () => fetchDbProgramBySlug(programId),
    enabled: !!user && isAdmin,
  });
  const { data: courses } = useQuery({
    queryKey: ["admin-courses", program?.id],
    queryFn: () => fetchDbCourses(program!.id),
    enabled: !!program,
  });

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) navigate({ to: "/admin" });
  }, [loading, user, isAdmin, navigate]);

  if (!program) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="mx-auto flex-1 px-6 py-16 text-muted-foreground">Loading…</main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
        <Link
          to="/admin"
          className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to admin
        </Link>

        <ProgramForm program={program} />

        <div className="mt-10 flex items-center justify-between">
          <h2 className="font-serif text-2xl text-foreground">Courses</h2>
          <AddCourseButton programId={program.id} />
        </div>

        <div className="mt-4 overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="p-2">Order</th>
                <th className="p-2">Code</th>
                <th className="p-2">Title</th>
                <th className="p-2">Units</th>
                <th className="p-2">Year</th>
                <th className="p-2">Term</th>
                <th className="p-2">Type</th>
                <th className="p-2">Prereq</th>
                <th className="p-2">Optional</th>
                <th className="p-2"></th>
              </tr>
            </thead>
            <tbody>
              {courses?.map((c) => (
                <CourseRow key={c.id} course={c} />
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          Edit any cell and click Save on the row. Satisfies / description / notes can be edited from the row's "Details" link.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}

function ProgramForm({ program }: { program: DbProgram }) {
  const qc = useQueryClient();
  const [form, setForm] = useState(program);
  const [error, setError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  // Only reset the form when we switch to a different program (not on every refetch),
  // otherwise an auto-refetch would wipe out the admin's in-progress edits.
  useEffect(() => setForm(program), [program.id]);

  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("programs")
        .update({
          name: form.name,
          degree_type: form.degree_type,
          total_units: form.total_units,
          cluster: form.cluster ?? undefined,
          description: form.description ?? undefined,
          outcomes: form.outcomes,
        })
        .eq("id", program.id);
      if (error) throw error;
    },
    onSuccess: () => {
      setSavedAt(Date.now());
      qc.invalidateQueries({ queryKey: ["admin-program", program.slug] });
    },
    onError: (e: Error) => setError(e.message),
  });

  return (
    <div className="mt-4 grid gap-3 rounded-lg border border-border bg-card p-5 md:grid-cols-2">
      <Field label="Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
      <Field label="Degree type" value={form.degree_type} onChange={(v) => setForm({ ...form, degree_type: v })} />
      <Field label="Cluster" value={form.cluster ?? ""} onChange={(v) => setForm({ ...form, cluster: v })} />
      <Field
        label="Total units"
        type="number"
        value={String(form.total_units)}
        onChange={(v) => setForm({ ...form, total_units: Number(v) || 0 })}
      />
      <div className="md:col-span-2">
        <label className="block text-xs font-medium">Description</label>
        <textarea
          value={form.description ?? ""}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={2}
          className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>
      <div className="md:col-span-2">
        <label className="block text-xs font-medium">Outcomes (one per line)</label>
        <textarea
          value={(form.outcomes ?? []).join("\n")}
          onChange={(e) =>
            setForm({ ...form, outcomes: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })
          }
          rows={3}
          className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </div>
      {error && (
        <p className="md:col-span-2 rounded bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
      )}
      <div className="md:col-span-2 flex items-center justify-end gap-3">
        {savedAt && !save.isPending && (
          <span className="text-xs text-muted-foreground">Saved</span>
        )}
        <button
          onClick={() => {
            setError(null);
            save.mutate();
          }}
          disabled={save.isPending}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-burgundy disabled:opacity-60"
        >
          <Save className="h-4 w-4" /> {save.isPending ? "Saving…" : "Save program"}
        </button>
      </div>
    </div>
  );
}

function AddCourseButton({ programId }: { programId: string }) {
  const qc = useQueryClient();
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const add = useMutation({
    mutationFn: async () => {
      const trimmed = code.trim();
      let prefill: Partial<DbCourse> = {};
      let prefilled = false;
      if (trimmed) {
        // Look up an existing course with the same code in any other program
        const { data: existing, error: lookupErr } = await supabase
          .from("courses")
          .select("*")
          .ilike("code", trimmed)
          .neq("program_id", programId)
          .limit(1);
        if (lookupErr) throw lookupErr;
        if (existing && existing.length > 0) {
          const src = existing[0] as DbCourse;
          prefill = {
            title: src.title,
            units: src.units,
            category: src.category,
            prerequisite: src.prerequisite,
            satisfies: src.satisfies,
            description: src.description,
            optional: src.optional,
            note: src.note,
          };
          prefilled = true;
        }
      }
      const { error } = await supabase.from("courses").insert({
        program_id: programId,
        code: trimmed || "NEW-000",
        title: prefill.title ?? "New course",
        units: prefill.units ?? 3,
        year: 1,
        semester: "Fall",
        category: prefill.category ?? "core",
        prerequisite: prefill.prerequisite ?? null,
        satisfies: prefill.satisfies ?? [],
        description: prefill.description ?? null,
        optional: prefill.optional ?? false,
        note: prefill.note ?? null,
      });
      if (error) throw error;
      return prefilled;
    },
    onSuccess: (prefilled) => {
      qc.invalidateQueries({ queryKey: ["admin-courses", programId] });
      setStatus(prefilled ? `Prefilled from existing "${code.trim()}"` : "Added blank course");
      setCode("");
      setTimeout(() => setStatus(null), 3000);
    },
    onError: (e: Error) => setStatus(`Error: ${e.message}`),
  });
  return (
    <div className="flex items-center gap-2">
      {status && <span className="text-xs text-muted-foreground">{status}</span>}
      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Course code (optional)"
        className="w-44 rounded-md border border-input bg-background px-2 py-1.5 text-sm"
      />
      <button
        onClick={() => add.mutate()}
        disabled={add.isPending}
        className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-burgundy disabled:opacity-60"
      >
        <Plus className="h-4 w-4" /> Add course
      </button>
    </div>
  );
}


function CourseRow({ course }: { course: DbCourse }) {
  const qc = useQueryClient();
  const [c, setC] = useState(course);
  const [expanded, setExpanded] = useState(false);
  const dirty = JSON.stringify(c) !== JSON.stringify(course);

  // Only re-sync when this row's id changes (i.e. a different course),
  // so refetches don't wipe out the admin's in-progress edits.
  useEffect(() => setC(course), [course.id]);

  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("courses")
        .update({
          code: c.code,
          title: c.title,
          units: c.units,
          year: c.year,
          semester: c.semester,
          category: c.category,
          prerequisite: c.prerequisite || null,
          satisfies: c.satisfies,
          description: c.description,
          optional: c.optional,
          note: c.note,
          sort_order: c.sort_order,
        })
        .eq("id", c.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-courses", course.program_id] }),
    onError: (e: Error) => alert(`Save failed: ${e.message}`),
  });
  const del = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("courses").delete().eq("id", c.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-courses", course.program_id] }),
  });

  return (
    <>
      <tr className="border-t border-border">
        <td className="p-2">
          <input
            type="number"
            value={c.sort_order}
            onChange={(e) => setC({ ...c, sort_order: Number(e.target.value) || 0 })}
            className="w-16 rounded border border-input bg-background px-1 py-0.5"
          />
        </td>
        <td className="p-2">
          <input
            value={c.code}
            onChange={(e) => setC({ ...c, code: e.target.value })}
            className="w-28 rounded border border-input bg-background px-1 py-0.5"
          />
        </td>
        <td className="p-2">
          <input
            value={c.title}
            onChange={(e) => setC({ ...c, title: e.target.value })}
            className="w-full min-w-[200px] rounded border border-input bg-background px-1 py-0.5"
          />
        </td>
        <td className="p-2">
          <input
            type="number"
            step="0.5"
            value={c.units}
            onChange={(e) => setC({ ...c, units: Number(e.target.value) || 0 })}
            className="w-14 rounded border border-input bg-background px-1 py-0.5"
          />
        </td>
        <td className="p-2">
          <input
            type="number"
            value={c.year}
            onChange={(e) => setC({ ...c, year: Number(e.target.value) || 1 })}
            className="w-14 rounded border border-input bg-background px-1 py-0.5"
          />
        </td>
        <td className="p-2">
          <select
            value={c.semester}
            onChange={(e) => setC({ ...c, semester: e.target.value })}
            className="rounded border border-input bg-background px-1 py-0.5"
          >
            {SEMESTERS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </td>
        <td className="p-2">
          <select
            value={c.category}
            onChange={(e) => setC({ ...c, category: e.target.value })}
            className="rounded border border-input bg-background px-1 py-0.5"
          >
            {CATEGORIES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </td>
        <td className="p-2">
          <input
            value={c.prerequisite ?? ""}
            onChange={(e) => setC({ ...c, prerequisite: e.target.value })}
            className="w-24 rounded border border-input bg-background px-1 py-0.5"
          />
        </td>
        <td className="p-2 text-center">
          <input
            type="checkbox"
            checked={c.optional}
            onChange={(e) => setC({ ...c, optional: e.target.checked })}
          />
        </td>
        <td className="p-2 whitespace-nowrap">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="mr-2 text-xs text-primary hover:underline"
          >
            {expanded ? "Hide" : "Details"}
          </button>
          <button
            disabled={!dirty || save.isPending}
            onClick={() => save.mutate()}
            className="mr-1 inline-flex items-center gap-1 rounded bg-primary px-2 py-1 text-xs text-primary-foreground disabled:opacity-40"
          >
            <Save className="h-3 w-3" /> Save
          </button>
          <button
            onClick={() => {
              if (confirm(`Delete ${c.code}?`)) del.mutate();
            }}
            className="inline-flex items-center gap-1 rounded border border-destructive/50 px-2 py-1 text-xs text-destructive"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </td>
      </tr>
      {expanded && (
        <tr className="border-t border-border bg-muted/20">
          <td colSpan={10} className="p-3">
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="block text-xs font-medium">Description</label>
                <textarea
                  value={c.description ?? ""}
                  onChange={(e) => setC({ ...c, description: e.target.value })}
                  rows={4}
                  className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium">Note (e.g. exam waiver)</label>
                <textarea
                  value={c.note ?? ""}
                  onChange={(e) => setC({ ...c, note: e.target.value })}
                  rows={2}
                  className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1 text-sm"
                />
                <label className="mt-2 block text-xs font-medium">
                  Satisfies (one per line)
                </label>
                <textarea
                  value={(c.satisfies ?? []).join("\n")}
                  onChange={(e) =>
                    setC({
                      ...c,
                      satisfies: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean),
                    })
                  }
                  rows={3}
                  className="mt-1 w-full rounded-md border border-input bg-background px-2 py-1 text-sm"
                />
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
      />
    </div>
  );
}
