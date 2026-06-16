import { useState, useMemo, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, X, BookOpen, Plus, Check } from "lucide-react";
import { fetchCatalogCoursesFromDb } from "@/lib/api";
import type { CatalogCourse } from "@/lib/api";
import staticCatalog from "@/lib/catalog-courses.json";

export type { CatalogCourse };

const SEMESTERS = ["Summer", "Fall", "Winter", "Spring"];
const CATEGORIES = ["core", "ge"];

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (course: CatalogCourse, year: number, semester: string, category: string) => Promise<void>;
}

export function CatalogSearchDialog({ open, onClose, onAdd }: Props) {
  const [query, setQuery] = useState("");
  const [year, setYear] = useState(1);
  const [semester, setSemester] = useState("Fall");
  const [category, setCategory] = useState("core");
  const [adding, setAdding] = useState<string | null>(null);
  const [added, setAdded] = useState<Set<string>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);

  // Try Supabase first; fall back to bundled static JSON
  const { data: dbCourses } = useQuery({
    queryKey: ["catalog-courses"],
    queryFn: fetchCatalogCoursesFromDb,
    staleTime: 5 * 60 * 1000,
    enabled: open,
  });
  const catalog: CatalogCourse[] =
    dbCourses ?? (staticCatalog as CatalogCourse[]);
  const source = dbCourses ? "database" : "bundled";

  useEffect(() => {
    if (open) {
      setQuery("");
      setAdded(new Set());
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return catalog
      .filter(
        (c) =>
          c.code.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q),
      )
      .slice(0, 40);
  }, [query, catalog]);

  async function handleAdd(course: CatalogCourse) {
    setAdding(course.code);
    try {
      await onAdd(course, year, semester, category);
      setAdded((prev) => new Set([...prev, course.code]));
    } finally {
      setAdding(null);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-[10vh]"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="flex w-full max-w-2xl flex-col rounded-xl border border-border bg-background shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <BookOpen className="h-5 w-5 shrink-0 text-primary" />
          <span className="font-medium">Search Course Catalog</span>
          <span className="ml-1 text-xs text-muted-foreground">
            {catalog.length} courses · {source === "database" ? "from database" : "bundled 2026–27"}
          </span>
          <button
            onClick={onClose}
            className="ml-auto rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Defaults row */}
        <div className="flex flex-wrap items-center gap-3 border-b border-border bg-muted/30 px-4 py-2.5 text-sm">
          <span className="text-muted-foreground">Add to:</span>
          <label className="flex items-center gap-1.5">
            Year
            <input
              type="number"
              min={1}
              max={4}
              value={year}
              onChange={(e) => setYear(Number(e.target.value) || 1)}
              className="w-12 rounded border border-input bg-background px-1.5 py-0.5 text-center text-sm"
            />
          </label>
          <label className="flex items-center gap-1.5">
            Term
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="rounded border border-input bg-background px-1.5 py-0.5 text-sm"
            >
              {SEMESTERS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
          <label className="flex items-center gap-1.5">
            Type
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded border border-input bg-background px-1.5 py-0.5 text-sm"
            >
              {CATEGORIES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
        </div>

        {/* Search input */}
        <div className="relative px-4 py-3">
          <Search className="absolute left-7 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by course code or title (e.g. MATH, Physics, Calculus…)"
            className="w-full rounded-lg border border-input bg-muted/40 py-2 pl-9 pr-3 text-sm outline-none focus:border-primary focus:bg-background"
          />
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto px-2 pb-3">
          {query.trim() === "" && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Start typing to search {catalog.length} catalog courses
            </p>
          )}
          {query.trim() !== "" && results.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No courses match "{query}"
            </p>
          )}
          {results.map((course) => {
            const isAdding = adding === course.code;
            const isAdded = added.has(course.code);
            return (
              <div
                key={course.code}
                className="group flex items-start gap-3 rounded-lg px-3 py-2.5 hover:bg-muted/60"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-xs font-semibold text-primary">
                      {course.code}
                    </span>
                    <span className="text-sm font-medium text-foreground truncate">
                      {course.title}
                    </span>
                    <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                      {course.units} {course.units === 1 ? "unit" : "units"}
                    </span>
                  </div>
                  {course.prerequisite && course.prerequisite !== "None." && (
                    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                      <span className="font-medium">Prereq:</span> {course.prerequisite}
                    </p>
                  )}
                  {course.description && (
                    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                      {course.description.replace(/\s*\d+\.\d+\s+hours.+$/, "").trim()}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleAdd(course)}
                  disabled={isAdding || isAdded}
                  className="mt-0.5 shrink-0 inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium transition-colors disabled:opacity-70
                    bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isAdded ? (
                    <><Check className="h-3 w-3" /> Added</>
                  ) : isAdding ? (
                    "Adding…"
                  ) : (
                    <><Plus className="h-3 w-3" /> Add</>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {results.length === 40 && (
          <p className="border-t border-border px-4 py-2 text-center text-xs text-muted-foreground">
            Showing first 40 results — refine your search to see more
          </p>
        )}
      </div>
    </div>
  );
}
