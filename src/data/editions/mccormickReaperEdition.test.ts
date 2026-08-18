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

    const claims = mccormickReaperArchivalEdition.blocks.filter(
      (block) => block.kind === "claim",
    );
    expect(claims.map((claim) => claim.number)).toEqual([1, 2]);
  });

  test("keeps scan-page metadata and OCR output out of visitor-facing nodes", () => {
    const publicText = JSON.stringify(mccormickReaperArchivalEdition.blocks);
    expect(publicText).not.toContain("--- SOURCE PDF PAGE");
    expect(publicText).not.toContain("OCR");
    expect(publicText).not.toContain("Application filed April 19");
  });

  test("provides a non-lossy companion reading for every prose and claim block", () => {
    for (const index of [2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14]) {
      expect(mccormickReaperParallelReadings[index]).toBeDefined();
      expect(mccormickReaperParallelReadings[index][0].length).toBeGreaterThan(30);
    }
  });
});
