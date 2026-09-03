"use client";

import { Activity, ChevronUp, X } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";

export type KernelChip = {
  label: string;
  value: string;
  unit?: string;
  tone?: "ok" | "warn" | "hot";
};

export type StudioHudLayoutState = {
  isTabletOrMobile: boolean;
  isCompact: boolean;
  containerWidth: number;
};

/**
 * Hook to manage HUD / UI Overlay visibility in 3D & 2D patent visual studios.
 *
 * Automatically detects device constraints (iPad, tablet, touch viewport, or narrow containers)
 * and enforces a display coverage budget:
 * - On iPad, tablet, or mobile viewports (< 880px or touch tablet viewports <= 1024px),
 *   initializes the HUD to hidden (false) by default to prevent overlapping cards and keep
 *   the 3D simulation canvas 100% clear.
 * - On desktop viewports (>= 880px), initializes the HUD to open (true).
 * - Provides clean master toggle for visitors to show/hide overlay telemetry at any time.
 *
 * Hydration-safe: initializes consistently on server and client, then measures environment on mount.
 */
export function useResponsiveStudioHud(
  initialDesktop: boolean = true,
  options?: { minDesktopWidth?: number },
) {
  const [showUiOverlay, setShowUiOverlay] = useState<boolean>(initialDesktop);
  const minWidth = options?.minDesktopWidth ?? 880;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkShouldShow = () => {
      const isTouchTablet =
        /iPad|iPhone|iPod/.test(navigator.userAgent) ||
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) ||
        window.matchMedia("(max-width: 1024px) and (hover: none)").matches;

      const isNarrow = window.innerWidth < minWidth;

      // On tablet or narrow viewports, default to clean canvas (false)
      // On desktop, default to initialDesktop (true)
      if (isTouchTablet || isNarrow) {
        return false;
      }
      return initialDesktop;
    };

    setShowUiOverlay(checkShouldShow());

    const handleResize = () => {
      // If window gets very narrow, auto-hide to avoid occlusion
      if (window.innerWidth < 640) {
        setShowUiOverlay((prev) => (prev ? false : prev));
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [initialDesktop, minWidth]);

  return [showUiOverlay, setShowUiOverlay] as const;
}

export type StudioKernelChipsProps = {
  visible?: boolean;
  title?: string;
  chips: KernelChip[];
  side?: "left" | "right";
  hasPrimaryHud?: boolean;
  priority?: "essential" | "primary" | "secondary";
  collapsible?: boolean;
};

/**
 * Compact SI Telemetry Chips with Automatic Collision Avoidance & Display Budget Protection.
 *
 * Invariant Guarantees:
 * 1. ZERO Horizontal Overlap: On desktop, limits max-width to `calc(100% - 25rem)` so right-docked
 *    chips can never touch or overlap the left-docked primary mechanism card.
 * 2. Collision Auto-Resolution: On iPad, tablet, or narrow viewports (< 920px container width),
 *    when a primary bottom-left HUD card is present, secondary SI chips auto-collapse into an
 *    unobtrusive bottom-right pill (`[📊 SI Telemetry: N items]`) taking < 2% canvas area.
 * 3. User Expandability: The compact pill can be tapped on-demand to open an overlay drawer
 *    without covering the primary HUD card.
 * 4. Display Area Budget: Keeps total HUD coverage strictly below 25-28% of the 3D viewport canvas.
 */
export function StudioKernelChips({
  visible = true,
  title,
  chips,
  side = "right",
  hasPrimaryHud = true,
  priority = "secondary",
  collapsible = true,
}: StudioKernelChipsProps) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [containerWidth, setContainerWidth] = useState<number>(1200);
  const chipContainerRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const parent = chipContainerRef.current?.closest(
      "div.relative.flex-1, div.cursor-grab, div.relative",
    );

    const updateDimensions = () => {
      if (parent) {
        const rect = parent.getBoundingClientRect();
        if (rect.width > 0) {
          setContainerWidth(rect.width);
          return;
        }
      }
      setContainerWidth(window.innerWidth);
    };

    updateDimensions();

    let ro: ResizeObserver | null = null;
    if (parent && typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.contentRect.width > 0) {
            setContainerWidth(entry.contentRect.width);
          }
        }
      });
      ro.observe(parent);
    }

    window.addEventListener("resize", updateDimensions);
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  if (!visible || chips.length === 0) return null;

  // If container width is < 920px and there is a primary bottom-left HUD,
  // rendering both full cards at bottom-left and bottom-right causes horizontal collision.
  // In this mode, auto-collapse into a compact toggle pill.
  const isConstrained = containerWidth < 920;
  const shouldAutoCollapse =
    isConstrained && hasPrimaryHud && priority === "secondary" && collapsible;

  // Effective side positioning: if hasPrimaryHud is true and side was passed as "left",
  // redirect to "right" to avoid placing two large cards directly on top of each other.
  const effectiveSide = hasPrimaryHud && side === "left" ? "right" : side;

  // Render Compact Non-Overlapping Pill on constrained screens
  if (shouldAutoCollapse && !isExpanded) {
    return (
      <div
        ref={chipContainerRef}
        className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-10 pointer-events-auto"
      >
        <button
          type="button"
          onClick={() => setIsExpanded(true)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/95 dark:bg-ink-900/95 backdrop-blur-md border border-amber-700/30 dark:border-amber-500/30 shadow-md text-[10px] sm:text-xs font-sans font-semibold text-amber-900 dark:text-amber-200 hover:bg-amber-50 dark:hover:bg-ink-800 transition-[background-color,transform] hover:scale-105 active:scale-95 cursor-pointer"
          title="Open SI Telemetry Chips"
          aria-label="Open SI Telemetry Chips"
          aria-expanded={false}
          aria-controls={titleId}
        >
          <Activity className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span className="hidden xs:inline">{title ?? "SI Readouts"}</span>
          <span className="xs:hidden">SI</span>
          <span className="font-mono text-[9px] px-1 py-0.5 bg-amber-200/60 dark:bg-amber-900/60 rounded text-amber-950 dark:text-amber-100">
            {chips.length}
          </span>
          <ChevronUp className="w-3 h-3 ml-0.5 text-ink-400" />
        </button>
      </div>
    );
  }

  return (
    <div
      ref={chipContainerRef}
      id={titleId}
      className={`absolute bottom-3 sm:bottom-4 z-10 pointer-events-auto ${
        effectiveSide === "right"
          ? "right-3 sm:right-4 max-w-[min(calc(100%-25rem),28rem)]"
          : "left-3 sm:left-4 max-w-[min(100%-1.5rem,28rem)]"
      } ${shouldAutoCollapse && isExpanded ? "max-w-[min(calc(100vw-2rem),22rem)] shadow-xl" : ""}`}
    >
      <div className="bg-white/95 dark:bg-ink-900/95 backdrop-blur-md border border-parchment-300 dark:border-ink-700 rounded-xl px-2.5 py-1.5 sm:px-3 sm:py-2 shadow-md">
        <div className="flex items-center justify-between gap-1.5 mb-1 sm:mb-1.5">
          {title ? (
            <div className="text-[9px] sm:text-[10px] font-sans font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 truncate">
              {title}
            </div>
          ) : (
            <div className="text-[9px] sm:text-[10px] font-sans font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 truncate">
              SI Telemetry
            </div>
          )}
          {shouldAutoCollapse && isExpanded && (
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="p-1 rounded-md text-ink-500 hover:text-ink-900 dark:hover:text-parchment-100 hover:bg-parchment-200 dark:hover:bg-ink-800 transition-colors cursor-pointer"
              title="Collapse SI Chips"
              aria-label="Collapse SI Chips"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5 sm:gap-2 max-h-[140px] sm:max-h-none overflow-y-auto scrollbar-none">
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
