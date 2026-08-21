import { describe, expect, test } from "bun:test";
import { allPatents } from "@/data/patents";
import { carlsonElectrophotographyPatent } from "@/data/patents/carlson-electrophotography";
import { ARCHIVAL_PARALLEL_READINGS } from "./parallelReadings";
import {
  archivalEditionForPublication,
  ROOT_QA_WITHHELD_ARCHIVAL_EDITION_IDS,
} from "./publicationApproval";

/**
 * Independent release sentinel for editions that have failed source QA.
 *
 * This list intentionally does not share a constant with the editable
 * publication map. A mistaken bulk registration must therefore fail the
 * release path instead of exposing an incomplete source face to visitors.
 */
const REQUIRED_ROOT_EDITORIAL_HOLDS = [
  "us-x72-whitney-cotton-gin",
  "us-395781-hollerith-tabulating",
  "us-2929922-townes-laser",
  "us-3671542-kwolek-kevlar",
] as const;

const SOURCE_QA_RELEASED_EDITIONS = [
  "us-3633-goodyear-rubber",
  "us-135245-pasteur-fermentation",
  "us-682690-hewitt-mercury-lamp",
  "us-706737-fessenden-wireless",
  "us-2292387-lamarr-frequency-hopping",
  "us-2297691-carlson-electrophotography",
] as const;

describe("root editorial publication holds", () => {
  test("keeps every rejected edition unavailable through the actual visitor lookup", () => {
    expect([...ROOT_QA_WITHHELD_ARCHIVAL_EDITION_IDS].map(String).sort()).toEqual(
      [...REQUIRED_ROOT_EDITORIAL_HOLDS].map(String).sort(),
    );

    for (const patentId of REQUIRED_ROOT_EDITORIAL_HOLDS) {
      const patent =
        allPatents.find((candidate) => candidate.id === patentId) ??
        (patentId === carlsonElectrophotographyPatent.id
          ? carlsonElectrophotographyPatent
          : undefined);
      expect(patent, `missing catalog record ${patentId}`).toBeDefined();
      if (!patent) continue;

      expect(archivalEditionForPublication(patent)).toBeUndefined();
    }
  });

  test("keeps records with known incomplete source ledgers unbound as a second fail-closed layer", () => {
    for (const patentId of ["gb-913-watt-separate-condenser", "gb-931-arkwright-water-frame", "gb-1306-watt-rotary-engine", "gb-1420-cort-puddling-rolling"]) {
      const patent = allPatents.find((candidate) => candidate.id === patentId);
      expect(patent, `missing catalog record ${patentId}`).toBeDefined();
      if (!patent) continue;

      expect(patent.archivalEdition).toBeUndefined();
      expect(patent.originalTextAsset).toBeUndefined();
    }
  });

  test("makes an independently accepted source edition available only with its explicit companion map", () => {
    for (const patentId of SOURCE_QA_RELEASED_EDITIONS) {
      const patent = allPatents.find((candidate) => candidate.id === patentId);
      expect(patent, `missing catalog record ${patentId}`).toBeDefined();
      if (!patent) continue;

      expect(ROOT_QA_WITHHELD_ARCHIVAL_EDITION_IDS).not.toContain(patentId);
      expect(
        ARCHIVAL_PARALLEL_READINGS[patentId],
        `Patent ${patentId} missing companion map`,
      ).toBeDefined();
      expect(archivalEditionForPublication(patent)).toBe(patent.archivalEdition);
    }
  });
});
