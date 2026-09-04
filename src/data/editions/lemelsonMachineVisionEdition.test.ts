import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { lemelsonMachineVisionPatent } from "@/data/patents/lemelson-machine-vision";
import {
  validateReviewedTranscription,
  validateReviewedTranscriptionEditorialIntegrity,
  validateReviewedTranscriptionLiteralCoverage,
  validateReviewedTranscriptionPageAnchors,
} from "@/data/patents/sourceTextValidation";
import {
  lemelsonMachineVisionArchivalEdition,
  lemelsonMachineVisionClaimText,
  lemelsonMachineVisionParallelReadings,
} from "./lemelsonMachineVisionEdition";

const ROOT = process.cwd();
const LEDGER_PATH = join(
  ROOT,
  "public/patents/transcripts/us-3081379-lemelson-machine-vision-reviewed.txt",
);
const PDF_PATH = join(ROOT, "public/patents/pdfs/us-3081379-lemelson-machine-vision.pdf");
const EXPECTED_DIGEST = "2550a9d494a822f3f639c985899452b39432d53928db419633458d020c554b44";

describe("US 3,081,379 Automatic Measurement Apparatus (Machine Vision) archival edition", () => {
  test("pins the complete 35-page primary facsimile and manual publication contract", () => {
    expect(existsSync(PDF_PATH)).toBe(true);
    const pdfBuffer = readFileSync(PDF_PATH);
    const hasher = new Bun.CryptoHasher("sha256");
    hasher.update(pdfBuffer);
    const computedDigest = hasher.digest("hex");

    expect(computedDigest).toBe(EXPECTED_DIGEST);
    expect(lemelsonMachineVisionArchivalEdition.sourcePdfSha256).toBe(EXPECTED_DIGEST);
    expect(lemelsonMachineVisionArchivalEdition.completeFacsimileReviewed).toBe(true);
    expect(lemelsonMachineVisionPatent.originalPdfUrl).toBe(
      "/patents/pdfs/us-3081379-lemelson-machine-vision.pdf",
    );
    expect(lemelsonMachineVisionPatent.originalTextAsset?.sourcePdfSha256).toBe(EXPECTED_DIGEST);
    expect(lemelsonMachineVisionPatent.originalTextAsset?.pageCount).toBe(35);
  });

  test("derives issued Claim 1 string from the manual source edition", () => {
    expect(lemelsonMachineVisionPatent.claims).toHaveLength(1);
    expect(lemelsonMachineVisionPatent.stats?.totalClaims).toBe(1);
    expect(lemelsonMachineVisionPatent.stats?.independentClaims).toBe(1);

    const claim1 = lemelsonMachineVisionPatent.claims[0];
    expect(claim1.number).toBe(1);
    expect(claim1.originalText).toBe(lemelsonMachineVisionClaimText(1));
    expect(claim1.originalText).toContain("Automatic scanning and control apparatus");
    expect(claim1.originalText).toContain("electron beam scanning apparatus");
    expect(claim1.originalText).toContain("gating means");
    expect(claim1.plainEnglish.split(/\s+/).length).toBeGreaterThan(30);
    expect(claim1.keyInnovations.length).toBeGreaterThan(0);
  });

  test("pins ledger, direct full source sheets, terms, and non-lossy parallel readings", () => {
    const ledger = readFileSync(LEDGER_PATH, "utf8");
    const literalBlocks = lemelsonMachineVisionArchivalEdition.blocks.flatMap((block) => {
      if (block.kind === "masthead") return [block.lines.join(" ")];
      if (block.kind === "paragraph" || block.kind === "claim") {
        return [block.inlines.map((inline) => inline.text).join("")];
      }
      return [];
    });

    expect(validateReviewedTranscription(ledger, 35)).toEqual({ valid: true });
    expect(validateReviewedTranscriptionEditorialIntegrity(ledger, 35)).toEqual({ valid: true });
    expect(
      validateReviewedTranscriptionPageAnchors(
        ledger,
        35,
        lemelsonMachineVisionPatent.originalTextAsset?.pageAnchors,
      ),
    ).toEqual({ valid: true });
    expect(validateReviewedTranscriptionLiteralCoverage(ledger, 35, literalBlocks)).toEqual({
      valid: true,
    });

    // Preserve the earlier derivative crops; the active source face below uses
    // direct full drawing-sheet renders instead.
    for (let i = 1; i <= 10; i++) {
      const cropPath = join(
        ROOT,
        `public/patents/figures/us-3081379-lemelson-machine-vision/fig-${i}-source-crop-v1.png`,
      );
      expect(existsSync(cropPath)).toBe(true);
    }

    const sourceSheets: Readonly<Record<number, string>> = {
      1: "34afc9023facb367dafc1e503464ded850699b9b5d27a47eb57ba8bff84739e0",
      2: "80b8303a1687e31eae0601b631f6f2d0d7ad7e23a7416db18110c610763fae6a",
      3: "f6ecef18552c3fdeba5287b665f3ff311626aa240452635b354ee3f79b7c31cb",
      4: "6ac240b87498947eaec7dd5e5a149d08449f9bf0563224f7b0757539339c8c84",
      5: "d013f677f1ffcfeef96515205eb5186c68fcd669241991f41945bb3880caa475",
      6: "62e7477155377eda07f3038eff083928a5773a3051265a32b90ca4502c5d01c4",
      7: "d012bf96141e941839c9cc50dbd1d82bb5cc32b0100bf6d42ce5c2eb76a68860",
      8: "9abf00192cd1adc10d2143427cf27becc0982dda2ab1ca49da0f4d0397d7a89b",
      9: "61f15caa7e9130e1e8e1fb4f47f65fb38fef73641bff72ed4ca5a543ef482edd",
      10: "7f8d1b5ddd6da3995f90c5ca5c08624ffbb3f607ac2ec1618cc7bbeeb4c16d0b",
    };
    for (const [sourcePdfPage, expectedHash] of Object.entries(sourceSheets)) {
      const sourceSheetPath = join(
        ROOT,
        `public/patents/figures/us-3081379-lemelson-machine-vision/source-sheet-${sourcePdfPage}-v1.png`,
      );
      const sourceSheet = readFileSync(sourceSheetPath);
      const sourceSheetHasher = new Bun.CryptoHasher("sha256");
      sourceSheetHasher.update(sourceSheet);
      expect(sourceSheetHasher.digest("hex")).toBe(expectedHash);
      expect(sourceSheet.subarray(1, 4).toString("ascii")).toBe("PNG");
      expect(sourceSheet.readUInt32BE(16)).toBe(2320);
      expect(sourceSheet.readUInt32BE(20)).toBe(3408);
    }

    const figureReferences = lemelsonMachineVisionArchivalEdition.blocks.flatMap((block) => {
      const inlines =
        block.kind === "figure-sheet"
          ? block.description
          : block.kind === "paragraph" || block.kind === "claim"
            ? block.inlines
            : [];
      return inlines.flatMap((inline) =>
        inline.kind === "reference" && inline.referenceType === "figure" ? [inline] : [],
      );
    });
    const expectedSourceSheetsByActiveOccurrence = [
      1, 2, 2, 2, 3, 1, 1, 4, 5, 6, 6, 7, 7, 7, 8, 5, 9, 9, 9, 9, 10, 10, 8, 1, 1, 7, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 4, 2, 4, 7, 8,
      2, 9, 2, 3, 3, 3, 1, 1, 1, 1,
    ];
    expect(figureReferences).toHaveLength(expectedSourceSheetsByActiveOccurrence.length);
    expect(
      figureReferences.map((reference) => {
        const preview = reference.figurePreviews?.[0];
        const match = preview && /source-sheet-(\d+)-v1\.png$/.exec(preview.src);
        if (!match)
          throw new Error(`Figure reference lacks a direct source sheet: ${reference.text}`);
        expect(preview.width).toBe(2320);
        expect(preview.height).toBe(3408);
        return Number(match[1]);
      }),
    ).toEqual(expectedSourceSheetsByActiveOccurrence);

    // Verify parallel readings
    const readingIndices = Object.keys(lemelsonMachineVisionParallelReadings).map(Number);
    expect(readingIndices.length).toBeGreaterThanOrEqual(5);
    for (const index of readingIndices) {
      expect(lemelsonMachineVisionArchivalEdition.blocks[index]).toBeDefined();
    }
  });

  test("documents the landmark Symbol Technologies v. Lemelson submarine patent trial in patentWars", () => {
    expect(lemelsonMachineVisionPatent.historicalContext.patentWars).toBeDefined();
    expect(lemelsonMachineVisionPatent.historicalContext.patentWars.length).toBeGreaterThan(0);
    const war = lemelsonMachineVisionPatent.historicalContext.patentWars[0];
    expect(war.rivalName).toContain("Symbol Technologies");
    expect(war.resolution).toContain("Federal Circuit");
  });

  test("provides valid provenance classifications for all Machine Vision controls and metrics", () => {
    const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
    const entry = PATENT_PHYSICS_REGISTRY["us-3081379-lemelson-machine-vision"];
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
    const r1 = applyClaimConstraintModifications(
      "us-3081379-lemelson-machine-vision",
      {},
      { 1: false },
    );
    expect(r1.modifiedParams.scanPathEnabled).toBe(0);
    expect(r1.modifiedParams.synchronizedGateEnabled).toBe(0);
    expect(r1.modifiedParams.analyzingCircuitEnabled).toBe(0);
    expect(r1.refusalWarning).toContain("CLAIM 1 WITHHELD");
  });
});
