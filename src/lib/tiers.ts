import iconVanilla from "@/assets/icon-vanilla.svg";
import iconSword from "@/assets/icon-sword.svg";
import iconAxe from "@/assets/icon-axe.svg";
import iconPot from "@/assets/icon-pot.svg";
import iconNethop from "@/assets/icon-nethop.svg";
import iconUhc from "@/assets/icon-uhc.svg";
import iconSmp from "@/assets/icon-smp.svg";
import iconMace from "@/assets/icon-mace.png";
import iconOverall from "@/assets/icon-overall.png";

export const OVERALL_ICON = iconOverall;

export const GAMEMODES = [
  { key: "vanilla", label: "Vanilla", icon: iconVanilla },
  { key: "sword", label: "Sword", icon: iconSword },
  { key: "axe", label: "Axe", icon: iconAxe },
  { key: "pot", label: "Pot", icon: iconPot },
  { key: "nethop", label: "NethOP", icon: iconNethop },
  { key: "uhc", label: "UHC", icon: iconUhc },
  { key: "smp", label: "SMP", icon: iconSmp },
  { key: "mace", label: "Mace", icon: iconMace },
] as const;

export type GamemodeKey = (typeof GAMEMODES)[number]["key"];

export const TIER_OPTIONS = [
  "HT1", "LT1", "HT2", "LT2", "HT3", "LT3", "HT4", "LT4", "HT5", "LT5",
] as const;

export type Tier = (typeof TIER_OPTIONS)[number];

// Points per tier (used to rank players overall)
const TIER_POINTS: Record<string, number> = {
  HT1: 60, LT1: 50, HT2: 42, LT2: 35, HT3: 28, LT3: 22,
  HT4: 16, LT4: 12, HT5: 8, LT5: 4,
};

export function tierPoints(tier: string | null | undefined): number {
  if (!tier) return 0;
  return TIER_POINTS[tier] ?? 0;
}

export type PlayerRow = {
  id: string;
  username: string;
  region: string;
  vanilla: string | null;
  sword: string | null;
  axe: string | null;
  pot: string | null;
  nethop: string | null;
  uhc: string | null;
  smp: string | null;
  mace: string | null;
};

export function totalPoints(p: PlayerRow): number {
  return GAMEMODES.reduce((sum, g) => sum + tierPoints(p[g.key]), 0);
}

export function tierColorVar(tier: string | null | undefined): string {
  if (!tier) return "var(--muted-foreground)";
  return `var(--tier-${tier.toLowerCase()})`;
}

export function rankTitle(points: number): string {
  if (points >= 200) return "Combat Master";
  if (points >= 120) return "Combat Ace";
  if (points >= 70) return "Combat Novice";
  if (points >= 30) return "Rookie";
  return "Cadet";
}

export function avatarUrl(username: string, size = 64): string {
  return `https://mc-heads.net/avatar/${encodeURIComponent(username)}/${size}`;
}
