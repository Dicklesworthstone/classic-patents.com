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
import {
  AMF_VERSATRAN_SOURCE_PARAGRAPH_COUNT,
  amfVersatranArchivalEdition,
  amfVersatranParallelReadings,
} from "./amfVersatranEdition";

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

function sourceBlockText(block: (typeof amfVersatranArchivalEdition.blocks)[number]): string {
  switch (block.kind) {
    case "masthead":
      return block.lines.join(" ");
    case "heading":
      return block.text;
    case "paragraph":
    case "claim":
      return block.inlines.map((inline) => inline.text).join("");
    case "figure-sheet":
      return block.description.map((inline) => inline.text).join("");
    case "table":
      return [
        block.caption ?? "",
        ...block.headers.flatMap((header) => header.map((inline) => inline.text)),
        ...block.rows.flatMap((row) => row.flatMap((cell) => cell.map((inline) => inline.text))),
      ]
        .filter(Boolean)
        .join(" ");
    default:
      return "";
  }
}

type SourceInline = ReturnType<typeof sourceInlines>[number];

const EXPECTED_SOURCE_HEADINGS = [
  "Vertical column and drive assembly",
  "Horizontal operating arm",
  "Hydraulic system for horizontal arm",
  "Work handling device",
  "Manifold and hydraulic system",
  "Safety valves",
  "Hydraulic system",
  "Programming mechanism",
  "Resolvers",
  "Recording",
  "Play back",
  "We claim:",
  "References Cited by the Examiner",
];

const CONTINUOUS_SOURCE_SPINE = [
  "The present invention relates to a machine for performing",
  "movements of the machine to prevent damage to the machine",
  "In the accompanying drawings which form a part of this specification",
  "With reference to the drawings, the article handling and transfer apparatus",
  "pivotally suspended from a forked bracket 160",
  "V-shaped key-ways and keys",
  "Gripper fingers 324 and 326 are connected to each other",
  "contact with a suitable disc 466",
  "manufactured by the Double A Products Co. of Manchester, Michigan.",
  "bottom end and passes through the same into the servo valve",
  "The return flow from all hydraulic actuators",
  "programming stick 644 carries a push button switch 698",
  "vertical carriage actuator and the column swing actuator effect",
  "It will thus be seen that the objects set forth above",
  "We claim:",
  "References Cited by the Examiner",
  "HUGO O. SCHULZ, Primary Examiner.",
];

describe("US 3,212,649 Machine for Performing Work archival edition", () => {
  test("pins the complete 31-page primary facsimile and manual publication contract", () => {
    expect(validateCuratedSpecificationEdition(amfVersatranArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    expect(amfVersatranPatent.archivalEdition).toBe(amfVersatranArchivalEdition);
    expect(amfVersatranArchivalEdition.sourcePdfSha256).toBe(DIGEST);
    const paragraphBlocks = amfVersatranArchivalEdition.blocks.filter(
      (block) => block.kind === "paragraph",
    );
    expect(AMF_VERSATRAN_SOURCE_PARAGRAPH_COUNT).toBe(113);
    expect(paragraphBlocks).toHaveLength(AMF_VERSATRAN_SOURCE_PARAGRAPH_COUNT + 1);
    expect(
      paragraphBlocks
        .at(-1)
        ?.inlines.map((inline) => inline.text)
        .join(""),
    ).toBe("HUGO O. SCHULZ, Primary Examiner. ERNEST A. FALLER, Examiner.");
    expect(
      amfVersatranArchivalEdition.blocks
        .filter((block) => block.kind === "heading")
        .map((block) => block.text),
    ).toEqual(EXPECTED_SOURCE_HEADINGS);
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
    const literalBlocks = amfVersatranArchivalEdition.blocks
      .map(sourceBlockText)
      .filter((value) => value.length > 0);
    const continuousEditionText = literalBlocks.join(" ");

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
    expect(validateReviewedTranscriptionCoverage(ledger, 31, continuousEditionText)).toEqual({
      valid: true,
    });
    expect(JSON.stringify(amfVersatranArchivalEdition)).not.toContain(
      "--- REVIEWED TRANSCRIPTION PAGE",
    );
    expect(JSON.stringify(amfVersatranArchivalEdition)).not.toContain("17 Sheets-Sheet");
    expect(JSON.stringify(amfVersatranArchivalEdition)).not.toContain("FIG. 51");

    let previousSpineOffset = -1;
    for (const sentinel of CONTINUOUS_SOURCE_SPINE) {
      const offset = continuousEditionText.indexOf(sentinel);
      expect(offset).toBeGreaterThan(previousSpineOffset);
      previousSpineOffset = offset;
    }

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
    const referencedFigureNames = new Set(
      sourceReferences.flatMap((reference) =>
        [...reference.text.matchAll(/\d+(?:A)?/g)].map((match) => match[0] ?? ""),
      ),
    );
    const figureOrder = (figure: string) => (figure === "40A" ? 40.5 : Number(figure));
    expect(
      [...referencedFigureNames].sort((left, right) => figureOrder(left) - figureOrder(right)),
    ).toEqual(
      [...Array.from({ length: 50 }, (_, index) => String(index + 1)), "40A"].sort(
        (left, right) => figureOrder(left) - figureOrder(right),
      ),
    );
    const previewSources = new Set<string>();
    for (const reference of sourceReferences.filter(
      (reference) => reference.referenceType === "figure",
    )) {
      expect(reference.figurePreviews?.length).toBeGreaterThan(0);
      for (const preview of reference.figurePreviews ?? []) {
        const sourcePath = join(ROOT, "public", preview.src.replace(/^\//, ""));
        expect(existsSync(sourcePath)).toBe(true);
        previewSources.add(preview.src);
        const bytes = readFileSync(sourcePath);
        expect(bytes.readUInt32BE(16)).toBe(preview.width);
        expect(bytes.readUInt32BE(20)).toBe(preview.height);
      }
    }
    expect([...previewSources].sort()).toEqual(
      Array.from(
        { length: 17 },
        (_, index) =>
          `/patents/figures/${PATENT_ID}/sheet-${String(index + 1).padStart(2, "0")}-source-crop-v1.png`,
      ),
    );
    const figureFortyNineReferences = sourceReferences.filter((reference) =>
      /\bFIG(?:URE)?\.?\s*49\b/i.test(reference.text),
    );
    expect(figureFortyNineReferences.length).toBeGreaterThan(0);
    for (const reference of figureFortyNineReferences) {
      expect(reference.figurePreviews?.map((preview) => preview.src)).toEqual([
        `/patents/figures/${PATENT_ID}/sheet-17-source-crop-v1.png`,
      ]);
    }
    const figureRange = sourceReferences.find((reference) =>
      /FIGURES 34 to 41 inclusive/i.test(reference.text),
    );
    expect(figureRange?.figurePreviews?.map((preview) => preview.src)).toEqual([
      `/patents/figures/${PATENT_ID}/sheet-11-source-crop-v1.png`,
      `/patents/figures/${PATENT_ID}/sheet-11-source-crop-v1.png`,
      `/patents/figures/${PATENT_ID}/sheet-11-source-crop-v1.png`,
      `/patents/figures/${PATENT_ID}/sheet-12-source-crop-v1.png`,
      `/patents/figures/${PATENT_ID}/sheet-12-source-crop-v1.png`,
      `/patents/figures/${PATENT_ID}/sheet-12-source-crop-v1.png`,
      `/patents/figures/${PATENT_ID}/sheet-12-source-crop-v1.png`,
      `/patents/figures/${PATENT_ID}/sheet-12-source-crop-v1.png`,
    ]);
    const examinerTable = amfVersatranArchivalEdition.blocks.find(
      (block) => block.kind === "table",
    );
    expect(examinerTable && sourceBlockText(examinerTable)).toContain(
      "218,209   8/79   Agnew ........................ 187—17",
    );
    expect(examinerTable && sourceBlockText(examinerTable)).toContain("3,007,097 10/61   Shelley.");

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
    const readings = paragraphIndexes.map((index) =>
      amfVersatranParallelReadings[index]?.join(" "),
    );
    expect(new Set(readings).size).toBe(paragraphIndexes.length);
    expect(readings.join(" ")).not.toContain("This particular source paragraph begins");
    expect(readings.join(" ")).toContain("post-claim administrative byline");

    const terms = allInlines.filter(
      (inline): inline is Extract<SourceInline, { kind: "term" }> => inline.kind === "term",
    );
    expect(terms.length).toBeGreaterThanOrEqual(3);
    for (const term of terms) expect(term.definition.trim().length).toBeGreaterThan(80);
    const termTexts = new Set(terms.map((term) => term.text.toLocaleLowerCase("en-US")));
    for (const term of [
      "prime actuators",
      "reciprocatory",
      "trust bearing",
      "programming arm",
      "gimbal ring",
      "linear potentiometer",
      "resolver",
      "magnetic recording tape",
      "play back",
    ]) {
      expect(termTexts).toContain(term);
    }
  });

  test("does not invent a patent-war narrative where the reviewed record has none", () => {
    expect(amfVersatranPatent.historicalContext.patentWars).toEqual([]);
  });
});
