"use client";

import { ShieldAlert, ShieldCheck } from "lucide-react";
import type React from "react";
import {
  CATALOG_CLAIM_CONSTRAINTS,
  type ClaimConstraintDefinition,
} from "@/physics/claimConstraints";
import { soundEngine } from "@/utils/soundEngine";

interface ClaimConstraintToggleProps {
  patentId: string;
  claimStates: Record<number, boolean>;
  onToggleClaim?: (claimNumber: number, isActive: boolean) => void;
  onClaimStateChange?: (claimNumber: number, isActive: boolean) => void;
  className?: string;
}

export const ClaimConstraintToggle: React.FC<ClaimConstraintToggleProps> = ({
  patentId,
  claimStates,
  onToggleClaim,
  onClaimStateChange,
  className = "",
}) => {
  const handleToggle = onToggleClaim ?? onClaimStateChange;
  const constraints = CATALOG_CLAIM_CONSTRAINTS[patentId] ?? [];
  if (constraints.length === 0) return null;

  return (
    <div
      data-testid="claim-constraint-toggle"
      data-claim-constraint-count={constraints.length}
      className={`flex flex-wrap items-center gap-2 ${className}`}
    >
      {constraints.map((c: ClaimConstraintDefinition) => {
        const isActive = claimStates[c.claimNumber] ?? true;

        return (
          <button
            key={c.claimNumber}
            type="button"
            data-claim-number={c.claimNumber}
            data-claim-active={isActive ? "true" : "false"}
            aria-pressed={isActive}
            aria-label={`Claim ${c.claimNumber} constraint ${isActive ? "active" : "inverted"}. ${isActive ? c.activeDescription : c.invertedDescription}`}
            disabled={!handleToggle}
            onClick={() => {
              soundEngine.playSwitchClick();
              handleToggle?.(c.claimNumber, !isActive);
            }}
            className={`flex min-h-11 items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-sans font-medium shadow-xs transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 disabled:cursor-not-allowed disabled:opacity-60 ${
              isActive
                ? "bg-emerald-600/10 dark:bg-emerald-500/15 border-emerald-500/30 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-600/20"
                : "bg-rose-600/15 dark:bg-rose-500/20 border-rose-500/40 text-rose-900 dark:text-rose-200 hover:bg-rose-600/25 ring-2 ring-rose-500/30"
            }`}
            title={
              isActive ? c.activeDescription : `${c.invertedDescription} (Click to restore Claim)`
            }
          >
            {isActive ? (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <ShieldAlert className="h-3.5 w-3.5 shrink-0 text-rose-600 motion-safe:animate-pulse dark:text-rose-400" />
            )}
            <span>
              Claim {c.claimNumber}: {isActive ? "Active (Patent Mode)" : "Constraint Inverted"}
            </span>
          </button>
        );
      })}
    </div>
  );
};
