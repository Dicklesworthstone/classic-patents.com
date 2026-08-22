import { describe, expect, test } from "bun:test";
import { wrightFlyerPatent } from "../patents/wright-flyer";
import { ARCHIVAL_PARALLEL_READINGS, archivalParallelReadingsFor } from "./parallelReadings";
import {
  archivalEditionForPublication,
  isArchivalEditionExplicitlyWithheld,
  ROOT_QA_WITHHELD_ARCHIVAL_EDITION_IDS,
} from "./publicationApproval";

const EXPECTED_ROOT_QA_WITHHOLDS = [
  "us-2297691-carlson-electrophotography",
  "us-233692-pelton-water-wheel",
  "us-2543181-land-polaroid",
  "us-2708656-fermi-reactor",
  "us-313224-mergenthaler-linotype",
  "us-3138743-kilby-integrated-circuit",
  "us-3353115-maiman-ruby-laser",
  "us-347140-thomson-welding",
  "us-3541541-engelbart-mouse",
  "us-395781-hollerith-tabulating",
  "us-400766-hall-aluminium",
  "us-542846-diesel-engine",
  "us-6120588-eink",
  "us-621195-zeppelin-airship",
  "us-706737-fessenden-wireless",
  "us-x1-hopkins-potash",
  "us-x72-whitney-cotton-gin",
] as const;

const GENERIC_PARALLEL_READING_PATTERNS: readonly RegExp[] = [
  /\bthis bounded source paragraph remains transcribed\b/i,
  /\b(?:reviewed|source) ledger\b/i,
  /\b(?:plain[- ]english )?(?:reading|explanation) for paragraph \d+\b/i,
  /\bparagraph \d+ (?:summary|companion|reading)\b/i,
  /\b(?:generic|placeholder) (?:paragraph )?(?:summary|companion|reading|explanation)\b/i,
];

describe("Wright archival parallel reading", () => {
  test("gives every manually prepared source paragraph a hand-authored companion", () => {
    const notes = archivalParallelReadingsFor(wrightFlyerPatent.id);
    const edition = wrightFlyerPatent.archivalEdition;
    expect(edition).toBeDefined();
    if (!edition) throw new Error("Wright patent must retain its archival edition.");

    for (const [index, block] of edition.blocks.entries()) {
      if (block.kind !== "paragraph") continue;
      expect(notes[index]).toBeArray();
      expect(notes[index].join(" ").trim().length).toBeGreaterThan(0);

      const sourceWordCount = block.inlines
        .map((inline) => inline.text)
        .join(" ")
        .trim()
        .split(/\s+/).length;
      const readingWordCount = notes[index].join(" ").trim().split(/\s+/).length;
      if (sourceWordCount >= 100) {
        expect(readingWordCount / sourceWordCount).toBeGreaterThanOrEqual(0.3);
      }
    }
  });

  test("uses the canonical hand-authored decoder for every presented claim", () => {
    const decodedClaims = new Set(wrightFlyerPatent.claims.map((claim) => claim.number));
    const edition = wrightFlyerPatent.archivalEdition;
    expect(edition).toBeDefined();
    if (!edition) throw new Error("Wright patent must retain its archival edition.");

    for (const block of edition.blocks) {
      if (block.kind === "claim") expect(decodedClaims.has(block.number)).toBe(true);
    }
  });

  test("does not leave a Wright figure citation as ordinary source text", () => {
    const edition = wrightFlyerPatent.archivalEdition;
    expect(edition).toBeDefined();
    if (!edition) throw new Error("Wright patent must retain its archival edition.");

    const bareFigureCitation = /\b(?:Fig(?:s)?\.?|Figure)\s+\d/i;
    for (const block of edition.blocks) {
      if (block.kind !== "paragraph" && block.kind !== "claim") continue;
      for (const inline of block.inlines) {
        if (inline.kind === "text") expect(inline.text).not.toMatch(bareFigureCitation);
        if (inline.kind === "reference" && inline.referenceType === "figure") {
          expect(inline.figurePreviews).toBeArray();
          expect(inline.figurePreviews?.length).toBeGreaterThan(0);
          for (const preview of inline.figurePreviews ?? []) {
            expect(preview.src).toStartWith("/patents/figures/us-821393-wright-flyer-");
            expect(preview.alt.trim().length).toBeGreaterThan(0);
          }
        }
      }
    }
  });

  test("keeps every claim decoder substantial enough to preserve its combination", () => {
    for (const claim of wrightFlyerPatent.claims) {
      const sourceWordCount = claim.originalText.trim().split(/\s+/).length;
      const readingWordCount = claim.plainEnglish.trim().split(/\s+/).length;
      if (sourceWordCount >= 100) {
        expect(readingWordCount / sourceWordCount).toBeGreaterThanOrEqual(0.3);
      }
    }
  });
});

describe("manual archival parallel-reading registry", () => {
  test("recognizes boilerplate that cannot stand in for an authored parallel reading", () => {
    for (const placeholder of [
      "This bounded source paragraph remains transcribed in the reviewed ledger.",
      "Plain English explanation for paragraph 17.",
      "Paragraph 9 summary",
      "Placeholder companion reading",
    ]) {
      expect(GENERIC_PARALLEL_READING_PATTERNS.some((pattern) => pattern.test(placeholder))).toBe(
        true,
      );
    }
  });

  test("fails closed unless every published source paragraph has exactly one explicit reading", async () => {
    const { allPatents } = await import("@/data/patents");
    const publishedEditions = allPatents.flatMap((patent) => {
      const edition = archivalEditionForPublication(patent);
      return edition ? [{ patent, edition }] : [];
    });

    for (const { patent, edition } of publishedEditions) {
      const readings = archivalParallelReadingsFor(patent.id);
      const paragraphIndexes = edition.blocks.flatMap((block, index) =>
        block.kind === "paragraph" ? [index] : [],
      );
      const readingIndexes = Object.keys(readings)
        .map(Number)
        .sort((left, right) => left - right);

      expect(readingIndexes, `Patent ${patent.id} paragraph index mismatch`).toEqual(
        paragraphIndexes,
      );
      for (const [indexText, reading] of Object.entries(readings)) {
        expect(reading.length).toBeGreaterThan(0);
        for (const paragraph of reading) expect(paragraph.trim().length).toBeGreaterThan(0);

        const readingText = reading.join(" ").replace(/\s+/g, " ").trim();
        expect(
          readingText.length,
          `Patent ${patent.id} block ${indexText} companion is only ${readingText.length} characters`,
        ).toBeGreaterThan(40);
        for (const pattern of GENERIC_PARALLEL_READING_PATTERNS) {
          expect(readingText).not.toMatch(pattern);
        }

        const block = edition.blocks[Number(indexText)];
        expect(block?.kind).toBe("paragraph");
        if (block?.kind !== "paragraph") continue;
        const sourceText = block.inlines
          .map((inline) => inline.text)
          .join("")
          .replace(/\s+/g, " ")
          .trim();
        const sourceWordCount = sourceText.split(/\s+/).filter(Boolean).length;
        const readingWordCount = readingText.split(/\s+/).filter(Boolean).length;
        const normalizedSource = sourceText.replace(/[^\p{L}\p{N}]+/gu, "").toLocaleLowerCase();
        const normalizedReading = readingText.replace(/[^\p{L}\p{N}]+/gu, "").toLocaleLowerCase();
        if (normalizedSource.length >= 80) {
          expect(normalizedReading).not.toContain(normalizedSource);
        }
      }
    }

    const publishedIds = publishedEditions.map(({ patent }) => patent.id).sort();
    const readingIds = Object.keys(ARCHIVAL_PARALLEL_READINGS).sort();

    for (const id of publishedIds) {
      expect(readingIds.includes(id)).toBe(true);
    }
    for (const patentId of publishedIds) {
      expect(isArchivalEditionExplicitlyWithheld(patentId)).toBe(false);
    }
    expect([...ROOT_QA_WITHHELD_ARCHIVAL_EDITION_IDS].map(String).sort()).toEqual(
      [...EXPECTED_ROOT_QA_WITHHOLDS].map(String).sort(),
    );
  });
});
