import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  GAMEMODES,
  type PlayerRow as P,
  totalPoints,
  rankTitle,
  tierPoints,
  tierColorVar,
  avatarUrl,
} from "@/lib/tiers";
import { SiteHeader } from "@/components/SiteHeader";
import { ArrowLeft, Crown, Trophy } from "lucide-react";

export const Route = createFileRoute("/player/$username")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.username} — InvisTierlist Profile` },
      {
        name: "description",
        content: `Tier rankings and PvP profile for ${params.username} on InvisTierlist.`,
      },
      { property: "og:title", content: `${params.username} — InvisTierlist` },
      {
        property: "og:description",
        content: `View ${params.username}'s Minecraft PvP tiers across all gamemodes.`,
      },
      { property: "og:image", content: `https://mc-heads.net/body/${params.username}/256` },
    ],
  }),
  component: PlayerProfilePage,
  notFoundComponent: () => (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-3xl font-extrabold">Player not found</h1>
        <p className="mt-2 text-muted-foreground">We couldn't find that player.</p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to rankings
        </Link>
      </div>
    </div>
  ),
});

function PlayerProfilePage() {
  const { username } = useParams({ from: "/player/$username" });
  const [player, setPlayer] = useState<P | null>(null);
  const [overallRank, setOverallRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.from("players").select("*");
      if (cancelled) return;
      const list = (data as P[]) ?? [];
      list.sort((a, b) => totalPoints(b) - totalPoints(a));
      const found = list.find((p) => p.username.toLowerCase() === username.toLowerCase());
      if (found) {
        setPlayer(found);
        setOverallRank(list.indexOf(found) + 1);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteHeader />
        <div className="mx-auto max-w-5xl px-4 py-20 text-center text-sm text-muted-foreground">
          Loading profile…
        </div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <SiteHeader />
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h1 className="text-3xl font-extrabold">Player not found</h1>
          <p className="mt-2 text-muted-foreground">
            No player named "{username}" is ranked yet.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to rankings
          </Link>
        </div>
      </div>
    );
  }

  const points = totalPoints(player);
  const title = rankTitle(points);
  const rankedModes = GAMEMODES.filter((g) => player[g.key]).length;

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

      <main className="mx-auto max-w-5xl px-4 pb-20 pt-6 md:px-8 md:pt-10">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition hover:text-primary"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to rankings
        </Link>

        {/* Hero card */}
        <div className="overflow-hidden rounded-3xl border border-border bg-card/60 backdrop-blur-sm">
          <div
            className="h-32 w-full"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.78 0.18 80 / 0.4), oklch(0.62 0.18 270 / 0.3))",
            }}
          />
          <div className="flex flex-col gap-6 p-6 md:flex-row md:items-end md:gap-8 md:p-8">
            <img
              src={`https://mc-heads.net/body/${encodeURIComponent(player.username)}/192`}
              alt={player.username}
              className="-mt-24 h-40 w-auto self-start drop-shadow-2xl md:-mt-32 md:h-56"
            />
            <div className="flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-primary/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary">
                  {player.region}
                </span>
                {overallRank !== null && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-foreground">
                    {overallRank === 1 ? <Crown className="h-3 w-3 text-primary" /> : <Trophy className="h-3 w-3 text-primary" />}
                    Rank #{overallRank}
                  </span>
                )}
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">{player.username}</h1>
              <div className="mt-1 text-sm font-semibold text-primary">★ {title}</div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <Stat label="Points" value={points} />
                <Stat label="Ranked Modes" value={`${rankedModes}/${GAMEMODES.length}`} />
                <Stat label="Tier Title" value={title} small />
              </div>
            </div>
          </div>
        </div>

        {/* Tier breakdown */}
        <div className="mt-8">
          <div className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground">
            Tier Breakdown
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {GAMEMODES.map((g) => {
              const tier = player[g.key];
              const color = tierColorVar(tier);
              const ranked = !!tier;
              return (
                <div
                  key={g.key}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-card/60 p-4 transition hover:border-primary/30"
                  style={{
                    boxShadow: ranked ? `0 0 24px -12px ${color}` : "none",
                    opacity: ranked ? 1 : 0.55,
                  }}
                >
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      background: ranked
                        ? `color-mix(in oklab, ${color} 20%, transparent)`
                        : "var(--secondary)",
                      border: `1px solid ${ranked ? color : "var(--border)"}`,
                    }}
                  >
                    <img src={g.icon} alt="" className="h-6 w-6 object-contain" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      {g.label}
                    </div>
                    <div
                      className="text-xl font-extrabold"
                      style={{ color: ranked ? color : "var(--muted-foreground)" }}
                    >
                      {tier ?? "Unranked"}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-foreground">{tierPoints(tier)}</div>
                    <div className="text-[9px] uppercase tracking-wider text-muted-foreground">pts</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

function Stat({ label, value, small }: { label: string; value: string | number; small?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-background/40 px-3 py-2.5">
      <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className={`font-extrabold text-foreground ${small ? "text-sm" : "text-xl"}`}>
        {value}
      </div>
    </div>
  );
}
