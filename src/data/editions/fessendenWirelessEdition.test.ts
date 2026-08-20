import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  fessendenWirelessArchivalEdition,
  fessendenWirelessParallelReadings,
  manualFessendenClaimText,
} from "./fessendenWirelessEdition";

describe("US 706,737 Reginald A. Fessenden Wireless Telegraphy Archival Edition Publication Contract", () => {
  const root = process.cwd();
  const pdfPath = resolve(root, "public/patents/pdfs/us-706737-fessenden-wireless.pdf");
  const ledgerPath = resolve(
    root,
    "public/patents/transcripts/us-706737-fessenden-wireless-reviewed.txt",
  );
  const figureCrops = [
    resolve(root, "public/patents/figures/us-706737-fessenden-wireless/fig-1-source-crop-v1.png"),
    resolve(root, "public/patents/figures/us-706737-fessenden-wireless/fig-2-source-crop-v1.png"),
    resolve(root, "public/patents/figures/us-706737-fessenden-wireless/fig-3-source-crop-v1.png"),
    resolve(root, "public/patents/figures/us-706737-fessenden-wireless/fig-4-source-crop-v1.png"),
    resolve(root, "public/patents/figures/us-706737-fessenden-wireless/fig-5-source-crop-v1.png"),
  ];

  test("pins the immutable source PDF and matches SHA-256 digest", () => {
    expect(existsSync(pdfPath)).toBe(true);
    const pdfBuf = readFileSync(pdfPath);
    const digest = createHash("sha256").update(pdfBuf).digest("hex");
    expect(digest).toBe(fessendenWirelessArchivalEdition.sourcePdfSha256);
    expect(digest).toBe("2098ec6d967d3ab7999da0fb96357328fa68bb8e7639c1863ac600547aff8887");
  });

  test("confirms all 5 figure crops exist on disk and are non-empty", () => {
    for (const cropPath of figureCrops) {
      expect(existsSync(cropPath)).toBe(true);
      const stat = readFileSync(cropPath);
      expect(stat.length).toBeGreaterThan(10000);
    }
  });

  test("confirms reviewed transcript ledger exists and contains all 7 page markers", () => {
    expect(existsSync(ledgerPath)).toBe(true);
    const content = readFileSync(ledgerPath, "utf-8");
    for (let p = 1; p <= 7; p++) {
      expect(content).toContain(`--- REVIEWED TRANSCRIPTION PAGE ${p} OF 7 ---`);
    }
    expect(content).toContain("REGINALD A. FESSENDEN");
    expect(content).toContain("WIRELESS TELEGRAPHY");
  });

  test("exposes all printed claims via dynamic single-source lookup", () => {
    for (let c = 1; c <= 5; c++) {
      const claimText = manualFessendenClaimText(c);
      expect(claimText).toBeDefined();
      expect(claimText.length).toBeGreaterThan(30);
    }
  });

  test("validates parallel readings map covers the archival paragraph blocks", () => {
    const paragraphs = fessendenWirelessArchivalEdition.blocks
      .map((block, idx) => ({ block, idx }))
      .filter(({ block }) => block.kind === "paragraph");

    const keys = Object.keys(fessendenWirelessParallelReadings).map(Number);
    expect(keys.length).toBe(paragraphs.length);

    for (const { idx } of paragraphs) {
      const readings = fessendenWirelessParallelReadings[idx];
      expect(readings).toBeDefined();
      expect(readings?.length).toBeGreaterThan(0);
      expect(readings?.[0]?.length).toBeGreaterThan(20);
    }
  });
});
