import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { cortPuddlingRollingPatent } from "@/data/patents/cort-puddling-rolling";
import {
  CORT_PUDDLING_ROLLING_PARALLEL_READINGS,
  cortPuddlingRollingArchivalEdition,
} from "./cortPuddlingRollingEdition";

describe("Henry Cort GB 1420 source-identity hold", () => {
  const pdfPath = join(process.cwd(), "public/patents/pdfs/gb-1420-cort-puddling-rolling.pdf");
  const ledgerPath = join(
    process.cwd(),
    "public/patents/transcripts/gb-1420-cort-puddling-rolling-reviewed.txt",
  );

  test("pins the reconstruction fingerprint and keeps it out of the public source face", () => {
    expect(existsSync(pdfPath)).toBe(true);
    const buffer = readFileSync(pdfPath);
    const sha = createHash("sha256").update(buffer).digest("hex");
    expect(sha).toBe("b213e2bb7da843a3397d38f9be1126696512eed62fae9680147761566e40286f");
    expect(cortPuddlingRollingArchivalEdition.sourcePdfSha256).toBe(sha);
    expect(cortPuddlingRollingArchivalEdition.completeFacsimileReviewed).toBe(false);
    expect(cortPuddlingRollingArchivalEdition.claimStatus?.kind).toBe(
      "no-formal-claims-in-facsimile",
    );
    expect(cortPuddlingRollingArchivalEdition.drawingStatus?.kind).toBe("no-drawings-in-facsimile");
    expect(cortPuddlingRollingPatent.archivalEdition).toBeUndefined();
    expect(cortPuddlingRollingPatent.originalTextAsset).toBeUndefined();
  });

  test("retains the staged secondary witness and its page markers", () => {
    expect(existsSync(ledgerPath)).toBe(true);
    const content = readFileSync(ledgerPath, "utf-8");
    expect(content).toContain("--- REVIEWED TRANSCRIPTION PAGE 1 OF 2 ---");
    expect(content).toContain("--- REVIEWED TRANSCRIPTION PAGE 2 OF 2 ---");
    expect(content).toContain("HENRY CORT");
    expect(content).toContain("reverberatory or air furnace");
    expect(content).toContain("[Printed, 3d. No Drawings.]");
    expect(content).not.toContain("CLAIMS AND ENROLLED DRAWINGS");
    expect(content).not.toContain("1. The method of converting");
  });

  test("exposes no unsupported claim nodes", () => {
    expect(cortPuddlingRollingPatent.claims).toEqual([]);
    expect(cortPuddlingRollingPatent.stats).toEqual({ totalClaims: 0, independentClaims: 0 });
    expect(cortPuddlingRollingArchivalEdition.blocks.filter((b) => b.kind === "claim")).toEqual([]);
  });

  test("validates parallel readings map covers the archival blocks", () => {
    const keys = Object.keys(CORT_PUDDLING_ROLLING_PARALLEL_READINGS).map(Number);
    expect(keys.length).toBeGreaterThanOrEqual(4);
    for (const key of keys) {
      const block = cortPuddlingRollingArchivalEdition.blocks[key];
      expect(block).toBeDefined();
      const readings = CORT_PUDDLING_ROLLING_PARALLEL_READINGS[key];
      expect(readings.length).toBeGreaterThan(0);
      expect(readings[0].length).toBeGreaterThan(20);
    }
  });
});
