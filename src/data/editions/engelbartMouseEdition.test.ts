import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { engelbartMousePatent } from "@/data/patents/engelbart-mouse";
import {
  validateReviewedTranscription,
  validateReviewedTranscriptionCoverage,
} from "@/data/patents/sourceTextValidation";
import {
  engelbartMouseArchivalEdition,
  engelbartMouseParallelReadings,
} from "./engelbartMouseEdition";

function sourceTextFromEdition(): string {
  const inlineText = (inlines: readonly { text: string }[]) =>
    inlines.map((inline) => inline.text).join("");

  return engelbartMouseArchivalEdition.blocks
    .flatMap((block) => {
      if (block.kind === "masthead") return block.lines;
      if (block.kind === "heading" || block.kind === "equation") return [block.text];
      if (block.kind === "paragraph" || block.kind === "claim") {
        return [inlineText(block.inlines)];
      }
      if (block.kind === "figure-sheet") return [inlineText(block.description)];
      return [
        block.caption ?? "",
        inlineText(block.headers.flat()),
        inlineText(block.rows.flat(2)),
      ];
    })
    .join(" ");
}

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
    const sourceInlines = engelbartMouseArchivalEdition.blocks.flatMap((block) =>
      block.kind === "paragraph" || block.kind === "claim"
        ? block.inlines
        : block.kind === "figure-sheet"
          ? block.description
          : [],
    );
    for (const inline of sourceInlines) {
      if (inline.kind === "text") {
        expect(inline.text).not.toMatch(/\bFIG(?:S)?\.?\s*\d/);
      }
    }
  });

  test("uses source-cropped, figure-labelled framing for Figures 1 through 7", () => {
    const figurePreview = (number: number) => {
      const reference = engelbartMouseArchivalEdition.blocks
        .flatMap((block) =>
          block.kind === "paragraph" || block.kind === "claim"
            ? block.inlines
            : block.kind === "figure-sheet"
              ? block.description
              : [],
        )
        .find(
          (inline) =>
            inline.kind === "reference" &&
            inline.referenceType === "figure" &&
            inline.href === `#figure-${number}`,
        );
      if (reference?.kind !== "reference") {
        throw new Error(`US 3,541,541 is missing Figure ${number} source reference.`);
      }
      return reference.figurePreviews?.[0];
    };

    expect(figurePreview(1)).toMatchObject({
      src: "/patents/figures/us-3541541-engelbart-mouse/fig-1-source-crop-v2.png",
      width: 1550,
      height: 850,
    });
    expect(figurePreview(2)).toMatchObject({
      src: "/patents/figures/us-3541541-engelbart-mouse/fig-2-source-crop-v4.png",
      width: 1900,
      height: 640,
    });
    expect(figurePreview(3)).toMatchObject({
      src: "/patents/figures/us-3541541-engelbart-mouse/fig-3-source-crop-v2.png",
      width: 2000,
      height: 1050,
    });
    expect(figurePreview(4)).toMatchObject({
      src: "/patents/figures/us-3541541-engelbart-mouse/fig-4-source-crop-v2.png",
      width: 1550,
      height: 650,
    });
    expect(figurePreview(5)).toMatchObject({
      src: "/patents/figures/us-3541541-engelbart-mouse/fig-5-source-crop-v2.png",
      width: 1550,
      height: 700,
    });
    expect(figurePreview(6)).toMatchObject({
      src: "/patents/figures/us-3541541-engelbart-mouse/fig-6-source-crop-v2.png",
      width: 1550,
      height: 980,
    });
    expect(figurePreview(7)).toMatchObject({
      src: "/patents/figures/us-3541541-engelbart-mouse/fig-7-source-crop-v1.png",
      width: 1300,
      height: 1450,
    });
  });

  test("keeps every canonical claim literal dynamically sourced from the edition", () => {
    for (const claim of engelbartMousePatent.claims) {
      const editionClaim = engelbartMouseArchivalEdition.blocks.find(
        (block) => block.kind === "claim" && block.number === claim.number,
      );
      expect(editionClaim?.kind).toBe("claim");
      if (editionClaim?.kind === "claim") {
        expect(claim.originalText).toBe(editionClaim.inlines.map((inline) => inline.text).join(""));
      }
    }
  });

  test("keeps visible drawing callouts tied to the grant's printed reference labels", () => {
    const labelsByFigure = new Map(
      engelbartMousePatent.drawings.map((drawing) => [
        drawing.figureNumber,
        drawing.callouts.map((callout) => callout.label),
      ]),
    );
    expect(labelsByFigure.get("Fig. 1")).toEqual(["10", "16", "20"]);
    expect(labelsByFigure.get("Fig. 2")).toEqual(["42", "34", "26"]);
    expect(labelsByFigure.get("Fig. 3")).toEqual(["46", "38, 40"]);
    expect(labelsByFigure.get("Fig. 4")).toEqual(["38A, 40A"]);
    expect(labelsByFigure.get("Fig. 5")).toEqual(["80"]);
    expect(labelsByFigure.get("Fig. 6")).toEqual(["100"]);
    expect(labelsByFigure.get("Fig. 7")).toEqual(["140"]);

    const drawingCopy = JSON.stringify(engelbartMousePatent.drawings).toLowerCase();
    for (const unsupportedPhrase of ["wooden", "optical", "quadrature", "gated clock"]) {
      expect(drawingCopy).not.toContain(unsupportedPhrase);
    }
  });

  test("defines the grant's specialized coordinate and encoder vocabulary at its source occurrences", () => {
    const terms = engelbartMouseArchivalEdition.blocks.flatMap((block) =>
      block.kind === "paragraph" || block.kind === "claim"
        ? block.inlines.filter(
            (inline): inline is Extract<(typeof block.inlines)[number], { kind: "term" }> =>
              inline.kind === "term",
          )
        : [],
    );

    expect(terms.map((term) => term.text)).toEqual([
      "rheostats",
      "shaft position encoder",
      "incremental encoder",
      "incremental encoder",
      "up-down counter",
      "multiturn potentiometers",
      "Schmidt trigger",
      "resolver",
    ]);
    for (const term of terms) expect(term.definition.length).toBeGreaterThan(80);
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

  test("uses a literal drawing-sheet ledger that contains the complete authored source text", () => {
    const transcriptPath = `${process.cwd()}/public/patents/transcripts/us-3541541-engelbart-mouse-reviewed.txt`;
    expect(existsSync(transcriptPath)).toBe(true);
    const ledger = readFileSync(transcriptPath, "utf8");
    expect(validateReviewedTranscription(ledger, 7)).toEqual({ valid: true });
    expect(validateReviewedTranscriptionCoverage(ledger, 7, sourceTextFromEdition())).toEqual({
      valid: true,
    });
    for (const printedText of [
      "Nov. 17, 1970                         D. C. ENGELBART                         3,541,541",
      "Filed June 21, 1967                                                3 Sheets-Sheet 1",
      "FIG. 1, FIG. 2, FIG. 3",
      "NOW IS THE TIME FOR",
      "FIG. 4, FIG. 5, FIG. 6",
      "X POSITION POT",
      "SCHMITT RESOLVER DIFFERENTIATOR CHOPPER CHOPPER INVERTER",
      "FIG. 7",
      "Lindenberg & Freilich",
      "References Cited",
      "3,346,853   10/1967    Koster et al.   340-324 X",
      "D. L. TRAFTON, Assistant Examiner",
    ]) {
      expect(ledger).toContain(printedText);
    }
    expect(ledger).not.toContain("[Drawing Sheet");
    expect(ledger).not.toContain("[SHEET 1 OF 3:");

    const reviewedPage = (page: number) => {
      const marker = `--- REVIEWED TRANSCRIPTION PAGE ${page} OF 7 ---`;
      const nextMarker = `--- REVIEWED TRANSCRIPTION PAGE ${page + 1} OF 7 ---`;
      const start = ledger.indexOf(marker);
      const end = ledger.indexOf(nextMarker, start + marker.length);
      return ledger.slice(start, end === -1 ? undefined : end);
    };

    // These are PDF-page boundaries, not editorial paragraph breaks. The
    // source has long paragraphs and Claim 1 crossing the printed page break.
    expect(reviewedPage(4)).toContain("Still another object of the invention");
    expect(reviewedPage(4)).toMatch(/The position\s*$/);
    expect(reviewedPage(5)).toMatch(
      /^--- REVIEWED TRANSCRIPTION PAGE 5 OF 7 ---\s*indicator control/,
    );
    expect(reviewedPage(5)).toMatch(/A similar arrangement is used for the Y position\.\s*$/);
    expect(reviewedPage(6)).toMatch(
      /^--- REVIEWED TRANSCRIPTION PAGE 6 OF 7 ---\s*In the circuit of FIG\. 6/,
    );
    expect(reviewedPage(6)).toContain("I claim:");
    expect(reviewedPage(6)).toMatch(/movement of said housing relative to\s*$/);
    expect(reviewedPage(7)).toMatch(
      /^--- REVIEWED TRANSCRIPTION PAGE 7 OF 7 ---\s*said computer\./,
    );
  });
});
