import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { fetchDbProgramBySlug, fetchDbCourses, type DbCourse, type DbProgram, deTagFromSatisfies, satisfiesWithoutDe, buildDeTag, ALL_TERMS, normalizeTermsOffered } from "@/lib/api";
import { NORCO_SCHOOLS } from "@/lib/schools";
import { ArrowLeft, Plus, Trash2, Save, BookOpen } from "lucide-react";
import { CatalogSearchDialog } from "@/components/CatalogSearchDialog";
import type { CatalogCourse } from "@/components/CatalogSearchDialog";

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

        <ElectiveGroupsSection programId={program.id} />
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
      <div>
        <label className="block text-xs font-medium">School</label>
        <select
          value={form.cluster ?? ""}
          onChange={(e) => setForm({ ...form, cluster: e.target.value })}
          className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">— unassigned —</option>
          {NORCO_SCHOOLS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
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
  const [catalogOpen, setCatalogOpen] = useState(false);

  const add = useMutation({
    mutationFn: async () => {
      const trimmed = code.trim();
      let prefill: Partial<DbCourse> = {};
      let prefilled = false;
      if (trimmed) {
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

  async function handleCatalogAdd(
    course: CatalogCourse,
    year: number,
    semester: string,
    category: string,
  ) {
    const { error } = await supabase.from("courses").insert({
      program_id: programId,
      code: course.code,
      title: course.title,
      units: course.units,
      year,
      semester,
      category,
      prerequisite: course.prerequisite && course.prerequisite !== "None."
        ? course.prerequisite
        : null,
      description: course.description || null,
      satisfies: [],
      optional: false,
      note: null,
    });
    if (error) throw error;
    qc.invalidateQueries({ queryKey: ["admin-courses", programId] });
  }

  return (
    <>
      <CatalogSearchDialog
        open={catalogOpen}
        onClose={() => setCatalogOpen(false)}
        onAdd={handleCatalogAdd}
      />
      <div className="flex items-center gap-2">
        {status && <span className="text-xs text-muted-foreground">{status}</span>}
        <button
          onClick={() => setCatalogOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-md border border-primary px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/5"
        >
          <BookOpen className="h-4 w-4" /> Search catalog
        </button>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add.mutate()}
          placeholder="Code (optional)"
          className="w-36 rounded-md border border-input bg-background px-2 py-1.5 text-sm"
        />
        <button
          onClick={() => add.mutate()}
          disabled={add.isPending}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground hover:bg-burgundy disabled:opacity-60"
        >
          <Plus className="h-4 w-4" /> Add blank
        </button>
      </div>
    </>
  );
}


type CourseEditState = DbCourse & { _deEnabled: boolean; _deHsYear: number; _deHsSemester: string };

function initCourseState(course: DbCourse): CourseEditState {
  const deTag = deTagFromSatisfies(course.satisfies ?? []);
  const deMatch = deTag ? deTag.match(/^DE:(\d+):(Fall|Spring)$/i) : null;
  return {
    ...course,
    satisfies: satisfiesWithoutDe(course.satisfies ?? []),
    _deEnabled: !!deTag,
    _deHsYear: deMatch ? Number(deMatch[1]) : 11,
    _deHsSemester: deMatch ? deMatch[2] : "Fall",
    terms_offered: normalizeTermsOffered(course.semester, course.terms_offered),
  };
}

function CourseRow({ course }: { course: DbCourse }) {
  const qc = useQueryClient();
  const [c, setC] = useState<CourseEditState>(() => initCourseState(course));
  const [expanded, setExpanded] = useState(false);
  const dirty = JSON.stringify(c) !== JSON.stringify(initCourseState(course));

  // Only re-sync when this row's id changes (i.e. a different course),
  // so refetches don't wipe out the admin's in-progress edits.
  useEffect(() => setC(initCourseState(course)), [course.id]);

  const save = useMutation({
    mutationFn: async () => {
      const deTag = c._deEnabled ? buildDeTag(c._deHsYear, c._deHsSemester) : null;
      const satisfies = deTag ? [...(c.satisfies ?? []), deTag] : (c.satisfies ?? []);
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
          satisfies,
          description: c.description,
          optional: c.optional,
          note: c.note,
          sort_order: c.sort_order,
          terms_offered: normalizeTermsOffered(c.semester, c.terms_offered),
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

              <div className="md:col-span-2 rounded-md border border-emerald-200 bg-emerald-50/50 p-3">
                <p className="mb-2 text-xs font-semibold text-emerald-800 uppercase tracking-wide">Dual Enrollment</p>
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input
                    type="checkbox"
                    checked={c._deEnabled}
                    onChange={(e) => setC({ ...c, _deEnabled: e.target.checked })}
                  />
                  Available via high school dual enrollment
                </label>
                {c._deEnabled && (
                  <div className="mt-3 flex flex-wrap gap-4">
                    <div>
                      <label className="block text-xs text-muted-foreground">HS Grade Year</label>
                      <select
                        value={c._deHsYear}
                        onChange={(e) => setC({ ...c, _deHsYear: Number(e.target.value) })}
                        className="mt-1 rounded border border-input bg-background px-2 py-1.5 text-sm"
                      >
                        <option value={9}>9th Grade</option>
                        <option value={10}>10th Grade</option>
                        <option value={11}>11th Grade</option>
                        <option value={12}>12th Grade</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground">HS Semester</label>
                      <select
                        value={c._deHsSemester}
                        onChange={(e) => setC({ ...c, _deHsSemester: e.target.value })}
                        className="mt-1 rounded border border-input bg-background px-2 py-1.5 text-sm"
                      >
                        <option>Fall</option>
                        <option>Spring</option>
                      </select>
                    </div>
                  </div>
                )}
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

type DbElective = {
  id: string;
  program_id: string;
  group_code: string;
  title: string;
  units_note: string;
  courses: string[];
  course_descriptions: Record<string, string> | null;
  sort_order: number;
};

function ElectiveGroupsSection({ programId }: { programId: string }) {
  const qc = useQueryClient();
  const { data: groups = [] } = useQuery({
    queryKey: ["program_electives_admin", programId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("program_electives" as never)
        .select("*")
        .eq("program_id", programId)
        .order("sort_order");
      if (error) throw error;
      return (data ?? []) as unknown as DbElective[];
    },
  });

  const create = useMutation({
    mutationFn: async () => {
      const nextOrder = (groups[groups.length - 1]?.sort_order ?? -1) + 1;
      const { error } = await supabase.from("program_electives" as never).insert({
        program_id: programId,
        group_code: `NEW-${Date.now().toString().slice(-5)}`,
        title: "New elective group",
        units_note: "",
        courses: [],
        course_descriptions: {},
        sort_order: nextOrder,
      } as never);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["program_electives_admin", programId] }),
    onError: (e: Error) => alert(e.message),
  });

  return (
    <section className="mt-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-2xl text-foreground">Elective groups</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Define "choose X from this list" course groups. Add a placeholder course on the map
            with code <code className="rounded bg-muted px-1">ELEC &lt;group code&gt;</code> (e.g.
            <code className="ml-1 rounded bg-muted px-1">ELEC CON-ELEC</code>) to give students a
            dropdown of options.
          </p>
        </div>
        <button
          onClick={() => create.mutate()}
          disabled={create.isPending}
          className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-burgundy disabled:opacity-60"
        >
          <Plus className="h-4 w-4" /> Add elective group
        </button>
      </div>

      <div className="mt-4 space-y-3">
        {groups.length === 0 && (
          <p className="rounded-md border border-dashed border-border bg-muted/30 px-4 py-6 text-center text-sm text-muted-foreground">
            No elective groups yet.
          </p>
        )}
        {groups.map((g) => (
          <ElectiveGroupRow key={g.id} group={g} />
        ))}
      </div>
    </section>
  );
}

function ElectiveGroupRow({ group }: { group: DbElective }) {
  const qc = useQueryClient();
  const [g, setG] = useState(group);
  const [open, setOpen] = useState(false);
  const dirty = JSON.stringify(g) !== JSON.stringify(group);

  useEffect(() => setG(group), [group.id]);

  const save = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("program_electives" as never)
        .update({
          group_code: g.group_code,
          title: g.title,
          units_note: g.units_note,
          courses: g.courses,
          course_descriptions: g.course_descriptions ?? {},
          sort_order: g.sort_order,
        } as never)
        .eq("id", g.id);
      if (error) throw error;
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["program_electives_admin", group.program_id] }),
    onError: (e: Error) => alert(`Save failed: ${e.message}`),
  });

  const del = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("program_electives" as never)
        .delete()
        .eq("id", g.id);
      if (error) throw error;
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["program_electives_admin", group.program_id] }),
  });

  const courseText = g.courses.join("\n");
  const descs = g.course_descriptions ?? {};

  return (
    <div className="rounded-lg border border-border bg-card">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <div>
          <p className="font-mono text-sm font-semibold text-primary">{g.group_code}</p>
          <p className="text-sm text-foreground">{g.title || <em className="text-muted-foreground">untitled</em>}</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>{g.courses.length} course{g.courses.length === 1 ? "" : "s"}</span>
          <span>order {g.sort_order}</span>
          <span>{open ? "Hide" : "Edit"}</span>
        </div>
      </button>
      {open && (
        <div className="space-y-3 border-t border-border p-4">
          <div className="grid gap-3 md:grid-cols-2">
            <Field
              label="Group code (used in course slot, e.g. ELEC CON-ELEC)"
              value={g.group_code}
              onChange={(v) => setG({ ...g, group_code: v })}
            />
            <Field label="Title" value={g.title} onChange={(v) => setG({ ...g, title: v })} />
            <Field
              label="Units note (e.g. Choose 2 of 6 · 6 units)"
              value={g.units_note}
              onChange={(v) => setG({ ...g, units_note: v })}
            />
            <Field
              label="Sort order"
              type="number"
              value={String(g.sort_order)}
              onChange={(v) => setG({ ...g, sort_order: Number(v) || 0 })}
            />
          </div>
          <div>
            <label className="block text-xs font-medium">Eligible courses (one per line)</label>
            <textarea
              rows={Math.max(3, g.courses.length + 1)}
              value={courseText}
              onChange={(e) =>
                setG({
                  ...g,
                  courses: e.target.value
                    .split("\n")
                    .map((s) => s.trim())
                    .filter(Boolean),
                })
              }
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm"
            />
          </div>
          {g.courses.length > 0 && (
            <div>
              <p className="text-xs font-medium">Course descriptions (optional)</p>
              <div className="mt-2 space-y-2">
                {g.courses.map((code) => (
                  <div key={code} className="grid grid-cols-[140px_1fr] items-start gap-2">
                    <span className="mt-2 font-mono text-xs text-primary">{code}</span>
                    <textarea
                      rows={2}
                      value={descs[code] ?? ""}
                      onChange={(e) =>
                        setG({
                          ...g,
                          course_descriptions: { ...descs, [code]: e.target.value },
                        })
                      }
                      className="rounded-md border border-input bg-background px-2 py-1 text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => {
                if (confirm(`Delete elective group ${g.group_code}?`)) del.mutate();
              }}
              className="inline-flex items-center gap-1 rounded border border-destructive/50 px-2 py-1 text-xs text-destructive"
            >
              <Trash2 className="h-3 w-3" /> Delete
            </button>
            <button
              disabled={!dirty || save.isPending}
              onClick={() => save.mutate()}
              className="inline-flex items-center gap-1 rounded bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground disabled:opacity-40"
            >
              <Save className="h-3 w-3" /> {save.isPending ? "Saving…" : "Save group"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
