import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { fetchPrograms } from "@/lib/api";
import { ProgramExcelImport } from "@/components/ProgramExcelImport";
import { NORCO_SCHOOLS } from "@/lib/schools";
import { LogOut, Plus, Pencil, Trash2, BookOpen, Download } from "lucide-react";


export const Route = createFileRoute("/admin/")({
  component: AdminPage,
  head: () => ({ meta: [{ title: "Admin — Norco College Pathways" }] }),
});

function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [showNew, setShowNew] = useState(false);

  const { data: programs } = useQuery({
    queryKey: ["programs"],
    queryFn: fetchPrograms,
    enabled: !!user && isAdmin,
  });

  const del = useMutation({
    mutationFn: async (slug: string) => {
      const { error } = await supabase.from("programs").delete().eq("slug", slug);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["programs"] }),
  });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="mx-auto flex-1 px-6 py-16 text-center">
          <h1 className="font-serif text-3xl text-foreground">Admin sign-in required</h1>
          <Link
            to="/auth"
            className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-burgundy"
          >
            Sign in
          </Link>
        </main>
        <SiteFooter />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="mx-auto max-w-2xl flex-1 px-6 py-16">
          <h1 className="font-serif text-3xl text-foreground">No admin access</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Your account ({user.email}) is signed in but does not have the admin role. Ask the
            project owner to grant you admin access. Your user id:
          </p>
          <code className="mt-3 block break-all rounded-md bg-muted px-3 py-2 text-xs">
            {user.id}
          </code>
          <button
            onClick={() => supabase.auth.signOut()}
            className="mt-6 inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-xs uppercase tracking-wider text-primary">Admin</p>
            <h1 className="font-serif text-3xl font-semibold text-foreground">Programs</h1>
            <p className="text-sm text-muted-foreground">Signed in as {user.email}</p>
          </div>
          <div className="flex w-full flex-wrap gap-2 sm:w-auto">
            <button
              onClick={() => setShowNew(true)}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-burgundy"
            >
              <Plus className="h-4 w-4" /> New program
            </button>
            <Link
              to="/admin/ge"
              className="inline-flex items-center gap-1.5 rounded-md border border-primary bg-primary/10 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/20"
            >
              <Pencil className="h-4 w-4" /> Edit GE areas
            </Link>
            <Link
              to="/admin/catalog"
              className="inline-flex items-center gap-1.5 rounded-md border border-primary bg-primary/10 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/20"
            >
              <BookOpen className="h-4 w-4" /> Course catalog
            </Link>
            <Link
              to="/admin/import"
              className="inline-flex items-center gap-1.5 rounded-md border border-primary bg-primary/10 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/20"
            >
              <Download className="h-4 w-4" /> Import programs
            </Link>
            <button
              onClick={() => supabase.auth.signOut().then(() => navigate({ to: "/" }))}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm hover:bg-accent/30"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>

        {showNew && <NewProgramForm onClose={() => setShowNew(false)} />}

        <ProgramExcelImport />


        <div className="mt-8 grid gap-4">
          {programs?.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between rounded-lg border border-border bg-card p-5"
            >
              <div>
                <h2 className="font-serif text-xl text-foreground">{p.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {p.degreeType} · {p.courses.length} courses · {p.totalUnits} units
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  to="/admin/programs/$programId"
                  params={{ programId: p.id }}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm hover:bg-accent/30"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </Link>
                <button
                  onClick={() => {
                    if (confirm(`Delete program "${p.name}"? This removes all its courses.`)) {
                      del.mutate(p.id);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 rounded-md border border-destructive/50 px-3 py-1.5 text-sm text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
          {programs && programs.length === 0 && (
            <p className="text-sm text-muted-foreground">No programs yet.</p>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function NewProgramForm({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const [slug, setSlug] = useState("");
  const [name, setName] = useState("");
  const [degreeType, setDegreeType] = useState("");
  const [totalUnits, setTotalUnits] = useState(60);
  const [cluster, setCluster] = useState(NORCO_SCHOOLS[0]);
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  const create = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("programs").insert({
        slug,
        name,
        degree_type: degreeType,
        total_units: totalUnits,
        cluster,
        description,
        outcomes: [],
      });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["programs"] });
      onClose();
    },
    onError: (e: Error) => setError(e.message),
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        create.mutate();
      }}
      className="mt-6 grid gap-3 rounded-lg border border-border bg-card p-5 md:grid-cols-2"
    >
      <Field label="Slug (URL id)" value={slug} onChange={setSlug} required />
      <Field label="Name" value={name} onChange={setName} required />
      <Field label="Degree type" value={degreeType} onChange={setDegreeType} />
      <div>
        <label className="block text-xs font-medium">School</label>
        <select
          value={cluster}
          onChange={(e) => setCluster(e.target.value)}
          className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          {NORCO_SCHOOLS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <Field
        label="Total units"
        value={String(totalUnits)}
        onChange={(v) => setTotalUnits(Number(v) || 0)}
        type="number"
      />
      <div className="md:col-span-2">
        <label className="block text-xs font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          rows={2}
        />
      </div>
      {error && (
        <p className="md:col-span-2 rounded bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </p>
      )}
      <div className="md:col-span-2 flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-md border border-border px-3 py-1.5 text-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={create.isPending}
          className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground hover:bg-burgundy disabled:opacity-60"
        >
          Create
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
      />
    </div>
  );
}
