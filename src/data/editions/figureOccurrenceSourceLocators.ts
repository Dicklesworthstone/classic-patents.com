/**
 * Source-locator evidence for an individual archival figure occurrence.
 *
 * This is deliberately separate from figure acceptance until the publication
 * boundary is migrated to consume it. A locator is authored from an explicit
 * facsimile receipt; neither a filename nor a preview's output dimensions can
 * supply a PDF page or a source rectangle.
 */

export const FIGURE_OCCURRENCE_KEY_PATTERN =
  /^edition-block-(?<block>0|[1-9]\d*)-group-(?<group>0|[1-9]\d*)-inline-(?<inline>0|[1-9]\d*)$/;

export type FigureOccurrenceKey = `edition-block-${number}-group-${number}-inline-${number}`;

export interface SourcePixelRectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface NormalizedSourceRectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FigureOccurrenceSourceLocator {
  occurrenceKey: FigureOccurrenceKey;
  activeAsset: string;
  sourcePdfPage: number;
  sourceRaster: { width: number; height: number };
  sourceRectPixels: SourcePixelRectangle;
  /** Derived from sourceRectPixels/sourceRaster, never independently authored. */
  normalizedSourceRect: NormalizedSourceRectangle;
  reviewer: string;
  reviewedAt: string;
  /** Durable path and location of the receipt evidence for this exact crop. */
  evidenceReference: string;
}

export type FigureOccurrenceSourceLocatorRegistry = Readonly<
  Record<string, readonly FigureOccurrenceSourceLocator[]>
>;

export interface FigureOccurrenceLocatorValidationOptions {
  /**
   * The active assets permitted for each patent by the current edition/
   * acceptance layer. Supplying this prevents a locator from authorizing an
   * arbitrary plausible-looking crop path.
   */
  canonicalAssetsByPatent?: Readonly<Record<string, readonly string[]>>;
  /** Exact active edition occurrences and their current first preview asset. */
  canonicalOccurrencesByPatent?: Readonly<Record<string, Readonly<Record<string, string | null>>>>;
  /** Reviewed facsimile page count; locators may never name a later page. */
  sourcePdfPageCountsByPatent?: Readonly<Record<string, number>>;
  tolerance?: number;
}

export interface FigureOccurrenceLocatorValidation {
  valid: boolean;
  errors: readonly string[];
}

const DEFAULT_TOLERANCE = 1e-12;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const CANONICAL_FIGURE_ASSET = /^\/patents\/figures\/([^/]+)\/[^/]+\.png$/;

export function figureOccurrenceKey(
  blockIndex: number,
  groupIndex: number,
  inlineIndex: number,
): FigureOccurrenceKey {
  for (const [name, value] of [
    ["blockIndex", blockIndex],
    ["groupIndex", groupIndex],
    ["inlineIndex", inlineIndex],
  ] as const) {
    if (!Number.isSafeInteger(value) || value < 0) {
      throw new Error(`${name} must be a non-negative safe integer.`);
    }
  }
  return `edition-block-${blockIndex}-group-${groupIndex}-inline-${inlineIndex}`;
}

export function normalizeSourceRectangle(
  sourceRectPixels: SourcePixelRectangle,
  sourceRaster: { width: number; height: number },
): NormalizedSourceRectangle {
  return {
    x: sourceRectPixels.x / sourceRaster.width,
    y: sourceRectPixels.y / sourceRaster.height,
    width: sourceRectPixels.width / sourceRaster.width,
    height: sourceRectPixels.height / sourceRaster.height,
  };
}

function positiveInteger(value: number): boolean {
  return Number.isSafeInteger(value) && value > 0;
}

function nonNegativeInteger(value: number): boolean {
  return Number.isSafeInteger(value) && value >= 0;
}

function approximatelyEqual(left: number, right: number, tolerance: number): boolean {
  return Math.abs(left - right) <= tolerance;
}

/**
 * Validates stored evidence only. It intentionally has no PDF/page inference
 * path: callers must supply an explicit page and exact source-pixel rectangle.
 */
export function validateFigureOccurrenceSourceLocators(
  registry: FigureOccurrenceSourceLocatorRegistry,
  options: FigureOccurrenceLocatorValidationOptions = {},
): FigureOccurrenceLocatorValidation {
  const errors: string[] = [];
  const tolerance = options.tolerance ?? DEFAULT_TOLERANCE;
  if (!(Number.isFinite(tolerance) && tolerance >= 0 && tolerance <= 1e-6)) {
    errors.push("Locator tolerance must be finite, non-negative, and at most 1e-6.");
    return { valid: false, errors };
  }

  for (const [patentId, locators] of Object.entries(registry)) {
    const seenOccurrences = new Set<string>();
    for (const locator of locators) {
      const prefix = `${patentId} ${locator.occurrenceKey}`;
      if (!FIGURE_OCCURRENCE_KEY_PATTERN.test(locator.occurrenceKey)) {
        errors.push(`${prefix}: occurrence key is not canonical.`);
      }
      if (seenOccurrences.has(locator.occurrenceKey)) {
        errors.push(`${prefix}: duplicate occurrence key.`);
      }
      seenOccurrences.add(locator.occurrenceKey);

      const assetMatch = CANONICAL_FIGURE_ASSET.exec(locator.activeAsset);
      if (!assetMatch || assetMatch[1] !== patentId) {
        errors.push(`${prefix}: active asset is not canonical for this patent.`);
      }
      const permittedAssets = options.canonicalAssetsByPatent?.[patentId];
      if (!permittedAssets) {
        errors.push(`${prefix}: canonical active-asset evidence is required.`);
      } else if (!permittedAssets.includes(locator.activeAsset)) {
        errors.push(`${prefix}: active asset is not in the supplied canonical asset set.`);
      }

      if (!positiveInteger(locator.sourcePdfPage)) {
        errors.push(`${prefix}: source PDF page must be a positive integer.`);
      } else {
        const pageCount = options.sourcePdfPageCountsByPatent?.[patentId];
        if (pageCount !== undefined && locator.sourcePdfPage > pageCount) {
          errors.push(`${prefix}: source PDF page exceeds the reviewed facsimile page count.`);
        }
      }
      if (
        !positiveInteger(locator.sourceRaster.width) ||
        !positiveInteger(locator.sourceRaster.height)
      ) {
        errors.push(`${prefix}: source raster dimensions must be positive integers.`);
      }
      const rectangle = locator.sourceRectPixels;
      if (
        !nonNegativeInteger(rectangle.x) ||
        !nonNegativeInteger(rectangle.y) ||
        !positiveInteger(rectangle.width) ||
        !positiveInteger(rectangle.height)
      ) {
        errors.push(
          `${prefix}: source pixel rectangle must use non-negative origin and positive integers.`,
        );
      } else if (
        rectangle.x + rectangle.width > locator.sourceRaster.width ||
        rectangle.y + rectangle.height > locator.sourceRaster.height
      ) {
        errors.push(`${prefix}: source pixel rectangle exceeds the source raster.`);
      }

      const expectedNormalized = normalizeSourceRectangle(rectangle, locator.sourceRaster);
      for (const component of ["x", "y", "width", "height"] as const) {
        const actual = locator.normalizedSourceRect[component];
        if (!(Number.isFinite(actual) && actual >= 0 && actual <= 1)) {
          errors.push(`${prefix}: normalized ${component} must be within [0, 1].`);
        } else if (!approximatelyEqual(actual, expectedNormalized[component], tolerance)) {
          errors.push(
            `${prefix}: normalized ${component} is not mechanically derived from source pixels.`,
          );
        }
      }
      if (
        locator.normalizedSourceRect.x + locator.normalizedSourceRect.width > 1 + tolerance ||
        locator.normalizedSourceRect.y + locator.normalizedSourceRect.height > 1 + tolerance
      ) {
        errors.push(`${prefix}: normalized source rectangle exceeds [0, 1].`);
      }

      if (!locator.reviewer.trim()) errors.push(`${prefix}: reviewer is required.`);
      if (!ISO_DATE.test(locator.reviewedAt))
        errors.push(`${prefix}: reviewedAt must be an ISO date.`);
      if (!locator.evidenceReference.startsWith(`docs/provenance/${patentId}.md#`)) {
        errors.push(
          `${prefix}: evidence reference must identify this patent's provenance receipt.`,
        );
      }
    }

    const canonicalOccurrences = options.canonicalOccurrencesByPatent?.[patentId];
    if (canonicalOccurrences) {
      const canonicalEntries = Object.entries(canonicalOccurrences);
      if (canonicalEntries.length !== locators.length) {
        errors.push(
          `${patentId}: locator count does not equal the active edition figure-occurrence count.`,
        );
      }
      for (const [occurrenceKey, activeAsset] of canonicalEntries) {
        const locator = locators.find((candidate) => candidate.occurrenceKey === occurrenceKey);
        if (!locator) {
          errors.push(`${patentId} ${occurrenceKey}: active edition occurrence has no locator.`);
        } else if (locator.activeAsset !== activeAsset) {
          errors.push(
            `${patentId} ${occurrenceKey}: locator asset does not match the active edition.`,
          );
        }
      }
      for (const locator of locators) {
        if (!(locator.occurrenceKey in canonicalOccurrences)) {
          errors.push(
            `${patentId} ${locator.occurrenceKey}: locator is not bound to an active edition occurrence.`,
          );
        }
      }
    }
  }
  return { valid: errors.length === 0, errors };
}

const PASTEUR_SOURCE_RASTER = { width: 2320, height: 3408 } as const;
const PASTEUR_EVIDENCE_REFERENCE =
  "docs/provenance/us-135245-pasteur-fermentation.md#figure-crop-review-and-preservation-boundary";
const CLAVEL_DELTA_ROBOT_SOURCE_RASTER = { width: 5800, height: 8520 } as const;
const CLAVEL_DELTA_ROBOT_EVIDENCE_REFERENCE =
  "docs/provenance/us-4976582-clavel-delta-robot.md#figure-crop-review-and-preservation-boundary";

function pasteurLocator(args: {
  occurrenceKey: FigureOccurrenceKey;
  activeAsset: string;
  sourceRectPixels: SourcePixelRectangle;
}): FigureOccurrenceSourceLocator {
  return {
    ...args,
    sourcePdfPage: 1,
    sourceRaster: PASTEUR_SOURCE_RASTER,
    normalizedSourceRect: normalizeSourceRectangle(args.sourceRectPixels, PASTEUR_SOURCE_RASTER),
    reviewer: "CopperLotus; GoldStone full facsimile repair review",
    reviewedAt: "2026-08-20",
    evidenceReference: PASTEUR_EVIDENCE_REFERENCE,
  };
}

function clavelDeltaRobotLocator(args: {
  occurrenceKey: FigureOccurrenceKey;
  activeAsset: string;
  sourcePdfPage: number;
}): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: CLAVEL_DELTA_ROBOT_SOURCE_RASTER.width,
    height: CLAVEL_DELTA_ROBOT_SOURCE_RASTER.height,
  };
  return {
    ...args,
    sourceRaster: CLAVEL_DELTA_ROBOT_SOURCE_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(
      sourceRectPixels,
      CLAVEL_DELTA_ROBOT_SOURCE_RASTER,
    ),
    reviewer: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-09-02",
    evidenceReference: CLAVEL_DELTA_ROBOT_EVIDENCE_REFERENCE,
  };
}

/**
 * Seed only receipt-backed active assets. Pasteur's receipt explicitly records
 * all three authored specification citations and binds both Figure 1 citations
 * to the same exact v3 source crop, so the repeated occurrence is mapped
 * explicitly rather than inferred from its filename.
 */
export const FIGURE_OCCURRENCE_SOURCE_LOCATORS = {
  "us-135245-pasteur-fermentation": [
    pasteurLocator({
      occurrenceKey: figureOccurrenceKey(6, 0, 1),
      activeAsset: "/patents/figures/us-135245-pasteur-fermentation/figure-1-v3.png",
      sourceRectPixels: { x: 280, y: 620, width: 1750, height: 1150 },
    }),
    pasteurLocator({
      occurrenceKey: figureOccurrenceKey(9, 0, 1),
      activeAsset: "/patents/figures/us-135245-pasteur-fermentation/figure-1-v3.png",
      sourceRectPixels: { x: 280, y: 620, width: 1750, height: 1150 },
    }),
    pasteurLocator({
      occurrenceKey: figureOccurrenceKey(12, 0, 1),
      activeAsset: "/patents/figures/us-135245-pasteur-fermentation/figure-2-v3.png",
      sourceRectPixels: { x: 710, y: 1770, width: 900, height: 750 },
    }),
  ],
  "us-4976582-clavel-delta-robot": [
    clavelDeltaRobotLocator({
      occurrenceKey: figureOccurrenceKey(24, 0, 0),
      activeAsset: "/patents/figures/us-4976582-clavel-delta-robot/fig-1-source-crop-v1.png",
      sourcePdfPage: 2,
    }),
    clavelDeltaRobotLocator({
      occurrenceKey: figureOccurrenceKey(24, 0, 2),
      activeAsset: "/patents/figures/us-4976582-clavel-delta-robot/fig-2-source-crop-v1.png",
      sourcePdfPage: 3,
    }),
    clavelDeltaRobotLocator({
      occurrenceKey: figureOccurrenceKey(24, 0, 4),
      activeAsset: "/patents/figures/us-4976582-clavel-delta-robot/fig-3-4-source-crop-v1.png",
      sourcePdfPage: 4,
    }),
    clavelDeltaRobotLocator({
      occurrenceKey: figureOccurrenceKey(24, 0, 6),
      activeAsset: "/patents/figures/us-4976582-clavel-delta-robot/fig-3-4-source-crop-v1.png",
      sourcePdfPage: 4,
    }),
    clavelDeltaRobotLocator({
      occurrenceKey: figureOccurrenceKey(24, 0, 8),
      activeAsset: "/patents/figures/us-4976582-clavel-delta-robot/fig-5-source-crop-v1.png",
      sourcePdfPage: 5,
    }),
    clavelDeltaRobotLocator({
      occurrenceKey: figureOccurrenceKey(26, 0, 1),
      activeAsset: "/patents/figures/us-4976582-clavel-delta-robot/fig-1-source-crop-v1.png",
      sourcePdfPage: 2,
    }),
    clavelDeltaRobotLocator({
      occurrenceKey: figureOccurrenceKey(27, 0, 1),
      activeAsset: "/patents/figures/us-4976582-clavel-delta-robot/fig-2-source-crop-v1.png",
      sourcePdfPage: 3,
    }),
    clavelDeltaRobotLocator({
      occurrenceKey: figureOccurrenceKey(28, 0, 1),
      activeAsset: "/patents/figures/us-4976582-clavel-delta-robot/fig-1-source-crop-v1.png",
      sourcePdfPage: 2,
    }),
    clavelDeltaRobotLocator({
      occurrenceKey: figureOccurrenceKey(28, 0, 3),
      activeAsset: "/patents/figures/us-4976582-clavel-delta-robot/fig-3-4-source-crop-v1.png",
      sourcePdfPage: 4,
    }),
    clavelDeltaRobotLocator({
      occurrenceKey: figureOccurrenceKey(30, 0, 1),
      activeAsset: "/patents/figures/us-4976582-clavel-delta-robot/fig-1-source-crop-v1.png",
      sourcePdfPage: 2,
    }),
    clavelDeltaRobotLocator({
      occurrenceKey: figureOccurrenceKey(30, 0, 3),
      activeAsset: "/patents/figures/us-4976582-clavel-delta-robot/fig-2-source-crop-v1.png",
      sourcePdfPage: 3,
    }),
    clavelDeltaRobotLocator({
      occurrenceKey: figureOccurrenceKey(31, 0, 1),
      activeAsset: "/patents/figures/us-4976582-clavel-delta-robot/fig-1-source-crop-v1.png",
      sourcePdfPage: 2,
    }),
    clavelDeltaRobotLocator({
      occurrenceKey: figureOccurrenceKey(32, 0, 1),
      activeAsset: "/patents/figures/us-4976582-clavel-delta-robot/fig-5-source-crop-v1.png",
      sourcePdfPage: 5,
    }),
    clavelDeltaRobotLocator({
      occurrenceKey: figureOccurrenceKey(32, 0, 3),
      activeAsset: "/patents/figures/us-4976582-clavel-delta-robot/fig-1-source-crop-v1.png",
      sourcePdfPage: 2,
    }),
    clavelDeltaRobotLocator({
      occurrenceKey: figureOccurrenceKey(33, 0, 1),
      activeAsset: "/patents/figures/us-4976582-clavel-delta-robot/fig-1-source-crop-v1.png",
      sourcePdfPage: 2,
    }),
  ],
} as const satisfies FigureOccurrenceSourceLocatorRegistry;
