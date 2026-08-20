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
      <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 rounded-xl px-3 py-2 shadow-md">
        {title ? (
          <div className="text-[10px] font-sans font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1.5">
            {title}
          </div>
        ) : null}
        <div className="flex flex-wrap gap-2">
          {chips.map((c) => (
            <div
              key={c.label}
              className={`rounded-lg px-2 py-1 border ${
                c.tone === "warn"
                  ? "bg-rose-500/15 border-rose-500/30 text-rose-800 dark:text-rose-200"
                  : c.tone === "hot"
                    ? "bg-amber-500/15 border-amber-500/30 text-amber-800 dark:text-amber-200"
                    : "bg-parchment-100/80 dark:bg-ink-800/80 border-parchment-200 dark:border-ink-700 text-ink-800 dark:text-parchment-100"
              }`}
            >
              <div className="text-[9px] font-sans text-ink-500 dark:text-parchment-400">
                {c.label}
              </div>
              <div className="text-[11px] font-mono font-bold">
                {c.value}
                {c.unit ? (
                  <span className="text-ink-500 dark:text-parchment-400 font-normal">
                    {" "}
                    {c.unit}
                  </span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
