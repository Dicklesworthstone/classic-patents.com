"use client";

interface MaterialCardProps {
  name: string;
  formula: string;
  role: string;
  numbers: { label: string; value: string }[];
}

export function MaterialCard({ name, formula, role, numbers }: MaterialCardProps) {
  return (
    <div className="rounded-xl border border-parchment-300 dark:border-ink-800 bg-white/70 dark:bg-ink-900/70 p-3 space-y-1.5">
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-serif text-sm font-bold text-ink-950 dark:text-parchment-50">
          {name}
        </span>
        <span className="font-mono text-[10px] text-amber-800 dark:text-amber-400">{formula}</span>
      </div>
      <p className="text-[11px] font-sans text-ink-600 dark:text-ink-400 leading-snug">{role}</p>
      <dl className="grid grid-cols-2 gap-x-3 gap-y-1">
        {numbers.map((n) => (
          <div key={n.label}>
            <dt className="text-[9px] font-mono uppercase tracking-wider text-ink-500">
              {n.label}
            </dt>
            <dd className="font-mono text-xs font-bold text-ink-900 dark:text-parchment-100">
              {n.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
