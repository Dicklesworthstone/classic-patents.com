import { describe, expect, test } from "bun:test";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { createHash } from "node:crypto";
import {
  maimanRubyLaserArchivalEdition,
  manualMaimanClaimText,
  maimanRubyLaserParallelReadings,
} from "./maimanRubyLaserEdition";

describe("US 3,353,115 Theodore H. Maiman Ruby Laser Archival Edition publication contract", () => {
  const root = process.cwd();
  const pdfPath = join(root, "public", maimanRubyLaserArchivalEdition.sourcePdfPath);
  const ledgerPath = join(root, "public", maimanRubyLaserArchivalEdition.reviewedLedgerPath);

  test("pins the immutable facsimile PDF with matching lowercase SHA-256", () => {
    expect(existsSync(pdfPath)).toBe(true);
    const pdfBytes = readFileSync(pdfPath);
    const digest = createHash("sha256").update(pdfBytes).digest("hex");
    expect(digest).toBe(maimanRubyLaserArchivalEdition.sourcePdfSha256);
    expect(digest).toBe("3222cc08d6662719dba7566e07f96f3d1687dda40d6fe213ac9993ceb1ba03e6");
  });

  test("verifies reviewed transcript ledger exists with 10-page markers", () => {
    expect(existsSync(ledgerPath)).toBe(true);
    const ledger = readFileSync(ledgerPath, "utf8");
    for (let p = 1; p <= 10; p++) {
      expect(ledger).toContain(`--- REVIEWED TRANSCRIPTION PAGE ${p} OF 10 ---`);
    }
  });

  test("contains all 2 printed claims matching the reviewed ledger text", () => {
    const claims = maimanRubyLaserArchivalEdition.blocks.filter((b) => b.kind === "claim");
    expect(claims.length).toBe(2);
    expect(claims.map((c) => c.number)).toEqual([1, 2]);

    const claim1Text = manualMaimanClaimText(1);
    const claim2Text = manualMaimanClaimText(2);

    expect(claim1Text).toContain("three energy level laser");
    expect(claim1Text).toContain("population inversion");
    expect(claim1Text).toContain("interferometer means");

    expect(claim2Text).toContain("three energy level ruby laser system");
    expect(claim2Text).toContain("radiationless energy transition");
    expect(claim2Text).toContain("light-resonating means");
  });

  test("verifies figure references point to existing cropped assets", () => {
    for (const block of maimanRubyLaserArchivalEdition.blocks) {
      if (block.kind === "paragraph") {
        for (const inline of block.inlines) {
          if (inline.kind === "figure-ref") {
            const figPath = join(root, "public", inline.preview.src);
            expect(existsSync(figPath)).toBe(true);
          }
        }
      }
    }
  });

  test("maps every block to an explicit parallel reading", () => {
    maimanRubyLaserArchivalEdition.blocks.forEach((_, idx) => {
      const readings = maimanRubyLaserParallelReadings[idx];
      expect(readings).toBeDefined();
      expect(readings.length).toBeGreaterThan(0);
      expect(readings[0].trim().length).toBeGreaterThan(15);
    });
  });
});
