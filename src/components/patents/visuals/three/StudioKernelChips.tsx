"use client";

import { useEffect, useState } from "react";

export type KernelChip = {
  label: string;
  value: string;
  unit?: string;
  tone?: "ok" | "warn" | "hot";
};

/**
 * Hook to manage HUD / UI Overlay visibility in 3D & 2D patent visual studios.
 *
 * Automatically initializes the HUD to hidden (false) on mobile viewports (< 768px)
 * to maximize the 3D viewport canvas and prevent callout chips from obstructing
 * touch interaction, while keeping it open (true) by default on desktop.
 *
 * Hydration-safe: initializes consistently on server and client, then detects
 * viewport size on mount.
 */
export function useResponsiveStudioHud(initialDesktop: boolean = true) {
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(initialDesktop);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 767px)");
    const apply = () => setShowUiOverlay(!mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return [showUiOverlay, setShowUiOverlay] as const;
}

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
      className={`absolute bottom-3 sm:bottom-4 z-10 pointer-events-none max-w-[min(100%-1.5rem,28rem)] ${
        side === "right" ? "right-3 sm:right-4" : "left-3 sm:left-4"
      }`}
    >
      <div className="bg-white/90 dark:bg-ink-900/90 backdrop-blur-md border border-parchment-300 dark:border-ink-700 rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 shadow-md">
        {title ? (
          <div className="text-[9px] sm:text-[10px] font-sans font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-1 sm:mb-1.5 truncate">
            {title}
          </div>
        ) : null}
        <div className="flex flex-wrap gap-1.5 sm:gap-2 max-h-[140px] sm:max-h-none overflow-y-auto">
          {chips.map((c) => (
            <div
              key={c.label}
              className={`rounded-lg px-1.5 py-0.5 sm:px-2 sm:py-1 border ${
                c.tone === "warn"
                  ? "bg-rose-500/15 border-rose-500/30 text-rose-800 dark:text-rose-200"
                  : c.tone === "hot"
                    ? "bg-amber-500/15 border-amber-500/30 text-amber-800 dark:text-amber-200"
                    : "bg-parchment-100/80 dark:bg-ink-800/80 border-parchment-200 dark:border-ink-700 text-ink-800 dark:text-parchment-100"
              }`}
            >
              <div className="text-[8px] sm:text-[9px] font-sans text-ink-500 dark:text-parchment-400 leading-tight">
                {c.label}
              </div>
              <div className="text-[10px] sm:text-[11px] font-mono font-bold leading-tight">
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
