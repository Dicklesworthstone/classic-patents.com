import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { roombaArchivalEdition } from "@/data/editions/roombaEdition";
import { manualClaimText, roombaPatent } from "@/data/patents/roomba";

const PINNED_SHA256 = "66133fab282d46a32c5e5228d9207bcce1d2b49db90d627325592964fe4d5a3e";

describe("US 6,594,844 iRobot Roomba Archival Edition Contract", () => {
  test("is a valid, complete manual edition of US 6,594,844", () => {
    const result = validateCuratedSpecificationEdition(roombaArchivalEdition);
    expect(result).toEqual({
      valid: true,
      errors: [],
    });
    expect(roombaPatent.archivalEdition).toBe(roombaArchivalEdition);
    expect(roombaPatent.originalTextAsset).toBeDefined();
    expect(roombaPatent.inventors).toEqual(["Joseph L. Jones"]);
    expect(roombaPatent.filingDate).toBe("2001-01-24");
  });

  test("pinned PDF SHA-256 matches archival edition", () => {
    expect(roombaArchivalEdition.sourcePdfSha256).toBe(PINNED_SHA256);
    const pdfPath = path.join(process.cwd(), "public", "patents", "pdfs", "us-6594844-roomba.pdf");
    expect(fs.existsSync(pdfPath)).toBe(true);
    const diskSha = createHash("sha256").update(fs.readFileSync(pdfPath)).digest("hex");
    expect(diskSha).toBe(PINNED_SHA256);
  });

  test("contains all 20 printed claims exactly matching manual claim text", () => {
    const claims = roombaArchivalEdition.blocks.filter((b) => b.kind === "claim");
    expect(claims.length).toBe(20);

    for (let i = 1; i <= 20; i++) {
      const claim = claims.find((c) => c.number === i);
      expect(claim).toBeDefined();
      expect(roombaPatent.claims.find((candidate) => candidate.number === i)?.originalText).toBe(
        manualClaimText(i),
      );
    }
  });

  test("all figure preview assets exist on disk with exact pixel dimensions", () => {
    const figurePreviews = roombaArchivalEdition.blocks.flatMap((block) => {
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
      "us-6594844-roomba-reviewed.txt",
    );
    expect(fs.existsSync(transcriptPath)).toBe(true);
    const content = fs.readFileSync(transcriptPath, "utf-8");
    const matches = content.match(/--- REVIEWED TRANSCRIPTION PAGE \d+ OF 26 ---/g);
    expect(matches).toBeDefined();
    expect(matches?.length).toBe(26);
  });
});
