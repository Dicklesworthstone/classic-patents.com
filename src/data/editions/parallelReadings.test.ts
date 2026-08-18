import { describe, expect, test } from "bun:test";
import { wrightFlyerPatent } from "../patents/wright-flyer";
import { archivalParallelReadingsFor } from "./parallelReadings";

describe("Wright archival parallel reading", () => {
  test("gives every manually prepared source paragraph a hand-authored companion", () => {
    const notes = archivalParallelReadingsFor(wrightFlyerPatent.id);
    const edition = wrightFlyerPatent.archivalEdition;
    expect(edition).toBeDefined();
    if (!edition) throw new Error("Wright patent must retain its archival edition.");

    for (const [index, block] of edition.blocks.entries()) {
      if (block.kind !== "paragraph") continue;
      expect(notes[index]).toBeArray();
      expect(notes[index].join(" ").trim().length).toBeGreaterThan(0);

      const sourceWordCount = block.inlines
        .map((inline) => inline.text)
        .join(" ")
        .trim()
        .split(/\s+/).length;
      const readingWordCount = notes[index].join(" ").trim().split(/\s+/).length;
      if (sourceWordCount >= 100) {
        expect(readingWordCount / sourceWordCount).toBeGreaterThanOrEqual(0.3);
      }
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

  test("does not leave a Wright figure citation as ordinary source text", () => {
    const edition = wrightFlyerPatent.archivalEdition;
    expect(edition).toBeDefined();
    if (!edition) throw new Error("Wright patent must retain its archival edition.");

    const bareFigureCitation = /\b(?:Fig(?:s)?\.?|Figure)\s+\d/i;
    for (const block of edition.blocks) {
      if (block.kind !== "paragraph" && block.kind !== "claim") continue;
      for (const inline of block.inlines) {
        if (inline.kind === "text") expect(inline.text).not.toMatch(bareFigureCitation);
        if (inline.kind === "reference" && inline.referenceType === "figure") {
          expect(inline.figurePreviews).toBeArray();
          expect(inline.figurePreviews?.length).toBeGreaterThan(0);
          for (const preview of inline.figurePreviews ?? []) {
            expect(preview.src).toStartWith("/patents/figures/us-821393-wright-flyer-");
            expect(preview.alt.trim().length).toBeGreaterThan(0);
          }
        }
      }
    }
  });

  test("keeps every claim decoder substantial enough to preserve its combination", () => {
    for (const claim of wrightFlyerPatent.claims) {
      const sourceWordCount = claim.originalText.trim().split(/\s+/).length;
      const readingWordCount = claim.plainEnglish.trim().split(/\s+/).length;
      if (sourceWordCount >= 100) {
        expect(readingWordCount / sourceWordCount).toBeGreaterThanOrEqual(0.3);
      }
    }
  });
});
