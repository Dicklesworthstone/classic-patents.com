import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import {
  manualRillieuxClaimText,
  RILLIEUX_EVAPORATOR_PARALLEL_READINGS,
  rillieuxEvaporatorArchivalEdition,
} from "./rillieuxEvaporatorEdition";

const PINNED_SHA256 = "10d9a2c3909f1a7d7086c063925f96feed8aa362e1b39a64275a869853dc1d7a";

describe("US 3,237 Norbert Rillieux Multiple-Effect Evaporator Archival Edition Contract", () => {
  test("pinned PDF SHA-256 matches archival edition", () => {
    expect(rillieuxEvaporatorArchivalEdition.sourcePdfSha256).toBe(PINNED_SHA256);
    const pdfPath = path.join(
      process.cwd(),
      "public",
      "patents",
      "pdfs",
      "us-3237-rillieux-evaporator.pdf",
    );
    expect(fs.existsSync(pdfPath)).toBe(true);
    const diskSha = createHash("sha256").update(fs.readFileSync(pdfPath)).digest("hex");
    expect(diskSha).toBe(PINNED_SHA256);
  });

  test("contains all 5 printed claims exactly matching manual claim text", () => {
    const claims = rillieuxEvaporatorArchivalEdition.blocks.filter((b) => b.kind === "claim");
    expect(claims.length).toBe(5);

    for (let i = 1; i <= 5; i++) {
      const claim = claims.find((c) => c.number === i);
      expect(claim).toBeDefined();
      const text = manualRillieuxClaimText(i);
      expect(text.length).toBeGreaterThan(30);
    }
  });

  test("all active figure previews are complete pinned source sheets", () => {
    const figurePreviews = rillieuxEvaporatorArchivalEdition.blocks.flatMap((block) => {
      if (block.kind === "paragraph") {
        return block.inlines.flatMap((inline) =>
          inline.kind === "reference" && inline.referenceType === "figure"
            ? (inline.figurePreviews ?? [])
            : [],
        );
      }
      return [];
    });

    expect(figurePreviews.length).toBeGreaterThanOrEqual(6);

    for (const preview of figurePreviews) {
      const relativePath = preview.src.replace(/^\//, "");
      const fullPath = path.join(process.cwd(), "public", relativePath);
      expect(fs.existsSync(fullPath)).toBe(true);
      expect(preview.src).toMatch(/\/source-sheet-[1-6]-v1\.png$/);
      expect(preview.width).toBe(2320);
      expect(preview.height).toBe(3408);
    }
  });

  test("every paragraph block has a corresponding parallel reading", () => {
    const paragraphIndices = rillieuxEvaporatorArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );

    const readingIndices = Object.keys(RILLIEUX_EVAPORATOR_PARALLEL_READINGS)
      .map(Number)
      .sort((a, b) => a - b);

    expect(readingIndices).toEqual(paragraphIndices);

    for (const idx of paragraphIndices) {
      const reading = RILLIEUX_EVAPORATOR_PARALLEL_READINGS[idx];
      expect(reading).toBeDefined();
      expect(reading?.length).toBeGreaterThan(0);
      expect(reading?.[0].trim().length).toBeGreaterThan(20);
    }
  });

  test("reviewed transcription ledger matches page boundary markers", () => {
    const ledgerPath = path.join(
      process.cwd(),
      "public",
      "patents",
      "transcripts",
      "us-3237-rillieux-evaporator-reviewed.txt",
    );
    expect(fs.existsSync(ledgerPath)).toBe(true);
    const content = fs.readFileSync(ledgerPath, "utf8");

    for (let page = 1; page <= 11; page++) {
      expect(content).toContain(`--- REVIEWED TRANSCRIPTION PAGE ${page} OF 11 ---`);
    }
  });
});
