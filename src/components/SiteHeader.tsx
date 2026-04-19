import { Link } from "@tanstack/react-router";
import { Shield } from "lucide-react";
import logo from "@/assets/logo.png";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-8 md:py-4">
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt="InvisTierlist"
            className="h-10 w-10 rounded-xl object-contain"
            style={{ boxShadow: "var(--shadow-glow)" }}
          />
          <div className="text-lg font-extrabold tracking-[0.18em] text-foreground md:text-xl">
            INVIS<span className="text-primary"> TIERS</span>
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
