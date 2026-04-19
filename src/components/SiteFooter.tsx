import { Link } from "@tanstack/react-router";
import { Shield } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-border bg-background/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-4 text-xs text-muted-foreground sm:flex-row md:px-8">
        <p className="text-center sm:text-left">
          © {new Date().getFullYear()} InvisTierlist. All rights reserved.
        </p>
        <Link
          to="/admin/login"
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 text-[11px] font-semibold text-foreground transition hover:border-primary/40 hover:text-primary"
        >
          <Shield className="h-3 w-3" />
          Admin Login
        </Link>
      </div>
    </footer>
  );
}
