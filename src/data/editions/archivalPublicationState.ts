/**
 * Typed evidence for the archival-publication boundary.
 *
 * This module intentionally consumes catalogue metadata, not prose from a
 * provenance receipt. Receipt prose remains research evidence; an editorial
 * release or hold must be represented here as data the renderer and the
 * release gate can evaluate consistently.
 */

import type { CuratedSpecificationEdition, Patent } from "@/types/patent";
import { validateCuratedSpecificationEdition } from "../archivalEditionValidation";

export const ARCHIVAL_PUBLICATION_REASON_CODES = [
  "ACCEPTED",
  "NO_EDITION_BOUND",
  "PENDING_FACSIMILE_REVIEW",
  "MISSING_COMPANION_READINGS",
  "STRUCTURAL_VALIDATION_FAILED",
  "MISSING_REVIEWED_LEDGER",
  "MISSING_LEDGER_REVIEWER",
  "MISSING_LEDGER_REVIEW_DATE",
  "MISSING_SOURCE_DIGEST",
  "SOURCE_DIGEST_MISMATCH",
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
  /**
   * Existing legacy editions often name a figure but do not retain its PDF
   * page/rectangle separately. Null records that absence honestly; it does
   * not turn a crop filename into a page locator.
   */
  sourcePdfPage: number | null;
  sourceRegion: string | null;
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
  figures: readonly ArchivalFigureEvidence[];
}

export interface ArchivalPublicationEvidence {
  edition: {
    bound: boolean;
    completeFacsimileReviewed: boolean;
    structuralValidationPassed: boolean;
    reviewer: string | null;
    reviewedAt: string | null;
  };
  ledger: {
    kind: Patent["originalTextAsset"] extends infer Asset
      ? Asset extends { kind?: infer Kind }
        ? Kind
        : never
      : never;
    reviewer: string | null;
    reviewedAt: string | null;
    sourcePdfSha256: string | null;
  };
  digestParity: "matching" | "mismatched" | "unavailable";
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
  "us-6594844-roomba": auditHold(
    "AUDIT_FIGURE_ACCEPTANCE_PENDING",
    "classic-patentscom-k3e",
    "The archival source face remains held until every required source figure receives independent acceptance.",
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
  "us-3858232-boyle-smith-ccd": auditHold(
    "AUDIT_LEDGER_ACCEPTANCE_PENDING",
    "classic-patentscom-aj7",
    "The page ledger needs repair and independent acceptance before publication.",
  ),
  "us-3671542-kwolek-kevlar": auditHold(
    "AUDIT_PRIMARY_FACSIMILE_PENDING",
    "classic-patentscom-0io",
    "Facsimile recovery remains incomplete; the source face is therefore not accepted.",
    "facsimile-only",
  ),
  "us-3541541-engelbart-mouse": auditHold(
    "AUDIT_LEDGER_ACCEPTANCE_PENDING",
    "classic-patentscom-7ea",
    "The source ledger and source-bounded presentation require repair before archival release.",
  ),
  "us-3353115-maiman-ruby-laser": auditHold(
    "AUDIT_FIGURE_ACCEPTANCE_PENDING",
    "classic-patentscom-ug8",
    "Complete figure review is still required before the archival edition can be accepted.",
  ),
  "us-3138743-kilby-integrated-circuit": auditHold(
    "AUDIT_FIGURE_ACCEPTANCE_PENDING",
    "classic-patentscom-ndg",
    "Source-approved figures and ledger acceptance are pending.",
  ),
  "us-2981877-noyce-ic": auditHold(
    "AUDIT_FIGURE_ACCEPTANCE_PENDING",
    "classic-patentscom-6xs",
    "The Figure 3 and Figure 5 source crops require acceptance.",
  ),
  "us-2929922-townes-laser": auditHold(
    "AUDIT_FACSIMILE_REVIEW_PENDING",
    "classic-patentscom-zr3",
    "The archival packet requires rebuild and re-acceptance.",
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
  "us-2524035-bardeen-transistor": auditHold(
    "AUDIT_FIGURE_ACCEPTANCE_PENDING",
    "classic-patentscom-cgk",
    "Per-figure crop acceptance is pending.",
  ),
  "us-2297691-carlson-electrophotography": auditHold(
    "AUDIT_FIGURE_ACCEPTANCE_PENDING",
    "classic-patentscom-i4b",
    "The work-in-progress source crops require repair and acceptance.",
  ),
  "us-2292387-lamarr-frequency-hopping": auditHold(
    "AUDIT_FIGURE_ACCEPTANCE_PENDING",
    "classic-patentscom-j07",
    "Independent crop acceptance is pending.",
  ),
  "us-1773980-farnsworth-tv": auditHold(
    "AUDIT_FIGURE_ACCEPTANCE_PENDING",
    "classic-patentscom-1t5",
    "The crop acceptance hold remains in force.",
  ),
  "us-1102653-goddard-rocket": auditHold(
    "AUDIT_FACSIMILE_REVIEW_PENDING",
    "classic-patentscom-owu",
    "The source hold remains in force while the source-bound presentation is repaired.",
  ),
  "us-942699-baekeland-bakelite": auditHold(
    "AUDIT_FACSIMILE_REVIEW_PENDING",
    "classic-patentscom-5wq",
    "The archival hold requires reconciliation before publication.",
  ),
  "us-808897-carrier-air-conditioner": auditHold(
    "AUDIT_FACSIMILE_REVIEW_PENDING",
    "classic-patentscom-365",
    "The source face is held while the mechanism and archival evidence are reconciled.",
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
  "us-621195-zeppelin-airship": auditHold(
    "AUDIT_LEDGER_ACCEPTANCE_PENDING",
    "classic-patentscom-gmx",
    "Ledger and claim-source correction is pending.",
  ),
  "us-613809-tesla-teleautomaton": auditHold(
    "AUDIT_FACSIMILE_REVIEW_PENDING",
    "classic-patentscom-a4b",
    "The archival edition remains withheld while source support is repaired.",
  ),
  "us-608969-parsons-turbine": auditHold(
    "AUDIT_FIGURE_ACCEPTANCE_PENDING",
    "classic-patentscom-5e8",
    "Accepted source crops are required before archival release.",
  ),
  "us-313224-mergenthaler-linotype": auditHold(
    "AUDIT_FULL_SPECIFICATION_PENDING",
    "classic-patentscom-0tl",
    "The archival recovery is incomplete.",
    "source-bounded",
  ),
  "us-307031-edison-indicator": auditHold(
    "AUDIT_FACSIMILE_REVIEW_PENDING",
    "classic-patentscom-l69",
    "The original publication hold remains in force.",
  ),
  "us-235199-bell-photophone": auditHold(
    "AUDIT_FIGURE_ACCEPTANCE_PENDING",
    "classic-patentscom-8vw",
    "The crop hold remains in force.",
  ),
  "us-233692-pelton-water-wheel": auditHold(
    "AUDIT_FACSIMILE_REVIEW_PENDING",
    "classic-patentscom-uuv",
    "The facsimile publication packet remains incomplete.",
    "source-bounded",
  ),
  "us-542846-diesel-engine": auditHold(
    "AUDIT_FACSIMILE_REVIEW_PENDING",
    "classic-patentscom-87z",
    "The provenance hold must be reconciled before the source edition is released.",
  ),
  "us-400766-hall-aluminium": auditHold(
    "AUDIT_FIGURE_ACCEPTANCE_PENDING",
    "classic-patentscom-cq9",
    "The candidate edition remains detached pending figure acceptance.",
    "candidate",
  ),
  "us-395781-hollerith-tabulating": auditHold(
    "AUDIT_FIGURE_ACCEPTANCE_PENDING",
    "classic-patentscom-jks",
    "All 17 figure previews require QA acceptance.",
  ),
  "us-157124-glidden-barbed-wire": auditHold(
    "AUDIT_FIGURE_ACCEPTANCE_PENDING",
    "classic-patentscom-kk6",
    "Held source crops require replacement and acceptance.",
  ),
  "us-120057-gramme-dynamo": auditHold(
    "AUDIT_FIGURE_ACCEPTANCE_PENDING",
    "classic-patentscom-s9t",
    "Crop acceptance remains incomplete.",
  ),
  "us-48475-yale-lock": auditHold(
    "AUDIT_FIGURE_ACCEPTANCE_PENDING",
    "classic-patentscom-l6d",
    "The source face remains withheld pending crop acceptance.",
  ),
  "us-6162-corliss-steam-engine": auditHold(
    "AUDIT_FIGURE_ACCEPTANCE_PENDING",
    "classic-patentscom-efu",
    "Verified crop acceptance is pending.",
  ),
  "us-4750-howe-sewing-machine": auditHold(
    "AUDIT_FIGURE_ACCEPTANCE_PENDING",
    "classic-patentscom-pxe",
    "Rejected figure previews require source-faithful replacements.",
    "rejected",
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
  "gb-1420-cort-puddling-process": auditHold(
    "AUDIT_FACSIMILE_REVIEW_PENDING",
    "classic-patentscom-xqu",
    "The archival hold remains in force while source support is completed.",
    "source-bounded",
  ),
  "gb-1306-newcomen-steam-engine": auditHold(
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
  "us-821393-wright-flyer": auditHold(
    "AUDIT_FIGURE_ACCEPTANCE_PENDING",
    "classic-patentscom-971",
    "The held preview set requires complete source-crop acceptance.",
  ),
  "us-727650-linde-air-liquefaction": auditHold(
    "AUDIT_FIGURE_ACCEPTANCE_PENDING",
    "classic-patentscom-0tc",
    "The Figure 3 crop requires acceptance.",
  ),
  "us-31128-otis-elevator": auditHold(
    "AUDIT_LEDGER_ACCEPTANCE_PENDING",
    "classic-patentscom-1np",
    "Ledger and claim-source contract completion is pending.",
  ),
  "us-6469-lincoln-buoy": auditHold(
    "AUDIT_LEDGER_ACCEPTANCE_PENDING",
    "classic-patentscom-n57",
    "The reviewed ledger must be restored before archival release.",
  ),
  "us-132-davenport-electric-motor": auditHold(
    "AUDIT_LEDGER_ACCEPTANCE_PENDING",
    "classic-patentscom-d10",
    "The reviewed ledger must be restored before archival release.",
  ),
  "us-x8277-mccormick-reaper": auditHold(
    "AUDIT_CLAIM_PARITY_PENDING",
    "classic-patentscom-phm",
    "Publication remains held while the legal-text contract is repaired.",
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
  edition: CuratedSpecificationEdition | undefined,
): ArchivalFigureManifest {
  if (!edition) return { requiredFigureCount: 0, acceptedFigureCount: 0, figures: [] };
  const preparedBy = typeof edition.preparedBy === "string" ? edition.preparedBy : "";
  const preparedAt = typeof edition.preparedAt === "string" ? edition.preparedAt : "";

  const figures = edition.blocks.flatMap((_, blockIndex) =>
    inlinesForBlock(edition, blockIndex).flatMap((inlines, groupIndex) =>
      inlines.flatMap((inline, inlineIndex) => {
        if (inline.kind !== "reference" || inline.referenceType !== "figure") return [];
        const preview = inline.figurePreviews?.[0];
        const dimensions =
          preview && preview.width > 0 && preview.height > 0
            ? { width: preview.width, height: preview.height }
            : null;
        const accepted = Boolean(
          preview?.src &&
            preview.alt.trim() &&
            dimensions &&
            preparedBy.trim() &&
            preparedAt.trim(),
        );
        return [
          {
            occurrence: `edition-block-${blockIndex}-group-${groupIndex}-inline-${inlineIndex}`,
            sourceFigure: inline.text,
            sourcePdfPage: null,
            sourceRegion: null,
            activeAsset: preview?.src ?? null,
            priorAssets: (inline.figurePreviews ?? []).slice(1).map((candidate) => candidate.src),
            assetSha256: null,
            dimensions,
            status: accepted ? "accepted" : "pending",
            reviewer: accepted ? preparedBy : null,
            reviewedAt: accepted ? preparedAt : null,
            rejectionReason: accepted
              ? null
              : "This figure occurrence lacks a reviewed, dimensioned source crop.",
          } satisfies ArchivalFigureEvidence,
        ];
      }),
    ),
  );

  return {
    requiredFigureCount: figures.length,
    acceptedFigureCount: figures.filter((figure) => figure.status === "accepted").length,
    figures,
  };
}

function baseEvidence(
  patent: Pick<Patent, "id" | "archivalEdition" | "originalTextAsset">,
  hasCompanionReadings: boolean,
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
      kind: asset?.kind,
      reviewer: asset?.reviewedBy ?? null,
      reviewedAt: asset?.reviewedAt ?? null,
      sourcePdfSha256: ledgerDigest,
    },
    digestParity,
    companionReadings: hasCompanionReadings,
    claimDisposition: edition?.claimStatus ? "no-formal-claims" : "formal-claims",
    drawingDisposition: edition?.drawingStatus ? "no-drawings" : "drawings-required",
    figures: figureManifestForEdition(edition),
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
  options: { hasCompanionReadings: boolean; isQuarantined?: boolean } = {
    hasCompanionReadings: false,
  },
): ArchivalPublicationDecision {
  const evidence = baseEvidence(patent, options.hasCompanionReadings);
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
