import { describe, expect, test } from "bun:test";
import { existsSync } from "node:fs";
import { validateCuratedSpecificationEdition } from "../archivalEditionValidation";
import { whitneyCottonGinPatent } from "../patents/whitney-cotton-gin";
import { isArchivalEditionExplicitlyWithheld } from "./publicationApproval";
import { whitneyCottonGinArchivalEdition } from "./whitneyCottonGinEdition";
import { whitneyCottonGinParallelReadings } from "./whitneyCottonGinParallelReading";

const ACTIVE_SOURCE_SHEETS = {
  1: "/patents/figures/us-x72-whitney-cotton-gin/source-sheet-1-v1.png",
  2: "/patents/figures/us-x72-whitney-cotton-gin/source-sheet-2-v1.png",
  3: "/patents/figures/us-x72-whitney-cotton-gin/source-sheet-3-v1.png",
} as const;

const EXPECTED_SOURCE_SHEET_BY_OCCURRENCE = {
  "edition-block-1-group-0-inline-1": ACTIVE_SOURCE_SHEETS[1],
  "edition-block-7-group-0-inline-1": ACTIVE_SOURCE_SHEETS[1],
  "edition-block-9-group-0-inline-1": ACTIVE_SOURCE_SHEETS[1],
  "edition-block-10-group-0-inline-1": ACTIVE_SOURCE_SHEETS[2],
  "edition-block-10-group-0-inline-3": ACTIVE_SOURCE_SHEETS[3],
  "edition-block-11-group-0-inline-1": ACTIVE_SOURCE_SHEETS[2],
  "edition-block-11-group-0-inline-3": ACTIVE_SOURCE_SHEETS[1],
  "edition-block-12-group-0-inline-1": ACTIVE_SOURCE_SHEETS[3],
  "edition-block-14-group-0-inline-1": ACTIVE_SOURCE_SHEETS[3],
  "edition-block-14-group-0-inline-3": ACTIVE_SOURCE_SHEETS[3],
  "edition-block-17-group-0-inline-1": ACTIVE_SOURCE_SHEETS[3],
  "edition-block-17-group-0-inline-3": ACTIVE_SOURCE_SHEETS[1],
  "edition-block-17-group-0-inline-5": ACTIVE_SOURCE_SHEETS[2],
  "edition-block-17-group-0-inline-7": ACTIVE_SOURCE_SHEETS[1],
  "edition-block-18-group-0-inline-1": ACTIVE_SOURCE_SHEETS[1],
  "edition-block-19-group-0-inline-1": ACTIVE_SOURCE_SHEETS[3],
  "edition-block-20-group-0-inline-1": ACTIVE_SOURCE_SHEETS[3],
  "edition-block-22-group-0-inline-1": ACTIVE_SOURCE_SHEETS[1],
  "edition-block-23-group-0-inline-1": ACTIVE_SOURCE_SHEETS[3],
  "edition-block-25-group-0-inline-1": ACTIVE_SOURCE_SHEETS[3],
  "edition-block-26-group-0-inline-1": ACTIVE_SOURCE_SHEETS[1],
  "edition-block-26-group-0-inline-3": ACTIVE_SOURCE_SHEETS[1],
  "edition-block-27-group-0-inline-1": ACTIVE_SOURCE_SHEETS[3],
  "edition-block-30-group-0-inline-1": ACTIVE_SOURCE_SHEETS[1],
  "edition-block-31-group-0-inline-1": ACTIVE_SOURCE_SHEETS[1],
} as const;

describe("US X72 Whitney cotton-gin manual edition", () => {
  test("is an internally valid no-formal-claims source draft", () => {
    expect(validateCuratedSpecificationEdition(whitneyCottonGinArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    expect(whitneyCottonGinArchivalEdition.claimStatus?.kind).toBe("no-formal-claims-in-facsimile");
    expect(whitneyCottonGinPatent.claims).toEqual([]);
    expect(whitneyCottonGinPatent.stats).toMatchObject({
      totalClaims: 0,
      independentClaims: 0,
    });
  });

  test("has a direct non-lossy companion for every source paragraph", () => {
    for (const [index, block] of whitneyCottonGinArchivalEdition.blocks.entries()) {
      if (block.kind !== "paragraph") continue;
      const companion = whitneyCottonGinParallelReadings[index];
      expect(companion, `missing companion reading for block ${index}`).toBeDefined();
      expect(companion?.join(" ").trim().length).toBeGreaterThan(20);
    }
  });

  test("rejects removal of the evidence-backed no-claims state", () => {
    const withoutAttestation = { ...whitneyCottonGinArchivalEdition, claimStatus: undefined };
    expect(validateCuratedSpecificationEdition(withoutAttestation).valid).toBe(false);
  });

  test("does not leave source figure citations stranded in plain text nodes", () => {
    const bareFigureCitation = /\bFig(?:s)?\.\s*\d+/i;

    for (const block of whitneyCottonGinArchivalEdition.blocks) {
      if (!("inlines" in block)) continue;
      for (const inline of block.inlines) {
        if (inline.kind === "text") {
          expect(inline.text).not.toMatch(bareFigureCitation);
        }
      }
    }
  });

  test("binds each active figure occurrence to the direct full-page source evidence", () => {
    const activeOccurrences: Array<readonly [string, string]> = [];

    for (const [blockIndex, block] of whitneyCottonGinArchivalEdition.blocks.entries()) {
      const inlineGroups =
        block.kind === "figure-sheet"
          ? [block.description]
          : "inlines" in block
            ? [block.inlines]
            : [];
      for (const [groupIndex, inlines] of inlineGroups.entries()) {
        for (const [inlineIndex, inline] of inlines.entries()) {
          if (inline.kind !== "reference" || inline.referenceType !== "figure") continue;
          const preview = inline.figurePreviews?.[0];
          const figureNumber = /\d+$/.exec(inline.text)?.[0];
          expect(preview, `missing preview for ${inline.text}`).toBeDefined();
          expect(figureNumber, `missing figure number in ${inline.text}`).toBeDefined();
          expect(inline.href).toBe(`#figure-${figureNumber}`);
          expect(preview?.width).toBe(2320);
          expect(preview?.height).toBe(3408);
          expect(preview?.alt).toContain("Full 300 DPI raster");
          activeOccurrences.push([
            `edition-block-${blockIndex}-group-${groupIndex}-inline-${inlineIndex}`,
            preview?.src ?? "",
          ]);
        }
      }
    }

    expect(activeOccurrences).toEqual(Object.entries(EXPECTED_SOURCE_SHEET_BY_OCCURRENCE));
    for (const sourceAsset of Object.values(ACTIVE_SOURCE_SHEETS)) {
      expect(existsSync(`public${sourceAsset}`)).toBe(true);
    }
  });

  test("names the missing-label boundary instead of presenting a mismatched crop as evidence", () => {
    const labelsWithKnownPacketGaps = new Set(["Fig. 2", "Fig. 8", "Fig. 9", "Fig. 10"]);
    const gapReferences = whitneyCottonGinArchivalEdition.blocks.flatMap((block) => {
      const inlines =
        block.kind === "figure-sheet" ? block.description : "inlines" in block ? block.inlines : [];
      return inlines.filter(
        (inline): inline is Extract<typeof inline, { kind: "reference" }> =>
          inline.kind === "reference" &&
          inline.referenceType === "figure" &&
          labelsWithKnownPacketGaps.has(inline.text),
      );
    });

    expect(gapReferences).toHaveLength(6);
    for (const reference of gapReferences) {
      expect(reference.figurePreviews?.[0]?.alt).toMatch(/not an unlettered|does not print/);
      expect(reference.figurePreviews?.[0]?.src).toMatch(/source-sheet-[23]-v1\.png$/);
    }
  });

  test("publishes the bound edition with figure citations tied to the pinned source", () => {
    expect(isArchivalEditionExplicitlyWithheld("us-x72-whitney-cotton-gin")).toBe(false);
    expect(whitneyCottonGinPatent.archivalEdition).toBe(whitneyCottonGinArchivalEdition);
  });
});
