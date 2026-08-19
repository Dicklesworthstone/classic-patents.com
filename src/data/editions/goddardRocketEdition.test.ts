import { describe, expect, test } from "bun:test";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { goddardRocketPatent } from "@/data/patents/goddard-rocket";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";
import {
  goddardRocketArchivalEdition,
  goddardRocketParallelReadings,
} from "./goddardRocketEdition";

describe("goddardRocketArchivalEdition", () => {
  test("pins the reviewed four-page US 1,102,653 facsimile and all eight printed claims", () => {
    expect(validateCuratedSpecificationEdition(goddardRocketArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    expect(goddardRocketArchivalEdition.sourcePdfSha256).toBe(
      "8503f52914f4201850d7d6f067ac48886dda77c2cdb5e8fce831e13232f7c42b",
    );
    expect(goddardRocketArchivalEdition.completeFacsimileReviewed).toBe(true);
    expect(
      goddardRocketArchivalEdition.blocks
        .filter((block) => block.kind === "claim")
        .map((block) => block.number),
    ).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  test("uses only explicitly authored source nodes and patent-local source figure crops", () => {
    const serialized = JSON.stringify(goddardRocketArchivalEdition.blocks);
    expect(serialized).not.toContain("SOURCE PDF PAGE");
    expect(serialized).not.toContain("pdftotext");
    expect(serialized).not.toContain("ocr");

    for (const block of goddardRocketArchivalEdition.blocks) {
      if (block.kind !== "paragraph") continue;
      for (const inline of block.inlines) {
        if (inline.kind !== "reference" || inline.referenceType !== "figure") continue;
        expect(inline.figurePreviews?.length).toBeGreaterThan(0);
        for (const preview of inline.figurePreviews ?? []) {
          expect(preview.src).toMatch(
            /^\/patents\/figures\/us-1102653-goddard-rocket-fig-[1-5]\.png$/,
          );
        }
      }
    }
  });

  test("turns every source figure citation into an authored preview node", () => {
    const bareFigureReference = /\b(?:fig(?:s)?\.?|figure)\s+\d+/i;

    for (const block of goddardRocketArchivalEdition.blocks) {
      if (block.kind !== "paragraph" && block.kind !== "claim") continue;
      for (const inline of block.inlines) {
        if (inline.kind === "text") expect(inline.text).not.toMatch(bareFigureReference);
      }
    }
  });

  test("defines period technical terms at their exact source occurrences", () => {
    const terms = goddardRocketArchivalEdition.blocks.flatMap((block) => {
      if (block.kind !== "paragraph") return [];
      return block.inlines.filter((inline) => inline.kind === "term");
    });

    expect(terms.map((term) => term.text)).toEqual([
      "combustion chamber",
      "truncated cone",
      "backwardly curved tubes or recesses",
      "key",
      "firing tube",
      "gyroscope",
      "three-phase induction motor",
    ]);
    for (const term of terms) expect(term.definition.split(/\s+/).length).toBeGreaterThan(8);
  });

  test("provides a complete-coverage, non-lossy companion for every source paragraph", () => {
    for (const [index, block] of goddardRocketArchivalEdition.blocks.entries()) {
      if (block.kind !== "paragraph") continue;
      const reading = goddardRocketParallelReadings[index];
      expect(reading?.join(" ").trim().length).toBeGreaterThan(20);
      const sourceWords = block.inlines
        .map((inline) => inline.text)
        .join(" ")
        .trim()
        .split(/\s+/).length;
      const readingWords = reading?.join(" ").trim().split(/\s+/).length ?? 0;
      if (sourceWords >= 100) expect(readingWords / sourceWords).toBeGreaterThanOrEqual(0.3);
    }
  });

  test("ties the canonical record's eight decoders to the published claim nodes and transcript ledger", async () => {
    const editionClaims = goddardRocketArchivalEdition.blocks.filter(
      (block) => block.kind === "claim",
    );
    expect(goddardRocketPatent.id).toBe("us-1102653-goddard-rocket");
    expect(goddardRocketPatent.patentNumber).toBe("US 1,102,653");
    expect(goddardRocketPatent.stats).toEqual({ totalClaims: 8, independentClaims: 8 });
    expect(goddardRocketPatent.claims).toHaveLength(8);
    for (const claim of editionClaims) {
      const decoder = goddardRocketPatent.claims.find(
        (candidate) => candidate.number === claim.number,
      );
      expect(decoder?.originalText).toBe(claim.inlines.map((inline) => inline.text).join(""));
      expect(decoder?.plainEnglish.split(/\s+/).length).toBeGreaterThan(20);
    }

    const transcript = await Bun.file(
      "public/patents/transcripts/us-1102653-goddard-rocket.txt",
    ).text();
    expect(validateReviewedTranscription(transcript, 4)).toEqual({ valid: true });
    for (const claim of editionClaims) {
      expect(transcript).toContain(claim.inlines.map((inline) => inline.text).join(""));
    }
  });
});
