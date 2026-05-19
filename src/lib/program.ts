import data from "@/data/program.json";

export type Course = {
  code: string;
  title: string;
  units: number;
  semester: "Fall" | "Winter" | "Spring" | "Summer";
  year: number;
  category: "core" | "ge";
  prerequisite: string | null;
  satisfies: string[];
  description: string | null;
  optional?: boolean;
  note?: string;
};

export type Program = {
  id: string;
  name: string;
  degreeType: string;
  totalUnits: number;
  description: string;
  outcomes: string[];
  cluster: string;
  courses: Course[];
};

export type GeArea = {
  id: string;
  title: string;
  unitsNote: string;
  courses: string[];
};

const TERM_ORDER: Record<string, number> = { Summer: 0, Fall: 1, Winter: 2, Spring: 3 };

export const program = data.program as Program;
export const geAreas = data.geAreas as GeArea[];
export const programs: Program[] = [program];

export function getProgram(id: string): Program | undefined {
  return programs.find((p) => p.id === id);
}

export function groupByTerm(courses: Course[]) {
  const map = new Map<string, { year: number; semester: string; courses: Course[] }>();
  for (const c of courses) {
    const key = `${c.year}-${c.semester}`;
    if (!map.has(key)) map.set(key, { year: c.year, semester: c.semester, courses: [] });
    map.get(key)!.courses.push(c);
  }
  return Array.from(map.values()).sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return (TERM_ORDER[a.semester] ?? 9) - (TERM_ORDER[b.semester] ?? 9);
  });
}

export function findGeArea(slot: string): GeArea | undefined {
  // slot like "RCCD GE 3" or "RCCD GE 6"
  const m = slot.match(/(\d+[A-Za-z]?)/);
  if (!m) return undefined;
  return geAreas.find((a) => a.id === m[1]);
}
