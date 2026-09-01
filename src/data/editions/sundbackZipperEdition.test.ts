import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";
import { sundbackZipperPatent } from "@/data/patents/sundback-zipper";
import {
  sundbackZipperArchivalEdition,
  sundbackZipperParallelReadings,
} from "./sundbackZipperEdition";

describe("US 1,219,881 Gideon Sundback Separable Fastener manual source edition", () => {
  test("pins the five-page Sundback facsimile, filing date, and all eleven printed claims", () => {
    expect(sundbackZipperPatent.archivalEdition).toBe(sundbackZipperArchivalEdition);
    expect(sundbackZipperPatent.filingDate).toBe("1914-08-27");
    expect(sundbackZipperPatent.grantDate).toBe("1917-03-20");
    expect(sundbackZipperArchivalEdition.sourcePdfSha256).toBe(
      "8b73a4db400d449ec6349a07c05b38df6f5bed609562a2c96ba893890a41a3b9",
    );
    expect(validateCuratedSpecificationEdition(sundbackZipperArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    const pdf = readFileSync(`${process.cwd()}/public${sundbackZipperPatent.originalPdfUrl}`);
    expect(createHash("sha256").update(pdf).digest("hex")).toBe(
      sundbackZipperArchivalEdition.sourcePdfSha256,
    );
    expect(sundbackZipperPatent.claims.map((claim) => claim.number)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
    ]);
    expect(sundbackZipperPatent.stats).toMatchObject({ totalClaims: 11, independentClaims: 11 });
  });

  test("keeps the typed legal claims exactly synchronized with the public decoders", () => {
    const authoredClaims = sundbackZipperArchivalEdition.blocks.filter(
      (
        block,
      ): block is Extract<
        (typeof sundbackZipperArchivalEdition.blocks)[number],
        { kind: "claim" }
      > => block.kind === "claim",
    );
    expect(sundbackZipperPatent.claims.map((claim) => claim.originalText)).toEqual(
      authoredClaims.map((claim) => claim.inlines.map((inline) => inline.text).join("")),
    );
    for (const claim of sundbackZipperPatent.claims) {
      expect(claim.plainEnglish.split(/\s+/).length).toBeGreaterThan(25);
      expect(claim.keyInnovations).not.toHaveLength(0);
    }
  });

  test("uses an authored local source crop for every printed figure citation", () => {
    const references = sundbackZipperArchivalEdition.blocks.flatMap((block) =>
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
        expect(preview.src).toStartWith("/patents/figures/us-1219881-sundback-zipper/");
        expect(existsSync(resolve(process.cwd(), "public", preview.src.slice(1)))).toBe(true);
      }
    }
  });

  test("contains parallel readings for every paragraph index", () => {
    const paragraphIndices = sundbackZipperArchivalEdition.blocks
      .map((block, idx) => (block.kind === "paragraph" ? idx : null))
      .filter((idx): idx is number => idx !== null);

    for (const idx of paragraphIndices) {
      const reading = sundbackZipperParallelReadings[idx];
      expect(reading).toBeDefined();
      expect(reading?.join(" ").length).toBeGreaterThan(30);
    }
  });

  test("validates the reviewed transcription ledger", () => {
    const ledger = readFileSync(
      `${process.cwd()}/public/patents/transcripts/us-1219881-sundback-zipper-reviewed.txt`,
      "utf8",
    );
    const result = validateReviewedTranscription(ledger, 5);
    expect(result.valid).toBe(true);
  });
});
