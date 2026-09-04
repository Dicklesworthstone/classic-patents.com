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
const COLT_REVOLVER_SOURCE_RASTER = { width: 4800, height: 6800 } as const;
const COLT_REVOLVER_EVIDENCE_REFERENCE =
  "docs/provenance/us-x9430-colt-revolver.md#exact-source-locators";

function coltRevolverLocator(args: {
  occurrenceKey: FigureOccurrenceKey;
  activeAsset: string;
  sourcePdfPage: number;
}): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: COLT_REVOLVER_SOURCE_RASTER.width,
    height: COLT_REVOLVER_SOURCE_RASTER.height,
  };
  return {
    ...args,
    sourceRaster: COLT_REVOLVER_SOURCE_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(sourceRectPixels, COLT_REVOLVER_SOURCE_RASTER),
    reviewer: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-08-18",
    evidenceReference: COLT_REVOLVER_EVIDENCE_REFERENCE,
  };
}

const KAMEN_MEDICATION_INJECTION_SOURCE_RASTER = { width: 9667, height: 14200 } as const;
const KAMEN_MEDICATION_INJECTION_EVIDENCE_REFERENCE =
  "docs/provenance/us-3858581-kamen-medication-injection-device.md#figure-crop-review-and-preservation-boundary";
const KAMEN_MEDICATION_INJECTION_CROPS = {
  1: {
    activeAsset:
      "/patents/figures/us-3858581-kamen-medication-injection-device/fig-1-source-crop-v2.png",
    sourcePdfPage: 2,
    sourceRectPixels: { x: 500, y: 1850, width: 8700, height: 3400 },
  },
  2: {
    activeAsset:
      "/patents/figures/us-3858581-kamen-medication-injection-device/fig-2-source-crop-v2.png",
    sourcePdfPage: 2,
    sourceRectPixels: { x: 350, y: 5100, width: 9000, height: 3250 },
  },
  3: {
    activeAsset:
      "/patents/figures/us-3858581-kamen-medication-injection-device/fig-3-source-crop-v2.png",
    sourcePdfPage: 2,
    sourceRectPixels: { x: 500, y: 9000, width: 8700, height: 4200 },
  },
  4: {
    activeAsset:
      "/patents/figures/us-3858581-kamen-medication-injection-device/fig-4-source-crop-v2.png",
    sourcePdfPage: 3,
    sourceRectPixels: { x: 600, y: 1700, width: 4000, height: 4200 },
  },
  5: {
    activeAsset:
      "/patents/figures/us-3858581-kamen-medication-injection-device/fig-5-source-crop-v2.png",
    sourcePdfPage: 3,
    sourceRectPixels: { x: 4000, y: 3400, width: 4300, height: 3200 },
  },
  6: {
    activeAsset:
      "/patents/figures/us-3858581-kamen-medication-injection-device/fig-6-source-crop-v2.png",
    sourcePdfPage: 3,
    sourceRectPixels: { x: 600, y: 6000, width: 8500, height: 7300 },
  },
} as const;

function kamenMedicationInjectionLocator(args: {
  occurrenceKey: FigureOccurrenceKey;
  figure: keyof typeof KAMEN_MEDICATION_INJECTION_CROPS;
}): FigureOccurrenceSourceLocator {
  const crop = KAMEN_MEDICATION_INJECTION_CROPS[args.figure];
  return {
    occurrenceKey: args.occurrenceKey,
    activeAsset: crop.activeAsset,
    sourcePdfPage: crop.sourcePdfPage,
    sourceRaster: KAMEN_MEDICATION_INJECTION_SOURCE_RASTER,
    sourceRectPixels: crop.sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(
      crop.sourceRectPixels,
      KAMEN_MEDICATION_INJECTION_SOURCE_RASTER,
    ),
    reviewer: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-09-02",
    evidenceReference: KAMEN_MEDICATION_INJECTION_EVIDENCE_REFERENCE,
  };
}

const SIKORSKY_HELICOPTER_SOURCE_RASTER = { width: 2320, height: 3408 } as const;
const SIKORSKY_HELICOPTER_EVIDENCE_REFERENCE =
  "docs/provenance/us-2318259-sikorsky-helicopter.md#figure-crop-review-and-preservation-boundary";

function sikorskyHelicopterLocator(args: {
  occurrenceKey: FigureOccurrenceKey;
  activeAsset: string;
  sourcePdfPage: number;
}): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: SIKORSKY_HELICOPTER_SOURCE_RASTER.width,
    height: SIKORSKY_HELICOPTER_SOURCE_RASTER.height,
  };
  return {
    ...args,
    sourceRaster: SIKORSKY_HELICOPTER_SOURCE_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(
      sourceRectPixels,
      SIKORSKY_HELICOPTER_SOURCE_RASTER,
    ),
    reviewer: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-09-02",
    evidenceReference: SIKORSKY_HELICOPTER_EVIDENCE_REFERENCE,
  };
}

const METCALFE_ETHERNET_SOURCE_RASTER = { width: 2320, height: 3408 } as const;
const METCALFE_ETHERNET_EVIDENCE_REFERENCE =
  "docs/provenance/us-4063220-metcalfe-ethernet.md#figure-crop-review-and-preservation-boundary";

function metcalfeEthernetLocator(args: {
  occurrenceKey: FigureOccurrenceKey;
  activeAsset: string;
  sourcePdfPage: number;
}): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: METCALFE_ETHERNET_SOURCE_RASTER.width,
    height: METCALFE_ETHERNET_SOURCE_RASTER.height,
  };
  return {
    ...args,
    sourceRaster: METCALFE_ETHERNET_SOURCE_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(
      sourceRectPixels,
      METCALFE_ETHERNET_SOURCE_RASTER,
    ),
    reviewer: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-09-02",
    evidenceReference: METCALFE_ETHERNET_EVIDENCE_REFERENCE,
  };
}

const PAGERANK_SOURCE_RASTER = { width: 2320, height: 3408 } as const;
const PAGERANK_EVIDENCE_REFERENCE =
  "docs/provenance/us-6285999-pagerank.md#figure-crop-review-and-preservation-boundary";

function pagerankLocator(args: {
  occurrenceKey: FigureOccurrenceKey;
  activeAsset: string;
  sourcePdfPage: 3 | 4 | 5;
}): FigureOccurrenceSourceLocator {
  const sourceRectPixels =
    args.sourcePdfPage === 3
      ? { x: 387, y: 272, width: 1681, height: 2580 }
      : args.sourcePdfPage === 4
        ? { x: 302, y: 272, width: 1783, height: 2598 }
        : { x: 393, y: 272, width: 1659, height: 2859 };
  return {
    ...args,
    sourceRaster: PAGERANK_SOURCE_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(sourceRectPixels, PAGERANK_SOURCE_RASTER),
    reviewer: "Classic Patents editorial agent (GPT-5 Codex)",
    reviewedAt: "2026-09-02",
    evidenceReference: PAGERANK_EVIDENCE_REFERENCE,
  };
}

const KAMEN_TRANSPORTER_SOURCE_RASTER = { width: 1440, height: 2040 } as const;
const KAMEN_TRANSPORTER_EVIDENCE_REFERENCE =
  "docs/provenance/us-5701965-kamen-transporter.md#figure-crop-review-and-preservation-boundary";

function kamenTransporterLocator(args: {
  occurrenceKey: FigureOccurrenceKey;
  activeAsset: string;
  sourcePdfPage: number;
  sourceRectPixels: SourcePixelRectangle;
}): FigureOccurrenceSourceLocator {
  return {
    ...args,
    sourceRaster: KAMEN_TRANSPORTER_SOURCE_RASTER,
    normalizedSourceRect: normalizeSourceRectangle(
      args.sourceRectPixels,
      KAMEN_TRANSPORTER_SOURCE_RASTER,
    ),
    reviewer: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-09-02",
    evidenceReference: KAMEN_TRANSPORTER_EVIDENCE_REFERENCE,
  };
}

const KAMEN_SEGWAY_SOURCE_RASTER = { width: 2088, height: 2930 } as const;
const KAMEN_SEGWAY_EVIDENCE_REFERENCE =
  "docs/provenance/us-6302230-kamen-segway.md#figure-crop-review-and-preservation-boundary";

function kamenSegwayLocator(args: {
  occurrenceKey: FigureOccurrenceKey;
  activeAsset: string;
  sourcePdfPage: number;
}): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: KAMEN_SEGWAY_SOURCE_RASTER.width,
    height: KAMEN_SEGWAY_SOURCE_RASTER.height,
  };
  return {
    ...args,
    sourceRaster: KAMEN_SEGWAY_SOURCE_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(sourceRectPixels, KAMEN_SEGWAY_SOURCE_RASTER),
    reviewer: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-09-02",
    evidenceReference: KAMEN_SEGWAY_EVIDENCE_REFERENCE,
  };
}

function hullStereolithographyLocator(options: {
  occurrenceKey: FigureOccurrenceKey;
  activeAsset: string;
  sourcePdfPage: number;
}): FigureOccurrenceSourceLocator {
  const raster = { width: 2360, height: 3200 };
  const rect = { x: 100, y: 100, width: 2160, height: 3000 };
  return {
    occurrenceKey: options.occurrenceKey,
    activeAsset: options.activeAsset,
    sourcePdfPage: options.sourcePdfPage,
    sourceRaster: raster,
    sourceRectPixels: rect,
    normalizedSourceRect: normalizeSourceRectangle(rect, raster),
    reviewer: "Classic Patents editorial agent (GPT-5.6)",
    reviewedAt: "2026-09-02",
    evidenceReference:
      "docs/provenance/us-4575330-hull-stereolithography.md#section-4-figure-crop-review-and-preservation-boundary",
  };
}

const WRIGHT_FLYER_SOURCE_RASTER = { width: 2320, height: 3408 } as const;
const WRIGHT_FLYER_EVIDENCE_REFERENCE =
  "docs/provenance/us-821393-wright-flyer.md#source-sheet-acceptance-2026-09-03";

/**
 * The active Wright assets are complete upright source sheets. Figures 1 and
 * 2 cannot be cleanly isolated without cutting printed drawing content or
 * including a clipped witness/header band, so their full source sheets are
 * intentionally the reviewable archival preview.
 */
function wrightFlyerSourceSheetLocator(args: {
  occurrenceKey: FigureOccurrenceKey;
  activeAsset: string;
  sourcePdfPage: 1 | 2 | 3;
}): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: WRIGHT_FLYER_SOURCE_RASTER.width,
    height: WRIGHT_FLYER_SOURCE_RASTER.height,
  };
  return {
    ...args,
    sourceRaster: WRIGHT_FLYER_SOURCE_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(sourceRectPixels, WRIGHT_FLYER_SOURCE_RASTER),
    reviewer: "Classic Patents editorial agent (GPT-5.6); independent source-pixel review",
    reviewedAt: "2026-09-03",
    evidenceReference: WRIGHT_FLYER_EVIDENCE_REFERENCE,
  };
}

const SUNDBACK_ZIPPER_SOURCE_RASTER = { width: 2320, height: 3408 } as const;
const SUNDBACK_ZIPPER_EVIDENCE_REFERENCE =
  "docs/provenance/us-1219881-sundback-zipper.md#source-sheet-acceptance-2026-09-03";

const PELTON_WATER_WHEEL_SOURCE_RASTER = { width: 2320, height: 3408 } as const;
const PELTON_WATER_WHEEL_EVIDENCE_REFERENCE =
  "docs/provenance/us-233692-pelton-water-wheel.md#source-sheet-acceptance-2026-09-03";

const LINDE_AIR_LIQUEFACTION_SOURCE_RASTER = { width: 2320, height: 3408 } as const;
const LINDE_AIR_LIQUEFACTION_EVIDENCE_REFERENCE =
  "docs/provenance/us-727650-linde-air-liquefaction.md#source-sheet-acceptance-2026-09-03";

const EDISON_INDICATOR_SOURCE_RASTER = { width: 2320, height: 3408 } as const;
const EDISON_INDICATOR_EVIDENCE_REFERENCE =
  "docs/provenance/us-307031-edison-indicator.md#facsimile-map-and-comparison-record";

function edisonIndicatorSourceSheetLocator(args: {
  occurrenceKey: FigureOccurrenceKey;
}): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: EDISON_INDICATOR_SOURCE_RASTER.width,
    height: EDISON_INDICATOR_SOURCE_RASTER.height,
  };
  return {
    ...args,
    activeAsset: "/patents/figures/us-307031-edison-indicator/source-sheet-1-v1.png",
    sourcePdfPage: 1,
    sourceRaster: EDISON_INDICATOR_SOURCE_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(
      sourceRectPixels,
      EDISON_INDICATOR_SOURCE_RASTER,
    ),
    reviewer: "Classic Patents editorial agent (Codex); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-03",
    evidenceReference: EDISON_INDICATOR_EVIDENCE_REFERENCE,
  };
}

/**
 * The sole apparatus diagram is one continuous, interconnected drawing. The
 * active preview preserves its complete upright primary sheet rather than
 * claiming an isolated crop while cutting off the G³ separation branch.
 */
function lindeAirLiquefactionSourceSheetLocator(args: {
  occurrenceKey: FigureOccurrenceKey;
}): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: LINDE_AIR_LIQUEFACTION_SOURCE_RASTER.width,
    height: LINDE_AIR_LIQUEFACTION_SOURCE_RASTER.height,
  };
  return {
    ...args,
    activeAsset: "/patents/figures/us-727650-linde-air-liquefaction/source-sheet-1-v1.png",
    sourcePdfPage: 1,
    sourceRaster: LINDE_AIR_LIQUEFACTION_SOURCE_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(
      sourceRectPixels,
      LINDE_AIR_LIQUEFACTION_SOURCE_RASTER,
    ),
    reviewer: "Classic Patents editorial agent (GPT-5.6); independent source-pixel review",
    reviewedAt: "2026-09-03",
    evidenceReference: LINDE_AIR_LIQUEFACTION_EVIDENCE_REFERENCE,
  };
}

/**
 * The page-one drawing sheet interleaves all four figures with title and
 * execution furniture. The active preview deliberately keeps its full,
 * upright primary-source extent instead of treating speculative crop bounds as
 * archival evidence.
 */
function peltonWaterWheelSourceSheetLocator(args: {
  occurrenceKey: FigureOccurrenceKey;
}): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: PELTON_WATER_WHEEL_SOURCE_RASTER.width,
    height: PELTON_WATER_WHEEL_SOURCE_RASTER.height,
  };
  return {
    ...args,
    activeAsset: "/patents/figures/us-233692-pelton-water-wheel/source-sheet-1-v1.png",
    sourcePdfPage: 1,
    sourceRaster: PELTON_WATER_WHEEL_SOURCE_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(
      sourceRectPixels,
      PELTON_WATER_WHEEL_SOURCE_RASTER,
    ),
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-03",
    evidenceReference: PELTON_WATER_WHEEL_EVIDENCE_REFERENCE,
  };
}

/**
 * The original one-sheet layout interleaves the nine figures and its printed
 * patent furniture. The active source preview deliberately retains that
 * complete primary sheet rather than presenting a clipped or composite crop.
 */
function sundbackZipperSourceSheetLocator(args: {
  occurrenceKey: FigureOccurrenceKey;
}): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: SUNDBACK_ZIPPER_SOURCE_RASTER.width,
    height: SUNDBACK_ZIPPER_SOURCE_RASTER.height,
  };
  return {
    ...args,
    activeAsset: "/patents/figures/us-1219881-sundback-zipper/source-sheet-1-v1.png",
    sourcePdfPage: 1,
    sourceRaster: SUNDBACK_ZIPPER_SOURCE_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(sourceRectPixels, SUNDBACK_ZIPPER_SOURCE_RASTER),
    reviewer: "Classic Patents editorial agent (GPT-5.6); independent source-pixel review",
    reviewedAt: "2026-09-03",
    evidenceReference: SUNDBACK_ZIPPER_EVIDENCE_REFERENCE,
  };
}

const ROOMBA_SOURCE_SHEET_RASTER = { width: 2320, height: 3408 } as const;
const ROOMBA_SOURCE_SHEET_EVIDENCE_REFERENCE =
  "docs/provenance/us-6594844-roomba.md#source-sheet-acceptance-2026-09-03";

/**
 * The three early Roomba views share one printed source sheet. The active
 * preview retains that exact upright sheet rather than relying on the prior
 * misplaced crops, which show later drawings from different sheets.
 */
function roombaSourceSheetLocator(args: {
  occurrenceKey: FigureOccurrenceKey;
}): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: ROOMBA_SOURCE_SHEET_RASTER.width,
    height: ROOMBA_SOURCE_SHEET_RASTER.height,
  };
  return {
    ...args,
    activeAsset: "/patents/figures/us-6594844-roomba/source-sheet-1-v1.png",
    sourcePdfPage: 2,
    sourceRaster: ROOMBA_SOURCE_SHEET_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(sourceRectPixels, ROOMBA_SOURCE_SHEET_RASTER),
    reviewer: "Classic Patents editorial agent (GPT-5.6); independent source-pixel review",
    reviewedAt: "2026-09-03",
    evidenceReference: ROOMBA_SOURCE_SHEET_EVIDENCE_REFERENCE,
  };
}

const CORLISS_SOURCE_SHEET_RASTER = { width: 2320, height: 3408 } as const;
const CORLISS_SOURCE_SHEET_EVIDENCE_REFERENCE =
  "docs/provenance/us-6162-corliss-steam-engine.md#source-sheet-acceptance-2026-09-03";
const CORLISS_SOURCE_SHEET_ASSETS = {
  1: "/patents/figures/us-6162-corliss-steam-engine/source-sheet-1-v1.png",
  2: "/patents/figures/us-6162-corliss-steam-engine/source-sheet-2-v1.png",
  3: "/patents/figures/us-6162-corliss-steam-engine/source-sheet-3-v1.png",
  4: "/patents/figures/us-6162-corliss-steam-engine/source-sheet-4-v1.png",
} as const;

/**
 * Each active Corliss citation uses the entire directly rendered drawing sheet
 * containing its printed figure label. This preserves the source geometry and
 * sheet furniture instead of relying on any legacy crop boundary.
 */
function corlissSourceSheetLocator(args: {
  occurrenceKey: FigureOccurrenceKey;
  sourcePdfPage: keyof typeof CORLISS_SOURCE_SHEET_ASSETS;
}): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: CORLISS_SOURCE_SHEET_RASTER.width,
    height: CORLISS_SOURCE_SHEET_RASTER.height,
  };
  return {
    ...args,
    activeAsset: CORLISS_SOURCE_SHEET_ASSETS[args.sourcePdfPage],
    sourceRaster: CORLISS_SOURCE_SHEET_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(sourceRectPixels, CORLISS_SOURCE_SHEET_RASTER),
    reviewer: "Classic Patents editorial agent (GPT-5.6); independent source-pixel review",
    reviewedAt: "2026-09-03",
    evidenceReference: CORLISS_SOURCE_SHEET_EVIDENCE_REFERENCE,
  };
}

const MESTRAL_VELCRO_SOURCE_SHEET_RASTER = { width: 2320, height: 3408 } as const;
const MESTRAL_VELCRO_SOURCE_SHEET_EVIDENCE_REFERENCE =
  "docs/provenance/us-2717437-mestral-velcro.md#source-sheet-acceptance-2026-09-03";

function mestralVelcroSourceSheetLocator(args: {
  occurrenceKey: FigureOccurrenceKey;
}): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: MESTRAL_VELCRO_SOURCE_SHEET_RASTER.width,
    height: MESTRAL_VELCRO_SOURCE_SHEET_RASTER.height,
  };
  return {
    ...args,
    activeAsset: "/patents/figures/us-2717437-mestral-velcro/source-sheet-1-v1.png",
    sourcePdfPage: 1,
    sourceRaster: MESTRAL_VELCRO_SOURCE_SHEET_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(
      sourceRectPixels,
      MESTRAL_VELCRO_SOURCE_SHEET_RASTER,
    ),
    reviewer: "Classic Patents editorial agent (GPT-5.6); independent source-pixel review",
    reviewedAt: "2026-09-03",
    evidenceReference: MESTRAL_VELCRO_SOURCE_SHEET_EVIDENCE_REFERENCE,
  };
}

const LINCOLN_BUOY_SOURCE_SHEET_RASTER = { width: 2320, height: 3408 } as const;
const LINCOLN_BUOY_SOURCE_SHEET_EVIDENCE_REFERENCE =
  "docs/provenance/us-6469-lincoln-buoy.md#source-sheet-acceptance-2026-09-03";

function lincolnBuoySourceSheetLocator(args: {
  occurrenceKey: FigureOccurrenceKey;
}): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: LINCOLN_BUOY_SOURCE_SHEET_RASTER.width,
    height: LINCOLN_BUOY_SOURCE_SHEET_RASTER.height,
  };
  return {
    ...args,
    activeAsset: "/patents/figures/us-6469-lincoln-buoy/source-sheet-1-v1.png",
    sourcePdfPage: 1,
    sourceRaster: LINCOLN_BUOY_SOURCE_SHEET_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(
      sourceRectPixels,
      LINCOLN_BUOY_SOURCE_SHEET_RASTER,
    ),
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-03",
    evidenceReference: LINCOLN_BUOY_SOURCE_SHEET_EVIDENCE_REFERENCE,
  };
}

const HALL_ALUMINIUM_SOURCE_SHEET_RASTER = { width: 2320, height: 3408 } as const;
const HALL_ALUMINIUM_SOURCE_SHEET_EVIDENCE_REFERENCE =
  "docs/provenance/us-400766-hall-aluminium.md#source-sheet-acceptance-2026-09-03";

function hallAluminiumSourceSheetLocator(args: {
  occurrenceKey: FigureOccurrenceKey;
}): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: HALL_ALUMINIUM_SOURCE_SHEET_RASTER.width,
    height: HALL_ALUMINIUM_SOURCE_SHEET_RASTER.height,
  };
  return {
    ...args,
    activeAsset: "/patents/figures/us-400766-hall-aluminium/source-sheet-1-v1.png",
    sourcePdfPage: 1,
    sourceRaster: HALL_ALUMINIUM_SOURCE_SHEET_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(
      sourceRectPixels,
      HALL_ALUMINIUM_SOURCE_SHEET_RASTER,
    ),
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-03",
    evidenceReference: HALL_ALUMINIUM_SOURCE_SHEET_EVIDENCE_REFERENCE,
  };
}

const EASTMAN_KODAK_SOURCE_SHEET_RASTER = { width: 2560, height: 3300 } as const;
const EASTMAN_KODAK_SOURCE_SHEET_EVIDENCE_REFERENCE =
  "docs/provenance/us-388850-eastman-kodak.md#source-sheet-acceptance-2026-09-03";
const EASTMAN_KODAK_SOURCE_SHEET_ASSETS = {
  1: "/patents/figures/us-388850-eastman-kodak/source-sheet-1-v1.png",
  2: "/patents/figures/us-388850-eastman-kodak/source-sheet-2-v1.png",
  3: "/patents/figures/us-388850-eastman-kodak/source-sheet-3-v1.png",
} as const;

function eastmanKodakSourceSheetLocator(args: {
  occurrenceKey: FigureOccurrenceKey;
  sourcePdfPage: keyof typeof EASTMAN_KODAK_SOURCE_SHEET_ASSETS;
}): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: EASTMAN_KODAK_SOURCE_SHEET_RASTER.width,
    height: EASTMAN_KODAK_SOURCE_SHEET_RASTER.height,
  };
  return {
    ...args,
    activeAsset: EASTMAN_KODAK_SOURCE_SHEET_ASSETS[args.sourcePdfPage],
    sourceRaster: EASTMAN_KODAK_SOURCE_SHEET_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(
      sourceRectPixels,
      EASTMAN_KODAK_SOURCE_SHEET_RASTER,
    ),
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-03",
    evidenceReference: EASTMAN_KODAK_SOURCE_SHEET_EVIDENCE_REFERENCE,
  };
}

const MAKINO_SCARA_SOURCE_SHEET_RASTER = { width: 2320, height: 3408 } as const;
const MAKINO_SCARA_SOURCE_SHEET_EVIDENCE_REFERENCE =
  "docs/provenance/us-4341502-makino-scara.md#source-sheet-acceptance-2026-09-03";
const MAKINO_SCARA_SOURCE_SHEET_ASSETS = {
  2: "/patents/figures/us-4341502-makino-scara/source-sheet-2-v1.png",
  3: "/patents/figures/us-4341502-makino-scara/source-sheet-3-v1.png",
} as const;

function makinoScaraSourceSheetLocator(args: {
  occurrenceKey: FigureOccurrenceKey;
  sourcePdfPage: keyof typeof MAKINO_SCARA_SOURCE_SHEET_ASSETS;
}): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: MAKINO_SCARA_SOURCE_SHEET_RASTER.width,
    height: MAKINO_SCARA_SOURCE_SHEET_RASTER.height,
  };
  return {
    ...args,
    activeAsset: MAKINO_SCARA_SOURCE_SHEET_ASSETS[args.sourcePdfPage],
    sourceRaster: MAKINO_SCARA_SOURCE_SHEET_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(
      sourceRectPixels,
      MAKINO_SCARA_SOURCE_SHEET_RASTER,
    ),
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-03",
    evidenceReference: MAKINO_SCARA_SOURCE_SHEET_EVIDENCE_REFERENCE,
  };
}

const BAER_ODYSSEY_SOURCE_SHEET_RASTER = { width: 2320, height: 3408 } as const;
const BAER_ODYSSEY_SOURCE_SHEET_EVIDENCE_REFERENCE =
  "docs/provenance/us-3728480-baer-odyssey.md#source-sheet-evidence-attestation-2026-09-03";
const BAER_ODYSSEY_SOURCE_SHEET_ASSETS = {
  2: "/patents/figures/us-3728480-baer-odyssey/source-sheet-pdf-02-v1.png",
  3: "/patents/figures/us-3728480-baer-odyssey/source-sheet-pdf-03-v1.png",
  4: "/patents/figures/us-3728480-baer-odyssey/source-sheet-pdf-04-v1.png",
  5: "/patents/figures/us-3728480-baer-odyssey/source-sheet-pdf-05-v1.png",
  6: "/patents/figures/us-3728480-baer-odyssey/source-sheet-pdf-06-v1.png",
  7: "/patents/figures/us-3728480-baer-odyssey/source-sheet-pdf-07-v1.png",
  8: "/patents/figures/us-3728480-baer-odyssey/source-sheet-pdf-08-v1.png",
  11: "/patents/figures/us-3728480-baer-odyssey/source-sheet-pdf-11-v1.png",
  12: "/patents/figures/us-3728480-baer-odyssey/source-sheet-pdf-12-v1.png",
} as const;

function baerOdysseySourceSheetLocator(args: {
  occurrenceKey: FigureOccurrenceKey;
  sourcePdfPage: keyof typeof BAER_ODYSSEY_SOURCE_SHEET_ASSETS;
}): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: BAER_ODYSSEY_SOURCE_SHEET_RASTER.width,
    height: BAER_ODYSSEY_SOURCE_SHEET_RASTER.height,
  };
  return {
    ...args,
    activeAsset: BAER_ODYSSEY_SOURCE_SHEET_ASSETS[args.sourcePdfPage],
    sourceRaster: BAER_ODYSSEY_SOURCE_SHEET_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(
      sourceRectPixels,
      BAER_ODYSSEY_SOURCE_SHEET_RASTER,
    ),
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-03",
    evidenceReference: BAER_ODYSSEY_SOURCE_SHEET_EVIDENCE_REFERENCE,
  };
}

const CARLSON_ELECTROPHOTOGRAPHY_SOURCE_SHEET_RASTER = { width: 2320, height: 3408 } as const;
const CARLSON_ELECTROPHOTOGRAPHY_SOURCE_SHEET_EVIDENCE_REFERENCE =
  "docs/provenance/us-2297691-carlson-electrophotography.md#source-sheet-acceptance-2026-09-03";
const CARLSON_ELECTROPHOTOGRAPHY_SOURCE_SHEET =
  "/patents/figures/us-2297691-carlson-electrophotography/source-sheet-1-v1.png";
const CARLSON_ELECTROPHOTOGRAPHY_SOURCE_SHEET_OCCURRENCE_KEYS = [
  "edition-block-6-group-0-inline-1",
  "edition-block-6-group-0-inline-3",
  "edition-block-6-group-0-inline-5",
  "edition-block-6-group-0-inline-7",
  "edition-block-6-group-0-inline-9",
  "edition-block-6-group-0-inline-11",
  "edition-block-6-group-0-inline-13",
  "edition-block-6-group-0-inline-15",
  "edition-block-10-group-0-inline-0",
  "edition-block-20-group-0-inline-1",
  "edition-block-22-group-0-inline-1",
  "edition-block-22-group-0-inline-3",
  "edition-block-24-group-0-inline-0",
  "edition-block-25-group-0-inline-0",
  "edition-block-28-group-0-inline-1",
  "edition-block-28-group-0-inline-3",
  "edition-block-28-group-0-inline-5",
  "edition-block-31-group-0-inline-1",
  "edition-block-33-group-0-inline-1",
  "edition-block-35-group-0-inline-1",
  "edition-block-35-group-0-inline-3",
  "edition-block-36-group-0-inline-0",
  "edition-block-38-group-0-inline-1",
  "edition-block-38-group-0-inline-3",
  "edition-block-39-group-0-inline-0",
  "edition-block-42-group-0-inline-1",
  "edition-block-43-group-0-inline-1",
  "edition-block-46-group-0-inline-1",
  "edition-block-51-group-0-inline-1",
  "edition-block-74-group-0-inline-0",
] as const satisfies readonly FigureOccurrenceKey[];

function carlsonElectrophotographySourceSheetLocator(
  occurrenceKey: FigureOccurrenceKey,
): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: CARLSON_ELECTROPHOTOGRAPHY_SOURCE_SHEET_RASTER.width,
    height: CARLSON_ELECTROPHOTOGRAPHY_SOURCE_SHEET_RASTER.height,
  };
  return {
    occurrenceKey,
    activeAsset: CARLSON_ELECTROPHOTOGRAPHY_SOURCE_SHEET,
    sourcePdfPage: 1,
    sourceRaster: CARLSON_ELECTROPHOTOGRAPHY_SOURCE_SHEET_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(
      sourceRectPixels,
      CARLSON_ELECTROPHOTOGRAPHY_SOURCE_SHEET_RASTER,
    ),
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-03",
    evidenceReference: CARLSON_ELECTROPHOTOGRAPHY_SOURCE_SHEET_EVIDENCE_REFERENCE,
  };
}

const YALE_LOCK_SOURCE_SHEET_RASTER = { width: 2320, height: 3408 } as const;
const YALE_LOCK_SOURCE_SHEET_EVIDENCE_REFERENCE =
  "docs/provenance/us-48475-yale-lock.md#source-sheet-acceptance-2026-09-03";
const YALE_LOCK_SOURCE_SHEET = "/patents/figures/us-48475-yale-lock/source-sheet-1-v1.png";
const YALE_LOCK_SOURCE_SHEET_OCCURRENCE_KEYS = [
  "edition-block-1-group-0-inline-1",
  "edition-block-3-group-0-inline-1",
  "edition-block-3-group-0-inline-3",
  "edition-block-3-group-0-inline-5",
  "edition-block-3-group-0-inline-7",
  "edition-block-3-group-0-inline-9",
  "edition-block-3-group-0-inline-11",
  "edition-block-3-group-0-inline-13",
  "edition-block-3-group-0-inline-15",
  "edition-block-3-group-0-inline-17",
  "edition-block-3-group-0-inline-19",
  "edition-block-3-group-0-inline-21",
  "edition-block-3-group-0-inline-23",
  "edition-block-3-group-0-inline-25",
  "edition-block-3-group-0-inline-27",
  "edition-block-3-group-0-inline-29",
  "edition-block-3-group-0-inline-31",
  "edition-block-3-group-0-inline-33",
  "edition-block-6-group-0-inline-3",
  "edition-block-6-group-0-inline-5",
  "edition-block-7-group-0-inline-3",
  "edition-block-7-group-0-inline-5",
  "edition-block-8-group-0-inline-7",
  "edition-block-8-group-0-inline-13",
  "edition-block-9-group-0-inline-1",
  "edition-block-9-group-0-inline-3",
  "edition-block-10-group-0-inline-1",
  "edition-block-12-group-0-inline-1",
  "edition-block-12-group-0-inline-3",
  "edition-block-13-group-0-inline-1",
] as const satisfies readonly FigureOccurrenceKey[];

function yaleLockSourceSheetLocator(
  occurrenceKey: FigureOccurrenceKey,
): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: YALE_LOCK_SOURCE_SHEET_RASTER.width,
    height: YALE_LOCK_SOURCE_SHEET_RASTER.height,
  };
  return {
    occurrenceKey,
    activeAsset: YALE_LOCK_SOURCE_SHEET,
    sourcePdfPage: 1,
    sourceRaster: YALE_LOCK_SOURCE_SHEET_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(sourceRectPixels, YALE_LOCK_SOURCE_SHEET_RASTER),
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-03",
    evidenceReference: YALE_LOCK_SOURCE_SHEET_EVIDENCE_REFERENCE,
  };
}

const BELL_PHOTOPHONE_SOURCE_SHEET_RASTER = { width: 2320, height: 3408 } as const;
const BELL_PHOTOPHONE_SOURCE_SHEET_EVIDENCE_REFERENCE =
  "docs/provenance/us-235199-bell-photophone.md#complete-source-sheet-acceptance-2026-09-04";
const BELL_PHOTOPHONE_SOURCE_SHEET_ASSETS = {
  1: "/patents/figures/us-235199-bell-photophone/source-sheet-1-v1.png",
  2: "/patents/figures/us-235199-bell-photophone/source-sheet-2-v1.png",
  3: "/patents/figures/us-235199-bell-photophone/source-sheet-3-v1.png",
} as const;
const BELL_PHOTOPHONE_SOURCE_SHEET_OCCURRENCES = [
  ["edition-block-20-group-0-inline-0", 1],
  ["edition-block-20-group-0-inline-2", 1],
  ["edition-block-23-group-0-inline-1", 1],
  ["edition-block-27-group-0-inline-1", 2],
  ["edition-block-28-group-0-inline-0", 2],
  ["edition-block-30-group-0-inline-1", 2],
  ["edition-block-33-group-0-inline-3", 2],
  ["edition-block-33-group-0-inline-5", 2],
  ["edition-block-33-group-0-inline-7", 2],
  ["edition-block-33-group-0-inline-9", 2],
  ["edition-block-34-group-0-inline-1", 2],
  ["edition-block-36-group-0-inline-1", 2],
  ["edition-block-37-group-0-inline-0", 2],
  ["edition-block-40-group-0-inline-1", 2],
  ["edition-block-40-group-0-inline-3", 2],
  ["edition-block-43-group-0-inline-1", 2],
  ["edition-block-44-group-0-inline-1", 2],
  ["edition-block-46-group-0-inline-1", 2],
  ["edition-block-53-group-0-inline-0", 3],
  ["edition-block-62-group-0-inline-1", 2],
  ["edition-block-64-group-0-inline-1", 2],
  ["edition-block-64-group-0-inline-3", 2],
  ["edition-block-66-group-0-inline-1", 2],
  ["edition-block-67-group-0-inline-1", 2],
  ["edition-block-68-group-0-inline-1", 3],
  ["edition-block-68-group-0-inline-3", 3],
  ["edition-block-68-group-0-inline-5", 3],
  ["edition-block-68-group-0-inline-7", 2],
  ["edition-block-68-group-0-inline-9", 3],
  ["edition-block-72-group-0-inline-1", 3],
  ["edition-block-72-group-0-inline-3", 3],
  ["edition-block-87-group-0-inline-1", 2],
] as const satisfies readonly (readonly [
  FigureOccurrenceKey,
  keyof typeof BELL_PHOTOPHONE_SOURCE_SHEET_ASSETS,
])[];

function bellPhotophoneSourceSheetLocator(
  occurrenceKey: FigureOccurrenceKey,
  sourcePdfPage: keyof typeof BELL_PHOTOPHONE_SOURCE_SHEET_ASSETS,
): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: BELL_PHOTOPHONE_SOURCE_SHEET_RASTER.width,
    height: BELL_PHOTOPHONE_SOURCE_SHEET_RASTER.height,
  };
  return {
    occurrenceKey,
    activeAsset: BELL_PHOTOPHONE_SOURCE_SHEET_ASSETS[sourcePdfPage],
    sourcePdfPage,
    sourceRaster: BELL_PHOTOPHONE_SOURCE_SHEET_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(
      sourceRectPixels,
      BELL_PHOTOPHONE_SOURCE_SHEET_RASTER,
    ),
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-04",
    evidenceReference: BELL_PHOTOPHONE_SOURCE_SHEET_EVIDENCE_REFERENCE,
  };
}

const GRAMME_DYNAMO_SOURCE_SHEET_RASTER = { width: 1392, height: 2045 } as const;
const GRAMME_DYNAMO_SOURCE_SHEET_EVIDENCE_REFERENCE =
  "docs/provenance/us-120057-gramme-dynamo.md#source-sheet-acceptance-2026-09-04";
const GRAMME_DYNAMO_SOURCE_SHEET_ASSETS = {
  1: "/patents/figures/us-120057-gramme-dynamo/drawing-sheet-1.png",
  2: "/patents/figures/us-120057-gramme-dynamo/drawing-sheet-2.png",
  3: "/patents/figures/us-120057-gramme-dynamo/drawing-sheet-3.png",
  4: "/patents/figures/us-120057-gramme-dynamo/drawing-sheet-4.png",
} as const;
const GRAMME_DYNAMO_SOURCE_SHEET_OCCURRENCES = [
  ["edition-block-1-group-0-inline-1", 1],
  ["edition-block-1-group-0-inline-3", 1],
  ["edition-block-11-group-0-inline-0", 1],
  ["edition-block-11-group-0-inline-2", 1],
  ["edition-block-11-group-0-inline-4", 1],
  ["edition-block-13-group-0-inline-1", 1],
  ["edition-block-17-group-0-inline-1", 1],
  ["edition-block-19-group-0-inline-0", 1],
  ["edition-block-19-group-0-inline-2", 1],
  ["edition-block-19-group-0-inline-4", 1],
  ["edition-block-26-group-0-inline-1", 1],
  ["edition-block-26-group-0-inline-3", 1],
  ["edition-block-47-group-0-inline-1", 1],
  ["edition-block-49-group-0-inline-1", 1],
  ["edition-block-50-group-0-inline-1", 1],
  ["edition-block-59-group-0-inline-1", 1],
  ["edition-block-2-group-0-inline-1", 2],
  ["edition-block-25-group-0-inline-0", 2],
  ["edition-block-25-group-0-inline-2", 2],
  ["edition-block-25-group-0-inline-4", 2],
  ["edition-block-27-group-0-inline-1", 2],
  ["edition-block-31-group-0-inline-1", 2],
  ["edition-block-31-group-0-inline-3", 2],
  ["edition-block-3-group-0-inline-1", 3],
  ["edition-block-32-group-0-inline-0", 3],
  ["edition-block-32-group-0-inline-2", 3],
  ["edition-block-39-group-0-inline-0", 3],
  ["edition-block-39-group-0-inline-2", 3],
  ["edition-block-49-group-0-inline-3", 3],
  ["edition-block-4-group-0-inline-1", 4],
  ["edition-block-46-group-0-inline-0", 4],
] as const satisfies readonly (readonly [
  FigureOccurrenceKey,
  keyof typeof GRAMME_DYNAMO_SOURCE_SHEET_ASSETS,
])[];

function grammeDynamoSourceSheetLocator(
  occurrenceKey: FigureOccurrenceKey,
  sourcePdfPage: keyof typeof GRAMME_DYNAMO_SOURCE_SHEET_ASSETS,
): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: GRAMME_DYNAMO_SOURCE_SHEET_RASTER.width,
    height: GRAMME_DYNAMO_SOURCE_SHEET_RASTER.height,
  };
  return {
    occurrenceKey,
    activeAsset: GRAMME_DYNAMO_SOURCE_SHEET_ASSETS[sourcePdfPage],
    sourcePdfPage,
    sourceRaster: GRAMME_DYNAMO_SOURCE_SHEET_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(
      sourceRectPixels,
      GRAMME_DYNAMO_SOURCE_SHEET_RASTER,
    ),
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 180 DPI source-pixel review",
    reviewedAt: "2026-09-04",
    evidenceReference: GRAMME_DYNAMO_SOURCE_SHEET_EVIDENCE_REFERENCE,
  };
}

const FARNSWORTH_TV_SOURCE_SHEET_RASTER = { width: 2320, height: 3408 } as const;
const FARNSWORTH_TV_SOURCE_SHEET_EVIDENCE_REFERENCE =
  "docs/provenance/us-1773980-farnsworth-tv.md#source-sheet-acceptance-2026-09-04";
const FARNSWORTH_TV_SOURCE_SHEET_ASSETS = {
  1: "/patents/figures/us-1773980-farnsworth-tv/source-sheet-1-v1.png",
  2: "/patents/figures/us-1773980-farnsworth-tv/source-sheet-2-v1.png",
  3: "/patents/figures/us-1773980-farnsworth-tv/source-sheet-3-v1.png",
  4: "/patents/figures/us-1773980-farnsworth-tv/source-sheet-4-v1.png",
} as const;
const FARNSWORTH_TV_SOURCE_SHEET_OCCURRENCES = [
  ["edition-block-1-group-0-inline-1", 1],
  ["edition-block-1-group-0-inline-3", 2],
  ["edition-block-1-group-0-inline-5", 2],
  ["edition-block-38-group-0-inline-1", 2],
  ["edition-block-1-group-0-inline-7", 3],
  ["edition-block-1-group-0-inline-9", 3],
  ["edition-block-1-group-0-inline-11", 3],
  ["edition-block-1-group-0-inline-13", 3],
  ["edition-block-1-group-0-inline-15", 3],
  ["edition-block-1-group-0-inline-17", 3],
  ["edition-block-1-group-0-inline-19", 3],
  ["edition-block-1-group-0-inline-21", 3],
  ["edition-block-36-group-0-inline-1", 3],
  ["edition-block-37-group-0-inline-1", 3],
  ["edition-block-1-group-0-inline-23", 4],
  ["edition-block-1-group-0-inline-25", 4],
  ["edition-block-1-group-0-inline-27", 4],
  ["edition-block-1-group-0-inline-29", 4],
  ["edition-block-1-group-0-inline-31", 4],
  ["edition-block-1-group-0-inline-33", 4],
  ["edition-block-1-group-0-inline-35", 4],
  ["edition-block-20-group-0-inline-1", 4],
  ["edition-block-20-group-0-inline-3", 4],
  ["edition-block-20-group-0-inline-5", 4],
  ["edition-block-22-group-0-inline-1", 4],
  ["edition-block-22-group-0-inline-3", 4],
  ["edition-block-22-group-0-inline-5", 4],
  ["edition-block-25-group-0-inline-1", 4],
  ["edition-block-25-group-0-inline-3", 4],
  ["edition-block-33-group-0-inline-1", 4],
  ["edition-block-33-group-0-inline-3", 4],
  ["edition-block-34-group-0-inline-1", 4],
] as const satisfies readonly (readonly [
  FigureOccurrenceKey,
  keyof typeof FARNSWORTH_TV_SOURCE_SHEET_ASSETS,
])[];

function farnsworthTvSourceSheetLocator(
  occurrenceKey: FigureOccurrenceKey,
  sourcePdfPage: keyof typeof FARNSWORTH_TV_SOURCE_SHEET_ASSETS,
): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: FARNSWORTH_TV_SOURCE_SHEET_RASTER.width,
    height: FARNSWORTH_TV_SOURCE_SHEET_RASTER.height,
  };
  return {
    occurrenceKey,
    activeAsset: FARNSWORTH_TV_SOURCE_SHEET_ASSETS[sourcePdfPage],
    sourcePdfPage,
    sourceRaster: FARNSWORTH_TV_SOURCE_SHEET_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(
      sourceRectPixels,
      FARNSWORTH_TV_SOURCE_SHEET_RASTER,
    ),
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-04",
    evidenceReference: FARNSWORTH_TV_SOURCE_SHEET_EVIDENCE_REFERENCE,
  };
}

const LAMARR_FREQUENCY_HOPPING_SOURCE_SHEET_RASTER = { width: 2320, height: 3408 } as const;
const LAMARR_FREQUENCY_HOPPING_SOURCE_SHEET_EVIDENCE_REFERENCE =
  "docs/provenance/us-2292387-lamarr-frequency-hopping.md#complete-source-sheet-acceptance-2026-09-04";
const LAMARR_FREQUENCY_HOPPING_SOURCE_SHEET_ASSETS = {
  1: "/patents/figures/us-2292387-lamarr-frequency-hopping/source-sheet-1-v1.png",
  2: "/patents/figures/us-2292387-lamarr-frequency-hopping/source-sheet-2-v1.png",
} as const;
const LAMARR_FREQUENCY_HOPPING_SOURCE_SHEET_OCCURRENCES = [
  ["edition-block-7-group-0-inline-1", 1],
  ["edition-block-7-group-0-inline-3", 1],
  ["edition-block-7-group-0-inline-5", 1],
  ["edition-block-13-group-0-inline-1", 1],
  ["edition-block-14-group-0-inline-1", 1],
  ["edition-block-15-group-0-inline-5", 1],
  ["edition-block-18-group-0-inline-3", 1],
  ["edition-block-19-group-0-inline-1", 1],
  ["edition-block-19-group-0-inline-3", 1],
  ["edition-block-20-group-0-inline-1", 1],
  ["edition-block-24-group-0-inline-1", 1],
  ["edition-block-24-group-0-inline-3", 1],
  ["edition-block-24-group-0-inline-5", 1],
  ["edition-block-25-group-0-inline-1", 1],
  ["edition-block-7-group-0-inline-7", 2],
  ["edition-block-7-group-0-inline-9", 2],
  ["edition-block-7-group-0-inline-11", 2],
  ["edition-block-7-group-0-inline-13", 2],
  ["edition-block-7-group-0-inline-15", 2],
  ["edition-block-7-group-0-inline-17", 2],
  ["edition-block-8-group-0-inline-1", 2],
  ["edition-block-10-group-0-inline-1", 2],
  ["edition-block-15-group-0-inline-3", 2],
  ["edition-block-16-group-0-inline-1", 2],
  ["edition-block-16-group-0-inline-3", 2],
  ["edition-block-16-group-0-inline-5", 2],
  ["edition-block-18-group-0-inline-1", 2],
  ["edition-block-22-group-0-inline-1", 2],
  ["edition-block-22-group-0-inline-3", 2],
  ["edition-block-23-group-0-inline-1", 2],
  ["edition-block-23-group-0-inline-3", 2],
  ["edition-block-23-group-0-inline-5", 2],
  ["edition-block-23-group-0-inline-7", 2],
  ["edition-block-26-group-0-inline-1", 2],
  ["edition-block-27-group-0-inline-1", 2],
] as const satisfies readonly (readonly [
  FigureOccurrenceKey,
  keyof typeof LAMARR_FREQUENCY_HOPPING_SOURCE_SHEET_ASSETS,
])[];

function lamarrFrequencyHoppingSourceSheetLocator(
  occurrenceKey: FigureOccurrenceKey,
  sourcePdfPage: keyof typeof LAMARR_FREQUENCY_HOPPING_SOURCE_SHEET_ASSETS,
): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: LAMARR_FREQUENCY_HOPPING_SOURCE_SHEET_RASTER.width,
    height: LAMARR_FREQUENCY_HOPPING_SOURCE_SHEET_RASTER.height,
  };
  return {
    occurrenceKey,
    activeAsset: LAMARR_FREQUENCY_HOPPING_SOURCE_SHEET_ASSETS[sourcePdfPage],
    sourcePdfPage,
    sourceRaster: LAMARR_FREQUENCY_HOPPING_SOURCE_SHEET_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(
      sourceRectPixels,
      LAMARR_FREQUENCY_HOPPING_SOURCE_SHEET_RASTER,
    ),
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-04",
    evidenceReference: LAMARR_FREQUENCY_HOPPING_SOURCE_SHEET_EVIDENCE_REFERENCE,
  };
}

const HOWE_SEWING_MACHINE_SOURCE_SHEET_RASTER = { width: 2320, height: 3408 } as const;
const HOWE_SEWING_MACHINE_SOURCE_SHEET_EVIDENCE_REFERENCE =
  "docs/provenance/us-4750-howe-sewing-machine.md#complete-source-sheet-acceptance-2026-09-04";
const HOWE_SEWING_MACHINE_SOURCE_SHEET_ASSETS = {
  1: "/patents/figures/us-4750-howe-sewing-machine/source-sheet-1-v1.png",
  2: "/patents/figures/us-4750-howe-sewing-machine/source-sheet-2-v1.png",
  3: "/patents/figures/us-4750-howe-sewing-machine/source-sheet-3-v1.png",
} as const;
const HOWE_SEWING_MACHINE_SOURCE_SHEET_OCCURRENCES = [
  ["edition-block-1-group-0-inline-1", 1],
  ["edition-block-1-group-0-inline-3", 1],
  ["edition-block-1-group-0-inline-5", 1],
  ["edition-block-9-group-0-inline-1", 1],
  ["edition-block-15-group-0-inline-0", 1],
  ["edition-block-18-group-0-inline-3", 1],
  ["edition-block-20-group-0-inline-4", 1],
  ["edition-block-21-group-0-inline-1", 1],
  ["edition-block-23-group-0-inline-1", 1],
  ["edition-block-23-group-0-inline-5", 1],
  ["edition-block-24-group-0-inline-1", 1],
  ["edition-block-24-group-0-inline-3", 1],
  ["edition-block-25-group-0-inline-1", 1],
  ["edition-block-26-group-0-inline-1", 1],
  ["edition-block-2-group-0-inline-1", 2],
  ["edition-block-2-group-0-inline-3", 2],
  ["edition-block-9-group-0-inline-3", 2],
  ["edition-block-13-group-0-inline-1", 2],
  ["edition-block-15-group-0-inline-2", 2],
  ["edition-block-16-group-0-inline-3", 2],
  ["edition-block-16-group-0-inline-5", 2],
  ["edition-block-18-group-0-inline-1", 2],
  ["edition-block-20-group-0-inline-10", 2],
  ["edition-block-26-group-0-inline-3", 2],
  ["edition-block-3-group-0-inline-1", 3],
  ["edition-block-3-group-0-inline-3", 3],
  ["edition-block-3-group-0-inline-5", 3],
  ["edition-block-9-group-0-inline-5", 3],
  ["edition-block-13-group-0-inline-5", 3],
  ["edition-block-17-group-0-inline-1", 3],
  ["edition-block-19-group-0-inline-1", 3],
  ["edition-block-20-group-0-inline-0", 3],
  ["edition-block-20-group-0-inline-2", 3],
  ["edition-block-20-group-0-inline-6", 3],
  ["edition-block-20-group-0-inline-8", 3],
  ["edition-block-27-group-0-inline-1", 3],
] as const satisfies readonly (readonly [
  FigureOccurrenceKey,
  keyof typeof HOWE_SEWING_MACHINE_SOURCE_SHEET_ASSETS,
])[];

function howeSewingMachineSourceSheetLocator(
  occurrenceKey: FigureOccurrenceKey,
  sourcePdfPage: keyof typeof HOWE_SEWING_MACHINE_SOURCE_SHEET_ASSETS,
): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: HOWE_SEWING_MACHINE_SOURCE_SHEET_RASTER.width,
    height: HOWE_SEWING_MACHINE_SOURCE_SHEET_RASTER.height,
  };
  return {
    occurrenceKey,
    activeAsset: HOWE_SEWING_MACHINE_SOURCE_SHEET_ASSETS[sourcePdfPage],
    sourcePdfPage,
    sourceRaster: HOWE_SEWING_MACHINE_SOURCE_SHEET_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(
      sourceRectPixels,
      HOWE_SEWING_MACHINE_SOURCE_SHEET_RASTER,
    ),
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-04",
    evidenceReference: HOWE_SEWING_MACHINE_SOURCE_SHEET_EVIDENCE_REFERENCE,
  };
}

const AMF_VERSATRAN_SOURCE_SHEET_RASTER = { width: 2320, height: 3408 } as const;
const AMF_VERSATRAN_SOURCE_SHEET_EVIDENCE_REFERENCE =
  "docs/provenance/us-3212649-amf-versatran.md#complete-source-sheet-acceptance-2026-09-04";
const AMF_VERSATRAN_SOURCE_SHEET_ASSETS = {
  1: "/patents/figures/us-3212649-amf-versatran/source-sheet-1-v1.png",
  2: "/patents/figures/us-3212649-amf-versatran/source-sheet-2-v1.png",
  3: "/patents/figures/us-3212649-amf-versatran/source-sheet-3-v1.png",
  4: "/patents/figures/us-3212649-amf-versatran/source-sheet-4-v1.png",
  5: "/patents/figures/us-3212649-amf-versatran/source-sheet-5-v1.png",
  6: "/patents/figures/us-3212649-amf-versatran/source-sheet-6-v1.png",
  7: "/patents/figures/us-3212649-amf-versatran/source-sheet-7-v1.png",
  8: "/patents/figures/us-3212649-amf-versatran/source-sheet-8-v1.png",
  9: "/patents/figures/us-3212649-amf-versatran/source-sheet-9-v1.png",
  10: "/patents/figures/us-3212649-amf-versatran/source-sheet-10-v1.png",
  11: "/patents/figures/us-3212649-amf-versatran/source-sheet-11-v1.png",
  12: "/patents/figures/us-3212649-amf-versatran/source-sheet-12-v1.png",
  13: "/patents/figures/us-3212649-amf-versatran/source-sheet-13-v1.png",
  14: "/patents/figures/us-3212649-amf-versatran/source-sheet-14-v1.png",
  15: "/patents/figures/us-3212649-amf-versatran/source-sheet-15-v1.png",
  16: "/patents/figures/us-3212649-amf-versatran/source-sheet-16-v1.png",
  17: "/patents/figures/us-3212649-amf-versatran/source-sheet-17-v1.png",
} as const;
const AMF_VERSATRAN_SOURCE_SHEET_OCCURRENCES = [
  ["edition-block-23-group-0-inline-1", 1],
  ["edition-block-23-group-0-inline-3", 2],
  ["edition-block-23-group-0-inline-5", 2],
  ["edition-block-23-group-0-inline-7", 3],
  ["edition-block-23-group-0-inline-9", 3],
  ["edition-block-23-group-0-inline-11", 3],
  ["edition-block-23-group-0-inline-13", 3],
  ["edition-block-23-group-0-inline-15", 3],
  ["edition-block-23-group-0-inline-17", 3],
  ["edition-block-23-group-0-inline-19", 4],
  ["edition-block-23-group-0-inline-21", 3],
  ["edition-block-23-group-0-inline-23", 4],
  ["edition-block-23-group-0-inline-25", 3],
  ["edition-block-23-group-0-inline-27", 4],
  ["edition-block-23-group-0-inline-29", 3],
  ["edition-block-23-group-0-inline-31", 4],
  ["edition-block-23-group-0-inline-33", 2],
  ["edition-block-23-group-0-inline-35", 5],
  ["edition-block-23-group-0-inline-37", 3],
  ["edition-block-23-group-0-inline-39", 5],
  ["edition-block-23-group-0-inline-41", 3],
  ["edition-block-23-group-0-inline-43", 5],
  ["edition-block-23-group-0-inline-45", 3],
  ["edition-block-23-group-0-inline-47", 5],
  ["edition-block-23-group-0-inline-49", 3],
  ["edition-block-23-group-0-inline-51", 6],
  ["edition-block-23-group-0-inline-53", 6],
  ["edition-block-23-group-0-inline-55", 6],
  ["edition-block-23-group-0-inline-57", 6],
  ["edition-block-23-group-0-inline-59", 6],
  ["edition-block-23-group-0-inline-61", 6],
  ["edition-block-23-group-0-inline-63", 5],
  ["edition-block-23-group-0-inline-65", 7],
  ["edition-block-23-group-0-inline-67", 7],
  ["edition-block-23-group-0-inline-69", 7],
  ["edition-block-23-group-0-inline-71", 7],
  ["edition-block-23-group-0-inline-73", 8],
  ["edition-block-23-group-0-inline-75", 7],
  ["edition-block-23-group-0-inline-77", 8],
  ["edition-block-23-group-0-inline-79", 8],
  ["edition-block-23-group-0-inline-81", 8],
  ["edition-block-23-group-0-inline-83", 8],
  ["edition-block-23-group-0-inline-85", 7],
  ["edition-block-23-group-0-inline-87", 8],
  ["edition-block-23-group-0-inline-89", 7],
  ["edition-block-23-group-0-inline-91", 8],
  ["edition-block-23-group-0-inline-93", 7],
  ["edition-block-23-group-0-inline-95", 9],
  ["edition-block-23-group-0-inline-97", 9],
  ["edition-block-23-group-0-inline-99", 9],
  ["edition-block-23-group-0-inline-101", 9],
  ["edition-block-23-group-0-inline-103", 9],
  ["edition-block-23-group-0-inline-105", 10],
  ["edition-block-23-group-0-inline-107", 9],
  ["edition-block-23-group-0-inline-109", 10],
  ["edition-block-23-group-0-inline-111", 10],
  ["edition-block-23-group-0-inline-113", 10],
  ["edition-block-23-group-0-inline-115", 11],
  ["edition-block-23-group-0-inline-117", 11],
  ["edition-block-23-group-0-inline-119", 11],
  ["edition-block-23-group-0-inline-121", 12],
  ["edition-block-23-group-0-inline-123", 12],
  ["edition-block-23-group-0-inline-125", 11],
  ["edition-block-23-group-0-inline-127", 12],
  ["edition-block-23-group-0-inline-129", 12],
  ["edition-block-23-group-0-inline-131", 12],
  ["edition-block-23-group-0-inline-133", 11],
  ["edition-block-23-group-0-inline-135", 12],
  ["edition-block-23-group-0-inline-137", 12],
  ["edition-block-23-group-0-inline-139", 12],
  ["edition-block-23-group-0-inline-141", 11],
  ["edition-block-23-group-0-inline-143", 13],
  ["edition-block-23-group-0-inline-147", 13],
  ["edition-block-23-group-0-inline-149", 13],
  ["edition-block-23-group-0-inline-151", 13],
  ["edition-block-23-group-0-inline-153", 13],
  ["edition-block-23-group-0-inline-155", 13],
  ["edition-block-23-group-0-inline-159", 14],
  ["edition-block-23-group-0-inline-161", 15],
  ["edition-block-23-group-0-inline-163", 16],
  ["edition-block-23-group-0-inline-165", 17],
  ["edition-block-23-group-0-inline-167", 17],
  ["edition-block-26-group-0-inline-1", 1],
  ["edition-block-28-group-0-inline-1", 3],
  ["edition-block-28-group-0-inline-3", 3],
  ["edition-block-29-group-0-inline-1", 3],
  ["edition-block-29-group-0-inline-3", 3],
  ["edition-block-29-group-0-inline-5", 3],
  ["edition-block-29-group-0-inline-7", 3],
  ["edition-block-29-group-0-inline-9", 3],
  ["edition-block-29-group-0-inline-11", 9],
  ["edition-block-30-group-0-inline-1", 4],
  ["edition-block-30-group-0-inline-3", 4],
  ["edition-block-30-group-0-inline-5", 4],
  ["edition-block-30-group-0-inline-7", 4],
  ["edition-block-31-group-0-inline-1", 3],
  ["edition-block-33-group-0-inline-1", 1],
  ["edition-block-33-group-0-inline-3", 5],
  ["edition-block-34-group-0-inline-1", 5],
  ["edition-block-34-group-0-inline-3", 3],
  ["edition-block-35-group-0-inline-1", 5],
  ["edition-block-37-group-0-inline-1", 3],
  ["edition-block-37-group-0-inline-3", 3],
  ["edition-block-37-group-0-inline-5", 3],
  ["edition-block-38-group-0-inline-1", 2],
  ["edition-block-38-group-0-inline-3", 2],
  ["edition-block-38-group-0-inline-5", 2],
  ["edition-block-39-group-0-inline-1", 2],
  ["edition-block-39-group-0-inline-3", 3],
  ["edition-block-40-group-0-inline-1", 4],
  ["edition-block-42-group-0-inline-1", 3],
  ["edition-block-45-group-0-inline-1", 1],
  ["edition-block-45-group-0-inline-3", 5],
  ["edition-block-45-group-0-inline-5", 6],
  ["edition-block-45-group-0-inline-7", 5],
  ["edition-block-45-group-0-inline-9", 5],
  ["edition-block-45-group-0-inline-11", 3],
  ["edition-block-46-group-0-inline-1", 1],
  ["edition-block-48-group-0-inline-1", 6],
  ["edition-block-48-group-0-inline-3", 4],
  ["edition-block-48-group-0-inline-5", 4],
  ["edition-block-48-group-0-inline-7", 1],
  ["edition-block-48-group-0-inline-9", 1],
  ["edition-block-49-group-0-inline-1", 6],
  ["edition-block-49-group-0-inline-3", 6],
  ["edition-block-50-group-0-inline-1", 3],
  ["edition-block-50-group-0-inline-3", 6],
  ["edition-block-50-group-0-inline-5", 6],
  ["edition-block-50-group-0-inline-7", 6],
  ["edition-block-50-group-0-inline-9", 6],
  ["edition-block-53-group-0-inline-1", 6],
  ["edition-block-53-group-0-inline-3", 6],
  ["edition-block-57-group-0-inline-1", 11],
  ["edition-block-57-group-0-inline-3", 12],
  ["edition-block-57-group-0-inline-5", 11],
  ["edition-block-58-group-0-inline-1", 11],
  ["edition-block-58-group-0-inline-3", 12],
  ["edition-block-58-group-0-inline-5", 11],
  ["edition-block-58-group-0-inline-7", 11],
  ["edition-block-60-group-0-inline-5", 11],
  ["edition-block-60-group-0-inline-7", 11],
  ["edition-block-61-group-0-inline-1", 11],
  ["edition-block-61-group-0-inline-3", 11],
  ["edition-block-61-group-0-inline-5", 11],
  ["edition-block-61-group-0-inline-7", 11],
  ["edition-block-62-group-0-inline-1", 11],
  ["edition-block-62-group-0-inline-3", 11],
  ["edition-block-62-group-0-inline-5", 11],
  ["edition-block-62-group-0-inline-7", 11],
  ["edition-block-62-group-0-inline-9", 12],
  ["edition-block-63-group-0-inline-1", 12],
  ["edition-block-64-group-0-inline-1", 11],
  ["edition-block-64-group-0-inline-3", 12],
  ["edition-block-65-group-0-inline-1", 11],
  ["edition-block-65-group-0-inline-3", 11],
  ["edition-block-65-group-0-inline-7", 11],
  ["edition-block-65-group-0-inline-11", 11],
  ["edition-block-65-group-0-inline-13", 11],
  ["edition-block-67-group-0-inline-1", 11],
  ["edition-block-67-group-0-inline-3", 11],
  ["edition-block-67-group-0-inline-5", 12],
  ["edition-block-69-group-0-inline-1", 11],
  ["edition-block-69-group-0-inline-3", 11],
  ["edition-block-69-group-0-inline-5", 11],
  ["edition-block-69-group-0-inline-9", 11],
  ["edition-block-71-group-0-inline-1", 1],
  ["edition-block-71-group-0-inline-3", 7],
  ["edition-block-71-group-0-inline-5", 8],
  ["edition-block-72-group-0-inline-1", 7],
  ["edition-block-72-group-0-inline-3", 7],
  ["edition-block-73-group-0-inline-1", 7],
  ["edition-block-73-group-0-inline-3", 1],
  ["edition-block-74-group-0-inline-1", 7],
  ["edition-block-74-group-0-inline-3", 8],
  ["edition-block-74-group-0-inline-5", 7],
  ["edition-block-74-group-0-inline-7", 7],
  ["edition-block-74-group-0-inline-9", 3],
  ["edition-block-74-group-0-inline-11", 7],
  ["edition-block-75-group-0-inline-1", 7],
  ["edition-block-75-group-0-inline-3", 8],
  ["edition-block-75-group-0-inline-5", 1],
  ["edition-block-75-group-0-inline-7", 11],
  ["edition-block-76-group-0-inline-1", 8],
  ["edition-block-76-group-0-inline-3", 8],
  ["edition-block-78-group-0-inline-1", 9],
  ["edition-block-79-group-0-inline-1", 9],
  ["edition-block-79-group-0-inline-3", 9],
  ["edition-block-79-group-0-inline-5", 10],
  ["edition-block-80-group-0-inline-1", 9],
  ["edition-block-80-group-0-inline-3", 9],
  ["edition-block-80-group-0-inline-5", 9],
  ["edition-block-80-group-0-inline-7", 9],
  ["edition-block-80-group-0-inline-9", 9],
  ["edition-block-81-group-0-inline-1", 9],
  ["edition-block-81-group-0-inline-3", 9],
  ["edition-block-81-group-0-inline-5", 9],
  ["edition-block-81-group-0-inline-7", 9],
  ["edition-block-81-group-0-inline-9", 9],
  ["edition-block-82-group-0-inline-1", 9],
  ["edition-block-82-group-0-inline-3", 9],
  ["edition-block-85-group-0-inline-1", 9],
  ["edition-block-87-group-0-inline-1", 14],
  ["edition-block-87-group-0-inline-3", 14],
  ["edition-block-88-group-0-inline-1", 14],
  ["edition-block-91-group-0-inline-1", 13],
  ["edition-block-92-group-0-inline-2", 1],
  ["edition-block-92-group-0-inline-4", 13],
  ["edition-block-93-group-0-inline-1", 13],
  ["edition-block-93-group-0-inline-7", 13],
  ["edition-block-93-group-0-inline-13", 13],
  ["edition-block-94-group-0-inline-1", 13],
  ["edition-block-94-group-0-inline-7", 13],
  ["edition-block-95-group-0-inline-5", 13],
  ["edition-block-95-group-0-inline-7", 13],
  ["edition-block-95-group-0-inline-9", 13],
  ["edition-block-96-group-0-inline-5", 13],
  ["edition-block-97-group-0-inline-3", 13],
  ["edition-block-97-group-0-inline-11", 13],
  ["edition-block-101-group-0-inline-1", 3],
  ["edition-block-101-group-0-inline-3", 3],
  ["edition-block-101-group-0-inline-7", 3],
  ["edition-block-102-group-0-inline-3", 1],
  ["edition-block-103-group-0-inline-3", 1],
  ["edition-block-103-group-0-inline-5", 5],
  ["edition-block-103-group-0-inline-9", 1],
  ["edition-block-106-group-0-inline-0", 15],
  ["edition-block-110-group-0-inline-7", 15],
  ["edition-block-112-group-0-inline-1", 15],
  ["edition-block-114-group-0-inline-1", 16],
  ["edition-block-116-group-0-inline-1", 17],
  ["edition-block-122-group-0-inline-1", 17],
  ["edition-block-122-group-0-inline-3", 17],
  ["edition-block-122-group-0-inline-5", 17],
  ["edition-block-123-group-0-inline-1", 15],
] as const satisfies readonly (readonly [
  FigureOccurrenceKey,
  keyof typeof AMF_VERSATRAN_SOURCE_SHEET_ASSETS,
])[];

function amfVersatranSourceSheetLocator(
  occurrenceKey: FigureOccurrenceKey,
  sourcePdfPage: keyof typeof AMF_VERSATRAN_SOURCE_SHEET_ASSETS,
): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: AMF_VERSATRAN_SOURCE_SHEET_RASTER.width,
    height: AMF_VERSATRAN_SOURCE_SHEET_RASTER.height,
  };
  return {
    occurrenceKey,
    activeAsset: AMF_VERSATRAN_SOURCE_SHEET_ASSETS[sourcePdfPage],
    sourcePdfPage,
    sourceRaster: AMF_VERSATRAN_SOURCE_SHEET_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(
      sourceRectPixels,
      AMF_VERSATRAN_SOURCE_SHEET_RASTER,
    ),
    reviewer:
      "Classic Patents editorial agent (GPT-5.6); direct full-resolution source-pixel review",
    reviewedAt: "2026-09-04",
    evidenceReference: AMF_VERSATRAN_SOURCE_SHEET_EVIDENCE_REFERENCE,
  };
}

const BARDEEN_TRANSISTOR_SOURCE_SHEET_RASTER = { width: 1392, height: 2045 } as const;
const BARDEEN_TRANSISTOR_SOURCE_SHEET_EVIDENCE_REFERENCE =
  "docs/provenance/us-2524035-bardeen-transistor.md#complete-source-sheet-acceptance-2026-09-04";
const BARDEEN_TRANSISTOR_SOURCE_SHEET_ASSETS = {
  1: "/patents/figures/us-2524035-bardeen-transistor/figs-1-2-10-12-source-crop-v1.png",
  2: "/patents/figures/us-2524035-bardeen-transistor/figs-3-9-source-crop-v1.png",
  3: "/patents/figures/us-2524035-bardeen-transistor/figs-13-16-source-crop-v1.png",
} as const;
const BARDEEN_TRANSISTOR_SOURCE_SHEET_OCCURRENCES = [
  ["edition-block-1-group-0-inline-0", 1],
  ["edition-block-1-group-0-inline-2", 1],
  ["edition-block-1-group-0-inline-4", 1],
  ["edition-block-1-group-0-inline-6", 1],
  ["edition-block-1-group-0-inline-8", 1],
  ["edition-block-1-group-0-inline-10", 1],
  ["edition-block-26-group-0-inline-0", 1],
  ["edition-block-26-group-0-inline-2", 1],
  ["edition-block-26-group-0-inline-4", 1],
  ["edition-block-26-group-0-inline-6", 1],
  ["edition-block-26-group-0-inline-8", 1],
  ["edition-block-26-group-0-inline-12", 1],
  ["edition-block-26-group-0-inline-26", 1],
  ["edition-block-26-group-0-inline-32", 1],
  ["edition-block-26-group-0-inline-34", 1],
  ["edition-block-26-group-0-inline-36", 1],
  ["edition-block-26-group-0-inline-38", 1],
  ["edition-block-42-group-0-inline-0", 1],
  ["edition-block-42-group-0-inline-2", 1],
  ["edition-block-42-group-0-inline-4", 1],
  ["edition-block-42-group-0-inline-6", 1],
  ["edition-block-47-group-0-inline-1", 1],
  ["edition-block-47-group-0-inline-3", 1],
  ["edition-block-47-group-0-inline-5", 1],
  ["edition-block-47-group-0-inline-7", 1],
  ["edition-block-49-group-0-inline-1", 1],
  ["edition-block-52-group-0-inline-1", 1],
  ["edition-block-53-group-0-inline-1", 1],
  ["edition-block-56-group-0-inline-1", 1],
  ["edition-block-60-group-0-inline-1", 1],
  ["edition-block-60-group-0-inline-3", 1],
  ["edition-block-69-group-0-inline-1", 1],
  ["edition-block-87-group-0-inline-1", 1],
  ["edition-block-87-group-0-inline-3", 1],
  ["edition-block-87-group-0-inline-5", 1],
  ["edition-block-87-group-0-inline-7", 1],
  ["edition-block-2-group-0-inline-0", 2],
  ["edition-block-2-group-0-inline-2", 2],
  ["edition-block-2-group-0-inline-4", 2],
  ["edition-block-2-group-0-inline-6", 2],
  ["edition-block-2-group-0-inline-8", 2],
  ["edition-block-2-group-0-inline-10", 2],
  ["edition-block-2-group-0-inline-12", 2],
  ["edition-block-2-group-0-inline-14", 2],
  ["edition-block-26-group-0-inline-10", 2],
  ["edition-block-26-group-0-inline-14", 2],
  ["edition-block-26-group-0-inline-16", 2],
  ["edition-block-26-group-0-inline-18", 2],
  ["edition-block-26-group-0-inline-20", 2],
  ["edition-block-26-group-0-inline-22", 2],
  ["edition-block-26-group-0-inline-24", 2],
  ["edition-block-26-group-0-inline-28", 2],
  ["edition-block-26-group-0-inline-30", 2],
  ["edition-block-43-group-0-inline-1", 2],
  ["edition-block-43-group-0-inline-3", 2],
  ["edition-block-57-group-0-inline-1", 2],
  ["edition-block-57-group-0-inline-3", 2],
  ["edition-block-58-group-0-inline-1", 2],
  ["edition-block-58-group-0-inline-3", 2],
  ["edition-block-59-group-0-inline-1", 2],
  ["edition-block-59-group-0-inline-3", 2],
  ["edition-block-59-group-0-inline-5", 2],
  ["edition-block-61-group-0-inline-1", 2],
  ["edition-block-61-group-0-inline-3", 2],
  ["edition-block-3-group-0-inline-0", 3],
  ["edition-block-3-group-0-inline-2", 3],
  ["edition-block-3-group-0-inline-4", 3],
  ["edition-block-3-group-0-inline-6", 3],
  ["edition-block-27-group-0-inline-0", 3],
  ["edition-block-27-group-0-inline-2", 3],
  ["edition-block-27-group-0-inline-4", 3],
  ["edition-block-27-group-0-inline-6", 3],
  ["edition-block-27-group-0-inline-8", 3],
  ["edition-block-62-group-0-inline-1", 3],
  ["edition-block-66-group-0-inline-1", 3],
  ["edition-block-67-group-0-inline-0", 3],
  ["edition-block-68-group-0-inline-1", 3],
  ["edition-block-69-group-0-inline-3", 3],
  ["edition-block-78-group-0-inline-1", 3],
  ["edition-block-78-group-0-inline-3", 3],
  ["edition-block-82-group-0-inline-1", 3],
  ["edition-block-83-group-0-inline-0", 3],
  ["edition-block-83-group-0-inline-2", 3],
  ["edition-block-86-group-0-inline-1", 3],
  ["edition-block-86-group-0-inline-3", 3],
] as const satisfies readonly (readonly [
  FigureOccurrenceKey,
  keyof typeof BARDEEN_TRANSISTOR_SOURCE_SHEET_ASSETS,
])[];

function bardeenTransistorSourceSheetLocator(
  occurrenceKey: FigureOccurrenceKey,
  sourcePdfPage: keyof typeof BARDEEN_TRANSISTOR_SOURCE_SHEET_ASSETS,
): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: BARDEEN_TRANSISTOR_SOURCE_SHEET_RASTER.width,
    height: BARDEEN_TRANSISTOR_SOURCE_SHEET_RASTER.height,
  };
  return {
    occurrenceKey,
    activeAsset: BARDEEN_TRANSISTOR_SOURCE_SHEET_ASSETS[sourcePdfPage],
    sourcePdfPage,
    sourceRaster: BARDEEN_TRANSISTOR_SOURCE_SHEET_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(
      sourceRectPixels,
      BARDEEN_TRANSISTOR_SOURCE_SHEET_RASTER,
    ),
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 180 DPI source-pixel review",
    reviewedAt: "2026-09-04",
    evidenceReference: BARDEEN_TRANSISTOR_SOURCE_SHEET_EVIDENCE_REFERENCE,
  };
}

const BOYLE_SMITH_CCD_SOURCE_SHEET_RASTER = { width: 2320, height: 3408 } as const;
const BOYLE_SMITH_CCD_SOURCE_SHEET_EVIDENCE_REFERENCE =
  "docs/provenance/us-3858232-boyle-smith-ccd.md#complete-source-sheet-acceptance-2026-09-04";
const BOYLE_SMITH_CCD_SOURCE_SHEET_ASSETS = {
  2: "/patents/figures/us-3858232-boyle-smith-ccd/source-sheet-2-v1.png",
  3: "/patents/figures/us-3858232-boyle-smith-ccd/source-sheet-3-v1.png",
  4: "/patents/figures/us-3858232-boyle-smith-ccd/source-sheet-4-v1.png",
  5: "/patents/figures/us-3858232-boyle-smith-ccd/source-sheet-5-v1.png",
  6: "/patents/figures/us-3858232-boyle-smith-ccd/source-sheet-6-v1.png",
  7: "/patents/figures/us-3858232-boyle-smith-ccd/source-sheet-7-v1.png",
  8: "/patents/figures/us-3858232-boyle-smith-ccd/source-sheet-8-v1.png",
  9: "/patents/figures/us-3858232-boyle-smith-ccd/source-sheet-9-v1.png",
} as const;
const BOYLE_SMITH_CCD_SOURCE_SHEET_OCCURRENCES = [
  ["edition-block-18-group-0-inline-1", 2],
  ["edition-block-24-group-0-inline-1", 2],
  ["edition-block-44-group-0-inline-1", 2],
  ["edition-block-45-group-0-inline-2", 2],
  ["edition-block-109-group-0-inline-0", 2],
  ["edition-block-110-group-0-inline-0", 2],
  ["edition-block-111-group-0-inline-0", 2],
  ["edition-block-112-group-0-inline-0", 2],
  ["edition-block-18-group-0-inline-3", 3],
  ["edition-block-18-group-0-inline-7", 3],
  ["edition-block-19-group-0-inline-12", 3],
  ["edition-block-21-group-0-inline-1", 3],
  ["edition-block-21-group-0-inline-3", 3],
  ["edition-block-23-group-0-inline-1", 3],
  ["edition-block-23-group-0-inline-5", 3],
  ["edition-block-29-group-0-inline-1", 3],
  ["edition-block-32-group-0-inline-1", 3],
  ["edition-block-32-group-0-inline-3", 3],
  ["edition-block-34-group-0-inline-3", 3],
  ["edition-block-39-group-0-inline-1", 3],
  ["edition-block-42-group-0-inline-3", 3],
  ["edition-block-49-group-0-inline-3", 3],
  ["edition-block-59-group-0-inline-1", 3],
  ["edition-block-59-group-0-inline-5", 3],
  ["edition-block-59-group-0-inline-11", 3],
  ["edition-block-64-group-0-inline-3", 3],
  ["edition-block-64-group-0-inline-5", 3],
  ["edition-block-65-group-0-inline-3", 3],
  ["edition-block-67-group-0-inline-3", 3],
  ["edition-block-67-group-0-inline-5", 3],
  ["edition-block-67-group-0-inline-7", 3],
  ["edition-block-69-group-0-inline-1", 3],
  ["edition-block-113-group-0-inline-0", 3],
  ["edition-block-18-group-0-inline-5", 4],
  ["edition-block-23-group-0-inline-3", 4],
  ["edition-block-24-group-0-inline-3", 4],
  ["edition-block-24-group-0-inline-5", 4],
  ["edition-block-26-group-0-inline-3", 4],
  ["edition-block-26-group-0-inline-5", 4],
  ["edition-block-45-group-0-inline-4", 4],
  ["edition-block-114-group-0-inline-0", 4],
  ["edition-block-18-group-0-inline-9", 5],
  ["edition-block-19-group-0-inline-4", 5],
  ["edition-block-26-group-0-inline-1", 5],
  ["edition-block-31-group-0-inline-3", 5],
  ["edition-block-34-group-0-inline-1", 5],
  ["edition-block-34-group-0-inline-5", 5],
  ["edition-block-35-group-0-inline-1", 5],
  ["edition-block-35-group-0-inline-3", 5],
  ["edition-block-36-group-0-inline-1", 5],
  ["edition-block-36-group-0-inline-3", 5],
  ["edition-block-38-group-0-inline-1", 5],
  ["edition-block-49-group-0-inline-1", 5],
  ["edition-block-60-group-0-inline-3", 5],
  ["edition-block-60-group-0-inline-5", 5],
  ["edition-block-68-group-0-inline-5", 5],
  ["edition-block-115-group-0-inline-0", 5],
  ["edition-block-118-group-0-inline-0", 5],
  ["edition-block-119-group-0-inline-0", 5],
  ["edition-block-120-group-0-inline-0", 5],
  ["edition-block-19-group-0-inline-0", 6],
  ["edition-block-19-group-0-inline-2", 6],
  ["edition-block-19-group-0-inline-6", 6],
  ["edition-block-27-group-0-inline-1", 6],
  ["edition-block-31-group-0-inline-1", 6],
  ["edition-block-42-group-0-inline-1", 6],
  ["edition-block-46-group-0-inline-1", 6],
  ["edition-block-116-group-0-inline-0", 6],
  ["edition-block-117-group-0-inline-0", 6],
  ["edition-block-121-group-0-inline-0", 6],
  ["edition-block-19-group-0-inline-8", 7],
  ["edition-block-19-group-0-inline-10", 7],
  ["edition-block-44-group-0-inline-5", 7],
  ["edition-block-45-group-0-inline-0", 7],
  ["edition-block-45-group-0-inline-6", 7],
  ["edition-block-47-group-0-inline-1", 7],
  ["edition-block-59-group-0-inline-3", 7],
  ["edition-block-59-group-0-inline-7", 7],
  ["edition-block-59-group-0-inline-9", 7],
  ["edition-block-122-group-0-inline-0", 7],
  ["edition-block-123-group-0-inline-0", 7],
  ["edition-block-124-group-0-inline-0", 7],
  ["edition-block-19-group-0-inline-14", 8],
  ["edition-block-19-group-0-inline-16", 8],
  ["edition-block-19-group-0-inline-18", 8],
  ["edition-block-60-group-0-inline-1", 8],
  ["edition-block-61-group-0-inline-1", 8],
  ["edition-block-62-group-0-inline-1", 8],
  ["edition-block-63-group-0-inline-1", 8],
  ["edition-block-65-group-0-inline-1", 8],
  ["edition-block-125-group-0-inline-0", 8],
  ["edition-block-126-group-0-inline-0", 8],
  ["edition-block-127-group-0-inline-0", 8],
  ["edition-block-19-group-0-inline-20", 9],
  ["edition-block-19-group-0-inline-22", 9],
  ["edition-block-19-group-0-inline-24", 9],
  ["edition-block-19-group-0-inline-26", 9],
  ["edition-block-64-group-0-inline-1", 9],
  ["edition-block-67-group-0-inline-1", 9],
  ["edition-block-68-group-0-inline-1", 9],
  ["edition-block-68-group-0-inline-3", 9],
  ["edition-block-128-group-0-inline-0", 9],
  ["edition-block-129-group-0-inline-0", 9],
  ["edition-block-130-group-0-inline-0", 9],
] as const satisfies readonly (readonly [
  FigureOccurrenceKey,
  keyof typeof BOYLE_SMITH_CCD_SOURCE_SHEET_ASSETS,
])[];

function boyleSmithCcdSourceSheetLocator(
  occurrenceKey: FigureOccurrenceKey,
  sourcePdfPage: keyof typeof BOYLE_SMITH_CCD_SOURCE_SHEET_ASSETS,
): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: BOYLE_SMITH_CCD_SOURCE_SHEET_RASTER.width,
    height: BOYLE_SMITH_CCD_SOURCE_SHEET_RASTER.height,
  };
  return {
    occurrenceKey,
    activeAsset: BOYLE_SMITH_CCD_SOURCE_SHEET_ASSETS[sourcePdfPage],
    sourcePdfPage,
    sourceRaster: BOYLE_SMITH_CCD_SOURCE_SHEET_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(
      sourceRectPixels,
      BOYLE_SMITH_CCD_SOURCE_SHEET_RASTER,
    ),
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-04",
    evidenceReference: BOYLE_SMITH_CCD_SOURCE_SHEET_EVIDENCE_REFERENCE,
  };
}

const MAIMAN_RUBY_LASER_SOURCE_SHEET_RASTER = { width: 2320, height: 3408 } as const;
const MAIMAN_RUBY_LASER_SOURCE_SHEET_EVIDENCE_REFERENCE =
  "docs/provenance/us-3353115-maiman-ruby-laser.md#source-sheet-acceptance-2026-09-04";
const MAIMAN_RUBY_LASER_SOURCE_SHEET_ASSETS = {
  1: "/patents/figures/us-3353115-maiman-ruby-laser/sheet-1-01.png",
  2: "/patents/figures/us-3353115-maiman-ruby-laser/sheet-2-02.png",
  3: "/patents/figures/us-3353115-maiman-ruby-laser/sheet-3-03.png",
  4: "/patents/figures/us-3353115-maiman-ruby-laser/sheet-4-04.png",
  5: "/patents/figures/us-3353115-maiman-ruby-laser/sheet-5-05.png",
} as const;
const MAIMAN_RUBY_LASER_SOURCE_SHEET_OCCURRENCES = [
  ["edition-block-2-group-0-inline-1", 1],
  ["edition-block-2-group-0-inline-3", 1],
  ["edition-block-2-group-0-inline-5", 1],
  ["edition-block-17-group-0-inline-1", 1],
  ["edition-block-17-group-0-inline-3", 1],
  ["edition-block-17-group-0-inline-5", 1],
  ["edition-block-20-group-0-inline-1", 1],
  ["edition-block-22-group-0-inline-1", 1],
  ["edition-block-23-group-0-inline-0", 1],
  ["edition-block-3-group-0-inline-1", 2],
  ["edition-block-3-group-0-inline-3", 2],
  ["edition-block-3-group-0-inline-5", 2],
  ["edition-block-3-group-0-inline-7", 2],
  ["edition-block-17-group-0-inline-7", 2],
  ["edition-block-17-group-0-inline-9", 2],
  ["edition-block-17-group-0-inline-11", 2],
  ["edition-block-17-group-0-inline-13", 2],
  ["edition-block-17-group-0-inline-15", 2],
  ["edition-block-24-group-0-inline-1", 2],
  ["edition-block-25-group-0-inline-1", 2],
  ["edition-block-26-group-0-inline-0", 2],
  ["edition-block-26-group-0-inline-2", 2],
  ["edition-block-4-group-0-inline-1", 3],
  ["edition-block-4-group-0-inline-3", 3],
  ["edition-block-4-group-0-inline-5", 3],
  ["edition-block-4-group-0-inline-7", 3],
  ["edition-block-17-group-0-inline-17", 3],
  ["edition-block-17-group-0-inline-19", 3],
  ["edition-block-17-group-0-inline-21", 3],
  ["edition-block-17-group-0-inline-23", 3],
  ["edition-block-27-group-0-inline-0", 3],
  ["edition-block-28-group-0-inline-0", 3],
  ["edition-block-29-group-0-inline-0", 3],
  ["edition-block-29-group-0-inline-2", 3],
  ["edition-block-5-group-0-inline-1", 4],
  ["edition-block-5-group-0-inline-3", 4],
  ["edition-block-5-group-0-inline-5", 4],
  ["edition-block-5-group-0-inline-7", 4],
  ["edition-block-17-group-0-inline-25", 4],
  ["edition-block-17-group-0-inline-27", 4],
  ["edition-block-17-group-0-inline-29", 4],
  ["edition-block-17-group-0-inline-31", 4],
  ["edition-block-30-group-0-inline-0", 4],
  ["edition-block-31-group-0-inline-0", 4],
  ["edition-block-32-group-0-inline-0", 4],
  ["edition-block-32-group-0-inline-2", 4],
  ["edition-block-32-group-0-inline-4", 4],
  ["edition-block-32-group-0-inline-6", 4],
  ["edition-block-6-group-0-inline-1", 5],
  ["edition-block-6-group-0-inline-3", 5],
  ["edition-block-6-group-0-inline-5", 5],
  ["edition-block-17-group-0-inline-33", 5],
  ["edition-block-17-group-0-inline-35", 5],
  ["edition-block-17-group-0-inline-37", 5],
  ["edition-block-33-group-0-inline-0", 5],
  ["edition-block-33-group-0-inline-2", 5],
  ["edition-block-33-group-0-inline-4", 5],
  ["edition-block-33-group-0-inline-6", 5],
  ["edition-block-34-group-0-inline-1", 5],
] as const satisfies readonly (readonly [
  FigureOccurrenceKey,
  keyof typeof MAIMAN_RUBY_LASER_SOURCE_SHEET_ASSETS,
])[];

function maimanRubyLaserSourceSheetLocator(
  occurrenceKey: FigureOccurrenceKey,
  sourcePdfPage: keyof typeof MAIMAN_RUBY_LASER_SOURCE_SHEET_ASSETS,
): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: MAIMAN_RUBY_LASER_SOURCE_SHEET_RASTER.width,
    height: MAIMAN_RUBY_LASER_SOURCE_SHEET_RASTER.height,
  };
  return {
    occurrenceKey,
    activeAsset: MAIMAN_RUBY_LASER_SOURCE_SHEET_ASSETS[sourcePdfPage],
    sourcePdfPage,
    sourceRaster: MAIMAN_RUBY_LASER_SOURCE_SHEET_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(
      sourceRectPixels,
      MAIMAN_RUBY_LASER_SOURCE_SHEET_RASTER,
    ),
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-04",
    evidenceReference: MAIMAN_RUBY_LASER_SOURCE_SHEET_EVIDENCE_REFERENCE,
  };
}

const GOERTZ_MASTER_SLAVE_MANIPULATOR_SOURCE_SHEET_RASTER = { width: 2320, height: 3408 } as const;
const GOERTZ_MASTER_SLAVE_MANIPULATOR_SOURCE_SHEET_EVIDENCE_REFERENCE =
  "docs/provenance/us-2846084-goertz-electronic-master-slave-manipulator.md#complete-source-sheet-acceptance-2026-09-04";
const GOERTZ_MASTER_SLAVE_MANIPULATOR_SOURCE_SHEET_ASSETS = {
  1: "/patents/figures/us-2846084-goertz-electronic-master-slave-manipulator/source-sheet-1-v1.png",
  2: "/patents/figures/us-2846084-goertz-electronic-master-slave-manipulator/source-sheet-2-v1.png",
  3: "/patents/figures/us-2846084-goertz-electronic-master-slave-manipulator/source-sheet-3-v1.png",
  4: "/patents/figures/us-2846084-goertz-electronic-master-slave-manipulator/source-sheet-4-v1.png",
  5: "/patents/figures/us-2846084-goertz-electronic-master-slave-manipulator/source-sheet-5-v1.png",
  6: "/patents/figures/us-2846084-goertz-electronic-master-slave-manipulator/source-sheet-6-v1.png",
  7: "/patents/figures/us-2846084-goertz-electronic-master-slave-manipulator/source-sheet-7-v1.png",
  8: "/patents/figures/us-2846084-goertz-electronic-master-slave-manipulator/source-sheet-8-v1.png",
  9: "/patents/figures/us-2846084-goertz-electronic-master-slave-manipulator/source-sheet-9-v1.png",
  10: "/patents/figures/us-2846084-goertz-electronic-master-slave-manipulator/source-sheet-10-v1.png",
  11: "/patents/figures/us-2846084-goertz-electronic-master-slave-manipulator/source-sheet-11-v1.png",
} as const;
const GOERTZ_MASTER_SLAVE_MANIPULATOR_SOURCE_SHEET_OCCURRENCES = [
  ["edition-block-7-group-0-inline-0", 1],
  ["edition-block-15-group-0-inline-1", 1],
  ["edition-block-21-group-0-inline-3", 1],
  ["edition-block-24-group-0-inline-1", 1],
  ["edition-block-24-group-0-inline-5", 1],
  ["edition-block-26-group-0-inline-13", 1],
  ["edition-block-31-group-0-inline-7", 1],
  ["edition-block-39-group-0-inline-5", 1],
  ["edition-block-7-group-0-inline-2", 2],
  ["edition-block-8-group-0-inline-2", 2],
  ["edition-block-9-group-0-inline-2", 2],
  ["edition-block-9-group-0-inline-6", 2],
  ["edition-block-30-group-0-inline-9", 2],
  ["edition-block-30-group-0-inline-11", 2],
  ["edition-block-8-group-0-inline-0", 3],
  ["edition-block-8-group-0-inline-4", 3],
  ["edition-block-8-group-0-inline-6", 3],
  ["edition-block-8-group-0-inline-8", 3],
  ["edition-block-8-group-0-inline-10", 3],
  ["edition-block-24-group-0-inline-7", 3],
  ["edition-block-24-group-0-inline-9", 3],
  ["edition-block-25-group-0-inline-1", 3],
  ["edition-block-25-group-0-inline-3", 3],
  ["edition-block-26-group-0-inline-7", 3],
  ["edition-block-27-group-0-inline-1", 3],
  ["edition-block-27-group-0-inline-5", 3],
  ["edition-block-27-group-0-inline-17", 3],
  ["edition-block-29-group-0-inline-3", 3],
  ["edition-block-29-group-0-inline-9", 3],
  ["edition-block-29-group-0-inline-13", 3],
  ["edition-block-39-group-0-inline-7", 3],
  ["edition-block-40-group-0-inline-11", 3],
  ["edition-block-40-group-0-inline-15", 3],
  ["edition-block-9-group-0-inline-0", 4],
  ["edition-block-18-group-0-inline-1", 4],
  ["edition-block-20-group-0-inline-1", 4],
  ["edition-block-21-group-0-inline-1", 4],
  ["edition-block-23-group-0-inline-1", 4],
  ["edition-block-39-group-0-inline-1", 4],
  ["edition-block-40-group-0-inline-5", 4],
  ["edition-block-9-group-0-inline-4", 5],
  ["edition-block-19-group-0-inline-1", 5],
  ["edition-block-20-group-0-inline-5", 5],
  ["edition-block-21-group-0-inline-5", 5],
  ["edition-block-23-group-0-inline-3", 5],
  ["edition-block-30-group-0-inline-5", 5],
  ["edition-block-39-group-0-inline-3", 5],
  ["edition-block-40-group-0-inline-17", 5],
  ["edition-block-9-group-0-inline-8", 6],
  ["edition-block-20-group-0-inline-3", 6],
  ["edition-block-24-group-0-inline-3", 6],
  ["edition-block-10-group-0-inline-0", 7],
  ["edition-block-11-group-0-inline-2", 7],
  ["edition-block-28-group-0-inline-1", 7],
  ["edition-block-29-group-0-inline-1", 7],
  ["edition-block-29-group-0-inline-7", 7],
  ["edition-block-30-group-0-inline-1", 7],
  ["edition-block-39-group-0-inline-9", 7],
  ["edition-block-39-group-0-inline-11", 7],
  ["edition-block-39-group-0-inline-13", 7],
  ["edition-block-39-group-0-inline-15", 7],
  ["edition-block-40-group-0-inline-3", 7],
  ["edition-block-40-group-0-inline-7", 7],
  ["edition-block-40-group-0-inline-9", 7],
  ["edition-block-40-group-0-inline-13", 7],
  ["edition-block-11-group-0-inline-0", 8],
  ["edition-block-11-group-0-inline-4", 8],
  ["edition-block-11-group-0-inline-6", 8],
  ["edition-block-11-group-0-inline-8", 8],
  ["edition-block-11-group-0-inline-10", 8],
  ["edition-block-12-group-0-inline-2", 8],
  ["edition-block-12-group-0-inline-6", 8],
  ["edition-block-22-group-0-inline-1", 8],
  ["edition-block-30-group-0-inline-7", 8],
  ["edition-block-31-group-0-inline-1", 8],
  ["edition-block-31-group-0-inline-3", 8],
  ["edition-block-12-group-0-inline-0", 9],
  ["edition-block-12-group-0-inline-4", 9],
  ["edition-block-31-group-0-inline-5", 9],
  ["edition-block-31-group-0-inline-9", 9],
  ["edition-block-40-group-0-inline-1", 9],
  ["edition-block-13-group-0-inline-0", 10],
  ["edition-block-14-group-0-inline-2", 10],
  ["edition-block-32-group-0-inline-1", 10],
  ["edition-block-32-group-0-inline-3", 10],
  ["edition-block-32-group-0-inline-5", 10],
  ["edition-block-37-group-0-inline-3", 10],
  ["edition-block-39-group-0-inline-17", 10],
  ["edition-block-14-group-0-inline-0", 11],
  ["edition-block-37-group-0-inline-1", 11],
] as const satisfies readonly (readonly [
  FigureOccurrenceKey,
  keyof typeof GOERTZ_MASTER_SLAVE_MANIPULATOR_SOURCE_SHEET_ASSETS,
])[];

function goertzMasterSlaveManipulatorSourceSheetLocator(
  occurrenceKey: FigureOccurrenceKey,
  sourcePdfPage: keyof typeof GOERTZ_MASTER_SLAVE_MANIPULATOR_SOURCE_SHEET_ASSETS,
): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: GOERTZ_MASTER_SLAVE_MANIPULATOR_SOURCE_SHEET_RASTER.width,
    height: GOERTZ_MASTER_SLAVE_MANIPULATOR_SOURCE_SHEET_RASTER.height,
  };
  return {
    occurrenceKey,
    activeAsset: GOERTZ_MASTER_SLAVE_MANIPULATOR_SOURCE_SHEET_ASSETS[sourcePdfPage],
    sourcePdfPage,
    sourceRaster: GOERTZ_MASTER_SLAVE_MANIPULATOR_SOURCE_SHEET_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(
      sourceRectPixels,
      GOERTZ_MASTER_SLAVE_MANIPULATOR_SOURCE_SHEET_RASTER,
    ),
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct native-raster source-sheet review",
    reviewedAt: "2026-09-04",
    evidenceReference: GOERTZ_MASTER_SLAVE_MANIPULATOR_SOURCE_SHEET_EVIDENCE_REFERENCE,
  };
}

const LEMELSON_MACHINE_VISION_SOURCE_SHEET_RASTER = { width: 2320, height: 3408 } as const;
const LEMELSON_MACHINE_VISION_SOURCE_SHEET_EVIDENCE_REFERENCE =
  "docs/provenance/us-3081379-lemelson-machine-vision.md#complete-source-sheet-acceptance-2026-09-04";
const LEMELSON_MACHINE_VISION_SOURCE_SHEET_ASSETS = {
  1: "/patents/figures/us-3081379-lemelson-machine-vision/source-sheet-1-v1.png",
  2: "/patents/figures/us-3081379-lemelson-machine-vision/source-sheet-2-v1.png",
  3: "/patents/figures/us-3081379-lemelson-machine-vision/source-sheet-3-v1.png",
  4: "/patents/figures/us-3081379-lemelson-machine-vision/source-sheet-4-v1.png",
  5: "/patents/figures/us-3081379-lemelson-machine-vision/source-sheet-5-v1.png",
  6: "/patents/figures/us-3081379-lemelson-machine-vision/source-sheet-6-v1.png",
  7: "/patents/figures/us-3081379-lemelson-machine-vision/source-sheet-7-v1.png",
  8: "/patents/figures/us-3081379-lemelson-machine-vision/source-sheet-8-v1.png",
  9: "/patents/figures/us-3081379-lemelson-machine-vision/source-sheet-9-v1.png",
  10: "/patents/figures/us-3081379-lemelson-machine-vision/source-sheet-10-v1.png",
} as const;
const LEMELSON_MACHINE_VISION_SOURCE_SHEET_OCCURRENCES = [
  ["edition-block-22-group-0-inline-0", 1],
  ["edition-block-27-group-0-inline-0", 1],
  ["edition-block-28-group-0-inline-0", 1],
  ["edition-block-81-group-0-inline-0", 1],
  ["edition-block-81-group-0-inline-2", 1],
  ["edition-block-82-group-0-inline-1", 1],
  ["edition-block-83-group-0-inline-1", 1],
  ["edition-block-90-group-0-inline-1", 1],
  ["edition-block-90-group-0-inline-3", 1],
  ["edition-block-91-group-0-inline-1", 1],
  ["edition-block-91-group-0-inline-3", 1],
  ["edition-block-92-group-0-inline-1", 1],
  ["edition-block-93-group-0-inline-1", 1],
  ["edition-block-94-group-0-inline-1", 1],
  ["edition-block-95-group-0-inline-1", 1],
  ["edition-block-96-group-0-inline-1", 1],
  ["edition-block-103-group-0-inline-2", 1],
  ["edition-block-109-group-0-inline-1", 1],
  ["edition-block-109-group-0-inline-3", 1],
  ["edition-block-123-group-0-inline-0", 1],
  ["edition-block-123-group-0-inline-2", 1],
  ["edition-block-123-group-0-inline-4", 1],
  ["edition-block-123-group-0-inline-6", 1],
  ["edition-block-23-group-0-inline-0", 2],
  ["edition-block-24-group-0-inline-0", 2],
  ["edition-block-25-group-0-inline-0", 2],
  ["edition-block-99-group-0-inline-0", 2],
  ["edition-block-100-group-0-inline-1", 2],
  ["edition-block-102-group-0-inline-1", 2],
  ["edition-block-102-group-0-inline-3", 2],
  ["edition-block-102-group-0-inline-5", 2],
  ["edition-block-103-group-0-inline-0", 2],
  ["edition-block-103-group-0-inline-4", 2],
  ["edition-block-103-group-0-inline-6", 2],
  ["edition-block-103-group-0-inline-8", 2],
  ["edition-block-105-group-0-inline-1", 2],
  ["edition-block-106-group-0-inline-1", 2],
  ["edition-block-106-group-0-inline-3", 2],
  ["edition-block-107-group-0-inline-1", 2],
  ["edition-block-107-group-0-inline-3", 2],
  ["edition-block-107-group-0-inline-5", 2],
  ["edition-block-108-group-0-inline-1", 2],
  ["edition-block-109-group-0-inline-5", 2],
  ["edition-block-110-group-0-inline-3", 2],
  ["edition-block-112-group-0-inline-3", 2],
  ["edition-block-26-group-0-inline-0", 3],
  ["edition-block-114-group-0-inline-1", 2],
  ["edition-block-114-group-0-inline-3", 3],
  ["edition-block-115-group-0-inline-1", 3],
  ["edition-block-116-group-0-inline-1", 3],
  ["edition-block-29-group-0-inline-0", 4],
  ["edition-block-110-group-0-inline-1", 4],
  ["edition-block-110-group-0-inline-5", 4],
  ["edition-block-30-group-0-inline-0", 5],
  ["edition-block-37-group-0-inline-0", 5],
  ["edition-block-31-group-0-inline-0", 6],
  ["edition-block-32-group-0-inline-0", 6],
  ["edition-block-33-group-0-inline-0", 7],
  ["edition-block-34-group-0-inline-0", 7],
  ["edition-block-35-group-0-inline-0", 7],
  ["edition-block-81-group-0-inline-4", 7],
  ["edition-block-111-group-0-inline-1", 7],
  ["edition-block-36-group-0-inline-0", 8],
  ["edition-block-44-group-0-inline-0", 8],
  ["edition-block-112-group-0-inline-1", 8],
  ["edition-block-38-group-0-inline-0", 9],
  ["edition-block-39-group-0-inline-0", 9],
  ["edition-block-40-group-0-inline-0", 9],
  ["edition-block-41-group-0-inline-0", 9],
  ["edition-block-113-group-0-inline-1", 9],
  ["edition-block-42-group-0-inline-0", 10],
  ["edition-block-43-group-0-inline-0", 10],
] as const satisfies readonly (readonly [
  FigureOccurrenceKey,
  keyof typeof LEMELSON_MACHINE_VISION_SOURCE_SHEET_ASSETS,
])[];

function lemelsonMachineVisionSourceSheetLocator(
  occurrenceKey: FigureOccurrenceKey,
  sourcePdfPage: keyof typeof LEMELSON_MACHINE_VISION_SOURCE_SHEET_ASSETS,
): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: LEMELSON_MACHINE_VISION_SOURCE_SHEET_RASTER.width,
    height: LEMELSON_MACHINE_VISION_SOURCE_SHEET_RASTER.height,
  };
  return {
    occurrenceKey,
    activeAsset: LEMELSON_MACHINE_VISION_SOURCE_SHEET_ASSETS[sourcePdfPage],
    sourcePdfPage,
    sourceRaster: LEMELSON_MACHINE_VISION_SOURCE_SHEET_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(
      sourceRectPixels,
      LEMELSON_MACHINE_VISION_SOURCE_SHEET_RASTER,
    ),
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 72-DPI source-pixel review",
    reviewedAt: "2026-09-04",
    evidenceReference: LEMELSON_MACHINE_VISION_SOURCE_SHEET_EVIDENCE_REFERENCE,
  };
}

const MORSE_TELEGRAPH_SOURCE_SHEET_RASTER = { width: 2320, height: 3408 } as const;
const MORSE_TELEGRAPH_SOURCE_SHEET_EVIDENCE_REFERENCE =
  "docs/provenance/us-1647-morse-telegraph.md#complete-source-sheet-acceptance-2026-09-04";
const MORSE_TELEGRAPH_SOURCE_SHEET_ASSETS = {
  1: "/patents/figures/us-1647-morse-telegraph/source-sheet-1-v1.png",
  2: "/patents/figures/us-1647-morse-telegraph/source-sheet-2-v1.png",
  3: "/patents/figures/us-1647-morse-telegraph/source-sheet-3-v1.png",
} as const;
const MORSE_TELEGRAPH_SOURCE_SHEET_OCCURRENCES = [
  ["edition-block-8-group-0-inline-1", 1],
  ["edition-block-9-group-0-inline-1", 1],
  ["edition-block-10-group-0-inline-1", 1],
  ["edition-block-11-group-0-inline-1", 1],
  ["edition-block-13-group-0-inline-1", 1],
  ["edition-block-14-group-0-inline-1", 1],
  ["edition-block-15-group-0-inline-1", 1],
  ["edition-block-16-group-0-inline-1", 1],
  ["edition-block-17-group-0-inline-1", 1],
  ["edition-block-17-group-0-inline-3", 1],
  ["edition-block-17-group-0-inline-5", 1],
  ["edition-block-18-group-0-inline-1", 1],
  ["edition-block-18-group-0-inline-3", 1],
  ["edition-block-19-group-0-inline-1", 1],
  ["edition-block-19-group-0-inline-3", 1],
  ["edition-block-19-group-0-inline-5", 1],
  ["edition-block-23-group-0-inline-3", 1],
  ["edition-block-24-group-0-inline-3", 1],
  ["edition-block-24-group-0-inline-5", 1],
  ["edition-block-27-group-0-inline-11", 1],
  ["edition-block-20-group-0-inline-1", 2],
  ["edition-block-21-group-0-inline-1", 2],
  ["edition-block-22-group-0-inline-1", 2],
  ["edition-block-22-group-0-inline-3", 2],
  ["edition-block-23-group-0-inline-1", 2],
  ["edition-block-23-group-0-inline-5", 2],
  ["edition-block-23-group-0-inline-7", 2],
  ["edition-block-23-group-0-inline-9", 2],
  ["edition-block-23-group-0-inline-11", 2],
  ["edition-block-23-group-0-inline-13", 2],
  ["edition-block-23-group-0-inline-15", 2],
  ["edition-block-24-group-0-inline-1", 2],
  ["edition-block-24-group-0-inline-7", 2],
  ["edition-block-24-group-0-inline-9", 2],
  ["edition-block-25-group-0-inline-1", 2],
  ["edition-block-25-group-0-inline-3", 2],
  ["edition-block-26-group-0-inline-1", 2],
  ["edition-block-27-group-0-inline-1", 2],
  ["edition-block-27-group-0-inline-3", 2],
  ["edition-block-27-group-0-inline-5", 2],
  ["edition-block-27-group-0-inline-7", 2],
  ["edition-block-27-group-0-inline-9", 2],
  ["edition-block-32-group-0-inline-1", 2],
  ["edition-block-28-group-0-inline-1", 3],
  ["edition-block-28-group-0-inline-3", 3],
  ["edition-block-29-group-0-inline-1", 3],
  ["edition-block-29-group-0-inline-3", 3],
  ["edition-block-30-group-0-inline-1", 3],
  ["edition-block-30-group-0-inline-3", 3],
  ["edition-block-30-group-0-inline-5", 3],
  ["edition-block-31-group-0-inline-3", 3],
  ["edition-block-31-group-0-inline-5", 3],
  ["edition-block-31-group-0-inline-7", 3],
  ["edition-block-31-group-0-inline-9", 3],
  ["edition-block-31-group-0-inline-11", 3],
] as const satisfies readonly (readonly [
  FigureOccurrenceKey,
  keyof typeof MORSE_TELEGRAPH_SOURCE_SHEET_ASSETS,
])[];

function morseTelegraphSourceSheetLocator(
  occurrenceKey: FigureOccurrenceKey,
  sourcePdfPage: keyof typeof MORSE_TELEGRAPH_SOURCE_SHEET_ASSETS,
): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: MORSE_TELEGRAPH_SOURCE_SHEET_RASTER.width,
    height: MORSE_TELEGRAPH_SOURCE_SHEET_RASTER.height,
  };
  return {
    occurrenceKey,
    activeAsset: MORSE_TELEGRAPH_SOURCE_SHEET_ASSETS[sourcePdfPage],
    sourcePdfPage,
    sourceRaster: MORSE_TELEGRAPH_SOURCE_SHEET_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(
      sourceRectPixels,
      MORSE_TELEGRAPH_SOURCE_SHEET_RASTER,
    ),
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-04",
    evidenceReference: MORSE_TELEGRAPH_SOURCE_SHEET_EVIDENCE_REFERENCE,
  };
}

const LEMELSON_ADJUSTABLE_MANIPULATOR_SOURCE_SHEET_RASTER = {
  width: 2320,
  height: 3408,
} as const;
const LEMELSON_ADJUSTABLE_MANIPULATOR_SOURCE_SHEET_EVIDENCE_REFERENCE =
  "docs/provenance/us-3260375-lemelson-adjustable-manipulator.md#source-sheet-acceptance-2026-09-04";
const LEMELSON_ADJUSTABLE_MANIPULATOR_SOURCE_SHEET_ASSETS = {
  1: "/patents/figures/us-3260375-lemelson-adjustable-manipulator/source-sheet-1-v1.png",
  2: "/patents/figures/us-3260375-lemelson-adjustable-manipulator/source-sheet-2-v1.png",
  3: "/patents/figures/us-3260375-lemelson-adjustable-manipulator/source-sheet-3-v1.png",
} as const;
const LEMELSON_ADJUSTABLE_MANIPULATOR_SOURCE_SHEET_OCCURRENCES = [
  ["edition-block-4-group-0-inline-0", 1],
  ["edition-block-7-group-0-inline-0", 1],
  ["edition-block-7-group-0-inline-2", 1],
  ["edition-block-7-group-0-inline-4", 1],
  ["edition-block-7-group-0-inline-6", 1],
  ["edition-block-7-group-0-inline-8", 1],
  ["edition-block-7-group-0-inline-12", 1],
  ["edition-block-7-group-0-inline-20", 1],
  ["edition-block-7-group-0-inline-28", 1],
  ["edition-block-8-group-0-inline-0", 1],
  ["edition-block-8-group-0-inline-2", 1],
  ["edition-block-8-group-0-inline-4", 1],
  ["edition-block-8-group-0-inline-6", 1],
  ["edition-block-8-group-0-inline-8", 1],
  ["edition-block-9-group-0-inline-0", 1],
  ["edition-block-12-group-0-inline-1", 1],
  ["edition-block-12-group-0-inline-3", 1],
  ["edition-block-12-group-0-inline-5", 1],
  ["edition-block-14-group-0-inline-1", 1],
  ["edition-block-14-group-0-inline-3", 1],
  ["edition-block-14-group-0-inline-5", 1],
  ["edition-block-15-group-0-inline-1", 1],
  ["edition-block-15-group-0-inline-3", 1],
  ["edition-block-16-group-0-inline-1", 1],
  ["edition-block-16-group-0-inline-3", 1],
  ["edition-block-16-group-0-inline-6", 1],
  ["edition-block-16-group-0-inline-8", 1],
  ["edition-block-21-group-0-inline-4", 1],
  ["edition-block-22-group-0-inline-6", 1],
  ["edition-block-28-group-0-inline-1", 1],
  ["edition-block-29-group-0-inline-1", 1],
  ["edition-block-5-group-0-inline-0", 2],
  ["edition-block-7-group-0-inline-10", 2],
  ["edition-block-7-group-0-inline-14", 2],
  ["edition-block-7-group-0-inline-16", 2],
  ["edition-block-7-group-0-inline-18", 2],
  ["edition-block-7-group-0-inline-22", 2],
  ["edition-block-7-group-0-inline-24", 2],
  ["edition-block-13-group-0-inline-1", 2],
  ["edition-block-13-group-0-inline-3", 2],
  ["edition-block-17-group-0-inline-1", 2],
  ["edition-block-18-group-0-inline-0", 2],
  ["edition-block-19-group-0-inline-1", 2],
  ["edition-block-20-group-0-inline-1", 2],
  ["edition-block-21-group-0-inline-0", 2],
  ["edition-block-21-group-0-inline-2", 2],
  ["edition-block-21-group-0-inline-6", 2],
  ["edition-block-21-group-0-inline-8", 2],
  ["edition-block-28-group-0-inline-3", 2],
  ["edition-block-6-group-0-inline-0", 3],
  ["edition-block-7-group-0-inline-26", 3],
  ["edition-block-22-group-0-inline-0", 3],
  ["edition-block-22-group-0-inline-2", 3],
  ["edition-block-22-group-0-inline-4", 3],
  ["edition-block-22-group-0-inline-8", 3],
  ["edition-block-27-group-0-inline-1", 3],
  ["edition-block-29-group-0-inline-3", 3],
] as const satisfies readonly (readonly [
  FigureOccurrenceKey,
  keyof typeof LEMELSON_ADJUSTABLE_MANIPULATOR_SOURCE_SHEET_ASSETS,
])[];

function lemelsonAdjustableManipulatorSourceSheetLocator(
  occurrenceKey: FigureOccurrenceKey,
  sourcePdfPage: keyof typeof LEMELSON_ADJUSTABLE_MANIPULATOR_SOURCE_SHEET_ASSETS,
): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: LEMELSON_ADJUSTABLE_MANIPULATOR_SOURCE_SHEET_RASTER.width,
    height: LEMELSON_ADJUSTABLE_MANIPULATOR_SOURCE_SHEET_RASTER.height,
  };
  return {
    occurrenceKey,
    activeAsset: LEMELSON_ADJUSTABLE_MANIPULATOR_SOURCE_SHEET_ASSETS[sourcePdfPage],
    sourcePdfPage,
    sourceRaster: LEMELSON_ADJUSTABLE_MANIPULATOR_SOURCE_SHEET_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(
      sourceRectPixels,
      LEMELSON_ADJUSTABLE_MANIPULATOR_SOURCE_SHEET_RASTER,
    ),
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct native-raster source-sheet review",
    reviewedAt: "2026-09-04",
    evidenceReference: LEMELSON_ADJUSTABLE_MANIPULATOR_SOURCE_SHEET_EVIDENCE_REFERENCE,
  };
}

const NOYCE_IC_SOURCE_SHEET_RASTER = { width: 2320, height: 3408 } as const;
const NOYCE_IC_SOURCE_SHEET_EVIDENCE_REFERENCE =
  "docs/provenance/us-2981877-noyce-ic.md#complete-source-sheet-acceptance-2026-09-04";
const NOYCE_IC_SOURCE_SHEET_ASSETS = {
  1: "/patents/figures/us-2981877-noyce-ic/source-sheet-1-v1.png",
  2: "/patents/figures/us-2981877-noyce-ic/source-sheet-2-v1.png",
  3: "/patents/figures/us-2981877-noyce-ic/source-sheet-3-v1.png",
} as const;
const NOYCE_IC_SOURCE_SHEET_OCCURRENCES = [
  ["edition-block-1-group-0-inline-1", 1],
  ["edition-block-1-group-0-inline-3", 1],
  ["edition-block-1-group-0-inline-5", 2],
  ["edition-block-1-group-0-inline-7", 2],
  ["edition-block-1-group-0-inline-9", 2],
  ["edition-block-1-group-0-inline-11", 3],
  ["edition-block-1-group-0-inline-13", 3],
  ["edition-block-1-group-0-inline-15", 2],
  ["edition-block-4-group-0-inline-1", 1],
  ["edition-block-4-group-0-inline-3", 1],
  ["edition-block-4-group-0-inline-5", 1],
  ["edition-block-4-group-0-inline-7", 2],
  ["edition-block-4-group-0-inline-9", 2],
  ["edition-block-4-group-0-inline-11", 2],
  ["edition-block-4-group-0-inline-13", 2],
  ["edition-block-4-group-0-inline-15", 2],
  ["edition-block-4-group-0-inline-17", 2],
  ["edition-block-4-group-0-inline-19", 3],
  ["edition-block-4-group-0-inline-21", 3],
  ["edition-block-4-group-0-inline-23", 3],
  ["edition-block-5-group-0-inline-0", 1],
  ["edition-block-5-group-0-inline-2", 1],
  ["edition-block-9-group-0-inline-1", 1],
  ["edition-block-9-group-0-inline-3", 1],
  ["edition-block-10-group-0-inline-1", 1],
  ["edition-block-10-group-0-inline-3", 1],
  ["edition-block-16-group-0-inline-1", 1],
  ["edition-block-16-group-0-inline-3", 1],
  ["edition-block-18-group-0-inline-1", 2],
  ["edition-block-18-group-0-inline-3", 2],
  ["edition-block-19-group-0-inline-1", 2],
  ["edition-block-19-group-0-inline-3", 2],
  ["edition-block-24-group-0-inline-1", 2],
  ["edition-block-24-group-0-inline-3", 2],
  ["edition-block-24-group-0-inline-5", 2],
  ["edition-block-24-group-0-inline-7", 2],
  ["edition-block-24-group-0-inline-9", 2],
  ["edition-block-24-group-0-inline-11", 2],
  ["edition-block-24-group-0-inline-13", 2],
  ["edition-block-25-group-0-inline-1", 2],
  ["edition-block-25-group-0-inline-3", 2],
  ["edition-block-25-group-0-inline-5", 2],
  ["edition-block-25-group-0-inline-7", 2],
  ["edition-block-25-group-0-inline-9", 2],
  ["edition-block-25-group-0-inline-11", 2],
  ["edition-block-26-group-0-inline-3", 2],
  ["edition-block-26-group-0-inline-5", 2],
  ["edition-block-26-group-0-inline-7", 2],
  ["edition-block-26-group-0-inline-9", 2],
  ["edition-block-27-group-0-inline-1", 2],
  ["edition-block-27-group-0-inline-3", 2],
  ["edition-block-27-group-0-inline-5", 2],
  ["edition-block-27-group-0-inline-7", 2],
  ["edition-block-28-group-0-inline-0", 3],
  ["edition-block-28-group-0-inline-2", 3],
] as const satisfies readonly (readonly [
  FigureOccurrenceKey,
  keyof typeof NOYCE_IC_SOURCE_SHEET_ASSETS,
])[];

function noyceIcSourceSheetLocator(
  occurrenceKey: FigureOccurrenceKey,
  sourcePdfPage: keyof typeof NOYCE_IC_SOURCE_SHEET_ASSETS,
): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: NOYCE_IC_SOURCE_SHEET_RASTER.width,
    height: NOYCE_IC_SOURCE_SHEET_RASTER.height,
  };
  return {
    occurrenceKey,
    activeAsset: NOYCE_IC_SOURCE_SHEET_ASSETS[sourcePdfPage],
    sourcePdfPage,
    sourceRaster: NOYCE_IC_SOURCE_SHEET_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(sourceRectPixels, NOYCE_IC_SOURCE_SHEET_RASTER),
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-04",
    evidenceReference: NOYCE_IC_SOURCE_SHEET_EVIDENCE_REFERENCE,
  };
}

const ROBOT_END_EFFECTOR_SOURCE_SHEET_RASTER = { width: 2320, height: 3408 } as const;
const ROBOT_END_EFFECTOR_SOURCE_SHEET_EVIDENCE_REFERENCE =
  "docs/provenance/us-4765668-robot-end-effector.md#source-sheet-acceptance-2026-09-04";
const ROBOT_END_EFFECTOR_SOURCE_SHEET_ASSETS = {
  2: "/patents/figures/us-4765668-robot-end-effector/source-sheet-2-v1.png",
  3: "/patents/figures/us-4765668-robot-end-effector/source-sheet-3-v1.png",
  4: "/patents/figures/us-4765668-robot-end-effector/source-sheet-4-v1.png",
  5: "/patents/figures/us-4765668-robot-end-effector/source-sheet-5-v1.png",
} as const;
const ROBOT_END_EFFECTOR_SOURCE_SHEET_OCCURRENCES = [
  ["edition-block-17-group-0-inline-0", 2],
  ["edition-block-17-group-0-inline-4", 2],
  ["edition-block-17-group-0-inline-8", 2],
  ["edition-block-17-group-0-inline-14", 2],
  ["edition-block-19-group-0-inline-3", 2],
  ["edition-block-19-group-0-inline-5", 2],
  ["edition-block-20-group-0-inline-1", 2],
  ["edition-block-23-group-0-inline-3", 2],
  ["edition-block-24-group-0-inline-1", 2],
  ["edition-block-26-group-0-inline-5", 2],
  ["edition-block-27-group-0-inline-1", 2],
  ["edition-block-17-group-0-inline-2", 3],
  ["edition-block-26-group-0-inline-1", 3],
  ["edition-block-30-group-0-inline-1", 3],
  ["edition-block-31-group-0-inline-1", 3],
  ["edition-block-17-group-0-inline-6", 4],
  ["edition-block-17-group-0-inline-16", 4],
  ["edition-block-20-group-0-inline-3", 4],
  ["edition-block-22-group-0-inline-1", 4],
  ["edition-block-23-group-0-inline-1", 4],
  ["edition-block-24-group-0-inline-3", 4],
  ["edition-block-24-group-0-inline-5", 4],
  ["edition-block-30-group-0-inline-3", 4],
  ["edition-block-17-group-0-inline-10", 5],
  ["edition-block-17-group-0-inline-12", 5],
  ["edition-block-19-group-0-inline-1", 5],
  ["edition-block-22-group-0-inline-3", 5],
  ["edition-block-27-group-0-inline-3", 5],
  ["edition-block-28-group-0-inline-1", 5],
] as const satisfies readonly (readonly [
  FigureOccurrenceKey,
  keyof typeof ROBOT_END_EFFECTOR_SOURCE_SHEET_ASSETS,
])[];
function robotEndEffectorSourceSheetLocator(
  occurrenceKey: FigureOccurrenceKey,
  sourcePdfPage: keyof typeof ROBOT_END_EFFECTOR_SOURCE_SHEET_ASSETS,
): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: ROBOT_END_EFFECTOR_SOURCE_SHEET_RASTER.width,
    height: ROBOT_END_EFFECTOR_SOURCE_SHEET_RASTER.height,
  };
  return {
    occurrenceKey,
    activeAsset: ROBOT_END_EFFECTOR_SOURCE_SHEET_ASSETS[sourcePdfPage],
    sourcePdfPage,
    sourceRaster: ROBOT_END_EFFECTOR_SOURCE_SHEET_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(
      sourceRectPixels,
      ROBOT_END_EFFECTOR_SOURCE_SHEET_RASTER,
    ),
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-04",
    evidenceReference: ROBOT_END_EFFECTOR_SOURCE_SHEET_EVIDENCE_REFERENCE,
  };
}

const SALISBURY_ROBOT_HAND_SOURCE_SHEET_RASTER = { width: 2320, height: 3408 } as const;
const SALISBURY_ROBOT_HAND_SOURCE_SHEET_EVIDENCE_REFERENCE =
  "docs/provenance/us-4921293-salisbury-robot-hand.md#direct-source-sheet-acceptance--2026-09-04";
const SALISBURY_ROBOT_HAND_SOURCE_SHEET_ASSETS = {
  3: "/patents/figures/us-4921293-salisbury-robot-hand/source-sheet-1-v1.png",
  4: "/patents/figures/us-4921293-salisbury-robot-hand/source-sheet-2-v1.png",
  5: "/patents/figures/us-4921293-salisbury-robot-hand/source-sheet-3-v1.png",
} as const;
const SALISBURY_ROBOT_HAND_SOURCE_SHEET_OCCURRENCES = [
  ["edition-block-1-group-0-inline-0", 3],
  ["edition-block-1-group-0-inline-2", 3],
  ["edition-block-18-group-0-inline-0", 3],
  ["edition-block-19-group-0-inline-0", 3],
  ["edition-block-25-group-0-inline-1", 3],
  ["edition-block-27-group-0-inline-1", 3],
  ["edition-block-27-group-0-inline-3", 3],
  ["edition-block-27-group-0-inline-5", 3],
  ["edition-block-27-group-0-inline-7", 3],
  ["edition-block-29-group-0-inline-1", 3],
  ["edition-block-29-group-0-inline-5", 3],
  ["edition-block-29-group-0-inline-7", 3],
  ["edition-block-30-group-0-inline-1", 3],
  ["edition-block-30-group-0-inline-3", 3],
  ["edition-block-33-group-0-inline-7", 3],
  ["edition-block-41-group-0-inline-2", 3],
  ["edition-block-43-group-0-inline-5", 3],
  ["edition-block-43-group-0-inline-7", 3],
  ["edition-block-43-group-0-inline-9", 3],
  ["edition-block-1-group-0-inline-4", 4],
  ["edition-block-1-group-0-inline-6", 4],
  ["edition-block-1-group-0-inline-8", 4],
  ["edition-block-20-group-0-inline-0", 4],
  ["edition-block-21-group-0-inline-0", 4],
  ["edition-block-22-group-0-inline-0", 4],
  ["edition-block-31-group-0-inline-1", 4],
  ["edition-block-31-group-0-inline-3", 4],
  ["edition-block-32-group-0-inline-1", 4],
  ["edition-block-32-group-0-inline-3", 4],
  ["edition-block-32-group-0-inline-5", 4],
  ["edition-block-32-group-0-inline-7", 4],
  ["edition-block-32-group-0-inline-9", 4],
  ["edition-block-33-group-0-inline-1", 4],
  ["edition-block-33-group-0-inline-3", 4],
  ["edition-block-34-group-0-inline-3", 4],
  ["edition-block-34-group-0-inline-5", 4],
  ["edition-block-35-group-0-inline-1", 4],
  ["edition-block-40-group-0-inline-0", 4],
  ["edition-block-41-group-0-inline-0", 4],
  ["edition-block-41-group-0-inline-6", 4],
  ["edition-block-42-group-0-inline-1", 4],
  ["edition-block-1-group-0-inline-10", 5],
  ["edition-block-1-group-0-inline-12", 5],
  ["edition-block-23-group-0-inline-0", 5],
  ["edition-block-33-group-0-inline-5", 5],
  ["edition-block-41-group-0-inline-4", 5],
  ["edition-block-43-group-0-inline-1", 5],
  ["edition-block-43-group-0-inline-3", 5],
  ["edition-block-43-group-0-inline-11", 5],
  ["edition-block-43-group-0-inline-13", 5],
  ["edition-block-43-group-0-inline-15", 5],
  ["edition-block-43-group-0-inline-17", 5],
  ["edition-block-44-group-0-inline-1", 5],
  ["edition-block-44-group-0-inline-3", 5],
  ["edition-block-44-group-0-inline-5", 5],
] as const satisfies readonly (readonly [
  FigureOccurrenceKey,
  keyof typeof SALISBURY_ROBOT_HAND_SOURCE_SHEET_ASSETS,
])[];
function salisburyRobotHandSourceSheetLocator(
  occurrenceKey: FigureOccurrenceKey,
  sourcePdfPage: keyof typeof SALISBURY_ROBOT_HAND_SOURCE_SHEET_ASSETS,
): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: SALISBURY_ROBOT_HAND_SOURCE_SHEET_RASTER.width,
    height: SALISBURY_ROBOT_HAND_SOURCE_SHEET_RASTER.height,
  };
  return {
    occurrenceKey,
    activeAsset: SALISBURY_ROBOT_HAND_SOURCE_SHEET_ASSETS[sourcePdfPage],
    sourcePdfPage,
    sourceRaster: SALISBURY_ROBOT_HAND_SOURCE_SHEET_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(
      sourceRectPixels,
      SALISBURY_ROBOT_HAND_SOURCE_SHEET_RASTER,
    ),
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-sheet review",
    reviewedAt: "2026-09-04",
    evidenceReference: SALISBURY_ROBOT_HAND_SOURCE_SHEET_EVIDENCE_REFERENCE,
  };
}

const SHOLES_TYPEWRITER_SOURCE_SHEET_RASTER = { width: 2320, height: 3408 } as const;
const SHOLES_TYPEWRITER_SOURCE_SHEET_EVIDENCE_REFERENCE =
  "docs/provenance/us-79265-sholes-typewriter.md#active-edition-reference-map";
const SHOLES_TYPEWRITER_SOURCE_SHEET_ASSETS = {
  1: "/patents/figures/us-79265-sholes-typewriter/source-sheet-1-v1.png",
  2: "/patents/figures/us-79265-sholes-typewriter/source-sheet-2-v1.png",
} as const;
const SHOLES_TYPEWRITER_SOURCE_SHEET_OCCURRENCES = [
  ["edition-block-1-group-0-inline-1", 1],
  ["edition-block-4-group-0-inline-0", 1],
  ["edition-block-4-group-0-inline-2", 1],
  ["edition-block-6-group-0-inline-5", 1],
  ["edition-block-7-group-0-inline-1", 1],
  ["edition-block-7-group-0-inline-3", 1],
  ["edition-block-7-group-0-inline-5", 1],
  ["edition-block-7-group-0-inline-15", 1],
  ["edition-block-8-group-0-inline-1", 1],
  ["edition-block-9-group-0-inline-1", 1],
  ["edition-block-9-group-0-inline-3", 1],
  ["edition-block-9-group-0-inline-5", 1],
  ["edition-block-9-group-0-inline-7", 1],
  ["edition-block-10-group-0-inline-1", 1],
  ["edition-block-11-group-0-inline-1", 1],
  ["edition-block-11-group-0-inline-3", 1],
  ["edition-block-12-group-0-inline-1", 1],
  ["edition-block-13-group-0-inline-7", 1],
  ["edition-block-13-group-0-inline-9", 1],
  ["edition-block-13-group-0-inline-11", 1],
  ["edition-block-13-group-0-inline-15", 1],
  ["edition-block-13-group-0-inline-17", 1],
  ["edition-block-14-group-0-inline-1", 1],
  ["edition-block-14-group-0-inline-3", 1],
  ["edition-block-15-group-0-inline-1", 1],
  ["edition-block-16-group-0-inline-1", 1],
  ["edition-block-16-group-0-inline-3", 1],
  ["edition-block-17-group-0-inline-1", 1],
  ["edition-block-17-group-0-inline-3", 1],
  ["edition-block-17-group-0-inline-5", 1],
  ["edition-block-17-group-0-inline-7", 1],
  ["edition-block-18-group-0-inline-1", 1],
  ["edition-block-1-group-0-inline-3", 2],
  ["edition-block-1-group-0-inline-5", 2],
  ["edition-block-4-group-0-inline-4", 2],
  ["edition-block-4-group-0-inline-6", 2],
  ["edition-block-6-group-0-inline-1", 2],
  ["edition-block-6-group-0-inline-3", 2],
  ["edition-block-7-group-0-inline-7", 2],
  ["edition-block-7-group-0-inline-9", 2],
  ["edition-block-7-group-0-inline-13", 2],
  ["edition-block-12-group-0-inline-3", 2],
  ["edition-block-13-group-0-inline-1", 2],
  ["edition-block-13-group-0-inline-3", 2],
  ["edition-block-17-group-0-inline-9", 2],
  ["edition-block-17-group-0-inline-11", 2],
  ["edition-block-17-group-0-inline-13", 2],
  ["edition-block-17-group-0-inline-15", 2],
  ["edition-block-17-group-0-inline-17", 2],
  ["edition-block-20-group-0-inline-0", 2],
] as const satisfies readonly (readonly [
  FigureOccurrenceKey,
  keyof typeof SHOLES_TYPEWRITER_SOURCE_SHEET_ASSETS,
])[];
function sholesTypewriterSourceSheetLocator(
  occurrenceKey: FigureOccurrenceKey,
  sourcePdfPage: keyof typeof SHOLES_TYPEWRITER_SOURCE_SHEET_ASSETS,
): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: SHOLES_TYPEWRITER_SOURCE_SHEET_RASTER.width,
    height: SHOLES_TYPEWRITER_SOURCE_SHEET_RASTER.height,
  };
  return {
    occurrenceKey,
    activeAsset: SHOLES_TYPEWRITER_SOURCE_SHEET_ASSETS[sourcePdfPage],
    sourcePdfPage,
    sourceRaster: SHOLES_TYPEWRITER_SOURCE_SHEET_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(
      sourceRectPixels,
      SHOLES_TYPEWRITER_SOURCE_SHEET_RASTER,
    ),
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-04",
    evidenceReference: SHOLES_TYPEWRITER_SOURCE_SHEET_EVIDENCE_REFERENCE,
  };
}

const CARRIER_AIR_CONDITIONER_SOURCE_SHEET_RASTER = { width: 2320, height: 3408 } as const;
const CARRIER_AIR_CONDITIONER_SOURCE_SHEET_EVIDENCE_REFERENCE =
  "docs/provenance/us-808897-carrier-air-conditioner.md#direct-source-sheet-acceptance-2026-09-04";
const CARRIER_AIR_CONDITIONER_SOURCE_SHEET_OCCURRENCES = [
  "edition-block-4-group-0-inline-1",
  "edition-block-4-group-0-inline-3",
  "edition-block-4-group-0-inline-5",
  "edition-block-4-group-0-inline-7",
  "edition-block-4-group-0-inline-9",
  "edition-block-4-group-0-inline-11",
  "edition-block-6-group-0-inline-1",
  "edition-block-6-group-0-inline-3",
] as const satisfies readonly FigureOccurrenceKey[];
function carrierAirConditionerSourceSheetLocator(
  occurrenceKey: FigureOccurrenceKey,
): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: CARRIER_AIR_CONDITIONER_SOURCE_SHEET_RASTER.width,
    height: CARRIER_AIR_CONDITIONER_SOURCE_SHEET_RASTER.height,
  };
  return {
    occurrenceKey,
    activeAsset: "/patents/figures/us-808897-carrier-air-conditioner/source-sheet-1-v1.png",
    sourcePdfPage: 1,
    sourceRaster: CARRIER_AIR_CONDITIONER_SOURCE_SHEET_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(
      sourceRectPixels,
      CARRIER_AIR_CONDITIONER_SOURCE_SHEET_RASTER,
    ),
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-04",
    evidenceReference: CARRIER_AIR_CONDITIONER_SOURCE_SHEET_EVIDENCE_REFERENCE,
  };
}

const HEWITT_MERCURY_LAMP_SOURCE_SHEET_RASTER = { width: 1160, height: 1704 } as const;
const HEWITT_MERCURY_LAMP_SOURCE_SHEET_EVIDENCE_REFERENCE =
  "docs/provenance/us-682690-hewitt-mercury-lamp.md#complete-source-sheet-acceptance-2026-09-04";
const HEWITT_MERCURY_LAMP_SOURCE_SHEET_ASSETS = {
  1: "/patents/figures/us-682690-hewitt-mercury-lamp/sheet-01.png",
  2: "/patents/figures/us-682690-hewitt-mercury-lamp/sheet-02.png",
} as const;
const HEWITT_MERCURY_LAMP_SOURCE_SHEET_OCCURRENCES = [
  ["edition-block-4-group-0-inline-3", 1],
  ["edition-block-6-group-0-inline-3", 1],
  ["edition-block-7-group-0-inline-1", 2],
] as const satisfies readonly (readonly [
  FigureOccurrenceKey,
  keyof typeof HEWITT_MERCURY_LAMP_SOURCE_SHEET_ASSETS,
])[];
function hewittMercuryLampSourceSheetLocator(
  occurrenceKey: FigureOccurrenceKey,
  sourcePdfPage: keyof typeof HEWITT_MERCURY_LAMP_SOURCE_SHEET_ASSETS,
): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: HEWITT_MERCURY_LAMP_SOURCE_SHEET_RASTER.width,
    height: HEWITT_MERCURY_LAMP_SOURCE_SHEET_RASTER.height,
  };
  return {
    occurrenceKey,
    activeAsset: HEWITT_MERCURY_LAMP_SOURCE_SHEET_ASSETS[sourcePdfPage],
    sourcePdfPage,
    sourceRaster: HEWITT_MERCURY_LAMP_SOURCE_SHEET_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(
      sourceRectPixels,
      HEWITT_MERCURY_LAMP_SOURCE_SHEET_RASTER,
    ),
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-04",
    evidenceReference: HEWITT_MERCURY_LAMP_SOURCE_SHEET_EVIDENCE_REFERENCE,
  };
}

const GODDARD_ROCKET_SOURCE_SHEET_RASTER = { width: 2320, height: 3408 } as const;
const GODDARD_ROCKET_SOURCE_SHEET_EVIDENCE_REFERENCE =
  "docs/provenance/us-1102653-goddard-rocket.md#2026-09-04-direct-source-sheet-figure-review";
const GODDARD_ROCKET_SOURCE_SHEET_OCCURRENCES = [
  "edition-block-1-group-0-inline-1",
  "edition-block-10-group-0-inline-1",
  "edition-block-10-group-0-inline-3",
  "edition-block-10-group-0-inline-5",
  "edition-block-10-group-0-inline-7",
  "edition-block-10-group-0-inline-9",
  "edition-block-11-group-0-inline-1",
  "edition-block-13-group-0-inline-1",
  "edition-block-15-group-0-inline-1",
  "edition-block-18-group-0-inline-1",
  "edition-block-20-group-0-inline-5",
] as const satisfies readonly FigureOccurrenceKey[];
function goddardRocketSourceSheetLocator(
  occurrenceKey: FigureOccurrenceKey,
): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: GODDARD_ROCKET_SOURCE_SHEET_RASTER.width,
    height: GODDARD_ROCKET_SOURCE_SHEET_RASTER.height,
  };
  return {
    occurrenceKey,
    activeAsset: "/patents/figures/us-1102653-goddard-rocket/sheet-1-1.png",
    sourcePdfPage: 1,
    sourceRaster: GODDARD_ROCKET_SOURCE_SHEET_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(
      sourceRectPixels,
      GODDARD_ROCKET_SOURCE_SHEET_RASTER,
    ),
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-sheet review",
    reviewedAt: "2026-09-04",
    evidenceReference: GODDARD_ROCKET_SOURCE_SHEET_EVIDENCE_REFERENCE,
  };
}

const TOWNES_LASER_SOURCE_SHEET_RASTER = { width: 2320, height: 3408 } as const;
const TOWNES_LASER_SOURCE_SHEET_EVIDENCE_REFERENCE =
  "docs/provenance/us-2929922-townes-laser.md#preservation-boundaries";
const TOWNES_LASER_SOURCE_SHEET_OCCURRENCES = [
  "edition-block-19-group-0-inline-1",
  "edition-block-19-group-0-inline-3",
  "edition-block-19-group-0-inline-5",
  "edition-block-19-group-0-inline-7",
  "edition-block-20-group-0-inline-1",
  "edition-block-21-group-0-inline-1",
  "edition-block-23-group-0-inline-1",
  "edition-block-26-group-0-inline-1",
  "edition-block-28-group-0-inline-1",
  "edition-block-29-group-0-inline-1",
  "edition-block-30-group-0-inline-1",
] as const satisfies readonly FigureOccurrenceKey[];
function townesLaserSourceSheetLocator(
  occurrenceKey: FigureOccurrenceKey,
): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: TOWNES_LASER_SOURCE_SHEET_RASTER.width,
    height: TOWNES_LASER_SOURCE_SHEET_RASTER.height,
  };
  return {
    occurrenceKey,
    activeAsset: "/patents/figures/us-2929922-townes-laser/sheet-1-1.png",
    sourcePdfPage: 1,
    sourceRaster: TOWNES_LASER_SOURCE_SHEET_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(
      sourceRectPixels,
      TOWNES_LASER_SOURCE_SHEET_RASTER,
    ),
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-04",
    evidenceReference: TOWNES_LASER_SOURCE_SHEET_EVIDENCE_REFERENCE,
  };
}

const WESTINGHOUSE_AIR_BRAKE_SOURCE_SHEET_RASTER = { width: 2320, height: 3408 } as const;
const WESTINGHOUSE_AIR_BRAKE_SOURCE_SHEET_EVIDENCE_REFERENCE =
  "docs/provenance/us-124404-westinghouse-air-brake.md#direct-source-sheet-acceptance-2026-09-04";
const WESTINGHOUSE_AIR_BRAKE_SOURCE_SHEET_OCCURRENCES = [
  "edition-block-1-group-0-inline-1",
  "edition-block-1-group-0-inline-3",
  "edition-block-1-group-0-inline-5",
  "edition-block-1-group-0-inline-7",
  "edition-block-1-group-0-inline-9",
  "edition-block-1-group-0-inline-11",
  "edition-block-5-group-0-inline-0",
  "edition-block-5-group-0-inline-2",
  "edition-block-5-group-0-inline-4",
  "edition-block-5-group-0-inline-6",
  "edition-block-5-group-0-inline-8",
  "edition-block-5-group-0-inline-10",
  "edition-block-5-group-0-inline-12",
  "edition-block-5-group-0-inline-14",
  "edition-block-14-group-0-inline-1",
  "edition-block-14-group-0-inline-3",
  "edition-block-15-group-0-inline-1",
  "edition-block-15-group-0-inline-3",
  "edition-block-15-group-0-inline-5",
  "edition-block-15-group-0-inline-7",
  "edition-block-17-group-0-inline-1",
  "edition-block-17-group-0-inline-3",
] as const satisfies readonly FigureOccurrenceKey[];
function westinghouseAirBrakeSourceSheetLocator(
  occurrenceKey: FigureOccurrenceKey,
): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: WESTINGHOUSE_AIR_BRAKE_SOURCE_SHEET_RASTER.width,
    height: WESTINGHOUSE_AIR_BRAKE_SOURCE_SHEET_RASTER.height,
  };
  return {
    occurrenceKey,
    activeAsset: "/patents/figures/us-124404-westinghouse-air-brake/source-sheet-1-v1.png",
    sourcePdfPage: 1,
    sourceRaster: WESTINGHOUSE_AIR_BRAKE_SOURCE_SHEET_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(
      sourceRectPixels,
      WESTINGHOUSE_AIR_BRAKE_SOURCE_SHEET_RASTER,
    ),
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-04",
    evidenceReference: WESTINGHOUSE_AIR_BRAKE_SOURCE_SHEET_EVIDENCE_REFERENCE,
  };
}

const BELL_TELEPHONE_SOURCE_SHEET_RASTER = { width: 2320, height: 3408 } as const;
const BELL_TELEPHONE_SOURCE_SHEET_EVIDENCE_REFERENCE =
  "docs/provenance/us-174465-bell-telephone.md#complete-source-sheet-acceptance-2026-09-04";
const BELL_TELEPHONE_SOURCE_SHEET_ASSETS = {
  1: "/patents/figures/us-174465-bell-telephone/source-sheet-1-v1.png",
  2: "/patents/figures/us-174465-bell-telephone/source-sheet-2-v1.png",
} as const;
const BELL_TELEPHONE_SOURCE_SHEET_OCCURRENCES = [
  ["edition-block-1-group-0-inline-1", 1],
  ["edition-block-1-group-0-inline-3", 1],
  ["edition-block-1-group-0-inline-5", 1],
  ["edition-block-1-group-0-inline-7", 1],
  ["edition-block-1-group-0-inline-9", 1],
  ["edition-block-13-group-0-inline-1", 1],
  ["edition-block-13-group-0-inline-3", 1],
  ["edition-block-13-group-0-inline-5", 1],
  ["edition-block-13-group-0-inline-7", 1],
  ["edition-block-13-group-0-inline-9", 1],
  ["edition-block-16-group-0-inline-1", 1],
  ["edition-block-17-group-0-inline-1", 1],
  ["edition-block-18-group-0-inline-1", 1],
  ["edition-block-21-group-0-inline-1", 1],
  ["edition-block-26-group-0-inline-1", 1],
  ["edition-block-27-group-0-inline-1", 1],
  ["edition-block-1-group-0-inline-11", 2],
  ["edition-block-1-group-0-inline-13", 2],
  ["edition-block-23-group-0-inline-1", 2],
  ["edition-block-23-group-0-inline-3", 2],
  ["edition-block-24-group-0-inline-1", 2],
  ["edition-block-26-group-0-inline-3", 2],
  ["edition-block-27-group-0-inline-3", 2],
  ["edition-block-28-group-0-inline-1", 2],
] as const satisfies readonly (readonly [
  FigureOccurrenceKey,
  keyof typeof BELL_TELEPHONE_SOURCE_SHEET_ASSETS,
])[];

function bellTelephoneSourceSheetLocator(
  occurrenceKey: FigureOccurrenceKey,
  sourcePdfPage: keyof typeof BELL_TELEPHONE_SOURCE_SHEET_ASSETS,
): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: BELL_TELEPHONE_SOURCE_SHEET_RASTER.width,
    height: BELL_TELEPHONE_SOURCE_SHEET_RASTER.height,
  };
  return {
    occurrenceKey,
    activeAsset: BELL_TELEPHONE_SOURCE_SHEET_ASSETS[sourcePdfPage],
    sourcePdfPage,
    sourceRaster: BELL_TELEPHONE_SOURCE_SHEET_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(
      sourceRectPixels,
      BELL_TELEPHONE_SOURCE_SHEET_RASTER,
    ),
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-04",
    evidenceReference: BELL_TELEPHONE_SOURCE_SHEET_EVIDENCE_REFERENCE,
  };
}

const DEVOL_PROGRAMMED_TRANSFER_SOURCE_SHEET_RASTER = { width: 2320, height: 3408 } as const;
const DEVOL_PROGRAMMED_TRANSFER_SOURCE_SHEET_EVIDENCE_REFERENCE =
  "docs/provenance/us-2988237-devol-programmed-transfer.md#complete-source-sheet-acceptance-2026-09-04";
const DEVOL_PROGRAMMED_TRANSFER_SOURCE_SHEET_ASSETS = {
  1: "/patents/figures/us-2988237-devol-programmed-transfer/source-sheet-1-v1.png",
  2: "/patents/figures/us-2988237-devol-programmed-transfer/source-sheet-2-v1.png",
  3: "/patents/figures/us-2988237-devol-programmed-transfer/source-sheet-3-v1.png",
} as const;
const DEVOL_PROGRAMMED_TRANSFER_SOURCE_SHEET_OCCURRENCES = [
  ["edition-block-12-group-0-inline-0", 1],
  ["edition-block-12-group-0-inline-2", 1],
  ["edition-block-12-group-0-inline-4", 1],
  ["edition-block-12-group-0-inline-6", 1],
  ["edition-block-12-group-0-inline-8", 1],
  ["edition-block-12-group-0-inline-12", 1],
  ["edition-block-12-group-0-inline-16", 1],
  ["edition-block-12-group-0-inline-22", 1],
  ["edition-block-13-group-0-inline-0", 1],
  ["edition-block-15-group-0-inline-1", 1],
  ["edition-block-12-group-0-inline-10", 2],
  ["edition-block-12-group-0-inline-14", 2],
  ["edition-block-12-group-0-inline-18", 2],
  ["edition-block-12-group-0-inline-20", 2],
  ["edition-block-12-group-0-inline-26", 2],
  ["edition-block-12-group-0-inline-30", 2],
  ["edition-block-17-group-0-inline-0", 2],
  ["edition-block-20-group-0-inline-1", 2],
  ["edition-block-12-group-0-inline-24", 3],
  ["edition-block-12-group-0-inline-28", 3],
] as const satisfies readonly (readonly [
  FigureOccurrenceKey,
  keyof typeof DEVOL_PROGRAMMED_TRANSFER_SOURCE_SHEET_ASSETS,
])[];

function devolProgrammedTransferSourceSheetLocator(
  occurrenceKey: FigureOccurrenceKey,
  sourcePdfPage: keyof typeof DEVOL_PROGRAMMED_TRANSFER_SOURCE_SHEET_ASSETS,
): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: DEVOL_PROGRAMMED_TRANSFER_SOURCE_SHEET_RASTER.width,
    height: DEVOL_PROGRAMMED_TRANSFER_SOURCE_SHEET_RASTER.height,
  };
  return {
    occurrenceKey,
    activeAsset: DEVOL_PROGRAMMED_TRANSFER_SOURCE_SHEET_ASSETS[sourcePdfPage],
    sourcePdfPage,
    sourceRaster: DEVOL_PROGRAMMED_TRANSFER_SOURCE_SHEET_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(
      sourceRectPixels,
      DEVOL_PROGRAMMED_TRANSFER_SOURCE_SHEET_RASTER,
    ),
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-04",
    evidenceReference: DEVOL_PROGRAMMED_TRANSFER_SOURCE_SHEET_EVIDENCE_REFERENCE,
  };
}

const RENO_ESCALATOR_SOURCE_SHEET_RASTER = { width: 2320, height: 3408 } as const;
const RENO_ESCALATOR_SOURCE_SHEET_EVIDENCE_REFERENCE =
  "docs/provenance/us-470918-reno-escalator.md#complete-source-sheet-acceptance-2026-09-04";
const RENO_ESCALATOR_SOURCE_SHEET_ASSETS = {
  1: "/patents/figures/us-470918-reno-escalator/source-sheet-1-v1.png",
  2: "/patents/figures/us-470918-reno-escalator/source-sheet-2-v1.png",
} as const;
const RENO_ESCALATOR_SOURCE_SHEET_OCCURRENCES = [
  ["edition-block-6-group-0-inline-1", 1],
  ["edition-block-6-group-0-inline-5", 1],
  ["edition-block-9-group-0-inline-3", 1],
  ["edition-block-12-group-0-inline-1", 1],
  ["edition-block-12-group-0-inline-3", 1],
  ["edition-block-13-group-0-inline-3", 1],
  ["edition-block-14-group-0-inline-1", 1],
  ["edition-block-6-group-0-inline-3", 2],
  ["edition-block-6-group-0-inline-7", 2],
  ["edition-block-6-group-0-inline-9", 2],
  ["edition-block-8-group-0-inline-1", 2],
  ["edition-block-8-group-0-inline-3", 2],
  ["edition-block-8-group-0-inline-5", 2],
  ["edition-block-9-group-0-inline-5", 2],
  ["edition-block-11-group-0-inline-1", 2],
  ["edition-block-12-group-0-inline-5", 2],
  ["edition-block-13-group-0-inline-1", 2],
] as const satisfies readonly (readonly [
  FigureOccurrenceKey,
  keyof typeof RENO_ESCALATOR_SOURCE_SHEET_ASSETS,
])[];

function renoEscalatorSourceSheetLocator(
  occurrenceKey: FigureOccurrenceKey,
  sourcePdfPage: keyof typeof RENO_ESCALATOR_SOURCE_SHEET_ASSETS,
): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: RENO_ESCALATOR_SOURCE_SHEET_RASTER.width,
    height: RENO_ESCALATOR_SOURCE_SHEET_RASTER.height,
  };
  return {
    occurrenceKey,
    activeAsset: RENO_ESCALATOR_SOURCE_SHEET_ASSETS[sourcePdfPage],
    sourcePdfPage,
    sourceRaster: RENO_ESCALATOR_SOURCE_SHEET_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(
      sourceRectPixels,
      RENO_ESCALATOR_SOURCE_SHEET_RASTER,
    ),
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-04",
    evidenceReference: RENO_ESCALATOR_SOURCE_SHEET_EVIDENCE_REFERENCE,
  };
}

const ERICSSON_PROPELLER_SOURCE_SHEET_RASTER = { width: 2320, height: 3408 } as const;
const ERICSSON_PROPELLER_SOURCE_SHEET_EVIDENCE_REFERENCE =
  "docs/provenance/us-588-ericsson-propeller.md#complete-source-sheet-acceptance-2026-09-04";
const ERICSSON_PROPELLER_SOURCE_SHEET_ASSETS = {
  1: "/patents/figures/us-588-ericsson-propeller/source-sheet-1-v1.png",
  2: "/patents/figures/us-588-ericsson-propeller/source-sheet-2-v1.png",
} as const;
const ERICSSON_PROPELLER_SOURCE_SHEET_OCCURRENCES = [
  ["edition-block-1-group-0-inline-1", 1],
  ["edition-block-1-group-0-inline-3", 1],
  ["edition-block-7-group-0-inline-0", 1],
  ["edition-block-7-group-0-inline-4", 1],
  ["edition-block-8-group-0-inline-1", 1],
  ["edition-block-8-group-0-inline-3", 1],
  ["edition-block-8-group-0-inline-5", 1],
  ["edition-block-8-group-0-inline-7", 1],
  ["edition-block-9-group-0-inline-1", 1],
  ["edition-block-2-group-0-inline-1", 2],
  ["edition-block-9-group-0-inline-3", 2],
  ["edition-block-9-group-0-inline-5", 2],
  ["edition-block-12-group-0-inline-0", 2],
  ["edition-block-15-group-0-inline-0", 2],
  ["edition-block-15-group-0-inline-2", 2],
  ["edition-block-15-group-0-inline-4", 2],
  ["edition-block-15-group-0-inline-6", 2],
  ["edition-block-18-group-0-inline-1", 2],
  ["edition-block-18-group-0-inline-3", 2],
  ["edition-block-19-group-0-inline-1", 2],
  ["edition-block-19-group-0-inline-3", 2],
] as const satisfies readonly (readonly [
  FigureOccurrenceKey,
  keyof typeof ERICSSON_PROPELLER_SOURCE_SHEET_ASSETS,
])[];

function ericssonPropellerSourceSheetLocator(
  occurrenceKey: FigureOccurrenceKey,
  sourcePdfPage: keyof typeof ERICSSON_PROPELLER_SOURCE_SHEET_ASSETS,
): FigureOccurrenceSourceLocator {
  const sourceRectPixels = { x: 0, y: 0, width: 2320, height: 3408 };
  return {
    occurrenceKey,
    activeAsset: ERICSSON_PROPELLER_SOURCE_SHEET_ASSETS[sourcePdfPage],
    sourcePdfPage,
    sourceRaster: ERICSSON_PROPELLER_SOURCE_SHEET_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(
      sourceRectPixels,
      ERICSSON_PROPELLER_SOURCE_SHEET_RASTER,
    ),
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-04",
    evidenceReference: ERICSSON_PROPELLER_SOURCE_SHEET_EVIDENCE_REFERENCE,
  };
}

const CRUMP_FDM_SOURCE_SHEET_RASTER = { width: 2320, height: 3408 } as const;
const CRUMP_FDM_SOURCE_SHEET_EVIDENCE_REFERENCE =
  "docs/provenance/us-5121329-crump-fdm.md#complete-source-sheet-acceptance-2026-09-04";
const CRUMP_FDM_SOURCE_SHEET_ASSETS = {
  1: "/patents/figures/us-5121329-crump-fdm/source-sheet-1-v1.png",
  2: "/patents/figures/us-5121329-crump-fdm/source-sheet-2-v1.png",
  3: "/patents/figures/us-5121329-crump-fdm/source-sheet-3-v1.png",
} as const;
const CRUMP_FDM_SOURCE_SHEET_OCCURRENCES = [
  ["edition-block-1-group-0-inline-1", 1],
  ["edition-block-1-group-0-inline-3", 2],
  ["edition-block-1-group-0-inline-5", 2],
  ["edition-block-1-group-0-inline-7", 3],
  ["edition-block-1-group-0-inline-9", 3],
  ["edition-block-1-group-0-inline-11", 2],
  ["edition-block-1-group-0-inline-13", 2],
  ["edition-block-1-group-0-inline-15", 2],
  ["edition-block-1-group-0-inline-17", 3],
  ["edition-block-1-group-0-inline-19", 3],
  ["edition-block-1-group-0-inline-21", 2],
  ["edition-block-1-group-0-inline-23", 3],
  ["edition-block-2-group-0-inline-5", 1],
  ["edition-block-3-group-0-inline-1", 1],
  ["edition-block-3-group-0-inline-3", 2],
  ["edition-block-4-group-0-inline-1", 2],
  ["edition-block-4-group-0-inline-3", 3],
  ["edition-block-5-group-0-inline-1", 3],
  ["edition-block-5-group-0-inline-3", 2],
  ["edition-block-6-group-0-inline-1", 2],
  ["edition-block-6-group-0-inline-3", 3],
  ["edition-block-6-group-0-inline-5", 2],
  ["edition-block-6-group-0-inline-7", 2],
] as const satisfies readonly (readonly [
  FigureOccurrenceKey,
  keyof typeof CRUMP_FDM_SOURCE_SHEET_ASSETS,
])[];

function crumpFdmSourceSheetLocator(
  occurrenceKey: FigureOccurrenceKey,
  sourcePdfPage: keyof typeof CRUMP_FDM_SOURCE_SHEET_ASSETS,
): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: CRUMP_FDM_SOURCE_SHEET_RASTER.width,
    height: CRUMP_FDM_SOURCE_SHEET_RASTER.height,
  };
  return {
    occurrenceKey,
    activeAsset: CRUMP_FDM_SOURCE_SHEET_ASSETS[sourcePdfPage],
    sourcePdfPage: sourcePdfPage + 1,
    sourceRaster: CRUMP_FDM_SOURCE_SHEET_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(sourceRectPixels, CRUMP_FDM_SOURCE_SHEET_RASTER),
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-sheet review",
    reviewedAt: "2026-09-04",
    evidenceReference: CRUMP_FDM_SOURCE_SHEET_EVIDENCE_REFERENCE,
  };
}

const HOLLERITH_TABULATING_SOURCE_SHEET_RASTER = { width: 2320, height: 3408 } as const;
const HOLLERITH_TABULATING_SOURCE_SHEET_EVIDENCE_REFERENCE =
  "docs/provenance/us-395781-hollerith-tabulating.md#complete-source-sheet-acceptance-2026-09-04";
const HOLLERITH_TABULATING_SOURCE_SHEET_ASSETS = {
  1: "/patents/figures/us-395781-hollerith-tabulating/source-sheet-1-v1.png",
  2: "/patents/figures/us-395781-hollerith-tabulating/source-sheet-2-v1.png",
  3: "/patents/figures/us-395781-hollerith-tabulating/source-sheet-3-v1.png",
  4: "/patents/figures/us-395781-hollerith-tabulating/source-sheet-4-v1.png",
  5: "/patents/figures/us-395781-hollerith-tabulating/source-sheet-5-v1.png",
  6: "/patents/figures/us-395781-hollerith-tabulating/source-sheet-6-v1.png",
} as const;
const HOLLERITH_TABULATING_SOURCE_SHEET_OCCURRENCES = [
  ["edition-block-4-group-0-inline-1", 1],
  ["edition-block-4-group-0-inline-3", 2],
  ["edition-block-4-group-0-inline-5", 3],
  ["edition-block-4-group-0-inline-7", 2],
  ["edition-block-4-group-0-inline-9", 3],
  ["edition-block-4-group-0-inline-11", 3],
  ["edition-block-4-group-0-inline-13", 5],
  ["edition-block-4-group-0-inline-15", 6],
  ["edition-block-4-group-0-inline-17", 6],
  ["edition-block-10-group-0-inline-1", 5],
  ["edition-block-15-group-0-inline-1", 1],
  ["edition-block-18-group-0-inline-1", 6],
  ["edition-block-27-group-0-inline-1", 1],
  ["edition-block-28-group-0-inline-1", 1],
  ["edition-block-31-group-0-inline-1", 3],
  ["edition-block-32-group-0-inline-1", 3],
  ["edition-block-33-group-0-inline-1", 3],
  ["edition-block-36-group-0-inline-1", 3],
  ["edition-block-37-group-0-inline-1", 4],
  ["edition-block-38-group-0-inline-1", 4],
  ["edition-block-39-group-0-inline-1", 5],
  ["edition-block-39-group-0-inline-3", 5],
  ["edition-block-40-group-0-inline-1", 5],
  ["edition-block-41-group-0-inline-1", 6],
  ["edition-block-42-group-0-inline-1", 5],
  ["edition-block-43-group-0-inline-1", 6],
  ["edition-block-44-group-0-inline-0", 6],
  ["edition-block-44-group-0-inline-2", 6],
  ["edition-block-45-group-0-inline-0", 6],
  ["edition-block-45-group-0-inline-2", 6],
  ["edition-block-46-group-0-inline-0", 6],
  ["edition-block-46-group-0-inline-2", 6],
] as const satisfies readonly (readonly [
  FigureOccurrenceKey,
  keyof typeof HOLLERITH_TABULATING_SOURCE_SHEET_ASSETS,
])[];

function hollerithTabulatingSourceSheetLocator(
  occurrenceKey: FigureOccurrenceKey,
  sourcePdfPage: keyof typeof HOLLERITH_TABULATING_SOURCE_SHEET_ASSETS,
): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: HOLLERITH_TABULATING_SOURCE_SHEET_RASTER.width,
    height: HOLLERITH_TABULATING_SOURCE_SHEET_RASTER.height,
  };
  return {
    occurrenceKey,
    activeAsset: HOLLERITH_TABULATING_SOURCE_SHEET_ASSETS[sourcePdfPage],
    sourcePdfPage,
    sourceRaster: HOLLERITH_TABULATING_SOURCE_SHEET_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(
      sourceRectPixels,
      HOLLERITH_TABULATING_SOURCE_SHEET_RASTER,
    ),
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-sheet review",
    reviewedAt: "2026-09-04",
    evidenceReference: HOLLERITH_TABULATING_SOURCE_SHEET_EVIDENCE_REFERENCE,
  };
}

const KILBY_INTEGRATED_CIRCUIT_SOURCE_SHEET_RASTER = { width: 2320, height: 3408 } as const;
const KILBY_INTEGRATED_CIRCUIT_SOURCE_SHEET_EVIDENCE_REFERENCE =
  "docs/provenance/us-3138743-kilby-integrated-circuit.md#complete-source-sheet-acceptance-2026-09-04";
const KILBY_INTEGRATED_CIRCUIT_SOURCE_SHEET_ASSETS = {
  1: "/patents/figures/us-3138743-kilby-integrated-circuit/source-sheet-1-v1.png",
  2: "/patents/figures/us-3138743-kilby-integrated-circuit/source-sheet-2-v1.png",
  3: "/patents/figures/us-3138743-kilby-integrated-circuit/source-sheet-3-v1.png",
  4: "/patents/figures/us-3138743-kilby-integrated-circuit/source-sheet-4-v1.png",
} as const;
const KILBY_INTEGRATED_CIRCUIT_SOURCE_SHEET_OCCURRENCES = [
  ["edition-block-1-group-0-inline-1", 1],
  ["edition-block-1-group-0-inline-3", 1],
  ["edition-block-1-group-0-inline-5", 1],
  ["edition-block-1-group-0-inline-7", 1],
  ["edition-block-1-group-0-inline-9", 1],
  ["edition-block-1-group-0-inline-11", 1],
  ["edition-block-1-group-0-inline-13", 1],
  ["edition-block-1-group-0-inline-15", 1],
  ["edition-block-2-group-0-inline-1", 2],
  ["edition-block-2-group-0-inline-3", 2],
  ["edition-block-3-group-0-inline-1", 3],
  ["edition-block-4-group-0-inline-1", 4],
  ["edition-block-4-group-0-inline-3", 4],
  ["edition-block-4-group-0-inline-5", 4],
  ["edition-block-21-group-0-inline-1", 1],
  ["edition-block-21-group-0-inline-3", 2],
  ["edition-block-21-group-0-inline-5", 2],
  ["edition-block-21-group-0-inline-7", 3],
  ["edition-block-21-group-0-inline-9", 4],
  ["edition-block-21-group-0-inline-11", 4],
  ["edition-block-21-group-0-inline-13", 4],
  ["edition-block-26-group-0-inline-0", 1],
  ["edition-block-27-group-0-inline-1", 1],
  ["edition-block-27-group-0-inline-3", 1],
  ["edition-block-28-group-0-inline-1", 1],
  ["edition-block-28-group-0-inline-3", 1],
  ["edition-block-28-group-0-inline-5", 1],
  ["edition-block-28-group-0-inline-7", 1],
  ["edition-block-28-group-0-inline-9", 1],
  ["edition-block-28-group-0-inline-11", 1],
  ["edition-block-28-group-0-inline-13", 1],
  ["edition-block-29-group-0-inline-3", 1],
  ["edition-block-30-group-0-inline-1", 1],
  ["edition-block-30-group-0-inline-3", 1],
  ["edition-block-30-group-0-inline-5", 1],
  ["edition-block-30-group-0-inline-7", 1],
  ["edition-block-31-group-0-inline-1", 1],
  ["edition-block-32-group-0-inline-1", 1],
  ["edition-block-33-group-0-inline-1", 1],
  ["edition-block-34-group-0-inline-1", 1],
  ["edition-block-34-group-0-inline-3", 1],
  ["edition-block-37-group-0-inline-1", 2],
  ["edition-block-37-group-0-inline-3", 2],
  ["edition-block-37-group-0-inline-5", 2],
  ["edition-block-37-group-0-inline-7", 3],
  ["edition-block-37-group-0-inline-9", 2],
  ["edition-block-44-group-0-inline-1", 4],
] as const satisfies readonly (readonly [
  FigureOccurrenceKey,
  keyof typeof KILBY_INTEGRATED_CIRCUIT_SOURCE_SHEET_ASSETS,
])[];

function kilbyIntegratedCircuitSourceSheetLocator(
  occurrenceKey: FigureOccurrenceKey,
  sourcePdfPage: keyof typeof KILBY_INTEGRATED_CIRCUIT_SOURCE_SHEET_ASSETS,
): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: KILBY_INTEGRATED_CIRCUIT_SOURCE_SHEET_RASTER.width,
    height: KILBY_INTEGRATED_CIRCUIT_SOURCE_SHEET_RASTER.height,
  };
  return {
    occurrenceKey,
    activeAsset: KILBY_INTEGRATED_CIRCUIT_SOURCE_SHEET_ASSETS[sourcePdfPage],
    sourcePdfPage,
    sourceRaster: KILBY_INTEGRATED_CIRCUIT_SOURCE_SHEET_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(
      sourceRectPixels,
      KILBY_INTEGRATED_CIRCUIT_SOURCE_SHEET_RASTER,
    ),
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-sheet review",
    reviewedAt: "2026-09-04",
    evidenceReference: KILBY_INTEGRATED_CIRCUIT_SOURCE_SHEET_EVIDENCE_REFERENCE,
  };
}

const WHITNEY_COTTON_GIN_SOURCE_SHEET_RASTER = { width: 2320, height: 3408 } as const;
const WHITNEY_COTTON_GIN_SOURCE_SHEET_EVIDENCE_REFERENCE =
  "docs/provenance/us-x72-whitney-cotton-gin.md#source-sheet-review-2026-09-03";
const WHITNEY_COTTON_GIN_SOURCE_SHEET_ASSETS = {
  1: "/patents/figures/us-x72-whitney-cotton-gin/source-sheet-1-v1.png",
  2: "/patents/figures/us-x72-whitney-cotton-gin/source-sheet-2-v1.png",
  3: "/patents/figures/us-x72-whitney-cotton-gin/source-sheet-3-v1.png",
} as const;
const WHITNEY_COTTON_GIN_SOURCE_SHEET_OCCURRENCES = [
  ["edition-block-1-group-0-inline-1", 1],
  ["edition-block-7-group-0-inline-1", 1],
  ["edition-block-9-group-0-inline-1", 1],
  ["edition-block-10-group-0-inline-1", 2],
  ["edition-block-10-group-0-inline-3", 3],
  ["edition-block-11-group-0-inline-1", 2],
  ["edition-block-11-group-0-inline-3", 1],
  ["edition-block-12-group-0-inline-1", 3],
  ["edition-block-14-group-0-inline-1", 3],
  ["edition-block-14-group-0-inline-3", 3],
  ["edition-block-17-group-0-inline-1", 3],
  ["edition-block-17-group-0-inline-3", 1],
  ["edition-block-17-group-0-inline-5", 2],
  ["edition-block-17-group-0-inline-7", 1],
  ["edition-block-18-group-0-inline-1", 1],
  ["edition-block-19-group-0-inline-1", 3],
  ["edition-block-20-group-0-inline-1", 3],
  ["edition-block-22-group-0-inline-1", 1],
  ["edition-block-23-group-0-inline-1", 3],
  ["edition-block-25-group-0-inline-1", 3],
  ["edition-block-26-group-0-inline-1", 1],
  ["edition-block-26-group-0-inline-3", 1],
  ["edition-block-27-group-0-inline-1", 3],
  ["edition-block-30-group-0-inline-1", 1],
  ["edition-block-31-group-0-inline-1", 1],
] as const satisfies readonly (readonly [
  FigureOccurrenceKey,
  keyof typeof WHITNEY_COTTON_GIN_SOURCE_SHEET_ASSETS,
])[];

function whitneyCottonGinSourceSheetLocator(
  occurrenceKey: FigureOccurrenceKey,
  sourcePdfPage: keyof typeof WHITNEY_COTTON_GIN_SOURCE_SHEET_ASSETS,
): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: WHITNEY_COTTON_GIN_SOURCE_SHEET_RASTER.width,
    height: WHITNEY_COTTON_GIN_SOURCE_SHEET_RASTER.height,
  };
  return {
    occurrenceKey,
    activeAsset: WHITNEY_COTTON_GIN_SOURCE_SHEET_ASSETS[sourcePdfPage],
    sourcePdfPage,
    sourceRaster: WHITNEY_COTTON_GIN_SOURCE_SHEET_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(
      sourceRectPixels,
      WHITNEY_COTTON_GIN_SOURCE_SHEET_RASTER,
    ),
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-sheet review",
    reviewedAt: "2026-09-04",
    evidenceReference: WHITNEY_COTTON_GIN_SOURCE_SHEET_EVIDENCE_REFERENCE,
  };
}

const DE_FOREST_AUDION_SOURCE_RASTER = { width: 2320, height: 3408 } as const;
const DE_FOREST_AUDION_EVIDENCE_REFERENCE =
  "docs/provenance/us-879532-de-forest-audion.md#source-sheet-acceptance-2026-09-03";

/**
 * The two printed Audion diagrams share one source sheet. The active preview
 * preserves the whole, unmodified sheet so both figures and its patent
 * furniture stay visible instead of relying on a crop boundary that leaves
 * another figure's printed label in the result.
 */
function deForestAudionSourceSheetLocator(args: {
  occurrenceKey: FigureOccurrenceKey;
}): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: DE_FOREST_AUDION_SOURCE_RASTER.width,
    height: DE_FOREST_AUDION_SOURCE_RASTER.height,
  };
  return {
    ...args,
    activeAsset: "/patents/figures/us-879532-de-forest-audion/source-sheet-1-v1.png",
    sourcePdfPage: 1,
    sourceRaster: DE_FOREST_AUDION_SOURCE_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(
      sourceRectPixels,
      DE_FOREST_AUDION_SOURCE_RASTER,
    ),
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-03",
    evidenceReference: DE_FOREST_AUDION_EVIDENCE_REFERENCE,
  };
}

const GLIDDEN_BARBED_WIRE_SOURCE_RASTER = { width: 2320, height: 3408 } as const;
const GLIDDEN_BARBED_WIRE_EVIDENCE_REFERENCE =
  "docs/provenance/us-157124-glidden-barbed-wire.md#source-sheet-acceptance-2026-09-03";

/**
 * All three printed Glidden figures occupy the first drawing sheet. The active
 * preview retains the complete upright sheet and its genuine execution
 * furniture rather than presenting a rotated or partially isolated crop as
 * archival evidence.
 */
function gliddenBarbedWireSourceSheetLocator(args: {
  occurrenceKey: FigureOccurrenceKey;
}): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: GLIDDEN_BARBED_WIRE_SOURCE_RASTER.width,
    height: GLIDDEN_BARBED_WIRE_SOURCE_RASTER.height,
  };
  return {
    ...args,
    activeAsset: "/patents/figures/us-157124-glidden-barbed-wire/source-sheet-1-v1.png",
    sourcePdfPage: 1,
    sourceRaster: GLIDDEN_BARBED_WIRE_SOURCE_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(
      sourceRectPixels,
      GLIDDEN_BARBED_WIRE_SOURCE_RASTER,
    ),
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-03",
    evidenceReference: GLIDDEN_BARBED_WIRE_EVIDENCE_REFERENCE,
  };
}

const SPENCER_MICROWAVE_SOURCE_RASTER = { width: 2320, height: 3408 } as const;
const SPENCER_MICROWAVE_EVIDENCE_REFERENCE =
  "docs/provenance/us-2495429-spencer-microwave.md#source-sheet-acceptance-2026-09-03";

const EINSTEIN_REFRIGERATOR_SOURCE_RASTER = { width: 2320, height: 3408 } as const;
const EINSTEIN_REFRIGERATOR_EVIDENCE_REFERENCE =
  "docs/provenance/us-1781541-einstein-refrigerator.md#source-sheet-acceptance-2026-09-03";

/**
 * The refrigerator has one complete apparatus drawing on the first PDF page.
 * Its active preview deliberately keeps the entire upright source sheet, which
 * retains both the apparatus and its printed patent furniture without a
 * reconstructed or inferred crop boundary.
 */
function einsteinRefrigeratorSourceSheetLocator(args: {
  occurrenceKey: FigureOccurrenceKey;
}): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: EINSTEIN_REFRIGERATOR_SOURCE_RASTER.width,
    height: EINSTEIN_REFRIGERATOR_SOURCE_RASTER.height,
  };
  return {
    ...args,
    activeAsset: "/patents/figures/us-1781541-einstein-refrigerator/source-sheet-1-v1.png",
    sourcePdfPage: 1,
    sourceRaster: EINSTEIN_REFRIGERATOR_SOURCE_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(
      sourceRectPixels,
      EINSTEIN_REFRIGERATOR_SOURCE_RASTER,
    ),
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-03",
    evidenceReference: EINSTEIN_REFRIGERATOR_EVIDENCE_REFERENCE,
  };
}

/**
 * The one active Spencer preview is the complete, unmodified first PDF page.
 * Its full raster avoids treating a legacy isolated-crop boundary as evidence
 * without a repeatable source-pixel receipt.
 */
function spencerMicrowaveSourceSheetLocator(args: {
  occurrenceKey: FigureOccurrenceKey;
}): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: SPENCER_MICROWAVE_SOURCE_RASTER.width,
    height: SPENCER_MICROWAVE_SOURCE_RASTER.height,
  };
  return {
    ...args,
    activeAsset: "/patents/figures/us-2495429-spencer-microwave/drawing-sheet-source-v1.png",
    sourcePdfPage: 1,
    sourceRaster: SPENCER_MICROWAVE_SOURCE_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(
      sourceRectPixels,
      SPENCER_MICROWAVE_SOURCE_RASTER,
    ),
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-03",
    evidenceReference: SPENCER_MICROWAVE_EVIDENCE_REFERENCE,
  };
}

const TESLA_MOTOR_SOURCE_RASTER = { width: 2320, height: 3408 } as const;
const TESLA_MOTOR_EVIDENCE_REFERENCE =
  "docs/provenance/us-381968-tesla-motor.md#source-sheet-crop-review-2026-09-03";
const TESLA_MOTOR_SOURCE_SHEETS = {
  1: "/patents/figures/us-381968-tesla-motor/figs-1-to-8-and-1a-to-8a-source-sheet-v2.png",
  2: "/patents/figures/us-381968-tesla-motor/figs-9-to-12-source-sheet-v2.png",
  3: "/patents/figures/us-381968-tesla-motor/figs-13-to-16-source-sheet-v2.png",
  4: "/patents/figures/us-381968-tesla-motor/figs-17-to-19-source-sheet-v2.png",
} as const;

/** Full upright source sheets avoid inventing individual crop boundaries. */
function teslaMotorSourceSheetLocator(args: {
  occurrenceKey: FigureOccurrenceKey;
  sourcePdfPage: keyof typeof TESLA_MOTOR_SOURCE_SHEETS;
}): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: TESLA_MOTOR_SOURCE_RASTER.width,
    height: TESLA_MOTOR_SOURCE_RASTER.height,
  };
  return {
    ...args,
    activeAsset: TESLA_MOTOR_SOURCE_SHEETS[args.sourcePdfPage],
    sourceRaster: TESLA_MOTOR_SOURCE_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(sourceRectPixels, TESLA_MOTOR_SOURCE_RASTER),
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 dpi source-pixel review",
    reviewedAt: "2026-09-03",
    evidenceReference: TESLA_MOTOR_EVIDENCE_REFERENCE,
  };
}

function teslaMotorSourceSheetLocators(
  sourcePdfPage: keyof typeof TESLA_MOTOR_SOURCE_SHEETS,
  occurrenceKeys: readonly FigureOccurrenceKey[],
): FigureOccurrenceSourceLocator[] {
  return occurrenceKeys.map((occurrenceKey) =>
    teslaMotorSourceSheetLocator({ occurrenceKey, sourcePdfPage }),
  );
}

const DAVENPORT_ELECTRIC_MOTOR_SOURCE_RASTER = { width: 2320, height: 3408 } as const;
const DAVENPORT_ELECTRIC_MOTOR_EVIDENCE_REFERENCE =
  "docs/provenance/us-132-davenport-electric-motor.md#source-sheet-acceptance-2026-09-03";

/** The sole authored citation names the complete, unmodified drawing sheet. */
function davenportElectricMotorSourceSheetLocator(args: {
  occurrenceKey: FigureOccurrenceKey;
}): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: DAVENPORT_ELECTRIC_MOTOR_SOURCE_RASTER.width,
    height: DAVENPORT_ELECTRIC_MOTOR_SOURCE_RASTER.height,
  };
  return {
    ...args,
    activeAsset: "/patents/figures/us-132-davenport-electric-motor/drawing-sheet-source-v1.png",
    sourcePdfPage: 1,
    sourceRaster: DAVENPORT_ELECTRIC_MOTOR_SOURCE_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(
      sourceRectPixels,
      DAVENPORT_ELECTRIC_MOTOR_SOURCE_RASTER,
    ),
    reviewer: "Classic Patents editorial agent (GPT-5.6); independent source-pixel review",
    reviewedAt: "2026-09-03",
    evidenceReference: DAVENPORT_ELECTRIC_MOTOR_EVIDENCE_REFERENCE,
  };
}

const DELAVAL_SEPARATOR_SOURCE_RASTER = { width: 2320, height: 3408 } as const;
const DELAVAL_SEPARATOR_EVIDENCE_REFERENCE =
  "docs/provenance/us-247804-delaval-separator.md#source-sheet-acceptance-2026-09-03";

/**
 * The labelled De Laval views overlap in the historic one-sheet layout. The
 * active preview deliberately preserves that complete source sheet instead of
 * asserting artificial individual-crop boundaries.
 */
function delavalSeparatorSourceSheetLocator(args: {
  occurrenceKey: FigureOccurrenceKey;
}): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: DELAVAL_SEPARATOR_SOURCE_RASTER.width,
    height: DELAVAL_SEPARATOR_SOURCE_RASTER.height,
  };
  return {
    ...args,
    activeAsset: "/patents/figures/us-247804-delaval-separator/drawing-sheet-source-v1.png",
    sourcePdfPage: 1,
    sourceRaster: DELAVAL_SEPARATOR_SOURCE_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(
      sourceRectPixels,
      DELAVAL_SEPARATOR_SOURCE_RASTER,
    ),
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-03",
    evidenceReference: DELAVAL_SEPARATOR_EVIDENCE_REFERENCE,
  };
}

const EDISON_PHONOGRAPH_SOURCE_RASTER = { width: 2320, height: 3408 } as const;
const EDISON_PHONOGRAPH_EVIDENCE_REFERENCE =
  "docs/provenance/us-200521-edison-phonograph.md#source-sheet-acceptance-2026-09-03";

/**
 * Edison placed the four labelled phonograph figures on one continuous source
 * sheet. The active preview retains the whole sheet rather than asserting
 * isolated boundaries where the historic layout interleaves the views.
 */
function edisonPhonographSourceSheetLocator(args: {
  occurrenceKey: FigureOccurrenceKey;
}): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: EDISON_PHONOGRAPH_SOURCE_RASTER.width,
    height: EDISON_PHONOGRAPH_SOURCE_RASTER.height,
  };
  return {
    ...args,
    activeAsset: "/patents/figures/us-200521-edison-phonograph/drawing-sheet-source-v1.png",
    sourcePdfPage: 1,
    sourceRaster: EDISON_PHONOGRAPH_SOURCE_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(
      sourceRectPixels,
      EDISON_PHONOGRAPH_SOURCE_RASTER,
    ),
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-03",
    evidenceReference: EDISON_PHONOGRAPH_EVIDENCE_REFERENCE,
  };
}

const OTIS_ELEVATOR_SOURCE_RASTER = { width: 2320, height: 3408 } as const;
const OTIS_ELEVATOR_EVIDENCE_REFERENCE =
  "docs/provenance/us-31128-otis-elevator.md#source-sheet-acceptance-2026-09-03";

/**
 * Figs. 1–3 share Otis's sole historic drawing sheet. Each active citation
 * intentionally names the intact sheet, retaining its printed identity,
 * all related figures, witnesses, and inventor signature.
 */
function otisElevatorSourceSheetLocator(args: {
  occurrenceKey: FigureOccurrenceKey;
}): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: OTIS_ELEVATOR_SOURCE_RASTER.width,
    height: OTIS_ELEVATOR_SOURCE_RASTER.height,
  };
  return {
    ...args,
    activeAsset: "/patents/figures/us-31128-otis-elevator/source-sheet-1-v1.png",
    sourcePdfPage: 1,
    sourceRaster: OTIS_ELEVATOR_SOURCE_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(sourceRectPixels, OTIS_ELEVATOR_SOURCE_RASTER),
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-03",
    evidenceReference: OTIS_ELEVATOR_EVIDENCE_REFERENCE,
  };
}

const MAXIM_MACHINE_GUN_SOURCE_RASTER = { width: 2320, height: 3408 } as const;
const MAXIM_MACHINE_GUN_EVIDENCE_REFERENCE =
  "docs/provenance/us-319596-maxim-machine-gun.md#source-sheet-acceptance-2026-09-03";

/**
 * Figs. 1 and 2 share the first historic drawing sheet; Fig. 3 is on the
 * second. The active previews retain complete sheets, including printed
 * identities and signatures, rather than asserting crop boundaries.
 */
function maximMachineGunSourceSheetLocator(args: {
  occurrenceKey: FigureOccurrenceKey;
  sourcePdfPage: 1 | 2;
}): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: MAXIM_MACHINE_GUN_SOURCE_RASTER.width,
    height: MAXIM_MACHINE_GUN_SOURCE_RASTER.height,
  };
  return {
    ...args,
    activeAsset: `/patents/figures/us-319596-maxim-machine-gun/source-sheet-${args.sourcePdfPage}-v1.png`,
    sourceRaster: MAXIM_MACHINE_GUN_SOURCE_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(
      sourceRectPixels,
      MAXIM_MACHINE_GUN_SOURCE_RASTER,
    ),
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-03",
    evidenceReference: MAXIM_MACHINE_GUN_EVIDENCE_REFERENCE,
  };
}

const DAIMLER_MARINE_ENGINE_SOURCE_RASTER = { width: 2320, height: 3408 } as const;
const DAIMLER_MARINE_ENGINE_EVIDENCE_REFERENCE =
  "docs/provenance/us-361931-daimler-engine.md#source-sheet-acceptance-2026-09-03";

/**
 * Sheet 2 combines six labelled details, while sheets 1 and 3 carry the
 * longitudinal and plan views. Each active preview remains the intact source
 * sheet instead of inferring separate crop boundaries.
 */
function daimlerMarineEngineSourceSheetLocator(args: {
  occurrenceKey: FigureOccurrenceKey;
  sourcePdfPage: 1 | 2 | 3;
}): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: DAIMLER_MARINE_ENGINE_SOURCE_RASTER.width,
    height: DAIMLER_MARINE_ENGINE_SOURCE_RASTER.height,
  };
  return {
    ...args,
    activeAsset: `/patents/figures/us-361931-daimler-engine/source-sheet-${args.sourcePdfPage}-v1.png`,
    sourceRaster: DAIMLER_MARINE_ENGINE_SOURCE_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(
      sourceRectPixels,
      DAIMLER_MARINE_ENGINE_SOURCE_RASTER,
    ),
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-03",
    evidenceReference: DAIMLER_MARINE_ENGINE_EVIDENCE_REFERENCE,
  };
}

const PARSONS_TURBINE_SOURCE_RASTER = { width: 2320, height: 3408 } as const;
const PARSONS_TURBINE_EVIDENCE_REFERENCE =
  "docs/provenance/us-608969-parsons-turbine.md#source-sheet-acceptance-2026-09-03";

/**
 * Each Parsons figure occupies a distinct historic sheet. The active preview
 * preserves its entire source sheet, including the printed identity and
 * signature panel, rather than depending on a narrower crop boundary.
 */
function parsonsTurbineSourceSheetLocator(args: {
  occurrenceKey: FigureOccurrenceKey;
  sourcePdfPage: 1 | 2 | 3;
}): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: PARSONS_TURBINE_SOURCE_RASTER.width,
    height: PARSONS_TURBINE_SOURCE_RASTER.height,
  };
  return {
    ...args,
    activeAsset: `/patents/figures/us-608969-parsons-turbine/source-sheet-${args.sourcePdfPage}-v1.png`,
    sourceRaster: PARSONS_TURBINE_SOURCE_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(sourceRectPixels, PARSONS_TURBINE_SOURCE_RASTER),
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-03",
    evidenceReference: PARSONS_TURBINE_EVIDENCE_REFERENCE,
  };
}

const MCCORMICK_REAPER_SOURCE_RASTER = { width: 2320, height: 3408 } as const;
const MCCORMICK_REAPER_EVIDENCE_REFERENCE =
  "docs/provenance/us-x8277-mccormick-reaper.md#source-sheet-acceptance-2026-09-03";

/** The single active preview is the complete, unmodified first source sheet. */
function mccormickReaperSourceSheetLocator(args: {
  occurrenceKey: FigureOccurrenceKey;
}): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: MCCORMICK_REAPER_SOURCE_RASTER.width,
    height: MCCORMICK_REAPER_SOURCE_RASTER.height,
  };
  return {
    ...args,
    activeAsset: "/patents/figures/us-x8277-mccormick-reaper/source-sheet-1-v1.png",
    sourcePdfPage: 1,
    sourceRaster: MCCORMICK_REAPER_SOURCE_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(
      sourceRectPixels,
      MCCORMICK_REAPER_SOURCE_RASTER,
    ),
    reviewer: "Classic Patents editorial agent (GPT-5.6); independent source-pixel review",
    reviewedAt: "2026-09-03",
    evidenceReference: MCCORMICK_REAPER_EVIDENCE_REFERENCE,
  };
}

const EDISON_LIGHTBULB_SOURCE_RASTER = { width: 2320, height: 3408 } as const;
const EDISON_LIGHTBULB_EVIDENCE_REFERENCE =
  "docs/provenance/us-223898-edison-lightbulb.md#source-sheet-acceptance-2026-09-03";

/**
 * Figs. 1–3 share and visually overlap the same historic drawing sheet. Each
 * citation intentionally names that complete, unmodified source sheet rather
 * than manufacture an artificial boundary around one figure.
 */
function edisonLightbulbSourceSheetLocator(args: {
  occurrenceKey: FigureOccurrenceKey;
}): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: EDISON_LIGHTBULB_SOURCE_RASTER.width,
    height: EDISON_LIGHTBULB_SOURCE_RASTER.height,
  };
  return {
    ...args,
    activeAsset: "/patents/figures/us-223898-edison-lightbulb/source-sheet-1-v1.png",
    sourcePdfPage: 1,
    sourceRaster: EDISON_LIGHTBULB_SOURCE_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(
      sourceRectPixels,
      EDISON_LIGHTBULB_SOURCE_RASTER,
    ),
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-03",
    evidenceReference: EDISON_LIGHTBULB_EVIDENCE_REFERENCE,
  };
}

const TESLA_COIL_593138_SOURCE_RASTER = { width: 2320, height: 3408 } as const;
const TESLA_COIL_593138_EVIDENCE_REFERENCE =
  "docs/provenance/us-593138-tesla-coil.md#source-sheet-acceptance-2026-09-03";
const TESLA_COIL_593138_SOURCE_SHEETS = {
  1: "/patents/figures/us-593138-tesla-coil/source-sheet-1.png",
  2: "/patents/figures/us-593138-tesla-coil/source-sheet-2.png",
} as const;

/**
 * Fig. 1 occupies source sheet 1; Figs. 2 and 3 share source sheet 2. The
 * active evidence intentionally keeps each whole historic page intact.
 */
function teslaCoil593138SourceSheetLocator(args: {
  occurrenceKey: FigureOccurrenceKey;
  sourcePdfPage: keyof typeof TESLA_COIL_593138_SOURCE_SHEETS;
}): FigureOccurrenceSourceLocator {
  const sourceRectPixels = {
    x: 0,
    y: 0,
    width: TESLA_COIL_593138_SOURCE_RASTER.width,
    height: TESLA_COIL_593138_SOURCE_RASTER.height,
  };
  return {
    ...args,
    activeAsset: TESLA_COIL_593138_SOURCE_SHEETS[args.sourcePdfPage],
    sourceRaster: TESLA_COIL_593138_SOURCE_RASTER,
    sourceRectPixels,
    normalizedSourceRect: normalizeSourceRectangle(
      sourceRectPixels,
      TESLA_COIL_593138_SOURCE_RASTER,
    ),
    reviewer: "Classic Patents editorial agent (GPT-5.6); direct 300 DPI source-pixel review",
    reviewedAt: "2026-09-03",
    evidenceReference: TESLA_COIL_593138_EVIDENCE_REFERENCE,
  };
}

export const FIGURE_OCCURRENCE_SOURCE_LOCATORS: FigureOccurrenceSourceLocatorRegistry = {
  "us-4575330-hull-stereolithography": [
    hullStereolithographyLocator({
      occurrenceKey: "edition-block-1-group-0-inline-1",
      activeAsset: "/patents/figures/us-4575330-hull-stereolithography/fig-1-source-crop-v1.png",
      sourcePdfPage: 2,
    }),
    hullStereolithographyLocator({
      occurrenceKey: "edition-block-1-group-0-inline-3",
      activeAsset: "/patents/figures/us-4575330-hull-stereolithography/fig-2-source-crop-v1.png",
      sourcePdfPage: 2,
    }),
    hullStereolithographyLocator({
      occurrenceKey: "edition-block-1-group-0-inline-5",
      activeAsset: "/patents/figures/us-4575330-hull-stereolithography/fig-3-source-crop-v1.png",
      sourcePdfPage: 3,
    }),
    hullStereolithographyLocator({
      occurrenceKey: "edition-block-1-group-0-inline-7",
      activeAsset: "/patents/figures/us-4575330-hull-stereolithography/fig-4-source-crop-v1.png",
      sourcePdfPage: 4,
    }),
    hullStereolithographyLocator({
      occurrenceKey: "edition-block-1-group-0-inline-9",
      activeAsset: "/patents/figures/us-4575330-hull-stereolithography/fig-5-source-crop-v1.png",
      sourcePdfPage: 4,
    }),
    hullStereolithographyLocator({
      occurrenceKey: "edition-block-1-group-0-inline-11",
      activeAsset: "/patents/figures/us-4575330-hull-stereolithography/fig-6-source-crop-v1.png",
      sourcePdfPage: 5,
    }),
    hullStereolithographyLocator({
      occurrenceKey: "edition-block-1-group-0-inline-13",
      activeAsset: "/patents/figures/us-4575330-hull-stereolithography/fig-7-source-crop-v1.png",
      sourcePdfPage: 5,
    }),
    hullStereolithographyLocator({
      occurrenceKey: "edition-block-1-group-0-inline-15",
      activeAsset: "/patents/figures/us-4575330-hull-stereolithography/fig-8-source-crop-v1.png",
      sourcePdfPage: 5,
    }),
    hullStereolithographyLocator({
      occurrenceKey: "edition-block-20-group-0-inline-0",
      activeAsset: "/patents/figures/us-4575330-hull-stereolithography/fig-1-source-crop-v1.png",
      sourcePdfPage: 2,
    }),
    hullStereolithographyLocator({
      occurrenceKey: "edition-block-20-group-0-inline-2",
      activeAsset: "/patents/figures/us-4575330-hull-stereolithography/fig-2-source-crop-v1.png",
      sourcePdfPage: 2,
    }),
    hullStereolithographyLocator({
      occurrenceKey: "edition-block-20-group-0-inline-4",
      activeAsset: "/patents/figures/us-4575330-hull-stereolithography/fig-3-source-crop-v1.png",
      sourcePdfPage: 3,
    }),
    hullStereolithographyLocator({
      occurrenceKey: "edition-block-20-group-0-inline-6",
      activeAsset: "/patents/figures/us-4575330-hull-stereolithography/fig-4-source-crop-v1.png",
      sourcePdfPage: 4,
    }),
    hullStereolithographyLocator({
      occurrenceKey: "edition-block-20-group-0-inline-8",
      activeAsset: "/patents/figures/us-4575330-hull-stereolithography/fig-5-source-crop-v1.png",
      sourcePdfPage: 4,
    }),
    hullStereolithographyLocator({
      occurrenceKey: "edition-block-20-group-0-inline-10",
      activeAsset: "/patents/figures/us-4575330-hull-stereolithography/fig-6-source-crop-v1.png",
      sourcePdfPage: 5,
    }),
    hullStereolithographyLocator({
      occurrenceKey: "edition-block-20-group-0-inline-12",
      activeAsset: "/patents/figures/us-4575330-hull-stereolithography/fig-7-source-crop-v1.png",
      sourcePdfPage: 5,
    }),
    hullStereolithographyLocator({
      occurrenceKey: "edition-block-20-group-0-inline-14",
      activeAsset: "/patents/figures/us-4575330-hull-stereolithography/fig-8-source-crop-v1.png",
      sourcePdfPage: 5,
    }),
    hullStereolithographyLocator({
      occurrenceKey: "edition-block-20-group-0-inline-16",
      activeAsset: "/patents/figures/us-4575330-hull-stereolithography/fig-3-source-crop-v1.png",
      sourcePdfPage: 3,
    }),
    hullStereolithographyLocator({
      occurrenceKey: "edition-block-22-group-0-inline-1",
      activeAsset: "/patents/figures/us-4575330-hull-stereolithography/fig-1-source-crop-v1.png",
      sourcePdfPage: 2,
    }),
    hullStereolithographyLocator({
      occurrenceKey: "edition-block-26-group-0-inline-1",
      activeAsset: "/patents/figures/us-4575330-hull-stereolithography/fig-1-source-crop-v1.png",
      sourcePdfPage: 2,
    }),
    hullStereolithographyLocator({
      occurrenceKey: "edition-block-26-group-0-inline-3",
      activeAsset: "/patents/figures/us-4575330-hull-stereolithography/fig-1-source-crop-v1.png",
      sourcePdfPage: 2,
    }),
    hullStereolithographyLocator({
      occurrenceKey: "edition-block-27-group-0-inline-1",
      activeAsset: "/patents/figures/us-4575330-hull-stereolithography/fig-2-source-crop-v1.png",
      sourcePdfPage: 2,
    }),
    hullStereolithographyLocator({
      occurrenceKey: "edition-block-28-group-0-inline-1",
      activeAsset: "/patents/figures/us-4575330-hull-stereolithography/fig-2-source-crop-v1.png",
      sourcePdfPage: 2,
    }),
    hullStereolithographyLocator({
      occurrenceKey: "edition-block-29-group-0-inline-0",
      activeAsset: "/patents/figures/us-4575330-hull-stereolithography/fig-3-source-crop-v1.png",
      sourcePdfPage: 3,
    }),
    hullStereolithographyLocator({
      occurrenceKey: "edition-block-29-group-0-inline-2",
      activeAsset: "/patents/figures/us-4575330-hull-stereolithography/fig-1-source-crop-v1.png",
      sourcePdfPage: 2,
    }),
    hullStereolithographyLocator({
      occurrenceKey: "edition-block-32-group-0-inline-1",
      activeAsset: "/patents/figures/us-4575330-hull-stereolithography/fig-3-source-crop-v1.png",
      sourcePdfPage: 3,
    }),
    hullStereolithographyLocator({
      occurrenceKey: "edition-block-36-group-0-inline-1",
      activeAsset: "/patents/figures/us-4575330-hull-stereolithography/fig-3-source-crop-v1.png",
      sourcePdfPage: 3,
    }),
    hullStereolithographyLocator({
      occurrenceKey: "edition-block-39-group-0-inline-1",
      activeAsset: "/patents/figures/us-4575330-hull-stereolithography/fig-3-source-crop-v1.png",
      sourcePdfPage: 3,
    }),
    hullStereolithographyLocator({
      occurrenceKey: "edition-block-43-group-0-inline-1",
      activeAsset: "/patents/figures/us-4575330-hull-stereolithography/fig-3-source-crop-v1.png",
      sourcePdfPage: 3,
    }),
    hullStereolithographyLocator({
      occurrenceKey: "edition-block-52-group-0-inline-1",
      activeAsset: "/patents/figures/us-4575330-hull-stereolithography/fig-3-source-crop-v1.png",
      sourcePdfPage: 3,
    }),
    hullStereolithographyLocator({
      occurrenceKey: "edition-block-53-group-0-inline-1",
      activeAsset: "/patents/figures/us-4575330-hull-stereolithography/fig-4-source-crop-v1.png",
      sourcePdfPage: 4,
    }),
    hullStereolithographyLocator({
      occurrenceKey: "edition-block-53-group-0-inline-3",
      activeAsset: "/patents/figures/us-4575330-hull-stereolithography/fig-4-source-crop-v1.png",
      sourcePdfPage: 4,
    }),
    hullStereolithographyLocator({
      occurrenceKey: "edition-block-53-group-0-inline-5",
      activeAsset: "/patents/figures/us-4575330-hull-stereolithography/fig-3-source-crop-v1.png",
      sourcePdfPage: 3,
    }),
    hullStereolithographyLocator({
      occurrenceKey: "edition-block-54-group-0-inline-1",
      activeAsset: "/patents/figures/us-4575330-hull-stereolithography/fig-4-source-crop-v1.png",
      sourcePdfPage: 4,
    }),
    hullStereolithographyLocator({
      occurrenceKey: "edition-block-54-group-0-inline-3",
      activeAsset: "/patents/figures/us-4575330-hull-stereolithography/fig-4-source-crop-v1.png",
      sourcePdfPage: 4,
    }),
    hullStereolithographyLocator({
      occurrenceKey: "edition-block-54-group-0-inline-5",
      activeAsset: "/patents/figures/us-4575330-hull-stereolithography/fig-3-source-crop-v1.png",
      sourcePdfPage: 3,
    }),
    hullStereolithographyLocator({
      occurrenceKey: "edition-block-55-group-0-inline-1",
      activeAsset: "/patents/figures/us-4575330-hull-stereolithography/fig-5-source-crop-v1.png",
      sourcePdfPage: 4,
    }),
    hullStereolithographyLocator({
      occurrenceKey: "edition-block-55-group-0-inline-3",
      activeAsset: "/patents/figures/us-4575330-hull-stereolithography/fig-3-source-crop-v1.png",
      sourcePdfPage: 3,
    }),
    hullStereolithographyLocator({
      occurrenceKey: "edition-block-55-group-0-inline-5",
      activeAsset: "/patents/figures/us-4575330-hull-stereolithography/fig-3-source-crop-v1.png",
      sourcePdfPage: 3,
    }),
    hullStereolithographyLocator({
      occurrenceKey: "edition-block-56-group-0-inline-0",
      activeAsset: "/patents/figures/us-4575330-hull-stereolithography/fig-6-source-crop-v1.png",
      sourcePdfPage: 5,
    }),
    hullStereolithographyLocator({
      occurrenceKey: "edition-block-56-group-0-inline-2",
      activeAsset: "/patents/figures/us-4575330-hull-stereolithography/fig-3-source-crop-v1.png",
      sourcePdfPage: 3,
    }),
    hullStereolithographyLocator({
      occurrenceKey: "edition-block-56-group-0-inline-4",
      activeAsset: "/patents/figures/us-4575330-hull-stereolithography/fig-6-source-crop-v1.png",
      sourcePdfPage: 5,
    }),
    hullStereolithographyLocator({
      occurrenceKey: "edition-block-57-group-0-inline-0",
      activeAsset: "/patents/figures/us-4575330-hull-stereolithography/fig-7-source-crop-v1.png",
      sourcePdfPage: 5,
    }),
    hullStereolithographyLocator({
      occurrenceKey: "edition-block-57-group-0-inline-2",
      activeAsset: "/patents/figures/us-4575330-hull-stereolithography/fig-7-source-crop-v1.png",
      sourcePdfPage: 5,
    }),
    hullStereolithographyLocator({
      occurrenceKey: "edition-block-57-group-0-inline-4",
      activeAsset: "/patents/figures/us-4575330-hull-stereolithography/fig-3-source-crop-v1.png",
      sourcePdfPage: 3,
    }),
    hullStereolithographyLocator({
      occurrenceKey: "edition-block-57-group-0-inline-6",
      activeAsset: "/patents/figures/us-4575330-hull-stereolithography/fig-7-source-crop-v1.png",
      sourcePdfPage: 5,
    }),
    hullStereolithographyLocator({
      occurrenceKey: "edition-block-57-group-0-inline-8",
      activeAsset: "/patents/figures/us-4575330-hull-stereolithography/fig-7-source-crop-v1.png",
      sourcePdfPage: 5,
    }),
    hullStereolithographyLocator({
      occurrenceKey: "edition-block-57-group-0-inline-10",
      activeAsset: "/patents/figures/us-4575330-hull-stereolithography/fig-8-source-crop-v1.png",
      sourcePdfPage: 5,
    }),
    hullStereolithographyLocator({
      occurrenceKey: "edition-block-58-group-0-inline-1",
      activeAsset: "/patents/figures/us-4575330-hull-stereolithography/fig-3-source-crop-v1.png",
      sourcePdfPage: 3,
    }),
  ],
  "us-5701965-kamen-transporter": [
    kamenTransporterLocator({
      occurrenceKey: figureOccurrenceKey(11, 0, 1),
      activeAsset: "/patents/figures/us-5701965-kamen-transporter/fig-1-source-crop-v1.png",
      sourcePdfPage: 3,
      sourceRectPixels: { x: 63, y: 43, width: 1306, height: 1363 },
    }),
    kamenTransporterLocator({
      occurrenceKey: figureOccurrenceKey(11, 0, 3),
      activeAsset: "/patents/figures/us-5701965-kamen-transporter/fig-2-source-crop-v1.png",
      sourcePdfPage: 4,
      sourceRectPixels: { x: 65, y: 28, width: 1287, height: 1903 },
    }),
    kamenTransporterLocator({
      occurrenceKey: figureOccurrenceKey(11, 0, 5),
      activeAsset: "/patents/figures/us-5701965-kamen-transporter/fig-1-source-crop-v1.png",
      sourcePdfPage: 3,
      sourceRectPixels: { x: 63, y: 43, width: 1306, height: 1363 },
    }),
    kamenTransporterLocator({
      occurrenceKey: figureOccurrenceKey(11, 0, 7),
      activeAsset: "/patents/figures/us-5701965-kamen-transporter/fig-3-source-crop-v1.png",
      sourcePdfPage: 5,
      sourceRectPixels: { x: 63, y: 28, width: 1289, height: 1908 },
    }),
    kamenTransporterLocator({
      occurrenceKey: figureOccurrenceKey(11, 0, 9),
      activeAsset: "/patents/figures/us-5701965-kamen-transporter/fig-1-source-crop-v1.png",
      sourcePdfPage: 3,
      sourceRectPixels: { x: 63, y: 43, width: 1306, height: 1363 },
    }),
    kamenTransporterLocator({
      occurrenceKey: figureOccurrenceKey(11, 0, 11),
      activeAsset: "/patents/figures/us-5701965-kamen-transporter/fig-4-source-crop-v1.png",
      sourcePdfPage: 6,
      sourceRectPixels: { x: 39, y: 26, width: 1313, height: 1627 },
    }),
    kamenTransporterLocator({
      occurrenceKey: figureOccurrenceKey(11, 0, 13),
      activeAsset: "/patents/figures/us-5701965-kamen-transporter/fig-1-source-crop-v1.png",
      sourcePdfPage: 3,
      sourceRectPixels: { x: 63, y: 43, width: 1306, height: 1363 },
    }),
    kamenTransporterLocator({
      occurrenceKey: figureOccurrenceKey(11, 0, 15),
      activeAsset: "/patents/figures/us-5701965-kamen-transporter/fig-5-source-crop-v1.png",
      sourcePdfPage: 7,
      sourceRectPixels: { x: 63, y: 26, width: 1295, height: 1992 },
    }),
    kamenTransporterLocator({
      occurrenceKey: figureOccurrenceKey(11, 0, 17),
      activeAsset: "/patents/figures/us-5701965-kamen-transporter/fig-1-source-crop-v1.png",
      sourcePdfPage: 3,
      sourceRectPixels: { x: 63, y: 43, width: 1306, height: 1363 },
    }),
    kamenTransporterLocator({
      occurrenceKey: figureOccurrenceKey(11, 0, 19),
      activeAsset: "/patents/figures/us-5701965-kamen-transporter/fig-6-source-crop-v1.png",
      sourcePdfPage: 8,
      sourceRectPixels: { x: 63, y: 26, width: 1287, height: 1554 },
    }),
    kamenTransporterLocator({
      occurrenceKey: figureOccurrenceKey(11, 0, 21),
      activeAsset: "/patents/figures/us-5701965-kamen-transporter/fig-1-source-crop-v1.png",
      sourcePdfPage: 3,
      sourceRectPixels: { x: 63, y: 43, width: 1306, height: 1363 },
    }),
  ],
  "us-6302230-kamen-segway": [
    kamenSegwayLocator({
      occurrenceKey: figureOccurrenceKey(15, 0, 1),
      activeAsset: "/patents/figures/us-6302230-kamen-segway/fig-1-source-crop-v1.png",
      sourcePdfPage: 4,
    }),
    kamenSegwayLocator({
      occurrenceKey: figureOccurrenceKey(15, 0, 3),
      activeAsset: "/patents/figures/us-6302230-kamen-segway/fig-2-source-crop-v1.png",
      sourcePdfPage: 5,
    }),
    kamenSegwayLocator({
      occurrenceKey: figureOccurrenceKey(15, 0, 5),
      activeAsset: "/patents/figures/us-6302230-kamen-segway/fig-3-source-crop-v1.png",
      sourcePdfPage: 6,
    }),
    kamenSegwayLocator({
      occurrenceKey: figureOccurrenceKey(15, 0, 7),
      activeAsset: "/patents/figures/us-6302230-kamen-segway/fig-1-source-crop-v1.png",
      sourcePdfPage: 4,
    }),
    kamenSegwayLocator({
      occurrenceKey: figureOccurrenceKey(15, 0, 9),
      activeAsset: "/patents/figures/us-6302230-kamen-segway/fig-4-source-crop-v1.png",
      sourcePdfPage: 7,
    }),
    kamenSegwayLocator({
      occurrenceKey: figureOccurrenceKey(15, 0, 11),
      activeAsset: "/patents/figures/us-6302230-kamen-segway/fig-1-source-crop-v1.png",
      sourcePdfPage: 4,
    }),
    kamenSegwayLocator({
      occurrenceKey: figureOccurrenceKey(15, 0, 13),
      activeAsset: "/patents/figures/us-6302230-kamen-segway/fig-5-source-crop-v1.png",
      sourcePdfPage: 8,
    }),
    kamenSegwayLocator({
      occurrenceKey: figureOccurrenceKey(15, 0, 15),
      activeAsset: "/patents/figures/us-6302230-kamen-segway/fig-1-source-crop-v1.png",
      sourcePdfPage: 4,
    }),
    kamenSegwayLocator({
      occurrenceKey: figureOccurrenceKey(15, 0, 17),
      activeAsset: "/patents/figures/us-6302230-kamen-segway/fig-6-source-crop-v1.png",
      sourcePdfPage: 9,
    }),
    kamenSegwayLocator({
      occurrenceKey: figureOccurrenceKey(15, 0, 19),
      activeAsset: "/patents/figures/us-6302230-kamen-segway/fig-7-source-crop-v1.png",
      sourcePdfPage: 10,
    }),
    kamenSegwayLocator({
      occurrenceKey: figureOccurrenceKey(15, 0, 21),
      activeAsset: "/patents/figures/us-6302230-kamen-segway/fig-8-source-crop-v1.png",
      sourcePdfPage: 11,
    }),
    kamenSegwayLocator({
      occurrenceKey: figureOccurrenceKey(15, 0, 23),
      activeAsset: "/patents/figures/us-6302230-kamen-segway/fig-9-source-crop-v1.png",
      sourcePdfPage: 12,
    }),
    kamenSegwayLocator({
      occurrenceKey: figureOccurrenceKey(15, 0, 25),
      activeAsset: "/patents/figures/us-6302230-kamen-segway/fig-10-source-crop-v1.png",
      sourcePdfPage: 13,
    }),
    kamenSegwayLocator({
      occurrenceKey: figureOccurrenceKey(15, 0, 27),
      activeAsset: "/patents/figures/us-6302230-kamen-segway/fig-11-source-crop-v1.png",
      sourcePdfPage: 14,
    }),
    kamenSegwayLocator({
      occurrenceKey: figureOccurrenceKey(15, 0, 29),
      activeAsset: "/patents/figures/us-6302230-kamen-segway/fig-12-source-crop-v1.png",
      sourcePdfPage: 15,
    }),
    kamenSegwayLocator({
      occurrenceKey: figureOccurrenceKey(15, 0, 31),
      activeAsset: "/patents/figures/us-6302230-kamen-segway/fig-13-source-crop-v1.png",
      sourcePdfPage: 16,
    }),
    kamenSegwayLocator({
      occurrenceKey: figureOccurrenceKey(15, 0, 33),
      activeAsset: "/patents/figures/us-6302230-kamen-segway/fig-14-source-crop-v1.png",
      sourcePdfPage: 17,
    }),
    kamenSegwayLocator({
      occurrenceKey: figureOccurrenceKey(15, 0, 35),
      activeAsset: "/patents/figures/us-6302230-kamen-segway/fig-15-source-crop-v1.png",
      sourcePdfPage: 18,
    }),
    kamenSegwayLocator({
      occurrenceKey: figureOccurrenceKey(15, 0, 37),
      activeAsset: "/patents/figures/us-6302230-kamen-segway/fig-16-source-crop-v1.png",
      sourcePdfPage: 19,
    }),
    kamenSegwayLocator({
      occurrenceKey: figureOccurrenceKey(20, 0, 1),
      activeAsset: "/patents/figures/us-6302230-kamen-segway/fig-1-source-crop-v1.png",
      sourcePdfPage: 4,
    }),
    kamenSegwayLocator({
      occurrenceKey: figureOccurrenceKey(20, 0, 3),
      activeAsset: "/patents/figures/us-6302230-kamen-segway/fig-3-source-crop-v1.png",
      sourcePdfPage: 6,
    }),
    kamenSegwayLocator({
      occurrenceKey: figureOccurrenceKey(22, 0, 1),
      activeAsset: "/patents/figures/us-6302230-kamen-segway/fig-7-source-crop-v1.png",
      sourcePdfPage: 10,
    }),
    kamenSegwayLocator({
      occurrenceKey: figureOccurrenceKey(25, 0, 1),
      activeAsset: "/patents/figures/us-6302230-kamen-segway/fig-10-source-crop-v1.png",
      sourcePdfPage: 13,
    }),
    kamenSegwayLocator({
      occurrenceKey: figureOccurrenceKey(26, 0, 1),
      activeAsset: "/patents/figures/us-6302230-kamen-segway/fig-11-source-crop-v1.png",
      sourcePdfPage: 14,
    }),
    kamenSegwayLocator({
      occurrenceKey: figureOccurrenceKey(27, 0, 0),
      activeAsset: "/patents/figures/us-6302230-kamen-segway/fig-15-source-crop-v1.png",
      sourcePdfPage: 18,
    }),
  ],
  "us-3858581-kamen-medication-injection-device": [
    kamenMedicationInjectionLocator({ occurrenceKey: figureOccurrenceKey(3, 0, 1), figure: 1 }),
    kamenMedicationInjectionLocator({ occurrenceKey: figureOccurrenceKey(3, 0, 3), figure: 2 }),
    kamenMedicationInjectionLocator({ occurrenceKey: figureOccurrenceKey(3, 0, 5), figure: 3 }),
    kamenMedicationInjectionLocator({ occurrenceKey: figureOccurrenceKey(4, 0, 1), figure: 4 }),
    kamenMedicationInjectionLocator({ occurrenceKey: figureOccurrenceKey(4, 0, 3), figure: 5 }),
    kamenMedicationInjectionLocator({ occurrenceKey: figureOccurrenceKey(4, 0, 5), figure: 6 }),
    kamenMedicationInjectionLocator({ occurrenceKey: figureOccurrenceKey(12, 0, 0), figure: 1 }),
    kamenMedicationInjectionLocator({ occurrenceKey: figureOccurrenceKey(12, 0, 2), figure: 2 }),
    kamenMedicationInjectionLocator({ occurrenceKey: figureOccurrenceKey(12, 0, 4), figure: 3 }),
    kamenMedicationInjectionLocator({ occurrenceKey: figureOccurrenceKey(12, 0, 6), figure: 4 }),
    kamenMedicationInjectionLocator({ occurrenceKey: figureOccurrenceKey(12, 0, 8), figure: 3 }),
    kamenMedicationInjectionLocator({ occurrenceKey: figureOccurrenceKey(12, 0, 10), figure: 5 }),
    kamenMedicationInjectionLocator({ occurrenceKey: figureOccurrenceKey(12, 0, 12), figure: 3 }),
    kamenMedicationInjectionLocator({ occurrenceKey: figureOccurrenceKey(12, 0, 14), figure: 6 }),
    kamenMedicationInjectionLocator({ occurrenceKey: figureOccurrenceKey(13, 0, 1), figure: 1 }),
    kamenMedicationInjectionLocator({ occurrenceKey: figureOccurrenceKey(15, 0, 1), figure: 1 }),
    kamenMedicationInjectionLocator({ occurrenceKey: figureOccurrenceKey(15, 0, 3), figure: 3 }),
    kamenMedicationInjectionLocator({ occurrenceKey: figureOccurrenceKey(18, 0, 1), figure: 2 }),
    kamenMedicationInjectionLocator({ occurrenceKey: figureOccurrenceKey(18, 0, 3), figure: 2 }),
    kamenMedicationInjectionLocator({ occurrenceKey: figureOccurrenceKey(19, 0, 1), figure: 2 }),
    kamenMedicationInjectionLocator({ occurrenceKey: figureOccurrenceKey(21, 0, 1), figure: 4 }),
    kamenMedicationInjectionLocator({ occurrenceKey: figureOccurrenceKey(21, 0, 3), figure: 1 }),
    kamenMedicationInjectionLocator({ occurrenceKey: figureOccurrenceKey(21, 0, 5), figure: 4 }),
    kamenMedicationInjectionLocator({ occurrenceKey: figureOccurrenceKey(21, 0, 7), figure: 3 }),
    kamenMedicationInjectionLocator({ occurrenceKey: figureOccurrenceKey(22, 0, 1), figure: 6 }),
    kamenMedicationInjectionLocator({ occurrenceKey: figureOccurrenceKey(24, 0, 1), figure: 5 }),
    kamenMedicationInjectionLocator({ occurrenceKey: figureOccurrenceKey(27, 0, 1), figure: 3 }),
    kamenMedicationInjectionLocator({ occurrenceKey: figureOccurrenceKey(28, 0, 1), figure: 6 }),
    kamenMedicationInjectionLocator({ occurrenceKey: figureOccurrenceKey(28, 0, 3), figure: 6 }),
    kamenMedicationInjectionLocator({ occurrenceKey: figureOccurrenceKey(28, 0, 5), figure: 6 }),
    kamenMedicationInjectionLocator({ occurrenceKey: figureOccurrenceKey(29, 0, 1), figure: 6 }),
    kamenMedicationInjectionLocator({ occurrenceKey: figureOccurrenceKey(31, 0, 1), figure: 6 }),
    kamenMedicationInjectionLocator({ occurrenceKey: figureOccurrenceKey(32, 0, 1), figure: 6 }),
  ],
  "us-2318259-sikorsky-helicopter": [
    sikorskyHelicopterLocator({
      occurrenceKey: figureOccurrenceKey(11, 0, 0),
      activeAsset: "/patents/figures/us-2318259-sikorsky-helicopter/fig-1-source-crop-v1.png",
      sourcePdfPage: 1,
    }),
    sikorskyHelicopterLocator({
      occurrenceKey: figureOccurrenceKey(12, 0, 0),
      activeAsset: "/patents/figures/us-2318259-sikorsky-helicopter/fig-1-source-crop-v1.png",
      sourcePdfPage: 1,
    }),
    sikorskyHelicopterLocator({
      occurrenceKey: figureOccurrenceKey(13, 0, 0),
      activeAsset: "/patents/figures/us-2318259-sikorsky-helicopter/fig-2-source-crop-v1.png",
      sourcePdfPage: 2,
    }),
    sikorskyHelicopterLocator({
      occurrenceKey: figureOccurrenceKey(14, 0, 0),
      activeAsset: "/patents/figures/us-2318259-sikorsky-helicopter/fig-3-source-crop-v1.png",
      sourcePdfPage: 3,
    }),
    sikorskyHelicopterLocator({
      occurrenceKey: figureOccurrenceKey(15, 0, 0),
      activeAsset: "/patents/figures/us-2318259-sikorsky-helicopter/fig-4-source-crop-v1.png",
      sourcePdfPage: 4,
    }),
    sikorskyHelicopterLocator({
      occurrenceKey: figureOccurrenceKey(16, 0, 0),
      activeAsset: "/patents/figures/us-2318259-sikorsky-helicopter/fig-4-source-crop-v1.png",
      sourcePdfPage: 4,
    }),
    sikorskyHelicopterLocator({
      occurrenceKey: figureOccurrenceKey(17, 0, 0),
      activeAsset: "/patents/figures/us-2318259-sikorsky-helicopter/fig-4-source-crop-v1.png",
      sourcePdfPage: 4,
    }),
    sikorskyHelicopterLocator({
      occurrenceKey: figureOccurrenceKey(18, 0, 0),
      activeAsset: "/patents/figures/us-2318259-sikorsky-helicopter/fig-5-source-crop-v1.png",
      sourcePdfPage: 5,
    }),
    sikorskyHelicopterLocator({
      occurrenceKey: figureOccurrenceKey(19, 0, 0),
      activeAsset: "/patents/figures/us-2318259-sikorsky-helicopter/fig-6-source-crop-v1.png",
      sourcePdfPage: 6,
    }),
    sikorskyHelicopterLocator({
      occurrenceKey: figureOccurrenceKey(20, 0, 0),
      activeAsset: "/patents/figures/us-2318259-sikorsky-helicopter/fig-6-source-crop-v1.png",
      sourcePdfPage: 6,
    }),
    sikorskyHelicopterLocator({
      occurrenceKey: figureOccurrenceKey(21, 0, 0),
      activeAsset: "/patents/figures/us-2318259-sikorsky-helicopter/fig-7-source-crop-v1.png",
      sourcePdfPage: 7,
    }),
    sikorskyHelicopterLocator({
      occurrenceKey: figureOccurrenceKey(22, 0, 0),
      activeAsset: "/patents/figures/us-2318259-sikorsky-helicopter/fig-7-source-crop-v1.png",
      sourcePdfPage: 7,
    }),
    sikorskyHelicopterLocator({
      occurrenceKey: figureOccurrenceKey(23, 0, 1),
      activeAsset: "/patents/figures/us-2318259-sikorsky-helicopter/fig-1-source-crop-v1.png",
      sourcePdfPage: 1,
    }),
    sikorskyHelicopterLocator({
      occurrenceKey: figureOccurrenceKey(30, 0, 1),
      activeAsset: "/patents/figures/us-2318259-sikorsky-helicopter/fig-1-source-crop-v1.png",
      sourcePdfPage: 1,
    }),
    sikorskyHelicopterLocator({
      occurrenceKey: figureOccurrenceKey(30, 0, 3),
      activeAsset: "/patents/figures/us-2318259-sikorsky-helicopter/fig-4-source-crop-v1.png",
      sourcePdfPage: 4,
    }),
  ],
  "us-4063220-metcalfe-ethernet": [
    metcalfeEthernetLocator({
      occurrenceKey: figureOccurrenceKey(9, 0, 0),
      activeAsset: "/patents/figures/us-4063220-metcalfe-ethernet/fig-1-source-crop-v1.png",
      sourcePdfPage: 2,
    }),
    metcalfeEthernetLocator({
      occurrenceKey: figureOccurrenceKey(10, 0, 0),
      activeAsset: "/patents/figures/us-4063220-metcalfe-ethernet/fig-2-source-crop-v1.png",
      sourcePdfPage: 3,
    }),
    metcalfeEthernetLocator({
      occurrenceKey: figureOccurrenceKey(10, 0, 2),
      activeAsset: "/patents/figures/us-4063220-metcalfe-ethernet/fig-1-source-crop-v1.png",
      sourcePdfPage: 2,
    }),
    metcalfeEthernetLocator({
      occurrenceKey: figureOccurrenceKey(11, 0, 0),
      activeAsset: "/patents/figures/us-4063220-metcalfe-ethernet/fig-3-source-crop-v1.png",
      sourcePdfPage: 4,
    }),
    metcalfeEthernetLocator({
      occurrenceKey: figureOccurrenceKey(11, 0, 2),
      activeAsset: "/patents/figures/us-4063220-metcalfe-ethernet/fig-1-source-crop-v1.png",
      sourcePdfPage: 2,
    }),
    metcalfeEthernetLocator({
      occurrenceKey: figureOccurrenceKey(12, 0, 0),
      activeAsset: "/patents/figures/us-4063220-metcalfe-ethernet/fig-4-source-crop-v1.png",
      sourcePdfPage: 5,
    }),
    metcalfeEthernetLocator({
      occurrenceKey: figureOccurrenceKey(12, 0, 2),
      activeAsset: "/patents/figures/us-4063220-metcalfe-ethernet/fig-3-source-crop-v1.png",
      sourcePdfPage: 4,
    }),
    metcalfeEthernetLocator({
      occurrenceKey: figureOccurrenceKey(13, 0, 0),
      activeAsset: "/patents/figures/us-4063220-metcalfe-ethernet/fig-5-source-crop-v1.png",
      sourcePdfPage: 6,
    }),
    metcalfeEthernetLocator({
      occurrenceKey: figureOccurrenceKey(13, 0, 2),
      activeAsset: "/patents/figures/us-4063220-metcalfe-ethernet/fig-2-source-crop-v1.png",
      sourcePdfPage: 3,
    }),
    metcalfeEthernetLocator({
      occurrenceKey: figureOccurrenceKey(14, 0, 0),
      activeAsset: "/patents/figures/us-4063220-metcalfe-ethernet/fig-6-source-crop-v1.png",
      sourcePdfPage: 7,
    }),
    metcalfeEthernetLocator({
      occurrenceKey: figureOccurrenceKey(14, 0, 2),
      activeAsset: "/patents/figures/us-4063220-metcalfe-ethernet/fig-2-source-crop-v1.png",
      sourcePdfPage: 3,
    }),
    metcalfeEthernetLocator({
      occurrenceKey: figureOccurrenceKey(15, 0, 0),
      activeAsset: "/patents/figures/us-4063220-metcalfe-ethernet/fig-6-source-crop-v1.png",
      sourcePdfPage: 7,
    }),
    metcalfeEthernetLocator({
      occurrenceKey: figureOccurrenceKey(19, 0, 1),
      activeAsset: "/patents/figures/us-4063220-metcalfe-ethernet/fig-1-source-crop-v1.png",
      sourcePdfPage: 2,
    }),
    metcalfeEthernetLocator({
      occurrenceKey: figureOccurrenceKey(21, 0, 1),
      activeAsset: "/patents/figures/us-4063220-metcalfe-ethernet/fig-2-source-crop-v1.png",
      sourcePdfPage: 3,
    }),
    metcalfeEthernetLocator({
      occurrenceKey: figureOccurrenceKey(23, 0, 1),
      activeAsset: "/patents/figures/us-4063220-metcalfe-ethernet/fig-2-source-crop-v1.png",
      sourcePdfPage: 3,
    }),
    metcalfeEthernetLocator({
      occurrenceKey: figureOccurrenceKey(23, 0, 3),
      activeAsset: "/patents/figures/us-4063220-metcalfe-ethernet/fig-1-source-crop-v1.png",
      sourcePdfPage: 2,
    }),
    metcalfeEthernetLocator({
      occurrenceKey: figureOccurrenceKey(23, 0, 5),
      activeAsset: "/patents/figures/us-4063220-metcalfe-ethernet/fig-2-source-crop-v1.png",
      sourcePdfPage: 3,
    }),
    metcalfeEthernetLocator({
      occurrenceKey: figureOccurrenceKey(23, 0, 7),
      activeAsset: "/patents/figures/us-4063220-metcalfe-ethernet/fig-1-source-crop-v1.png",
      sourcePdfPage: 2,
    }),
    metcalfeEthernetLocator({
      occurrenceKey: figureOccurrenceKey(23, 0, 9),
      activeAsset: "/patents/figures/us-4063220-metcalfe-ethernet/fig-2-source-crop-v1.png",
      sourcePdfPage: 3,
    }),
    metcalfeEthernetLocator({
      occurrenceKey: figureOccurrenceKey(23, 0, 11),
      activeAsset: "/patents/figures/us-4063220-metcalfe-ethernet/fig-2-source-crop-v1.png",
      sourcePdfPage: 3,
    }),
    metcalfeEthernetLocator({
      occurrenceKey: figureOccurrenceKey(23, 0, 13),
      activeAsset: "/patents/figures/us-4063220-metcalfe-ethernet/fig-3-source-crop-v1.png",
      sourcePdfPage: 4,
    }),
    metcalfeEthernetLocator({
      occurrenceKey: figureOccurrenceKey(23, 0, 15),
      activeAsset: "/patents/figures/us-4063220-metcalfe-ethernet/fig-3-source-crop-v1.png",
      sourcePdfPage: 4,
    }),
    metcalfeEthernetLocator({
      occurrenceKey: figureOccurrenceKey(23, 0, 17),
      activeAsset: "/patents/figures/us-4063220-metcalfe-ethernet/fig-2-source-crop-v1.png",
      sourcePdfPage: 3,
    }),
    metcalfeEthernetLocator({
      occurrenceKey: figureOccurrenceKey(23, 0, 19),
      activeAsset: "/patents/figures/us-4063220-metcalfe-ethernet/fig-4-source-crop-v1.png",
      sourcePdfPage: 5,
    }),
    metcalfeEthernetLocator({
      occurrenceKey: figureOccurrenceKey(25, 0, 1),
      activeAsset: "/patents/figures/us-4063220-metcalfe-ethernet/fig-5-source-crop-v1.png",
      sourcePdfPage: 6,
    }),
    metcalfeEthernetLocator({
      occurrenceKey: figureOccurrenceKey(25, 0, 3),
      activeAsset: "/patents/figures/us-4063220-metcalfe-ethernet/fig-6-source-crop-v1.png",
      sourcePdfPage: 7,
    }),
    metcalfeEthernetLocator({
      occurrenceKey: figureOccurrenceKey(25, 0, 5),
      activeAsset: "/patents/figures/us-4063220-metcalfe-ethernet/fig-6-source-crop-v1.png",
      sourcePdfPage: 7,
    }),
    metcalfeEthernetLocator({
      occurrenceKey: figureOccurrenceKey(25, 0, 7),
      activeAsset: "/patents/figures/us-4063220-metcalfe-ethernet/fig-6-source-crop-v1.png",
      sourcePdfPage: 7,
    }),
    metcalfeEthernetLocator({
      occurrenceKey: figureOccurrenceKey(25, 0, 9),
      activeAsset: "/patents/figures/us-4063220-metcalfe-ethernet/fig-6-source-crop-v1.png",
      sourcePdfPage: 7,
    }),
    metcalfeEthernetLocator({
      occurrenceKey: figureOccurrenceKey(25, 0, 11),
      activeAsset: "/patents/figures/us-4063220-metcalfe-ethernet/fig-6-source-crop-v1.png",
      sourcePdfPage: 7,
    }),
    metcalfeEthernetLocator({
      occurrenceKey: figureOccurrenceKey(27, 0, 1),
      activeAsset: "/patents/figures/us-4063220-metcalfe-ethernet/fig-6-source-crop-v1.png",
      sourcePdfPage: 7,
    }),
    metcalfeEthernetLocator({
      occurrenceKey: figureOccurrenceKey(27, 0, 3),
      activeAsset: "/patents/figures/us-4063220-metcalfe-ethernet/fig-6-source-crop-v1.png",
      sourcePdfPage: 7,
    }),
  ],
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
  "us-x9430-colt-revolver": [
    coltRevolverLocator({
      occurrenceKey: figureOccurrenceKey(1, 0, 1),
      activeAsset:
        "/patents/figures/us-x9430-colt-revolver/division-2-pistol-section-source-crop-v2.png",
      sourcePdfPage: 2,
    }),
    coltRevolverLocator({
      occurrenceKey: figureOccurrenceKey(7, 0, 0),
      activeAsset: "/patents/figures/us-x9430-colt-revolver/division-1-pistol-source-crop-v2.png",
      sourcePdfPage: 1,
    }),
    coltRevolverLocator({
      occurrenceKey: figureOccurrenceKey(7, 0, 2),
      activeAsset:
        "/patents/figures/us-x9430-colt-revolver/division-2-pistol-section-source-crop-v2.png",
      sourcePdfPage: 2,
    }),
    coltRevolverLocator({
      occurrenceKey: figureOccurrenceKey(7, 0, 4),
      activeAsset: "/patents/figures/us-x9430-colt-revolver/division-1-pistol-source-crop-v2.png",
      sourcePdfPage: 1,
    }),
    coltRevolverLocator({
      occurrenceKey: figureOccurrenceKey(7, 0, 6),
      activeAsset:
        "/patents/figures/us-x9430-colt-revolver/division-3-lock-parts-source-crop-v2.png",
      sourcePdfPage: 3,
    }),
    coltRevolverLocator({
      occurrenceKey: figureOccurrenceKey(7, 0, 8),
      activeAsset:
        "/patents/figures/us-x9430-colt-revolver/division-2-pistol-section-source-crop-v2.png",
      sourcePdfPage: 2,
    }),
    coltRevolverLocator({
      occurrenceKey: figureOccurrenceKey(7, 0, 10),
      activeAsset:
        "/patents/figures/us-x9430-colt-revolver/division-2-pistol-section-source-crop-v2.png",
      sourcePdfPage: 2,
    }),
    coltRevolverLocator({
      occurrenceKey: figureOccurrenceKey(7, 0, 12),
      activeAsset:
        "/patents/figures/us-x9430-colt-revolver/division-4-arbor-and-cylinder-source-crop-v2.png",
      sourcePdfPage: 4,
    }),
    coltRevolverLocator({
      occurrenceKey: figureOccurrenceKey(7, 0, 14),
      activeAsset:
        "/patents/figures/us-x9430-colt-revolver/division-4-arbor-and-cylinder-source-crop-v2.png",
      sourcePdfPage: 4,
    }),
    coltRevolverLocator({
      occurrenceKey: figureOccurrenceKey(7, 0, 16),
      activeAsset:
        "/patents/figures/us-x9430-colt-revolver/division-2-pistol-section-source-crop-v2.png",
      sourcePdfPage: 2,
    }),
    coltRevolverLocator({
      occurrenceKey: figureOccurrenceKey(7, 0, 18),
      activeAsset:
        "/patents/figures/us-x9430-colt-revolver/division-5-combination-source-crop-v2.png",
      sourcePdfPage: 2,
    }),
    coltRevolverLocator({
      occurrenceKey: figureOccurrenceKey(8, 0, 0),
      activeAsset:
        "/patents/figures/us-x9430-colt-revolver/division-3-lock-parts-source-crop-v2.png",
      sourcePdfPage: 3,
    }),
    coltRevolverLocator({
      occurrenceKey: figureOccurrenceKey(8, 0, 2),
      activeAsset:
        "/patents/figures/us-x9430-colt-revolver/division-3-lock-parts-source-crop-v2.png",
      sourcePdfPage: 3,
    }),
    coltRevolverLocator({
      occurrenceKey: figureOccurrenceKey(9, 0, 0),
      activeAsset:
        "/patents/figures/us-x9430-colt-revolver/division-3-lock-parts-source-crop-v2.png",
      sourcePdfPage: 3,
    }),
    coltRevolverLocator({
      occurrenceKey: figureOccurrenceKey(10, 0, 0),
      activeAsset:
        "/patents/figures/us-x9430-colt-revolver/division-3-lock-parts-source-crop-v2.png",
      sourcePdfPage: 3,
    }),
    coltRevolverLocator({
      occurrenceKey: figureOccurrenceKey(10, 0, 2),
      activeAsset:
        "/patents/figures/us-x9430-colt-revolver/division-3-lock-parts-source-crop-v2.png",
      sourcePdfPage: 3,
    }),
    coltRevolverLocator({
      occurrenceKey: figureOccurrenceKey(11, 0, 0),
      activeAsset:
        "/patents/figures/us-x9430-colt-revolver/division-3-lock-parts-source-crop-v2.png",
      sourcePdfPage: 3,
    }),
    coltRevolverLocator({
      occurrenceKey: figureOccurrenceKey(11, 0, 2),
      activeAsset:
        "/patents/figures/us-x9430-colt-revolver/division-3-lock-parts-source-crop-v2.png",
      sourcePdfPage: 3,
    }),
    coltRevolverLocator({
      occurrenceKey: figureOccurrenceKey(12, 0, 0),
      activeAsset:
        "/patents/figures/us-x9430-colt-revolver/division-3-lock-parts-source-crop-v2.png",
      sourcePdfPage: 3,
    }),
    coltRevolverLocator({
      occurrenceKey: figureOccurrenceKey(12, 0, 2),
      activeAsset:
        "/patents/figures/us-x9430-colt-revolver/division-3-lock-parts-source-crop-v2.png",
      sourcePdfPage: 3,
    }),
    coltRevolverLocator({
      occurrenceKey: figureOccurrenceKey(12, 0, 4),
      activeAsset:
        "/patents/figures/us-x9430-colt-revolver/division-3-lock-parts-source-crop-v2.png",
      sourcePdfPage: 3,
    }),
    coltRevolverLocator({
      occurrenceKey: figureOccurrenceKey(12, 0, 6),
      activeAsset:
        "/patents/figures/us-x9430-colt-revolver/division-3-lock-parts-source-crop-v2.png",
      sourcePdfPage: 3,
    }),
    coltRevolverLocator({
      occurrenceKey: figureOccurrenceKey(12, 0, 8),
      activeAsset:
        "/patents/figures/us-x9430-colt-revolver/division-3-lock-parts-source-crop-v2.png",
      sourcePdfPage: 3,
    }),
    coltRevolverLocator({
      occurrenceKey: figureOccurrenceKey(12, 0, 10),
      activeAsset:
        "/patents/figures/us-x9430-colt-revolver/division-3-lock-parts-source-crop-v2.png",
      sourcePdfPage: 3,
    }),
    coltRevolverLocator({
      occurrenceKey: figureOccurrenceKey(12, 0, 12),
      activeAsset:
        "/patents/figures/us-x9430-colt-revolver/division-3-lock-parts-source-crop-v2.png",
      sourcePdfPage: 3,
    }),
    coltRevolverLocator({
      occurrenceKey: figureOccurrenceKey(12, 0, 14),
      activeAsset:
        "/patents/figures/us-x9430-colt-revolver/division-3-lock-parts-source-crop-v2.png",
      sourcePdfPage: 3,
    }),
    coltRevolverLocator({
      occurrenceKey: figureOccurrenceKey(12, 0, 16),
      activeAsset:
        "/patents/figures/us-x9430-colt-revolver/division-3-lock-parts-source-crop-v2.png",
      sourcePdfPage: 3,
    }),
    coltRevolverLocator({
      occurrenceKey: figureOccurrenceKey(12, 0, 18),
      activeAsset:
        "/patents/figures/us-x9430-colt-revolver/division-3-lock-parts-source-crop-v2.png",
      sourcePdfPage: 3,
    }),
    coltRevolverLocator({
      occurrenceKey: figureOccurrenceKey(13, 0, 0),
      activeAsset:
        "/patents/figures/us-x9430-colt-revolver/division-4-arbor-and-cylinder-source-crop-v2.png",
      sourcePdfPage: 4,
    }),
    coltRevolverLocator({
      occurrenceKey: figureOccurrenceKey(13, 0, 2),
      activeAsset:
        "/patents/figures/us-x9430-colt-revolver/division-4-arbor-and-cylinder-source-crop-v2.png",
      sourcePdfPage: 4,
    }),
    coltRevolverLocator({
      occurrenceKey: figureOccurrenceKey(13, 0, 4),
      activeAsset:
        "/patents/figures/us-x9430-colt-revolver/division-4-arbor-and-cylinder-source-crop-v2.png",
      sourcePdfPage: 4,
    }),
    coltRevolverLocator({
      occurrenceKey: figureOccurrenceKey(13, 0, 6),
      activeAsset:
        "/patents/figures/us-x9430-colt-revolver/division-4-arbor-and-cylinder-source-crop-v2.png",
      sourcePdfPage: 4,
    }),
    coltRevolverLocator({
      occurrenceKey: figureOccurrenceKey(13, 0, 8),
      activeAsset:
        "/patents/figures/us-x9430-colt-revolver/division-4-arbor-and-cylinder-source-crop-v2.png",
      sourcePdfPage: 4,
    }),
    coltRevolverLocator({
      occurrenceKey: figureOccurrenceKey(13, 0, 10),
      activeAsset:
        "/patents/figures/us-x9430-colt-revolver/division-4-arbor-and-cylinder-source-crop-v2.png",
      sourcePdfPage: 4,
    }),
    coltRevolverLocator({
      occurrenceKey: figureOccurrenceKey(13, 0, 12),
      activeAsset:
        "/patents/figures/us-x9430-colt-revolver/division-4-arbor-and-cylinder-source-crop-v2.png",
      sourcePdfPage: 4,
    }),
    coltRevolverLocator({
      occurrenceKey: figureOccurrenceKey(13, 0, 14),
      activeAsset:
        "/patents/figures/us-x9430-colt-revolver/division-4-arbor-and-cylinder-source-crop-v2.png",
      sourcePdfPage: 4,
    }),
    coltRevolverLocator({
      occurrenceKey: figureOccurrenceKey(13, 0, 16),
      activeAsset:
        "/patents/figures/us-x9430-colt-revolver/division-4-arbor-and-cylinder-source-crop-v2.png",
      sourcePdfPage: 4,
    }),
    coltRevolverLocator({
      occurrenceKey: figureOccurrenceKey(13, 0, 18),
      activeAsset:
        "/patents/figures/us-x9430-colt-revolver/division-4-arbor-and-cylinder-source-crop-v2.png",
      sourcePdfPage: 4,
    }),
    coltRevolverLocator({
      occurrenceKey: figureOccurrenceKey(13, 0, 20),
      activeAsset:
        "/patents/figures/us-x9430-colt-revolver/division-2-pistol-section-source-crop-v2.png",
      sourcePdfPage: 2,
    }),
    coltRevolverLocator({
      occurrenceKey: figureOccurrenceKey(14, 0, 0),
      activeAsset:
        "/patents/figures/us-x9430-colt-revolver/division-4-arbor-and-cylinder-source-crop-v2.png",
      sourcePdfPage: 4,
    }),
    coltRevolverLocator({
      occurrenceKey: figureOccurrenceKey(15, 0, 0),
      activeAsset:
        "/patents/figures/us-x9430-colt-revolver/division-4-arbor-and-cylinder-source-crop-v2.png",
      sourcePdfPage: 4,
    }),
    coltRevolverLocator({
      occurrenceKey: figureOccurrenceKey(15, 0, 2),
      activeAsset:
        "/patents/figures/us-x9430-colt-revolver/division-4-arbor-and-cylinder-source-crop-v2.png",
      sourcePdfPage: 4,
    }),
    coltRevolverLocator({
      occurrenceKey: figureOccurrenceKey(15, 0, 4),
      activeAsset:
        "/patents/figures/us-x9430-colt-revolver/division-2-pistol-section-source-crop-v2.png",
      sourcePdfPage: 2,
    }),
    coltRevolverLocator({
      occurrenceKey: figureOccurrenceKey(15, 0, 6),
      activeAsset:
        "/patents/figures/us-x9430-colt-revolver/division-3-lock-parts-source-crop-v2.png",
      sourcePdfPage: 3,
    }),
    coltRevolverLocator({
      occurrenceKey: figureOccurrenceKey(15, 0, 8),
      activeAsset:
        "/patents/figures/us-x9430-colt-revolver/division-3-lock-parts-source-crop-v2.png",
      sourcePdfPage: 3,
    }),
    coltRevolverLocator({
      occurrenceKey: figureOccurrenceKey(15, 0, 10),
      activeAsset:
        "/patents/figures/us-x9430-colt-revolver/division-4-arbor-and-cylinder-source-crop-v2.png",
      sourcePdfPage: 4,
    }),
    coltRevolverLocator({
      occurrenceKey: figureOccurrenceKey(15, 0, 12),
      activeAsset:
        "/patents/figures/us-x9430-colt-revolver/division-2-pistol-section-source-crop-v2.png",
      sourcePdfPage: 2,
    }),
    coltRevolverLocator({
      occurrenceKey: figureOccurrenceKey(16, 0, 1),
      activeAsset:
        "/patents/figures/us-x9430-colt-revolver/division-2-pistol-section-source-crop-v2.png",
      sourcePdfPage: 2,
    }),
    coltRevolverLocator({
      occurrenceKey: figureOccurrenceKey(16, 0, 3),
      activeAsset:
        "/patents/figures/us-x9430-colt-revolver/division-4-arbor-and-cylinder-source-crop-v2.png",
      sourcePdfPage: 4,
    }),
    coltRevolverLocator({
      occurrenceKey: figureOccurrenceKey(16, 0, 5),
      activeAsset:
        "/patents/figures/us-x9430-colt-revolver/division-2-pistol-section-source-crop-v2.png",
      sourcePdfPage: 2,
    }),
    coltRevolverLocator({
      occurrenceKey: figureOccurrenceKey(17, 0, 1),
      activeAsset: "/patents/figures/us-x9430-colt-revolver/plate-2-lockwork-source-crop-v2.png",
      sourcePdfPage: 4,
    }),
    coltRevolverLocator({
      occurrenceKey: figureOccurrenceKey(20, 0, 0),
      activeAsset: "/patents/figures/us-x9430-colt-revolver/plate-2-lockwork-source-crop-v2.png",
      sourcePdfPage: 4,
    }),
    coltRevolverLocator({
      occurrenceKey: figureOccurrenceKey(20, 0, 2),
      activeAsset: "/patents/figures/us-x9430-colt-revolver/plate-2-lockwork-source-crop-v2.png",
      sourcePdfPage: 4,
    }),
    coltRevolverLocator({
      occurrenceKey: figureOccurrenceKey(20, 0, 4),
      activeAsset: "/patents/figures/us-x9430-colt-revolver/plate-2-lockwork-source-crop-v2.png",
      sourcePdfPage: 4,
    }),
    coltRevolverLocator({
      occurrenceKey: figureOccurrenceKey(20, 0, 6),
      activeAsset: "/patents/figures/us-x9430-colt-revolver/plate-2-lockwork-source-crop-v2.png",
      sourcePdfPage: 4,
    }),
    coltRevolverLocator({
      occurrenceKey: figureOccurrenceKey(20, 0, 8),
      activeAsset: "/patents/figures/us-x9430-colt-revolver/plate-2-lockwork-source-crop-v2.png",
      sourcePdfPage: 4,
    }),
    coltRevolverLocator({
      occurrenceKey: figureOccurrenceKey(20, 0, 10),
      activeAsset: "/patents/figures/us-x9430-colt-revolver/plate-2-lockwork-source-crop-v2.png",
      sourcePdfPage: 4,
    }),
    coltRevolverLocator({
      occurrenceKey: figureOccurrenceKey(20, 0, 12),
      activeAsset: "/patents/figures/us-x9430-colt-revolver/plate-2-lockwork-source-crop-v2.png",
      sourcePdfPage: 4,
    }),
    coltRevolverLocator({
      occurrenceKey: figureOccurrenceKey(20, 0, 14),
      activeAsset: "/patents/figures/us-x9430-colt-revolver/plate-2-lockwork-source-crop-v2.png",
      sourcePdfPage: 4,
    }),
    coltRevolverLocator({
      occurrenceKey: figureOccurrenceKey(20, 0, 16),
      activeAsset: "/patents/figures/us-x9430-colt-revolver/plate-2-lockwork-source-crop-v2.png",
      sourcePdfPage: 4,
    }),
    coltRevolverLocator({
      occurrenceKey: figureOccurrenceKey(21, 0, 1),
      activeAsset:
        "/patents/figures/us-x9430-colt-revolver/division-4-arbor-and-cylinder-source-crop-v2.png",
      sourcePdfPage: 4,
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
  "us-6285999-pagerank": [
    pagerankLocator({
      occurrenceKey: figureOccurrenceKey(20, 0, 0),
      activeAsset: "/patents/figures/us-6285999-pagerank/fig-1-source-crop-v1.png",
      sourcePdfPage: 3,
    }),
    pagerankLocator({
      occurrenceKey: figureOccurrenceKey(20, 0, 2),
      activeAsset: "/patents/figures/us-6285999-pagerank/fig-2-source-crop-v1.png",
      sourcePdfPage: 4,
    }),
    pagerankLocator({
      occurrenceKey: figureOccurrenceKey(20, 0, 4),
      activeAsset: "/patents/figures/us-6285999-pagerank/fig-3-source-crop-v1.png",
      sourcePdfPage: 5,
    }),
    pagerankLocator({
      occurrenceKey: figureOccurrenceKey(23, 0, 1),
      activeAsset: "/patents/figures/us-6285999-pagerank/fig-1-source-crop-v1.png",
      sourcePdfPage: 3,
    }),
    pagerankLocator({
      occurrenceKey: figureOccurrenceKey(27, 0, 1),
      activeAsset: "/patents/figures/us-6285999-pagerank/fig-2-source-crop-v1.png",
      sourcePdfPage: 4,
    }),
    pagerankLocator({
      occurrenceKey: figureOccurrenceKey(34, 0, 1),
      activeAsset: "/patents/figures/us-6285999-pagerank/fig-3-source-crop-v1.png",
      sourcePdfPage: 5,
    }),
  ],
  "us-821393-wright-flyer": [
    wrightFlyerSourceSheetLocator({
      occurrenceKey: "edition-block-9-group-0-inline-1",
      activeAsset: "/patents/figures/us-821393-wright-flyer/fig-1-source-sheet-v1.png",
      sourcePdfPage: 1,
    }),
    wrightFlyerSourceSheetLocator({
      occurrenceKey: "edition-block-9-group-0-inline-3",
      activeAsset: "/patents/figures/us-821393-wright-flyer/fig-2-source-sheet-v1.png",
      sourcePdfPage: 2,
    }),
    wrightFlyerSourceSheetLocator({
      occurrenceKey: "edition-block-9-group-0-inline-5",
      activeAsset: "/patents/figures/us-821393-wright-flyer/figs-3-5-source-sheet-v1.png",
      sourcePdfPage: 3,
    }),
    wrightFlyerSourceSheetLocator({
      occurrenceKey: "edition-block-9-group-0-inline-7",
      activeAsset: "/patents/figures/us-821393-wright-flyer/figs-3-5-source-sheet-v1.png",
      sourcePdfPage: 3,
    }),
    wrightFlyerSourceSheetLocator({
      occurrenceKey: "edition-block-13-group-0-inline-3",
      activeAsset: "/patents/figures/us-821393-wright-flyer/fig-2-source-sheet-v1.png",
      sourcePdfPage: 2,
    }),
    wrightFlyerSourceSheetLocator({
      occurrenceKey: "edition-block-14-group-0-inline-1",
      activeAsset: "/patents/figures/us-821393-wright-flyer/figs-3-5-source-sheet-v1.png",
      sourcePdfPage: 3,
    }),
    wrightFlyerSourceSheetLocator({
      occurrenceKey: "edition-block-17-group-0-inline-1",
      activeAsset: "/patents/figures/us-821393-wright-flyer/fig-1-source-sheet-v1.png",
      sourcePdfPage: 1,
    }),
    wrightFlyerSourceSheetLocator({
      occurrenceKey: "edition-block-17-group-0-inline-3",
      activeAsset: "/patents/figures/us-821393-wright-flyer/fig-1-source-sheet-v1.png",
      sourcePdfPage: 1,
    }),
    wrightFlyerSourceSheetLocator({
      occurrenceKey: "edition-block-17-group-0-inline-5",
      activeAsset: "/patents/figures/us-821393-wright-flyer/fig-2-source-sheet-v1.png",
      sourcePdfPage: 2,
    }),
    wrightFlyerSourceSheetLocator({
      occurrenceKey: "edition-block-17-group-0-inline-7",
      activeAsset: "/patents/figures/us-821393-wright-flyer/fig-1-source-sheet-v1.png",
      sourcePdfPage: 1,
    }),
    wrightFlyerSourceSheetLocator({
      occurrenceKey: "edition-block-17-group-0-inline-9",
      activeAsset: "/patents/figures/us-821393-wright-flyer/fig-1-source-sheet-v1.png",
      sourcePdfPage: 1,
    }),
    wrightFlyerSourceSheetLocator({
      occurrenceKey: "edition-block-19-group-0-inline-1",
      activeAsset: "/patents/figures/us-821393-wright-flyer/fig-1-source-sheet-v1.png",
      sourcePdfPage: 1,
    }),
    wrightFlyerSourceSheetLocator({
      occurrenceKey: "edition-block-20-group-0-inline-1",
      activeAsset: "/patents/figures/us-821393-wright-flyer/figs-3-5-source-sheet-v1.png",
      sourcePdfPage: 3,
    }),
    wrightFlyerSourceSheetLocator({
      occurrenceKey: "edition-block-20-group-0-inline-5",
      activeAsset: "/patents/figures/us-821393-wright-flyer/figs-3-5-source-sheet-v1.png",
      sourcePdfPage: 3,
    }),
    wrightFlyerSourceSheetLocator({
      occurrenceKey: "edition-block-24-group-0-inline-3",
      activeAsset: "/patents/figures/us-821393-wright-flyer/figs-3-5-source-sheet-v1.png",
      sourcePdfPage: 3,
    }),
  ],
  "us-879532-de-forest-audion": [
    deForestAudionSourceSheetLocator({ occurrenceKey: "edition-block-5-group-0-inline-1" }),
    deForestAudionSourceSheetLocator({ occurrenceKey: "edition-block-5-group-0-inline-3" }),
    deForestAudionSourceSheetLocator({ occurrenceKey: "edition-block-7-group-0-inline-3" }),
    deForestAudionSourceSheetLocator({ occurrenceKey: "edition-block-7-group-0-inline-5" }),
    deForestAudionSourceSheetLocator({ occurrenceKey: "edition-block-9-group-0-inline-3" }),
    deForestAudionSourceSheetLocator({ occurrenceKey: "edition-block-9-group-0-inline-5" }),
  ],
  "us-307031-edison-indicator": [
    edisonIndicatorSourceSheetLocator({ occurrenceKey: "edition-block-5-group-0-inline-1" }),
    edisonIndicatorSourceSheetLocator({ occurrenceKey: "edition-block-5-group-0-inline-3" }),
    edisonIndicatorSourceSheetLocator({ occurrenceKey: "edition-block-5-group-0-inline-5" }),
    edisonIndicatorSourceSheetLocator({ occurrenceKey: "edition-block-5-group-0-inline-7" }),
    edisonIndicatorSourceSheetLocator({ occurrenceKey: "edition-block-7-group-0-inline-1" }),
    edisonIndicatorSourceSheetLocator({ occurrenceKey: "edition-block-9-group-0-inline-1" }),
  ],
  "us-157124-glidden-barbed-wire": [
    gliddenBarbedWireSourceSheetLocator({ occurrenceKey: "edition-block-1-group-0-inline-1" }),
    gliddenBarbedWireSourceSheetLocator({ occurrenceKey: "edition-block-1-group-0-inline-2" }),
    gliddenBarbedWireSourceSheetLocator({ occurrenceKey: "edition-block-1-group-0-inline-3" }),
    gliddenBarbedWireSourceSheetLocator({ occurrenceKey: "edition-block-4-group-0-inline-0" }),
    gliddenBarbedWireSourceSheetLocator({ occurrenceKey: "edition-block-4-group-0-inline-2" }),
    gliddenBarbedWireSourceSheetLocator({ occurrenceKey: "edition-block-4-group-0-inline-4" }),
  ],
  "us-1219881-sundback-zipper": [
    sundbackZipperSourceSheetLocator({ occurrenceKey: "edition-block-2-group-0-inline-1" }),
    sundbackZipperSourceSheetLocator({ occurrenceKey: "edition-block-2-group-0-inline-3" }),
    sundbackZipperSourceSheetLocator({ occurrenceKey: "edition-block-2-group-0-inline-5" }),
    sundbackZipperSourceSheetLocator({ occurrenceKey: "edition-block-2-group-0-inline-7" }),
    sundbackZipperSourceSheetLocator({ occurrenceKey: "edition-block-2-group-0-inline-9" }),
    sundbackZipperSourceSheetLocator({ occurrenceKey: "edition-block-2-group-0-inline-11" }),
    sundbackZipperSourceSheetLocator({ occurrenceKey: "edition-block-2-group-0-inline-13" }),
    sundbackZipperSourceSheetLocator({ occurrenceKey: "edition-block-2-group-0-inline-15" }),
    sundbackZipperSourceSheetLocator({ occurrenceKey: "edition-block-2-group-0-inline-17" }),
    sundbackZipperSourceSheetLocator({ occurrenceKey: "edition-block-8-group-0-inline-1" }),
    sundbackZipperSourceSheetLocator({ occurrenceKey: "edition-block-8-group-0-inline-3" }),
    sundbackZipperSourceSheetLocator({ occurrenceKey: "edition-block-8-group-0-inline-5" }),
    sundbackZipperSourceSheetLocator({ occurrenceKey: "edition-block-8-group-0-inline-7" }),
    sundbackZipperSourceSheetLocator({ occurrenceKey: "edition-block-8-group-0-inline-9" }),
    sundbackZipperSourceSheetLocator({ occurrenceKey: "edition-block-8-group-0-inline-11" }),
    sundbackZipperSourceSheetLocator({ occurrenceKey: "edition-block-8-group-0-inline-13" }),
    sundbackZipperSourceSheetLocator({ occurrenceKey: "edition-block-8-group-0-inline-15" }),
    sundbackZipperSourceSheetLocator({ occurrenceKey: "edition-block-8-group-0-inline-17" }),
    sundbackZipperSourceSheetLocator({ occurrenceKey: "edition-block-8-group-0-inline-19" }),
    sundbackZipperSourceSheetLocator({ occurrenceKey: "edition-block-8-group-0-inline-21" }),
    sundbackZipperSourceSheetLocator({ occurrenceKey: "edition-block-8-group-0-inline-23" }),
    sundbackZipperSourceSheetLocator({ occurrenceKey: "edition-block-11-group-0-inline-0" }),
    sundbackZipperSourceSheetLocator({ occurrenceKey: "edition-block-11-group-0-inline-2" }),
    sundbackZipperSourceSheetLocator({ occurrenceKey: "edition-block-11-group-0-inline-4" }),
    sundbackZipperSourceSheetLocator({ occurrenceKey: "edition-block-12-group-0-inline-1" }),
  ],
  "us-233692-pelton-water-wheel": [
    peltonWaterWheelSourceSheetLocator({ occurrenceKey: "edition-block-2-group-0-inline-1" }),
    peltonWaterWheelSourceSheetLocator({ occurrenceKey: "edition-block-2-group-0-inline-3" }),
    peltonWaterWheelSourceSheetLocator({ occurrenceKey: "edition-block-2-group-0-inline-5" }),
    peltonWaterWheelSourceSheetLocator({ occurrenceKey: "edition-block-2-group-0-inline-7" }),
    peltonWaterWheelSourceSheetLocator({ occurrenceKey: "edition-block-7-group-0-inline-1" }),
    peltonWaterWheelSourceSheetLocator({ occurrenceKey: "edition-block-7-group-0-inline-3" }),
    peltonWaterWheelSourceSheetLocator({ occurrenceKey: "edition-block-7-group-0-inline-5" }),
    peltonWaterWheelSourceSheetLocator({ occurrenceKey: "edition-block-7-group-0-inline-7" }),
  ],
  "us-2717437-mestral-velcro": [
    mestralVelcroSourceSheetLocator({ occurrenceKey: "edition-block-1-group-0-inline-0" }),
    mestralVelcroSourceSheetLocator({ occurrenceKey: "edition-block-1-group-0-inline-2" }),
    mestralVelcroSourceSheetLocator({ occurrenceKey: "edition-block-6-group-0-inline-1" }),
    mestralVelcroSourceSheetLocator({ occurrenceKey: "edition-block-6-group-0-inline-3" }),
    mestralVelcroSourceSheetLocator({ occurrenceKey: "edition-block-7-group-0-inline-1" }),
    mestralVelcroSourceSheetLocator({ occurrenceKey: "edition-block-11-group-0-inline-1" }),
    mestralVelcroSourceSheetLocator({ occurrenceKey: "edition-block-11-group-0-inline-5" }),
    mestralVelcroSourceSheetLocator({ occurrenceKey: "edition-block-13-group-0-inline-1" }),
    mestralVelcroSourceSheetLocator({ occurrenceKey: "edition-block-13-group-0-inline-3" }),
    mestralVelcroSourceSheetLocator({ occurrenceKey: "edition-block-16-group-0-inline-1" }),
    mestralVelcroSourceSheetLocator({ occurrenceKey: "edition-block-16-group-0-inline-3" }),
  ],
  "us-6469-lincoln-buoy": [
    lincolnBuoySourceSheetLocator({ occurrenceKey: "edition-block-7-group-0-inline-0" }),
    lincolnBuoySourceSheetLocator({ occurrenceKey: "edition-block-7-group-0-inline-2" }),
    lincolnBuoySourceSheetLocator({ occurrenceKey: "edition-block-7-group-0-inline-4" }),
    lincolnBuoySourceSheetLocator({ occurrenceKey: "edition-block-9-group-0-inline-1" }),
    lincolnBuoySourceSheetLocator({ occurrenceKey: "edition-block-10-group-0-inline-1" }),
    lincolnBuoySourceSheetLocator({ occurrenceKey: "edition-block-11-group-0-inline-1" }),
    lincolnBuoySourceSheetLocator({ occurrenceKey: "edition-block-12-group-0-inline-1" }),
    lincolnBuoySourceSheetLocator({ occurrenceKey: "edition-block-12-group-0-inline-3" }),
    lincolnBuoySourceSheetLocator({ occurrenceKey: "edition-block-12-group-0-inline-5" }),
    lincolnBuoySourceSheetLocator({ occurrenceKey: "edition-block-13-group-0-inline-1" }),
  ],
  "us-400766-hall-aluminium": [
    hallAluminiumSourceSheetLocator({ occurrenceKey: "edition-block-1-group-0-inline-1" }),
    hallAluminiumSourceSheetLocator({ occurrenceKey: "edition-block-1-group-0-inline-3" }),
    hallAluminiumSourceSheetLocator({ occurrenceKey: "edition-block-4-group-0-inline-1" }),
    hallAluminiumSourceSheetLocator({ occurrenceKey: "edition-block-4-group-0-inline-3" }),
    hallAluminiumSourceSheetLocator({ occurrenceKey: "edition-block-8-group-0-inline-1" }),
    hallAluminiumSourceSheetLocator({ occurrenceKey: "edition-block-8-group-0-inline-3" }),
  ],
  "us-388850-eastman-kodak": [
    eastmanKodakSourceSheetLocator({
      occurrenceKey: "edition-block-4-group-0-inline-1",
      sourcePdfPage: 1,
    }),
    eastmanKodakSourceSheetLocator({
      occurrenceKey: "edition-block-4-group-0-inline-3",
      sourcePdfPage: 1,
    }),
    eastmanKodakSourceSheetLocator({
      occurrenceKey: "edition-block-4-group-0-inline-5",
      sourcePdfPage: 1,
    }),
    eastmanKodakSourceSheetLocator({
      occurrenceKey: "edition-block-4-group-0-inline-7",
      sourcePdfPage: 2,
    }),
    eastmanKodakSourceSheetLocator({
      occurrenceKey: "edition-block-4-group-0-inline-9",
      sourcePdfPage: 2,
    }),
    eastmanKodakSourceSheetLocator({
      occurrenceKey: "edition-block-4-group-0-inline-11",
      sourcePdfPage: 2,
    }),
    eastmanKodakSourceSheetLocator({
      occurrenceKey: "edition-block-4-group-0-inline-13",
      sourcePdfPage: 2,
    }),
    eastmanKodakSourceSheetLocator({
      occurrenceKey: "edition-block-4-group-0-inline-15",
      sourcePdfPage: 2,
    }),
    eastmanKodakSourceSheetLocator({
      occurrenceKey: "edition-block-4-group-0-inline-17",
      sourcePdfPage: 3,
    }),
    eastmanKodakSourceSheetLocator({
      occurrenceKey: "edition-block-4-group-0-inline-19",
      sourcePdfPage: 3,
    }),
    eastmanKodakSourceSheetLocator({
      occurrenceKey: "edition-block-4-group-0-inline-23",
      sourcePdfPage: 2,
    }),
  ],
  "us-4341502-makino-scara": [
    makinoScaraSourceSheetLocator({
      occurrenceKey: "edition-block-11-group-0-inline-0",
      sourcePdfPage: 2,
    }),
    makinoScaraSourceSheetLocator({
      occurrenceKey: "edition-block-11-group-0-inline-2",
      sourcePdfPage: 3,
    }),
    makinoScaraSourceSheetLocator({
      occurrenceKey: "edition-block-11-group-0-inline-4",
      sourcePdfPage: 2,
    }),
    makinoScaraSourceSheetLocator({
      occurrenceKey: "edition-block-11-group-0-inline-6",
      sourcePdfPage: 3,
    }),
    makinoScaraSourceSheetLocator({
      occurrenceKey: "edition-block-11-group-0-inline-8",
      sourcePdfPage: 3,
    }),
    makinoScaraSourceSheetLocator({
      occurrenceKey: "edition-block-13-group-0-inline-1",
      sourcePdfPage: 2,
    }),
    makinoScaraSourceSheetLocator({
      occurrenceKey: "edition-block-14-group-0-inline-1",
      sourcePdfPage: 3,
    }),
    makinoScaraSourceSheetLocator({
      occurrenceKey: "edition-block-15-group-0-inline-0",
      sourcePdfPage: 3,
    }),
    makinoScaraSourceSheetLocator({
      occurrenceKey: "edition-block-15-group-0-inline-2",
      sourcePdfPage: 3,
    }),
    makinoScaraSourceSheetLocator({
      occurrenceKey: "edition-block-16-group-0-inline-1",
      sourcePdfPage: 3,
    }),
    makinoScaraSourceSheetLocator({
      occurrenceKey: "edition-block-16-group-0-inline-3",
      sourcePdfPage: 3,
    }),
    makinoScaraSourceSheetLocator({
      occurrenceKey: "edition-block-16-group-0-inline-5",
      sourcePdfPage: 3,
    }),
    makinoScaraSourceSheetLocator({
      occurrenceKey: "edition-block-16-group-0-inline-7",
      sourcePdfPage: 3,
    }),
    makinoScaraSourceSheetLocator({
      occurrenceKey: "edition-block-16-group-0-inline-9",
      sourcePdfPage: 3,
    }),
    makinoScaraSourceSheetLocator({
      occurrenceKey: "edition-block-17-group-0-inline-1",
      sourcePdfPage: 3,
    }),
    makinoScaraSourceSheetLocator({
      occurrenceKey: "edition-block-17-group-0-inline-3",
      sourcePdfPage: 3,
    }),
  ],
  "us-3728480-baer-odyssey": [
    baerOdysseySourceSheetLocator({
      occurrenceKey: "edition-block-21-group-0-inline-0",
      sourcePdfPage: 2,
    }),
    baerOdysseySourceSheetLocator({
      occurrenceKey: "edition-block-22-group-0-inline-0",
      sourcePdfPage: 2,
    }),
    baerOdysseySourceSheetLocator({
      occurrenceKey: "edition-block-23-group-0-inline-0",
      sourcePdfPage: 2,
    }),
    baerOdysseySourceSheetLocator({
      occurrenceKey: "edition-block-24-group-0-inline-0",
      sourcePdfPage: 3,
    }),
    baerOdysseySourceSheetLocator({
      occurrenceKey: "edition-block-25-group-0-inline-0",
      sourcePdfPage: 3,
    }),
    baerOdysseySourceSheetLocator({
      occurrenceKey: "edition-block-26-group-0-inline-0",
      sourcePdfPage: 4,
    }),
    baerOdysseySourceSheetLocator({
      occurrenceKey: "edition-block-27-group-0-inline-0",
      sourcePdfPage: 5,
    }),
    baerOdysseySourceSheetLocator({
      occurrenceKey: "edition-block-28-group-0-inline-0",
      sourcePdfPage: 4,
    }),
    baerOdysseySourceSheetLocator({
      occurrenceKey: "edition-block-29-group-0-inline-0",
      sourcePdfPage: 6,
    }),
    baerOdysseySourceSheetLocator({
      occurrenceKey: "edition-block-30-group-0-inline-0",
      sourcePdfPage: 11,
    }),
    baerOdysseySourceSheetLocator({
      occurrenceKey: "edition-block-31-group-0-inline-0",
      sourcePdfPage: 11,
    }),
    baerOdysseySourceSheetLocator({
      occurrenceKey: "edition-block-32-group-0-inline-0",
      sourcePdfPage: 12,
    }),
    baerOdysseySourceSheetLocator({
      occurrenceKey: "edition-block-33-group-0-inline-0",
      sourcePdfPage: 12,
    }),
    baerOdysseySourceSheetLocator({
      occurrenceKey: "edition-block-35-group-0-inline-1",
      sourcePdfPage: 2,
    }),
    baerOdysseySourceSheetLocator({
      occurrenceKey: "edition-block-35-group-0-inline-3",
      sourcePdfPage: 2,
    }),
  ],
  "us-2297691-carlson-electrophotography":
    CARLSON_ELECTROPHOTOGRAPHY_SOURCE_SHEET_OCCURRENCE_KEYS.map(
      carlsonElectrophotographySourceSheetLocator,
    ),
  "us-48475-yale-lock": YALE_LOCK_SOURCE_SHEET_OCCURRENCE_KEYS.map(yaleLockSourceSheetLocator),
  "us-235199-bell-photophone": BELL_PHOTOPHONE_SOURCE_SHEET_OCCURRENCES.map(
    ([occurrenceKey, sourcePdfPage]) =>
      bellPhotophoneSourceSheetLocator(occurrenceKey, sourcePdfPage),
  ),
  "us-120057-gramme-dynamo": GRAMME_DYNAMO_SOURCE_SHEET_OCCURRENCES.map(
    ([occurrenceKey, sourcePdfPage]) =>
      grammeDynamoSourceSheetLocator(occurrenceKey, sourcePdfPage),
  ),
  "us-1773980-farnsworth-tv": FARNSWORTH_TV_SOURCE_SHEET_OCCURRENCES.map(
    ([occurrenceKey, sourcePdfPage]) =>
      farnsworthTvSourceSheetLocator(occurrenceKey, sourcePdfPage),
  ),
  "us-2292387-lamarr-frequency-hopping": LAMARR_FREQUENCY_HOPPING_SOURCE_SHEET_OCCURRENCES.map(
    ([occurrenceKey, sourcePdfPage]) =>
      lamarrFrequencyHoppingSourceSheetLocator(occurrenceKey, sourcePdfPage),
  ),
  "us-4750-howe-sewing-machine": HOWE_SEWING_MACHINE_SOURCE_SHEET_OCCURRENCES.map(
    ([occurrenceKey, sourcePdfPage]) =>
      howeSewingMachineSourceSheetLocator(occurrenceKey, sourcePdfPage),
  ),
  "us-3212649-amf-versatran": AMF_VERSATRAN_SOURCE_SHEET_OCCURRENCES.map(
    ([occurrenceKey, sourcePdfPage]) =>
      amfVersatranSourceSheetLocator(occurrenceKey, sourcePdfPage),
  ),
  "us-2524035-bardeen-transistor": BARDEEN_TRANSISTOR_SOURCE_SHEET_OCCURRENCES.map(
    ([occurrenceKey, sourcePdfPage]) =>
      bardeenTransistorSourceSheetLocator(occurrenceKey, sourcePdfPage),
  ),
  "us-3858232-boyle-smith-ccd": BOYLE_SMITH_CCD_SOURCE_SHEET_OCCURRENCES.map(
    ([occurrenceKey, sourcePdfPage]) =>
      boyleSmithCcdSourceSheetLocator(occurrenceKey, sourcePdfPage),
  ),
  "us-3353115-maiman-ruby-laser": MAIMAN_RUBY_LASER_SOURCE_SHEET_OCCURRENCES.map(
    ([occurrenceKey, sourcePdfPage]) =>
      maimanRubyLaserSourceSheetLocator(occurrenceKey, sourcePdfPage),
  ),
  "us-2846084-goertz-electronic-master-slave-manipulator":
    GOERTZ_MASTER_SLAVE_MANIPULATOR_SOURCE_SHEET_OCCURRENCES.map(([occurrenceKey, sourcePdfPage]) =>
      goertzMasterSlaveManipulatorSourceSheetLocator(occurrenceKey, sourcePdfPage),
    ),
  "us-3081379-lemelson-machine-vision": LEMELSON_MACHINE_VISION_SOURCE_SHEET_OCCURRENCES.map(
    ([occurrenceKey, sourcePdfPage]) =>
      lemelsonMachineVisionSourceSheetLocator(occurrenceKey, sourcePdfPage),
  ),
  "us-1647-morse-telegraph": MORSE_TELEGRAPH_SOURCE_SHEET_OCCURRENCES.map(
    ([occurrenceKey, sourcePdfPage]) =>
      morseTelegraphSourceSheetLocator(occurrenceKey, sourcePdfPage),
  ),
  "us-3260375-lemelson-adjustable-manipulator":
    LEMELSON_ADJUSTABLE_MANIPULATOR_SOURCE_SHEET_OCCURRENCES.map(([occurrenceKey, sourcePdfPage]) =>
      lemelsonAdjustableManipulatorSourceSheetLocator(occurrenceKey, sourcePdfPage),
    ),
  "us-2981877-noyce-ic": NOYCE_IC_SOURCE_SHEET_OCCURRENCES.map(([occurrenceKey, sourcePdfPage]) =>
    noyceIcSourceSheetLocator(occurrenceKey, sourcePdfPage),
  ),
  "us-4765668-robot-end-effector": ROBOT_END_EFFECTOR_SOURCE_SHEET_OCCURRENCES.map(
    ([occurrenceKey, sourcePdfPage]) =>
      robotEndEffectorSourceSheetLocator(occurrenceKey, sourcePdfPage),
  ),
  "us-4921293-salisbury-robot-hand": SALISBURY_ROBOT_HAND_SOURCE_SHEET_OCCURRENCES.map(
    ([occurrenceKey, sourcePdfPage]) =>
      salisburyRobotHandSourceSheetLocator(occurrenceKey, sourcePdfPage),
  ),
  "us-79265-sholes-typewriter": SHOLES_TYPEWRITER_SOURCE_SHEET_OCCURRENCES.map(
    ([occurrenceKey, sourcePdfPage]) =>
      sholesTypewriterSourceSheetLocator(occurrenceKey, sourcePdfPage),
  ),
  "us-808897-carrier-air-conditioner": CARRIER_AIR_CONDITIONER_SOURCE_SHEET_OCCURRENCES.map(
    carrierAirConditionerSourceSheetLocator,
  ),
  "us-682690-hewitt-mercury-lamp": HEWITT_MERCURY_LAMP_SOURCE_SHEET_OCCURRENCES.map(
    ([occurrenceKey, sourcePdfPage]) =>
      hewittMercuryLampSourceSheetLocator(occurrenceKey, sourcePdfPage),
  ),
  "us-1102653-goddard-rocket": GODDARD_ROCKET_SOURCE_SHEET_OCCURRENCES.map(
    goddardRocketSourceSheetLocator,
  ),
  "us-2929922-townes-laser": TOWNES_LASER_SOURCE_SHEET_OCCURRENCES.map(
    townesLaserSourceSheetLocator,
  ),
  "us-124404-westinghouse-air-brake": WESTINGHOUSE_AIR_BRAKE_SOURCE_SHEET_OCCURRENCES.map(
    westinghouseAirBrakeSourceSheetLocator,
  ),
  "us-174465-bell-telephone": BELL_TELEPHONE_SOURCE_SHEET_OCCURRENCES.map(
    ([occurrenceKey, sourcePdfPage]) =>
      bellTelephoneSourceSheetLocator(occurrenceKey, sourcePdfPage),
  ),
  "us-2988237-devol-programmed-transfer": DEVOL_PROGRAMMED_TRANSFER_SOURCE_SHEET_OCCURRENCES.map(
    ([occurrenceKey, sourcePdfPage]) =>
      devolProgrammedTransferSourceSheetLocator(occurrenceKey, sourcePdfPage),
  ),
  "us-470918-reno-escalator": RENO_ESCALATOR_SOURCE_SHEET_OCCURRENCES.map(
    ([occurrenceKey, sourcePdfPage]) =>
      renoEscalatorSourceSheetLocator(occurrenceKey, sourcePdfPage),
  ),
  "us-588-ericsson-propeller": ERICSSON_PROPELLER_SOURCE_SHEET_OCCURRENCES.map(
    ([occurrenceKey, sourcePdfPage]) =>
      ericssonPropellerSourceSheetLocator(occurrenceKey, sourcePdfPage),
  ),
  "us-5121329-crump-fdm": CRUMP_FDM_SOURCE_SHEET_OCCURRENCES.map(
    ([occurrenceKey, sourceSheetNumber]) =>
      crumpFdmSourceSheetLocator(occurrenceKey, sourceSheetNumber),
  ),
  "us-395781-hollerith-tabulating": HOLLERITH_TABULATING_SOURCE_SHEET_OCCURRENCES.map(
    ([occurrenceKey, sourcePdfPage]) =>
      hollerithTabulatingSourceSheetLocator(occurrenceKey, sourcePdfPage),
  ),
  "us-3138743-kilby-integrated-circuit": KILBY_INTEGRATED_CIRCUIT_SOURCE_SHEET_OCCURRENCES.map(
    ([occurrenceKey, sourcePdfPage]) =>
      kilbyIntegratedCircuitSourceSheetLocator(occurrenceKey, sourcePdfPage),
  ),
  "us-x72-whitney-cotton-gin": WHITNEY_COTTON_GIN_SOURCE_SHEET_OCCURRENCES.map(
    ([occurrenceKey, sourcePdfPage]) =>
      whitneyCottonGinSourceSheetLocator(occurrenceKey, sourcePdfPage),
  ),
  "us-6594844-roomba": [
    roombaSourceSheetLocator({ occurrenceKey: "edition-block-12-group-0-inline-1" }),
    roombaSourceSheetLocator({ occurrenceKey: "edition-block-12-group-0-inline-3" }),
    roombaSourceSheetLocator({ occurrenceKey: "edition-block-12-group-0-inline-5" }),
    roombaSourceSheetLocator({ occurrenceKey: "edition-block-16-group-0-inline-1" }),
  ],
  "us-6162-corliss-steam-engine": [
    corlissSourceSheetLocator({
      occurrenceKey: "edition-block-7-group-0-inline-0",
      sourcePdfPage: 1,
    }),
    corlissSourceSheetLocator({
      occurrenceKey: "edition-block-7-group-0-inline-2",
      sourcePdfPage: 2,
    }),
    corlissSourceSheetLocator({
      occurrenceKey: "edition-block-7-group-0-inline-4",
      sourcePdfPage: 3,
    }),
    corlissSourceSheetLocator({
      occurrenceKey: "edition-block-7-group-0-inline-6",
      sourcePdfPage: 4,
    }),
    corlissSourceSheetLocator({
      occurrenceKey: "edition-block-7-group-0-inline-8",
      sourcePdfPage: 4,
    }),
    corlissSourceSheetLocator({
      occurrenceKey: "edition-block-7-group-0-inline-10",
      sourcePdfPage: 3,
    }),
    corlissSourceSheetLocator({
      occurrenceKey: "edition-block-20-group-0-inline-1",
      sourcePdfPage: 4,
    }),
  ],
  "us-727650-linde-air-liquefaction": [
    lindeAirLiquefactionSourceSheetLocator({ occurrenceKey: "edition-block-1-group-0-inline-1" }),
    lindeAirLiquefactionSourceSheetLocator({ occurrenceKey: "edition-block-8-group-0-inline-1" }),
  ],
  "us-1781541-einstein-refrigerator": [
    einsteinRefrigeratorSourceSheetLocator({ occurrenceKey: "edition-block-2-group-0-inline-1" }),
    einsteinRefrigeratorSourceSheetLocator({ occurrenceKey: "edition-block-3-group-0-inline-1" }),
  ],
  "us-2495429-spencer-microwave": [
    spencerMicrowaveSourceSheetLocator({ occurrenceKey: "edition-block-6-group-0-inline-1" }),
  ],
  "us-381968-tesla-motor": [
    ...teslaMotorSourceSheetLocators(1, [
      "edition-block-1-group-0-inline-1",
      "edition-block-1-group-0-inline-3",
      "edition-block-11-group-0-inline-1",
      "edition-block-11-group-0-inline-3",
      "edition-block-12-group-0-inline-1",
      "edition-block-12-group-0-inline-5",
      "edition-block-12-group-0-inline-7",
      "edition-block-13-group-0-inline-1",
      "edition-block-13-group-0-inline-3",
      "edition-block-13-group-0-inline-5",
      "edition-block-14-group-0-inline-0",
      "edition-block-14-group-0-inline-2",
      "edition-block-14-group-0-inline-4",
      "edition-block-14-group-0-inline-6",
      "edition-block-14-group-0-inline-8",
      "edition-block-14-group-0-inline-10",
      "edition-block-14-group-0-inline-12",
      "edition-block-15-group-0-inline-0",
      "edition-block-15-group-0-inline-2",
      "edition-block-15-group-0-inline-4",
      "edition-block-15-group-0-inline-6",
    ]),
    ...teslaMotorSourceSheetLocators(2, [
      "edition-block-2-group-0-inline-0",
      "edition-block-2-group-0-inline-4",
      "edition-block-9-group-0-inline-1",
      "edition-block-12-group-0-inline-3",
      "edition-block-15-group-0-inline-8",
      "edition-block-16-group-0-inline-1",
      "edition-block-17-group-0-inline-1",
      "edition-block-17-group-0-inline-3",
      "edition-block-17-group-0-inline-5",
      "edition-block-19-group-0-inline-1",
      "edition-block-19-group-0-inline-3",
      "edition-block-28-group-0-inline-1",
      "edition-block-30-group-0-inline-1",
    ]),
    ...teslaMotorSourceSheetLocators(3, [
      "edition-block-3-group-0-inline-0",
      "edition-block-3-group-0-inline-2",
      "edition-block-21-group-0-inline-0",
      "edition-block-21-group-0-inline-2",
      "edition-block-22-group-0-inline-1",
      "edition-block-22-group-0-inline-3",
      "edition-block-22-group-0-inline-5",
      "edition-block-22-group-0-inline-7",
      "edition-block-29-group-0-inline-1",
    ]),
    ...teslaMotorSourceSheetLocators(4, [
      "edition-block-4-group-0-inline-0",
      "edition-block-4-group-0-inline-2",
      "edition-block-4-group-0-inline-4",
      "edition-block-23-group-0-inline-1",
      "edition-block-23-group-0-inline-3",
      "edition-block-23-group-0-inline-5",
      "edition-block-23-group-0-inline-7",
      "edition-block-23-group-0-inline-9",
      "edition-block-23-group-0-inline-11",
      "edition-block-24-group-0-inline-1",
      "edition-block-24-group-0-inline-3",
      "edition-block-25-group-0-inline-1",
      "edition-block-25-group-0-inline-3",
      "edition-block-29-group-0-inline-3",
    ]),
  ],
  "us-593138-tesla-coil": [
    teslaCoil593138SourceSheetLocator({
      occurrenceKey: "edition-block-1-group-0-inline-0",
      sourcePdfPage: 1,
    }),
    teslaCoil593138SourceSheetLocator({
      occurrenceKey: "edition-block-2-group-0-inline-0",
      sourcePdfPage: 2,
    }),
    teslaCoil593138SourceSheetLocator({
      occurrenceKey: "edition-block-2-group-0-inline-2",
      sourcePdfPage: 2,
    }),
    teslaCoil593138SourceSheetLocator({
      occurrenceKey: "edition-block-9-group-0-inline-1",
      sourcePdfPage: 1,
    }),
    teslaCoil593138SourceSheetLocator({
      occurrenceKey: "edition-block-9-group-0-inline-3",
      sourcePdfPage: 2,
    }),
    teslaCoil593138SourceSheetLocator({
      occurrenceKey: "edition-block-9-group-0-inline-5",
      sourcePdfPage: 2,
    }),
    teslaCoil593138SourceSheetLocator({
      occurrenceKey: "edition-block-13-group-0-inline-3",
      sourcePdfPage: 1,
    }),
    teslaCoil593138SourceSheetLocator({
      occurrenceKey: "edition-block-14-group-0-inline-1",
      sourcePdfPage: 2,
    }),
    teslaCoil593138SourceSheetLocator({
      occurrenceKey: "edition-block-15-group-0-inline-1",
      sourcePdfPage: 2,
    }),
    teslaCoil593138SourceSheetLocator({
      occurrenceKey: "edition-block-15-group-0-inline-3",
      sourcePdfPage: 2,
    }),
    teslaCoil593138SourceSheetLocator({
      occurrenceKey: "edition-block-17-group-0-inline-1",
      sourcePdfPage: 2,
    }),
  ],
  "us-132-davenport-electric-motor": [
    davenportElectricMotorSourceSheetLocator({ occurrenceKey: "edition-block-3-group-0-inline-1" }),
  ],
  "us-247804-delaval-separator": [
    delavalSeparatorSourceSheetLocator({ occurrenceKey: "edition-block-1-group-0-inline-1" }),
    delavalSeparatorSourceSheetLocator({ occurrenceKey: "edition-block-1-group-0-inline-3" }),
    delavalSeparatorSourceSheetLocator({ occurrenceKey: "edition-block-7-group-0-inline-1" }),
    delavalSeparatorSourceSheetLocator({ occurrenceKey: "edition-block-7-group-0-inline-3" }),
  ],
  "us-223898-edison-lightbulb": [
    edisonLightbulbSourceSheetLocator({ occurrenceKey: "edition-block-1-group-0-inline-1" }),
    edisonLightbulbSourceSheetLocator({ occurrenceKey: "edition-block-1-group-0-inline-3" }),
    edisonLightbulbSourceSheetLocator({ occurrenceKey: "edition-block-1-group-0-inline-5" }),
    edisonLightbulbSourceSheetLocator({ occurrenceKey: "edition-block-19-group-0-inline-1" }),
    edisonLightbulbSourceSheetLocator({ occurrenceKey: "edition-block-19-group-0-inline-3" }),
    edisonLightbulbSourceSheetLocator({ occurrenceKey: "edition-block-19-group-0-inline-5" }),
  ],
  "us-200521-edison-phonograph": [
    edisonPhonographSourceSheetLocator({ occurrenceKey: "edition-block-1-group-0-inline-5" }),
    edisonPhonographSourceSheetLocator({ occurrenceKey: "edition-block-1-group-0-inline-7" }),
    edisonPhonographSourceSheetLocator({ occurrenceKey: "edition-block-1-group-0-inline-9" }),
    edisonPhonographSourceSheetLocator({ occurrenceKey: "edition-block-1-group-0-inline-11" }),
    edisonPhonographSourceSheetLocator({ occurrenceKey: "edition-block-9-group-0-inline-1" }),
    edisonPhonographSourceSheetLocator({ occurrenceKey: "edition-block-9-group-0-inline-3" }),
    edisonPhonographSourceSheetLocator({ occurrenceKey: "edition-block-26-group-0-inline-5" }),
    edisonPhonographSourceSheetLocator({ occurrenceKey: "edition-block-26-group-0-inline-7" }),
  ],
  "us-31128-otis-elevator": [
    otisElevatorSourceSheetLocator({ occurrenceKey: "edition-block-3-group-0-inline-0" }),
    otisElevatorSourceSheetLocator({ occurrenceKey: "edition-block-3-group-0-inline-2" }),
    otisElevatorSourceSheetLocator({ occurrenceKey: "edition-block-3-group-0-inline-4" }),
    otisElevatorSourceSheetLocator({ occurrenceKey: "edition-block-3-group-0-inline-6" }),
    otisElevatorSourceSheetLocator({ occurrenceKey: "edition-block-7-group-0-inline-1" }),
    otisElevatorSourceSheetLocator({ occurrenceKey: "edition-block-9-group-0-inline-1" }),
    otisElevatorSourceSheetLocator({ occurrenceKey: "edition-block-13-group-0-inline-1" }),
    otisElevatorSourceSheetLocator({ occurrenceKey: "edition-block-27-group-0-inline-1" }),
  ],
  "us-319596-maxim-machine-gun": [
    maximMachineGunSourceSheetLocator({
      occurrenceKey: "edition-block-1-group-0-inline-1",
      sourcePdfPage: 1,
    }),
    maximMachineGunSourceSheetLocator({
      occurrenceKey: "edition-block-1-group-0-inline-3",
      sourcePdfPage: 1,
    }),
    maximMachineGunSourceSheetLocator({
      occurrenceKey: "edition-block-1-group-0-inline-5",
      sourcePdfPage: 2,
    }),
    maximMachineGunSourceSheetLocator({
      occurrenceKey: "edition-block-6-group-0-inline-1",
      sourcePdfPage: 1,
    }),
    maximMachineGunSourceSheetLocator({
      occurrenceKey: "edition-block-6-group-0-inline-3",
      sourcePdfPage: 1,
    }),
    maximMachineGunSourceSheetLocator({
      occurrenceKey: "edition-block-6-group-0-inline-5",
      sourcePdfPage: 1,
    }),
    maximMachineGunSourceSheetLocator({
      occurrenceKey: "edition-block-6-group-0-inline-7",
      sourcePdfPage: 2,
    }),
    maximMachineGunSourceSheetLocator({
      occurrenceKey: "edition-block-10-group-0-inline-1",
      sourcePdfPage: 1,
    }),
  ],
  "us-361931-daimler-engine": [
    daimlerMarineEngineSourceSheetLocator({
      occurrenceKey: "edition-block-1-group-0-inline-1",
      sourcePdfPage: 1,
    }),
    daimlerMarineEngineSourceSheetLocator({
      occurrenceKey: "edition-block-2-group-0-inline-1",
      sourcePdfPage: 2,
    }),
    daimlerMarineEngineSourceSheetLocator({
      occurrenceKey: "edition-block-3-group-0-inline-1",
      sourcePdfPage: 3,
    }),
    daimlerMarineEngineSourceSheetLocator({
      occurrenceKey: "edition-block-9-group-0-inline-1",
      sourcePdfPage: 1,
    }),
    daimlerMarineEngineSourceSheetLocator({
      occurrenceKey: "edition-block-9-group-0-inline-3",
      sourcePdfPage: 2,
    }),
    daimlerMarineEngineSourceSheetLocator({
      occurrenceKey: "edition-block-9-group-0-inline-5",
      sourcePdfPage: 3,
    }),
    daimlerMarineEngineSourceSheetLocator({
      occurrenceKey: "edition-block-9-group-0-inline-7",
      sourcePdfPage: 2,
    }),
    daimlerMarineEngineSourceSheetLocator({
      occurrenceKey: "edition-block-9-group-0-inline-9",
      sourcePdfPage: 2,
    }),
    daimlerMarineEngineSourceSheetLocator({
      occurrenceKey: "edition-block-9-group-0-inline-11",
      sourcePdfPage: 2,
    }),
    daimlerMarineEngineSourceSheetLocator({
      occurrenceKey: "edition-block-9-group-0-inline-13",
      sourcePdfPage: 2,
    }),
    daimlerMarineEngineSourceSheetLocator({
      occurrenceKey: "edition-block-18-group-0-inline-1",
      sourcePdfPage: 2,
    }),
    daimlerMarineEngineSourceSheetLocator({
      occurrenceKey: "edition-block-18-group-0-inline-3",
      sourcePdfPage: 2,
    }),
  ],
  "us-608969-parsons-turbine": [
    parsonsTurbineSourceSheetLocator({
      occurrenceKey: "edition-block-18-group-0-inline-1",
      sourcePdfPage: 1,
    }),
    parsonsTurbineSourceSheetLocator({
      occurrenceKey: "edition-block-18-group-0-inline-3",
      sourcePdfPage: 2,
    }),
    parsonsTurbineSourceSheetLocator({
      occurrenceKey: "edition-block-18-group-0-inline-5",
      sourcePdfPage: 3,
    }),
    parsonsTurbineSourceSheetLocator({
      occurrenceKey: "edition-block-19-group-0-inline-1",
      sourcePdfPage: 1,
    }),
    parsonsTurbineSourceSheetLocator({
      occurrenceKey: "edition-block-24-group-0-inline-1",
      sourcePdfPage: 2,
    }),
    parsonsTurbineSourceSheetLocator({
      occurrenceKey: "edition-block-24-group-0-inline-3",
      sourcePdfPage: 2,
    }),
    parsonsTurbineSourceSheetLocator({
      occurrenceKey: "edition-block-28-group-0-inline-1",
      sourcePdfPage: 3,
    }),
  ],
  "us-x8277-mccormick-reaper": [
    mccormickReaperSourceSheetLocator({ occurrenceKey: "edition-block-1-group-0-inline-1" }),
  ],
} as const satisfies FigureOccurrenceSourceLocatorRegistry;
