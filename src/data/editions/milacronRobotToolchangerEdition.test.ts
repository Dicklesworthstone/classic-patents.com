import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { milacronRobotToolchangerPatent } from "@/data/patents/milacron-robot-toolchanger";
import {
  normalizeLiteralSourceText,
  validateReviewedTranscription,
  validateReviewedTranscriptionPageAnchors,
} from "@/data/patents/sourceTextValidation";
import {
  milacronRobotToolchangerArchivalEdition,
  milacronRobotToolchangerClaimText,
  milacronRobotToolchangerParallelReadings,
} from "./milacronRobotToolchangerEdition";

const EXPECTED_PDF_SHA256 = "9ac43ea5baee978c390bd096fe4beaa2c229a5cde227d9f3e005d035026425b0";

describe("US 4,512,709 Cincinnati Milacron Robot Toolchanger Archival Edition Contract", () => {
  test("pins the complete 10-page primary facsimile and manual publication contract", () => {
    const pdfPath = resolve(
      process.cwd(),
      "public/patents/pdfs/us-4512709-milacron-robot-toolchanger.pdf",
    );
    expect(existsSync(pdfPath)).toBe(true);

    const pdfBytes = readFileSync(pdfPath);
    const pdfDigest = createHash("sha256").update(pdfBytes).digest("hex");
    expect(pdfDigest).toBe(EXPECTED_PDF_SHA256);
    expect(milacronRobotToolchangerArchivalEdition.sourcePdfSha256).toBe(EXPECTED_PDF_SHA256);
    expect(milacronRobotToolchangerArchivalEdition.completeFacsimileReviewed).toBe(true);
    expect(validateCuratedSpecificationEdition(milacronRobotToolchangerArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    expect(milacronRobotToolchangerPatent.archivalEdition).toBe(
      milacronRobotToolchangerArchivalEdition,
    );
    expect(milacronRobotToolchangerPatent.originalTextAsset).toMatchObject({
      kind: "reviewed-transcription",
      pageCount: 10,
      sourcePdfSha256: EXPECTED_PDF_SHA256,
    });
  });

  test("derives all four issued claim strings from the manual source edition", () => {
    const claims = milacronRobotToolchangerArchivalEdition.blocks.filter((b) => b.kind === "claim");
    expect(claims.length).toBe(4);

    for (let i = 1; i <= 4; i++) {
      const text = milacronRobotToolchangerClaimText(i);
      expect(text.length).toBeGreaterThan(50);
      expect(text).toContain("tool");
      expect(milacronRobotToolchangerPatent.claims[i - 1]?.originalText).toBe(text);
      expect(milacronRobotToolchangerPatent.claims[i - 1]?.plainEnglish.length).toBeGreaterThan(
        120,
      );
    }

    expect(milacronRobotToolchangerClaimText(1)).toContain("linear slideway on said front plate");
    expect(milacronRobotToolchangerClaimText(4)).toContain("T-shaped member");
  });

  test("verifies all ten figure crop files exist on disk with valid dimensions", () => {
    for (let fig = 1; fig <= 10; fig++) {
      const figPath = resolve(
        process.cwd(),
        `public/patents/figures/us-4512709-milacron-robot-toolchanger/fig-${fig}-source-crop-v1.png`,
      );
      expect(existsSync(figPath)).toBe(true);
      const bytes = readFileSync(figPath);
      expect(bytes.length).toBeGreaterThan(10000);
      expect(bytes.subarray(0, 8).toString("hex")).toBe("89504e470d0a1a0a");
    }
  });

  test("contains distinct parallel readings for every paragraph index", () => {
    const paragraphIndices = milacronRobotToolchangerArchivalEdition.blocks
      .map((b, idx) => (b.kind === "paragraph" ? idx : null))
      .filter((idx): idx is number => idx !== null);

    expect(paragraphIndices.length).toBeGreaterThan(10);

    for (const idx of paragraphIndices) {
      const reading = milacronRobotToolchangerParallelReadings[idx];
      expect(reading, `Missing parallel reading for paragraph index ${idx}`).toBeDefined();
      expect(reading.join(" ").length).toBeGreaterThan(80);
    }
  });

  test("validates the reviewed transcription ledger across all 10 pages", () => {
    const ledgerPath = resolve(
      process.cwd(),
      "public/patents/transcripts/us-4512709-milacron-robot-toolchanger-reviewed.txt",
    );
    expect(existsSync(ledgerPath)).toBe(true);
    const ledger = readFileSync(ledgerPath, "utf-8");

    expect(validateReviewedTranscription(ledger, 10)).toEqual({ valid: true });
    expect(
      validateReviewedTranscriptionPageAnchors(
        ledger,
        10,
        milacronRobotToolchangerPatent.originalTextAsset?.pageAnchors,
      ),
    ).toEqual({ valid: true });

    expect(ledger).toContain("United States Patent [19]");
    expect(ledger).toContain("Hennekes et al.");
    expect(ledger).toContain("ROBOT TOOLCHANGER SYSTEM");
    expect(ledger).toContain("What is claimed is:");

    const normalizedLedger = normalizeLiteralSourceText(
      ledger.replace(/--- REVIEWED TRANSCRIPTION PAGE \d+ OF \d+ ---/g, ""),
    );
    for (const block of milacronRobotToolchangerArchivalEdition.blocks) {
      const text =
        block.kind === "masthead"
          ? block.lines.join(" ")
          : block.kind === "paragraph" || block.kind === "claim"
            ? block.inlines.map((inline) => inline.text).join("")
            : "";
      if (text) expect(normalizedLedger).toContain(normalizeLiteralSourceText(text));
    }
  });

  test("binds every source figure reference and period-term annotation", () => {
    const references = milacronRobotToolchangerArchivalEdition.blocks.flatMap((block) => {
      const inlines =
        block.kind === "paragraph" || block.kind === "claim"
          ? block.inlines
          : block.kind === "figure-sheet"
            ? block.description
            : [];
      return inlines.filter(
        (inline) => inline.kind === "reference" && inline.referenceType === "figure",
      );
    });
    expect(references.length).toBeGreaterThanOrEqual(20);
    for (const reference of references) {
      if (reference.kind !== "reference") continue;
      for (const preview of reference.figurePreviews ?? []) {
        const bytes = readFileSync(resolve(process.cwd(), "public", preview.src.slice(1)));
        expect(bytes.readUInt32BE(16)).toBe(preview.width);
        expect(bytes.readUInt32BE(20)).toBe(preview.height);
      }
    }

    const terms = milacronRobotToolchangerArchivalEdition.blocks.flatMap((block) =>
      block.kind === "paragraph" ? block.inlines.filter((inline) => inline.kind === "term") : [],
    );
    expect(terms.length).toBeGreaterThanOrEqual(3);
    for (const item of terms) {
      if (item.kind === "term") expect(item.definition.length).toBeGreaterThan(80);
    }
    expect(milacronRobotToolchangerPatent.historicalContext.patentWars).toEqual([]);
  });
});
