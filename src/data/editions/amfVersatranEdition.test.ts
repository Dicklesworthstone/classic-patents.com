/*
import { describe, expect, it } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  amfVersatranArchivalEdition,
  amfVersatranClaimText,
  amfVersatranParallelReadings,
  FIGURES,
} from "./amfVersatranEdition";

const PATENT_ID = "us-3212649-amf-versatran";
const EXPECTED_PDF_SHA256 = "9a985a6bf91770914a5049c3f03e0cee2dc4bfe8711633891df68cc0b894ccbd";

describe("US 3,212,649 AMF Versatran Archival Edition Contract", () => {
  it("pins the complete 31-page primary facsimile and manual publication contract", () => {
    expect(amfVersatranArchivalEdition.kind).toBe("manual-react-edition");
    expect(amfVersatranArchivalEdition.sourcePdfSha256).toBe(EXPECTED_PDF_SHA256);
    expect(amfVersatranArchivalEdition.completeFacsimileReviewed).toBe(true);
    expect(amfVersatranArchivalEdition.blocks.length).toBeGreaterThanOrEqual(25);
    expect(PATENT_ID).toBe("us-3212649-amf-versatran");
  });

  it("derives all fourteen issued claim strings from the manual source edition", () => {
    const claims = amfVersatranArchivalEdition.blocks.filter((b: any) => b.kind === "claim");
    expect(claims.length).toBe(14);

    for (let i = 1; i <= 14; i++) {
      const text = amfVersatranClaimText(i);
      expect(text).toBeTruthy();
      expect(text.startsWith(`${i}.`)).toBe(true);
      expect(text.length).toBeGreaterThan(40);
    }
  });

  it("verifies all figure crop files exist on disk with valid dimensions", () => {
    for (const fig of Object.values(FIGURES) as any[]) {
      const diskPath = join(process.cwd(), "public", fig.src.replace(/^\//, ""));
      expect(existsSync(diskPath)).toBe(true);
      expect(fig.width).toBeGreaterThan(500);
      expect(fig.height).toBeGreaterThan(500);
      expect(fig.alt.length).toBeGreaterThan(20);
    }
  });

  it("contains distinct parallel readings for every paragraph index", () => {
    const paragraphIndices = amfVersatranArchivalEdition.blocks.flatMap((b: any, idx: number) =>
      b.kind === "paragraph" ? [idx] : [],
    );
    const readingIndices = Object.keys(amfVersatranParallelReadings)
      .map(Number)
      .sort((a, b) => a - b);

    expect(readingIndices).toEqual(paragraphIndices);

    for (const [_idx, reading] of Object.entries(amfVersatranParallelReadings)) {
      expect(reading.length).toBeGreaterThan(0);
      expect(reading[0].length).toBeGreaterThan(40);
    }
  });

  it("validates the reviewed transcription ledger across all 31 pages", () => {
    const transcriptPath = join(
      process.cwd(),
      "public/patents/transcripts/us-3212649-amf-versatran-reviewed.txt",
    );
    expect(existsSync(transcriptPath)).toBe(true);
    const text = readFileSync(transcriptPath, "utf-8");

    for (let page = 1; page <= 31; page++) {
      expect(text.includes(`--- REVIEWED TRANSCRIPTION PAGE ${page} OF 31 ---`)).toBe(true);
    }
  });
});
*/

import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { amfVersatranPatent } from "@/data/patents/amf-versatran";
import {
  validateReviewedTranscription,
  validateReviewedTranscriptionCoverage,
  validateReviewedTranscriptionEditorialIntegrity,
  validateReviewedTranscriptionLiteralCoverage,
  validateReviewedTranscriptionPageAnchors,
} from "@/data/patents/sourceTextValidation";
import { amfVersatranArchivalEdition, amfVersatranParallelReadings } from "./amfVersatranEdition";

const ROOT = process.cwd();
const PATENT_ID = "us-3212649-amf-versatran";
const PDF_PATH = join(ROOT, "public", "patents", "pdfs", `${PATENT_ID}.pdf`);
const LEDGER_PATH = join(ROOT, "public", "patents", "transcripts", `${PATENT_ID}-reviewed.txt`);
const DIGEST = "9a985a6bf91770914a5049c3f03e0cee2dc4bfe8711633891df68cc0b894ccbd";
const BARE_SOURCE_REFERENCE =
  /\b(?:(?:fig(?:s)?\.?|figure)\s+\d+[a-z′′]*|(?:section|division)\s+\d+)\b/i;

function sourceInlines(block: (typeof amfVersatranArchivalEdition.blocks)[number]) {
  if (block.kind === "paragraph" || block.kind === "claim") return block.inlines;
  if (block.kind === "figure-sheet") return block.description;
  return [];
}

type SourceInline = ReturnType<typeof sourceInlines>[number];

describe("US 3,212,649 Machine for Performing Work archival edition", () => {
  test("pins the complete 31-page primary facsimile and manual publication contract", () => {
    expect(validateCuratedSpecificationEdition(amfVersatranArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    expect(amfVersatranPatent.archivalEdition).toBe(amfVersatranArchivalEdition);
    expect(amfVersatranArchivalEdition.sourcePdfSha256).toBe(DIGEST);
    expect(amfVersatranPatent.originalTextAsset).toMatchObject({
      url: `/patents/transcripts/${PATENT_ID}-reviewed.txt`,
      pageCount: 31,
      kind: "reviewed-transcription",
      sourcePdfSha256: DIGEST,
    });
    expect(existsSync(PDF_PATH)).toBe(true);
    expect(createHash("sha256").update(readFileSync(PDF_PATH)).digest("hex")).toBe(DIGEST);
  });

  test("derives all fourteen issued claim strings from the manual source edition", () => {
    const editionClaims = amfVersatranArchivalEdition.blocks.filter(
      (block) => block.kind === "claim",
    );
    expect(editionClaims.map((claim) => claim.number)).toEqual(
      Array.from({ length: 14 }, (_, index) => index + 1),
    );
    expect(amfVersatranPatent.claims).toHaveLength(14);
    expect(amfVersatranPatent.stats).toEqual({ totalClaims: 14, independentClaims: 7 });
    expect(
      amfVersatranPatent.claims.filter((claim) => claim.isIndependent).map((claim) => claim.number),
    ).toEqual([1, 2, 3, 4, 8, 9, 12]);

    for (const claim of amfVersatranPatent.claims) {
      const editionClaim = editionClaims.find((candidate) => candidate.number === claim.number);
      expect(editionClaim?.inlines.map((inline) => inline.text).join("")).toBe(claim.originalText);
      expect(claim.plainEnglish.split(/\s+/).length).toBeGreaterThan(30);
      expect(claim.keyInnovations.length).toBeGreaterThan(0);
      for (const parent of claim.dependsOn ?? []) {
        expect(amfVersatranPatent.claims.some((candidate) => candidate.number === parent)).toBe(
          true,
        );
      }
    }
  });

  test("pins ledger, authored source crops, terms, and non-lossy parallel readings", () => {
    const ledger = readFileSync(LEDGER_PATH, "utf8");
    const literalBlocks = amfVersatranArchivalEdition.blocks.flatMap((block) => {
      if (block.kind === "masthead") return [block.lines.join(" ")];
      if (block.kind === "paragraph" || block.kind === "claim") {
        return [block.inlines.map((inline) => inline.text).join("")];
      }
      return [];
    });

    expect(validateReviewedTranscription(ledger, 31)).toEqual({ valid: true });
    expect(validateReviewedTranscriptionEditorialIntegrity(ledger, 31)).toEqual({ valid: true });
    expect(
      validateReviewedTranscriptionPageAnchors(
        ledger,
        31,
        amfVersatranPatent.originalTextAsset?.pageAnchors,
      ),
    ).toEqual({ valid: true });
    expect(validateReviewedTranscriptionLiteralCoverage(ledger, 31, literalBlocks)).toEqual({
      valid: true,
    });
    expect(validateReviewedTranscriptionCoverage(ledger, 31, literalBlocks.join(" "))).toEqual({
      valid: true,
    });
    expect(JSON.stringify(amfVersatranArchivalEdition)).not.toContain(
      "--- REVIEWED TRANSCRIPTION PAGE",
    );
    expect(JSON.stringify(amfVersatranArchivalEdition)).not.toContain("17 Sheets-Sheet");

    const allInlines = amfVersatranArchivalEdition.blocks.flatMap(sourceInlines);
    for (const inline of allInlines) {
      if (inline.kind === "text") expect(inline.text).not.toMatch(BARE_SOURCE_REFERENCE);
    }
    const sourceReferences = allInlines.filter(
      (inline): inline is Extract<SourceInline, { kind: "reference" }> =>
        inline.kind === "reference",
    );
    expect(
      sourceReferences.filter((reference) => BARE_SOURCE_REFERENCE.test(reference.text)),
    ).not.toHaveLength(0);
    for (const reference of sourceReferences.filter(
      (reference) => reference.referenceType === "figure",
    )) {
      expect(reference.figurePreviews?.length).toBeGreaterThan(0);
      for (const preview of reference.figurePreviews ?? []) {
        const sourcePath = join(ROOT, "public", preview.src.replace(/^\//, ""));
        expect(existsSync(sourcePath)).toBe(true);
        const bytes = readFileSync(sourcePath);
        expect(bytes.readUInt32BE(16)).toBe(preview.width);
        expect(bytes.readUInt32BE(20)).toBe(preview.height);
      }
    }

    const paragraphIndexes = amfVersatranArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    expect(
      Object.keys(amfVersatranParallelReadings)
        .map(Number)
        .sort((left, right) => left - right),
    ).toEqual(paragraphIndexes);
    for (const index of paragraphIndexes) {
      expect(amfVersatranParallelReadings[index]?.join(" ").trim().length).toBeGreaterThan(40);
    }

    const terms = allInlines.filter(
      (inline): inline is Extract<SourceInline, { kind: "term" }> => inline.kind === "term",
    );
    expect(terms.length).toBeGreaterThanOrEqual(3);
    for (const term of terms) expect(term.definition.trim().length).toBeGreaterThan(80);
  });

  test("does not invent a patent-war narrative where the reviewed record has none", () => {
    expect(amfVersatranPatent.historicalContext.patentWars).toEqual([]);
  });
});
