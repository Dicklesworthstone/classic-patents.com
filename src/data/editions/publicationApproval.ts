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
 * Visitors still receive the pinned facsimile and all independently supportable educational
 * functionality with a clear review-status explanation when an edition is withheld.
 */

import type { CuratedSpecificationEdition, Patent } from "@/types/patent";
import {
  ARCHIVAL_PUBLICATION_STATE_OVERRIDES,
  type ArchivalPublicationDecision,
  type ArchivalPublicationStatus,
  evaluateTypedArchivalPublicationState,
} from "./archivalPublicationState";
import { ARCHIVAL_PARALLEL_READINGS } from "./parallelReadings";

export type { ArchivalPublicationDecision, ArchivalPublicationStatus };

export const ROOT_QA_WITHHELD_ARCHIVAL_EDITION_IDS = [
  // --- Historical reason: no edition object was bound at entry time ---
  "us-706737-fessenden-wireless",
  "us-621195-zeppelin-airship",
  "us-2708656-fermi-reactor",
  "us-3541541-engelbart-mouse",
  "us-313224-mergenthaler-linotype",
  "us-2297691-carlson-electrophotography",
  "us-233692-pelton-water-wheel",
  "us-2543181-land-polaroid",
  "us-3138743-kilby-integrated-circuit",
  "us-3353115-maiman-ruby-laser",
  "us-347140-thomson-welding",
  "us-400766-hall-aluminium",
  "us-542846-diesel-engine",
  "us-6120588-eink",
  // --- Historical reason: companion-reading map had not been authored ---
  "us-x72-whitney-cotton-gin",
  "us-395781-hollerith-tabulating",
  // --- Historical reason: reviewed-ledger coverage was incomplete ---
  // --- Historical fabrication repair (retained for audit provenance) ---
  "us-x1-hopkins-potash",
] as const;

export function isArchivalEditionExplicitlyWithheld(patentId: string): boolean {
  const override = ARCHIVAL_PUBLICATION_STATE_OVERRIDES[patentId];
  return override?.reasonCode === "FABRICATION_OR_RECONSTRUCTION_QUARANTINE";
}

export function evaluateArchivalPublicationState(
  patent: Pick<Patent, "id" | "archivalEdition" | "originalTextAsset">,
): ArchivalPublicationDecision {
  return evaluateTypedArchivalPublicationState(patent, {
    hasCompanionReadings: Boolean(ARCHIVAL_PARALLEL_READINGS[patent.id]),
    isQuarantined: isArchivalEditionExplicitlyWithheld(patent.id),
  });
}

export function archivalEditionForPublication(
  patent: Pick<Patent, "id" | "archivalEdition" | "originalTextAsset">,
): CuratedSpecificationEdition | undefined {
  const decision = evaluateArchivalPublicationState(patent);
  return decision.isPublished ? decision.publishedEdition : undefined;
}

/**
 * Project a canonical record across the server/client boundary without
 * serializing research-only source assets. Accepted editions remain available
 * to the renderer; held editions and all ledger metadata stay server-side.
 */
export function patentForPublicationViewer(
  patent: Patent,
  decision: ArchivalPublicationDecision,
): Patent {
  return {
    ...patent,
    archivalEdition: decision.publishedEdition,
    originalTextAsset: undefined,
  };
}
