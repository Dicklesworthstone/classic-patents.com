import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { marconiRadioPatent } from "@/data/patents/marconi-radio";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";
import {
  marconiRadioArchivalEdition,
  marconiRadioClaimText,
  marconiRadioParallelReadings,
} from "./marconiRadioEdition";

describe("US 586,193 Marconi Radio manual archival edition", () => {
  test("retains the eleven-page facsimile evidence and every printed claim", () => {
    if (marconiRadioPatent.archivalEdition)
      expect(marconiRadioPatent.archivalEdition).toBe(marconiRadioArchivalEdition);
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
    expect(marconiRadioPatent.claims.map((claim) => claim.originalText)).toEqual(
      Array.from({ length: 56 }, (_, index) => marconiRadioClaimText(index + 1)),
    );
    const recordSource = readFileSync(
      resolve(process.cwd(), "src/data/patents/marconi-radio.ts"),
      "utf8",
    );
    expect(recordSource).toContain("marconiRadioClaimText");
    expect(recordSource).not.toContain("marconiRadioClaims");
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
    expect(terms.map((term) => term.text)).toEqual(
      expect.arrayContaining([
        "Hertz rays",
        "Ruhmkorff coil",
        "circuit-closer",
        "sensitive tube",
        "choking-coils",
        "trembler",
      ]),
    );
    for (const term of terms) expect(term.definition.length).toBeGreaterThan(80);
  });

  test("uses the complete primary p3 drawing sheet for Figures 9 through 11", () => {
    const figurePreviews = marconiRadioArchivalEdition.blocks.flatMap((block) =>
      "inlines" in block
        ? block.inlines.flatMap((inline) =>
            inline.kind === "reference" && inline.referenceType === "figure"
              ? (inline.figurePreviews ?? [])
              : [],
          )
        : [],
    );
    const preview = figurePreviews.find((candidate) =>
      candidate.src.includes("source-sheet-3-v1.png"),
    );
    if (!preview) throw new Error("US 586,193 is missing complete drawing sheet 3.");

    expect(preview).toEqual({
      src: "/patents/figures/us-586193-marconi-radio/source-sheet-3-v1.png",
      alt: "Complete primary drawing sheet 3 of 3 from US 586,193: Figures 9 through 11.",
      width: 2320,
      height: 3408,
    });

    const png = readFileSync(resolve(process.cwd(), "public", preview.src.slice(1)));
    expect(png.subarray(1, 4).toString("ascii")).toBe("PNG");
    expect(png.readUInt32BE(16)).toBe(2320);
    expect(png.readUInt32BE(20)).toBe(3408);
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
      const continuousLedger = ledger
        .replace(/--- REVIEWED TRANSCRIPTION PAGE \d+ OF 11 ---/g, "")
        .replace(/\s+/g, " ");
      const sourceBlocks = marconiRadioArchivalEdition.blocks.filter(
        (
          block,
        ): block is Extract<
          (typeof marconiRadioArchivalEdition.blocks)[number],
          { kind: "masthead" | "paragraph" | "claim" }
        > => block.kind === "masthead" || block.kind === "paragraph" || block.kind === "claim",
      );
      for (const block of sourceBlocks) {
        const sourceText =
          block.kind === "masthead"
            ? block.lines.join(" ")
            : block.inlines.map((inline) => inline.text).join("");
        expect(continuousLedger).toContain(sourceText.replace(/\s+/g, " "));
      }
    } else {
      expect(asset?.kind).toBe("source-pdf-text-layer");
    }
  });
});
