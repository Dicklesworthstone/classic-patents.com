"use client";

import type { ReactNode } from "react";

export type StudioOverlayAction = {
  readonly id: string;
  readonly ariaLabel: string;
  readonly title: string;
  readonly onClick: () => void;
  readonly className: string;
  readonly content: ReactNode;
  readonly pressed?: boolean;
};

type StudioOverlayActionToolbarProps = {
  readonly actions: readonly StudioOverlayAction[];
  readonly className?: string;
};

/**
 * Shared presentation shell for the persistent controls layered over a Three.js
 * patent studio. The actions remain supplied by each patent visual, so this
 * component owns no camera, audio, telemetry, or physics state.
 */
export function StudioOverlayActionToolbar({
  actions,
  className = "absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex items-center gap-1.5 sm:gap-2 pointer-events-auto",
}: StudioOverlayActionToolbarProps) {
  return (
    <div className={className}>
      {actions.map((action) => (
        <button
          key={action.id}
          type="button"
          onClick={action.onClick}
          aria-label={action.ariaLabel}
          aria-pressed={action.pressed}
          className={action.className}
          title={action.title}
        >
          {action.content}
        </button>
      ))}
    </div>
  );
}
