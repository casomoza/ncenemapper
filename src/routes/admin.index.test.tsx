// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (o: unknown) => o,
  Link: ({ children }: { children: React.ReactNode }) => <a href="#">{children}</a>,
  useNavigate: () => () => {},
}));
vi.mock("@tanstack/react-start", () => ({ useServerFn: (f: unknown) => f }));

const { ProgramList } = await import("./admin.index");

const programs = [
  { id: "a", name: "Accounting", cluster: "School of Business & Management", degreeType: "A.S.", totalUnits: 60, courses: [] },
  { id: "b", name: "Zoology", cluster: "School of Business & Management", degreeType: "A.S.", totalUnits: 60, courses: [] },
  { id: "c", name: "Engineering Graphics", cluster: "School of Math, Engineering, Computer Science & Game Development", degreeType: "Cert", totalUnits: 18, courses: [] },
];

describe("admin ProgramList", () => {
  it("groups by cluster, sorted, and filters on search", () => {
    render(<ProgramList programs={programs} onDelete={() => {}} />);

    const headers = screen.getAllByRole("button", { expanded: true }).map((b) => b.textContent);
    expect(headers[0]).toContain("School of Business & Management");
    expect(headers[1]).toContain("School of Math, Engineering");

    const names = screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);
    expect(names).toEqual(["Accounting", "Zoology", "Engineering Graphics"]);

    const box = screen.getByLabelText("Search programs");
    fireEvent.change(box, { target: { value: "engineering" } });
    const filtered = screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);
    expect(filtered).toEqual(["Engineering Graphics"]);
    expect(screen.getByText("1 result")).toBeTruthy();

    fireEvent.change(box, { target: { value: "zoo" } });
    expect(screen.getAllByRole("heading", { level: 2 })[0].textContent).toBe("Zoology");

    fireEvent.change(box, { target: { value: "" } });
    const first = screen.getAllByRole("button", { expanded: true })[0];
    fireEvent.click(first);
    expect(screen.getAllByRole("button", { expanded: false }).length).toBe(1);
    expect(localStorage.getItem("admin-collapsed-clusters")).toContain("Business");
  });
});
