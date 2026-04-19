import { Link } from "@tanstack/react-router";
import { GAMEMODES, type PlayerRow as P, totalPoints, rankTitle, avatarUrl } from "@/lib/tiers";
import { TierBadge } from "./TierBadge";
import { Crown } from "lucide-react";

const RANK_GRADIENT = [
  "var(--gradient-rank-1)",
  "var(--gradient-rank-2)",
  "var(--gradient-rank-3)",
];

export function PlayerRow({ player, rank }: { player: P; rank: number }) {
  const points = totalPoints(player);
  const title = rankTitle(points);
  const isTop3 = rank <= 3;

  return (
    <Link
      to="/player/$username"
      params={{ username: player.username }}
      className="group relative grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-2xl border border-border bg-card/60 p-4 backdrop-blur-sm transition hover:border-primary/40 hover:bg-card md:grid-cols-[auto_2fr_auto_auto_auto] md:gap-6 md:px-5"
    >
      {/* Rank */}
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold"
        style={{
          background: isTop3 ? RANK_GRADIENT[rank - 1] : "var(--secondary)",
          color: isTop3 ? "oklch(0.18 0.02 260)" : "var(--foreground)",
          boxShadow: isTop3 ? "var(--shadow-glow)" : "none",
        }}
      >
        {rank === 1 ? <Crown className="h-5 w-5" /> : rank}
      </div>

      {/* Player */}
      <div className="flex min-w-0 items-center gap-3">
        <img
          src={avatarUrl(player.username, 64)}
          alt={player.username}
          className="h-12 w-12 rounded-lg border border-border"
          loading="lazy"
        />
        <div className="min-w-0">
          <div className="truncate text-base font-bold text-foreground">{player.username}</div>
          <div className="text-xs font-semibold text-primary">★ {title}</div>
        </div>
      </div>

      {/* Points */}
      <div className="hidden shrink-0 flex-col items-center md:flex">
        <div className="text-lg font-extrabold text-foreground">{points}</div>
        <div className="text-[9px] uppercase tracking-wider text-muted-foreground">Points</div>
      </div>

      {/* Region */}
      <div className="hidden shrink-0 md:block">
        <span className="rounded-full bg-primary/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
          {player.region}
        </span>
      </div>

      {/* Tiers */}
      <div className="col-span-3 flex flex-wrap items-start justify-end gap-2 md:col-span-1 md:gap-3">
        {GAMEMODES.map((g) => (
          <TierBadge key={g.key} tier={player[g.key]} label={g.label} icon={g.icon} />
        ))}
      </div>
    </Link>
  );
}
