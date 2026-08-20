import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { coltRevolverPatent } from "@/data/patents/colt-revolver";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";
import { coltRevolverArchivalEdition, coltRevolverParallelReadings } from "./coltRevolverEdition";

const transcriptPath = resolve(
  process.cwd(),
  "public/patents/transcripts/us-x9430-colt-revolver-reviewed.txt",
);
const sourcePdfSha256 = "61eed2c1b5ea259a301fb2690a7d3d17e1a59560cfb002dc91c29a50f5841d01";

const normalizeForTranscriptComparison = (text: string): string =>
  text.replaceAll("′", "'").replaceAll("’", "'");

describe("coltRevolverArchivalEdition", () => {
  test("pins US X9430 to its complete reviewed seven-page ledger", () => {
    expect(validateCuratedSpecificationEdition(coltRevolverArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    expect(coltRevolverArchivalEdition.completeFacsimileReviewed).toBe(true);
    expect(coltRevolverArchivalEdition.sourcePdfSha256).toBe(sourcePdfSha256);

    expect(coltRevolverPatent.id).toBe("us-x9430-colt-revolver");
    expect(coltRevolverPatent.originalPdfUrl).toBe("/patents/pdfs/us-x9430-colt-revolver.pdf");
    expect(coltRevolverPatent.filingDate).toBeNull();
    expect(coltRevolverPatent.originalTextAsset).toEqual({
      url: "/patents/transcripts/us-x9430-colt-revolver-reviewed.txt",
      pageCount: 7,
      kind: "reviewed-transcription",
      reviewedBy: "Classic Patents editorial agent (GPT-5.6)",
      reviewedAt: "2026-08-18",
      sourcePdfSha256,
    });
    expect(existsSync(transcriptPath)).toBe(true);

    const ledger = readFileSync(transcriptPath, "utf8");
    expect(validateReviewedTranscription(ledger, 7)).toEqual({ valid: true });
    expect(ledger).toContain(
      "9430X. Specification forming part of Letters Patent dated February 25, 1836.",
    );
    expect(ledger.match(/Patented Feb\. 25, 1836\./g)).toHaveLength(4);
    expect(ledger).toContain("SAMUEL COLT.");
    expect(ledger).toContain("Witnesses: ROBERT CLARKE, WM. WALLIS.");

    const ledgerSourceText = ledger.replace(
      /^--- REVIEWED TRANSCRIPTION PAGE \d+ OF \d+ ---$/gm,
      "",
    );

    for (const block of coltRevolverArchivalEdition.blocks) {
      if (block.kind !== "paragraph" && block.kind !== "claim") continue;
      const sourceText = block.inlines.map((inline) => inline.text).join("");
      expect(normalizeForTranscriptComparison(ledgerSourceText)).toContain(
        normalizeForTranscriptComparison(sourceText),
      );
    }

    const claimNumbers = coltRevolverArchivalEdition.blocks
      .filter((block) => block.kind === "claim")
      .map((claim) => claim.number);
    expect(claimNumbers).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(coltRevolverPatent.claims.map((claim) => claim.originalText)).toEqual(
      coltRevolverArchivalEdition.blocks
        .filter((block) => block.kind === "claim")
        .map((claim) => claim.inlines.map((inline) => inline.text).join("")),
    );
  });

  test("has one concrete non-lossy companion for every and only source paragraph", () => {
    const paragraphIndexes = coltRevolverArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    const readingIndexes = Object.keys(coltRevolverParallelReadings)
      .map(Number)
      .sort((left, right) => left - right);

    expect(paragraphIndexes).toEqual([
      5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 32, 33,
    ]);
    expect(readingIndexes).toEqual(paragraphIndexes);
    for (const reading of Object.values(coltRevolverParallelReadings)) {
      expect(reading).toHaveLength(1);
      const rendered = reading.join(" ").trim();
      expect(rendered.length).toBeGreaterThan(100);
      expect(rendered).not.toMatch(/^This (paragraph|text|passage) /i);
    }
  });

  test("makes every source drawing citation a semantic reference with a local crop", () => {
    const bareDrawingCitation = /\b(?:(?:fig(?:s)?\.?|figure)\s+\d+|(?:section|division)\s+\d+)\b/i;
    const sourcePreviewByDrawing = {
      "division-1": "/patents/figures/us-x9430-colt-revolver/division-1-pistol-source-crop-v2.png",
      "division-2":
        "/patents/figures/us-x9430-colt-revolver/division-2-pistol-section-source-crop-v2.png",
      "division-3":
        "/patents/figures/us-x9430-colt-revolver/division-3-lock-parts-source-crop-v2.png",
      "division-4":
        "/patents/figures/us-x9430-colt-revolver/division-4-arbor-and-cylinder-source-crop-v2.png",
      "division-5":
        "/patents/figures/us-x9430-colt-revolver/division-5-combination-source-crop-v2.png",
      "plate-2": "/patents/figures/us-x9430-colt-revolver/plate-2-lockwork-source-crop-v2.png",
    } as const;

    for (const block of coltRevolverArchivalEdition.blocks) {
      if (!("inlines" in block)) continue;
      for (const inline of block.inlines) {
        if (inline.kind === "text") {
          expect(inline.text).not.toMatch(bareDrawingCitation);
          continue;
        }
        if (inline.kind === "reference" && inline.referenceType === "figure") {
          expect(inline.figurePreviews?.length).toBeGreaterThan(0);
          const drawing = inline.href.match(/^#(division-[1-5]|plate-2)-drawing$/)?.[1];
          expect(drawing).toBeDefined();
          if (!drawing) continue;
          const expectedPreview =
            sourcePreviewByDrawing[drawing as keyof typeof sourcePreviewByDrawing];
          expect(inline.figurePreviews).toHaveLength(1);
          expect(inline.figurePreviews?.[0]?.src).toBe(expectedPreview);
          for (const preview of inline.figurePreviews ?? []) {
            expect(existsSync(resolve(process.cwd(), "public", preview.src.slice(1)))).toBe(true);
          }
        }
      }
    }

    for (const [drawing, sourcePreview] of Object.entries(sourcePreviewByDrawing)) {
      expect(existsSync(resolve(process.cwd(), "public", sourcePreview.slice(1)))).toBe(true);
      expect(
        coltRevolverArchivalEdition.blocks.some(
          (block) =>
            "inlines" in block &&
            block.inlines.some(
              (inline) =>
                inline.kind === "reference" &&
                inline.referenceType === "figure" &&
                inline.href === `#${drawing}-drawing` &&
                inline.figurePreviews?.[0]?.src === sourcePreview,
            ),
        ),
      ).toBe(true);
    }

    const divisionOne = coltRevolverArchivalEdition.blocks
      .flatMap((block) => ("inlines" in block ? block.inlines : []))
      .find((inline) => inline.kind === "reference" && inline.text === "Division 1");
    const divisionFive = coltRevolverArchivalEdition.blocks
      .flatMap((block) => ("inlines" in block ? block.inlines : []))
      .find((inline) => inline.kind === "reference" && inline.text === "Division 5");
    expect(divisionOne && divisionOne.kind === "reference" ? divisionOne.href : undefined).toBe(
      "#division-1-drawing",
    );
    expect(divisionFive && divisionFive.kind === "reference" ? divisionFive.href : undefined).toBe(
      "#division-5-drawing",
    );
  });
});
