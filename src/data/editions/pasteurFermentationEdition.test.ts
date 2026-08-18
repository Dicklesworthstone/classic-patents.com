import { describe, expect, test } from "bun:test";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { parsePatentCatalog } from "@/data/patents/schema";
import { pasteurFermentationPatent } from "../patents/pasteur-fermentation";
import { pasteurFermentationArchivalEdition } from "./pasteurFermentationEdition";
import { pasteurFermentationParallelReadings } from "./pasteurFermentationParallelReading";

describe("pasteurFermentationArchivalEdition", () => {
  test("pins the three-sheet facsimile and its sole printed claim", () => {
    expect(validateCuratedSpecificationEdition(pasteurFermentationArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    expect(pasteurFermentationArchivalEdition.sourcePdfSha256).toBe(
      "7c9145e813b652e9da76472a8e6d0b2fa3088aeb1cea34b5ae3163f4d673a649",
    );
    expect(
      pasteurFermentationArchivalEdition.blocks
        .filter((block) => block.kind === "claim")
        .map((block) => block.number),
    ).toEqual([1]);
    expect(pasteurFermentationPatent.claims.map((claim) => claim.number)).toEqual([1]);
  });

  test("provides a non-lossy authored companion for every and only paragraph block", () => {
    const paragraphIndexes = pasteurFermentationArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    expect(
      Object.keys(pasteurFermentationParallelReadings)
        .map(Number)
        .sort((a, b) => a - b),
    ).toEqual(paragraphIndexes);
    for (const index of paragraphIndexes) {
      expect(pasteurFermentationParallelReadings[index]?.join(" ").trim().length).toBeGreaterThan(
        30,
      );
    }
  });

  test("links each source figure occurrence to an owned facsimile crop", () => {
    const figureReferences = pasteurFermentationArchivalEdition.blocks.flatMap((block) =>
      block.kind === "paragraph"
        ? block.inlines.filter(
            (inline): inline is Extract<typeof inline, { kind: "reference" }> =>
              inline.kind === "reference" && inline.referenceType === "figure",
          )
        : [],
    );
    expect(figureReferences).toHaveLength(4);
    for (const reference of figureReferences) {
      expect(reference.figurePreviews?.[0]?.src).toStartWith(
        "/patents/figures/us-135245-pasteur-fermentation/",
      );
    }
  });

  test("is catalog-importable with a reviewed transcription, no invented claims, and no substituted filing date", () => {
    expect(pasteurFermentationPatent.archivalEdition).toBe(pasteurFermentationArchivalEdition);
    expect(pasteurFermentationPatent.originalTextAsset).toMatchObject({
      kind: "reviewed-transcription",
      pageCount: 3,
      sourcePdfSha256: pasteurFermentationArchivalEdition.sourcePdfSha256,
    });
    expect(pasteurFermentationPatent.stats).toMatchObject({ totalClaims: 1, independentClaims: 1 });
    expect(pasteurFermentationPatent.filingDate).toBeNull();
    expect(parsePatentCatalog([pasteurFermentationPatent])).toHaveLength(1);
  });
});
