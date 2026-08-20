import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  deForestAudionArchivalEdition,
  deForestAudionParallelReadings,
  manualDeForestClaimText,
} from "./deForestAudionEdition";

describe("US 879,532 Lee de Forest Audion Triode Archival Edition Publication Contract", () => {
  const rootDir = process.cwd();
  const pdfPath = join(rootDir, "public/patents/pdfs/us-879532-de-forest-audion.pdf");
  const transcriptPath = join(
    rootDir,
    "public/patents/transcripts/us-879532-de-forest-audion-reviewed.txt",
  );
  const fig1Path = join(
    rootDir,
    "public/patents/figures/us-879532-de-forest-audion/fig-1-source-crop-v1.png",
  );

  test("pins the immutable source PDF and matches SHA-256 digest", () => {
    expect(existsSync(pdfPath)).toBe(true);
    const buffer = readFileSync(pdfPath);
    const hash = createHash("sha256").update(buffer).digest("hex");
    expect(hash).toBe("3a37d70051d784a5a086d53b8d2d09f372b8bb14d40179b68b62a5c166e7876e");
    expect(deForestAudionArchivalEdition.sourcePdfSha256).toBe(hash);
  });

  test("verifies figure crops exist on disk for all edition figure references", () => {
    expect(existsSync(fig1Path)).toBe(true);
  });

  test("confirms reviewed transcript ledger exists and contains all 4 page markers", () => {
    expect(existsSync(transcriptPath)).toBe(true);
    const transcript = readFileSync(transcriptPath, "utf-8");
    for (let p = 1; p <= 4; p++) {
      expect(transcript).toContain(`--- REVIEWED TRANSCRIPTION PAGE ${p} OF 4 ---`);
    }
    expect(transcript).toContain("879,532");
    expect(transcript).toContain("LEE DE FOREST");
  });

  test("exposes all 21 printed claims via dynamic single-source lookup", () => {
    for (let c = 1; c <= 21; c++) {
      const claimText = manualDeForestClaimText(c);
      expect(claimText.length).toBeGreaterThan(20);
      expect(claimText).toContain("detector");
    }
  });

  test("validates parallel readings map covers all archival paragraph blocks", () => {
    const paragraphBlocks = deForestAudionArchivalEdition.blocks
      .map((b, idx) => ({ b, idx }))
      .filter(({ b }) => b.kind === "paragraph");

    for (const { idx } of paragraphBlocks) {
      const readings = deForestAudionParallelReadings[idx];
      expect(readings).toBeDefined();
      expect(readings?.length).toBeGreaterThan(0);
      expect(readings?.[0]?.length).toBeGreaterThan(25);
    }
  });
});
