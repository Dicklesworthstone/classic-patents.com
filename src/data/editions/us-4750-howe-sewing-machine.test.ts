import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { howeSewingMachinePatent } from "../patents/howe-sewing-machine";
import {
  HOWE_SEWING_MACHINE_PARALLEL_READINGS,
  howeSewingMachineArchivalEdition,
} from "./us-4750-howe-sewing-machine";

describe("US 4,750 Howe manual archival edition", () => {
  test("pins the reviewed six-sheet facsimile and represents every printed claim", () => {
    expect(validateCuratedSpecificationEdition(howeSewingMachineArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    expect(howeSewingMachineArchivalEdition.sourcePdfSha256).toBe(
      "8f7449b3d54c2652dd74bab62fd079fdf76bd7216d8f15dd32c6af5def57b053",
    );
    expect(howeSewingMachineArchivalEdition.completeFacsimileReviewed).toBe(true);
    expect(
      howeSewingMachineArchivalEdition.blocks
        .filter((block) => block.kind === "claim")
        .map((block) => block.number),
    ).toEqual([1, 2, 3, 4, 5]);
  });

  test("derives canonical claim text from the edition and matches the reviewed ledger", () => {
    const reviewedLedger = readFileSync(
      join(process.cwd(), "public/patents/transcripts/us-4750-howe-sewing-machine.txt"),
      "utf8",
    );
    const editionClaims = howeSewingMachineArchivalEdition.blocks.filter(
      (block) => block.kind === "claim",
    );

    expect(howeSewingMachinePatent.claims.map((claim) => claim.number)).toEqual([1, 2, 3, 4, 5]);
    for (const claim of howeSewingMachinePatent.claims) {
      const editionClaim = editionClaims.find((candidate) => candidate.number === claim.number);
      if (editionClaim?.kind !== "claim") throw new Error(`Missing edition claim ${claim.number}`);
      const sourceText = editionClaim.inlines.map((inline) => inline.text).join("");

      expect(claim.originalText).toBe(sourceText);
      expect(reviewedLedger).toContain(sourceText);
      expect(claim.plainEnglish.trim().split(/\s+/).length).toBeGreaterThanOrEqual(30);
    }
  });

  test("uses authored figure references with local source-facsimile previews", () => {
    const referencedFigures = new Set<number>();
    for (const block of howeSewingMachineArchivalEdition.blocks) {
      const inlines =
        block.kind === "figure-sheet"
          ? block.description
          : block.kind === "paragraph" || block.kind === "claim"
            ? block.inlines
            : [];
      for (const inline of inlines) {
        if (inline.kind !== "reference" || inline.referenceType !== "figure") continue;
        expect(inline.figurePreviews?.length).toBeGreaterThan(0);
        for (const preview of inline.figurePreviews ?? []) {
          expect(preview.src).toStartWith("/patents/figures/us-4750-howe-sewing-machine-");
          expect(existsSync(join(process.cwd(), "public", preview.src))).toBe(true);
          const match = preview.src.match(/fig-(\d+)-/);
          if (match?.[1]) referencedFigures.add(Number(match[1]));
        }
      }
    }
    expect([...referencedFigures].sort((a, b) => a - b)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  test("keeps the canonical identity and drawing inventory source-bounded", () => {
    expect(howeSewingMachinePatent.filingDate).toBeNull();
    const opening = howeSewingMachineArchivalEdition.blocks.find(
      (block) =>
        block.kind === "paragraph" &&
        block.inlines.length === 1 &&
        block.inlines[0]?.text.startsWith("Be it known that I, ELIAS HOWE"),
    );
    if (opening?.kind !== "paragraph") throw new Error("Missing Howe opening paragraph");
    expect(howeSewingMachinePatent.heroQuote).toBe(
      opening.inlines.map((inline) => inline.text).join(""),
    );
    expect(howeSewingMachinePatent.stats).toEqual({ totalClaims: 5, independentClaims: 5 });
    expect(howeSewingMachinePatent.drawings.map((drawing) => drawing.figureNumber)).toEqual([
      "Fig. 1",
      "Fig. 2",
      "Fig. 3",
      "Fig. 4",
      "Fig. 5",
      "Fig. 6",
      "Fig. 7",
      "Fig. 8",
      "Fig. 9",
    ]);
    for (const drawing of howeSewingMachinePatent.drawings) {
      expect(drawing.caption.trim().length).toBeGreaterThan(40);
      expect(drawing.callouts.length).toBeGreaterThan(0);
      for (const callout of drawing.callouts) {
        expect(callout.label.trim().length).toBeGreaterThan(0);
        expect(callout.description.trim().length).toBeGreaterThan(20);
        expect(callout.x).toBeGreaterThanOrEqual(0);
        expect(callout.x).toBeLessThanOrEqual(100);
        expect(callout.y).toBeGreaterThanOrEqual(0);
        expect(callout.y).toBeLessThanOrEqual(100);
      }
    }
  });

  test("annotates every required period term at its authored source occurrence", () => {
    const requiredTerms = [
      "picker-staves",
      "baster-plate",
      "tempering-screw",
      "lifting-rod",
      "clipping-piece",
    ];
    const terms = howeSewingMachineArchivalEdition.blocks.flatMap((block) =>
      block.kind === "paragraph" || block.kind === "claim"
        ? block.inlines.filter((inline) => inline.kind === "term")
        : [],
    );
    for (const term of requiredTerms) {
      const matches = terms.filter((candidate) => candidate.text === term);
      expect(matches.length).toBeGreaterThan(0);
      expect(matches.every((candidate) => candidate.definition.trim().length >= 80)).toBe(true);
    }
  });

  test("keeps page ledgers and raw source text out of the published continuous edition", () => {
    const publicText = JSON.stringify(howeSewingMachineArchivalEdition.blocks);
    expect(publicText).not.toContain("--- REVIEWED TRANSCRIPTION PAGE");
    expect(publicText).not.toContain("--- SOURCE PDF PAGE");
    expect(publicText).not.toContain("source-text/us-4750-howe-sewing-machine");
  });

  test("gives every authored Howe paragraph a patent-local, non-lossy companion", () => {
    const paragraphIndexes = howeSewingMachineArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    const companionIndexes = Object.keys(HOWE_SEWING_MACHINE_PARALLEL_READINGS).map(Number);

    expect(companionIndexes.sort((left, right) => left - right)).toEqual(paragraphIndexes);

    for (const index of paragraphIndexes) {
      const block = howeSewingMachineArchivalEdition.blocks[index];
      if (block?.kind !== "paragraph") throw new Error(`Expected paragraph ${index}`);

      const companion = HOWE_SEWING_MACHINE_PARALLEL_READINGS[index];
      expect(companion).toBeArray();
      expect(companion.join(" ").trim().length).toBeGreaterThan(0);

      const sourceWords = block.inlines
        .map((inline) => inline.text)
        .join(" ")
        .trim()
        .split(/\s+/).length;
      const companionWords = companion.join(" ").trim().split(/\s+/).length;
      if (sourceWords >= 100) {
        expect(companionWords / sourceWords).toBeGreaterThanOrEqual(0.3);
      }
    }
  });
});
