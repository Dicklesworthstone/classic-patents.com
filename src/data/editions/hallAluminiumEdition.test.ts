import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  HALL_ALUMINIUM_PARALLEL_READINGS,
  hallAluminiumArchivalEdition,
  manualHallClaimText,
} from "./hallAluminiumEdition";

describe("Charles Martin Hall US 400,766 Archival Edition Contract", () => {
  const rootDir = process.cwd();
  const expectedSha256 = "8a9cda34caaa0426bc62d75ca3910cab636c9f0329cb2f6193019c95c5d94791";

  test("pins the immutable source PDF and matches SHA-256 digest", () => {
    const pdfPath = resolve(rootDir, "public/patents/pdfs/us-400766-hall-aluminium.pdf");
    expect(existsSync(pdfPath)).toBe(true);

    const fileBuffer = readFileSync(pdfPath);
    const actualSha256 = createHash("sha256").update(fileBuffer).digest("hex");
    expect(actualSha256).toBe(expectedSha256);
    expect(hallAluminiumArchivalEdition.sourcePdfSha256).toBe(expectedSha256);
  });

  test("confirms figure crop files exist on disk with matching dimensions", () => {
    const figures = [
      {
        path: "public/patents/figures/us-400766-hall-aluminium/fig-1-source-crop-v1.png",
        width: 1630,
        height: 1360,
      },
      {
        path: "public/patents/figures/us-400766-hall-aluminium/fig-2-source-crop-v1.png",
        width: 1500,
        height: 960,
      },
    ];

    for (const fig of figures) {
      const fullPath = resolve(rootDir, fig.path);
      expect(existsSync(fullPath)).toBe(true);
    }
  });

  test("confirms reviewed transcript ledger exists and contains page markers", () => {
    const transcriptPath = resolve(
      rootDir,
      "public/patents/transcripts/us-400766-hall-aluminium-reviewed.txt",
    );
    expect(existsSync(transcriptPath)).toBe(true);

    const content = readFileSync(transcriptPath, "utf8");
    expect(content).toContain("--- REVIEWED TRANSCRIPTION PAGE 1 OF 3 ---");
    expect(content).toContain("--- REVIEWED TRANSCRIPTION PAGE 2 OF 3 ---");
    expect(content).toContain("--- REVIEWED TRANSCRIPTION PAGE 3 OF 3 ---");
    expect(content).toContain("CHARLES M. HALL");
    expect(content).toContain("400,766");
  });

  test("exposes all printed claims via dynamic single-source lookup", () => {
    const claim1 = manualHallClaimText(1);
    expect(claim1).toContain(
      "1. The process of reducing aluminium by electrolysis, which consists in dissolving alumina in a fused bath composed of the fluorides of aluminium and a metal more electro-positive than aluminium",
    );

    const claim2 = manualHallClaimText(2);
    expect(claim2).toContain(
      "2. The process of reducing aluminium by electrolysis, which consists in dissolving alumina in a fused bath composed of the fluorides of aluminium and sodium",
    );
  });

  test("validates parallel readings map covers the archival blocks", () => {
    const keys = Object.keys(HALL_ALUMINIUM_PARALLEL_READINGS).map(Number);
    expect(keys.length).toBeGreaterThanOrEqual(10);

    const paragraphIndexes = hallAluminiumArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );

    expect(keys.sort((a, b) => a - b)).toEqual(paragraphIndexes.sort((a, b) => a - b));

    for (const key of keys) {
      const block = hallAluminiumArchivalEdition.blocks[key];
      expect(block).toBeDefined();
      expect(block.kind).toBe("paragraph");
      const reading = HALL_ALUMINIUM_PARALLEL_READINGS[key];
      expect(reading).toBeDefined();
      expect(reading.length).toBeGreaterThan(0);
      expect(reading[0].trim().length).toBeGreaterThan(20);
    }
  });
});
