import { Link } from "@tanstack/react-router";
import { Eye, Shield } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: "var(--gradient-rank-1)", boxShadow: "var(--shadow-glow)" }}
          >
            <Eye className="h-5 w-5 text-background" />
          </div>
          <div className="leading-tight">
            <div className="text-lg font-extrabold tracking-tight text-foreground">
              Invis<span className="text-primary">Tierlist</span>
            </div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Minecraft PvP Rankings
            </div>
          </div>
        </Link>

        <Link
          to="/admin/login"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground transition hover:border-primary/40 hover:text-primary"
        >
          <Shield className="h-3.5 w-3.5" />
          Admin
        </Link>
      </div>
    </header>
  );
}
