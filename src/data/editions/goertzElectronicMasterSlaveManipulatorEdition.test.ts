import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { goertzElectronicMasterSlaveManipulatorPatent } from "@/data/patents/goertz-electronic-master-slave-manipulator";
import {
  validateReviewedTranscription,
  validateReviewedTranscriptionCoverage,
  validateReviewedTranscriptionEditorialIntegrity,
  validateReviewedTranscriptionLiteralCoverage,
  validateReviewedTranscriptionPageAnchors,
} from "@/data/patents/sourceTextValidation";
import {
  goertzElectronicMasterSlaveManipulatorArchivalEdition,
  goertzElectronicMasterSlaveManipulatorParallelReadings,
} from "./goertzElectronicMasterSlaveManipulatorEdition";

const ROOT = process.cwd();
const PATENT_ID = "us-2846084-goertz-electronic-master-slave-manipulator";
const PDF_PATH = join(ROOT, "public", "patents", "pdfs", `${PATENT_ID}.pdf`);
const LEDGER_PATH = join(ROOT, "public", "patents", "transcripts", `${PATENT_ID}-reviewed.txt`);
const DIGEST = "0e5ceed27b4cf8fc72a9144851a9c58e0342cae111fd932519828171550a6d64";
const BARE_SOURCE_REFERENCE =
  /\b(?:(?:fig(?:s)?\.?|figure)\s+\d+[a-z′′]*|(?:section|division)\s+\d+)\b/i;

function sourceInlines(
  block: (typeof goertzElectronicMasterSlaveManipulatorArchivalEdition.blocks)[number],
) {
  if (block.kind === "paragraph" || block.kind === "claim") return block.inlines;
  if (block.kind === "figure-sheet") return block.description;
  return [];
}

type SourceInline = ReturnType<typeof sourceInlines>[number];

describe("US 2,846,084 Electronic Master Slave Manipulator archival edition", () => {
  test("pins the complete 20-page primary facsimile and manual publication contract", () => {
    expect(
      validateCuratedSpecificationEdition(goertzElectronicMasterSlaveManipulatorArchivalEdition),
    ).toEqual({
      valid: true,
      errors: [],
    });
    expect(goertzElectronicMasterSlaveManipulatorPatent.archivalEdition).toBe(
      goertzElectronicMasterSlaveManipulatorArchivalEdition,
    );
    expect(goertzElectronicMasterSlaveManipulatorArchivalEdition.sourcePdfSha256).toBe(DIGEST);
    expect(goertzElectronicMasterSlaveManipulatorPatent.originalTextAsset).toMatchObject({
      url: `/patents/transcripts/${PATENT_ID}-reviewed.txt`,
      pageCount: 20,
      kind: "reviewed-transcription",
      sourcePdfSha256: DIGEST,
    });
    expect(existsSync(PDF_PATH)).toBe(true);
    expect(createHash("sha256").update(readFileSync(PDF_PATH)).digest("hex")).toBe(DIGEST);
  });

  test("derives all thirteen issued claim strings from the manual source edition", () => {
    const editionClaims = goertzElectronicMasterSlaveManipulatorArchivalEdition.blocks.filter(
      (block) => block.kind === "claim",
    );
    expect(editionClaims.map((claim) => claim.number)).toEqual(
      Array.from({ length: 13 }, (_, index) => index + 1),
    );
    expect(goertzElectronicMasterSlaveManipulatorPatent.claims).toHaveLength(13);
    expect(goertzElectronicMasterSlaveManipulatorPatent.stats).toEqual({
      totalClaims: 13,
      independentClaims: 6,
    });
    expect(
      goertzElectronicMasterSlaveManipulatorPatent.claims
        .filter((claim) => claim.isIndependent)
        .map((claim) => claim.number),
    ).toEqual([1, 2, 4, 6, 9, 13]);

    for (const claim of goertzElectronicMasterSlaveManipulatorPatent.claims) {
      const editionClaim = editionClaims.find((candidate) => candidate.number === claim.number);
      expect(editionClaim?.inlines.map((inline) => inline.text).join("")).toBe(claim.originalText);
      expect(claim.plainEnglish.split(/\s+/).length).toBeGreaterThan(30);
      expect(claim.keyInnovations.length).toBeGreaterThan(0);
      for (const parent of claim.dependsOn ?? []) {
        expect(
          goertzElectronicMasterSlaveManipulatorPatent.claims.some(
            (candidate) => candidate.number === parent,
          ),
        ).toBe(true);
      }
    }
  });

  test("contains every published literal source block in the reviewed 20-page ledger", () => {
    const ledger = readFileSync(LEDGER_PATH, "utf8");
    const literalBlocks = goertzElectronicMasterSlaveManipulatorArchivalEdition.blocks.flatMap(
      (block) => {
        if (block.kind === "masthead") return [block.lines.join(" ")];
        if (block.kind === "paragraph" || block.kind === "claim") {
          return [block.inlines.map((inline) => inline.text).join("")];
        }
        return [];
      },
    );

    expect(validateReviewedTranscription(ledger, 20)).toEqual({ valid: true });
    expect(validateReviewedTranscriptionEditorialIntegrity(ledger, 20)).toEqual({ valid: true });
    expect(
      validateReviewedTranscriptionPageAnchors(
        ledger,
        20,
        goertzElectronicMasterSlaveManipulatorPatent.originalTextAsset?.pageAnchors,
      ),
    ).toEqual({ valid: true });
    expect(validateReviewedTranscriptionLiteralCoverage(ledger, 20, literalBlocks)).toEqual({
      valid: true,
    });
    expect(validateReviewedTranscriptionCoverage(ledger, 20, literalBlocks.join(" "))).toEqual({
      valid: true,
    });
    expect(JSON.stringify(goertzElectronicMasterSlaveManipulatorArchivalEdition)).not.toContain(
      "--- REVIEWED TRANSCRIPTION PAGE",
    );
    expect(JSON.stringify(goertzElectronicMasterSlaveManipulatorArchivalEdition)).not.toContain(
      "Drawing sheet",
    );
  });

  test("pins source crops, period terms, and a non-lossy reading for every source paragraph", () => {
    const allInlines =
      goertzElectronicMasterSlaveManipulatorArchivalEdition.blocks.flatMap(sourceInlines);
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

    const references = goertzElectronicMasterSlaveManipulatorArchivalEdition.blocks.flatMap(
      (block) =>
        sourceInlines(block).filter(
          (inline): inline is Extract<SourceInline, { kind: "reference" }> =>
            inline.kind === "reference" && inline.referenceType === "figure",
        ),
    );
    expect(references).not.toHaveLength(0);
    for (const reference of references) {
      expect(reference.figurePreviews?.length).toBeGreaterThan(0);
      for (const preview of reference.figurePreviews ?? []) {
        const sourcePath = join(ROOT, "public", preview.src.replace(/^\//, ""));
        expect(existsSync(sourcePath)).toBe(true);
        const bytes = readFileSync(sourcePath);
        expect(bytes.readUInt32BE(16)).toBe(preview.width);
        expect(bytes.readUInt32BE(20)).toBe(preview.height);
      }
    }

    const paragraphIndexes = goertzElectronicMasterSlaveManipulatorArchivalEdition.blocks.flatMap(
      (block, index) => (block.kind === "paragraph" ? [index] : []),
    );
    expect(
      Object.keys(goertzElectronicMasterSlaveManipulatorParallelReadings)
        .map(Number)
        .sort((left, right) => left - right),
    ).toEqual(paragraphIndexes);
    for (const index of paragraphIndexes) {
      expect(
        goertzElectronicMasterSlaveManipulatorParallelReadings[index]?.join(" ").trim().length,
      ).toBeGreaterThan(40);
    }

    const terms = goertzElectronicMasterSlaveManipulatorArchivalEdition.blocks.flatMap((block) =>
      sourceInlines(block).filter(
        (inline): inline is Extract<SourceInline, { kind: "term" }> => inline.kind === "term",
      ),
    );
    expect(terms.map((term) => term.text)).toEqual([
      "remote-control manipulator",
      "sense of feel",
      "synchro control transformer",
    ]);
    for (const term of terms) expect(term.definition.trim().length).toBeGreaterThan(80);
  });

  test("does not invent a patent-war narrative where the researched record has none", () => {
    expect(goertzElectronicMasterSlaveManipulatorPatent.historicalContext.patentWars).toEqual([]);
  });
});
