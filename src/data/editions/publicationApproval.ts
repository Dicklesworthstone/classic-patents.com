/**
 * Root-owned editorial holds for source editions that have not passed final
 * facsimile, transcript, claim, figure, and companion-reading acceptance.
 *
 * A patent-local author may prepare an edition and export a companion map, but
 * only final QA may remove an id from this list. Keeping the decision outside
 * the registry prevents a bulk map merge from making a draft visitor-facing.
 */

import type { Patent } from "@/types/patent";
import { ARCHIVAL_PARALLEL_READINGS } from "./parallelReadings";

export const ROOT_QA_WITHHELD_ARCHIVAL_EDITION_IDS = [
  "us-x72-whitney-cotton-gin",
  "us-313224-mergenthaler-linotype",
  "us-2708656-fermi-reactor",
  "us-3671542-kwolek-kevlar",
] as const;

export function isArchivalEditionExplicitlyWithheld(patentId: string): boolean {
  return ROOT_QA_WITHHELD_ARCHIVAL_EDITION_IDS.some((withheldId) => withheldId === patentId);
}

export function archivalEditionForPublication(patent: Pick<Patent, "id" | "archivalEdition">) {
  return patent.archivalEdition &&
    !isArchivalEditionExplicitlyWithheld(patent.id) &&
    ARCHIVAL_PARALLEL_READINGS[patent.id]
    ? patent.archivalEdition
    : undefined;
}
