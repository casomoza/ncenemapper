import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (o: unknown) => o,
  Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
  useNavigate: () => () => {},
}));
vi.mock("@tanstack/react-start", () => ({ useServerFn: (f: unknown) => f }));

const mod = await import("./routes/admin.index");
