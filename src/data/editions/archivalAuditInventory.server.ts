/**
 * Server/CI-only inventory of strict archival-evidence work.
 *
 * This is deliberately not a publication or rendering policy.  It makes every
 * currently observable repair need explicit — including needs hidden behind a
 * stricter first decision — while the reader continues to choose an edition,
 * a complete reviewed transcript, or the pinned facsimile independently.
 */

import type { Patent } from "@/types/patent";
import type {
  ArchivalFigureEvidence,
  ArchivalPublicationDecision,
  ArchivalPublicationReasonCode,
} from "./archivalPublicationState";
import {
  completeArchivalEditionForViewer,
  evaluateArchivalPublicationState,
} from "./publicationApproval";
import { reviewedLedgerTextForViewer } from "./reviewedLedgerPublicationEvidence.server";

export const ARCHIVAL_AUDIT_REMEDIATION_CATEGORIES = [
  "figure",
  "facsimile-review",
  "ledger",
  "full-specification",
  "claim-parity",
  "reconstruction",
  "primary-facsimile",
  "other",
] as const;

export type ArchivalAuditRemediationCategory =
  (typeof ARCHIVAL_AUDIT_REMEDIATION_CATEGORIES)[number];
export type SourceReaderDelivery = "edition" | "transcript" | "facsimile";

export interface ArchivalAuditFinding {
  key: string;
  category: ArchivalAuditRemediationCategory;
  code: string;
  scope: "record" | "figure-occurrence";
  message: string;
  evidenceReferences: readonly string[];
  owningBeadIds: readonly string[];
  occurrence?: string;
  sourceFigure?: string;
  activeAsset?: string | null;
  missingEvidence?: readonly string[];
}

export interface ArchivalAuditInventoryRecord {
  patentId: string;
  patentNumber: string;
  title: string;
  strictDecision: {
    kind: ArchivalPublicationDecision["state"]["kind"];
    reasonCode: ArchivalPublicationReasonCode;
    isPublished: boolean;
  };
  storedEdition: {
    bound: boolean;
    completeFacsimileReviewed: boolean;
    structuralValidationPassed: boolean;
  };
  readerDelivery: SourceReaderDelivery;
  owningBeadIds: readonly string[];
  findings: readonly ArchivalAuditFinding[];
}

export interface ArchivalAuditInventory {
  schemaVersion: "classic-patents.archival-audit-inventory.v1";
  records: readonly ArchivalAuditInventoryRecord[];
  summary: {
    catalogueRecordCount: number;
    acceptedRecordCount: number;
    nonacceptedRecordCount: number;
    primaryReasonCounts: Readonly<Record<ArchivalAuditRemediationCategory, number>>;
    readerDeliveryCounts: Readonly<Record<SourceReaderDelivery, number>>;
    unacceptedFigureOccurrenceCount: number;
    recordsWithAttestedFiguresMissingLocators: number;
    recordsMissingFigureAttestationsAndLocators: number;
  };
}

function remediationCategoryFor(
  reasonCode: ArchivalPublicationReasonCode,
): ArchivalAuditRemediationCategory {
  switch (reasonCode) {
    case "FIGURE_ACCEPTANCE_PENDING":
    case "AUDIT_FIGURE_ACCEPTANCE_PENDING":
      return "figure";
    case "PENDING_FACSIMILE_REVIEW":
    case "AUDIT_FACSIMILE_REVIEW_PENDING":
      return "facsimile-review";
    case "MISSING_REVIEWED_LEDGER":
    case "MISSING_LEDGER_REVIEWER":
    case "MISSING_LEDGER_REVIEW_DATE":
    case "LEDGER_CONTENT_COVERAGE_INCOMPLETE":
    case "MISSING_COMPANION_READINGS":
    case "MISSING_SOURCE_DIGEST":
    case "SOURCE_DIGEST_MISMATCH":
    case "STRUCTURAL_VALIDATION_FAILED":
    case "NO_EDITION_BOUND":
      return "ledger";
    case "AUDIT_LEDGER_ACCEPTANCE_PENDING":
      return "ledger";
    case "AUDIT_FULL_SPECIFICATION_PENDING":
      return "full-specification";
    case "AUDIT_CLAIM_PARITY_PENDING":
      return "claim-parity";
    case "FABRICATION_OR_RECONSTRUCTION_QUARANTINE":
    case "AUDIT_RECONSTRUCTION_QUARANTINE":
      return "reconstruction";
    case "PINNED_PDF_BYTES_UNAVAILABLE":
    case "PINNED_PDF_DIGEST_MISMATCH":
    case "AUDIT_PRIMARY_FACSIMILE_PENDING":
      return "primary-facsimile";
    case "ACCEPTED":
    case "AUDIT_SOURCE_BOUNDED":
      return "other";
  }
}

function owningBeadIds(decision: ArchivalPublicationDecision): readonly string[] {
  return decision.state.evidence.evidenceReferences
    .flatMap((reference) => (reference.startsWith("beads:") ? [reference.slice(6)] : []))
    .toSorted();
}

/** Exactly one reader mode is always available, independently of strict audit acceptance. */
export function sourceReaderDeliveryForAudit(patent: Patent): SourceReaderDelivery {
  if (completeArchivalEditionForViewer(patent)) return "edition";
  if (reviewedLedgerTextForViewer(patent)) return "transcript";
  return "facsimile";
}

function figureMissingEvidence(
  figure: ArchivalFigureEvidence,
  decision: ArchivalPublicationDecision,
): readonly string[] {
  if (figure.status === "accepted") return [];
  const missing: string[] = [];
  if (!decision.figureManifest.attestation) {
    missing.push("digest-pinned-asset-attestation");
  } else if (!decision.figureManifest.attestation.matchesEdition) {
    missing.push("edition-bound-asset-attestation");
  }
  if (
    !figure.sourcePdfPage ||
    !figure.sourceRaster ||
    !figure.sourceRectPixels ||
    !figure.sourceRegion
  ) {
    missing.push("reviewed-source-pdf-occurrence-locator");
  }
  if (!figure.locatorReviewer || !figure.locatorReviewedAt) {
    missing.push("occurrence-locator-reviewer-and-date");
  }
  return missing;
}

function latentFindings(
  _patent: Patent,
  decision: ArchivalPublicationDecision,
): readonly ArchivalAuditFinding[] {
  if (decision.isPublished) return [];

  const beadIds = owningBeadIds(decision);
  const references = decision.state.evidence.evidenceReferences;
  const evidence = decision.state.evidence;
  const findings: ArchivalAuditFinding[] = [
    {
      key: `strict:${decision.reasonCode}`,
      category: remediationCategoryFor(decision.reasonCode),
      code: decision.reasonCode,
      scope: "record",
      message: decision.explanation,
      evidenceReferences: references,
      owningBeadIds: beadIds,
    },
  ];

  if (!evidence.edition.bound) {
    findings.push({
      key: "edition:not-bound",
      category: "full-specification",
      code: "NO_EDITION_BOUND",
      scope: "record",
      message: "No hand-authored archival edition is bound to this record.",
      evidenceReferences: references,
      owningBeadIds: beadIds,
    });
  } else {
    if (!evidence.edition.completeFacsimileReviewed) {
      findings.push({
        key: "edition:facsimile-review",
        category: "facsimile-review",
        code: "PENDING_FACSIMILE_REVIEW",
        scope: "record",
        message: "The stored archival edition has not completed full facsimile review.",
        evidenceReferences: references,
        owningBeadIds: beadIds,
      });
    }
    if (!evidence.edition.structuralValidationPassed) {
      findings.push({
        key: "edition:structural-validation",
        category: "full-specification",
        code: "STRUCTURAL_VALIDATION_FAILED",
        scope: "record",
        message: "The stored archival edition fails typed structural validation.",
        evidenceReferences: references,
        owningBeadIds: beadIds,
      });
    }
  }

  if (evidence.ledger.kind !== "reviewed-transcription") {
    findings.push({
      key: "ledger:reviewed-transcription",
      category: "ledger",
      code: "MISSING_REVIEWED_LEDGER",
      scope: "record",
      message: "The archival record has no canonical reviewed-transcription ledger.",
      evidenceReferences: references,
      owningBeadIds: beadIds,
    });
  }
  if (!evidence.ledger.reviewer) {
    findings.push({
      key: "ledger:reviewer",
      category: "ledger",
      code: "MISSING_LEDGER_REVIEWER",
      scope: "record",
      message: "The reviewed ledger has no accountable reviewer.",
      evidenceReferences: references,
      owningBeadIds: beadIds,
    });
  }
  if (!evidence.ledger.reviewedAt) {
    findings.push({
      key: "ledger:review-date",
      category: "ledger",
      code: "MISSING_LEDGER_REVIEW_DATE",
      scope: "record",
      message: "The reviewed ledger has no accountable review date.",
      evidenceReferences: references,
      owningBeadIds: beadIds,
    });
  }
  if (!evidence.ledgerContent.valid) {
    findings.push({
      key: `ledger:${evidence.ledgerContent.status}`,
      category: "ledger",
      code: evidence.ledgerContent.status,
      scope: "record",
      message:
        evidence.ledgerContent.error ??
        "The reviewed ledger does not yet meet its content contract.",
      evidenceReferences: references,
      owningBeadIds: beadIds,
    });
  }
  if (evidence.digestParity !== "matching") {
    findings.push({
      key: `source-digest:${evidence.digestParity}`,
      category: "primary-facsimile",
      code:
        evidence.digestParity === "mismatched" ? "SOURCE_DIGEST_MISMATCH" : "MISSING_SOURCE_DIGEST",
      scope: "record",
      message:
        "The archival edition and reviewed ledger do not prove matching pinned-source digests.",
      evidenceReferences: references,
      owningBeadIds: beadIds,
    });
  }
  if (!evidence.pinnedPdfBytes.matchesExpected) {
    findings.push({
      key: `pinned-pdf:${evidence.pinnedPdfBytes.reason}`,
      category: "primary-facsimile",
      code: evidence.pinnedPdfBytes.reason,
      scope: "record",
      message: "The strict audit cannot verify the canonical pinned facsimile bytes.",
      evidenceReferences: references,
      owningBeadIds: beadIds,
    });
  }
  if (!evidence.companionReadings) {
    findings.push({
      key: "parallel-readings:missing",
      category: "full-specification",
      code: "MISSING_COMPANION_READINGS",
      scope: "record",
      message: "The archival edition has no complete paragraph-level parallel-reading map.",
      evidenceReferences: references,
      owningBeadIds: beadIds,
    });
  }

  for (const figure of decision.figureManifest.figures) {
    const missingEvidence = figureMissingEvidence(figure, decision);
    if (missingEvidence.length === 0) continue;
    findings.push({
      key: `figure:${figure.occurrence}`,
      category: "figure",
      code: "FIGURE_OCCURRENCE_UNACCEPTED",
      scope: "figure-occurrence",
      message: figure.rejectionReason ?? "This source-figure occurrence remains unaccepted.",
      evidenceReferences: references,
      owningBeadIds: beadIds,
      occurrence: figure.occurrence,
      sourceFigure: figure.sourceFigure,
      activeAsset: figure.activeAsset,
      missingEvidence,
    });
  }

  return findings.toSorted((left, right) => left.key.localeCompare(right.key));
}

function zeroedCategories(): Record<ArchivalAuditRemediationCategory, number> {
  return Object.fromEntries(
    ARCHIVAL_AUDIT_REMEDIATION_CATEGORIES.map((category) => [category, 0]),
  ) as Record<ArchivalAuditRemediationCategory, number>;
}

export function buildArchivalAuditInventory(patents: readonly Patent[]): ArchivalAuditInventory {
  const primaryReasonCounts = zeroedCategories();
  const readerDeliveryCounts: Record<SourceReaderDelivery, number> = {
    edition: 0,
    transcript: 0,
    facsimile: 0,
  };
  let acceptedRecordCount = 0;
  let unacceptedFigureOccurrenceCount = 0;
  let recordsWithAttestedFiguresMissingLocators = 0;
  let recordsMissingFigureAttestationsAndLocators = 0;

  const records = patents
    .map((patent) => {
      const decision = evaluateArchivalPublicationState(patent);
      const readerDelivery = sourceReaderDeliveryForAudit(patent);
      readerDeliveryCounts[readerDelivery]++;
      const owningBeads = owningBeadIds(decision);
      const findings = latentFindings(patent, decision);

      if (decision.isPublished) {
        acceptedRecordCount++;
      } else {
        primaryReasonCounts[remediationCategoryFor(decision.reasonCode)]++;
        const unacceptedFigures = findings.filter(
          (finding) => finding.scope === "figure-occurrence",
        );
        unacceptedFigureOccurrenceCount += unacceptedFigures.length;
        if (unacceptedFigures.length > 0) {
          const allHaveAttestations = unacceptedFigures.every(
            (finding) => !finding.missingEvidence?.includes("digest-pinned-asset-attestation"),
          );
          const allNeedLocators = unacceptedFigures.every((finding) =>
            finding.missingEvidence?.includes("reviewed-source-pdf-occurrence-locator"),
          );
          if (allHaveAttestations && allNeedLocators) {
            recordsWithAttestedFiguresMissingLocators++;
          }
          if (
            unacceptedFigures.every((finding) =>
              finding.missingEvidence?.includes("digest-pinned-asset-attestation"),
            ) &&
            allNeedLocators
          ) {
            recordsMissingFigureAttestationsAndLocators++;
          }
        }
      }

      return {
        patentId: patent.id,
        patentNumber: patent.patentNumber,
        title: patent.title,
        strictDecision: {
          kind: decision.state.kind,
          reasonCode: decision.reasonCode,
          isPublished: decision.isPublished,
        },
        storedEdition: {
          bound: decision.state.evidence.edition.bound,
          completeFacsimileReviewed: decision.state.evidence.edition.completeFacsimileReviewed,
          structuralValidationPassed: decision.state.evidence.edition.structuralValidationPassed,
        },
        readerDelivery,
        owningBeadIds: owningBeads,
        findings,
      } satisfies ArchivalAuditInventoryRecord;
    })
    .toSorted((left, right) => left.patentId.localeCompare(right.patentId));

  return {
    schemaVersion: "classic-patents.archival-audit-inventory.v1",
    records,
    summary: {
      catalogueRecordCount: records.length,
      acceptedRecordCount,
      nonacceptedRecordCount: records.length - acceptedRecordCount,
      primaryReasonCounts,
      readerDeliveryCounts,
      unacceptedFigureOccurrenceCount,
      recordsWithAttestedFiguresMissingLocators,
      recordsMissingFigureAttestationsAndLocators,
    },
  };
}
