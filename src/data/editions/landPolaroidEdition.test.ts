// @ts-nocheck -- This tests an unpublished source-authoring draft kept fail-closed.
import { describe, expect, it } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  landPolaroidArchivalEdition,
  landPolaroidParallelReadings,
  manualLandClaimText,
} from "./landPolaroidEdition";

describe("US 2,543,181 Edwin Land Polaroid Archival Edition Publication Contract", () => {
  it("verifies cryptographic PDF SHA-256 and metadata invariants", () => {
    expect(landPolaroidArchivalEdition.kind).toBe("manual-react-edition");
    expect(landPolaroidArchivalEdition.sourcePdfSha256).toBe(
      "4ee20338289f545608f472c50aa6ba8a7134f08fa377f1887e81f1e9bb5d4013",
    );
    expect(landPolaroidArchivalEdition.completeFacsimileReviewed).toBe(true);
  });

  it("verifies all 116 printed claims exist and are retrievable via manualLandClaimText", () => {
    for (let c = 1; c <= 116; c++) {
      const claimText = manualLandClaimText(c);
      expect(claimText).toBeDefined();
      expect(claimText.length).toBeGreaterThan(10);
    }
  });

  it("verifies drawing crops exist on disk", () => {
    const figDir = join(process.cwd(), "public/patents/figures/us-2543181-land-polaroid");
    for (let f = 1; f <= 5; f++) {
      const figPath = join(figDir, `fig-${f}-source-crop-v1.png`);
      expect(existsSync(figPath)).toBe(true);
    }
  });

  it("verifies reviewed ledger markers in public transcript asset", () => {
    const ledgerPath = join(
      process.cwd(),
      "public/patents/transcripts/us-2543181-land-polaroid-reviewed.txt",
    );
    expect(existsSync(ledgerPath)).toBe(true);
    const text = readFileSync(ledgerPath, "utf-8");
    expect(text).toContain("--- REVIEWED TRANSCRIPTION PAGE 1 OF 32 ---");
    expect(text).toContain("--- REVIEWED TRANSCRIPTION PAGE 32 OF 32 ---");
  });

  it("verifies parallel readings are registered", () => {
    for (const [idxStr, readings] of Object.entries(landPolaroidParallelReadings)) {
      const idx = Number(idxStr);
      expect(landPolaroidArchivalEdition.blocks[idx]).toBeDefined();
      expect(readings.length).toBeGreaterThan(0);
      expect(readings[0].trim().length).toBeGreaterThan(20);
    }
  });
});
