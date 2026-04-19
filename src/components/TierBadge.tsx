import { tierColorVar } from "@/lib/tiers";

export function TierBadge({
  tier,
  label,
  icon,
}: {
  tier: string | null;
  label: string;
  icon: string;
}) {
  const color = tierColorVar(tier);
  const ranked = !!tier;
  return (
    <div className="flex flex-col items-center gap-1 min-w-[44px]">
      <div
        className="flex h-9 w-9 items-center justify-center rounded-full transition"
        style={{
          background: ranked ? `color-mix(in oklab, ${color} 25%, transparent)` : "transparent",
          border: `1px solid ${ranked ? color : "var(--border)"}`,
          opacity: ranked ? 1 : 0.35,
          boxShadow: ranked ? `0 0 14px -4px ${color}` : "none",
        }}
      >
        <img src={icon} alt={label} className="h-4 w-4 object-contain" />
      </div>
      <span
        className="text-[9px] font-bold uppercase tracking-wider"
        style={{ color: ranked ? "var(--foreground)" : "var(--muted-foreground)", opacity: ranked ? 1 : 0.5 }}
      >
        {label}
      </span>
      <span
        className="text-[9px] font-bold uppercase tracking-wider"
        style={{ color: ranked ? color : "transparent" }}
      >
        {tier ?? "—"}
      </span>
    </div>
  );
}
