import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { hewittMercuryLampPatent } from "../patents/hewitt-mercury-lamp";
import {
  hewittMercuryLampArchivalEdition,
  hewittMercuryLampParallelReadings,
  manualHewittClaimText,
} from "./hewittMercuryLampEdition";

describe("US 682,690 Peter Cooper Hewitt Electric Lamp Archival Edition Publication Contract", () => {
  const rootDir = process.cwd();
  const pdfPath = join(rootDir, "public/patents/pdfs/us-682690-hewitt-mercury-lamp.pdf");
  const transcriptPath = join(
    rootDir,
    "public/patents/transcripts/us-682690-hewitt-mercury-lamp-reviewed.txt",
  );
  const fig1Path = join(
    rootDir,
    "public/patents/figures/us-682690-hewitt-mercury-lamp/fig-1-source-crop-v1.png",
  );
  const fig4Path = join(
    rootDir,
    "public/patents/figures/us-682690-hewitt-mercury-lamp/fig-4-source-crop-v1.png",
  );

  test("publishes the verified archival edition in the catalog record", () => {
    expect(hewittMercuryLampPatent.archivalEdition).toBe(hewittMercuryLampArchivalEdition);
    expect(hewittMercuryLampPatent.originalTextAsset).toBeDefined();
  });

  test("pins the immutable source PDF and matches SHA-256 digest", () => {
    expect(existsSync(pdfPath)).toBe(true);
    const buffer = readFileSync(pdfPath);
    const hash = createHash("sha256").update(buffer).digest("hex");
    expect(hash).toBe("bd849330e1ed6e530d0654413016c7e77eda792d0519628ca1bae5747065c74d");
    expect(hewittMercuryLampArchivalEdition.sourcePdfSha256).toBe(hash);
  });

  test("verifies figure crops exist on disk for all edition figure references", () => {
    expect(existsSync(fig1Path)).toBe(true);
    expect(existsSync(fig4Path)).toBe(true);
  });

  test("confirms reviewed transcript ledger exists and contains page markers", () => {
    expect(existsSync(transcriptPath)).toBe(true);
    const transcript = readFileSync(transcriptPath, "utf-8");
    expect(transcript).toContain("--- REVIEWED TRANSCRIPTION PAGE 1 OF 13 ---");
    expect(transcript).toContain("682,690");
    expect(transcript).toContain("PETER COOPER HEWITT");
  });

  test("exposes all printed claims via dynamic single-source lookup", () => {
    for (let c = 1; c <= 31; c++) {
      const claimText = manualHewittClaimText(c);
      expect(claimText.length).toBeGreaterThan(20);
    }
  });

  test("validates parallel readings map covers the archival paragraph blocks", () => {
    const paragraphBlocks = hewittMercuryLampArchivalEdition.blocks
      .map((b, idx) => ({ b, idx }))
      .filter(({ b }) => b.kind === "paragraph");

    for (const { idx } of paragraphBlocks) {
      const readings = hewittMercuryLampParallelReadings[idx];
      expect(readings).toBeDefined();
      expect(readings?.length).toBeGreaterThan(0);
      expect(readings?.[0]?.length).toBeGreaterThan(25);
    }
  });
});
