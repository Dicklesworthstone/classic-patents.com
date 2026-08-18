import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { engelbartMousePatent } from "@/data/patents/engelbart-mouse";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";
import {
  engelbartMouseArchivalEdition,
  engelbartMouseParallelReadings,
} from "./engelbartMouseEdition";

describe("US 3,541,541 Douglas Engelbart Mouse manual archival edition", () => {
  test("pins the complete seven-page facsimile and its eight printed claims", () => {
    if (engelbartMousePatent.archivalEdition)
      expect(engelbartMousePatent.archivalEdition).toBe(engelbartMouseArchivalEdition);
    expect(engelbartMouseArchivalEdition.sourcePdfSha256).toBe(
      "2a01a32bc3d4c3eec1745dd77fcb92f1404e02844c640c9c10a451ed3b5791e0",
    );
    expect(validateCuratedSpecificationEdition(engelbartMouseArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    const pdf = readFileSync(`${process.cwd()}/public${engelbartMousePatent.originalPdfUrl}`);
    expect(createHash("sha256").update(pdf).digest("hex")).toBe(
      engelbartMouseArchivalEdition.sourcePdfSha256,
    );
    expect(engelbartMousePatent.claims.map((claim) => claim.number)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8,
    ]);
  });

  test("makes all source drawings available as local crops", () => {
    const references = engelbartMouseArchivalEdition.blocks.flatMap((block) =>
      "inlines" in block
        ? block.inlines.filter(
            (inline): inline is Extract<(typeof block.inlines)[number], { kind: "reference" }> =>
              inline.kind === "reference" && inline.referenceType === "figure",
          )
        : [],
    );
    expect(references).not.toHaveLength(0);
    for (const reference of references) {
      expect(reference.figurePreviews?.length).toBeGreaterThan(0);
      for (const preview of reference.figurePreviews ?? []) {
        expect(preview.src).toStartWith("/patents/figures/us-3541541-engelbart-mouse/");
        expect(existsSync(resolve(process.cwd(), "public", preview.src.slice(1)))).toBe(true);
      }
    }
  });

  test("pairs every prose paragraph with an authored parallel reading", () => {
    const explainableBlocks = engelbartMouseArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    expect(
      Object.keys(engelbartMouseParallelReadings)
        .map(Number)
        .sort((a, b) => a - b),
    ).toEqual(explainableBlocks);
    for (const index of explainableBlocks) {
      expect(engelbartMouseParallelReadings[index]?.join(" ").trim().length).toBeGreaterThan(30);
    }
  });

  test("publishes a reviewed ledger and validates source text", () => {
    const asset = engelbartMousePatent.originalTextAsset;
    expect(asset).toBeDefined();
    if (!asset) throw new Error("Engelbart Mouse reviewed transcript asset is missing.");
    if (asset.kind === "reviewed-transcription") {
      expect(asset).toMatchObject({
        url: "/patents/transcripts/us-3541541-engelbart-mouse-reviewed.txt",
        pageCount: 7,
        kind: "reviewed-transcription",
        sourcePdfSha256: engelbartMouseArchivalEdition.sourcePdfSha256,
      });
      const ledger = readFileSync(`${process.cwd()}/public${asset.url}`, "utf8");
      expect(validateReviewedTranscription(ledger, 7)).toEqual({ valid: true });
    }
  });
});
