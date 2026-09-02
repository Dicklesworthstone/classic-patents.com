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
const EXPECTED_PDF_SHA256 =
  "654ed8b094309e39412debba71117f177602c1557ade8d9865f834a1d9e84485";

describe("US 4,765,668 Robot End Effector Archival Edition Contract", () => {
  test("pins the complete 10-page primary facsimile and manual publication contract", () => {
    const pdfPath = resolve(
      process.cwd(),
      "public/patents/pdfs/us-4765668-robot-end-effector.pdf",
    );
    expect(existsSync(pdfPath)).toBe(true);

    const pdfBytes = readFileSync(pdfPath);
    const pdfDigest = createHash("sha256").update(pdfBytes).digest("hex");
    expect(pdfDigest).toBe(EXPECTED_PDF_SHA256);
    expect(robotEndEffectorArchivalEdition.sourcePdfSha256).toBe(EXPECTED_PDF_SHA256);
    expect(robotEndEffectorPatent.originalTextAsset?.sourcePdfSha256).toBe(
      EXPECTED_PDF_SHA256,
    );
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

  test("pins source crops, technical term annotations, and parallel readings", () => {
    for (let figNum = 1; figNum <= 6; figNum++) {
      const cropPath = resolve(
        process.cwd(),
        `public/patents/figures/us-4765668-robot-end-effector/fig-${figNum}-source-crop-v1.png`,
      );
      expect(existsSync(cropPath)).toBe(true);
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
});
