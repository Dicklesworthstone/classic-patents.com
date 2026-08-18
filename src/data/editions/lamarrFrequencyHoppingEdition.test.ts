import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { lamarrPatent } from "@/data/patents/lamarr-frequency-hopping";
import {
  lamarrFrequencyHoppingArchivalEdition,
  lamarrFrequencyHoppingParallelReadings,
} from "./lamarrFrequencyHoppingEdition";

describe("US 2,292,387 manual source edition", () => {
  test("pins all seven reviewed source sheets and every printed claim", () => {
    expect(lamarrPatent.archivalEdition).toBe(lamarrFrequencyHoppingArchivalEdition);
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
