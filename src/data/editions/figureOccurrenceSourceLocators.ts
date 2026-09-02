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

export const FIGURE_OCCURRENCE_SOURCE_LOCATORS = {
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
      occurrenceKey: "edition-block-54-group-0-inline-1",
      activeAsset: "/patents/figures/us-4575330-hull-stereolithography/fig-4-source-crop-v1.png",
      sourcePdfPage: 4,
    }),
    hullStereolithographyLocator({
      occurrenceKey: "edition-block-55-group-0-inline-1",
      activeAsset: "/patents/figures/us-4575330-hull-stereolithography/fig-5-source-crop-v1.png",
      sourcePdfPage: 4,
    }),
    hullStereolithographyLocator({
      occurrenceKey: "edition-block-56-group-0-inline-0",
      activeAsset: "/patents/figures/us-4575330-hull-stereolithography/fig-6-source-crop-v1.png",
      sourcePdfPage: 5,
    }),
    hullStereolithographyLocator({
      occurrenceKey: "edition-block-57-group-0-inline-0",
      activeAsset: "/patents/figures/us-4575330-hull-stereolithography/fig-7-source-crop-v1.png",
      sourcePdfPage: 5,
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
} as const satisfies FigureOccurrenceSourceLocatorRegistry;
