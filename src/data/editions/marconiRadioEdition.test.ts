import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { marconiRadioPatent } from "@/data/patents/marconi-radio";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";
import { marconiRadioArchivalEdition, marconiRadioParallelReadings } from "./marconiRadioEdition";

describe("US 586,193 Marconi Radio manual archival edition", () => {
  test("retains the eleven-page facsimile evidence and every printed claim", () => {
    expect(marconiRadioPatent.archivalEdition).toBeUndefined();
    expect(validateCuratedSpecificationEdition(marconiRadioArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    const pdf = readFileSync(`${process.cwd()}/public${marconiRadioPatent.originalPdfUrl}`);
    expect(createHash("sha256").update(pdf).digest("hex")).toBe(
      marconiRadioArchivalEdition.sourcePdfSha256,
    );
    expect(marconiRadioPatent.claims.map((claim) => claim.number)).toEqual(
      Array.from({ length: 56 }, (_, index) => index + 1),
    );
    expect(marconiRadioPatent.claims.map((claim) => claim.originalText)).toEqual(
      marconiRadioArchivalEdition.blocks
        .filter((block) => block.kind === "claim")
        .map((block) => block.inlines.map((inline) => inline.text).join("")),
    );
  });

  test("uses local source crops and authored term annotations", () => {
    const references = marconiRadioArchivalEdition.blocks.flatMap((block) =>
      "inlines" in block
        ? block.inlines.filter(
            (inline) => inline.kind === "reference" && inline.referenceType === "figure",
          )
        : [],
    );
    expect(references.length).toBeGreaterThan(0);
    for (const reference of references) {
      if (reference.kind !== "reference" || reference.referenceType !== "figure") continue;
      for (const preview of reference.figurePreviews ?? [])
        expect(existsSync(resolve(process.cwd(), "public", preview.src.slice(1)))).toBe(true);
    }
    const terms = marconiRadioArchivalEdition.blocks.flatMap((block) =>
      "inlines" in block ? block.inlines.filter((inline) => inline.kind === "term") : [],
    );
    expect(terms.map((term) => term.text)).toEqual(["Ruhmkorff coil", "choking-coils"]);
  });

  test("pairs every prose paragraph with an authored parallel reading", () => {
    const paragraphIndices = marconiRadioArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    expect(
      Object.keys(marconiRadioParallelReadings)
        .map(Number)
        .sort((a, b) => a - b),
    ).toEqual(paragraphIndices);
    for (const index of paragraphIndices) {
      expect(marconiRadioParallelReadings[index]?.join(" ").trim().length).toBeGreaterThan(30);
    }
  });

  test("publishes a reviewed ledger and validates source text", () => {
    const asset = marconiRadioPatent.originalTextAsset;
    if (asset?.kind === "reviewed-transcription") {
      expect(asset).toMatchObject({
        url: "/patents/transcripts/us-586193-marconi-radio-reviewed.txt",
        pageCount: 11,
        kind: "reviewed-transcription",
        sourcePdfSha256: marconiRadioArchivalEdition.sourcePdfSha256,
      });
      const ledger = readFileSync(`${process.cwd()}/public${asset.url}`, "utf8");
      expect(validateReviewedTranscription(ledger, 11)).toEqual({ valid: true });
    } else {
      expect(asset?.kind).toBe("source-pdf-text-layer");
    }
  });
});
