import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { mestralVelcroPatent } from "@/data/patents/mestral-velcro";
import {
  validateReviewedTranscription,
  validateReviewedTranscriptionPageAnchors,
} from "@/data/patents/sourceTextValidation";
import {
  mestralVelcroArchivalEdition,
  mestralVelcroParallelReadings,
} from "./mestralVelcroEdition";

describe("US 2,717,437 manual source edition", () => {
  test("pins the complete three-page facsimile and all four printed claims", () => {
    const pdfPath = `${process.cwd()}/public/patents/pdfs/us-2717437-mestral-velcro.pdf`;
    expect(existsSync(pdfPath)).toBe(true);

    const pdf = readFileSync(pdfPath);
    expect(createHash("sha256").update(pdf).digest("hex")).toBe(
      mestralVelcroArchivalEdition.sourcePdfSha256,
    );
    expect(mestralVelcroPatent.archivalEdition).toBe(mestralVelcroArchivalEdition);
    expect(validateCuratedSpecificationEdition(mestralVelcroArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });

    expect(mestralVelcroPatent.claims.map((claim) => claim.number)).toEqual([1, 2, 3, 4]);
    expect(mestralVelcroPatent.stats).toMatchObject({
      totalClaims: 4,
      independentClaims: 3,
    });
  });

  test("reads legal text from the edition rather than a duplicate patent-data transcription", () => {
    for (const claim of mestralVelcroPatent.claims) {
      const editionBlock = mestralVelcroArchivalEdition.blocks.find(
        (candidate) => candidate.kind === "claim" && candidate.number === claim.number,
      );
      expect(editionBlock).toBeDefined();
      if (editionBlock?.kind === "claim") {
        const editionText = editionBlock.inlines
          .map((inline) => ("text" in inline ? inline.text : ""))
          .join("");
        expect(claim.originalText).toBe(editionText);
      }
    }
  });

  test("cites source-derived crops and annotates technical historical language", () => {
    const figureSheet = mestralVelcroArchivalEdition.blocks.find(
      (candidate) => candidate.kind === "figure-sheet",
    );
    expect(figureSheet).toBeDefined();
    if (figureSheet?.kind === "figure-sheet") {
      const figureInlines = figureSheet.description.filter(
        (inline) => inline.kind === "reference" && inline.figurePreviews,
      );
      expect(figureInlines.length).toBeGreaterThanOrEqual(2);
      for (const inline of figureInlines) {
        if (inline.kind === "reference" && inline.figurePreviews) {
          for (const preview of inline.figurePreviews) {
            expect(existsSync(resolve(process.cwd(), `public${preview.src}`))).toBe(true);
          }
        }
      }
    }

    const annotatedTerms = mestralVelcroArchivalEdition.blocks.flatMap((candidate) =>
      candidate.kind === "paragraph"
        ? candidate.inlines.filter((inline) => inline.kind === "term")
        : [],
    );
    expect(annotatedTerms.length).toBeGreaterThanOrEqual(4);
    for (const inline of annotatedTerms) {
      if (inline.kind === "term") {
        expect(inline.definition.trim().length).toBeGreaterThan(20);
      }
    }
  });

  test("pairs every source paragraph with an explanatory reading and a page-complete ledger", () => {
    const paragraphIndices = mestralVelcroArchivalEdition.blocks
      .map((candidate, index) => (candidate.kind === "paragraph" ? index : -1))
      .filter((index) => index >= 0);

    for (const index of paragraphIndices) {
      const readings = mestralVelcroParallelReadings[index];
      expect(readings).toBeDefined();
      expect(readings?.length).toBeGreaterThan(0);
      for (const text of readings ?? []) {
        expect(text.trim().length).toBeGreaterThan(40);
      }
    }

    const ledgerPath = `${process.cwd()}/public/patents/transcripts/us-2717437-mestral-velcro-reviewed.txt`;
    expect(existsSync(ledgerPath)).toBe(true);
    const ledger = readFileSync(ledgerPath, "utf8");
    expect(validateReviewedTranscription(ledger, 3)).toEqual({ valid: true });

    if (mestralVelcroPatent.originalTextAsset) {
      expect(
        validateReviewedTranscriptionPageAnchors(
          ledger,
          mestralVelcroPatent.originalTextAsset.pageCount,
          mestralVelcroPatent.originalTextAsset.pageAnchors,
        ),
      ).toEqual({ valid: true });
    }
  });
});
