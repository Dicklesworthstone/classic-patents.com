import { describe, expect, test } from "bun:test";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { goodyearRubberArchivalEdition } from "@/data/editions/goodyearRubberEdition";
import { goodyearRubberPatent } from "@/data/patents/goodyear-rubber";

describe("goodyearRubberArchivalEdition", () => {
  test("is a complete, continuous manual edition of the pinned two-page facsimile", () => {
    expect(validateCuratedSpecificationEdition(goodyearRubberArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    expect(goodyearRubberArchivalEdition.sourcePdfSha256).toBe(
      "efd8490327472ea50fd873afd35ec759489f9587c9a9df1a590a500f7a66a8a7",
    );
    expect(goodyearRubberArchivalEdition.completeFacsimileReviewed).toBe(true);

    const claims = goodyearRubberArchivalEdition.blocks.filter((block) => block.kind === "claim");
    expect(claims.map((claim) => claim.number)).toEqual([1, 2, 3]);
  });

  test("preserves the facsimile's no-figure, no-table document shape without synthetic artifacts", () => {
    const publicText = JSON.stringify(goodyearRubberArchivalEdition.blocks);
    expect(publicText).not.toContain("--- SOURCE PDF PAGE");
    expect(publicText).not.toContain("FIG.");
    expect(
      goodyearRubberArchivalEdition.blocks.some((block) => block.kind === "figure-sheet"),
    ).toBe(false);
    expect(goodyearRubberArchivalEdition.blocks.some((block) => block.kind === "table")).toBe(
      false,
    );
  });

  test("pins the record to the reviewed transcription and complete authored claim nodes", () => {
    expect(goodyearRubberPatent.archivalEdition).toBe(goodyearRubberArchivalEdition);
    expect(goodyearRubberPatent.originalTextAsset).toMatchObject({
      url: "/patents/transcripts/us-3633-goodyear-rubber.txt",
      pageCount: 2,
      kind: "reviewed-transcription",
      sourcePdfSha256: goodyearRubberArchivalEdition.sourcePdfSha256,
    });
    expect(goodyearRubberPatent.claims.map((claim) => claim.number)).toEqual([1, 2, 3]);
  });
});
