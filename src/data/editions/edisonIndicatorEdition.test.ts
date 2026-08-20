import { describe, expect, it } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";
import {
  edisonIndicatorArchivalEdition,
  edisonIndicatorClaimText,
  edisonIndicatorParallelReadings,
} from "./edisonIndicatorEdition";

describe("US 307,031 Thomas Edison Electrical Indicator Archival Edition", () => {
  const root = process.cwd();
  const ledgerPath = join(
    root,
    "public/patents/transcripts/us-307031-edison-indicator-reviewed.txt",
  );
  const pdfPath = join(root, "public/patents/pdfs/us-307031-edison-indicator.pdf");

  it("satisfies the curated archival edition contract", () => {
    expect(existsSync(ledgerPath)).toBe(true);
    expect(existsSync(pdfPath)).toBe(true);

    const ledgerText = readFileSync(ledgerPath, "utf8");
    const editionResult = validateCuratedSpecificationEdition(edisonIndicatorArchivalEdition);
    expect(editionResult.valid).toBe(true);
    expect(editionResult.errors).toEqual([]);

    const ledgerResult = validateReviewedTranscription(ledgerText, 3);
    expect(ledgerResult.valid).toBe(true);

    expect(edisonIndicatorArchivalEdition.sourcePdfSha256).toBe(
      "f36bc6aa879d42a3f495a9bda05871bb6181aa1979e6baa03b258c42d6a30c13",
    );
  });

  it("contains all 8 printed claims with authentic source text", () => {
    const claimBlocks = edisonIndicatorArchivalEdition.blocks.filter((b) => b.kind === "claim");
    expect(claimBlocks.length).toBe(8);

    for (let i = 1; i <= 8; i++) {
      const claimText = edisonIndicatorClaimText(i);
      expect(claimText).toBeTruthy();
      expect(claimText.length).toBeGreaterThan(30);
      expect(claimText.startsWith(`${i}.`)).toBe(true);
    }
  });

  it("provides non-empty parallel readings for every paragraph block", () => {
    edisonIndicatorArchivalEdition.blocks.forEach((block, index) => {
      if (block.kind === "paragraph") {
        const readings = edisonIndicatorParallelReadings[index];
        expect(readings).toBeDefined();
        expect(readings.length).toBeGreaterThan(0);
        expect(readings[0].length).toBeGreaterThan(20);
      }
    });
  });

  it("verifies all referenced figure preview image files exist on disk", () => {
    for (const block of edisonIndicatorArchivalEdition.blocks) {
      if (block.kind === "paragraph") {
        for (const inline of block.inlines) {
          if (inline.kind === "reference" && inline.figurePreviews) {
            for (const preview of inline.figurePreviews) {
              const fullPath = join(root, "public", preview.src.replace(/^\//, ""));
              expect(existsSync(fullPath)).toBe(true);
            }
          }
        }
      }
    }
  });

  it("uses the complete source drawing rather than the signature margin for Figure 3", () => {
    const figureThreePreviews = edisonIndicatorArchivalEdition.blocks
      .flatMap((block) => (block.kind === "paragraph" ? block.inlines : []))
      .filter(
        (inline) =>
          inline.kind === "reference" &&
          inline.referenceType === "figure" &&
          inline.text === "Fig. 3",
      )
      .flatMap((inline) => (inline.kind === "reference" ? (inline.figurePreviews ?? []) : []));

    expect(figureThreePreviews.length).toBeGreaterThan(0);
    for (const preview of figureThreePreviews) {
      expect(preview).toEqual(
        expect.objectContaining({
          src: "/patents/figures/us-307031-edison-indicator/fig-3-source-crop-v2.png",
          width: 900,
          height: 590,
        }),
      );
    }
  });
});
