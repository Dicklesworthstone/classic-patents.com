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
const SOURCE_SHEET_PAGE_BY_FIGURE: Readonly<Record<number, number>> = {
  1: 1,
  2: 2,
  3: 3,
  4: 3,
  5: 3,
  6: 4,
  7: 5,
  8: 6,
  9: 7,
  10: 8,
  11: 8,
  12: 8,
  13: 9,
  14: 9,
  15: 10,
  16: 11,
};
const SOURCE_SHEET_SHA256: Readonly<Record<number, string>> = {
  1: "6109920af3a2de6e9387984d385147fc1ffd51c6cc18bd2ac85e7eb780c7fa4a",
  2: "3bec03e0b40268d40468147f2958384ced8b14f324b9faee126437744b3b8dea",
  3: "5187501e7d4c85897f8471d777c92ed53fa8de155f6487e3bb3048a283df34f7",
  4: "e14067c7f3ac103d976ef6e25384ce3613bd0b8f397692d235449fd938a77755",
  5: "95f1c1ed438a33f5da55cb38dc918e95080eacc7d02840aaefba02763c1356bd",
  6: "7388f25d24e6c3cfbb8bc0c22f8bb3d73765335fb50e7a6e1bc598bc07325735",
  7: "3c9d1343f23f198f1e29fbb55cf0b44527e26b45061265da5485a4fc9273fe60",
  8: "da13dcfe50d3871bb5e277b080c01746d282cdfde4a8c7cb9bbf4dafe98d1170",
  9: "3405391f35645295f3851aa76a50d82dbed1f08fe770eaf4ef91aa23561c8a59",
  10: "61954def99dffa276de9dd571d5e32d974ffb196ad5f4de990b7a16e8eafa537",
  11: "421fbe76820ccc4be49ec45cf4b19cffffb817bdbda4d144108f44ed1fa15d0d",
};

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

  test("pins complete source sheets for every figure occurrence, period terms, and a non-lossy reading for every source paragraph", () => {
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
    expect(references).toHaveLength(90);
    expect(references.flatMap((reference) => reference.figurePreviews ?? [])).toHaveLength(119);
    const seenSourcePages = new Set<number>();
    for (const reference of references) {
      expect(reference.figurePreviews?.length).toBeGreaterThan(0);
      const referencedFigures = [...reference.text.matchAll(/\d+/g)].map((match) =>
        Number(match[0]),
      );
      expect(reference.figurePreviews).toHaveLength(referencedFigures.length);
      for (const [index, preview] of (reference.figurePreviews ?? []).entries()) {
        const figureNumber = referencedFigures[index];
        const sourcePdfPage = SOURCE_SHEET_PAGE_BY_FIGURE[figureNumber];
        expect(sourcePdfPage).toBeDefined();
        expect(preview.src).toBe(
          `/patents/figures/${PATENT_ID}/source-sheet-${sourcePdfPage}-v1.png`,
        );
        const sourcePath = join(ROOT, "public", preview.src.replace(/^\//, ""));
        expect(existsSync(sourcePath)).toBe(true);
        const bytes = readFileSync(sourcePath);
        expect(bytes.readUInt32BE(16)).toBe(2320);
        expect(bytes.readUInt32BE(20)).toBe(3408);
        expect(createHash("sha256").update(bytes).digest("hex")).toBe(
          SOURCE_SHEET_SHA256[sourcePdfPage],
        );
        seenSourcePages.add(sourcePdfPage);
      }
    }
    expect([...seenSourcePages].sort((left, right) => left - right)).toEqual(
      Array.from({ length: 11 }, (_, index) => index + 1),
    );

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
