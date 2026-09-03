import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import type { CuratedSpecificationBlock, CuratedSpecificationInline } from "@/types/patent";
import { validateCuratedSpecificationEdition } from "../archivalEditionValidation";
import { metcalfeEthernetPatent } from "../patents/metcalfe-ethernet";
import {
  validateReviewedTranscription,
  validateReviewedTranscriptionEditorialIntegrity,
  validateReviewedTranscriptionLiteralCoverage,
} from "../patents/sourceTextValidation";
import {
  metcalfeEthernetArchivalEdition,
  metcalfeEthernetClaimText,
  metcalfeEthernetParallelReadings,
} from "./metcalfeEthernetEdition";

const ROOT = process.cwd();
const FACSIMILE_PATH = join(ROOT, "public/patents/pdfs/us-4063220-metcalfe-ethernet.pdf");
const LEDGER_PATH = join(
  ROOT,
  "public/patents/transcripts/us-4063220-metcalfe-ethernet-reviewed.txt",
);

describe("US 4,063,220 Multipoint Data Communication System (Ethernet) archival edition", () => {
  test("pins the complete 19-page primary facsimile and manual publication contract", () => {
    expect(existsSync(FACSIMILE_PATH)).toBe(true);
    expect(existsSync(LEDGER_PATH)).toBe(true);

    const editionValidation = validateCuratedSpecificationEdition(metcalfeEthernetArchivalEdition);
    expect(editionValidation.valid).toBe(true);
    expect(metcalfeEthernetArchivalEdition.sourcePdfSha256).toBe(
      "3bd400ad08a604c1911f554f3bda8ddc4a64923170760736fde6bd481e5ec928",
    );
    expect(metcalfeEthernetPatent.archivalEdition).toBe(metcalfeEthernetArchivalEdition);
  });

  test("derives issued Claim 1 string from the manual source edition", () => {
    const claim1Text = metcalfeEthernetClaimText(1);
    expect(claim1Text).toContain("A data communication system comprising:");
    expect(claim1Text).toContain("a communicating medium;");
    expect(claim1Text).toContain("a plurality of transceivers connected to said medium");
    expect(claim1Text).toContain("collision detecting means");
    expect(claim1Text).toContain("generating a collision signal");
    expect(claim1Text).toContain("interrupting the transmission of a signal");
    expect(claim1Text.split(/\s+/).length).toBeGreaterThan(30);
  });

  test("derives all 22 claims from the edition", () => {
    for (let c = 1; c <= 22; c++) {
      const claimText = metcalfeEthernetClaimText(c);
      expect(claimText).toBeDefined();
      expect(claimText.length).toBeGreaterThan(10);
    }
  });

  test("pins ledger, authored source crops, terms, and non-lossy parallel readings", () => {
    const ledger = readFileSync(LEDGER_PATH, "utf8");
    const literalBlocks = metcalfeEthernetArchivalEdition.blocks.flatMap(
      (block: CuratedSpecificationBlock) => {
        if (block.kind === "masthead") return block.lines;
        if (block.kind === "claim") {
          return [block.inlines.map((inline: CuratedSpecificationInline) => inline.text).join("")];
        }
        return [];
      },
    );

    expect(validateReviewedTranscription(ledger, 19)).toEqual({ valid: true });
    expect(validateReviewedTranscriptionEditorialIntegrity(ledger, 19)).toEqual({ valid: true });
    expect(validateReviewedTranscriptionLiteralCoverage(ledger, 19, literalBlocks)).toEqual({
      valid: true,
    });

    // Verify all 6 figure sheet crops exist on disk
    for (let i = 1; i <= 6; i++) {
      const cropPath = join(
        ROOT,
        `public/patents/figures/us-4063220-metcalfe-ethernet/fig-${i}-source-crop-v1.png`,
      );
      expect(existsSync(cropPath)).toBe(true);
    }

    // Verify parallel readings
    const readingIndices = Object.keys(metcalfeEthernetParallelReadings).map(Number);
    expect(readingIndices.length).toBeGreaterThanOrEqual(5);
    for (const index of readingIndices) {
      expect(metcalfeEthernetArchivalEdition.blocks[index]).toBeDefined();
    }
  });

  test("provides valid provenance classifications for all Metcalfe controls and metrics", () => {
    const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
    const entry = PATENT_PHYSICS_REGISTRY["us-4063220-metcalfe-ethernet"];
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
    const r1 = applyClaimConstraintModifications("us-4063220-metcalfe-ethernet", {}, { 1: false });
    expect(r1.modifiedParams.triggerCollision).toBe(1);
    expect(r1.refusalWarning).toContain("CONTENTION COLLAPSE");
  });
});
