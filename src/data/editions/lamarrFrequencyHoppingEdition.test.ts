import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { lamarrPatent } from "@/data/patents/lamarr-frequency-hopping";
import { validateReviewedTranscriptionPageAnchors } from "@/data/patents/sourceTextValidation";
import {
  lamarrFrequencyHoppingArchivalEdition,
  lamarrFrequencyHoppingParallelReadings,
} from "./lamarrFrequencyHoppingEdition";

describe("US 2,292,387 manual source edition", () => {
  test("retains all seven source sheets and every printed claim for continued authoring", () => {
    expect(validateCuratedSpecificationEdition(lamarrFrequencyHoppingArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    const pdf = readFileSync(
      `${process.cwd()}/public/patents/pdfs/us-2292387-lamarr-frequency-hopping.pdf`,
    );
    expect(createHash("sha256").update(pdf).digest("hex")).toBe(
      lamarrFrequencyHoppingArchivalEdition.sourcePdfSha256,
    );
    expect(lamarrPatent.claims.map((claim) => claim.number)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(
      lamarrPatent.claims.filter((claim) => claim.isIndependent).map((claim) => claim.number),
    ).toEqual([1, 4]);
  });

  test("derives the canonical claims from authored claim nodes", () => {
    const authored = lamarrFrequencyHoppingArchivalEdition.blocks.filter(
      (
        block,
      ): block is Extract<
        (typeof lamarrFrequencyHoppingArchivalEdition.blocks)[number],
        { kind: "claim" }
      > => block.kind === "claim",
    );
    expect(lamarrPatent.claims.map((claim) => claim.originalText)).toEqual(
      authored.map((claim) => claim.inlines.map((inline) => inline.text).join("")),
    );
  });

  test("retains a non-lossy, claim-specific reading for every substantial legal combination", () => {
    for (const claim of lamarrPatent.claims) {
      const sourceWords = claim.originalText.trim().split(/\s+/).length;
      const readingWords = claim.plainEnglish.trim().split(/\s+/).length;
      if (sourceWords >= 75) expect(readingWords / sourceWords).toBeGreaterThanOrEqual(0.3);
    }
  });

  test("pairs every source paragraph and points every figure reference at local crops", () => {
    const paragraphIndexes = lamarrFrequencyHoppingArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    expect(
      Object.keys(lamarrFrequencyHoppingParallelReadings)
        .map(Number)
        .sort((a, b) => a - b),
    ).toEqual(paragraphIndexes);
    const figures = lamarrFrequencyHoppingArchivalEdition.blocks.flatMap((block) => {
      if (!("inlines" in block)) return [];
      return block.inlines.filter(
        (inline): inline is Extract<(typeof block.inlines)[number], { kind: "reference" }> =>
          inline.kind === "reference" && inline.referenceType === "figure",
      );
    });
    expect(new Set(figures.map((figure) => figure.text))).toEqual(
      new Set(["Fig. 1", "Fig. 2", "Fig. 3", "Fig. 4", "Fig. 5", "Fig. 6", "Fig. 7"]),
    );
    for (const figure of figures) {
      const preview = figure.figurePreviews?.[0];
      expect(preview).toBeDefined();
      expect(existsSync(resolve(process.cwd(), "public", preview?.src.slice(1) ?? ""))).toBe(true);
    }
  });

  test("keeps every substantial source paragraph paired with a non-lossy reading", () => {
    for (const [index, block] of lamarrFrequencyHoppingArchivalEdition.blocks.entries()) {
      if (block.kind !== "paragraph") continue;
      const sourceWords = block.inlines
        .map((inline) => inline.text)
        .join(" ")
        .trim()
        .split(/\s+/).length;
      const readingWords = lamarrFrequencyHoppingParallelReadings[index]
        .join(" ")
        .trim()
        .split(/\s+/).length;
      if (sourceWords >= 100) expect(readingWords / sourceWords).toBeGreaterThanOrEqual(0.3);
    }
  });

  test("publishes a reviewed ledger and validates source text", () => {
    if (lamarrPatent.archivalEdition)
      expect(lamarrPatent.archivalEdition).toBe(lamarrFrequencyHoppingArchivalEdition);
    if (lamarrPatent.originalTextAsset?.kind === "reviewed-transcription")
      expect(lamarrPatent.originalTextAsset).toMatchObject({
        kind: "reviewed-transcription",
        url: "/patents/transcripts/us-2292387-lamarr-frequency-hopping-reviewed.txt",
        pageCount: 7,
        sourcePdfSha256: lamarrFrequencyHoppingArchivalEdition.sourcePdfSha256,
      });

    const asset = lamarrPatent.originalTextAsset;
    if (asset?.kind !== "reviewed-transcription") {
      throw new Error("US 2,292,387 must retain its reviewed transcription asset.");
    }
    const ledger = readFileSync(resolve(process.cwd(), `public${asset.url}`), "utf8");
    expect(
      validateReviewedTranscriptionPageAnchors(ledger, asset.pageCount, asset.pageAnchors),
    ).toEqual({ valid: true });
  });

  test("preserves the printed formal matter and never substitutes editorial drawing summaries", () => {
    expect(lamarrFrequencyHoppingArchivalEdition.blocks[0]).toMatchObject({
      kind: "masthead",
      lines: [
        "Patented Aug. 11, 1942.",
        "2,292,387.",
        "UNITED STATES PATENT OFFICE.",
        "SECRET COMMUNICATION SYSTEM",
        "Hedy Kiesler Markey, Los Angeles, and George Antheil, Manhattan Beach, Calif.",
        "Application June 10, 1941, Serial No. 397,412.",
        "6 Claims. (Cl. 250-2.)",
      ],
    });

    const ledger = readFileSync(
      resolve(
        process.cwd(),
        "public/patents/transcripts/us-2292387-lamarr-frequency-hopping-reviewed.txt",
      ),
      "utf8",
    );
    expect(ledger).toContain("2 Sheets-Sheet 1");
    expect(ledger).toContain("2 Sheets-Sheet 2");
    expect(ledger).toContain("By Lyon Lyon");
    expect(ledger).not.toContain("[Drawing Sheet");
    expect(ledger).not.toContain("[FIGS. 4-7:");
  });

  test("keeps fabricated preamble and synthetic claims out of visitor-facing data", () => {
    const visible = JSON.stringify({
      originalText: lamarrPatent.originalText,
      claims: lamarrPatent.claims,
      source: lamarrFrequencyHoppingArchivalEdition.blocks,
    });
    expect(visible).not.toContain("To all whom it may concern");
    expect(visible).not.toContain("The method of transmitting secret control signals");
    expect(visible).toContain("means at the transmitting station for transmitting radio signals");
  });

  test("keeps canonical interpretation source-bounded and free of raw math markup", () => {
    const canonical = JSON.stringify({
      summary: lamarrPatent.summary,
      plainEnglishExplanation: lamarrPatent.plainEnglishExplanation,
      drawings: lamarrPatent.drawings,
      historicalContext: lamarrPatent.historicalContext,
      tags: lamarrPatent.tags,
      stats: lamarrPatent.stats,
    });

    for (const unsupportedLegacyClaim of [
      "10 ms",
      "88-channel LC bank",
      "455 kHz",
      "Shannon",
      "processing gain",
      "Bluetooth",
      "Wi-Fi",
      "GPS",
      "Ballet Mécanique",
      "Mark 14",
      "Pioneer Award",
      "Sylvania",
    ]) {
      expect(canonical).not.toContain(unsupportedLegacyClaim);
    }
    expect(canonical).not.toContain("$");
    expect(canonical).not.toContain("\\");
    expect(canonical).toContain("Seven tuning condensers");
    expect(canonical).toContain("Selector 61 is tuned by four capacitors");
    expect(canonical).toContain("100-cycle");
    expect(canonical).toContain("500-cycle");
    expect(canonical).toContain("record strip 37");
    expect(lamarrPatent.historicalContext.patentWars).toEqual([]);
  });
});
