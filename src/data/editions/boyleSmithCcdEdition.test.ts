import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { boyleSmithCcdPatent } from "@/data/patents/boyle-smith-ccd";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";
import {
  boyleSmithCcdArchivalEdition,
  boyleSmithCcdClaimText,
  boyleSmithCcdClaimTexts,
  boyleSmithCcdParallelReadings,
} from "./boyleSmithCcdEdition";

describe("US 3,858,232 Willard S. Boyle & George E. Smith Charge-Coupled Devices Archival Edition Publication Contract", () => {
  const root = process.cwd();

  test("matches the cryptographic SHA-256 digest of the pinned 19-page USPTO facsimile PDF", () => {
    const pdfPath = join(root, "public/patents/pdfs/us-3858232-boyle-smith-ccd.pdf");
    expect(existsSync(pdfPath)).toBe(true);

    const hasher = new Bun.CryptoHasher("sha256");
    hasher.update(readFileSync(pdfPath));
    const digest = hasher.digest("hex");

    expect(digest).toBe("769ab5a1dc91d51bfeebea53b082de4d9b712deb41c096cdac41aae4d3142ec2");
    expect(boyleSmithCcdArchivalEdition.sourcePdfSha256).toBe(digest);
    expect(boyleSmithCcdPatent.originalTextAsset?.sourcePdfSha256).toBe(digest);
  });

  test("pins and validates the 19-page reviewed ledger transcript", () => {
    const ledgerPath = join(
      root,
      "public/patents/transcripts/us-3858232-boyle-smith-ccd-reviewed.txt",
    );
    expect(existsSync(ledgerPath)).toBe(true);

    const ledger = readFileSync(ledgerPath, "utf8");
    expect(validateReviewedTranscription(ledger, 19)).toEqual({ valid: true });
    expect(ledger).toContain("--- REVIEWED TRANSCRIPTION PAGE 1 OF 19 ---");
    expect(ledger).toContain("--- REVIEWED TRANSCRIPTION PAGE 19 OF 19 ---");
  });

  test("verifies all referenced source figure crops exist on disk", () => {
    const figureRefs = [
      "1a",
      "1b",
      "1c",
      "1d",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7a",
      "7b",
      "7c",
      "8",
      "9a",
      "9b",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
    ];

    for (const fig of figureRefs) {
      const figPath = join(
        root,
        `public/patents/figures/us-3858232-boyle-smith-ccd-fig-${fig}-preview.png`,
      );
      expect(existsSync(figPath)).toBe(true);
    }
  });

  test("exposes all 32 printed claims via dynamic single-source lookup", () => {
    expect(boyleSmithCcdClaimTexts.length).toBe(32);
    expect(boyleSmithCcdPatent.claims.length).toBe(32);

    for (let i = 1; i <= 32; i++) {
      const claimText = boyleSmithCcdClaimText(i);
      expect(claimText).toBeDefined();
      expect(claimText.length).toBeGreaterThan(20);
      expect(boyleSmithCcdPatent.claims[i - 1].originalText).toBe(claimText);
    }
  });

  test("validates parallel readings map covers the archival paragraph blocks", () => {
    const paragraphIndexes = boyleSmithCcdArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    const readingIndexes = Object.keys(boyleSmithCcdParallelReadings)
      .map(Number)
      .sort((a, b) => a - b);

    expect(readingIndexes).toEqual(paragraphIndexes);
  });
});
