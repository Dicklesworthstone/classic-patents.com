import { describe, expect, test } from "bun:test";
import { allPatents } from "@/data/patents";
import { wrightFlyerPatent } from "@/data/patents/wright-flyer";

describe("Historical Context & Patent Warfare Domain", () => {
  test("ensures every patent in catalog has rich, non-empty historical context fields", () => {
    for (const patent of allPatents) {
      const hc = patent.historicalContext;
      expect(hc).toBeDefined();
      expect(hc.problemStatement.trim().length).toBeGreaterThan(30);
      expect(hc.priorArtLimitations.length).toBeGreaterThan(0);
      for (const lim of hc.priorArtLimitations) {
        expect(lim.trim().length).toBeGreaterThan(15);
      }
      expect(hc.breakthroughInsight.trim().length).toBeGreaterThan(30);
      expect(hc.civilizationalImpact.trim().length).toBeGreaterThan(30);
    }
  });

  test("Wright Flyer exemplar documents the historic patent wars with Glenn Curtiss and the Wright-Curtiss dispute", () => {
    const hc = wrightFlyerPatent.historicalContext;
    expect(hc.patentWars).toBeDefined();
    expect(hc.patentWars?.length).toBeGreaterThan(0);
    const war = hc.patentWars?.[0];
    expect(war?.rivalName).toContain("Glenn H. Curtiss");
    expect(war?.legalOutcome).toBeDefined();
  });
});
