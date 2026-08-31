/**
 * Historical root-QA roster retained as an audit record and compatibility
 * export. Despite the legacy constant name, membership here is not an active
 * publication veto: several entries were subsequently repaired and released.
 *
 * A stored edition is not automatically a published edition. Publication
 * requires an authored companion map and a positive full-facsimile review
 * attestation. This preserves useful WIP source material without presenting it
 * to visitors as reviewed historical text.
 *
 * At the time each id entered the roster, one or more of these conditions held:
 *  - the source edition was not bound yet (no edition object), or
 *  - the companion-reading map is not authored yet (publishing would crash
 *    the fail-closed renderer), or
 *  - the reviewed ledger substantively diverges from the edition (under
 *    ~70% literal coverage), meaning the text is not yet verbatim-reviewed, or
 *  - the record was found to fabricate facsimile content.
 *
 * Microscopic gaps — a thin companion sentence, a sub-floor decoder, an
 * imperfect figure crop — no longer justify hiding an entire document.
 *
 * The active boundary is executable below: a positive full-facsimile review,
 * a companion reading map, structural validation, and no fabrication hold.
 * Releasing a repaired edition does not rewrite this historical roster.
 */

import type { Patent } from "@/types/patent";
import { validateCuratedSpecificationEdition } from "../archivalEditionValidation";
import { ARCHIVAL_PARALLEL_READINGS } from "./parallelReadings";

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
  // Fabrication holds are an additional hard stop. Review attestation and
  // companion-map checks are enforced separately below.
  return FABRICATED_CONTENT_HOLD_IDS.has(patentId);
}

// No active fabrication holds. us-x1-hopkins-potash was repaired 2026-08-22:
// its invented kiln/vat/kettle callouts and schematic were removed; the
// drawing entry now points at the real parchment crop with an honest caption.
const FABRICATED_CONTENT_HOLD_IDS = new Set<string>([]);

export function archivalEditionForPublication(patent: Pick<Patent, "id" | "archivalEdition">) {
  if (isArchivalEditionExplicitlyWithheld(patent.id)) return undefined;
  if (!ARCHIVAL_PARALLEL_READINGS[patent.id]) return undefined;
  if (!patent.archivalEdition) return undefined;
  if (!validateCuratedSpecificationEdition(patent.archivalEdition).valid) return undefined;
  return patent.archivalEdition;
}
