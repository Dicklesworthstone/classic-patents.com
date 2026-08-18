import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import {
  hyattCelluloidArchivalEdition,
  hyattCelluloidParallelReadings,
} from "@/data/editions/hyattCelluloidEdition";
import { hyattCelluloidPatent } from "@/data/patents/hyatt-celluloid";

describe("hyattCelluloidArchivalEdition", () => {
  test("is a complete manual edition pinned to the reviewed US 105,338 facsimile", () => {
    expect(validateCuratedSpecificationEdition(hyattCelluloidArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    expect(hyattCelluloidArchivalEdition.sourcePdfSha256).toBe(
      "186dd64b072c5a1182eac0c9c2cb4d2edb20f17296f3e5d934c9114ed684df82",
    );
    expect(
      existsSync(join(process.cwd(), "public/patents/pdfs/us-105338-hyatt-celluloid.pdf")),
    ).toBe(true);
    expect(
      readFileSync(join(process.cwd(), "docs/provenance/us-105338-hyatt-celluloid.md"), "utf8"),
    ).toContain("186dd64b072c5a1182eac0c9c2cb4d2edb20f17296f3e5d934c9114ed684df82");
  });

  test("preserves all three printed claims exactly and decodes the same claims canonically", () => {
    const sourceClaims = hyattCelluloidArchivalEdition.blocks.filter(
      (block) => block.kind === "claim",
    );
    expect(sourceClaims).toHaveLength(3);
    expect(sourceClaims.map((claim) => claim.number)).toEqual([1, 2, 3]);
    expect(
      sourceClaims.map((claim) => claim.inlines.map((inline) => inline.text).join("")),
    ).toEqual(hyattCelluloidPatent.claims.map((claim) => claim.originalText));
    expect(hyattCelluloidPatent.claims.map((claim) => claim.number)).toEqual([1, 2, 3]);
    expect(hyattCelluloidPatent.claims[2]?.dependsOn).toEqual([2]);
  });

  test("keeps the unknown filing date null instead of substituting the grant date", () => {
    expect(hyattCelluloidPatent.grantDate).toBe("1870-07-12");
    expect(hyattCelluloidPatent.filingDate).toBeNull();
    expect(
      readFileSync(join(process.cwd(), "docs/provenance/us-105338-hyatt-celluloid.md"), "utf8"),
    ).toContain("does not substitute the grant or execution date");
  });

  test("records the source-true absence of figures rather than inventing a press drawing", () => {
    expect(hyattCelluloidPatent.drawings).toEqual([]);
    expect(
      hyattCelluloidArchivalEdition.blocks.some((block) => block.kind === "figure-sheet"),
    ).toBe(false);
    const sourceText = JSON.stringify(hyattCelluloidArchivalEdition.blocks);
    expect(sourceText).not.toContain("Fig. 1");
    expect(sourceText).not.toContain("drawing-sheet-preview.png");
  });

  test("exports complete direct paragraph companions and omits formal claims", () => {
    const paragraphIndexes = hyattCelluloidArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    const readingIndexes = Object.keys(hyattCelluloidParallelReadings)
      .map(Number)
      .sort((left, right) => left - right);

    expect(readingIndexes).toEqual(paragraphIndexes);
    expect(readingIndexes).toEqual([1, 2, 3, 4, 6, 10]);
    expect(
      Object.values(hyattCelluloidParallelReadings).every(
        (reading) => Array.isArray(reading) && reading.length > 0 && reading.join(" ").length > 120,
      ),
    ).toBe(true);
    expect(hyattCelluloidParallelReadings[7]).toBeUndefined();
    expect(hyattCelluloidParallelReadings[8]).toBeUndefined();
    expect(hyattCelluloidParallelReadings[9]).toBeUndefined();

    const detailedSource = hyattCelluloidArchivalEdition.blocks[3];
    if (detailedSource?.kind !== "paragraph")
      throw new Error("US 105,338 process paragraph missing.");
    const sourceWords = detailedSource.inlines
      .map((inline) => inline.text)
      .join(" ")
      .trim()
      .split(/\s+/).length;
    const companionWords =
      hyattCelluloidParallelReadings[3]?.join(" ").trim().split(/\s+/).length ?? 0;
    expect(companionWords / sourceWords).toBeGreaterThanOrEqual(0.3);
  });

  test("fails closed for a malformed edition with no printed legal claims", () => {
    expect(
      validateCuratedSpecificationEdition({
        ...hyattCelluloidArchivalEdition,
        blocks: hyattCelluloidArchivalEdition.blocks.filter((block) => block.kind !== "claim"),
      }).valid,
    ).toBe(false);

    expect(
      hyattCelluloidArchivalEdition.blocks.filter((block) => block.kind === "claim").length,
    ).toBe(3);
  });
});
