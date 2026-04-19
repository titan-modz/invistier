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

        <div className="flex items-center gap-2">
          <a
            href="https://discord.gg/aMYZjP2Kc7"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground transition hover:border-[#5865F2]/60 hover:text-[#5865F2]"
            aria-label="Join our Discord"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
              <path d="M20.317 4.369A19.79 19.79 0 0 0 16.558 3.2a.074.074 0 0 0-.079.037c-.34.6-.719 1.384-.984 2.001a18.27 18.27 0 0 0-5.487 0 12.51 12.51 0 0 0-.997-2.001.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 5.169 4.37a.07.07 0 0 0-.032.027C2.355 8.578 1.591 12.679 1.965 16.728a.082.082 0 0 0 .031.056 19.9 19.9 0 0 0 5.993 3.03.077.077 0 0 0 .084-.027c.462-.63.873-1.295 1.226-1.995a.076.076 0 0 0-.041-.105 13.118 13.118 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.927 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.009c.12.099.246.198.373.292a.077.077 0 0 1-.006.128 12.3 12.3 0 0 1-1.873.891.077.077 0 0 0-.04.106c.36.7.772 1.364 1.225 1.994a.076.076 0 0 0 .084.028 19.84 19.84 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-4.687-.838-8.755-3.548-12.333a.061.061 0 0 0-.031-.028zM8.02 14.262c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.974 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
            Discord
          </a>
          <Link
            to="/admin/login"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold text-foreground transition hover:border-primary/40 hover:text-primary"
          >
            <Shield className="h-3.5 w-3.5" />
            Admin
          </Link>
        </div>
      </div>
    </header>
  );
}
