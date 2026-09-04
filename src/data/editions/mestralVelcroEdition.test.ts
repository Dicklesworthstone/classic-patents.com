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

  test("binds all 11 active figure citations to the complete digest-pinned source sheet", () => {
    const sourceSheet = "/patents/figures/us-2717437-mestral-velcro/source-sheet-1-v1.png";
    const figureOccurrences = mestralVelcroArchivalEdition.blocks.flatMap((block, blockIndex) => {
      const inlines =
        block.kind === "figure-sheet"
          ? block.description
          : block.kind === "paragraph"
            ? block.inlines
            : [];
      return inlines.flatMap((inline, inlineIndex) =>
        inline.kind === "reference" && inline.referenceType === "figure"
          ? [
              {
                occurrenceKey: `edition-block-${blockIndex}-group-0-inline-${inlineIndex}`,
                text: inline.text,
                previews: inline.figurePreviews,
              },
            ]
          : [],
      );
    });

    expect(
      figureOccurrences.map((occurrence) => [occurrence.occurrenceKey, occurrence.text]),
    ).toEqual([
      ["edition-block-1-group-0-inline-0", "Fig. 1"],
      ["edition-block-1-group-0-inline-2", "Fig. 2"],
      ["edition-block-6-group-0-inline-1", "Fig. 1"],
      ["edition-block-6-group-0-inline-3", "Fig. 2"],
      ["edition-block-7-group-0-inline-1", "Fig. 1"],
      ["edition-block-11-group-0-inline-1", "Fig. 1"],
      ["edition-block-11-group-0-inline-5", "Fig. 1"],
      ["edition-block-13-group-0-inline-1", "Fig. 2"],
      ["edition-block-13-group-0-inline-3", "Fig. 1"],
      ["edition-block-16-group-0-inline-1", "Figs. 1"],
      ["edition-block-16-group-0-inline-3", "2"],
    ]);
    for (const occurrence of figureOccurrences) {
      expect(occurrence.previews).toEqual([
        expect.objectContaining({ src: sourceSheet, width: 2320, height: 3408 }),
      ]);
      expect(occurrence.previews?.[0]?.alt).toContain(
        "Complete unmodified source drawing sheet 1 of 1",
      );
    }

    const sourceSheetPath = resolve(process.cwd(), `public${sourceSheet}`);
    expect(existsSync(sourceSheetPath)).toBe(true);
    expect(createHash("sha256").update(readFileSync(sourceSheetPath)).digest("hex")).toBe(
      "3836f440a26c7be2257dbf1bd985f775d0c5387fbbda49b30483bdab493c5dd9",
    );
    for (const legacyAsset of ["fig-1-source-crop-v1.png", "fig-2-source-crop-v1.png"]) {
      expect(
        existsSync(
          resolve(process.cwd(), "public/patents/figures/us-2717437-mestral-velcro", legacyAsset),
        ),
      ).toBe(true);
    }

    const provenance = readFileSync(
      resolve(process.cwd(), "docs/provenance/us-2717437-mestral-velcro.md"),
      "utf8",
    );
    expect(provenance).toContain("## 3. Source-sheet acceptance (2026-09-03)");
    expect(provenance).toContain("The 11—not 12—authored");
    expect(provenance).toContain(
      "3836f440a26c7be2257dbf1bd985f775d0c5387fbbda49b30483bdab493c5dd9",
    );
  });

  test("annotates technical historical language", () => {
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
