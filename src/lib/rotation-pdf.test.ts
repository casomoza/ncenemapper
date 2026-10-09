import { describe, expect, it } from "vitest";
import { buildMasterList, masterTermMarks } from "./rotation-pdf";
import type { Course, Program } from "./program";

const course = (overrides: Partial<Course> = {}): Course => ({ code: "ADJ-1", title: "Introduction", units: 3, year: 1, semester: "Fall", category: "core", prerequisite: null, satisfies: [], description: null, ...overrides });
const program = (name: string, courses: Course[]): Program => ({ id: name, name, degreeType: "Certificate", totalUnits: 3, description: "", outcomes: [], cluster: "School", courses });

describe("department rotation master list", () => {
  it("deduplicates codes and lists every participating program once", () => {
    const master = buildMasterList([program("Alpha", [course(), course()]), program("Beta", [course({ code: " adj-1 " })])]);
    expect(master).toHaveLength(1);
    expect(master[0]?.programs).toEqual(["Alpha", "Beta"]);
  });
  it("excludes GE but includes elective placeholders", () => {
    const master = buildMasterList([program("Alpha", [course({ code: "CalGETC 1" }), course({ code: "RCCD GE 3" }), course({ code: "ENG-1", category: "ge" }), course({ code: "ELEC ADJ-ELEC", category: "ge" })])]);
    expect(master.map((c) => c.code)).toEqual(["ELEC ADJ-ELEC"]);
  });
  it("merges offered terms in Fall Winter Spring Summer grid order", () => {
    const master = buildMasterList([program("Alpha", [course({ termsOffered: ["Spring"] })]), program("Beta", [course({ semester: "Summer" })])]);
    const entry = master[0];
    if (!entry) throw new Error("Missing merged course");
    expect(entry.terms).toEqual(["Fall", "Spring", "Summer"]);
    expect(masterTermMarks(entry)).toEqual(["X", "", "X", "X"]);
  });
  it("preserves conflicting unit values", () => {
    expect(buildMasterList([program("Alpha", [course()]), program("Beta", [course({ units: 4 })])])[0]?.units).toBe("3 / 4");
  });
});