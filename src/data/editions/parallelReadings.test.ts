import { describe, expect, test } from "bun:test";
import { allPatents } from "@/data/patents";
import { wrightFlyerPatent } from "../patents/wright-flyer";
import { ARCHIVAL_PARALLEL_READINGS, archivalParallelReadingsFor } from "./parallelReadings";
import {
  archivalEditionForPublication,
  isArchivalEditionExplicitlyWithheld,
  ROOT_QA_WITHHELD_ARCHIVAL_EDITION_IDS,
} from "./publicationApproval";

const EXPECTED_ROOT_QA_WITHHOLDS = [
  "us-2543181-land-polaroid",
  "us-2708656-fermi-reactor",
  "us-313224-mergenthaler-linotype",
  "us-542846-diesel-engine",
  "us-6120588-eink",
  "us-706737-fessenden-wireless",
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
            expect(preview.src).toStartWith("/patents/figures/us-821393-wright-flyer/");
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
  test("fails closed unless every mapped published source paragraph has exactly one explicit reading", () => {
    // Editorial calibration (root decision, 2026-08-22): a published edition
    // without its companion map yet shows verbatim source text with graceful
    // degradation; exactness and quality floors apply once a map exists.
    const publishedEditions = allPatents.flatMap((patent) => {
      const edition = archivalEditionForPublication(patent);
      return edition ? [{ patent, edition }] : [];
    });

    for (const { patent, edition } of publishedEditions) {
      // Direct registry access: the lookup helper throws on absent maps,
      // which is now a legal published state (verbatim-only display).
      const readings = ARCHIVAL_PARALLEL_READINGS[patent.id] ?? {};
      const paragraphIndexes = edition.blocks.flatMap((block, index) =>
        block.kind === "paragraph" ? [index] : [],
      );
      if (Object.keys(readings).length === 0) continue;
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
        const normalizedSource = sourceText.replace(/[^\p{L}\p{N}]+/gu, "").toLocaleLowerCase();
        const normalizedReading = readingText.replace(/[^\p{L}\p{N}]+/gu, "").toLocaleLowerCase();
        if (normalizedSource.length >= 80) {
          expect(normalizedReading).not.toContain(normalizedSource);
        }
      }
    }

    // Every registered map must name a real catalog patent, and no published
    // edition may simultaneously sit on the fabrication hold list.
    const publishedIds = publishedEditions.map(({ patent }) => patent.id).sort();
    for (const id of publishedIds) {
      expect(isArchivalEditionExplicitlyWithheld(id)).toBe(false);
    }
    for (const id of Object.keys(ARCHIVAL_PARALLEL_READINGS)) {
      expect(
        allPatents.some((patent) => patent.id === id),
        `unknown map id ${id}`,
      ).toBe(true);
    }
    expect([...ROOT_QA_WITHHELD_ARCHIVAL_EDITION_IDS].map(String).sort()).toEqual(
      [...EXPECTED_ROOT_QA_WITHHOLDS].map(String).sort(),
    );
  });
});
