import { describe, expect, test } from "bun:test";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { morseTelegraphPatent } from "@/data/patents/morse-telegraph";
import {
  morseTelegraphArchivalEdition,
  morseTelegraphParallelReadings,
} from "./morseTelegraphEdition";

describe("morseTelegraphArchivalEdition", () => {
  test("pins the nine-page US 1,647 facsimile and its complete printed claim set", () => {
    expect(validateCuratedSpecificationEdition(morseTelegraphArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    expect(morseTelegraphArchivalEdition.sourcePdfSha256).toBe(
      "07a534f54894e6130980052a77c565492e53d6cd527c092b47016e8cc243ed93",
    );
    expect(morseTelegraphArchivalEdition.completeFacsimileReviewed).toBe(true);
    expect(
      morseTelegraphArchivalEdition.blocks
        .filter((block) => block.kind === "claim")
        .map((block) => block.number),
    ).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  test("uses explicit source nodes for all printed figure references and never an OCR input", () => {
    const serialized = JSON.stringify(morseTelegraphArchivalEdition.blocks);
    expect(serialized).not.toContain("SOURCE PDF PAGE");
    expect(serialized).not.toContain("pdftotext");

    for (const block of morseTelegraphArchivalEdition.blocks) {
      if (block.kind !== "paragraph") continue;
      for (const inline of block.inlines) {
        if (inline.kind !== "reference" || inline.referenceType !== "figure") continue;
        expect(inline.figurePreviews).toHaveLength(1);
        expect(inline.figurePreviews?.[0]?.src).toStartWith(
          "/patents/figures/us-1647-morse-telegraph-sheet-",
        );
      }
    }
  });

  test("prepares a non-lossy patent-owned reading for every prose node", () => {
    for (const [index, block] of morseTelegraphArchivalEdition.blocks.entries()) {
      if (block.kind !== "paragraph") continue;
      const reading = morseTelegraphParallelReadings[index];
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

  test("keeps the catalogue's nine claim decoders tied to the published legal nodes", () => {
    const editionClaims = morseTelegraphArchivalEdition.blocks.filter(
      (block) => block.kind === "claim",
    );
    expect(morseTelegraphPatent.stats?.totalClaims).toBe(9);
    expect(morseTelegraphPatent.claims).toHaveLength(9);
    for (const claim of editionClaims) {
      const decoder = morseTelegraphPatent.claims.find(
        (candidate) => candidate.number === claim.number,
      );
      expect(decoder?.originalText).toBe(claim.inlines.map((inline) => inline.text).join(""));
      expect(decoder?.plainEnglish.split(/\s+/).length).toBeGreaterThan(20);
    }
  });
});
