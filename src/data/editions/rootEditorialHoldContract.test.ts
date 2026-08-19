import { describe, expect, test } from "bun:test";
import { archivalEditionForPublication } from "@/components/patents/DualProjectionViewer";
import { allPatents } from "@/data/patents";
import { ARCHIVAL_PARALLEL_READINGS } from "./parallelReadings";
import { ROOT_QA_WITHHELD_ARCHIVAL_EDITION_IDS } from "./publicationApproval";

/**
 * Independent release sentinel for editions that have failed source QA.
 *
 * This list intentionally does not share a constant with the editable
 * publication map. A mistaken bulk registration must therefore fail the
 * release path instead of exposing an incomplete source face to visitors.
 */
const REQUIRED_ROOT_EDITORIAL_HOLDS = [
  "us-313224-mergenthaler-linotype",
  "us-395781-hollerith-tabulating",
  "us-586193-marconi-radio",
  "us-727650-linde-air-liquefaction",
  "us-2292387-lamarr-frequency-hopping",
  "us-2708656-fermi-reactor",
  "us-3541541-engelbart-mouse",
  "us-3671542-kwolek-kevlar",
  "us-3858232-boyle-smith-ccd",
] as const;

describe("root editorial publication holds", () => {
  test("keeps every rejected edition unavailable through the actual visitor lookup", () => {
    expect([...ROOT_QA_WITHHELD_ARCHIVAL_EDITION_IDS].map(String).sort()).toEqual(
      [...REQUIRED_ROOT_EDITORIAL_HOLDS].map(String).sort(),
    );

    for (const patentId of REQUIRED_ROOT_EDITORIAL_HOLDS) {
      const patent = allPatents.find((candidate) => candidate.id === patentId);
      expect(patent, `missing catalog record ${patentId}`).toBeDefined();
      if (!patent) continue;

      expect(ARCHIVAL_PARALLEL_READINGS[patentId]).toBeUndefined();
      expect(archivalEditionForPublication(patent)).toBeUndefined();
    }
  });
});
