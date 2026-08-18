import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { coltRevolverPatent } from "@/data/patents/colt-revolver";
import { coltRevolverArchivalEdition, coltRevolverParallelReadings } from "./coltRevolverEdition";

const transcriptPath = resolve(
  process.cwd(),
  "public/patents/transcripts/us-x9430-colt-revolver.txt",
);
const sourcePdfSha256 = "61eed2c1b5ea259a301fb2690a7d3d17e1a59560cfb002dc91c29a50f5841d01";

const normalizeForTranscriptComparison = (text: string): string =>
  text.replaceAll("′", "'").replaceAll("’", "'");

describe("coltRevolverArchivalEdition", () => {
  test("pins US X9430 to its complete reviewed seven-page transcript", () => {
    expect(validateCuratedSpecificationEdition(coltRevolverArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    expect(coltRevolverArchivalEdition.completeFacsimileReviewed).toBe(true);
    expect(coltRevolverArchivalEdition.sourcePdfSha256).toBe(sourcePdfSha256);

    expect(coltRevolverPatent.id).toBe("us-x9430-colt-revolver");
    expect(coltRevolverPatent.originalPdfUrl).toBe("/patents/pdfs/us-x9430-colt-revolver.pdf");
    expect(coltRevolverPatent.originalTextAsset).toEqual({
      url: "/patents/transcripts/us-x9430-colt-revolver.txt",
      pageCount: 7,
      kind: "reviewed-transcription",
      reviewedBy: "codex-charlie",
      reviewedAt: "2026-08-17",
      sourcePdfSha256,
    });
    expect(existsSync(transcriptPath)).toBe(true);

    const transcript = readFileSync(transcriptPath, "utf8");
    expect(transcript).toContain(
      "9430X. Specification forming part of Letters Patent dated February 25, 1836.",
    );
    expect(transcript.match(/Patented Feb\. 25, 1836\./g)).toHaveLength(4);
    expect(transcript).toContain("SAMUEL COLT.");
    expect(transcript).toContain("Witnesses: ROBERT CLARKE, WM. WALLIS.");

    for (const block of coltRevolverArchivalEdition.blocks) {
      if (block.kind !== "paragraph" && block.kind !== "claim") continue;
      const sourceText = block.inlines.map((inline) => inline.text).join("");
      expect(normalizeForTranscriptComparison(transcript)).toContain(
        normalizeForTranscriptComparison(sourceText),
      );
    }

    const claimNumbers = coltRevolverArchivalEdition.blocks
      .filter((block) => block.kind === "claim")
      .map((claim) => claim.number);
    expect(claimNumbers).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    expect(coltRevolverPatent.claims.map((claim) => claim.originalText)).toEqual(
      coltRevolverArchivalEdition.blocks
        .filter((block) => block.kind === "claim")
        .map((claim) => claim.inlines.map((inline) => inline.text).join("")),
    );
  });

  test("has one handwritten non-lossy companion for every and only source paragraph", () => {
    const paragraphIndexes = coltRevolverArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    const readingIndexes = Object.keys(coltRevolverParallelReadings)
      .map(Number)
      .sort((left, right) => left - right);

    expect(paragraphIndexes).toEqual([
      5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 32, 33,
    ]);
    expect(readingIndexes).toEqual(paragraphIndexes);
    for (const reading of Object.values(coltRevolverParallelReadings)) {
      expect(reading).toHaveLength(1);
      expect(reading[0]?.trim().length).toBeGreaterThan(100);
    }
  });
});
