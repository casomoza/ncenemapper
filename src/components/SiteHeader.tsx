import { Link } from "@tanstack/react-router";
import logo from "@/assets/norco-logo.png";
import ieppLogo from "@/assets/iepp-logo.png";

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Norco College Engineering" className="h-14 w-auto sm:h-16" />
        </Link>
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium">
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
          <Link
            to="/admin"
            className="text-foreground/60 transition-colors hover:text-primary"
            activeProps={{ className: "text-primary" }}
          >
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter({ showIepp = false }: { showIepp?: boolean }) {
  return (
    <footer className="mt-16 border-t border-border bg-card">
      <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-muted-foreground">
        {showIepp ? (
          <img
            src={ieppLogo}
            alt="Inland Engineering Pathways Partnership — Jurupa Unified School District, Norco College, Riverside City College, UC Riverside"
            className="mx-auto mb-6 w-full max-w-3xl"
          />
        ) : (
          <img
            src={logo}
            alt="Norco College Career Education"
            className="mb-6 h-16 w-auto"
          />
        )}
        <p>Norco College &middot; Program Pathways &middot; 2026–2027</p>
        <p className="mt-1 text-xs">
          Information is advisory. Confirm requirements with a counselor before enrolling.
        </p>
      </div>
    </footer>
  );
}
