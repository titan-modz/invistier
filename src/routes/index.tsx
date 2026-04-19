import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { GAMEMODES, totalPoints, type PlayerRow as P, type GamemodeKey } from "@/lib/tiers";
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
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.username.toLowerCase().includes(q));
    }
    list.sort((a, b) => totalPoints(b) - totalPoints(a));
    return list;
  }, [players, mode, search]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div
        className="pointer-events-none fixed inset-0 -z-10 opacity-50"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, oklch(0.78 0.18 80 / 0.18), transparent 60%)",
        }}
      />
      <SiteHeader />

      <main className="mx-auto max-w-7xl px-4 pb-20 pt-8 md:px-8">
        {/* Hero */}
        <section className="mb-10 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-semibold text-muted-foreground">
            <Trophy className="h-3.5 w-3.5 text-primary" />
            {filtered.length} Ranked Players
          </div>
          <h1 className="text-balance text-4xl font-extrabold tracking-tight md:text-5xl">
            The <span className="text-primary">Invisible</span> Tier List
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
            Competitive Minecraft PvP rankings across all major gamemodes.
          </p>
        </section>

        {/* Tabs + search */}
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            <ModeTab active={mode === "overall"} onClick={() => setMode("overall")} label="Overall" />
            {GAMEMODES.map((g) => (
              <ModeTab
                key={g.key}
                active={mode === g.key}
                onClick={() => setMode(g.key)}
                label={g.label}
              />
            ))}
          </div>
          <label className="relative inline-flex items-center md:w-72">
            <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search player…"
              className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
          </label>
        </div>

        {/* List */}
        <div className="space-y-3">
          {loading ? (
            <div className="rounded-2xl border border-border bg-card/40 p-8 text-center text-sm text-muted-foreground">
              Loading rankings…
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card/40 p-8 text-center text-sm text-muted-foreground">
              No players yet. Sign in to the admin panel to add some.
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
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${
        active
          ? "border-primary bg-primary/15 text-primary"
          : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}
