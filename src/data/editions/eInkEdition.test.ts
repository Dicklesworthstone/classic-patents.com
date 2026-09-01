import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { einkArchivalEdition, manualClaimText } from "@/data/editions/eInkEdition";
import {
  archivalEditionForPublication,
  isArchivalEditionExplicitlyWithheld,
} from "@/data/editions/publicationApproval";
import { eInkPatent } from "@/data/patents/eink";

const PINNED_SHA256 = "574678473ca13e7daaeb661cfd96808fffb6c16d06d86872923fec52a08ab324";

describe("US 6,120,588 E-Ink Archival Edition Contract", () => {
  test("published edition keeps its valid typed shape in the served record", () => {
    const result = validateCuratedSpecificationEdition(einkArchivalEdition);
    expect(result).toEqual({
      valid: true,
      errors: [],
    });
    // Owner recalibration (2026-08-22): complete original texts publish even
    // with minor imperfections; holds are reserved for fabricated content.
    expect(isArchivalEditionExplicitlyWithheld(eInkPatent.id)).toBe(false);
    expect(archivalEditionForPublication(eInkPatent)).toBe(einkArchivalEdition);
    expect(eInkPatent.archivalEdition).toBe(einkArchivalEdition);
    expect(eInkPatent.originalTextAsset).toBeDefined();
  });

  test("pinned PDF SHA-256 matches archival edition", () => {
    expect(einkArchivalEdition.sourcePdfSha256).toBe(PINNED_SHA256);
    const pdfPath = path.join(process.cwd(), "public", "patents", "pdfs", "us-6120588-eink.pdf");
    expect(fs.existsSync(pdfPath)).toBe(true);
    const diskSha = createHash("sha256").update(fs.readFileSync(pdfPath)).digest("hex");
    expect(diskSha).toBe(PINNED_SHA256);
  });

  test("contains all 18 printed claims and keeps the record dynamically sourced", () => {
    const claims = einkArchivalEdition.blocks.filter((b) => b.kind === "claim");
    expect(claims.length).toBe(18);

    for (let i = 1; i <= 18; i++) {
      const claim = claims.find((c) => c.number === i);
      if (!claim) {
        throw new Error(`eInk manual edition is missing printed claim ${i}.`);
      }
      expect(manualClaimText(i)).toBe(claim.inlines.map((inline) => inline.text).join(""));
    }
  });

  test("all figure preview assets exist on disk with exact pixel dimensions", () => {
    const figurePreviews = einkArchivalEdition.blocks.flatMap((block) => {
      if (block.kind === "paragraph") {
        return block.inlines.flatMap((inline) =>
          inline.kind === "reference" && inline.referenceType === "figure"
            ? (inline.figurePreviews ?? [])
            : [],
        );
      }
      return [];
    });

    expect(figurePreviews.length).toBe(24);

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
      "us-6120588-eink-reviewed.txt",
    );
    expect(fs.existsSync(transcriptPath)).toBe(true);
    const content = fs.readFileSync(transcriptPath, "utf-8");
    const matches = content.match(/--- REVIEWED TRANSCRIPTION PAGE \d+ OF 26 ---/g);
    expect(matches).toBeDefined();
    expect(matches?.length).toBe(26);
  });
});
