import { describe, expect, test } from "bun:test";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { wrightFlyerArchivalEdition } from "@/data/editions/wrightFlyerEdition";

describe("wrightFlyerArchivalEdition", () => {
  test("is a complete, continuous manual edition of the pinned facsimile", () => {
    expect(validateCuratedSpecificationEdition(wrightFlyerArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    expect(wrightFlyerArchivalEdition.sourcePdfSha256).toBe(
      "678bea5d81cb4e90a15c998bc932d2cf01bc87cfc3fcc53f0ecbdbdc70097966",
    );
    expect(wrightFlyerArchivalEdition.completeFacsimileReviewed).toBe(true);

    const claims = wrightFlyerArchivalEdition.blocks.filter((block) => block.kind === "claim");
    expect(claims.map((claim) => claim.number)).toEqual(
      Array.from({ length: 18 }, (_, index) => index + 1),
    );
  });

  test("keeps source-sheet pagination out of the continuous reading experience", () => {
    const publicText = JSON.stringify(wrightFlyerArchivalEdition.blocks);
    expect(publicText).not.toContain("--- REVIEWED TRANSCRIPTION PAGE");
    expect(publicText).not.toContain("3 SHEETS—SHEET");
    expect(publicText).not.toContain("Drawing sheet");
  });
});
