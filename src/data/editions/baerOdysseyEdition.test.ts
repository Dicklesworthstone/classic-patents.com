import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { validateCuratedSpecificationEdition } from "../archivalEditionValidation";
import { baerOdysseyPatent } from "../patents/baer-odyssey";
import {
  validateReviewedTranscription,
  validateReviewedTranscriptionEditorialIntegrity,
  validateReviewedTranscriptionLiteralCoverage,
} from "../patents/sourceTextValidation";
import {
  baerOdysseyArchivalEdition,
  baerOdysseyClaimText,
  baerOdysseyParallelReadings,
} from "./baerOdysseyEdition";

const ROOT = process.cwd();
const FACSIMILE_PATH = join(ROOT, "public/patents/pdfs/us-3728480-baer-odyssey.pdf");
const LEDGER_PATH = join(ROOT, "public/patents/transcripts/us-3728480-baer-odyssey-reviewed.txt");

describe("US 3,728,480 Television Gaming and Training Apparatus (Magnavox Odyssey) archival edition", () => {
  test("pins the complete 21-page primary facsimile and manual publication contract", () => {
    expect(existsSync(FACSIMILE_PATH)).toBe(true);
    expect(existsSync(LEDGER_PATH)).toBe(true);

    const editionValidation = validateCuratedSpecificationEdition(baerOdysseyArchivalEdition);
    expect(editionValidation.valid).toBe(true);

    expect(baerOdysseyPatent.archivalEdition).toBeDefined();
    expect(baerOdysseyPatent.archivalEdition?.sourcePdfSha256).toBe(
      "620a5c6c5563115c9ec3fa34f64c646b4f32cb9f587eda6bef78a9516439a0cc",
    );
  });

  test("derives issued Claim 1 string from the manual source edition", () => {
    const claim1Text = baerOdysseyClaimText(1);
    expect(claim1Text).toContain("In combination with a standard television receiver");
    expect(claim1Text).toContain("apparatus for generating");
    expect(claim1Text).toContain("control unit for generating signals");
    expect(claim1Text).toContain("means for generating synchronizing signal");
    expect(claim1Text).toContain("means for manipulating the position");
    expect(claim1Text.split(/\s+/).length).toBeGreaterThan(30);
  });

  test("pins ledger, authored source crops, terms, and non-lossy parallel readings", () => {
    const ledger = readFileSync(LEDGER_PATH, "utf8");
    const literalBlocks = baerOdysseyArchivalEdition.blocks.flatMap((block) => {
      if (block.kind === "masthead") return [block.lines.join(" ")];
      if (block.kind === "paragraph" || block.kind === "claim") {
        return [block.inlines.map((inline) => inline.text).join("")];
      }
      return [];
    });

    expect(validateReviewedTranscription(ledger, 21)).toEqual({ valid: true });
    expect(validateReviewedTranscriptionEditorialIntegrity(ledger, 21)).toEqual({ valid: true });
    expect(validateReviewedTranscriptionLiteralCoverage(ledger, 21, literalBlocks)).toEqual({
      valid: true,
    });

    // Verify all 11 figure sheet crops exist on disk
    for (let i = 1; i <= 11; i++) {
      const cropPath = join(
        ROOT,
        `public/patents/figures/us-3728480-baer-odyssey/fig-${i}-source-crop-v1.png`,
      );
      expect(existsSync(cropPath)).toBe(true);
    }

    // Verify parallel readings
    const readingIndices = Object.keys(baerOdysseyParallelReadings).map(Number);
    expect(readingIndices.length).toBeGreaterThanOrEqual(5);
    for (const index of readingIndices) {
      expect(baerOdysseyArchivalEdition.blocks[index]).toBeDefined();
    }
  });

  test("provides valid provenance classifications for all Baer controls and metrics", () => {
    const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
    const entry = PATENT_PHYSICS_REGISTRY["us-3728480-baer-odyssey"];
    expect(entry).toBeDefined();
    for (const ctrl of entry.controls) {
      expect(ctrl.provenance).toBeDefined();
    }
    const metrics = entry.computeMetrics({});
    for (const m of metrics) {
      expect(m.provenance).toBeDefined();
    }
  });

  test("wires claim 1 constraint in claimConstraints", () => {
    const { applyClaimConstraintModifications } = require("@/physics/claimConstraints");
    const r1 = applyClaimConstraintModifications("us-3728480-baer-odyssey", {}, { 1: false });
    expect(r1.modifiedParams.claim1Active).toBe(0);
    expect(r1.modifiedParams.ballSpeedMultiplier).toBeUndefined();
    expect(r1.activeFailures).toEqual([
      "Claim 1 signal path omitted: control-unit dot generation, raster synchronization, participant manipulation, and direct receiver coupling are withheld.",
    ]);
    expect(r1.refusalWarning).toContain("CLAIM 1 TOPOLOGY WITHHELD");
  });
});
