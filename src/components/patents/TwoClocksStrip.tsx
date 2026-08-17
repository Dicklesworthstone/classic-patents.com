"use client";

interface ClockFace {
  name: string;
  period: string;
  scale: string;
  detail: string;
}

interface TwoClocksStripProps {
  title: string;
  fast: ClockFace;
  slow: ClockFace;
}

export function TwoClocksStrip({ title, fast, slow }: TwoClocksStripProps) {
  return (
    <div className="rounded-xl border border-parchment-300 dark:border-ink-800 bg-white/70 dark:bg-ink-900/70 p-3 space-y-2">
      <div className="text-[10px] font-mono uppercase tracking-wider text-ink-500 dark:text-ink-400">
        Two clocks · {title}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {[fast, slow].map((clock) => (
          <div
            key={clock.name}
            className="rounded-lg border border-parchment-200 dark:border-ink-800 px-3 py-2"
          >
            <div className="text-[10px] font-mono text-ink-500 dark:text-ink-400">{clock.name}</div>
            <div className="font-mono text-sm font-bold text-ink-950 dark:text-parchment-50">
              {clock.period}
              <span className="ml-1 text-[10px] font-medium text-ink-500">{clock.scale}</span>
            </div>
            <div className="text-[11px] font-sans text-ink-600 dark:text-ink-400 leading-snug">
              {clock.detail}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
