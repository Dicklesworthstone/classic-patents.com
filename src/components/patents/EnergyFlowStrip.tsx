"use client";

export interface EnergyChannel {
  name: string;
  watts: number;
  tone: "in" | "useful" | "loss";
}

interface EnergyFlowStripProps {
  title: string;
  channels: EnergyChannel[];
}

export function EnergyFlowStrip({ title, channels }: EnergyFlowStripProps) {
  const max = Math.max(1, ...channels.map((c) => Math.abs(c.watts)));
  return (
    <div className="rounded-xl border border-parchment-300 dark:border-ink-800 bg-white/70 dark:bg-ink-900/70 p-3 space-y-2">
      <div className="text-[10px] font-mono uppercase tracking-wider text-ink-500 dark:text-ink-400">
        Energy · {title}
      </div>
      <div className="space-y-1.5">
        {channels.map((ch) => {
          const pct = Math.min(100, (Math.abs(ch.watts) / max) * 100);
          const bar =
            ch.tone === "loss"
              ? "bg-rose-500"
              : ch.tone === "useful"
                ? "bg-emerald-500"
                : "bg-amber-500";
          return (
            <div key={ch.name} className="grid grid-cols-[7rem_1fr_4.5rem] items-center gap-2">
              <span className="text-[10px] font-mono text-ink-600 dark:text-ink-400 truncate">
                {ch.name}
              </span>
              <div className="h-1.5 rounded-full bg-parchment-200 dark:bg-ink-800 overflow-hidden">
                <div className={`h-full ${bar}`} style={{ width: `${pct}%` }} />
              </div>
              <span className="text-[10px] font-mono text-right text-ink-800 dark:text-parchment-200">
                {Math.round(ch.watts).toLocaleString()} W
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
