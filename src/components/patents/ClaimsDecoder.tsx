"use client";

import { BookOpen, Scale, Sparkles } from "lucide-react";
import { useState } from "react";
import type { PatentClaim } from "@/types/patent";

interface ClaimsDecoderProps {
  claims: PatentClaim[];
}

export function ClaimsDecoder({ claims }: ClaimsDecoderProps) {
  const [activeClaimNum, setActiveClaimNum] = useState<number>(claims[0]?.number || 1);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-300 dark:border-ink-800 pb-3.5">
        <div className="flex items-center gap-2.5">
          <Scale className="w-5 h-5 text-amber-600 dark:text-amber-400" />
          <h3 className="font-serif text-lg sm:text-xl font-bold text-ink-950 dark:text-parchment-100">
            Legal Claims Decoder ({claims.length} Numbered Claims)
          </h3>
        </div>
        <div className="text-xs sm:text-sm font-sans text-ink-600 dark:text-ink-400">
          Compare dense legalistic claims directly with decoded plain-English functional
          specifications.
        </div>
      </div>

      {/* Claim Selector Pills */}
      <div className="flex flex-wrap gap-2.5">
        {claims.map((c) => (
          <button
            key={c.number}
            type="button"
            onClick={() => setActiveClaimNum(c.number)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-sans font-semibold transition-colors border shadow-xs ${
              activeClaimNum === c.number
                ? "bg-amber-700 text-white font-bold border-amber-800 dark:bg-amber-600 dark:border-amber-500 shadow"
                : "bg-parchment-100 dark:bg-ink-900 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-800 hover:bg-parchment-200 dark:hover:bg-ink-800"
            }`}
          >
            Claim #{c.number}{" "}
            <span className="font-normal opacity-80">
              {c.isIndependent ? "(Master Claim)" : `(Dep on #${c.dependsOn?.join(", ")})`}
            </span>
          </button>
        ))}
      </div>

      {/* Selected Claim Deep Dive Card */}
      {(() => {
        const claim = claims.find((c) => c.number === activeClaimNum);
        if (!claim) return null;
        return (
          <div
            key={claim.number}
            className="rounded-2xl border border-parchment-300 dark:border-ink-800 bg-parchment-50/90 dark:bg-ink-950 p-6 sm:p-8 shadow-patent space-y-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 font-sans text-sm font-bold border border-amber-300 dark:border-amber-700 shadow-2xs">
                  Claim #{claim.number}
                </span>
                <span className="text-sm font-sans text-ink-600 dark:text-ink-400 font-medium">
                  {claim.isIndependent
                    ? "Independent Master Claim"
                    : `Dependent Claim (Extends Claim ${claim.dependsOn?.join(", ")})`}
                </span>
              </div>
            </div>

            {/* Side-by-Side: Original Legal Prose vs Plain English Translation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Column 1: Historical Legal Text */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-sans font-bold text-ink-800 dark:text-parchment-300 uppercase tracking-wider">
                  <BookOpen className="w-4 h-4 text-amber-700 dark:text-amber-400" />
                  Verbatim Historical Legal Text
                </div>
                <div className="p-6 rounded-xl bg-parchment-100/80 dark:bg-ink-900/80 border border-parchment-200 dark:border-ink-800 text-base sm:text-lg font-serif text-ink-900 dark:text-parchment-100 leading-relaxed italic shadow-xs">
                  &ldquo;{claim.originalText}&rdquo;
                </div>
              </div>

              {/* Column 2: Plain English Translation */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-xs sm:text-sm font-sans font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4" />
                  Plain English Engineering Translation
                </div>
                <div className="p-6 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-base sm:text-lg text-ink-950 dark:text-emerald-100 leading-relaxed font-sans font-medium shadow-xs">
                  {claim.plainEnglish}
                </div>
              </div>
            </div>

            {/* Key Protected Innovations & Legal Significance */}
            <div
              className={`pt-2 grid grid-cols-1 gap-5 text-sm font-sans ${
                claim.legalSignificance ? "md:grid-cols-2" : ""
              }`}
            >
              <div className="p-4 rounded-xl bg-parchment-200/50 dark:bg-ink-900/60 border border-parchment-300 dark:border-ink-800 space-y-2.5 shadow-xs">
                <span className="font-bold text-ink-900 dark:text-parchment-100 block text-xs uppercase tracking-wider">
                  Key Protected Innovations:
                </span>
                <div className="flex flex-wrap gap-2">
                  {claim.keyInnovations.map((item) => (
                    <span
                      key={`${claim.number}-${item}`}
                      className="px-2.5 py-1 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800 text-xs sm:text-sm font-semibold"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {claim.legalSignificance ? (
                <div className="p-4 rounded-xl bg-parchment-200/50 dark:bg-ink-900/60 border border-parchment-300 dark:border-ink-800 space-y-2 shadow-xs">
                  <span className="font-bold text-ink-900 dark:text-parchment-100 block text-xs uppercase tracking-wider">
                    Historical Legal Impact:
                  </span>
                  <p className="text-ink-800 dark:text-ink-200 font-sans text-xs sm:text-sm leading-relaxed">
                    {claim.legalSignificance}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
