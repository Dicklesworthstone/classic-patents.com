import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { lindeAirLiquefactionPatent } from "@/data/patents/linde-air-liquefaction";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";
import {
  lindeAirLiquefactionArchivalEdition,
  lindeAirLiquefactionParallelReadings,
} from "./lindeAirLiquefactionEdition";

describe("US 727,650 Carl Linde Air Liquefaction manual archival edition", () => {
  test("pins the complete five-page facsimile and its fourteen printed claims", () => {
    expect(lindeAirLiquefactionPatent.archivalEdition).toBe(lindeAirLiquefactionArchivalEdition);
    expect(lindeAirLiquefactionArchivalEdition.sourcePdfSha256).toBe(
      "6d5423307d5718474ea8dd5891c52bccc6c7df2103a9ed4b9c7298d27f29c776",
    );
    expect(validateCuratedSpecificationEdition(lindeAirLiquefactionArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    const pdf = readFileSync(`${process.cwd()}/public${lindeAirLiquefactionPatent.originalPdfUrl}`);
    expect(createHash("sha256").update(pdf).digest("hex")).toBe(
      lindeAirLiquefactionArchivalEdition.sourcePdfSha256,
    );
    expect(lindeAirLiquefactionPatent.claims.map((claim) => claim.number)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
    ]);
  });

  test("makes the sole apparatus diagrammatic drawing available as a local crop", () => {
    const references = lindeAirLiquefactionArchivalEdition.blocks.flatMap((block) =>
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
        expect(preview.src).toStartWith("/patents/figures/us-727650-linde-air-liquefaction/");
        expect(existsSync(resolve(process.cwd(), "public", preview.src.slice(1)))).toBe(true);
      }
    }
  });

  test("pairs every prose paragraph with an authored parallel reading", () => {
    const explainableBlocks = lindeAirLiquefactionArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    expect(
      Object.keys(lindeAirLiquefactionParallelReadings)
        .map(Number)
        .sort((a, b) => a - b),
    ).toEqual(explainableBlocks);
    for (const index of explainableBlocks) {
      expect(lindeAirLiquefactionParallelReadings[index]?.join(" ").trim().length).toBeGreaterThan(
        30,
      );
    }
  });

  test("publishes a reviewed ledger and validates source text", () => {
    const asset = lindeAirLiquefactionPatent.originalTextAsset;
    expect(asset).toMatchObject({
      url: "/patents/transcripts/us-727650-linde-air-liquefaction-reviewed.txt",
      pageCount: 5,
      kind: "reviewed-transcription",
      sourcePdfSha256: lindeAirLiquefactionArchivalEdition.sourcePdfSha256,
    });
    if (!asset) throw new Error("Linde reviewed transcript asset is missing.");
    const ledger = readFileSync(`${process.cwd()}/public${asset.url}`, "utf8");
    expect(validateReviewedTranscription(ledger, 5)).toEqual({ valid: true });
  });
});
