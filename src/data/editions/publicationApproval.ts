/**
 * Root-owned editorial holds for source editions that have not passed final
 * facsimile, transcript, claim, figure, and companion-reading acceptance.
 *
 * Editorial calibration (root decision, 2026-08-22): withholding a readable
 * full-text edition costs the visitor more than publishing it with minor
 * imperfections. Holds are therefore reserved for substantive defects only:
 *
 *  - the source edition is not bound yet (no edition object), or
 *  - the companion-reading map is not authored yet (publishing would crash
 *    the fail-closed renderer), or
 *  - the reviewed ledger substantively diverges from the edition (under
 *    ~70% literal coverage), meaning the text is not yet verbatim-reviewed, or
 *  - the record was found to fabricate facsimile content.
 *
 * Microscopic gaps — a thin companion sentence, a sub-floor decoder, an
 * imperfect figure crop — no longer justify hiding an entire document.
 *
 * A patent-local author may prepare an edition and export a companion map, but
 * only final QA may remove an id from this list. Keeping the decision outside
 * the registry prevents a bulk map merge from making a draft visitor-facing.
 */

import type { Patent } from "@/types/patent";
import { ARCHIVAL_PARALLEL_READINGS } from "./parallelReadings";

export const ROOT_QA_WITHHELD_ARCHIVAL_EDITION_IDS = [
  // --- No edition object is bound yet (nothing to publish) ---
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
  // --- Companion-reading map not authored yet (renderer is fail-closed) ---
  "us-x72-whitney-cotton-gin",
  "us-395781-hollerith-tabulating",
  // --- Reviewed ledger substantively incomplete (under ~70% literal
  //     coverage): the edition text is not yet verbatim-reviewed ---
  "us-3671542-kwolek-kevlar", // 32% of edition blocks verified against ledger.
  "us-3237-rillieux-evaporator", // 38% verified.
  "us-1102653-goddard-rocket", // 46% verified; ledger missing 21 of 39 blocks.
  "us-6285999-pagerank", // 48% verified.
  "us-2929922-townes-laser", // 52% verified.
  "us-7479949-multitouch", // 62% verified.
  "us-6331181-davinci", // 63% verified.
  // --- Fabricated facsimile content: presence would be worse than absence ---
  "us-x1-hopkins-potash", // Record invents an apparatus drawing/callouts and precise process numbers absent from the one-page grant.
] as const;

export function isArchivalEditionExplicitlyWithheld(patentId: string): boolean {
  // OWNER POLICY (Jeffrey Emanuel, 2026-08-22): only editions whose content
  // is fabricated relative to the source facsimile stay withheld. Nit-pick
  // holds (missing companions, partial ledger verification, pending
  // facsimile attestation) no longer gate publication — a missing complete
  // original text is a far worse visitor outcome than its presence with
  // gaps. The viewer discloses maturity honestly instead.
  return FABRICATED_CONTENT_HOLD_IDS.has(patentId);
}

const FABRICATED_CONTENT_HOLD_IDS = new Set<string>([
  "us-x1-hopkins-potash", // invents apparatus drawing/callouts and process numbers absent from the one-page grant
]);

export function archivalEditionForPublication(patent: Pick<Patent, "id" | "archivalEdition">) {
  if (isArchivalEditionExplicitlyWithheld(patent.id)) return undefined;
  return patent.archivalEdition ?? undefined;
}
