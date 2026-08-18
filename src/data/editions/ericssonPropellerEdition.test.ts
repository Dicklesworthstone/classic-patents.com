import { describe, expect, test } from "bun:test";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import {
  ericssonPropellerArchivalEdition,
  ericssonPropellerParallelReadings,
} from "@/data/editions/ericssonPropellerEdition";

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
});
