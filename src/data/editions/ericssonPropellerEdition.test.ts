import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import {
  ericssonPropellerArchivalEdition,
  ericssonPropellerParallelReadings,
} from "@/data/editions/ericssonPropellerEdition";
import { ericssonPropellerPatent } from "@/data/patents/ericsson-propeller";
import {
  validateReviewedTranscription,
  validateReviewedTranscriptionPageAnchors,
} from "@/data/patents/sourceTextValidation";

describe("ericssonPropellerArchivalEdition", () => {
  test("is an explicit, continuous edition of the pinned US 588 facsimile", () => {
    expect(validateCuratedSpecificationEdition(ericssonPropellerArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    expect(ericssonPropellerArchivalEdition.sourcePdfSha256).toBe(
      "40582250d44f6558cf9a438801e312a469ccb83b6755ebc813943fba54c3ea9a",
    );
    expect(
      ericssonPropellerArchivalEdition.blocks
        .filter((block) => block.kind === "claim")
        .map((block) => block.number),
    ).toEqual([1, 2, 3]);
  });

  test("contains no scan-page ledger or raw OCR payload", () => {
    const publicText = JSON.stringify(ericssonPropellerArchivalEdition.blocks);
    expect(publicText).not.toContain("SOURCE PDF PAGE");
    expect(publicText).not.toContain("---");
    expect(publicText).toContain("JAMES M. CURLEY");
    expect(publicText).toContain("JOSEPH MARQUETTE");
  });

  test("does not leave a source figure citation stranded in a plain text node", () => {
    const bareFigureCitation = /\bFig(?:s)?\.\s*\d+/i;

    for (const block of ericssonPropellerArchivalEdition.blocks) {
      if (!("inlines" in block)) continue;
      for (const inline of block.inlines) {
        if (inline.kind === "text") {
          expect(inline.text).not.toMatch(bareFigureCitation);
        }
      }
    }
  });

  test("gives each printed figure a source-faithful local crop and annotates period machinery terms", () => {
    const expectedFigureCrops = [
      "/patents/figures/us-588-ericsson-propeller/fig-1-source-crop-v1.png",
      "/patents/figures/us-588-ericsson-propeller/fig-2-source-crop-v1.png",
      "/patents/figures/us-588-ericsson-propeller/fig-3-source-crop-v1.png",
      "/patents/figures/us-588-ericsson-propeller/fig-4-source-crop-v1.png",
      "/patents/figures/us-588-ericsson-propeller/fig-5-source-crop-v1.png",
      "/patents/figures/us-588-ericsson-propeller/fig-6-source-crop-v1.png",
    ];
    const sourceTerms = ericssonPropellerArchivalEdition.blocks.flatMap((block) =>
      "inlines" in block
        ? block.inlines.filter(
            (inline): inline is Extract<(typeof block.inlines)[number], { kind: "term" }> =>
              inline.kind === "term",
          )
        : [],
    );
    const figureCrops = ericssonPropellerArchivalEdition.blocks.flatMap((block) =>
      "inlines" in block
        ? block.inlines.flatMap((inline) =>
            inline.kind === "reference" && inline.referenceType === "figure"
              ? (inline.figurePreviews ?? []).map((preview) => preview.src)
              : [],
          )
        : [],
    );

    expect([...new Set(figureCrops)].sort()).toEqual(expectedFigureCrops);
    for (const crop of expectedFigureCrops) {
      expect(existsSync(`${process.cwd()}/public${crop}`)).toBe(true);
    }
    expect(sourceTerms.map((entry) => entry.text)).toEqual(
      expect.arrayContaining([
        "Draft of Water",
        "spiral planes or plates",
        "stuffing box",
        "plumber block",
        "cog wheels",
        "coupling box",
        "conical cog wheels",
        "hoisting tackle",
      ]),
    );
    expect(sourceTerms.every((entry) => entry.definition.length >= 40)).toBe(true);
  });

  test("keeps the public engineering and history copy bounded by this grant", () => {
    expect(ericssonPropellerPatent.historicalContext.patentWars).toEqual([]);
    expect(ericssonPropellerPatent.stats).toEqual({
      totalClaims: 3,
      independentClaims: 3,
    });
    const visitorCopy = JSON.stringify({
      plainEnglish: ericssonPropellerPatent.plainEnglishExplanation,
      history: ericssonPropellerPatent.historicalContext,
    });
    for (const unsupportedDetail of [
      "lignum-vitae",
      "50\\\\text{ kN}",
      "Kingsbury/Mitchell",
      "Francis B. Ogden",
      "USS Monitor",
      "Francis Pettit Smith",
    ]) {
      expect(visitorCopy).not.toContain(unsupportedDetail);
    }
  });

  test("pairs every authored source paragraph with a non-lossy local companion", () => {
    for (const [index, block] of ericssonPropellerArchivalEdition.blocks.entries()) {
      if (block.kind !== "paragraph") continue;
      const companion = ericssonPropellerParallelReadings[index];
      expect(companion).toBeArray();
      expect(companion.join(" ").trim().length).toBeGreaterThan(0);

      const sourceWords = block.inlines
        .map((inline) => inline.text)
        .join(" ")
        .trim()
        .split(/\s+/).length;
      const companionWords = companion.join(" ").trim().split(/\s+/).length;
      if (sourceWords >= 100) expect(companionWords / sourceWords).toBeGreaterThanOrEqual(0.3);
    }
  });

  test("pins every authored source block to a reviewed five-sheet ledger", () => {
    const asset = ericssonPropellerPatent.originalTextAsset;
    expect(asset).toMatchObject({
      url: "/patents/transcripts/us-588-ericsson-propeller-reviewed.txt",
      pageCount: 5,
      kind: "reviewed-transcription",
      reviewedBy: "Classic Patents editorial agent (GPT-5.6)",
      reviewedAt: "2026-08-18",
      sourcePdfSha256: "40582250d44f6558cf9a438801e312a469ccb83b6755ebc813943fba54c3ea9a",
    });
    if (!asset?.sourcePdfSha256) {
      throw new Error("Ericsson reviewed transcript asset or source digest is missing.");
    }

    const transcript = readFileSync(`${process.cwd()}/public${asset.url}`, "utf8");
    expect(validateReviewedTranscription(transcript, asset.pageCount)).toEqual({ valid: true });
    expect(
      validateReviewedTranscriptionPageAnchors(transcript, asset.pageCount, asset.pageAnchors),
    ).toEqual({
      valid: true,
    });
    expect(asset.pageAnchors?.[4]).toMatchObject({
      page: 5,
      isBlank: true,
      sourceRelationship: expect.stringContaining("trailing PDF page"),
    });
    const sourcePdf = readFileSync(
      `${process.cwd()}/public${ericssonPropellerPatent.originalPdfUrl}`,
    );
    expect(createHash("sha256").update(sourcePdf).digest("hex")).toBe(asset.sourcePdfSha256);

    const normalizedTranscript = transcript
      .replace(/^--- REVIEWED TRANSCRIPTION PAGE \d+ OF \d+ ---$/gm, "")
      .replace(/\s+/g, " ")
      .trim();
    const textualBlocks = ericssonPropellerArchivalEdition.blocks.filter(
      (block) => block.kind === "masthead" || block.kind === "paragraph" || block.kind === "claim",
    );
    for (const block of textualBlocks) {
      const sourceText =
        block.kind === "masthead"
          ? block.lines.join(" ")
          : block.inlines.map((inline) => inline.text).join("");
      expect(normalizedTranscript).toContain(sourceText.replace(/\s+/g, " ").trim());
    }
  });
});
