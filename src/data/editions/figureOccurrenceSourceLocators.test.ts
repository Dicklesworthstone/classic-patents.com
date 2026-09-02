import { describe, expect, test } from "bun:test";
import { ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS } from "./archivalFigureAcceptance";
import {
  FIGURE_OCCURRENCE_SOURCE_LOCATORS,
  type FigureOccurrenceKey,
  type FigureOccurrenceSourceLocator,
  figureOccurrenceKey,
  normalizeSourceRectangle,
  validateFigureOccurrenceSourceLocators,
} from "./figureOccurrenceSourceLocators";

const PASTEUR_ID = "us-135245-pasteur-fermentation";
const PASTEUR_ASSETS = Object.keys(ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS[PASTEUR_ID].assets);
const PASTEUR_OCCURRENCES = {
  "edition-block-6-group-0-inline-1":
    "/patents/figures/us-135245-pasteur-fermentation/figure-1-v3.png",
  "edition-block-9-group-0-inline-1":
    "/patents/figures/us-135245-pasteur-fermentation/figure-1-v3.png",
  "edition-block-12-group-0-inline-1":
    "/patents/figures/us-135245-pasteur-fermentation/figure-2-v3.png",
} as const;
const CLAVEL_DELTA_ROBOT_ID = "us-4976582-clavel-delta-robot";
const CLAVEL_DELTA_ROBOT_ASSETS = Object.keys(
  ARCHIVAL_FIGURE_ACCEPTANCE_ATTESTATIONS[CLAVEL_DELTA_ROBOT_ID].assets,
);
const CLAVEL_DELTA_ROBOT_OCCURRENCES = {
  "edition-block-24-group-0-inline-0":
    "/patents/figures/us-4976582-clavel-delta-robot/fig-1-source-crop-v1.png",
  "edition-block-24-group-0-inline-2":
    "/patents/figures/us-4976582-clavel-delta-robot/fig-2-source-crop-v1.png",
  "edition-block-24-group-0-inline-4":
    "/patents/figures/us-4976582-clavel-delta-robot/fig-3-4-source-crop-v1.png",
  "edition-block-24-group-0-inline-6":
    "/patents/figures/us-4976582-clavel-delta-robot/fig-3-4-source-crop-v1.png",
  "edition-block-24-group-0-inline-8":
    "/patents/figures/us-4976582-clavel-delta-robot/fig-5-source-crop-v1.png",
  "edition-block-26-group-0-inline-1":
    "/patents/figures/us-4976582-clavel-delta-robot/fig-1-source-crop-v1.png",
  "edition-block-27-group-0-inline-1":
    "/patents/figures/us-4976582-clavel-delta-robot/fig-2-source-crop-v1.png",
  "edition-block-28-group-0-inline-1":
    "/patents/figures/us-4976582-clavel-delta-robot/fig-1-source-crop-v1.png",
  "edition-block-28-group-0-inline-3":
    "/patents/figures/us-4976582-clavel-delta-robot/fig-3-4-source-crop-v1.png",
  "edition-block-30-group-0-inline-1":
    "/patents/figures/us-4976582-clavel-delta-robot/fig-1-source-crop-v1.png",
  "edition-block-30-group-0-inline-3":
    "/patents/figures/us-4976582-clavel-delta-robot/fig-2-source-crop-v1.png",
  "edition-block-31-group-0-inline-1":
    "/patents/figures/us-4976582-clavel-delta-robot/fig-1-source-crop-v1.png",
  "edition-block-32-group-0-inline-1":
    "/patents/figures/us-4976582-clavel-delta-robot/fig-5-source-crop-v1.png",
  "edition-block-32-group-0-inline-3":
    "/patents/figures/us-4976582-clavel-delta-robot/fig-1-source-crop-v1.png",
  "edition-block-33-group-0-inline-1":
    "/patents/figures/us-4976582-clavel-delta-robot/fig-1-source-crop-v1.png",
} as const;
const VALIDATION_OPTIONS = {
  canonicalAssetsByPatent: {
    [PASTEUR_ID]: PASTEUR_ASSETS,
    [CLAVEL_DELTA_ROBOT_ID]: CLAVEL_DELTA_ROBOT_ASSETS,
  },
  canonicalOccurrencesByPatent: {
    [PASTEUR_ID]: PASTEUR_OCCURRENCES,
    [CLAVEL_DELTA_ROBOT_ID]: CLAVEL_DELTA_ROBOT_OCCURRENCES,
  },
  sourcePdfPageCountsByPatent: { [PASTEUR_ID]: 3, [CLAVEL_DELTA_ROBOT_ID]: 11 },
} as const;

describe("figure occurrence source locators", () => {
  test("seeds all three receipt-backed Pasteur figure occurrences", () => {
    const locators = FIGURE_OCCURRENCE_SOURCE_LOCATORS[PASTEUR_ID];
    expect(Object.keys(FIGURE_OCCURRENCE_SOURCE_LOCATORS)).toEqual([
      PASTEUR_ID,
      CLAVEL_DELTA_ROBOT_ID,
    ]);
    expect(locators).toHaveLength(3);
    expect(new Set(locators.map((locator) => locator.activeAsset))).toEqual(
      new Set(PASTEUR_ASSETS),
    );
    expect(locators.map((locator) => locator.sourcePdfPage)).toEqual([1, 1, 1]);
    expect(locators.map((locator) => locator.sourceRaster)).toEqual([
      { width: 2320, height: 3408 },
      { width: 2320, height: 3408 },
      { width: 2320, height: 3408 },
    ]);
    expect(locators.map((locator) => locator.sourceRectPixels)).toEqual([
      { x: 280, y: 620, width: 1750, height: 1150 },
      { x: 280, y: 620, width: 1750, height: 1150 },
      { x: 710, y: 1770, width: 900, height: 750 },
    ]);
  });

  test("binds every Clavel Delta occurrence to its reviewed full drawing sheet", () => {
    const locators = FIGURE_OCCURRENCE_SOURCE_LOCATORS[CLAVEL_DELTA_ROBOT_ID];
    expect(locators).toHaveLength(15);
    expect(new Set(locators.map((locator) => locator.activeAsset))).toEqual(
      new Set(CLAVEL_DELTA_ROBOT_ASSETS),
    );
    expect(locators.map((locator) => locator.sourcePdfPage)).toEqual([
      2, 3, 4, 4, 5, 2, 3, 2, 4, 2, 3, 2, 5, 2, 2,
    ]);
    expect(locators.map((locator) => locator.occurrenceKey)).toEqual(
      Object.keys(CLAVEL_DELTA_ROBOT_OCCURRENCES) as FigureOccurrenceKey[],
    );
    expect(
      locators.every(
        (locator) =>
          locator.sourceRaster.width === 5800 &&
          locator.sourceRaster.height === 8520 &&
          locator.sourceRectPixels.x === 0 &&
          locator.sourceRectPixels.y === 0 &&
          locator.sourceRectPixels.width === 5800 &&
          locator.sourceRectPixels.height === 8520 &&
          locator.evidenceReference.endsWith("#figure-crop-review-and-preservation-boundary"),
      ),
    ).toBe(true);
  });

  test("derives normalized rectangles from the exact source pixels", () => {
    const [figureOne, repeatedFigureOne, figureTwo] = FIGURE_OCCURRENCE_SOURCE_LOCATORS[PASTEUR_ID];
    expect(figureOne?.normalizedSourceRect).toEqual(
      normalizeSourceRectangle(figureOne.sourceRectPixels, figureOne.sourceRaster),
    );
    expect(figureTwo?.normalizedSourceRect).toEqual(
      normalizeSourceRectangle(figureTwo.sourceRectPixels, figureTwo.sourceRaster),
    );
    expect(repeatedFigureOne?.normalizedSourceRect).toEqual(figureOne?.normalizedSourceRect);
    expect(figureOccurrenceKey(6, 0, 1)).toBe("edition-block-6-group-0-inline-1");
  });

  test("accepts the receipt-backed registry against the active acceptance assets", () => {
    expect(
      validateFigureOccurrenceSourceLocators(FIGURE_OCCURRENCE_SOURCE_LOCATORS, {
        ...VALIDATION_OPTIONS,
      }),
    ).toEqual({ valid: true, errors: [] });
  });

  test("fails closed for non-canonical assets, escaping rectangles, and non-derived normalization", () => {
    const malformed = structuredClone(FIGURE_OCCURRENCE_SOURCE_LOCATORS);
    const locator = malformed[PASTEUR_ID][0];
    locator.activeAsset = "/patents/figures/us-381968-tesla-motor/fig-1-source-crop-v2.png";
    locator.sourceRectPixels.width = 3000;
    locator.normalizedSourceRect.x = 0.4;

    const result = validateFigureOccurrenceSourceLocators(malformed, VALIDATION_OPTIONS);
    expect(result.valid).toBe(false);
    expect(result.errors.join("\n")).toContain("active asset is not canonical for this patent");
    expect(result.errors.join("\n")).toContain("source pixel rectangle exceeds the source raster");
    expect(result.errors.join("\n")).toContain("normalized x is not mechanically derived");
  });

  test("requires explicit source-page evidence rather than deriving a page from an asset path", () => {
    const malformed = structuredClone(FIGURE_OCCURRENCE_SOURCE_LOCATORS);
    malformed[PASTEUR_ID][0].sourcePdfPage = 0;
    const result = validateFigureOccurrenceSourceLocators(malformed, VALIDATION_OPTIONS);
    expect(result.valid).toBe(false);
    expect(result.errors.join("\n")).toContain("source PDF page must be a positive integer");
  });

  test("refuses missing occurrences, stale occurrences, and pages outside the reviewed PDF", () => {
    const malformed = structuredClone(FIGURE_OCCURRENCE_SOURCE_LOCATORS) as unknown as Record<
      string,
      FigureOccurrenceSourceLocator[]
    >;
    malformed[PASTEUR_ID].shift();
    malformed[PASTEUR_ID][0].occurrenceKey = figureOccurrenceKey(99, 0, 0);
    malformed[PASTEUR_ID][1].sourcePdfPage = 4;

    const result = validateFigureOccurrenceSourceLocators(malformed, VALIDATION_OPTIONS);
    expect(result.valid).toBe(false);
    expect(result.errors.join("\n")).toContain(
      "locator count does not equal the active edition figure-occurrence count",
    );
    expect(result.errors.join("\n")).toContain("active edition occurrence has no locator");
    expect(result.errors.join("\n")).toContain(
      "locator is not bound to an active edition occurrence",
    );
    expect(result.errors.join("\n")).toContain(
      "source PDF page exceeds the reviewed facsimile page count",
    );
  });
});
