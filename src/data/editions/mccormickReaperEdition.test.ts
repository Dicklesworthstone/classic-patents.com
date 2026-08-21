import { describe, expect, test } from "bun:test";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import {
  mccormickReaperArchivalEdition,
  mccormickReaperParallelReadings,
} from "./mccormickReaperEdition";

describe("mccormickReaperArchivalEdition", () => {
  test("pins the entire three-sheet facsimile in a continuous manual edition", () => {
    expect(validateCuratedSpecificationEdition(mccormickReaperArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    expect(mccormickReaperArchivalEdition.sourcePdfSha256).toBe(
      "24712ca3e966994d72716ccca6df6ef9a1fb3751b30fe34bfeb549ab6ba7f400",
    );
    expect(mccormickReaperArchivalEdition.completeFacsimileReviewed).toBe(true);

    const claims = mccormickReaperArchivalEdition.blocks.filter((block) => block.kind === "claim");
    expect(claims.map((claim) => claim.number)).toEqual([1, 2]);
  });

  test("keeps scan-page metadata and OCR output out of visitor-facing nodes", () => {
    const publicText = JSON.stringify(mccormickReaperArchivalEdition.blocks);
    expect(publicText).not.toContain("--- SOURCE PDF PAGE");
    expect(publicText).not.toContain("OCR");
    expect(publicText).not.toContain("Application filed April 19");
  });

  test("presents the unnumbered source drawing upright in landscape orientation", () => {
    const preview = mccormickReaperArchivalEdition.blocks.flatMap((block) => {
      if (block.kind === "figure-sheet") {
        const inlines = Array.isArray(block.description) ? block.description : [];
        return inlines.flatMap((inline) =>
          inline.kind === "reference" ? (inline.figurePreviews ?? []) : [],
        );
      }
      if ("inlines" in block && Array.isArray(block.inlines)) {
        return block.inlines.flatMap((inline) =>
          inline.kind === "reference" ? (inline.figurePreviews ?? []) : [],
        );
      }
      return [];
    })[0];
    expect(preview?.src).toBe("/patents/figures/us-x8277-mccormick-reaper-drawing-preview-v2.png");
    expect(preview?.width).toBeGreaterThan(preview?.height ?? Number.POSITIVE_INFINITY);
  });

  test("provides a non-lossy companion reading for every rendered paragraph block only", () => {
    const paragraphIndexes = [2, 3, 4, 5, 6, 7, 8, 12, 13, 14];
    expect(Object.keys(mccormickReaperParallelReadings).map(Number)).toEqual(paragraphIndexes);

    for (const index of paragraphIndexes) {
      expect(mccormickReaperParallelReadings[index]).toBeDefined();
      expect(mccormickReaperParallelReadings[index][0].length).toBeGreaterThan(30);
    }
  });
});
