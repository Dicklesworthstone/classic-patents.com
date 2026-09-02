import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  kamenSegwayArchivalEdition,
  kamenSegwayParallelReadings,
} from "@/data/editions/kamenSegwayEdition";
import { archivalParallelReadingsFor } from "@/data/editions/parallelReadings";
import { normalizeReviewedLedgerText } from "@/data/patents/sourceTextValidation";

const PATENT_ID = "us-6302230-kamen-segway";
const EXPECTED_PDF_SHA256 = "bcda272e161a0b973db9d64090f8102447e9aa35914a9a73e70a38736b7934db";

describe("US 6,302,230 Dean Kamen Segway Human Transporter Archival Edition Contract", () => {
  test("pins the reviewed 29-page facsimile and all 7 printed claims", () => {
    const pdfPath = resolve(process.cwd(), "public/patents/pdfs/us-6302230-kamen-segway.pdf");
    expect(existsSync(pdfPath)).toBe(true);

    const pdfBytes = readFileSync(pdfPath);
    const pdfDigest = createHash("sha256").update(pdfBytes).digest("hex");
    expect(pdfDigest).toBe(EXPECTED_PDF_SHA256);
    expect(kamenSegwayArchivalEdition.sourcePdfSha256).toBe(EXPECTED_PDF_SHA256);
    expect(kamenSegwayArchivalEdition.completeFacsimileReviewed).toBe(true);

    const claimBlocks = kamenSegwayArchivalEdition.blocks.filter(
      (b): b is Extract<(typeof kamenSegwayArchivalEdition.blocks)[number], { kind: "claim" }> =>
        b.kind === "claim",
    );
    expect(claimBlocks).toHaveLength(7);
    expect(claimBlocks.map((c) => c.number)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  test("contains every published literal source block in the reviewed 29-page ledger", () => {
    const ledgerPath = resolve(
      process.cwd(),
      "public/patents/transcripts/us-6302230-kamen-segway-reviewed.txt",
    );
    expect(existsSync(ledgerPath)).toBe(true);
    const ledger = readFileSync(ledgerPath, "utf8");

    for (let page = 1; page <= 29; page++) {
      expect(ledger.includes(`--- REVIEWED TRANSCRIPTION PAGE ${page} OF 29 ---`)).toBe(true);
    }

    const normalizedLedger = normalizeReviewedLedgerText(ledger);
    for (const block of kamenSegwayArchivalEdition.blocks) {
      if (block.kind === "paragraph" || block.kind === "claim") {
        for (const inline of block.inlines) {
          if (inline.kind === "text") {
            const normalizedText = normalizeReviewedLedgerText(inline.text);
            const sample = normalizedText.slice(0, 40);
            expect(normalizedLedger.includes(sample)).toBe(true);
          }
        }
      }
    }
  });

  test("pins source crops, technical term annotations, and parallel readings", () => {
    for (let fig = 1; fig <= 12; fig++) {
      const cropPath = resolve(
        process.cwd(),
        `public/patents/figures/us-6302230-kamen-segway/fig-${fig}-source-crop-v1.png`,
      );
      expect(existsSync(cropPath)).toBe(true);
    }

    const inlines = kamenSegwayArchivalEdition.blocks.flatMap((block) =>
      "inlines" in block ? block.inlines : block.kind === "figure-sheet" ? block.description : [],
    );
    const references = inlines.filter((inline) => inline.kind === "reference");
    expect(references.length).toBeGreaterThanOrEqual(6);
    for (const reference of references) {
      expect(reference.figurePreviews?.length).toBeGreaterThan(0);
      for (const preview of reference.figurePreviews ?? []) {
        expect(existsSync(resolve(process.cwd(), "public", preview.src.slice(1)))).toBe(true);
      }
    }

    const terms = inlines.filter(
      (inline): inline is Extract<(typeof inlines)[number], { kind: "term" }> =>
        inline.kind === "term",
    );
    expect(terms.length).toBeGreaterThanOrEqual(3);
    expect(terms.every((term) => term.definition.length > 30)).toBe(true);

    const readings = archivalParallelReadingsFor(PATENT_ID);
    expect(readings).toBeDefined();

    const paragraphIndexes = kamenSegwayArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    for (const index of paragraphIndexes) {
      expect(readings[index]).toBeDefined();
      expect(kamenSegwayParallelReadings[index]?.join(" ").length).toBeGreaterThan(30);
    }
  });
});
