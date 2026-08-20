import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  haberAmmoniaArchivalEdition,
  haberAmmoniaParallelReadings,
  manualHaberClaimText,
} from "./haberAmmoniaEdition";

describe("US 971,501 Fritz Haber Production of Ammonia Archival Edition Publication Contract", () => {
  const rootDir = process.cwd();
  const pdfPath = join(rootDir, "public/patents/pdfs/us-971501-haber-ammonia.pdf");
  const transcriptPath = join(
    rootDir,
    "public/patents/transcripts/us-971501-haber-ammonia-reviewed.txt",
  );

  test("pins the immutable source PDF and matches SHA-256 digest", () => {
    expect(existsSync(pdfPath)).toBe(true);
    const buffer = readFileSync(pdfPath);
    const hash = createHash("sha256").update(buffer).digest("hex");
    expect(hash).toBe("59592a18d6dd7208c2d55ce1f6e4e09a0437635b0faa9959d49a95b64d741124");
    expect(haberAmmoniaArchivalEdition.sourcePdfSha256).toBe(hash);
  });

  test("records the source-true absence of separate drawing sheets in US 971,501", () => {
    expect(haberAmmoniaArchivalEdition.drawingStatus).toBeDefined();
    expect(haberAmmoniaArchivalEdition.drawingStatus?.kind).toBe("no-drawings-in-facsimile");
    expect(haberAmmoniaArchivalEdition.drawingStatus?.evidence).toContain("No Drawing");
  });

  test("confirms reviewed transcript ledger exists and contains page marker", () => {
    expect(existsSync(transcriptPath)).toBe(true);
    const transcript = readFileSync(transcriptPath, "utf-8");
    expect(transcript).toContain("--- REVIEWED TRANSCRIPTION PAGE 1 OF 1 ---");
    expect(transcript).toContain("971,501.");
    expect(transcript).toContain("FRITZ HABER");
    expect(transcript).toContain("ROBERT LE ROSSIGNOL");
  });

  test("exposes all printed claims via dynamic single-source lookup", () => {
    for (let c = 1; c <= 6; c++) {
      const claimText = manualHaberClaimText(c);
      expect(claimText.length).toBeGreaterThan(20);
      expect(claimText).toContain("osmium");
    }
  });

  test("validates parallel readings map covers the archival paragraph blocks", () => {
    const paragraphBlocks = haberAmmoniaArchivalEdition.blocks
      .map((b, idx) => ({ b, idx }))
      .filter(({ b }) => b.kind === "paragraph");

    for (const { idx } of paragraphBlocks) {
      const readings = haberAmmoniaParallelReadings[idx];
      expect(readings).toBeDefined();
      expect(readings?.length).toBeGreaterThan(0);
      expect(readings?.[0]?.length).toBeGreaterThan(25);
    }
  });
});
