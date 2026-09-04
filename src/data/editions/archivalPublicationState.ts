/**
 * Typed evidence for the archival-publication boundary.
 *
 * This module intentionally consumes catalogue metadata, not prose from a
 * provenance receipt. Receipt prose remains research evidence; an editorial
 * release or hold must be represented here as data the renderer and the
 * release gate can evaluate consistently.
 */

import type { CuratedSpecificationEdition, OriginalTextAssetKind, Patent } from "@/types/patent";
import { validateCuratedSpecificationEdition } from "../archivalEditionValidation";
import {
  ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS,
  type ArchivalFigureAcceptanceAttestation,
} from "./archivalFigureAcceptance";
import {
  FIGURE_OCCURRENCE_SOURCE_LOCATORS,
  type FigureOccurrenceSourceLocatorRegistry,
  figureOccurrenceKey,
  type NormalizedSourceRectangle,
  type SourcePixelRectangle,
  validateFigureOccurrenceSourceLocators,
} from "./figureOccurrenceSourceLocators";
import type {
  PinnedPdfByteVerificationAvailability,
  PinnedPdfByteVerificationReason,
} from "./pinnedPdfByteVerification.server";
import {
  NO_REVIEWED_LEDGER_PUBLICATION_EVIDENCE,
  type ReviewedLedgerPublicationEvidence,
} from "./reviewedLedgerPublicationEvidence";

export const ARCHIVAL_PUBLICATION_REASON_CODES = [
  "ACCEPTED",
  "NO_EDITION_BOUND",
  "PENDING_FACSIMILE_REVIEW",
  "MISSING_COMPANION_READINGS",
  "STRUCTURAL_VALIDATION_FAILED",
  "MISSING_REVIEWED_LEDGER",
  "MISSING_LEDGER_REVIEWER",
  "MISSING_LEDGER_REVIEW_DATE",
  "LEDGER_CONTENT_COVERAGE_INCOMPLETE",
  "MISSING_SOURCE_DIGEST",
  "SOURCE_DIGEST_MISMATCH",
  "PINNED_PDF_BYTES_UNAVAILABLE",
  "PINNED_PDF_DIGEST_MISMATCH",
  "FIGURE_ACCEPTANCE_PENDING",
  "FABRICATION_OR_RECONSTRUCTION_QUARANTINE",
  "AUDIT_FIGURE_ACCEPTANCE_PENDING",
  "AUDIT_LEDGER_ACCEPTANCE_PENDING",
  "AUDIT_FULL_SPECIFICATION_PENDING",
  "AUDIT_PRIMARY_FACSIMILE_PENDING",
  "AUDIT_RECONSTRUCTION_QUARANTINE",
  "AUDIT_SOURCE_BOUNDED",
  "AUDIT_CLAIM_PARITY_PENDING",
  "AUDIT_FACSIMILE_REVIEW_PENDING",
] as const;

export type ArchivalPublicationReasonCode = (typeof ARCHIVAL_PUBLICATION_REASON_CODES)[number];

/** A release state, not a statement about whether supporting research exists. */
export type ArchivalPublicationStateKind =
  | "accepted"
  | "candidate"
  | "rejected"
  | "held"
  | "facsimile-only"
  | "source-bounded";

export type ArchivalFigureReviewStatus = "accepted" | "pending" | "rejected" | "not-required";

export interface ArchivalFigureEvidence {
  /** Stable occurrence in the continuous manual edition, not a filename guess. */
  occurrence: string;
  sourceFigure: string;
  sourcePdfPage: number | null;
  sourceRaster: { width: number; height: number } | null;
  sourceRectPixels: SourcePixelRectangle | null;
  sourceRegion: NormalizedSourceRectangle | null;
  locatorReviewer: string | null;
  locatorReviewedAt: string | null;
  locatorEvidenceReference: string | null;
  activeAsset: string | null;
  priorAssets: readonly string[];
  assetSha256: string | null;
  dimensions: { width: number; height: number } | null;
  status: ArchivalFigureReviewStatus;
  reviewer: string | null;
  reviewedAt: string | null;
  rejectionReason: string | null;
}

export interface ArchivalFigureManifest {
  requiredFigureCount: number;
  acceptedFigureCount: number;
  attestation: {
    sourcePdfSha256: string;
    reviewer: string;
    reviewedAt: string;
    acceptanceBasis: ArchivalFigureAcceptanceAttestation["acceptanceBasis"];
    acceptedOccurrenceCount: number;
    acceptedAssetCount: number;
    matchesEdition: boolean;
    matchesLocators: boolean;
  } | null;
  figures: readonly ArchivalFigureEvidence[];
}

/** Public-safe byte evidence. Absolute server paths never cross this boundary. */
export interface ArchivalPinnedPdfByteEvidence {
  canonicalPublicPdfUrl: string | null;
  expectedSha256: string | null;
  actualSha256: string | null;
  availability: PinnedPdfByteVerificationAvailability;
  matchesExpected: boolean;
  reason: PinnedPdfByteVerificationReason;
}

export const NO_PINNED_PDF_BYTE_EVIDENCE: ArchivalPinnedPdfByteEvidence = {
  canonicalPublicPdfUrl: null,
  expectedSha256: null,
  actualSha256: null,
  availability: "unavailable",
  matchesExpected: false,
  reason: "MISSING_PDF",
};

export interface ArchivalPublicationEvidence {
  edition: {
    bound: boolean;
    completeFacsimileReviewed: boolean;
    structuralValidationPassed: boolean;
    reviewer: string | null;
    reviewedAt: string | null;
  };
  ledger: {
    kind: OriginalTextAssetKind | null;
    reviewer: string | null;
    reviewedAt: string | null;
    sourcePdfSha256: string | null;
  };
  ledgerContent: ReviewedLedgerPublicationEvidence;
  digestParity: "matching" | "mismatched" | "unavailable";
  pinnedPdfBytes: ArchivalPinnedPdfByteEvidence;
  companionReadings: boolean;
  claimDisposition: "formal-claims" | "no-formal-claims";
  drawingDisposition: "drawings-required" | "no-drawings";
  figures: ArchivalFigureManifest;
  evidenceReferences: readonly string[];
}

export interface ArchivalPublicationState {
  patentId: string;
  kind: ArchivalPublicationStateKind;
  reasonCode: ArchivalPublicationReasonCode;
  explanation: string;
  evidence: ArchivalPublicationEvidence;
}

export type ArchivalPublicationStatus =
  | "published"
  | "withheld-incomplete"
  | "withheld-pending-review"
  | "withheld-reconstruction-quarantine"
  | "facsimile-only"
  | "source-bounded";

export interface ArchivalPublicationDecision {
  state: ArchivalPublicationState;
  /** Compatibility label for existing public surfaces and tests. */
  status: ArchivalPublicationStatus;
  isPublished: boolean;
  reasonCode: ArchivalPublicationReasonCode;
  explanation: string;
  publishedEdition?: CuratedSpecificationEdition;
  figureManifest: ArchivalFigureManifest;
  reviewerAttestation: {
    completeFacsimileReviewed: boolean;
    hasCompanionReadings: boolean;
    structuralValidationPassed: boolean;
    isQuarantined: boolean;
  };
}

/**
 * Stable, serializable projection used by route diagnostics and the browser
 * acceptance harness. Keeping this projection beside the state machine stops
 * server-rendered evidence and E2E expectations from drifting independently.
 */
export interface ArchivalPublicationDiagnostics {
  completeFacsimileReviewed: boolean;
  ledgerKind: OriginalTextAssetKind | null;
  ledgerReviewer: string | null;
  ledgerReviewedAt: string | null;
  ledgerContent: ReviewedLedgerPublicationEvidence;
  digestParity: ArchivalPublicationEvidence["digestParity"];
  pinnedPdfBytes: ArchivalPinnedPdfByteEvidence;
  requiredFigureCount: number;
  acceptedFigureCount: number;
  figureAttestation: ArchivalFigureManifest["attestation"];
  figures: readonly ArchivalFigureEvidence[];
  evidenceReferences: readonly string[];
}

export function archivalPublicationDiagnostics(
  decision: ArchivalPublicationDecision,
): ArchivalPublicationDiagnostics {
  return {
    completeFacsimileReviewed: decision.reviewerAttestation.completeFacsimileReviewed,
    ledgerKind: decision.state.evidence.ledger.kind,
    ledgerReviewer: decision.state.evidence.ledger.reviewer,
    ledgerReviewedAt: decision.state.evidence.ledger.reviewedAt,
    ledgerContent: decision.state.evidence.ledgerContent,
    digestParity: decision.state.evidence.digestParity,
    pinnedPdfBytes: decision.state.evidence.pinnedPdfBytes,
    requiredFigureCount: decision.figureManifest.requiredFigureCount,
    acceptedFigureCount: decision.figureManifest.acceptedFigureCount,
    figureAttestation: decision.figureManifest.attestation,
    figures: decision.figureManifest.figures,
    evidenceReferences: decision.state.evidence.evidenceReferences,
  };
}

interface PublicationOverride {
  kind: Exclude<ArchivalPublicationStateKind, "accepted">;
  reasonCode: Extract<
    ArchivalPublicationReasonCode,
    `AUDIT_${string}` | "FABRICATION_OR_RECONSTRUCTION_QUARANTINE"
  >;
  explanation: string;
  auditIssue: string;
}

const auditHold = (
  reasonCode: PublicationOverride["reasonCode"],
  auditIssue: string,
  explanation: string,
  kind: PublicationOverride["kind"] = "held",
): PublicationOverride => ({ kind, reasonCode, auditIssue, explanation });

/**
 * Explicitly reviewed migration exceptions. The default decision below covers
 * every catalogue record; this table records only the known restrictive audit
 * evidence. No entry in this table is a positive publication override.
 */
export const ARCHIVAL_PUBLICATION_STATE_OVERRIDES: Readonly<Record<string, PublicationOverride>> = {
  "us-7479949-multitouch": auditHold(
    "AUDIT_FULL_SPECIFICATION_PENDING",
    "classic-patentscom-ram",
    "The source packet is being rebuilt as a complete, source-bound archival edition.",
    "candidate",
  ),
  "us-6331181-davinci": auditHold(
    "AUDIT_FULL_SPECIFICATION_PENDING",
    "classic-patentscom-olm",
    "The educational record remains available, but its incomplete source edition cannot be presented as complete.",
    "source-bounded",
  ),
  "us-6120588-eink": auditHold(
    "AUDIT_FACSIMILE_REVIEW_PENDING",
    "classic-patentscom-q9h",
    "The research edition is held pending full source-face review.",
  ),

  "us-3671542-kwolek-kevlar": auditHold(
    "AUDIT_PRIMARY_FACSIMILE_PENDING",
    "classic-patentscom-0io",
    "Facsimile recovery remains incomplete; the source face is therefore not accepted.",
    "facsimile-only",
  ),

  "us-3138743-kilby-integrated-circuit": auditHold(
    "AUDIT_FIGURE_ACCEPTANCE_PENDING",
    "classic-patentscom-ndg",
    "Source-approved figures and ledger acceptance are pending.",
  ),
  "us-2708656-fermi-reactor": auditHold(
    "AUDIT_FULL_SPECIFICATION_PENDING",
    "classic-patentscom-wt9",
    "The complete 58-page reactor packet remains under review.",
  ),
  "us-2543181-land-polaroid": auditHold(
    "AUDIT_FULL_SPECIFICATION_PENDING",
    "classic-patentscom-vt5",
    "The complete archival packet has not yet been accepted.",
  ),
  "us-1102653-goddard-rocket": auditHold(
    "AUDIT_FACSIMILE_REVIEW_PENDING",
    "classic-patentscom-owu",
    "The source hold remains in force while the source-bound presentation is repaired.",
  ),
  "us-706737-fessenden-wireless": auditHold(
    "AUDIT_FACSIMILE_REVIEW_PENDING",
    "classic-patentscom-q5o",
    "The source face remains withheld pending source-bound reconstruction.",
  ),
  "us-682690-hewitt-mercury-lamp": auditHold(
    "AUDIT_FACSIMILE_REVIEW_PENDING",
    "classic-patentscom-z99",
    "Independent archival acceptance is pending.",
  ),

  "us-613809-tesla-teleautomaton": auditHold(
    "AUDIT_FACSIMILE_REVIEW_PENDING",
    "classic-patentscom-a4b",
    "The archival edition remains withheld while source support is repaired.",
  ),
  "us-313224-mergenthaler-linotype": auditHold(
    "AUDIT_FULL_SPECIFICATION_PENDING",
    "classic-patentscom-0tl",
    "The archival recovery is incomplete.",
    "source-bounded",
  ),
  "us-542846-diesel-engine": auditHold(
    "AUDIT_FACSIMILE_REVIEW_PENDING",
    "classic-patentscom-87z",
    "The provenance hold must be reconciled before the source edition is released.",
  ),
  "us-395781-hollerith-tabulating": auditHold(
    "AUDIT_FIGURE_ACCEPTANCE_PENDING",
    "classic-patentscom-jks",
    "All 17 figure previews require QA acceptance.",
  ),
  "us-3237-rillieux-evaporator": auditHold(
    "AUDIT_FACSIMILE_REVIEW_PENDING",
    "classic-patentscom-pam",
    "The source hold remains pending independent review.",
  ),
  "us-x72-whitney-cotton-gin": auditHold(
    "AUDIT_FIGURE_ACCEPTANCE_PENDING",
    "classic-patentscom-hi0",
    "Figure provenance must be repaired before publication.",
  ),
  "gb-1420-cort-puddling-rolling": auditHold(
    "AUDIT_FACSIMILE_REVIEW_PENDING",
    "classic-patentscom-xqu",
    "The archival hold remains in force while source support is completed.",
    "source-bounded",
  ),
  "gb-1306-watt-rotary-engine": auditHold(
    "AUDIT_RECONSTRUCTION_QUARANTINE",
    "classic-patentscom-ab0",
    "The reconstruction is quarantined until rebuilt from a primary source.",
    "rejected",
  ),
  "gb-931-arkwright-water-frame": auditHold(
    "FABRICATION_OR_RECONSTRUCTION_QUARANTINE",
    "classic-patentscom-mvt",
    "The reconstruction is quarantined pending a complete primary-record packet.",
    "rejected",
  ),
  "gb-913-watt-separate-condenser": auditHold(
    "AUDIT_PRIMARY_FACSIMILE_PENDING",
    "classic-patentscom-ht5",
    "A primary facsimile has not yet been independently published.",
    "facsimile-only",
  ),
  "us-347140-thomson-welding": auditHold(
    "AUDIT_FACSIMILE_REVIEW_PENDING",
    "classic-patentscom-qm2",
    "The inherited archival hold remains in force until the source packet is independently accepted.",
  ),
  "us-x1-hopkins-potash": auditHold(
    "AUDIT_FACSIMILE_REVIEW_PENDING",
    "classic-patentscom-qm2",
    "The inherited archival hold remains in force until the source packet is independently accepted.",
  ),
  "us-4068536-stackhouse-manipulator": auditHold(
    "FABRICATION_OR_RECONSTRUCTION_QUARANTINE",
    "classic-patentscom-qm2",
    "The withdrawn draft remains quarantined pending primary-facsimile verification.",
    "rejected",
  ),
};

function inlinesForBlock(edition: CuratedSpecificationEdition, blockIndex: number) {
  const block = edition.blocks[blockIndex];
  if (!block) return [];
  if (block.kind === "paragraph" || block.kind === "claim") return [block.inlines];
  if (block.kind === "figure-sheet") return [block.description];
  if (block.kind === "table") return [...block.headers, ...block.rows.flat()];
  return [];
}

function figureManifestForEdition(
  patentId: string,
  edition: CuratedSpecificationEdition | undefined,
  sourcePdfPageCount: number | null,
): ArchivalFigureManifest {
  if (!edition) {
    return { requiredFigureCount: 0, acceptedFigureCount: 0, attestation: null, figures: [] };
  }
  const attestation = (
    ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS as Readonly<
      Record<string, ArchivalFigureAcceptanceAttestation>
    >
  )[patentId];

  const candidates = edition.blocks.flatMap((_, blockIndex) =>
    inlinesForBlock(edition, blockIndex).flatMap((inlines, groupIndex) =>
      inlines.flatMap((inline, inlineIndex) => {
        if (inline.kind !== "reference" || inline.referenceType !== "figure") return [];
        const preview = inline.figurePreviews?.[0];
        const dimensions =
          preview && preview.width > 0 && preview.height > 0
            ? { width: preview.width, height: preview.height }
            : null;
        return [
          {
            occurrence: figureOccurrenceKey(blockIndex, groupIndex, inlineIndex),
            sourceFigure: inline.text,
            activeAsset: preview?.src ?? null,
            priorAssets: (inline.figurePreviews ?? []).slice(1).map((candidate) => candidate.src),
            dimensions,
            preview,
          },
        ];
      }),
    ),
  );

  const activeAssetPaths = [
    ...new Set(
      candidates.flatMap((candidate) => (candidate.preview ? [candidate.preview.src] : [])),
    ),
  ].sort();
  const attestedAssetPaths = attestation ? Object.keys(attestation.assets).sort() : [];
  const attestationMatchesEdition = Boolean(
    attestation &&
      attestation.sourcePdfSha256 === edition.sourcePdfSha256 &&
      attestation.acceptedOccurrenceCount === candidates.length &&
      activeAssetPaths.length === attestedAssetPaths.length &&
      activeAssetPaths.every((path, index) => path === attestedAssetPaths[index]) &&
      candidates.every((candidate) => {
        if (!candidate.preview || !candidate.dimensions) return false;
        const assetEvidence = attestation.assets[candidate.preview.src];
        return Boolean(
          assetEvidence &&
            assetEvidence.width === candidate.preview.width &&
            assetEvidence.height === candidate.preview.height &&
            /^[a-f0-9]{64}$/.test(assetEvidence.sha256),
        );
      }),
  );
  const locators =
    (FIGURE_OCCURRENCE_SOURCE_LOCATORS as FigureOccurrenceSourceLocatorRegistry)[patentId] ?? [];
  const locatorValidation = validateFigureOccurrenceSourceLocators(
    { [patentId]: locators },
    {
      canonicalAssetsByPatent: { [patentId]: activeAssetPaths },
      canonicalOccurrencesByPatent: {
        [patentId]: Object.fromEntries(
          candidates.map((candidate) => [candidate.occurrence, candidate.activeAsset]),
        ),
      },
      ...(sourcePdfPageCount
        ? { sourcePdfPageCountsByPatent: { [patentId]: sourcePdfPageCount } }
        : {}),
    },
  );
  const locatorByOccurrence = new Map(
    locators.map((locator) => [locator.occurrenceKey, locator] as const),
  );
  const locatorSetMatchesEdition = Boolean(sourcePdfPageCount && locatorValidation.valid);

  const figures: ArchivalFigureEvidence[] = candidates.map((candidate) => {
    const assetEvidence = candidate.preview
      ? attestation?.assets[candidate.preview.src]
      : undefined;
    const locator = locatorByOccurrence.get(candidate.occurrence);
    const accepted = Boolean(
      attestationMatchesEdition && locatorSetMatchesEdition && assetEvidence && locator,
    );
    const rejectionReason = (() => {
      if (accepted) return null;
      if (!attestation)
        return "This figure occurrence has no explicit digest-pinned acceptance attestation.";
      if (!attestationMatchesEdition)
        return "The active figure occurrence no longer matches its digest-pinned acceptance attestation.";
      if (!locator)
        return "This figure occurrence lacks an independently reviewed source-page and source-region locator.";
      if (!sourcePdfPageCount || locator.sourcePdfPage > sourcePdfPageCount)
        return "The figure occurrence locator names a page outside the reviewed facsimile.";
      return "The reviewed occurrence-locator set does not exactly match the active archival edition.";
    })();
    return {
      occurrence: candidate.occurrence,
      sourceFigure: candidate.sourceFigure,
      sourcePdfPage: locator?.sourcePdfPage ?? null,
      sourceRaster: locator?.sourceRaster ?? null,
      sourceRectPixels: locator?.sourceRectPixels ?? null,
      sourceRegion: locator?.normalizedSourceRect ?? null,
      locatorReviewer: locator?.reviewer ?? null,
      locatorReviewedAt: locator?.reviewedAt ?? null,
      locatorEvidenceReference: locator?.evidenceReference ?? null,
      activeAsset: candidate.activeAsset,
      priorAssets: candidate.priorAssets,
      assetSha256: assetEvidence?.sha256 ?? null,
      dimensions: candidate.dimensions,
      status: accepted ? "accepted" : "pending",
      reviewer: accepted ? (attestation?.reviewer ?? null) : null,
      reviewedAt: accepted ? (attestation?.reviewedAt ?? null) : null,
      rejectionReason,
    };
  });

  return {
    requiredFigureCount: figures.length,
    acceptedFigureCount: figures.filter((figure) => figure.status === "accepted").length,
    attestation: attestation
      ? {
          sourcePdfSha256: attestation.sourcePdfSha256,
          reviewer: attestation.reviewer,
          reviewedAt: attestation.reviewedAt,
          acceptanceBasis: attestation.acceptanceBasis,
          acceptedOccurrenceCount: attestation.acceptedOccurrenceCount,
          acceptedAssetCount: Object.keys(attestation.assets).length,
          matchesEdition: attestationMatchesEdition,
          matchesLocators: locatorSetMatchesEdition,
        }
      : null,
    figures,
  };
}

function baseEvidence(
  patent: Pick<Patent, "id" | "archivalEdition" | "originalTextAsset">,
  options: {
    hasCompanionReadings: boolean;
    ledgerContent: ReviewedLedgerPublicationEvidence;
    pinnedPdfBytes: ArchivalPinnedPdfByteEvidence;
  },
): ArchivalPublicationEvidence {
  const edition = patent.archivalEdition;
  const asset = patent.originalTextAsset;
  const editionDigest = edition?.sourcePdfSha256 ?? null;
  const ledgerDigest = asset?.sourcePdfSha256 ?? null;
  const digestParity =
    editionDigest && ledgerDigest
      ? editionDigest === ledgerDigest
        ? "matching"
        : "mismatched"
      : "unavailable";
  let structuralValidationPassed = false;
  try {
    structuralValidationPassed = Boolean(
      edition && validateCuratedSpecificationEdition(edition).valid,
    );
  } catch {
    // A candidate can be malformed; that must yield a typed refusal rather
    // than a renderer exception.
    structuralValidationPassed = false;
  }

  return {
    edition: {
      bound: Boolean(edition),
      completeFacsimileReviewed: edition?.completeFacsimileReviewed === true,
      structuralValidationPassed,
      reviewer: typeof edition?.preparedBy === "string" ? edition.preparedBy : null,
      reviewedAt: typeof edition?.preparedAt === "string" ? edition.preparedAt : null,
    },
    ledger: {
      kind: asset?.kind ?? null,
      reviewer: asset?.reviewedBy ?? null,
      reviewedAt: asset?.reviewedAt ?? null,
      sourcePdfSha256: ledgerDigest,
    },
    ledgerContent: options.ledgerContent,
    digestParity,
    pinnedPdfBytes: options.pinnedPdfBytes,
    companionReadings: options.hasCompanionReadings,
    claimDisposition: edition?.claimStatus ? "no-formal-claims" : "formal-claims",
    drawingDisposition: edition?.drawingStatus ? "no-drawings" : "drawings-required",
    figures: figureManifestForEdition(patent.id, edition, asset?.pageCount ?? null),
    evidenceReferences: [
      patent.id,
      ...(edition ? [`edition:${patent.id}`] : []),
      ...(asset?.url ? [`ledger:${asset.url}`] : []),
    ],
  };
}

function statusFor(kind: ArchivalPublicationStateKind): ArchivalPublicationStatus {
  switch (kind) {
    case "accepted":
      return "published";
    case "candidate":
      return "withheld-pending-review";
    case "rejected":
      return "withheld-reconstruction-quarantine";
    case "held":
      return "withheld-incomplete";
    case "facsimile-only":
      return "facsimile-only";
    case "source-bounded":
      return "source-bounded";
  }
}

function decision(
  patent: Pick<Patent, "id" | "archivalEdition" | "originalTextAsset">,
  state: Omit<ArchivalPublicationState, "patentId">,
  isQuarantined: boolean,
): ArchivalPublicationDecision {
  const completeFacsimileReviewed = state.evidence.edition.completeFacsimileReviewed;
  const structuralValidationPassed = state.evidence.edition.structuralValidationPassed;
  const isPublished = state.kind === "accepted";
  return {
    state: { patentId: patent.id, ...state },
    status: statusFor(state.kind),
    isPublished,
    reasonCode: state.reasonCode,
    explanation: state.explanation,
    ...(isPublished && patent.archivalEdition ? { publishedEdition: patent.archivalEdition } : {}),
    figureManifest: state.evidence.figures,
    reviewerAttestation: {
      completeFacsimileReviewed,
      hasCompanionReadings: state.evidence.companionReadings,
      structuralValidationPassed,
      isQuarantined,
    },
  };
}

/**
 * Evaluate one catalogue record. Restrictive explicit audit evidence is
 * considered before every positive condition; thus a repaired-looking edition
 * cannot quietly outrank an unresolved hold.
 */
export function evaluateTypedArchivalPublicationState(
  patent: Pick<Patent, "id" | "archivalEdition" | "originalTextAsset">,
  options: {
    hasCompanionReadings: boolean;
    isQuarantined?: boolean;
    ledgerContent?: ReviewedLedgerPublicationEvidence;
    pinnedPdfBytes?: ArchivalPinnedPdfByteEvidence;
  } = {
    hasCompanionReadings: false,
  },
): ArchivalPublicationDecision {
  const evidence = baseEvidence(patent, {
    hasCompanionReadings: options.hasCompanionReadings,
    ledgerContent: options.ledgerContent ?? NO_REVIEWED_LEDGER_PUBLICATION_EVIDENCE,
    pinnedPdfBytes: options.pinnedPdfBytes ?? NO_PINNED_PDF_BYTE_EVIDENCE,
  });
  const override = ARCHIVAL_PUBLICATION_STATE_OVERRIDES[patent.id];
  if (override) {
    return decision(
      patent,
      {
        kind: override.kind,
        reasonCode: override.reasonCode,
        explanation: override.explanation,
        evidence: {
          ...evidence,
          evidenceReferences: [...evidence.evidenceReferences, `beads:${override.auditIssue}`],
        },
      },
      override.reasonCode === "FABRICATION_OR_RECONSTRUCTION_QUARANTINE" ||
        options.isQuarantined === true,
    );
  }

  if (options.isQuarantined) {
    return decision(
      patent,
      {
        kind: "rejected",
        reasonCode: "FABRICATION_OR_RECONSTRUCTION_QUARANTINE",
        explanation:
          "The source document or candidate transcription is under quarantine pending primary facsimile acquisition or provenance verification.",
        evidence,
      },
      true,
    );
  }

  if (!patent.archivalEdition) {
    return decision(
      patent,
      {
        kind: "facsimile-only",
        reasonCode: "NO_EDITION_BOUND",
        explanation:
          "No hand-authored archival edition is bound for this record; visitors read the pinned primary facsimile.",
        evidence,
      },
      false,
    );
  }

  if (!evidence.edition.completeFacsimileReviewed) {
    return decision(
      patent,
      {
        kind: "candidate",
        reasonCode: "PENDING_FACSIMILE_REVIEW",
        explanation:
          "Archival edition draft exists but has not completed full facsimile-matching line-by-line verification.",
        evidence,
      },
      false,
    );
  }

  if (evidence.ledger.kind !== "reviewed-transcription") {
    return decision(
      patent,
      {
        kind: "held",
        reasonCode: "MISSING_REVIEWED_LEDGER",
        explanation:
          "A complete archival edition requires a reviewed-transcription ledger; a raw text layer is not a public source face.",
        evidence,
      },
      false,
    );
  }

  if (!evidence.ledger.reviewer) {
    return decision(
      patent,
      {
        kind: "held",
        reasonCode: "MISSING_LEDGER_REVIEWER",
        explanation: "The reviewed-transcription ledger lacks accountable reviewer metadata.",
        evidence,
      },
      false,
    );
  }

  if (!evidence.ledger.reviewedAt) {
    return decision(
      patent,
      {
        kind: "held",
        reasonCode: "MISSING_LEDGER_REVIEW_DATE",
        explanation: "The reviewed-transcription ledger lacks an accountable review date.",
        evidence,
      },
      false,
    );
  }

  if (!evidence.ledgerContent.valid) {
    return decision(
      patent,
      {
        kind: "held",
        reasonCode: "LEDGER_CONTENT_COVERAGE_INCOMPLETE",
        explanation:
          evidence.ledgerContent.error ??
          "The reviewed transcription does not yet prove complete literal coverage of the public source edition.",
        evidence,
      },
      false,
    );
  }

  if (evidence.digestParity === "unavailable") {
    return decision(
      patent,
      {
        kind: "held",
        reasonCode: "MISSING_SOURCE_DIGEST",
        explanation:
          "The edition and reviewed ledger must both declare the pinned source-PDF digest.",
        evidence,
      },
      false,
    );
  }

  if (evidence.digestParity === "mismatched") {
    return decision(
      patent,
      {
        kind: "held",
        reasonCode: "SOURCE_DIGEST_MISMATCH",
        explanation: "The edition and reviewed ledger do not name the same pinned source PDF.",
        evidence,
      },
      false,
    );
  }

  if (!evidence.pinnedPdfBytes.matchesExpected) {
    const digestMismatch = evidence.pinnedPdfBytes.availability === "mismatch";
    return decision(
      patent,
      {
        kind: "held",
        reasonCode: digestMismatch ? "PINNED_PDF_DIGEST_MISMATCH" : "PINNED_PDF_BYTES_UNAVAILABLE",
        explanation: digestMismatch
          ? "The pinned local facsimile bytes do not match the digest declared by the edition and reviewed ledger."
          : "The publication gate could not verify the canonical pinned facsimile bytes against the edition and reviewed-ledger digest.",
        evidence,
      },
      false,
    );
  }

  if (!evidence.companionReadings) {
    return decision(
      patent,
      {
        kind: "held",
        reasonCode: "MISSING_COMPANION_READINGS",
        explanation:
          "Archival edition is missing synchronous paragraph-level parallel readings for visitor comprehension.",
        evidence,
      },
      false,
    );
  }

  if (!evidence.edition.structuralValidationPassed) {
    return decision(
      patent,
      {
        kind: "held",
        reasonCode: "STRUCTURAL_VALIDATION_FAILED",
        explanation:
          "Archival edition failed typed structural schema validation (for example, unanchored blocks or empty sections).",
        evidence,
      },
      false,
    );
  }

  if (evidence.figures.acceptedFigureCount !== evidence.figures.requiredFigureCount) {
    return decision(
      patent,
      {
        kind: "candidate",
        reasonCode: "FIGURE_ACCEPTANCE_PENDING",
        explanation:
          "One or more cited source figures lacks a reviewed, dimensioned, edition-bound crop; the facsimile remains available while that evidence is completed.",
        evidence,
      },
      false,
    );
  }

  return decision(
    patent,
    {
      kind: "accepted",
      reasonCode: "ACCEPTED",
      explanation:
        "Archival edition, reviewed ledger, source digest, companion readings, and required figure occurrences are accepted for publication.",
      evidence,
    },
    false,
  );
}
