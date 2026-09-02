import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { hullStereolithographyPatent } from "@/data/patents/hull-stereolithography";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";
import {
  hullStereolithographyArchivalEdition,
  hullStereolithographyParallelReadings,
} from "./hullStereolithographyEdition";

const normalizeSourceText = (value: string) => value.replace(/\s+/g, " ").trim();

describe("US 4,575,330 Charles W. Hull Stereolithography manual source edition", () => {
  test("pins the sixteen-page Hull facsimile, filing date, and all 47 printed claims", () => {
    expect(hullStereolithographyPatent.archivalEdition).toBe(hullStereolithographyArchivalEdition);
    expect(hullStereolithographyPatent.filingDate).toBe("1984-08-08");
    expect(hullStereolithographyPatent.grantDate).toBe("1986-03-11");
    expect(hullStereolithographyArchivalEdition.sourcePdfSha256).toBe(
      "5dc2211b18f88883ee92394917154d57d102b73c26a4744332cbf0d89b1db1c7",
    );
    expect(validateCuratedSpecificationEdition(hullStereolithographyArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    const pdf = readFileSync(
      `${process.cwd()}/public${hullStereolithographyPatent.originalPdfUrl}`,
    );
    expect(createHash("sha256").update(pdf).digest("hex")).toBe(
      hullStereolithographyArchivalEdition.sourcePdfSha256,
    );
    expect(hullStereolithographyPatent.claims.map((claim) => claim.number)).toEqual(
      Array.from({ length: 47 }, (_, i) => i + 1),
    );
    expect(hullStereolithographyPatent.stats).toMatchObject({
      totalClaims: 47,
      independentClaims: 5,
    });
  });

  test("keeps the typed legal claims exactly synchronized with the public decoders", () => {
    const authoredClaims = hullStereolithographyArchivalEdition.blocks.filter(
      (
        block,
      ): block is Extract<
        (typeof hullStereolithographyArchivalEdition.blocks)[number],
        { kind: "claim" }
      > => block.kind === "claim",
    );
    expect(hullStereolithographyPatent.claims.map((claim) => claim.originalText)).toEqual(
      authoredClaims.map((claim) => claim.inlines.map((inline) => inline.text).join("")),
    );
    for (const claim of hullStereolithographyPatent.claims) {
      expect(claim.plainEnglish.split(/\s+/).length).toBeGreaterThan(10);
      expect(claim.keyInnovations).not.toHaveLength(0);
    }
  });

  test("uses an authored local source crop for every printed figure citation", () => {
    const references = hullStereolithographyArchivalEdition.blocks.flatMap((block) =>
      "inlines" in block
        ? block.inlines.filter(
            (inline): inline is Extract<(typeof block.inlines)[number], { kind: "reference" }> =>
              inline.kind === "reference" && inline.referenceType === "figure",
          )
        : block.kind === "figure-sheet"
          ? block.description.filter(
              (
                inline,
              ): inline is Extract<(typeof block.description)[number], { kind: "reference" }> =>
                inline.kind === "reference" && inline.referenceType === "figure",
            )
          : [],
    );
    expect(references.length).toBeGreaterThanOrEqual(8);
    for (const ref of references) {
      expect(ref.figurePreviews).toBeDefined();
      expect(ref.figurePreviews?.length).toBeGreaterThan(0);
      for (const preview of ref.figurePreviews ?? []) {
        const fullPath = resolve(process.cwd(), `public${preview.src}`);
        expect(existsSync(fullPath)).toBe(true);
      }
    }
  });

  test("contains parallel readings for every paragraph index", () => {
    const paragraphIndices = hullStereolithographyArchivalEdition.blocks
      .map((block, idx) => (block.kind === "paragraph" ? idx : null))
      .filter((idx): idx is number => idx !== null);

    const readingKeys = Object.keys(hullStereolithographyParallelReadings)
      .map(Number)
      .sort((a, b) => a - b);
    expect(readingKeys).toEqual(paragraphIndices);
    for (const paragraphs of Object.values(hullStereolithographyParallelReadings)) {
      expect(paragraphs.length).toBeGreaterThan(0);
      for (const pText of paragraphs) {
        expect(pText.length).toBeGreaterThan(40);
      }
    }
  });

  test("validates the reviewed transcription ledger across all 16 pages", () => {
    const ledgerPath = resolve(
      process.cwd(),
      `public${hullStereolithographyPatent.originalTextAsset?.url}`,
    );
    expect(existsSync(ledgerPath)).toBe(true);
    const ledgerText = readFileSync(ledgerPath, "utf8");
    const validation = validateReviewedTranscription(ledgerText, 16);
    expect(validation.valid).toBe(true);

    const normalizedLedger = normalizeSourceText(ledgerText);
    for (let c = 1; c <= 47; c++) {
      expect(normalizedLedger.includes(`${c}.`)).toBe(true);
    }
  });
});
