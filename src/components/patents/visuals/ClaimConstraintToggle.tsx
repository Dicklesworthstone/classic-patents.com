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
  onToggleClaim: (claimNumber: number, isActive: boolean) => void;
  className?: string;
}

export const ClaimConstraintToggle: React.FC<ClaimConstraintToggleProps> = ({
  patentId,
  claimStates,
  onToggleClaim,
  className = "",
}) => {
  const constraints = CATALOG_CLAIM_CONSTRAINTS[patentId] ?? [];
  if (constraints.length === 0) return null;

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      {constraints.map((c: ClaimConstraintDefinition) => {
        const isActive = claimStates[c.claimNumber] ?? true;

        return (
          <button
            key={c.claimNumber}
            type="button"
            onClick={() => {
              soundEngine.playSwitchClick();
              onToggleClaim(c.claimNumber, !isActive);
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-sans font-medium transition-all shadow-xs border ${
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
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 shrink-0 animate-pulse" />
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
