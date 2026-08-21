import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { multiTouchArchivalEdition } from "@/data/editions/multiTouchEdition";
import { multiTouchPatent } from "@/data/patents/multitouch";

const PINNED_SHA256 = "9b29747e60aad27302671e1be32fda99680c474d4e3a5ce0ffc93201460bfe1c";

describe("US 7,479,949 Apple Multi-Touch Heuristics Archival Edition Contract", () => {
  test("is a valid, complete manual edition of US 7,479,949", () => {
    const result = validateCuratedSpecificationEdition(multiTouchArchivalEdition);
    expect(result).toEqual({
      valid: true,
      errors: [],
    });
    expect(multiTouchPatent.archivalEdition).toBe(multiTouchArchivalEdition);
    expect(multiTouchPatent.originalTextAsset).toBeDefined();
  });

  test("pinned PDF SHA-256 matches archival edition", () => {
    expect(multiTouchArchivalEdition.sourcePdfSha256).toBe(PINNED_SHA256);
    const pdfPath = path.join(
      process.cwd(),
      "public",
      "patents",
      "pdfs",
      "us-7479949-multitouch.pdf",
    );
    expect(fs.existsSync(pdfPath)).toBe(true);
    const diskSha = createHash("sha256").update(fs.readFileSync(pdfPath)).digest("hex");
    expect(diskSha).toBe(PINNED_SHA256);
  });

  test("contains all 20 printed claims exactly matching manual claim text", () => {
    const claims = multiTouchArchivalEdition.blocks.filter((b) => b.kind === "claim");
    expect(claims.length).toBe(20);

    for (let i = 1; i <= 20; i++) {
      const claim = claims.find((c) => c.number === i);
      expect(claim).toBeDefined();
    }
  });

  test("all figure preview assets exist on disk with exact pixel dimensions", () => {
    const figurePreviews = multiTouchArchivalEdition.blocks.flatMap((block) => {
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
      "us-7479949-multitouch-reviewed.txt",
    );
    expect(fs.existsSync(transcriptPath)).toBe(true);
    const content = fs.readFileSync(transcriptPath, "utf-8");
    const matches = content.match(/--- REVIEWED TRANSCRIPTION PAGE \d+ OF 364 ---/g);
    expect(matches).toBeDefined();
    expect(matches?.length).toBe(364);
  });
});
