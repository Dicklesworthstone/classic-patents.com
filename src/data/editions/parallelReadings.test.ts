import { describe, expect, test } from "bun:test";
import { wrightFlyerPatent } from "../patents/wright-flyer";
import { archivalParallelReadingFor } from "./parallelReadings";

describe("Wright archival parallel reading", () => {
  test("gives every manually prepared source paragraph a hand-authored companion", () => {
    const notes = archivalParallelReadingFor(wrightFlyerPatent.id);
    const edition = wrightFlyerPatent.archivalEdition;
    expect(edition).toBeDefined();
    if (!edition) throw new Error("Wright patent must retain its archival edition.");

    for (const [index, block] of edition.blocks.entries()) {
      if (block.kind !== "paragraph") continue;
      expect(notes[index]).toBeString();
      expect(notes[index].trim().length).toBeGreaterThan(0);
    }
  });

  test("uses the canonical hand-authored decoder for every presented claim", () => {
    const decodedClaims = new Set(wrightFlyerPatent.claims.map((claim) => claim.number));
    const edition = wrightFlyerPatent.archivalEdition;
    expect(edition).toBeDefined();
    if (!edition) throw new Error("Wright patent must retain its archival edition.");

    for (const block of edition.blocks) {
      if (block.kind === "claim") expect(decodedClaims.has(block.number)).toBe(true);
    }
  });
});
