import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { SiteHeader, SiteFooter } from "@/components/SiteHeader";
import { ArrowLeft, CheckCircle2, XCircle, Loader2, Clock } from "lucide-react";

export const Route = createFileRoute("/admin/ge-import")({
  component: AdminGeImportPage,
  head: () => ({ meta: [{ title: "Add GE Courses — Admin" }] }),
});

type Status = "pending" | "running" | "done" | "skipped" | "error";

const CALGETC_SLOTS = [
  { code: "CalGETC 1A", title: "English Composition",                               units: 4, year: 1, semester: "Summer" },
  { code: "CalGETC 4",  title: "Social and Behavioral Sciences",                    units: 3, year: 1, semester: "Fall"   },
  { code: "CalGETC 1B", title: "Critical Thinking – English Composition",           units: 4, year: 1, semester: "Winter" },
  { code: "CalGETC 1C", title: "Oral Communication",                                units: 3, year: 1, semester: "Winter" },
  { code: "CalGETC 5A", title: "Physical Science",                                  units: 5, year: 1, semester: "Spring" },
  { code: "CalGETC 2",  title: "Mathematical Concepts and Quantitative Reasoning",  units: 4, year: 2, semester: "Summer" },
  { code: "CalGETC 3A", title: "Arts",                                              units: 3, year: 2, semester: "Summer" },
  { code: "CalGETC 3B", title: "Humanities",                                        units: 3, year: 2, semester: "Winter" },
  { code: "CalGETC 5B", title: "Biological Science",                                units: 5, year: 2, semester: "Winter" },
  { code: "CalGETC 6",  title: "Ethnic Studies",                                    units: 3, year: 2, semester: "Spring" },
];

const RCCD_GE_SLOTS = [
  { code: "RCCD GE 1A", title: "English Composition",                              units: 4, year: 1, semester: "Summer" },
  { code: "RCCD GE 3",  title: "Arts and Humanities",                              units: 3, year: 1, semester: "Fall"   },
  { code: "RCCD GE 1B", title: "Oral Communications and Critical Thinking",        units: 4, year: 1, semester: "Winter" },
  { code: "RCCD GE 7",  title: "Lifelong Learning and Self Development",           units: 3, year: 1, semester: "Winter" },
  { code: "RCCD GE 5",  title: "Natural Sciences",                                 units: 5, year: 1, semester: "Spring" },
  { code: "RCCD GE 4",  title: "Social and Behavioral Sciences",                   units: 3, year: 2, semester: "Summer" },
  { code: "RCCD GE 2",  title: "Mathematical Concepts and Quantitative Reasoning", units: 4, year: 2, semester: "Winter" },
  { code: "RCCD GE 6",  title: "Ethnic Studies",                                   units: 3, year: 2, semester: "Spring" },
];

const ALL_GE_SLOTS = [
  ...CALGETC_SLOTS.map((s) => ({ ...s, satisfies: ["Cal-GETC"] })),
  ...RCCD_GE_SLOTS.map((s) => ({ ...s, satisfies: ["RCCD GE"] })),
];

function AdminGeImportPage() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [statuses, setStatuses] = useState<Record<string, Status>>({});
  const [messages, setMessages] = useState<Record<string, string>>({});
  const [programs, setPrograms] = useState<{ id: string; name: string }[]>([]);
  const [loadingPrograms, setLoadingPrograms] = useState(true);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
    if (!loading && user && !isAdmin) navigate({ to: "/admin/" });
  }, [loading, user, isAdmin, navigate]);

  useEffect(() => {
    if (!user || !isAdmin) return;
    supabase
      .from("programs")
      .select("id, name, degree_type")
      .order("name")
      .then(({ data, error }) => {
        if (error || !data) { setLoadingPrograms(false); return; }
        const assoc = (data as { id: string; name: string; degree_type: string }[])
          .filter((p) => /A\.[SA]\./.test(p.degree_type));
        setPrograms(assoc);
        const init: Record<string, Status> = {};
        assoc.forEach((p) => { init[p.id] = "pending"; });
        setStatuses(init);
        setLoadingPrograms(false);
      });
  }, [user, isAdmin]);

  if (loading || !user || !isAdmin) {
    return <div className="flex min-h-screen items-center justify-center text-muted-foreground">Loading…</div>;
  }

  const setStatus = (id: string, status: Status, msg?: string) => {
    setStatuses((prev) => ({ ...prev, [id]: status }));
    if (msg) setMessages((prev) => ({ ...prev, [id]: msg }));
  };

  async function runImport() {
    setRunning(true);
    for (const prog of programs) {
      setStatus(prog.id, "running");
      try {
        const { data: existing, error: fetchErr } = await supabase
          .from("courses")
          .select("sort_order, code")
          .eq("program_id", prog.id)
          .order("sort_order", { ascending: false });
        if (fetchErr) throw fetchErr;

        const rows = (existing ?? []) as { code: string; sort_order: number }[];
        const hasGe = rows.some((c) => /^(CalGETC|RCCD GE)/i.test(c.code));

        if (hasGe) {
          setStatus(prog.id, "skipped", "GE courses already present");
          continue;
        }

        const existingCodes = new Set(rows.map((c) => c.code));
        const maxOrder = rows.length > 0 ? rows[0].sort_order : -1;

        const toInsert = ALL_GE_SLOTS
          .filter((s) => !existingCodes.has(s.code))
          .map((s, i) => ({
            program_id: prog.id,
            code: s.code,
            title: s.title,
            units: s.units,
            year: s.year,
            semester: s.semester,
            category: "ge",
            satisfies: s.satisfies,
            optional: false,
            sort_order: maxOrder + 1 + i,
          }));

        if (toInsert.length === 0) {
          setStatus(prog.id, "skipped", "All GE slots already present");
          continue;
        }

        const { error: insertErr } = await supabase.from("courses").insert(toInsert);
        if (insertErr) throw insertErr;

        setStatus(prog.id, "done", `Added ${toInsert.length} GE slots`);
      } catch (e) {
        setStatus(prog.id, "error", (e as Error).message);
      }
    }
    setRunning(false);
    setFinished(true);
  }

  const statusIcon = (id: string) => {
    const s = statuses[id];
    if (s === "running") return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
    if (s === "done")    return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    if (s === "skipped") return <CheckCircle2 className="h-4 w-4 text-muted-foreground" />;
    if (s === "error")   return <XCircle className="h-4 w-4 text-destructive" />;
    return <Clock className="h-4 w-4 text-muted-foreground/50" />;
  };

  const done = Object.values(statuses).filter((s) => s === "done").length;
  const skip = Object.values(statuses).filter((s) => s === "skipped").length;
  const errs = Object.values(statuses).filter((s) => s === "error").length;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
        <Link to="/admin/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to admin
        </Link>

        <div className="mt-6">
          <p className="font-mono text-xs uppercase tracking-wider text-primary">Admin</p>
          <h1 className="font-serif text-3xl font-semibold text-foreground">Add GE Courses</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Adds CalGETC (10 areas) and RCCD GE (8 areas) slots to every A.S./A.A. program.
            Programs that already have GE courses are skipped automatically.
          </p>
        </div>

        <div className="mt-6 rounded-lg border border-border bg-muted/30 p-4 text-sm">
          <p className="font-medium">What will be added per program:</p>
          <div className="mt-2 grid grid-cols-2 gap-4 text-xs text-muted-foreground">
            <div>
              <p className="font-semibold text-foreground mb-1">CalGETC (10 areas)</p>
              {CALGETC_SLOTS.map((s) => (
                <p key={s.code}>{s.code} — {s.title}</p>
              ))}
            </div>
            <div>
              <p className="font-semibold text-foreground mb-1">RCCD GE (8 areas)</p>
              {RCCD_GE_SLOTS.map((s) => (
                <p key={s.code}>{s.code} — {s.title}</p>
              ))}
            </div>
          </div>
        </div>

        {loadingPrograms ? (
          <div className="mt-8 text-sm text-muted-foreground flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading programs…
          </div>
        ) : (
          <>
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {programs.length} A.S./A.A. programs found
              </p>
              {!finished ? (
                <button
                  onClick={runImport}
                  disabled={running || programs.length === 0}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-burgundy disabled:opacity-60"
                >
                  {running
                    ? <><Loader2 className="h-4 w-4 animate-spin" /> Running…</>
                    : "Add GE to all programs"}
                </button>
              ) : (
                <div className="text-sm font-medium text-green-700">
                  Done — {done} updated, {skip} skipped{errs > 0 ? `, ${errs} errors` : ""}
                </div>
              )}
            </div>

            <div className="mt-4 divide-y divide-border rounded-lg border border-border">
              {programs.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-3 px-4 py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {statusIcon(p.id)}
                    <span className="truncate text-sm font-medium">{p.name}</span>
                  </div>
                  {messages[p.id] && (
                    <span className={`shrink-0 text-xs ${statuses[p.id] === "error" ? "text-destructive" : "text-muted-foreground"}`}>
                      {messages[p.id]}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
