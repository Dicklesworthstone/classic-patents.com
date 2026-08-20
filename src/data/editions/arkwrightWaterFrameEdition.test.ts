import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  ARKWRIGHT_WATER_FRAME_PARALLEL_READINGS,
  arkwrightWaterFrameArchivalEdition,
  manualArkwrightClaimText,
} from "./arkwrightWaterFrameEdition";

describe("Richard Arkwright Water Frame Archival Edition Publication Contract", () => {
  const root = process.cwd();
  const pdfPath = resolve(root, "public/patents/pdfs/gb-931-arkwright-water-frame.pdf");
  const cropPath = resolve(
    root,
    "public/patents/figures/gb-931-arkwright-water-frame/fig-1-source-crop-v1.png",
  );
  const ledgerPath = resolve(
    root,
    "public/patents/transcripts/gb-931-arkwright-water-frame-reviewed.txt",
  );

  test("pins the immutable source PDF and matches SHA-256 digest", () => {
    expect(existsSync(pdfPath)).toBe(true);
    const pdfBuf = readFileSync(pdfPath);
    const digest = createHash("sha256").update(pdfBuf).digest("hex");
    expect(digest).toBe(arkwrightWaterFrameArchivalEdition.sourcePdfSha256);
    expect(digest).toBe("3254894ae66cb4ddd2612d164e24af76f5efa8ee8ac6b741c8affc70d8fe62fd");
  });

  test("confirms figure crop file exists on disk and is non-empty", () => {
    expect(existsSync(cropPath)).toBe(true);
    const stat = readFileSync(cropPath);
    expect(stat.length).toBeGreaterThan(10000);
  });

  test("confirms reviewed transcript ledger exists and contains page markers", () => {
    expect(existsSync(ledgerPath)).toBe(true);
    const content = readFileSync(ledgerPath, "utf-8");
    expect(content).toContain("--- REVIEWED TRANSCRIPTION PAGE 1 OF 2 ---");
    expect(content).toContain("--- REVIEWED TRANSCRIPTION PAGE 2 OF 2 ---");
    expect(content).toContain("RICHARD ARKWRIGHT");
    expect(content).toContain("Drawing out and attenuating cotton");
  });

  test("exposes all 4 claims via dynamic single-source lookup", () => {
    for (let c = 1; c <= 4; c++) {
      const claimText = manualArkwrightClaimText(c);
      expect(claimText).toBeDefined();
      expect(claimText.length).toBeGreaterThan(30);
    }
  });

  test("validates parallel readings map covers the archival blocks", () => {
    const _paragraphs = arkwrightWaterFrameArchivalEdition.blocks
      .map((block, idx) => ({ block, idx }))
      .filter(({ block }) => block.kind === "paragraph");
    const keys = Object.keys(ARKWRIGHT_WATER_FRAME_PARALLEL_READINGS).map(Number);
    expect(keys.length).toBeGreaterThanOrEqual(8);
    for (const key of keys) {
      const block = arkwrightWaterFrameArchivalEdition.blocks[key];
      expect(block).toBeDefined();
      const readings = ARKWRIGHT_WATER_FRAME_PARALLEL_READINGS[key];
      expect(readings.length).toBeGreaterThan(0);
      expect(readings[0].length).toBeGreaterThan(20);
    }
  });
});
