import { Link } from "@tanstack/react-router";
import { Shield } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-12 border-t border-border bg-background/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-muted-foreground sm:flex-row md:px-8">
        <p>© {new Date().getFullYear()} InvisTierlist. All rights reserved.</p>
        <Link
          to="/admin/login"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 font-semibold text-foreground transition hover:border-primary/40 hover:text-primary"
        >
          <Shield className="h-3.5 w-3.5" />
          Admin Login
        </Link>
      </div>
    </footer>
  );
}
