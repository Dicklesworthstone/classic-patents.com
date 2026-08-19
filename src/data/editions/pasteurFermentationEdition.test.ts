import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { parsePatentCatalog } from "@/data/patents/schema";
import { validateReviewedTranscriptionPageAnchors } from "@/data/patents/sourceTextValidation";
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
    const sourceClaim = pasteurFermentationArchivalEdition.blocks.find(
      (block) => block.kind === "claim" && block.number === 1,
    );
    if (sourceClaim?.kind !== "claim") {
      throw new Error("Pasteur archival edition is missing its sole claim.");
    }
    expect(pasteurFermentationPatent.claims[0]?.originalText).toBe(
      sourceClaim.inlines.map((inline) => inline.text).join(""),
    );
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

  test("keeps the visual page-to-ledger sequence aligned with all three facsimile pages", () => {
    const sourceAsset = pasteurFermentationPatent.originalTextAsset;
    if (!sourceAsset) {
      throw new Error("Pasteur canonical record is missing its reviewed source asset.");
    }
    const ledger = readFileSync(
      resolve(
        process.cwd(),
        "public/patents/transcripts/us-135245-pasteur-fermentation-reviewed.txt",
      ),
      "utf8",
    );
    expect(validateReviewedTranscriptionPageAnchors(ledger, 3, sourceAsset.pageAnchors)).toEqual({
      valid: true,
    });
  });
});
