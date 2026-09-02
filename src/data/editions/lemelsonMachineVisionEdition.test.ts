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

  test("pins ledger, authored source crops, terms, and non-lossy parallel readings", () => {
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

    // Verify all 10 figure sheet crops exist on disk
    for (let i = 1; i <= 10; i++) {
      const cropPath = join(
        ROOT,
        `public/patents/figures/us-3081379-lemelson-machine-vision/fig-${i}-source-crop-v1.png`,
      );
      expect(existsSync(cropPath)).toBe(true);
    }

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
});
