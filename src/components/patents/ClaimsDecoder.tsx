"use client";

import { BookOpen, Check, ChevronLeft, ChevronRight, Copy, Scale, Sparkles } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { TextWithLatex } from "@/components/ui/LatexRenderer";
import { usePatentPhysics } from "@/physics/usePatentPhysics";
import type { CuratedSpecificationEdition, PatentClaim } from "@/types/patent";
import { claimLiveState } from "./claimLiveState";

interface ClaimsDecoderProps {
  claims: PatentClaim[];
  patentId?: string;
  claimStatus?: CuratedSpecificationEdition["claimStatus"];
}

function EmptyClaimsNotice({ claimStatus }: Pick<ClaimsDecoderProps, "claimStatus">) {
  const hasVerifiedNoClaimsAttestation = Boolean(claimStatus?.evidence);

  return (
    <section className="rounded-2xl border border-parchment-300 bg-parchment-50 p-6 shadow-xs dark:border-ink-800 dark:bg-ink-950 sm:p-8">
      <div className="flex items-center gap-2.5">
        <Scale className="h-5 w-5 text-amber-600 dark:text-amber-400" />
        <h3 className="font-serif text-lg font-bold text-ink-950 dark:text-parchment-100 sm:text-xl">
          Formal Claims
        </h3>
      </div>
      <p className="mt-4 text-base leading-relaxed text-ink-800 dark:text-parchment-200">
        {hasVerifiedNoClaimsAttestation
          ? "This reviewed historical facsimile contains no separately numbered formal claims. The edition preserves the document's actual description instead of inventing a modern claims list."
          : "A verified transcription of this record's formal claims is not available yet. Consult the pinned source PDF while the archival record remains under review."}
      </p>
      {claimStatus?.evidence ? (
        <p className="mt-3 border-l-2 border-amber-500 pl-4 text-sm leading-relaxed text-ink-700 dark:text-parchment-300">
          {claimStatus.evidence}
        </p>
      ) : null}
    </section>
  );
}

function ClaimsDecoderHeading({ claimCount }: { claimCount: number }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment-300 pb-3.5 dark:border-ink-800">
      <div className="flex items-center gap-2.5">
        <Scale className="h-5 w-5 text-amber-600 dark:text-amber-400" />
        <h3 className="font-serif text-lg font-bold text-ink-950 sm:text-xl dark:text-parchment-100">
          Legal Claims Decoder ({claimCount} Numbered Claims)
        </h3>
      </div>
      <div className="font-sans text-xs text-ink-600 sm:text-sm dark:text-ink-400">
        Compare dense legalistic claims directly with decoded plain-English functional
        specifications.
      </div>
    </div>
  );
}

function claimPillClassName(isSelected: boolean, live: ReturnType<typeof claimLiveState>) {
  const base =
    "cursor-pointer rounded-xl border px-3.5 py-1.5 font-sans text-xs font-semibold shadow-2xs transition-all sm:text-sm";

  if (isSelected) {
    return `${base} border-amber-800 bg-amber-700 font-bold text-white shadow-sm ring-2 ring-amber-400/40 dark:border-amber-500 dark:bg-amber-700`;
  }
  if (live === "broken") {
    return `${base} border-red-400 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200`;
  }
  if (live === "held") {
    return `${base} border-emerald-400 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200`;
  }
  return `${base} border-parchment-300 bg-parchment-100 text-ink-800 hover:bg-parchment-200 dark:border-ink-800 dark:bg-ink-900 dark:text-ink-200 dark:hover:bg-ink-800`;
}

interface ClaimSelectorPillProps {
  claim: PatentClaim;
  patentId?: string;
  params: Record<string, number>;
  isSelected: boolean;
  onSelect: (claimNumber: number) => void;
}

function ClaimSelectorPill({
  claim,
  patentId,
  params,
  isSelected,
  onSelect,
}: ClaimSelectorPillProps) {
  const live = claimLiveState(patentId, claim.number, params);
  const liveLabel = live === "broken" ? " · uncoupled" : live === "held" ? " · held" : "";

  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={() => onSelect(claim.number)}
      className={claimPillClassName(isSelected, live)}
    >
      Claim #{claim.number}{" "}
      <span className="text-[11px] font-normal opacity-80">
        {claim.isIndependent ? "(Independent)" : `(Dep #${claim.dependsOn?.join(", ")})`}
        {liveLabel}
      </span>
    </button>
  );
}

interface ClaimSelectorProps {
  claims: PatentClaim[];
  patentId?: string;
  params: Record<string, number>;
  activeClaimNum: number;
  claimsCollapsed: boolean;
  showAllClaims: boolean;
  onSelectClaim: (claimNumber: number) => void;
  onToggleAllClaims: () => void;
}

function ClaimSelector({
  claims,
  patentId,
  params,
  activeClaimNum,
  claimsCollapsed,
  showAllClaims,
  onSelectClaim,
  onToggleAllClaims,
}: ClaimSelectorProps) {
  const shouldCollapseClaims = claims.length > 6;

  return (
    <>
      <div
        className={`relative flex flex-wrap gap-2 ${
          claimsCollapsed
            ? "max-h-[8.25rem] overflow-hidden [mask-image:linear-gradient(to_bottom,black_65%,transparent)]"
            : ""
        }`}
        inert={claimsCollapsed}
      >
        {claims.map((claim) => (
          <ClaimSelectorPill
            key={claim.number}
            claim={claim}
            patentId={patentId}
            params={params}
            isSelected={activeClaimNum === claim.number}
            onSelect={onSelectClaim}
          />
        ))}
      </div>
      {shouldCollapseClaims ? (
        <button
          type="button"
          onClick={onToggleAllClaims}
          aria-expanded={showAllClaims}
          className="mt-1 inline-flex items-center gap-1 self-start rounded-lg border border-amber-500/25 bg-amber-500/10 px-2 py-1 font-sans text-xs font-semibold text-amber-800 transition-colors hover:bg-amber-500/20 dark:bg-amber-400/10 dark:text-amber-300 dark:hover:bg-amber-400/20 cursor-pointer"
        >
          {showAllClaims ? "Show fewer claims" : `Show all ${claims.length} claims`}
        </button>
      ) : null}
    </>
  );
}

interface ClaimDetailCardProps {
  claim: PatentClaim;
  activeIndex: number;
  claimCount: number;
  copied: boolean;
  onSelectPrevious: () => void;
  onSelectNext: () => void;
  onCopy: () => void;
}

function ClaimDetailCard({
  claim,
  activeIndex,
  claimCount,
  copied,
  onSelectPrevious,
  onSelectNext,
  onCopy,
}: ClaimDetailCardProps) {
  return (
    <div
      key={claim.number}
      className="rounded-3xl border border-parchment-300 dark:border-ink-800 bg-parchment-50/90 dark:bg-ink-950 p-6 sm:p-8 shadow-patent space-y-6"
    >
      <ClaimDetailHeader
        claim={claim}
        activeIndex={activeIndex}
        claimCount={claimCount}
        copied={copied}
        onSelectPrevious={onSelectPrevious}
        onSelectNext={onSelectNext}
        onCopy={onCopy}
      />
      <ClaimTextComparison claim={claim} />
      <ClaimLegalContext claim={claim} />
    </div>
  );
}

interface ClaimDetailHeaderProps {
  claim: PatentClaim;
  activeIndex: number;
  claimCount: number;
  copied: boolean;
  onSelectPrevious: () => void;
  onSelectNext: () => void;
  onCopy: () => void;
}

function ClaimDetailHeader({
  claim,
  activeIndex,
  claimCount,
  copied,
  onSelectPrevious,
  onSelectNext,
  onCopy,
}: ClaimDetailHeaderProps) {
  return (
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
      <div className="flex items-center gap-2">
        <ClaimNavigation
          activeIndex={activeIndex}
          claimCount={claimCount}
          onSelectPrevious={onSelectPrevious}
          onSelectNext={onSelectNext}
        />
        <CopyClaimAction copied={copied} onCopy={onCopy} />
      </div>
    </div>
  );
}

interface ClaimNavigationProps {
  activeIndex: number;
  claimCount: number;
  onSelectPrevious: () => void;
  onSelectNext: () => void;
}

function ClaimNavigation({
  activeIndex,
  claimCount,
  onSelectPrevious,
  onSelectNext,
}: ClaimNavigationProps) {
  return (
    <div className="flex items-center gap-1 bg-parchment-200 dark:bg-ink-900 p-1 rounded-xl border border-parchment-300 dark:border-ink-800">
      <button
        type="button"
        onClick={onSelectPrevious}
        disabled={activeIndex === 0}
        className="p-2.5 min-h-11 min-w-11 flex items-center justify-center rounded-lg text-ink-700 dark:text-parchment-300 hover:bg-parchment-300 dark:hover:bg-ink-800 disabled:opacity-30 transition-colors cursor-pointer"
        title="Previous Claim"
        aria-label="Previous Claim"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <span className="text-xs font-mono text-ink-500 px-1.5 font-semibold">
        {activeIndex + 1}/{claimCount}
      </span>
      <button
        type="button"
        onClick={onSelectNext}
        disabled={activeIndex === claimCount - 1}
        className="p-2.5 min-h-11 min-w-11 flex items-center justify-center rounded-lg text-ink-700 dark:text-parchment-300 hover:bg-parchment-300 dark:hover:bg-ink-800 disabled:opacity-30 transition-colors cursor-pointer"
        title="Next Claim"
        aria-label="Next Claim"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

function CopyClaimAction({ copied, onCopy }: { copied: boolean; onCopy: () => void }) {
  return (
    <button
      type="button"
      onClick={onCopy}
      className="px-3 py-1.5 rounded-xl border border-parchment-300 dark:border-ink-800 bg-parchment-100 dark:bg-ink-900 hover:bg-parchment-200 dark:hover:bg-ink-800 text-xs font-mono font-medium text-ink-800 dark:text-parchment-200 flex items-center gap-1.5 transition-colors cursor-pointer"
      title="Copy full claim text and translation"
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span role="status" className="text-emerald-600 dark:text-emerald-400 font-bold">
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
  );
}

function ClaimTextComparison({ claim }: { claim: PatentClaim }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-2.5">
        <div className="flex items-center gap-2 text-xs sm:text-sm font-sans font-bold text-ink-800 dark:text-parchment-300 uppercase tracking-wider">
          <BookOpen className="w-4 h-4 text-amber-700 dark:text-amber-400" />
          Verbatim Historical Legal Text
        </div>
        <div className="p-6 rounded-2xl bg-parchment-100/80 dark:bg-ink-900/80 border border-parchment-200 dark:border-ink-800 text-base sm:text-lg font-serif text-ink-900 dark:text-parchment-100 leading-relaxed italic shadow-xs">
          &ldquo;{claim.originalText}&rdquo;
        </div>
      </div>
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
  );
}

function ClaimLegalContext({ claim }: { claim: PatentClaim }) {
  const legalSignificance = claim.legalSignificance;

  return (
    <div
      className={`pt-2 grid grid-cols-1 gap-5 text-sm font-sans ${
        legalSignificance ? "md:grid-cols-2" : ""
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
      {legalSignificance ? (
        <div className="p-4 sm:p-5 rounded-2xl bg-parchment-100/80 dark:bg-ink-900/60 border border-parchment-200 dark:border-ink-800 space-y-2 shadow-xs">
          <span className="font-bold text-ink-900 dark:text-parchment-100 block text-xs uppercase tracking-wider">
            Historical Legal Impact:
          </span>
          <div className="text-ink-800 dark:text-ink-200 font-sans text-xs sm:text-sm leading-relaxed">
            <TextWithLatex text={legalSignificance} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function ClaimsDecoder({ claims, patentId, claimStatus }: ClaimsDecoderProps) {
  const [activeClaimNum, setActiveClaimNum] = useState<number>(claims[0]?.number || 1);
  const [showAllClaims, setShowAllClaims] = useState(false);
  // High-claim patents (Wright prints 18) wrap into a ~9-row selector wall on
  // phones, pushing the actual decoder content below the fold. Collapse the
  // wall behind an explicit toggle once it stops fitting; small claim sets
  // render exactly as before.
  const shouldCollapseClaims = claims.length > 6;
  const claimsCollapsed = shouldCollapseClaims && !showAllClaims;
  const [copied, setCopied] = useState<boolean>(false);
  const { params } = usePatentPhysics(patentId || "");

  useEffect(() => {
    if (claims.length > 0 && !claims.some((c) => c.number === activeClaimNum)) {
      setActiveClaimNum(claims[0].number);
    }
  }, [claims, activeClaimNum]);

  const activeIndex = claims.findIndex((c) => c.number === activeClaimNum);
  const claim = claims[activeIndex] || claims[0];

  const handleCopyClaim = useCallback(() => {
    if (!claim) return;
    const textToCopy = `[Claim ${claim.number} · ${claim.isIndependent ? "Independent" : `Dependent on #${claim.dependsOn?.join(", ")}`}]\n\nOriginal Text:\n"${claim.originalText}"\n\nPlain English Translation:\n${claim.plainEnglish}\n\nKey Innovations:\n${claim.keyInnovations.join(", ")}`;
    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => {});
    }
  }, [claim]);

  if (claims.length === 0) {
    return <EmptyClaimsNotice claimStatus={claimStatus} />;
  }

  const selectPrevClaim = () => {
    if (activeIndex > 0) {
      setActiveClaimNum(claims[activeIndex - 1].number);
      // Chevron navigation can land on a pill clipped inside the collapsed
      // selector wall; expand it so the current selection stays visible.
      setShowAllClaims(true);
    }
  };

  const selectNextClaim = () => {
    if (activeIndex < claims.length - 1) {
      setActiveClaimNum(claims[activeIndex + 1].number);
      setShowAllClaims(true);
    }
  };

  return (
    <div className="space-y-5">
      <ClaimsDecoderHeading claimCount={claims.length} />
      <ClaimSelector
        claims={claims}
        patentId={patentId}
        params={params}
        activeClaimNum={activeClaimNum}
        claimsCollapsed={claimsCollapsed}
        showAllClaims={showAllClaims}
        onSelectClaim={setActiveClaimNum}
        onToggleAllClaims={() => setShowAllClaims((shown) => !shown)}
      />

      {claim ? (
        <ClaimDetailCard
          key={claim.number}
          claim={claim}
          activeIndex={activeIndex}
          claimCount={claims.length}
          copied={copied}
          onSelectPrevious={selectPrevClaim}
          onSelectNext={selectNextClaim}
          onCopy={handleCopyClaim}
        />
      ) : null}
    </div>
  );
}
