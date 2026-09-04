import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { evaluateReviewedLedgerTextEvidence } from "@/data/editions/reviewedLedgerPublicationEvidence";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";
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
      join(process.cwd(), "public/patents/transcripts/us-4750-howe-sewing-machine-reviewed.txt"),
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

  test("binds a canonical reviewed ledger with complete literal source coverage", () => {
    const asset = howeSewingMachinePatent.originalTextAsset;
    expect(asset).toMatchObject({
      url: "/patents/transcripts/us-4750-howe-sewing-machine-reviewed.txt",
      pageCount: 6,
      kind: "reviewed-transcription",
      reviewedBy: "Classic Patents editorial agent (codex-hotel)",
      reviewedAt: "2026-08-17",
      sourcePdfSha256: howeSewingMachineArchivalEdition.sourcePdfSha256,
    });
    if (!asset) throw new Error("US 4,750 must retain its reviewed source ledger.");

    const reviewedLedger = readFileSync(join(process.cwd(), "public", asset.url), "utf8");
    expect(validateReviewedTranscription(reviewedLedger, asset.pageCount)).toEqual({ valid: true });
    expect(
      evaluateReviewedLedgerTextEvidence(howeSewingMachinePatent, reviewedLedger),
    ).toMatchObject({
      status: "verified",
      valid: true,
      authoredSectionCount: 36,
      coveredSectionCount: 36,
      coverageFraction: 1,
      missingSectionIndexes: [],
      missingClaimNumbers: [],
      error: null,
    });
  });

  test("uses complete, exact source sheets for every authored figure occurrence", () => {
    const sourceDirectory = "/patents/figures/us-4750-howe-sewing-machine";
    const sourceSheets = {
      1: `${sourceDirectory}/source-sheet-1-v1.png`,
      2: `${sourceDirectory}/source-sheet-2-v1.png`,
      3: `${sourceDirectory}/source-sheet-3-v1.png`,
    } as const;
    const expectedOccurrenceAssets = {
      "edition-block-1-group-0-inline-1": sourceSheets[1],
      "edition-block-1-group-0-inline-3": sourceSheets[1],
      "edition-block-1-group-0-inline-5": sourceSheets[1],
      "edition-block-2-group-0-inline-1": sourceSheets[2],
      "edition-block-2-group-0-inline-3": sourceSheets[2],
      "edition-block-3-group-0-inline-1": sourceSheets[3],
      "edition-block-3-group-0-inline-3": sourceSheets[3],
      "edition-block-3-group-0-inline-5": sourceSheets[3],
      "edition-block-9-group-0-inline-1": sourceSheets[1],
      "edition-block-9-group-0-inline-3": sourceSheets[2],
      "edition-block-9-group-0-inline-5": sourceSheets[3],
      "edition-block-13-group-0-inline-1": sourceSheets[2],
      "edition-block-13-group-0-inline-5": sourceSheets[3],
      "edition-block-15-group-0-inline-0": sourceSheets[1],
      "edition-block-15-group-0-inline-2": sourceSheets[2],
      "edition-block-16-group-0-inline-3": sourceSheets[2],
      "edition-block-16-group-0-inline-5": sourceSheets[2],
      "edition-block-17-group-0-inline-1": sourceSheets[3],
      "edition-block-18-group-0-inline-1": sourceSheets[2],
      "edition-block-18-group-0-inline-3": sourceSheets[1],
      "edition-block-19-group-0-inline-1": sourceSheets[3],
      "edition-block-20-group-0-inline-0": sourceSheets[3],
      "edition-block-20-group-0-inline-2": sourceSheets[3],
      "edition-block-20-group-0-inline-4": sourceSheets[1],
      "edition-block-20-group-0-inline-6": sourceSheets[3],
      "edition-block-20-group-0-inline-8": sourceSheets[3],
      "edition-block-20-group-0-inline-10": sourceSheets[2],
      "edition-block-21-group-0-inline-1": sourceSheets[1],
      "edition-block-23-group-0-inline-1": sourceSheets[1],
      "edition-block-23-group-0-inline-5": sourceSheets[1],
      "edition-block-24-group-0-inline-1": sourceSheets[1],
      "edition-block-24-group-0-inline-3": sourceSheets[1],
      "edition-block-25-group-0-inline-1": sourceSheets[1],
      "edition-block-26-group-0-inline-1": sourceSheets[1],
      "edition-block-26-group-0-inline-3": sourceSheets[2],
      "edition-block-27-group-0-inline-1": sourceSheets[3],
    } as const;
    const activeOccurrences: Record<string, string> = {};
    const multiSheetOccurrences: Record<string, readonly string[]> = {};

    for (const [blockIndex, block] of howeSewingMachineArchivalEdition.blocks.entries()) {
      const groups =
        block.kind === "figure-sheet"
          ? [block.description]
          : block.kind === "paragraph" || block.kind === "claim"
            ? [block.inlines]
            : [];
      for (const [groupIndex, inlines] of groups.entries()) {
        for (const [inlineIndex, inline] of inlines.entries()) {
          if (inline.kind !== "reference" || inline.referenceType !== "figure") continue;
          const occurrenceKey = `edition-block-${blockIndex}-group-${groupIndex}-inline-${inlineIndex}`;
          const previews = inline.figurePreviews ?? [];
          expect(previews.length).toBeGreaterThan(0);
          activeOccurrences[occurrenceKey] = previews[0]?.src ?? "";
          if (previews.length > 1) {
            multiSheetOccurrences[occurrenceKey] = previews.map((preview) => preview.src);
          }
          for (const preview of previews) {
            expect(preview.src).toStartWith(`${sourceDirectory}/source-sheet-`);
            expect(existsSync(join(process.cwd(), "public", preview.src))).toBe(true);
            expect(preview.width).toBe(2320);
            expect(preview.height).toBe(3408);
          }
        }
      }
    }

    expect(activeOccurrences).toEqual(expectedOccurrenceAssets);
    expect(Object.keys(activeOccurrences)).toHaveLength(36);
    expect(multiSheetOccurrences).toEqual({
      "edition-block-20-group-0-inline-10": [sourceSheets[2], sourceSheets[3]],
      "edition-block-23-group-0-inline-1": [sourceSheets[1], sourceSheets[2]],
      "edition-block-23-group-0-inline-5": [sourceSheets[1], sourceSheets[2]],
    });

    const acceptedAssets = {
      [sourceSheets[1]]: "d91899bccbce2eaedeea23fddff2137cadaf0fac1ef2c011e6a64a421ea03cf7",
      [sourceSheets[2]]: "74dfb5350fd16740b2bfeb0d153da87bca795bcd004797feef38d40dc59ac58b",
      [sourceSheets[3]]: "df84b4e87e3ca2b5261e82e3b2dc1e7baae677ab654cf055fabd62d47a7b79d2",
    } as const;
    for (const [asset, digest] of Object.entries(acceptedAssets)) {
      expect(
        createHash("sha256")
          .update(readFileSync(join(process.cwd(), "public", asset)))
          .digest("hex"),
      ).toBe(digest);
    }

    for (const legacyPreview of [
      "us-4750-howe-sewing-machine-fig-1-preview.png",
      "us-4750-howe-sewing-machine-fig-2-preview.png",
      "us-4750-howe-sewing-machine-fig-3-preview.png",
      "us-4750-howe-sewing-machine-fig-4-detail-preview.png",
      "us-4750-howe-sewing-machine-fig-4-preview.png",
      "us-4750-howe-sewing-machine-fig-5-preview.png",
      "us-4750-howe-sewing-machine-fig-6-preview.png",
      "us-4750-howe-sewing-machine-fig-7-detail-preview.png",
      "us-4750-howe-sewing-machine-fig-7-preview.png",
      "us-4750-howe-sewing-machine-fig-8-preview.png",
      "us-4750-howe-sewing-machine-fig-9-preview.png",
    ]) {
      expect(existsSync(join(process.cwd(), "public/patents/figures", legacyPreview))).toBe(true);
    }
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
