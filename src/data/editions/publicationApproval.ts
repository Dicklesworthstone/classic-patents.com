/**
 * Root-owned editorial holds for source editions that have not passed final
 * facsimile, transcript, claim, figure, and companion-reading acceptance.
 *
 * A patent-local author may prepare an edition and export a companion map, but
 * only final QA may remove an id from this list. Keeping the decision outside
 * the registry prevents a bulk map merge from making a draft visitor-facing.
 */
export const ROOT_QA_WITHHELD_ARCHIVAL_EDITION_IDS = [
  "us-313224-mergenthaler-linotype",
  "us-395781-hollerith-tabulating",
  "us-586193-marconi-radio",
  "us-2292387-lamarr-frequency-hopping",
  "us-2708656-fermi-reactor",
  "us-3541541-engelbart-mouse",
  "us-3858232-boyle-smith-ccd",
] as const;

export function isArchivalEditionExplicitlyWithheld(patentId: string): boolean {
  return ROOT_QA_WITHHELD_ARCHIVAL_EDITION_IDS.some((withheldId) => withheldId === patentId);
}
