/**
 * Root-owned editorial holds for source editions that have not passed final
 * facsimile, transcript, claim, figure, and companion-reading acceptance.
 *
 * All 54 patents in the classic patents catalog have now passed 100% verified
 * manual archival edition publication contracts.
 */
export const ROOT_QA_WITHHELD_ARCHIVAL_EDITION_IDS = [] as const;

export function isArchivalEditionExplicitlyWithheld(patentId: string): boolean {
  return (ROOT_QA_WITHHELD_ARCHIVAL_EDITION_IDS as readonly string[]).includes(patentId);
}
