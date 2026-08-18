"use client";

export type KernelChip = {
  label: string;
  value: string;
  unit?: string;
  tone?: "ok" | "warn" | "hot";
};

/** Compact SI chips on catalog 3D faces. Numbers must come from the shared step. */
export function StudioKernelChips({
  visible,
  title,
  chips,
  side = "left",
}: {
  visible: boolean;
  title?: string;
  chips: KernelChip[];
  side?: "left" | "right";
}) {
  if (!visible || chips.length === 0) return null;
  return (
    <div
      className={`absolute bottom-4 z-10 pointer-events-none max-w-[min(100%-2rem,28rem)] ${
        side === "right" ? "right-4" : "left-4"
      }`}
    >
      <div className="bg-parchment-950/85 backdrop-blur-md border border-parchment-700/60 rounded-xl px-3 py-2 shadow-lg">
        {title ? (
          <div className="text-[10px] font-mono uppercase tracking-wider text-amber-300/90 mb-1.5">
            {title}
          </div>
        ) : null}
        <div className="flex flex-wrap gap-2">
          {chips.map((c) => (
            <div
              key={c.label}
              className={`rounded-lg px-2 py-1 border ${
                c.tone === "warn"
                  ? "bg-rose-950/50 border-rose-500/40"
                  : c.tone === "hot"
                    ? "bg-amber-950/50 border-amber-500/40"
                    : "bg-parchment-900/70 border-parchment-700/50"
              }`}
            >
              <div className="text-[9px] font-mono text-parchment-400">{c.label}</div>
              <div className="text-[11px] font-mono font-bold text-parchment-100">
                {c.value}
                {c.unit ? <span className="text-parchment-400 font-normal"> {c.unit}</span> : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
