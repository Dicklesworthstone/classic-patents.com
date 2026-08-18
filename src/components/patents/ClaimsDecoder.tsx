"use client";

import { BookOpen, Check, ChevronLeft, ChevronRight, Copy, Scale, Sparkles } from "lucide-react";
import { useCallback, useState } from "react";
import { TextWithLatex } from "@/components/ui/LatexRenderer";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import { WRIGHT_PATENT_ID } from "@/physics/wrightKernel";
import type { PatentClaim } from "@/types/patent";

interface ClaimsDecoderProps {
  claims: PatentClaim[];
  patentId?: string;
}

function claimLiveState(
  patentId: string | undefined,
  claimNum: number,
  params: Record<string, number>,
): "held" | "broken" | null {
  if (patentId === WRIGHT_PATENT_ID && claimNum === 1) {
    return (params.coupled ?? 1) >= 0.5 ? "held" : "broken";
  }
  return null;
}

export function ClaimsDecoder({ claims, patentId }: ClaimsDecoderProps) {
  const [activeClaimNum, setActiveClaimNum] = useState<number>(claims[0]?.number || 1);
  const [copied, setCopied] = useState<boolean>(false);
  const { params } = usePatentPhysics(patentId || "");

  const activeIndex = claims.findIndex((c) => c.number === activeClaimNum);
  const claim = claims[activeIndex] || claims[0];

  const handleCopyClaim = useCallback(() => {
    if (!claim) return;
    const textToCopy = `[Claim ${claim.number} · ${claim.isIndependent ? "Independent" : `Dependent on #${claim.dependsOn?.join(", ")}`}]\n\nOriginal Text:\n"${claim.originalText}"\n\nPlain English Translation:\n${claim.plainEnglish}\n\nKey Innovations:\n${claim.keyInnovations.join(", ")}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [claim]);

  const selectPrevClaim = () => {
    if (activeIndex > 0) {
      setActiveClaimNum(claims[activeIndex - 1].number);
    }
  };

  const selectNextClaim = () => {
    if (activeIndex < claims.length - 1) {
      setActiveClaimNum(claims[activeIndex + 1].number);
    }
  };

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
      <div className="flex flex-wrap gap-2">
        {claims.map((c) => {
          const live = claimLiveState(patentId, c.number, params);
          const isSelected = activeClaimNum === c.number;

          return (
            <button
              key={c.number}
              type="button"
              onClick={() => setActiveClaimNum(c.number)}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-sans font-semibold transition-all border shadow-2xs cursor-pointer ${
                isSelected
                  ? "bg-amber-700 text-white font-bold border-amber-800 dark:bg-amber-600 dark:border-amber-500 shadow-sm ring-2 ring-amber-400/40"
                  : live === "broken"
                    ? "bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-200 border-red-400 dark:border-red-800"
                    : live === "held"
                      ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border-emerald-400 dark:border-emerald-800"
                      : "bg-parchment-100 dark:bg-ink-900 text-ink-800 dark:text-ink-200 border-parchment-300 dark:border-ink-800 hover:bg-parchment-200 dark:hover:bg-ink-800"
              }`}
            >
              Claim #{c.number}{" "}
              <span className="font-normal opacity-80 text-[11px]">
                {c.isIndependent ? "(Independent)" : `(Dep #${c.dependsOn?.join(", ")})`}
                {live === "broken" ? " · uncoupled" : live === "held" ? " · held" : ""}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Claim Deep Dive Card */}
      {claim && (
        <div
          key={claim.number}
          className="rounded-3xl border border-parchment-300 dark:border-ink-800 bg-parchment-50/90 dark:bg-ink-950 p-6 sm:p-8 shadow-patent space-y-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-200 dark:border-ink-800 pb-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 font-sans text-sm font-bold border border-amber-300 dark:border-amber-700 shadow-2xs">
                Claim #{claim.number}
              </span>
              <span className="text-sm font-sans text-ink-700 dark:text-ink-300 font-medium">
                {claim.isIndependent
                  ? "Independent Master Claim"
                  : `Dependent Claim (Extends Claim ${claim.dependsOn?.join(", ")})`}
              </span>
            </div>

            {/* Actions: Prev/Next & Copy */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-parchment-200 dark:bg-ink-900 p-1 rounded-xl border border-parchment-300 dark:border-ink-800">
                <button
                  type="button"
                  onClick={selectPrevClaim}
                  disabled={activeIndex === 0}
                  className="p-1 rounded-lg text-ink-700 dark:text-parchment-300 hover:bg-parchment-300 dark:hover:bg-ink-800 disabled:opacity-30 transition-colors cursor-pointer"
                  title="Previous Claim"
                  aria-label="Previous Claim"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono text-ink-500 px-1.5 font-semibold">
                  {activeIndex + 1}/{claims.length}
                </span>
                <button
                  type="button"
                  onClick={selectNextClaim}
                  disabled={activeIndex === claims.length - 1}
                  className="p-1 rounded-lg text-ink-700 dark:text-parchment-300 hover:bg-parchment-300 dark:hover:bg-ink-800 disabled:opacity-30 transition-colors cursor-pointer"
                  title="Next Claim"
                  aria-label="Next Claim"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleCopyClaim}
                className="px-3 py-1.5 rounded-xl border border-parchment-300 dark:border-ink-800 bg-parchment-100 dark:bg-ink-900 hover:bg-parchment-200 dark:hover:bg-ink-800 text-xs font-mono font-medium text-ink-800 dark:text-parchment-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Copy full claim text and translation"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                      Copied!
                    </span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Claim</span>
                  </>
                )}
              </button>
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
              <div className="p-6 rounded-2xl bg-parchment-100/80 dark:bg-ink-900/80 border border-parchment-200 dark:border-ink-800 text-base sm:text-lg font-serif text-ink-900 dark:text-parchment-100 leading-relaxed italic shadow-xs">
                &ldquo;{claim.originalText}&rdquo;
              </div>
            </div>

            {/* Column 2: Plain English Translation */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-sans font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                Plain English Engineering Translation
              </div>
              <div className="p-6 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-base sm:text-lg text-ink-950 dark:text-emerald-100 leading-relaxed font-sans font-medium shadow-xs">
                <TextWithLatex text={claim.plainEnglish} />
              </div>
            </div>
          </div>

          {/* Key Protected Innovations & Legal Significance */}
          <div
            className={`pt-2 grid grid-cols-1 gap-5 text-sm font-sans ${
              claim.legalSignificance ? "md:grid-cols-2" : ""
            }`}
          >
            <div className="p-4 sm:p-5 rounded-2xl bg-parchment-100/80 dark:bg-ink-900/60 border border-parchment-200 dark:border-ink-800 space-y-2.5 shadow-xs">
              <span className="font-bold text-ink-900 dark:text-parchment-100 block text-xs uppercase tracking-wider">
                Key Protected Innovations:
              </span>
              <div className="flex flex-wrap gap-2">
                {claim.keyInnovations.map((item) => (
                  <span
                    key={`${claim.number}-${item}`}
                    className="px-3 py-1 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-800 text-xs sm:text-sm font-semibold"
                  >
                    <TextWithLatex text={item} />
                  </span>
                ))}
              </div>
            </div>

            {claim.legalSignificance ? (
              <div className="p-4 sm:p-5 rounded-2xl bg-parchment-100/80 dark:bg-ink-900/60 border border-parchment-200 dark:border-ink-800 space-y-2 shadow-xs">
                <span className="font-bold text-ink-900 dark:text-parchment-100 block text-xs uppercase tracking-wider">
                  Historical Legal Impact:
                </span>
                <div className="text-ink-800 dark:text-ink-200 font-sans text-xs sm:text-sm leading-relaxed">
                  <TextWithLatex text={claim.legalSignificance} />
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
