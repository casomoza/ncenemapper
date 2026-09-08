import { supabase } from "@/integrations/supabase/client";
import type { Course, GeArea, Program } from "@/lib/program";

export type DbProgram = {
  id: string;
  slug: string;
  name: string;
  degree_type: string;
  total_units: number;
  description: string | null;
  outcomes: string[];
  cluster: string | null;
};

export type DbCourse = {
  id: string;
  program_id: string;
  code: string;
  title: string;
  units: number;
  year: number;
  semester: string;
  category: string;
  prerequisite: string | null;
  satisfies: string[];
  description: string | null;
  optional: boolean;
  note: string | null;
  sort_order: number;
  terms_offered?: string[] | null;
};

export const ALL_TERMS = ["Fall", "Winter", "Spring", "Summer"] as const;

/** Normalized list of terms a course is offered in — always includes its mapped term. */
export function normalizeTermsOffered(semester: string, terms?: string[] | null): string[] {
  const set = new Set<string>([semester, ...(terms ?? [])]);
  return ALL_TERMS.filter((t) => set.has(t));
}


const DE_TAG_RE = /^DE:(\d+):(Fall|Spring)$/i;

export function deTagFromSatisfies(satisfies: string[]): string | undefined {
  return (satisfies ?? []).find((s) => DE_TAG_RE.test(s));
}

export function satisfiesWithoutDe(satisfies: string[]): string[] {
  return (satisfies ?? []).filter((s) => !DE_TAG_RE.test(s));
}

export function buildDeTag(hsYear: number, hsSemester: string): string {
  return `DE:${hsYear}:${hsSemester}`;
}

function toProgram(p: DbProgram, courses: DbCourse[]): Program {
  return {
    id: p.slug,
    name: p.name,
    degreeType: p.degree_type,
    totalUnits: p.total_units,
    description: p.description ?? "",
    outcomes: p.outcomes ?? [],
    cluster: p.cluster ?? "",
    courses: courses.map(toCourse),
  };
}

function toCourse(c: DbCourse): Course {
  const deTag = deTagFromSatisfies(c.satisfies ?? []);
  const deMatch = deTag ? deTag.match(/^DE:(\d+):(Fall|Spring)$/i) : null;
  return {
    code: c.code,
    title: c.title,
    units: c.units,
    year: c.year,
    semester: c.semester as Course["semester"],
    category: (c.category as Course["category"]) ?? "core",
    prerequisite: c.prerequisite,
    satisfies: satisfiesWithoutDe(c.satisfies ?? []),
    description: c.description,
    optional: c.optional,
    note: c.note ?? undefined,
    dualEnrollment: !!deTag,
    deHsYear: deMatch ? Number(deMatch[1]) : null,
    deHsSemester: deMatch ? deMatch[2] : null,
    termsOffered: normalizeTermsOffered(c.semester, c.terms_offered),

  };
}

export async function fetchPrograms(): Promise<Program[]> {
  const { data: progs, error } = await supabase
    .from("programs")
    .select("*")
    .order("name");
  if (error) throw error;
  const { data: courses, error: cErr } = await supabase
    .from("courses")
    .select("*")
    .order("sort_order");
  if (cErr) throw cErr;
  return (progs as DbProgram[]).map((p) =>
    toProgram(
      p,
      (courses as DbCourse[]).filter((c) => c.program_id === p.id),
    ),
  );
}

export async function fetchProgramBySlug(slug: string): Promise<Program | null> {
  const { data: prog, error } = await supabase
    .from("programs")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!prog) return null;
  const { data: courses, error: cErr } = await supabase
    .from("courses")
    .select("*")
    .eq("program_id", (prog as DbProgram).id)
    .order("sort_order");
  if (cErr) throw cErr;
  return toProgram(prog as DbProgram, (courses as DbCourse[]) ?? []);
}

export async function fetchDbProgramBySlug(slug: string): Promise<DbProgram | null> {
  const { data, error } = await supabase
    .from("programs")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return (data as DbProgram) ?? null;
}

export async function fetchDbCourses(programId: string): Promise<DbCourse[]> {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("program_id", programId)
    .order("sort_order");
  if (error) throw error;
  return (data as DbCourse[]) ?? [];
}

export type DbGeArea = {
  id: string;
  area_code: string;
  title: string;
  units_note: string;
  courses: string[];
  course_descriptions: Record<string, string> | null;
  sort_order: number;
  system: "RCCD" | "CalGETC";
};

export async function fetchGeAreas(): Promise<GeArea[]> {
  const { data, error } = await supabase
    .from("ge_areas")
    .select("*")
    .order("sort_order");
  if (error) throw error;
  return (data as unknown as DbGeArea[]).map((a) => ({
    id: a.area_code,
    title: a.title,
    unitsNote: a.units_note ?? "",
    courses: a.courses ?? [],
    courseDescriptions: (a.course_descriptions ?? {}) as Record<string, string>,
    system: (a.system ?? "RCCD") as "RCCD" | "CalGETC",
  }));
}

export type DbProgramElective = {
  id: string;
  program_id: string;
  group_code: string;
  title: string;
  units_note: string;
  courses: string[];
  course_descriptions: Record<string, string> | null;
  sort_order: number;
};

export async function fetchProgramElectives(programId: string): Promise<DbProgramElective[]> {
  const { data, error } = await supabase
    .from("program_electives" as never)
    .select("*")
    .eq("program_id", programId)
    .order("sort_order");
  if (error) throw error;
  return ((data ?? []) as unknown as DbProgramElective[]);
}

export async function fetchProgramElectivesBySlug(slug: string): Promise<DbProgramElective[]> {
  const { data: prog, error } = await supabase
    .from("programs")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  if (!prog) return [];
  return fetchProgramElectives((prog as { id: string }).id);
}

export interface CatalogCourse {
  code: string;
  title: string;
  units: number;
  prerequisite: string;
  description: string;
}

/**
 * Fetch courses from the catalog_courses Supabase table.
 * Returns null if the table doesn't exist yet (migration not yet applied),
 * allowing callers to fall back to the bundled static JSON.
 */
export async function fetchCatalogCoursesFromDb(): Promise<CatalogCourse[] | null> {
  const { data, error } = await supabase
    .from("catalog_courses" as never)
    .select("code, title, units, prerequisite, description")
    .order("code");
  if (error) {
    // Table might not exist yet — return null so callers can use the static fallback
    return null;
  }
  const rows = (data ?? []) as CatalogCourse[];
  return rows.length > 0 ? rows : null;
}
