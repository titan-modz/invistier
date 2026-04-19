import { tierColorVar } from "@/lib/tiers";

export function TierBadge({ tier, label }: { tier: string | null; label: string }) {
  const color = tierColorVar(tier);
  return (
    <div className="flex flex-col items-center gap-1 min-w-[44px]">
      <div
        className="flex h-9 w-9 items-center justify-center rounded-full text-[10px] font-bold"
        style={{
          background: tier ? `color-mix(in oklab, ${color} 22%, transparent)` : "transparent",
          color: tier ? color : "var(--muted-foreground)",
          border: `1px solid ${tier ? color : "var(--border)"}`,
          opacity: tier ? 1 : 0.4,
        }}
      >
        {tier ?? "—"}
      </div>
      <span className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</span>
    </div>
  );
}
