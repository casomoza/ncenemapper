import { Link } from "@tanstack/react-router";
import logo from "@/assets/norco-logo.png";

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Norco College Engineering" className="h-20 w-auto sm:h-24" />
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link
            to="/"
            className="text-foreground/80 transition-colors hover:text-primary"
            activeProps={{ className: "text-primary" }}
          >
            Programs
          </Link>
          <Link
            to="/ge"
            className="text-foreground/80 transition-colors hover:text-primary"
            activeProps={{ className: "text-primary" }}
          >
            GE Requirements
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-muted-foreground">
        <p>Norco College &middot; Program Pathways &middot; 2024–2025</p>
        <p className="mt-1 text-xs">
          Information is advisory. Confirm requirements with a counselor before enrolling.
        </p>
      </div>
    </footer>
  );
}
