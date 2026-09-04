import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { robotEndEffectorPatent } from "../patents/robot-end-effector";
import {
  robotEndEffectorArchivalEdition,
  robotEndEffectorClaimText,
  robotEndEffectorParallelReadings,
} from "./robotEndEffectorEdition";

const PATENT_ID = "us-4765668-robot-end-effector";
const EXPECTED_PDF_SHA256 = "654ed8b094309e39412debba71117f177602c1557ade8d9865f834a1d9e84485";

describe("US 4,765,668 Robot End Effector Archival Edition Contract", () => {
  test("pins the complete 10-page primary facsimile and manual publication contract", () => {
    const pdfPath = resolve(process.cwd(), "public/patents/pdfs/us-4765668-robot-end-effector.pdf");
    expect(existsSync(pdfPath)).toBe(true);
    expect(robotEndEffectorPatent.id).toBe(PATENT_ID);
    expect(robotEndEffectorPatent.archivalEdition).toBe(robotEndEffectorArchivalEdition);

    const pdfBytes = readFileSync(pdfPath);
    const pdfDigest = createHash("sha256").update(pdfBytes).digest("hex");
    expect(pdfDigest).toBe(EXPECTED_PDF_SHA256);
    expect(robotEndEffectorArchivalEdition.sourcePdfSha256).toBe(EXPECTED_PDF_SHA256);
    expect(robotEndEffectorPatent.originalTextAsset?.sourcePdfSha256).toBe(EXPECTED_PDF_SHA256);
    expect(robotEndEffectorArchivalEdition.completeFacsimileReviewed).toBe(true);
  });

  test("derives all twenty issued claim strings from the manual source edition", () => {
    expect(robotEndEffectorPatent.claims.length).toBe(20);
    const editionClaims = robotEndEffectorArchivalEdition.blocks.filter(
      (block) => block.kind === "claim",
    );
    expect(editionClaims.length).toBe(20);

    for (let i = 1; i <= 20; i++) {
      const claimText = robotEndEffectorClaimText(i);
      expect(claimText.trim().length).toBeGreaterThan(30);
      const matchingClaim = robotEndEffectorPatent.claims.find((c) => c.number === i);
      expect(matchingClaim).toBeDefined();
      expect(matchingClaim?.originalText).toBe(claimText);
      expect(matchingClaim?.plainEnglish.trim().length).toBeGreaterThan(40);
    }
  });

  test("contains every published literal source block in the reviewed 10-page ledger", () => {
    const ledgerPath = resolve(
      process.cwd(),
      "public/patents/transcripts/us-4765668-robot-end-effector-reviewed.txt",
    );
    expect(existsSync(ledgerPath)).toBe(true);
    const ledgerText = readFileSync(ledgerPath, "utf8");

    // Verify ledger page markers
    for (let p = 1; p <= 10; p++) {
      expect(ledgerText).toContain(`--- REVIEWED TRANSCRIPTION PAGE ${p} OF 10 ---`);
    }

    // Check key phrases from specification
    expect(ledgerText).toContain("ROBOT END EFFECTOR");
    expect(ledgerText).toContain("Alexander H. Slocum");
    expect(ledgerText).toContain("ball screw");
    expect(ledgerText).toContain("dovetail");
    expect(ledgerText).toContain("left hand threaded portion");
  });

  test("pins complete source drawing sheets, technical term annotations, and parallel readings", () => {
    for (const sourcePdfPage of [2, 3, 4, 5]) {
      const sourceSheetPath = resolve(
        process.cwd(),
        `public/patents/figures/us-4765668-robot-end-effector/source-sheet-${sourcePdfPage}-v1.png`,
      );
      expect(existsSync(sourceSheetPath)).toBe(true);
    }

    const figureReferences = robotEndEffectorArchivalEdition.blocks.flatMap((candidate) =>
      candidate.kind === "paragraph"
        ? candidate.inlines.filter(
            (inline) => inline.kind === "reference" && inline.referenceType === "figure",
          )
        : [],
    );
    expect(figureReferences).toHaveLength(29);
    for (const reference of figureReferences) {
      if (reference.kind !== "reference") continue;
      for (const preview of reference.figurePreviews ?? []) {
        expect(preview.src).toMatch(
          /^\/patents\/figures\/us-4765668-robot-end-effector\/source-sheet-[2-5]-v1\.png$/,
        );
        expect(preview.width).toBe(2320);
        expect(preview.height).toBe(3408);
      }
    }

    const annotatedTerms = robotEndEffectorArchivalEdition.blocks.flatMap((candidate) =>
      candidate.kind === "paragraph"
        ? candidate.inlines.filter((inline) => inline.kind === "term")
        : [],
    );
    expect(annotatedTerms.length).toBeGreaterThanOrEqual(3);
    for (const inline of annotatedTerms) {
      if (inline.kind === "term") {
        expect(inline.definition.trim().length).toBeGreaterThan(20);
      }
    }

    // Verify parallel readings coverage
    const paragraphIndices = robotEndEffectorArchivalEdition.blocks
      .map((b, idx) => (b.kind === "paragraph" ? idx : null))
      .filter((idx): idx is number => idx !== null);
    expect(paragraphIndices.length).toBeGreaterThan(15);
    for (const idx of paragraphIndices) {
      const reading = robotEndEffectorParallelReadings[idx];
      expect(reading).toBeDefined();
      expect(reading?.length).toBeGreaterThan(0);
      expect(reading?.[0].trim().length).toBeGreaterThan(20);
    }
  });

  test("provides valid provenance classifications for all Robot End Effector controls and metrics", () => {
    const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
    const config = PATENT_PHYSICS_REGISTRY[PATENT_ID];
    expect(config).toBeDefined();

    for (const ctrl of config.controls) {
      expect(["source-disclosed", "scenario-reader"]).toContain(ctrl.provenance);
    }

    const defaultMetrics = config.computeMetrics({});
    for (const metric of defaultMetrics) {
      expect(["source-disclosed", "scenario-reader"]).toContain(metric.provenance);
    }
  });

  test("wires claim 1 constraint in claimConstraints", () => {
    const {
      CATALOG_CLAIM_CONSTRAINTS,
      applyClaimConstraintModifications,
    } = require("@/physics/claimConstraints");
    const constraints = CATALOG_CLAIM_CONSTRAINTS[PATENT_ID];
    expect(constraints).toBeDefined();
    expect(constraints.length).toBeGreaterThanOrEqual(1);

    const claim1 = constraints.find((c: any) => c.claimNumber === 1);
    expect(claim1).toBeDefined();
    expect(claim1?.claimTitle).toBe("Symmetric Opposed-Thread Hands and Removable Fingers");

    const activeRes = applyClaimConstraintModifications(PATENT_ID, {}, { 1: true });
    expect(activeRes.activeFailures.length).toBe(0);

    const rawControls = { jawOpeningFraction: 0.52, fingerChangeFraction: 0.35 };
    const invertedRes = applyClaimConstraintModifications(PATENT_ID, rawControls, { 1: false });
    expect(invertedRes.activeFailures.length).toBeGreaterThan(0);
    expect(invertedRes.modifiedParams.claim1TopologyEnabled).toBe(0);
    expect(invertedRes.modifiedParams.jawOpeningFraction).toBe(rawControls.jawOpeningFraction);
    expect(invertedRes.modifiedParams.fingerChangeFraction).toBe(rawControls.fingerChangeFraction);
    expect(invertedRes.refusalWarning).toContain("SOURCE BOUNDARY");
  });
});
