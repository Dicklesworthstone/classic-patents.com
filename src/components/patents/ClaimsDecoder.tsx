"use client";

import { BookOpen, Scale, Sparkles } from "lucide-react";
import { useState } from "react";
import type { PatentClaim } from "@/types/patent";

interface ClaimsDecoderProps {
  claims: PatentClaim[];
}

export function ClaimsDecoder({ claims }: ClaimsDecoderProps) {
  const [activeClaimNum, setActiveClaimNum] = useState<number>(claims[0]?.number || 1);
  const [_expandedAll, _setExpandedAll] = useState<boolean>(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-300 dark:border-ink-800 pb-3">
        <div className="flex items-center gap-2">
          <Scale className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <h3 className="font-serif text-base font-bold text-ink-900 dark:text-parchment-100">
            Legal Claims Decoder ({claims.length} Numbered Claims)
          </h3>
        </div>
        <div className="text-xs font-mono text-ink-600 dark:text-ink-400">
          Compare dense legalistic claims directly with decoded plain-English functional
          specifications.
        </div>
      </div>

      {/* Claim Selector Pills */}
      <div className="flex flex-wrap gap-2">
        {claims.map((c) => (
          <button
            key={c.number}
            type="button"
            onClick={() => setActiveClaimNum(c.number)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors border ${
              activeClaimNum === c.number
                ? "bg-amber-700 text-white font-bold border-amber-800 dark:bg-amber-600 dark:border-amber-500 shadow-sm"
                : "bg-parchment-100 dark:bg-ink-900 text-ink-700 dark:text-ink-300 border-parchment-300 dark:border-ink-800 hover:bg-parchment-200 dark:hover:bg-ink-800"
            }`}
          >
            Claim {c.number}{" "}
            {c.isIndependent
              ? "(Independent Master Claim)"
              : `(Dep on #${c.dependsOn?.join(", ")})`}
          </button>
        ))}
      </div>

      {/* Selected Claim Deep Dive Card */}
      {claims
        .filter((c) => c.number === activeClaimNum)
        .map((claim) => (
          <div
            key={claim.number}
            className="rounded-xl border border-parchment-300 dark:border-ink-800 bg-parchment-50 dark:bg-ink-950 p-6 shadow-patent space-y-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-parchment-200 dark:border-ink-800 pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-mono text-xs font-bold border border-amber-300 dark:border-amber-700">
                  Claim #{claim.number}
                </span>
                <span className="text-xs font-mono text-ink-500">
                  {claim.isIndependent
                    ? "Independent Master Claim"
                    : `Dependent Claim (Extends Claim ${claim.dependsOn?.join(", ")})`}
                </span>
              </div>
            </div>

            {/* Side-by-Side: Original Legal Prose vs Plain English Translation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Column 1: Historical Legal Text */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-ink-700 dark:text-parchment-300 uppercase tracking-wider">
                  <BookOpen className="w-3.5 h-3.5 text-amber-700" />
                  Verbatim Historical Legal Text
                </div>
                <div className="p-4 rounded-lg bg-parchment-100 dark:bg-ink-900 border border-parchment-200 dark:border-ink-800 text-xs font-mono text-ink-800 dark:text-parchment-200 leading-relaxed italic">
                  &ldquo;{claim.originalText}&rdquo;
                </div>
              </div>

              {/* Column 2: Plain English Translation */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  Plain English Engineering Translation
                </div>
                <div className="p-4 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-xs text-ink-900 dark:text-emerald-100 leading-relaxed font-sans font-medium">
                  {claim.plainEnglish}
                </div>
              </div>
            </div>

            {/* Key Protected Innovations & Legal Significance */}
            <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3.5 rounded-lg bg-parchment-200/50 dark:bg-ink-900/60 border border-parchment-300 dark:border-ink-800 space-y-2">
                <span className="font-bold text-ink-800 dark:text-parchment-200 block">
                  Key Protected Innovations:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {claim.keyInnovations.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800 text-[11px]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-lg bg-parchment-200/50 dark:bg-ink-900/60 border border-parchment-300 dark:border-ink-800 space-y-1">
                <span className="font-bold text-ink-800 dark:text-parchment-200 block">
                  Historical Legal Impact:
                </span>
                <p className="text-ink-700 dark:text-ink-300 font-sans text-xs leading-normal">
                  {claim.legalSignificance}
                </p>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
