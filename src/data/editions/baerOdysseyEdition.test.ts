import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
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
const FIGURE_DIRECTORY = join(ROOT, "public/patents/figures/us-3728480-baer-odyssey");

const ACTIVE_SOURCE_SHEETS = [
  [
    "source-sheet-pdf-02-v1.png",
    "d7a61c5bb69c962a3f3d81666dbd8f40273f4e9874b9965fd017519ad45c98d0",
  ],
  [
    "source-sheet-pdf-03-v1.png",
    "291107b3b6e181f9d5022e3e32637b0d6decf0fd05cd148a8d07d5e6f80b4a01",
  ],
  [
    "source-sheet-pdf-04-v1.png",
    "6721c0be0f0e4bf898fd664743a8afc317d850ace640758fd22a576e4479c9ce",
  ],
  [
    "source-sheet-pdf-05-v1.png",
    "2e7b1041bbecc8cfc8cd428bbb158d5d26b40646f1bf6d1de0d75d5cadaceac0",
  ],
  [
    "source-sheet-pdf-06-v1.png",
    "da076ec7b71e0afff7b1409adb416b4c614e259adf045c0e06e146a70058a926",
  ],
  [
    "source-sheet-pdf-07-v1.png",
    "9e339f7f217f97bd17df77a11a8a3f756f659e0f3f5c02d37c6e29cfc7125a3d",
  ],
  [
    "source-sheet-pdf-08-v1.png",
    "8f1de5c75d60feaf719cd33be2cabce7c0bdbec8fceb13b0569c02018cec421e",
  ],
  [
    "source-sheet-pdf-11-v1.png",
    "f2d48dfabb3ccbcf538a99fa563efc7fac9e7bceead5b52a4e63cb6b9fc38653",
  ],
  [
    "source-sheet-pdf-12-v1.png",
    "9dfccdecbeec4824881be41cc09fe4697d559a04c73066dfcec68783094e72a6",
  ],
] as const;

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

    // Preserve every legacy crop while current citations use source-sheet renders.
    for (let i = 1; i <= 11; i++) {
      const cropPath = join(FIGURE_DIRECTORY, `fig-${i}-source-crop-v1.png`);
      expect(existsSync(cropPath)).toBe(true);
    }

    // Verify parallel readings
    const readingIndices = Object.keys(baerOdysseyParallelReadings).map(Number);
    expect(readingIndices.length).toBeGreaterThanOrEqual(5);
    for (const index of readingIndices) {
      expect(baerOdysseyArchivalEdition.blocks[index]).toBeDefined();
    }
  });

  test("pins active figure occurrences to visually reviewed, full source sheets", () => {
    for (const [fileName, digest] of ACTIVE_SOURCE_SHEETS) {
      const sourceSheetPath = join(FIGURE_DIRECTORY, fileName);
      expect(existsSync(sourceSheetPath)).toBe(true);
      expect(createHash("sha256").update(readFileSync(sourceSheetPath)).digest("hex")).toBe(digest);
    }

    const authoredFigureReferences = baerOdysseyArchivalEdition.blocks.flatMap(
      (block, blockIndex) => {
        if (block.kind !== "paragraph" && block.kind !== "claim") return [];
        return block.inlines.flatMap((inline, inlineIndex) => {
          if (inline.kind !== "reference" || inline.referenceType !== "figure") return [];
          return [
            {
              occurrenceKey: `edition-block-${blockIndex}-group-0-inline-${inlineIndex}`,
              text: inline.text,
              previews: inline.figurePreviews ?? [],
            },
          ];
        });
      },
    );

    expect(authoredFigureReferences.map((reference) => reference.occurrenceKey)).toEqual([
      "edition-block-21-group-0-inline-0",
      "edition-block-22-group-0-inline-0",
      "edition-block-23-group-0-inline-0",
      "edition-block-24-group-0-inline-0",
      "edition-block-25-group-0-inline-0",
      "edition-block-26-group-0-inline-0",
      "edition-block-27-group-0-inline-0",
      "edition-block-28-group-0-inline-0",
      "edition-block-29-group-0-inline-0",
      "edition-block-30-group-0-inline-0",
      "edition-block-31-group-0-inline-0",
      "edition-block-32-group-0-inline-0",
      "edition-block-33-group-0-inline-0",
      "edition-block-35-group-0-inline-1",
      "edition-block-35-group-0-inline-3",
    ]);
    expect(authoredFigureReferences).toHaveLength(15);
    expect(authoredFigureReferences.flatMap((reference) => reference.previews)).toHaveLength(17);
    expect(
      authoredFigureReferences.map((reference) => ({
        text: reference.text,
        sourceSheets: reference.previews.map((preview) => preview.src),
      })),
    ).toEqual([
      {
        text: "FIG. 1",
        sourceSheets: ["/patents/figures/us-3728480-baer-odyssey/source-sheet-pdf-02-v1.png"],
      },
      {
        text: "FIG. 1A",
        sourceSheets: ["/patents/figures/us-3728480-baer-odyssey/source-sheet-pdf-02-v1.png"],
      },
      {
        text: "FIG. 1B",
        sourceSheets: ["/patents/figures/us-3728480-baer-odyssey/source-sheet-pdf-02-v1.png"],
      },
      {
        text: "FIG. 1C",
        sourceSheets: ["/patents/figures/us-3728480-baer-odyssey/source-sheet-pdf-03-v1.png"],
      },
      {
        text: "FIGS. 1D and 1E",
        sourceSheets: ["/patents/figures/us-3728480-baer-odyssey/source-sheet-pdf-03-v1.png"],
      },
      {
        text: "FIG. 2",
        sourceSheets: ["/patents/figures/us-3728480-baer-odyssey/source-sheet-pdf-04-v1.png"],
      },
      {
        text: "FIG. 3",
        sourceSheets: ["/patents/figures/us-3728480-baer-odyssey/source-sheet-pdf-05-v1.png"],
      },
      {
        text: "FIG. 4",
        sourceSheets: ["/patents/figures/us-3728480-baer-odyssey/source-sheet-pdf-04-v1.png"],
      },
      {
        text: "FIGS. 5A-5G",
        sourceSheets: [
          "/patents/figures/us-3728480-baer-odyssey/source-sheet-pdf-06-v1.png",
          "/patents/figures/us-3728480-baer-odyssey/source-sheet-pdf-07-v1.png",
          "/patents/figures/us-3728480-baer-odyssey/source-sheet-pdf-08-v1.png",
        ],
      },
      {
        text: "FIG. 7",
        sourceSheets: ["/patents/figures/us-3728480-baer-odyssey/source-sheet-pdf-11-v1.png"],
      },
      {
        text: "FIG. 8",
        sourceSheets: ["/patents/figures/us-3728480-baer-odyssey/source-sheet-pdf-11-v1.png"],
      },
      {
        text: "FIG. 9",
        sourceSheets: ["/patents/figures/us-3728480-baer-odyssey/source-sheet-pdf-12-v1.png"],
      },
      {
        text: "FIG. 10",
        sourceSheets: ["/patents/figures/us-3728480-baer-odyssey/source-sheet-pdf-12-v1.png"],
      },
      {
        text: "FIG. 1",
        sourceSheets: ["/patents/figures/us-3728480-baer-odyssey/source-sheet-pdf-02-v1.png"],
      },
      {
        text: "FIG. 1A",
        sourceSheets: ["/patents/figures/us-3728480-baer-odyssey/source-sheet-pdf-02-v1.png"],
      },
    ]);

    for (const reference of authoredFigureReferences) {
      for (const preview of reference.previews) {
        expect(preview.width).toBe(2320);
        expect(preview.height).toBe(3408);
      }
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
