import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { davinciArchivalEdition } from "@/data/editions/daVinciEdition";
import { daVinciPatent } from "@/data/patents/davinci";

const PINNED_SHA256 = "ff8eef36d94ec5ec3ec01038b7145030caf617ea018fcde9f00df6380beb3d91";

describe("US 6,331,181 Intuitive Surgical Da Vinci Archival Edition Contract", () => {
  test("is a valid, complete manual edition of US 6,331,181", () => {
    const result = validateCuratedSpecificationEdition(davinciArchivalEdition);
    expect(result).toEqual({
      valid: true,
      errors: [],
    });
    expect(daVinciPatent.archivalEdition).toBe(davinciArchivalEdition);
    expect(daVinciPatent.originalTextAsset).toBeDefined();
  });

  test("pinned PDF SHA-256 matches archival edition", () => {
    expect(davinciArchivalEdition.sourcePdfSha256).toBe(PINNED_SHA256);
    const pdfPath = path.join(process.cwd(), "public", "patents", "pdfs", "us-6331181-davinci.pdf");
    expect(fs.existsSync(pdfPath)).toBe(true);
    const diskSha = createHash("sha256").update(fs.readFileSync(pdfPath)).digest("hex");
    expect(diskSha).toBe(PINNED_SHA256);
  });

  test("contains all 28 printed claims exactly matching manual claim text", () => {
    const claims = davinciArchivalEdition.blocks.filter((b) => b.kind === "claim");
    expect(claims.length).toBe(28);

    for (let i = 1; i <= 28; i++) {
      const claim = claims.find((c) => c.number === i);
      expect(claim).toBeDefined();
    }
  });

  test("all figure preview assets exist on disk with exact pixel dimensions", () => {
    const figurePreviews = davinciArchivalEdition.blocks.flatMap((block) => {
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
      "us-6331181-davinci-reviewed.txt",
    );
    expect(fs.existsSync(transcriptPath)).toBe(true);
    const content = fs.readFileSync(transcriptPath, "utf-8");
    const matches = content.match(/--- REVIEWED TRANSCRIPTION PAGE \d+ OF 34 ---/g);
    expect(matches).toBeDefined();
    expect(matches?.length).toBe(34);
  });
});
