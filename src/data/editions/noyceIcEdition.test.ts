import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { noyceIcPatent } from "@/data/patents/noyce-ic";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";
import { noyceIcArchivalEdition, noyceIcParallelReadings } from "./noyceIcEdition";

describe("US 2,981,877 manual source edition", () => {
  test("pins the eight-page facsimile and all ten printed claims", () => {
    expect(noyceIcPatent.archivalEdition).toBe(noyceIcArchivalEdition);
    expect(validateCuratedSpecificationEdition(noyceIcArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    const pdf = readFileSync(`${process.cwd()}/public/patents/pdfs/us-2981877-noyce-ic.pdf`);
    expect(createHash("sha256").update(pdf).digest("hex")).toBe(
      noyceIcArchivalEdition.sourcePdfSha256,
    );
    expect(noyceIcPatent.claims.map((claim) => claim.number)).toEqual(
      Array.from({ length: 10 }, (_, index) => index + 1),
    );
    expect(noyceIcPatent.claims.find((claim) => claim.number === 8)?.dependsOn).toEqual([7]);
    expect(noyceIcPatent.stats).toMatchObject({ totalClaims: 10, independentClaims: 9 });
  });

  test("has a complete review locator ledger and no source-PDF text-layer publication", () => {
    const asset = noyceIcPatent.originalTextAsset;
    expect(asset).toMatchObject({
      url: "/patents/transcripts/us-2981877-noyce-ic-reviewed.txt",
      kind: "reviewed-transcription",
      pageCount: 8,
      sourcePdfSha256: noyceIcArchivalEdition.sourcePdfSha256,
    });
    if (!asset) throw new Error("Missing Noyce review ledger.");
    const ledger = readFileSync(`${process.cwd()}/public${asset.url}`, "utf8");
    expect(validateReviewedTranscription(ledger, 8)).toEqual({ valid: true });
    expect(JSON.stringify(noyceIcPatent.archivalEdition)).not.toContain("source-pdf-text-layer");
  });

  test("pairs each source paragraph explicitly and gives every source figure a local crop", () => {
    const paragraphIndexes = noyceIcArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    expect(
      Object.keys(noyceIcParallelReadings)
        .map(Number)
        .sort((a, b) => a - b),
    ).toEqual(paragraphIndexes);
    for (const reading of Object.values(noyceIcParallelReadings)) {
      expect(reading.join(" ").trim().length).toBeGreaterThan(80);
    }
    const figures = noyceIcArchivalEdition.blocks.flatMap((block) => {
      if (!("inlines" in block)) return [];
      return block.inlines.filter(
        (inline): inline is Extract<(typeof block.inlines)[number], { kind: "reference" }> =>
          inline.kind === "reference" && inline.referenceType === "figure",
      );
    });
    for (const number of [1, 2, 3, 4, 5, 6, 7]) {
      expect(
        figures.some((reference) =>
          reference.figurePreviews?.some((preview) => preview.alt.includes(`Fig. ${number}`)),
        ),
      ).toBe(true);
    }
    for (const reference of figures) {
      for (const preview of reference.figurePreviews ?? []) {
        expect(existsSync(resolve(process.cwd(), "public", preview.src.slice(1)))).toBe(true);
      }
    }
  });
});
