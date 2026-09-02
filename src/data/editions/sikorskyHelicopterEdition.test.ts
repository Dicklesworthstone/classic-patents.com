import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { CuratedSpecificationBlock, CuratedSpecificationInline } from "@/types/patent";
import { validateCuratedSpecificationEdition } from "../archivalEditionValidation";
import { sikorskyHelicopterPatent } from "../patents/sikorsky-helicopter";
import {
  validateReviewedTranscription,
  validateReviewedTranscriptionEditorialIntegrity,
  validateReviewedTranscriptionLiteralCoverage,
} from "../patents/sourceTextValidation";
import { archivalEditionForPublication } from "./publicationApproval";
import {
  sikorskyHelicopterArchivalEdition,
  sikorskyHelicopterClaimText,
  sikorskyHelicopterParallelReadings,
} from "./sikorskyHelicopterEdition";

const ROOT = process.cwd();
const FACSIMILE_PATH = join(ROOT, "public/patents/pdfs/us-2318259-sikorsky-helicopter.pdf");
const LEDGER_PATH = join(
  ROOT,
  "public/patents/transcripts/us-2318259-sikorsky-helicopter-reviewed.txt",
);

describe("US 2,318,259 Direct-Lift Aircraft (Helicopter) archival edition", () => {
  test("pins the complete 15-page primary facsimile and manual publication contract", () => {
    expect(existsSync(FACSIMILE_PATH)).toBe(true);
    expect(existsSync(LEDGER_PATH)).toBe(true);

    const editionValidation = validateCuratedSpecificationEdition(
      sikorskyHelicopterArchivalEdition,
    );
    expect(editionValidation.valid).toBe(true);

    const published = archivalEditionForPublication(sikorskyHelicopterPatent);
    expect(published).toBeDefined();
    expect(published?.sourcePdfSha256).toBe(
      "7ab2b9b23907b26bff0afd37e2630b73b15c2c429c603a73cb841c8a2b4e114c",
    );
  });

  test("derives issued Claim 1 string from the manual source edition", () => {
    const claim1Text = sikorskyHelicopterClaimText(1);
    expect(claim1Text).toContain("In an aircraft having a direct lift rotor");
    expect(claim1Text).toContain("an engine for driving said rotor");
    expect(claim1Text).toContain("manually actuatable means permanently connected with said rotor");
    expect(claim1Text).toContain(
      "simultaneously and positively varying the rotor pitch and the power output of said engine",
    );
    expect(claim1Text.split(/\s+/).length).toBeGreaterThan(25);
  });

  test("derives all 10 claims from the edition", () => {
    for (let c = 1; c <= 10; c++) {
      const claimText = sikorskyHelicopterClaimText(c);
      expect(claimText).toBeDefined();
      expect(claimText.length).toBeGreaterThan(10);
    }
  });

  test("pins ledger, authored source crops, terms, and non-lossy parallel readings", () => {
    const ledger = readFileSync(LEDGER_PATH, "utf8");
    const literalBlocks = sikorskyHelicopterArchivalEdition.blocks.flatMap(
      (block: CuratedSpecificationBlock) => {
        if (block.kind === "masthead") return block.lines;
        if (block.kind === "claim") {
          return [block.inlines.map((inline: CuratedSpecificationInline) => inline.text).join("")];
        }
        return [];
      },
    );

    expect(validateReviewedTranscription(ledger, 15)).toEqual({ valid: true });
    expect(validateReviewedTranscriptionEditorialIntegrity(ledger, 15)).toEqual({ valid: true });
    expect(validateReviewedTranscriptionLiteralCoverage(ledger, 15, literalBlocks)).toEqual({
      valid: true,
    });

    // Verify all 10 figure sheet crops exist on disk
    for (let i = 1; i <= 10; i++) {
      const cropPath = join(
        ROOT,
        `public/patents/figures/us-2318259-sikorsky-helicopter/fig-${i}-source-crop-v1.png`,
      );
      expect(existsSync(cropPath)).toBe(true);
    }

    // Verify parallel readings
    const readingIndices = Object.keys(sikorskyHelicopterParallelReadings).map(Number);
    expect(readingIndices.length).toBeGreaterThanOrEqual(5);
    for (const index of readingIndices) {
      expect(sikorskyHelicopterArchivalEdition.blocks[index]).toBeDefined();
    }
  });
});
