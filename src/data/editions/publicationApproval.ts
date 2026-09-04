/**
 * publicationApproval.ts
 *
 * Typed, fail-closed publication state machine for Classic Patents archival editions.
 *
 * A stored edition is not automatically a published edition. Publication requires:
 * 1. An authored companion map (parallel readings),
 * 2. Positive full-facsimile review attestation (completeFacsimileReviewed === true),
 * 3. Structural validation without fatal schema errors,
 * 4. Zero fabrication / reconstruction quarantine holds.
 *
 * Editorial publication never decides whether a visitor can read the patent:
 * a complete verified edition remains readable while review notes are held, and
 * a page-complete reviewed ledger supplies the text face when no such edition
 * exists. The pinned facsimile remains a separate reference/download face.
 */

import type { CuratedSpecificationEdition, Patent } from "@/types/patent";
import {
  ARCHIVAL_PUBLICATION_STATE_OVERRIDES,
  type ArchivalPinnedPdfByteEvidence,
  type ArchivalPublicationDecision,
  type ArchivalPublicationStatus,
  evaluateTypedArchivalPublicationState,
} from "./archivalPublicationState";
import { ARCHIVAL_PARALLEL_READINGS } from "./parallelReadings";
import { verifyPinnedPdfBytesSync } from "./pinnedPdfByteVerification.server";
import { reviewedLedgerPublicationEvidenceFor } from "./reviewedLedgerPublicationEvidence.server";

export type { ArchivalPublicationDecision, ArchivalPublicationStatus };

export const ROOT_QA_WITHHELD_ARCHIVAL_EDITION_IDS = [
  // --- Historical reason: no edition object was bound at entry time ---
  "us-706737-fessenden-wireless",
  "us-2708656-fermi-reactor",
  "us-313224-mergenthaler-linotype",
  "us-2543181-land-polaroid",
  "us-347140-thomson-welding",
  "us-542846-diesel-engine",
  "us-6120588-eink",
  // --- Historical reason: companion-reading map had not been authored ---
  // --- Historical reason: reviewed-ledger coverage was incomplete ---
  // --- Historical fabrication repair (retained for audit provenance) ---
  "us-x1-hopkins-potash",
] as const;

export function isArchivalEditionExplicitlyWithheld(patentId: string): boolean {
  const override = ARCHIVAL_PUBLICATION_STATE_OVERRIDES[patentId];
  return (
    override?.reasonCode === "FABRICATION_OR_RECONSTRUCTION_QUARANTINE" ||
    override?.reasonCode === "AUDIT_RECONSTRUCTION_QUARANTINE"
  );
}

export function evaluateArchivalPublicationState(
  patent: Pick<
    Patent,
    "id" | "archivalEdition" | "originalTextAsset" | "originalPdfUrl" | "claims"
  >,
): ArchivalPublicationDecision {
  const expectedSha256 =
    patent.archivalEdition?.sourcePdfSha256 ?? patent.originalTextAsset?.sourcePdfSha256 ?? "";
  const byteVerification = verifyPinnedPdfBytesSync({
    patentId: patent.id,
    expectedSha256,
    publicPdfUrl: patent.originalPdfUrl,
  });
  const pinnedPdfBytes: ArchivalPinnedPdfByteEvidence = {
    canonicalPublicPdfUrl: byteVerification.canonicalPublicPdfUrl,
    expectedSha256: byteVerification.expectedSha256,
    actualSha256: byteVerification.actualSha256,
    availability: byteVerification.availability,
    matchesExpected: byteVerification.matchesExpected,
    reason: byteVerification.reason,
  };

  return evaluateTypedArchivalPublicationState(patent, {
    hasCompanionReadings: Boolean(ARCHIVAL_PARALLEL_READINGS[patent.id]),
    isQuarantined: isArchivalEditionExplicitlyWithheld(patent.id),
    ledgerContent: reviewedLedgerPublicationEvidenceFor(patent),
    pinnedPdfBytes,
  });
}

export function archivalEditionForPublication(
  patent: Pick<
    Patent,
    "id" | "archivalEdition" | "originalTextAsset" | "originalPdfUrl" | "claims"
  >,
): CuratedSpecificationEdition | undefined {
  const decision = evaluateArchivalPublicationState(patent);
  return decision.isPublished ? decision.publishedEdition : undefined;
}

/**
 * Source-reader selection is intentionally separate from editorial publication.
 * Deficiencies or pending reviews may be tracked internally, but they must never
 * prevent visitors from reading the patent text and curated archival edition.
 */
export function completeArchivalEditionForViewer(
  patent: Pick<Patent, "archivalEdition">,
  _decision?: Pick<ArchivalPublicationDecision, "reviewerAttestation">,
): CuratedSpecificationEdition | undefined {
  // An editorial hold is not a text gate: a fully reviewed edition remains
  // readable even while a crop, companion reading, or other release check is
  // pending. An edition explicitly recorded as an unfinished facsimile review
  // is different: render the complete page-marked reviewed ledger instead of
  // presenting that draft under the visitor-facing "complete" source heading.
  // Do not treat a missing legacy attestation as a negative one.
  return patent.archivalEdition?.completeFacsimileReviewed === false
    ? undefined
    : patent.archivalEdition;
}

/**
 * Project a canonical record across the server/client boundary without
 * serializing research-only source assets. Editorial release state never hides
 * a complete source face; when a stored edition itself is incomplete, the route
 * supplies its complete reviewed ledger instead. Raw ledger metadata stays
 * server-side.
 */
export function patentForSourceReader(
  patent: Patent,
  _decision?: ArchivalPublicationDecision,
): Patent {
  return {
    ...patent,
    archivalEdition: completeArchivalEditionForViewer(patent, _decision),
    originalTextAsset: undefined,
  };
}

/**
 * Backwards-compatible alias for patentForSourceReader.
 */
export const patentForPublicationViewer = patentForSourceReader;
