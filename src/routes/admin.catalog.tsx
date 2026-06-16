import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { fetchCatalogCoursesFromDb } from "@/lib/api";
import type { CatalogCourse } from "@/lib/api";
import staticCatalog from "@/lib/catalog-courses.json";
import { ArrowLeft, Upload, Database, Package, CheckCircle2, AlertCircle, FileJson } from "lucide-react";

export const Route = createFileRoute("/admin/catalog")({
  component: AdminCatalogPage,
  head: () => ({ meta: [{ title: "Course Catalog — Admin" }] }),
});

const MIGRATION_SQL = `-- Run this once in your Supabase dashboard → SQL Editor
-- supabase.com → your project → SQL Editor → New query

CREATE TABLE IF NOT EXISTS public.catalog_courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL,
  title text NOT NULL,
  units numeric NOT NULL DEFAULT 0,
  prerequisite text,
  description text,
  catalog_year text NOT NULL DEFAULT '2026-2027',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(code, catalog_year)
);

GRANT SELECT ON public.catalog_courses TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.catalog_courses TO authenticated;
GRANT ALL ON public.catalog_courses TO service_role;

ALTER TABLE public.catalog_courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Catalog courses are publicly readable"
  ON public.catalog_courses FOR SELECT USING (true);

CREATE POLICY "Admins can manage catalog courses"
  ON public.catalog_courses FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));`;

function AdminCatalogPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<CatalogCourse[] | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [catalogYear, setCatalogYear] = useState("2026-2027");
  const [showSql, setShowSql] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const { data: dbCourses, isLoading: dbLoading } = useQuery({
    queryKey: ["catalog-courses"],
    queryFn: fetchCatalogCoursesFromDb,
    enabled: !!user && isAdmin,
  });

  const tableExists = dbCourses !== null;
  const dbCount = dbCourses?.length ?? 0;
  const staticCount = (staticCatalog as CatalogCourse[]).length;

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) navigate({ to: "/admin" });
  }, [loading, user, isAdmin, navigate]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setParseError(null);
    setPreview(null);

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string) as CatalogCourse[];
        if (!Array.isArray(parsed)) throw new Error("File must be a JSON array.");
        const sample = parsed[0];
        if (!sample?.code || !sample?.title || sample?.units === undefined) {
          throw new Error("JSON must have { code, title, units, prerequisite, description } fields.");
        }
        setPreview(parsed);
      } catch (err) {
        setParseError(err instanceof Error ? err.message : "Invalid JSON file.");
      }
    };
    reader.readAsText(f);
  }

  const importMutation = useMutation({
    mutationFn: async () => {
      if (!preview) throw new Error("No catalog loaded.");
      const rows = preview.map((c) => ({
        code: c.code,
        title: c.title,
        units: c.units,
        prerequisite: c.prerequisite || null,
        description: c.description || null,
        catalog_year: catalogYear,
      }));

      const BATCH = 200;
      for (let i = 0; i < rows.length; i += BATCH) {
        const batch = rows.slice(i, i + BATCH);
        const { error } = await supabase
          .from("catalog_courses" as never)
          .upsert(batch as never, { onConflict: "code,catalog_year" });
        if (error) throw error;
        setImportStatus(`Importing… ${Math.min(i + BATCH, rows.length)} / ${rows.length}`);
      }
      return rows.length;
    },
    onSuccess: (count) => {
      qc.invalidateQueries({ queryKey: ["catalog-courses"] });
      setImportStatus(`✓ Imported ${count} courses for ${catalogYear}`);
      setFile(null);
      setPreview(null);
      if (fileRef.current) fileRef.current.value = "";
    },
    onError: (e: Error) => setImportStatus(`Error: ${e.message}`),
  });

  if (loading || dbLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex flex-1 items-center justify-center text-muted-foreground">Loading…</main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-8">
        <Link to="/admin" className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to admin
        </Link>

        <h1 className="mt-4 font-serif text-3xl text-foreground">Course Catalog</h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Manage the catalog that powers "Search catalog" when adding courses to programs.
        </p>

        {/* Status cards */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Package className="h-4 w-4 text-muted-foreground" />
              Bundled catalog (always available)
            </div>
            <p className="mt-2 text-2xl font-bold text-foreground">{staticCount}</p>
            <p className="text-xs text-muted-foreground">courses · 2026–2027 · bundled with app</p>
          </div>
          <div className={`rounded-lg border p-4 ${tableExists ? "border-green-200 bg-green-50" : "border-border bg-card"}`}>
            <div className="flex items-center gap-2 text-sm font-medium">
              <Database className="h-4 w-4 text-muted-foreground" />
              Database catalog
              {tableExists ? (
                <CheckCircle2 className="h-4 w-4 text-green-600 ml-auto" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-500 ml-auto" />
              )}
            </div>
            {tableExists ? (
              <>
                <p className="mt-2 text-2xl font-bold text-foreground">{dbCount}</p>
                <p className="text-xs text-muted-foreground">
                  {dbCount > 0 ? `courses · active — overrides bundled catalog` : "table ready, no courses yet"}
                </p>
              </>
            ) : (
              <>
                <p className="mt-2 text-sm text-amber-700 font-medium">Setup required</p>
                <p className="text-xs text-muted-foreground">Run the migration SQL once in your Supabase dashboard.</p>
              </>
            )}
          </div>
        </div>

        {/* Migration SQL (shown when table not set up) */}
        {!tableExists && (
          <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <h2 className="font-medium text-amber-900">One-time setup: create the catalog table</h2>
            <p className="mt-1 text-sm text-amber-800">
              Go to{" "}
              <a
                href="https://supabase.com/dashboard/project/exuretutssbihksumeyo/sql/new"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Supabase → SQL Editor
              </a>
              , paste the SQL below, and click Run.
            </p>
            <button
              onClick={() => setShowSql((s) => !s)}
              className="mt-2 text-xs font-medium text-amber-700 underline"
            >
              {showSql ? "Hide SQL" : "Show SQL"}
            </button>
            {showSql && (
              <pre className="mt-3 overflow-x-auto rounded bg-white p-3 text-xs text-gray-800 border border-amber-200">
                {MIGRATION_SQL}
              </pre>
            )}
          </div>
        )}

        {/* Import section */}
        <div className="mt-8">
          <h2 className="font-serif text-xl text-foreground">Import a new catalog year</h2>
          {!tableExists && (
            <p className="mt-1 text-sm text-muted-foreground">
              Complete the one-time setup above first, then come back to import.
            </p>
          )}

          {tableExists && (
            <div className="mt-4 space-y-5">
              {/* Step 1 */}
              <div className="rounded-lg border border-border bg-card p-4">
                <h3 className="font-medium text-sm flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground font-bold">1</span>
                  Parse the PDF to JSON (run locally)
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Download the parse script, place it alongside your catalog PDF, then run:
                </p>
                <pre className="mt-2 rounded bg-muted px-3 py-2 text-sm font-mono text-foreground overflow-x-auto">
                  node scripts/parse-catalog.mjs Norco_Catalog_2027-2028.pdf &gt; catalog-2027-2028.json
                </pre>
                <p className="mt-2 text-xs text-muted-foreground">
                  Requires <code>pdftotext</code> (poppler). On macOS: <code>brew install poppler</code>. On Linux/Replit: already available.
                </p>
              </div>

              {/* Step 2 */}
              <div className="rounded-lg border border-border bg-card p-4">
                <h3 className="font-medium text-sm flex items-center gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground font-bold">2</span>
                  Upload the JSON file here
                </h3>

                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <label className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    Catalog year
                    <input
                      value={catalogYear}
                      onChange={(e) => setCatalogYear(e.target.value)}
                      placeholder="2027-2028"
                      className="w-28 rounded border border-input bg-background px-2 py-1 text-sm"
                    />
                  </label>
                </div>

                <div className="mt-3">
                  <label
                    htmlFor="catalog-upload"
                    className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-input bg-muted/40 px-4 py-3 text-sm text-muted-foreground hover:bg-muted transition-colors"
                  >
                    <FileJson className="h-5 w-5" />
                    {file ? file.name : "Choose catalog JSON file…"}
                  </label>
                  <input
                    ref={fileRef}
                    id="catalog-upload"
                    type="file"
                    accept=".json,application/json"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                </div>

                {parseError && (
                  <p className="mt-2 text-sm text-destructive">{parseError}</p>
                )}

                {preview && (
                  <div className="mt-3 rounded-md border border-green-200 bg-green-50 p-3 text-sm">
                    <p className="font-medium text-green-800">
                      ✓ {preview.length} courses ready to import
                    </p>
                    <p className="mt-1 text-xs text-green-700">
                      Sample: {preview.slice(0, 3).map((c) => c.code).join(", ")}…
                    </p>
                  </div>
                )}

                {importStatus && (
                  <p className="mt-2 text-sm text-muted-foreground">{importStatus}</p>
                )}

                <button
                  onClick={() => importMutation.mutate()}
                  disabled={!preview || importMutation.isPending}
                  className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  <Upload className="h-4 w-4" />
                  {importMutation.isPending ? importStatus ?? "Importing…" : `Import ${preview?.length ?? 0} courses`}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
