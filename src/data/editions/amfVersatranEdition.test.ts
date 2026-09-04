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
const DIRECT_SOURCE_SHEET_RECEIPTS = {
  1: "537c38d3f5b9f574ea37af6e7e8798a86e3995bfd07f6cdd721a11bf60b713bf",
  2: "242ab1b7d8898b4c902ed8d9f50031fa07cc1f196e4d4637c1a71fa8707da4bc",
  3: "4ea41c2b9aae229b27b7bdaeabe502be8d804645b1b3e76f2ddc9fa441716872",
  4: "84f7223ddb48136a2566499eb80490172cc88921f741692381a1fdec310376b9",
  5: "6e1e26be74911f15bffbba08d20f04ef827102eed9a823f4683b478c761f0b5b",
  6: "53e14f83ff37855aae0e17acf663371b95a63944eaa7bd3c349f5b3d12654507",
  7: "d06ead5d84a76af5af19e6ecb92657dbbc8880987817f2c92d2a9b8b0cb365e5",
  8: "32ec4fa1f91d114ec489e273ef5b67b06bfca1181e037a24ddad60b8f53ec004",
  9: "e7bcf63768fbc860be9effc3b698d018979b95a5ae7c5d601db1e62d8b85746d",
  10: "48bf047dc6d9c2866756a282fd3b037d3525ace947faaa65d5939330b159712b",
  11: "2aeb3e6315b0b64d1b63d99678175682b8dfaf0bed5667a87ccfad21d46a1947",
  12: "c90efd44ebf0f63efd254d4323dac6aae8fe376f4b355e3a9d5db7ae8dd3f03c",
  13: "ab6d702f07a28ecaf11a709029c1d4f43d5991f742e9f6fdff606d08640259f6",
  14: "4c2b5a3c0d8728f51caf0b8ed987a96edb1fd0d5344abb707cd3dd16d0a42c85",
  15: "398ff0479027df64c7aa6a95ce806937e0b3aeaaa57271196817a4c4462ef6d5",
  16: "6c79cf1ab61307a0a77099036ce44886ff1b9d77c35650612310474e62d4ea19",
  17: "e4fa3cdd274018d8d395fcb2d43319c16fb89fe3fbb71a50b28e3e829f86ceab",
} as const;
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
    expect(sourceReferences).toHaveLength(234);
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
      Object.keys(DIRECT_SOURCE_SHEET_RECEIPTS)
        .map((page) => `/patents/figures/${PATENT_ID}/source-sheet-${page}-v1.png`)
        .sort(),
    );
    for (const [sourcePdfPage, sha256] of Object.entries(DIRECT_SOURCE_SHEET_RECEIPTS)) {
      const sourcePath = join(
        ROOT,
        "public",
        "patents",
        "figures",
        PATENT_ID,
        `source-sheet-${sourcePdfPage}-v1.png`,
      );
      const sourceBytes = readFileSync(sourcePath);
      expect(sourceBytes.readUInt32BE(16)).toBe(2320);
      expect(sourceBytes.readUInt32BE(20)).toBe(3408);
      expect(createHash("sha256").update(sourceBytes).digest("hex")).toBe(sha256);
    }
    const figureFortyNineReferences = sourceReferences.filter((reference) =>
      /\bFIG(?:URE)?\.?\s*49\b/i.test(reference.text),
    );
    expect(figureFortyNineReferences.length).toBeGreaterThan(0);
    for (const reference of figureFortyNineReferences) {
      expect(reference.figurePreviews?.map((preview) => preview.src)).toEqual([
        `/patents/figures/${PATENT_ID}/source-sheet-17-v1.png`,
      ]);
    }
    const figureRange = sourceReferences.find((reference) =>
      /FIGURES 34 to 41 inclusive/i.test(reference.text),
    );
    expect(figureRange?.figurePreviews?.map((preview) => preview.src)).toEqual([
      `/patents/figures/${PATENT_ID}/source-sheet-11-v1.png`,
      `/patents/figures/${PATENT_ID}/source-sheet-11-v1.png`,
      `/patents/figures/${PATENT_ID}/source-sheet-11-v1.png`,
      `/patents/figures/${PATENT_ID}/source-sheet-12-v1.png`,
      `/patents/figures/${PATENT_ID}/source-sheet-12-v1.png`,
      `/patents/figures/${PATENT_ID}/source-sheet-12-v1.png`,
      `/patents/figures/${PATENT_ID}/source-sheet-12-v1.png`,
      `/patents/figures/${PATENT_ID}/source-sheet-12-v1.png`,
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
