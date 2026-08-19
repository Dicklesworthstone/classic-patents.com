import { describe, expect, test } from "bun:test";
import { archivalEditionForPublication } from "@/components/patents/DualProjectionViewer";
import { wrightFlyerPatent } from "../patents/wright-flyer";
import { ARCHIVAL_PARALLEL_READINGS, archivalParallelReadingsFor } from "./parallelReadings";
import {
  isArchivalEditionExplicitlyWithheld,
  ROOT_QA_WITHHELD_ARCHIVAL_EDITION_IDS,
} from "./publicationApproval";

const EXPECTED_ROOT_QA_WITHHOLDS = [
  "us-313224-mergenthaler-linotype",
  "us-395781-hollerith-tabulating",
  "us-586193-marconi-radio",
  "us-2708656-fermi-reactor",
  "us-3671542-kwolek-kevlar",
  "us-3858232-boyle-smith-ccd",
] as const;

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

      expect(readingIndexes).toEqual(paragraphIndexes);
      for (const reading of Object.values(readings)) {
        expect(reading.length).toBeGreaterThan(0);
        for (const paragraph of reading) expect(paragraph.trim().length).toBeGreaterThan(0);
      }
    }

    expect(Object.keys(ARCHIVAL_PARALLEL_READINGS).sort()).toEqual(
      publishedEditions.map(({ patent }) => patent.id).sort(),
    );
    expect(
      Object.keys(ARCHIVAL_PARALLEL_READINGS).filter((patentId) =>
        isArchivalEditionExplicitlyWithheld(patentId),
      ),
    ).toEqual([] as string[]);
    expect([...ROOT_QA_WITHHELD_ARCHIVAL_EDITION_IDS].map(String).sort()).toEqual(
      [...EXPECTED_ROOT_QA_WITHHOLDS].map(String).sort(),
    );
  });
});
