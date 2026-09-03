"use client";

import { ClaimConstraintToggle } from "./ClaimConstraintToggle";

type KamenSegwayClaimHeaderProps = {
  patentId: string;
  title: string;
  description: string;
  claimStates: Record<number, boolean>;
  onToggleClaim: (claimNumber: number, active: boolean) => void;
};

/**
 * The two Segway views share the same source-bound claim controls while each
 * retains its own 2D or 3D instrumentation around this heading.
 */
export function KamenSegwayClaimHeader({
  patentId,
  title,
  description,
  claimStates,
  onToggleClaim,
}: KamenSegwayClaimHeaderProps) {
  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse" />
        <h3 className="font-mono text-sm font-semibold tracking-wider text-cyan-400 uppercase">
          {title}
        </h3>
      </div>
      <p className="text-xs text-slate-400 mt-0.5">{description}</p>
      <ClaimConstraintToggle
        patentId={patentId}
        claimStates={claimStates}
        onToggleClaim={onToggleClaim}
        className="mt-2"
      />
    </div>
  );
}
