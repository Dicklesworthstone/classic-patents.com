import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { pagerankArchivalEdition } from "@/data/editions/pagerankEdition";
import { pagerankPatent } from "@/data/patents/pagerank";

const PINNED_SHA256 = "c2e024116b9411385aa9cb5d51d3eb34b99f59db190c2bb9298d9d6d6eeed2e4";

describe("US 6,285,999 Google PageRank Archival Edition Contract", () => {
  test("is a valid, complete manual edition of US 6,285,999", () => {
    const result = validateCuratedSpecificationEdition(pagerankArchivalEdition);
    expect(result).toEqual({
      valid: true,
      errors: [],
    });
    expect(pagerankPatent.archivalEdition).toBe(pagerankArchivalEdition);
    expect(pagerankPatent.originalTextAsset).toBeDefined();
  });

  test("pinned PDF SHA-256 matches archival edition", () => {
    expect(pagerankArchivalEdition.sourcePdfSha256).toBe(PINNED_SHA256);
    const pdfPath = path.join(
      process.cwd(),
      "public",
      "patents",
      "pdfs",
      "us-6285999-pagerank.pdf",
    );
    expect(fs.existsSync(pdfPath)).toBe(true);
    const diskSha = createHash("sha256").update(fs.readFileSync(pdfPath)).digest("hex");
    expect(diskSha).toBe(PINNED_SHA256);
  });

  test("contains all 29 printed claims exactly matching manual claim text", () => {
    const claims = pagerankArchivalEdition.blocks.filter((b) => b.kind === "claim");
    expect(claims.length).toBe(29);

    for (let i = 1; i <= 29; i++) {
      const claim = claims.find((c) => c.number === i);
      expect(claim).toBeDefined();
    }
  });

  test("all figure preview assets exist on disk with exact pixel dimensions", () => {
    const figurePreviews = pagerankArchivalEdition.blocks.flatMap((block) => {
      if (block.kind === "paragraph") {
        return block.inlines.flatMap((inline) =>
          inline.kind === "reference" && inline.referenceType === "figure"
            ? (inline.figurePreviews ?? [])
            : [],
        );
      }
      return [];
    });

    expect(figurePreviews.length).toBeGreaterThanOrEqual(3);

    for (const preview of figurePreviews) {
      const relPath = preview.src.replace(/^\//, "");
      const fullPath = path.join(process.cwd(), "public", relPath);
      expect(fs.existsSync(fullPath)).toBe(true);

      const buf = fs.readFileSync(fullPath);
      const width = buf.readUInt32BE(16);
      const height = buf.readUInt32BE(20);

      expect(preview.width).toBe(width);
      expect(preview.height).toBe(height);
    }
  });

  test("reviewed transcript ledger exists and contains page markers", () => {
    const transcriptPath = path.join(
      process.cwd(),
      "public",
      "patents",
      "transcripts",
      "us-6285999-pagerank-reviewed.txt",
    );
    expect(fs.existsSync(transcriptPath)).toBe(true);
    const content = fs.readFileSync(transcriptPath, "utf-8");
    const matches = content.match(/--- REVIEWED TRANSCRIPTION PAGE \d+ OF 12 ---/g);
    expect(matches).toBeDefined();
    expect(matches?.length).toBe(12);
  });
});
