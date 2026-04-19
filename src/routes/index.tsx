import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  GAMEMODES,
  OVERALL_ICON,
  totalPoints,
  tierPoints,
  type PlayerRow as P,
  type GamemodeKey,
} from "@/lib/tiers";
import { SiteHeader } from "@/components/SiteHeader";
import { PlayerRow } from "@/components/PlayerRow";
import { Search, Trophy } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "InvisTierlist — Minecraft PvP Tier Rankings" },
      {
        name: "description",
        content:
          "Official InvisTierlist rankings for Minecraft PvP gamemodes — Vanilla, Sword, Axe, Pot, NethOP, UHC, SMP and Mace.",
      },
      { property: "og:title", content: "InvisTierlist" },
      { property: "og:description", content: "Minecraft PvP tier rankings." },
    ],
  }),
  component: HomePage,
});

type Mode = "overall" | GamemodeKey;

function HomePage() {
  const [players, setPlayers] = useState<P[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<Mode>("overall");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase.from("players").select("*");
      if (!cancelled) {
        if (error) console.error(error);
        setPlayers((data as P[]) ?? []);
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    let list = [...players];
    if (mode !== "overall") {
      list = list.filter((p) => p[mode]);
      list.sort((a, b) => tierPoints(b[mode]) - tierPoints(a[mode]));
    } else {
      list.sort((a, b) => totalPoints(b) - totalPoints(a));
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.username.toLowerCase().includes(q));
    }
    return list;
  }, [players, mode, search]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 70% 45% at 50% -10%, oklch(0.78 0.18 80 / 0.18), transparent 60%)",
        }}
      />
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-6 md:px-8 md:pt-10">
        {/* Search */}
        <div className="mb-6 flex justify-center md:justify-end">
          <label className="relative inline-flex w-full items-center md:w-80">
            <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search player…"
              className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </label>
        </div>

        {/* Tabs */}
        <div className="mb-8 flex flex-wrap justify-center gap-2 border-b border-border pb-2 md:gap-3">
          <ModeTab
            active={mode === "overall"}
            onClick={() => setMode("overall")}
            label="Overall"
            icon={OVERALL_ICON}
          />
          {GAMEMODES.map((g) => (
            <ModeTab
              key={g.key}
              active={mode === g.key}
              onClick={() => setMode(g.key)}
              label={g.label}
              icon={g.icon}
            />
          ))}
        </div>

        {/* Player count */}
        <div className="mb-6 text-center text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">
          <Trophy className="mr-2 inline-block h-3.5 w-3.5 text-primary" />
          {filtered.length} Ranked Players
        </div>

        {/* List */}
        <div className="space-y-3">
          {loading ? (
            <div className="rounded-2xl border border-border bg-card/40 p-8 text-center text-sm text-muted-foreground">
              Loading rankings…
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card/40 p-12 text-center text-sm text-muted-foreground">
              No players ranked yet. Sign in to the admin panel to add players.
            </div>
          ) : (
            filtered.map((p, i) => <PlayerRow key={p.id} player={p} rank={i + 1} />)
          )}
        </div>
      </main>
    </div>
  );
}

function ModeTab({
  active,
  onClick,
  label,
  icon,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative inline-flex items-center gap-2 rounded-t-lg px-3 py-2.5 text-xs font-bold uppercase tracking-wider transition md:px-4 md:text-sm ${
        active
          ? "bg-card text-primary"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      <img src={icon} alt="" className="h-4 w-4 object-contain md:h-5 md:w-5" />
      {label}
      {active && (
        <span
          className="absolute -bottom-2 left-2 right-2 h-0.5 rounded-full"
          style={{ background: "var(--primary)", boxShadow: "0 0 12px var(--primary)" }}
        />
      )}
    </button>
  );
}
