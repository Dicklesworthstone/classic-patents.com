import { describe, expect, test } from "bun:test";
import { allPatents } from "@/data/patents";
import { wrightFlyerPatent } from "@/data/patents/wright-flyer";

describe("Claims Decoder & Operative Legal Boundary", () => {
  test("ensures every catalog patent has valid numbered claims or explicit historical claimStatus", () => {
    for (const patent of allPatents) {
      expect(patent.claims).toBeDefined();
      if (patent.archivalEdition?.claimStatus?.kind === "no-formal-claims-in-facsimile") {
        expect(patent.claims.length).toBe(0);
        expect(patent.archivalEdition.claimStatus.evidence).toBeDefined();
      } else {
        expect(patent.claims.length).toBeGreaterThan(0);
        for (const claim of patent.claims) {
          expect(claim.number).toBeGreaterThan(0);
          expect(claim.plainEnglish.trim().length).toBeGreaterThan(20);
          expect(claim.keyInnovations).toBeDefined();
          expect(claim.keyInnovations.length).toBeGreaterThan(0);
        }
      }
    }
  });

  test("Wright Flyer exemplar contains all 18 printed claims with legal significance", () => {
    expect(wrightFlyerPatent.claims.length).toBe(18);
    const claim1 = wrightFlyerPatent.claims.find((c) => c.number === 1);
    expect(claim1).toBeDefined();
    expect(claim1?.isIndependent).toBe(true);
    expect(claim1?.legalSignificance).toBeDefined();
    expect(claim1?.keyInnovations).toContain("Differential wing warping");
  });

  test("validates claim dependency trees across all patents", () => {
    for (const patent of allPatents) {
      const claimNumbers = new Set(patent.claims.map((c) => c.number));
      for (const claim of patent.claims) {
        if (claim.dependsOn) {
          for (const dep of claim.dependsOn) {
            expect(claimNumbers.has(dep)).toBe(true);
          }
        }
      }
    }
  });
});
