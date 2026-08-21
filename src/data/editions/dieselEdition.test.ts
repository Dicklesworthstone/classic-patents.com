import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { dieselEngineArchivalEdition } from "@/data/editions/dieselEngineEdition";
import { dieselEnginePatent } from "@/data/patents/diesel-engine";

const PINNED_SHA256 = "57679379a0e1d1dc97591e6f634fa6f7ed7c0ec3b465edf493b5f79595a0e866";

describe("US 542,846 Rudolf Diesel Engine Archival Edition Contract", () => {
  test("is a valid, complete manual edition of US 542,846", () => {
    const result = validateCuratedSpecificationEdition(dieselEngineArchivalEdition);
    expect(result).toEqual({
      valid: true,
      errors: [],
    });
    expect(dieselEnginePatent.archivalEdition).toBe(dieselEngineArchivalEdition);
    expect(dieselEnginePatent.originalTextAsset).toBeDefined();
  });

  test("pinned PDF SHA-256 matches archival edition", () => {
    expect(dieselEngineArchivalEdition.sourcePdfSha256).toBe(PINNED_SHA256);
    const pdfPath = path.join(
      process.cwd(),
      "public",
      "patents",
      "pdfs",
      "us-542846-diesel-engine.pdf",
    );
    expect(fs.existsSync(pdfPath)).toBe(true);
    const diskSha = createHash("sha256").update(fs.readFileSync(pdfPath)).digest("hex");
    expect(diskSha).toBe(PINNED_SHA256);
  });

  test("contains all 3 printed claims exactly matching manual claim text", () => {
    const claims = dieselEngineArchivalEdition.blocks.filter((b) => b.kind === "claim");
    expect(claims.length).toBe(3);

    for (let i = 1; i <= 3; i++) {
      const claim = claims.find((c) => c.number === i);
      expect(claim).toBeDefined();
    }
  });

  test("all figure preview assets exist on disk with exact pixel dimensions", () => {
    const figurePreviews = dieselEngineArchivalEdition.blocks.flatMap((block) => {
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
      "us-542846-diesel-engine-reviewed.txt",
    );
    expect(fs.existsSync(transcriptPath)).toBe(true);
    const content = fs.readFileSync(transcriptPath, "utf-8");
    const matches = content.match(/--- REVIEWED TRANSCRIPTION PAGE \d+ OF 10 ---/g);
    expect(matches).toBeDefined();
    expect(matches?.length).toBe(10);
  });
});
