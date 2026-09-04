/**
 * verify-data.ts
 *
 * Data verification, schema validation, and PDF existence check for Classic Patents.
 */

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import * as fs from "node:fs";
import * as path from "node:path";
import { validateCuratedSpecificationEdition } from "../src/data/archivalEditionValidation";
import { ALL_COLORIZED_EQUATIONS } from "../src/data/colorizedEquations";
import { validateColorizedEquationCatalogue } from "../src/data/colorizedEquationValidation";
import { archivalParallelReadingsFor } from "../src/data/editions/parallelReadings";
import {
  archivalEditionForPublication,
  evaluateArchivalPublicationState,
} from "../src/data/editions/publicationApproval";
import { allPatents, searchPatents } from "../src/data/patents";
import { patentSchema } from "../src/data/patents/schema";
import {
  normalizeReviewedLedgerText,
  validateReviewedTranscription,
  validateReviewedTranscriptionPageAnchors,
  validateSourcePdfTextLayer,
} from "../src/data/patents/sourceTextValidation";
import {
  buildPatentCoverageManifest,
  hasExternalRuntimeOwner,
  type SharedBusParticipation,
  wasmSurfaceForPatent,
} from "../src/physics/coverageManifest";
import { PATENT_PHYSICS_REGISTRY } from "../src/physics/telemetryData";
import type { CuratedSpecificationBlock, CuratedSpecificationInlines } from "../src/types/patent";

const MAX_PDF_TEXT_BUFFER_BYTES = 64 * 1024 * 1024;
const BARE_DRAWING_REFERENCE = /\b(?:(?:fig(?:s)?\.?|figure)\s+\d+[a-z′′]*|division\s+\d+)\b/i;
const EXPECTED_PUBLISHED_EDITION_IDS = new Set([
  "us-x9430-colt-revolver",
  "us-x8277-mccormick-reaper",
  "us-132-davenport-electric-motor",
  "us-1647-morse-telegraph",
  "us-3633-goodyear-rubber",
  "us-4750-howe-sewing-machine",
  "us-6162-corliss-steam-engine",
  "us-6469-lincoln-buoy",
  "us-31128-otis-elevator",
  "us-78317-nobel-dynamite",
  "us-79265-sholes-typewriter",
  "us-105338-hyatt-celluloid",
  "us-120057-gramme-dynamo",
  "us-124404-westinghouse-air-brake",
  "us-1219881-sundback-zipper",
  "us-135245-pasteur-fermentation",
  "us-157124-glidden-barbed-wire",
  "us-174465-bell-telephone",
  "us-1773980-farnsworth-tv",
  "us-1781541-einstein-refrigerator",
  "us-200521-edison-phonograph",
  "us-223898-edison-lightbulb",
  "us-2292387-lamarr-frequency-hopping",
  "us-2297691-carlson-electrophotography",
  "us-2318259-sikorsky-helicopter",
  "us-233692-pelton-water-wheel",
  "us-235199-bell-photophone",
  "us-247804-delaval-separator",
  "us-307031-edison-indicator",
  "us-319596-maxim-machine-gun",
  "us-361931-daimler-engine",
  "us-381968-tesla-motor",
  "us-593138-tesla-coil",
  "us-608969-parsons-turbine",
  "us-682690-hewitt-mercury-lamp",
  "us-727650-linde-air-liquefaction",
  "us-808897-carrier-air-conditioner",
  "us-821393-wright-flyer",
  "us-879532-de-forest-audion",
  "us-942699-baekeland-bakelite",
  "us-971501-haber-ammonia",
  "us-1102653-goddard-rocket",
  "us-2495429-spencer-microwave",
  "us-2524035-bardeen-transistor",
  "us-2717437-mestral-velcro",
  "us-2846084-goertz-electronic-master-slave-manipulator",
  "us-2929922-townes-laser",
  "us-2981877-noyce-ic",
  "us-3081379-lemelson-machine-vision",
  "us-3212649-amf-versatran",
  "us-3260375-lemelson-adjustable-manipulator",
  "us-3353115-maiman-ruby-laser",
  "us-3728480-baer-odyssey",
  "us-3858232-boyle-smith-ccd",
  "us-3858581-kamen-medication-injection-device",
  "us-388850-eastman-kodak",
  "us-400766-hall-aluminium",
  "us-4063220-metcalfe-ethernet",
  "us-4341502-makino-scara",
  "us-4575330-hull-stereolithography",
  "us-4765668-robot-end-effector",
  "us-48475-yale-lock",
  "us-4921293-salisbury-robot-hand",
  "us-4976582-clavel-delta-robot",
  "us-5701965-kamen-transporter",
  "us-6285999-pagerank",
  "us-6302230-kamen-segway",
  "us-6594844-roomba",
]);

const EXPECTED_MANUAL_EDITION_GAPS = allPatents
  .filter((patent) => !EXPECTED_PUBLISHED_EDITION_IDS.has(patent.id))
  .map((patent) => patent.id);

function exactSourceTextForPdf(pdfPath: string, expectedPageCount: number): string {
  const extracted = execFileSync("pdftotext", ["-layout", pdfPath, "-"], {
    encoding: "utf8",
    maxBuffer: MAX_PDF_TEXT_BUFFER_BYTES,
  }).replace(/\r\n?/g, "\n");
  const pages = extracted.split("\f");
  if (pages.at(-1) === "") pages.pop();

  if (pages.length !== expectedPageCount) {
    throw new Error(
      `${pdfPath}: pdftotext produced ${pages.length} page(s), expected ${expectedPageCount}.`,
    );
  }

  return pages
    .map((page, index) => `--- SOURCE PDF PAGE ${index + 1} OF ${expectedPageCount} ---\n\n${page}`)
    .join("\n\n");
}

function isValidIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function authoredInlinesForBlock(block: CuratedSpecificationBlock): CuratedSpecificationInlines[] {
  switch (block.kind) {
    case "paragraph":
    case "claim":
      return [block.inlines];
    case "figure-sheet":
      return [block.description];
    case "table":
      return [...block.headers, ...block.rows.flat()];
    default:
      return [];
  }
}

function readPngDimensions(filePath: string): { width: number; height: number } | undefined {
  if (path.extname(filePath).toLowerCase() !== ".png") return undefined;

  const header = fs.readFileSync(filePath);
  const isPng =
    header.length >= 24 &&
    header.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) &&
    header.subarray(12, 16).equals(Buffer.from("IHDR"));
  if (!isPng) throw new Error("declared PNG preview does not have a valid PNG header");

  return { width: header.readUInt32BE(16), height: header.readUInt32BE(20) };
}

function sharedBusParticipationFor(
  patentId: string,
  threeVisualSources: readonly string[],
): SharedBusParticipation {
  if (hasExternalRuntimeOwner(patentId)) return "updater";
  const matchingSources = threeVisualSources.filter((source) => source.includes(patentId));
  if (matchingSources.some((source) => source.includes("registerUpdater"))) return "updater";
  if (matchingSources.some((source) => source.includes("useFrankenSimPhysics"))) return "snapshot";
  return "missing";
}

async function main() {
  console.log("=== Classic Patents Data Verification Gate ===");
  console.log(`Checking ${allPatents.length} curated historical patents...\n`);

  // Architectural Invariant Fail-Safe Gate: Pure Next.js App Router Integrity
  const pagesDir = path.join(process.cwd(), "src", "pages");
  const legacyPageSourceFiles = fs.existsSync(pagesDir)
    ? fs
        .readdirSync(pagesDir, { recursive: true, encoding: "utf8" })
        .map((entry) => String(entry))
        .filter((entry) => /\.(?:[cm]?[jt]sx?)$/.test(entry) && !entry.endsWith(".d.ts"))
    : [];
  if (legacyPageSourceFiles.length > 0) {
    console.error(
      `🚨 ARCHITECTURAL VIOLATION: legacy Pages Router source detected in src/pages: ${legacyPageSourceFiles.join(", ")}. Next.js 15 App Router apps must NOT contain a src/pages route.`,
    );
    process.exit(1);
  }

  let errorCount = 0;
  let warnCount = 0;
  let sourceTextLayerCount = 0;
  let manualEditionCount = 0;
  let physicsRegistryCount = 0;
  let equationRegistryCount = 0;
  let explicitVisualDispatchCount = 0;
  const manualEditionGaps: string[] = [];
  const visualDispatcherPath = path.join(process.cwd(), "src/components/patents/visuals/index.tsx");
  const visualDispatcherSource = fs.readFileSync(visualDispatcherPath, "utf8");
  const threeVisualDirectory = path.join(process.cwd(), "src/components/patents/visuals/three");
  const threeVisualSources = fs
    .readdirSync(threeVisualDirectory)
    .filter((filename) => filename.endsWith("3D.tsx"))
    .map((filename) => fs.readFileSync(path.join(threeVisualDirectory, filename), "utf8"));
  const physicsDirectory = path.join(process.cwd(), "src/physics");
  const runtimeOwnerSources = [
    ...threeVisualSources,
    ...fs
      .readdirSync(physicsDirectory)
      .filter((filename) => filename.endsWith("Kernel.ts"))
      .map((filename) => fs.readFileSync(path.join(physicsDirectory, filename), "utf8")),
  ];
  const genericWasmHookSource = fs.readFileSync(
    path.join(physicsDirectory, "useGenericWasmSource.ts"),
    "utf8",
  );

  const runtimeSourcesReachLoader = (
    sources: readonly string[],
    loaderFunction: string,
  ): boolean => {
    if (sources.some((source) => source.includes(loaderFunction))) return true;
    return (
      loaderFunction === "ensureGenericWasm" &&
      sources.some((source) => source.includes("useGenericWasmSource")) &&
      genericWasmHookSource.includes(loaderFunction)
    );
  };

  const equationSerialization = validateColorizedEquationCatalogue(ALL_COLORIZED_EQUATIONS);
  for (const error of equationSerialization.errors) {
    console.error(`❌ Colorized-equation transport contract: ${error}`);
    errorCount++;
  }

  for (const patent of allPatents) {
    const prefix = `[${patent.patentNumber} - ${patent.id}]`;
    let patentErrorCount = 0;
    let publishedManualEdition = false;
    const fail = (message: string) => {
      console.error(`❌ ${prefix} ${message}`);
      errorCount++;
      patentErrorCount++;
    };

    // Editorial calibration (root decision, 2026-08-22): completeness-class
    // gaps are tracked warnings, never publication blockers. Fabrication,
    // identity, and structural checks below still call fail().
    const warn = (message: string) => {
      console.warn(`⚠️  ${prefix} ${message}`);
      warnCount++;
    };

    const schemaResult = patentSchema.safeParse(patent);
    if (!schemaResult.success) {
      const issue = schemaResult.error.issues[0];
      fail(`Zod ${issue?.path.join(".") || "(root)"}: ${issue?.message ?? "invalid record"}`);
    }

    // 1. Check basic identity
    if (!patent.id || !patent.patentNumber || !patent.title || !patent.shortTitle) {
      fail("Missing essential identification metadata.");
    }

    // 2. Check dates
    if (
      !isValidIsoDate(patent.grantDate) ||
      (patent.filingDate !== null && !isValidIsoDate(patent.filingDate))
    ) {
      fail(
        `Invalid date (expected a real YYYY-MM-DD, or a documented null filing date). Grant: ${patent.grantDate}, Filing: ${patent.filingDate}`,
      );
    } else if (patent.filingDate && patent.filingDate > patent.grantDate) {
      fail(`Filing date ${patent.filingDate} is after grant date ${patent.grantDate}.`);
    }

    // 3. Check inventors
    if (!patent.inventors || patent.inventors.length === 0) {
      fail("No inventors specified.");
    }

    if (path.posix.basename(patent.originalPdfUrl) !== `${patent.id}.pdf`) {
      fail(`originalPdfUrl must name ${patent.id}.pdf; received ${patent.originalPdfUrl}.`);
    }

    // 4. Check PDF presence in public/
    const localPdfPath = path.join(
      process.cwd(),
      "public",
      patent.originalPdfUrl.replace(/^\//, ""),
    );
    let pdfSizeBytes: number | undefined;
    if (!fs.existsSync(localPdfPath)) {
      fail(`Local PDF not found at ${localPdfPath}`);
    } else {
      const stats = fs.statSync(localPdfPath);
      pdfSizeBytes = stats.size;
      if (stats.size < 1000) {
        fail(`Local PDF too small (${stats.size} bytes).`);
      }
    }

    // 5. Check claims
    const noFormalClaims =
      patent.archivalEdition?.claimStatus?.kind === "no-formal-claims-in-facsimile" ||
      (patent.claims.length === 0 && patent.stats?.totalClaims === 0 && !patent.archivalEdition);
    if (!patent.claims || patent.claims.length === 0) {
      if (!noFormalClaims) {
        fail("No claims found and no reviewed-facsimile no-formal-claims attestation exists.");
      }
    } else {
      if (noFormalClaims) {
        fail("Claims conflict with the reviewed-facsimile no-formal-claims attestation.");
      }
      const independentClaims = patent.claims.filter((c) => c.isIndependent);
      if (independentClaims.length === 0) {
        fail("Patent has no independent claims.");
      }
      const claimNumbers = new Set(patent.claims.map((claim) => claim.number));
      if (claimNumbers.size !== patent.claims.length) fail("Duplicate claim numbers found.");
      for (const claim of patent.claims) {
        if (!claim.number || !claim.originalText || !claim.plainEnglish) {
          fail(`Claim #${claim.number} missing originalText or plainEnglish explanation.`);
        }
        for (const dependency of claim.dependsOn ?? []) {
          if (!claimNumbers.has(dependency)) {
            fail(`Claim #${claim.number} depends on missing claim #${dependency}.`);
          }
        }
      }
    }

    // 6. Check stats consistency with claims
    const indClaims = patent.claims.filter((c) => c.isIndependent);
    if (patent.stats) {
      if (patent.stats.totalClaims !== patent.claims.length) {
        fail(
          `stats.totalClaims (${patent.stats.totalClaims}) does not match claims.length (${patent.claims.length}).`,
        );
      }
      if (patent.stats.independentClaims !== indClaims.length) {
        fail(
          `stats.independentClaims (${patent.stats.independentClaims}) does not match independent claims count (${indClaims.length}).`,
        );
      }
    }

    // 7. Check raw source-comparison assets. A machine text layer is never a
    // public complete edition, even if it is mechanically complete.
    if (patent.originalTextAsset) {
      sourceTextLayerCount++;
      const assetPath = path.join(
        process.cwd(),
        "public",
        patent.originalTextAsset.url.replace(/^\//, ""),
      );
      if (!fs.existsSync(assetPath)) {
        fail(`originalTextAsset file not found at ${assetPath}`);
      } else {
        const assetStat = fs.statSync(assetPath);
        if (assetStat.size === 0) {
          fail(`originalTextAsset file at ${assetPath} is empty.`);
        }
      }
      if (patent.originalTextAsset.pageCount <= 0) {
        fail(`originalTextAsset.pageCount must be > 0.`);
      }
      if (!patent.originalTextAsset.kind) {
        fail("originalTextAsset.kind is required before an asset may be shown as complete.");
      }
      if (patent.originalTextAsset.kind === "source-pdf-text-layer" && fs.existsSync(assetPath)) {
        const sourceText = fs.readFileSync(assetPath, "utf8");
        const validation = validateSourcePdfTextLayer(
          sourceText,
          patent.originalTextAsset.pageCount,
        );
        if (!validation.valid) fail(validation.error ?? "source-PDF text layer is invalid.");
        if (fs.existsSync(localPdfPath)) {
          try {
            const expectedSourceText = exactSourceTextForPdf(
              localPdfPath,
              patent.originalTextAsset.pageCount,
            );
            if (sourceText !== expectedSourceText) {
              fail(
                "source-PDF text layer differs from deterministic pdftotext extraction; publish editorial corrections only as a separately reviewed transcription.",
              );
            }
          } catch (error: unknown) {
            const message = error instanceof Error ? error.message : String(error);
            fail(`could not regenerate source-PDF text layer: ${message}`);
          }
        }
      }
      if (patent.originalTextAsset.kind === "reviewed-transcription" && fs.existsSync(assetPath)) {
        const reviewedText = fs.readFileSync(assetPath, "utf8");
        const validation = validateReviewedTranscription(
          reviewedText,
          patent.originalTextAsset.pageCount,
        );
        if (!validation.valid) warn(validation.error ?? "reviewed transcription is invalid.");
        if (patent.originalTextAsset.sourcePdfSha256 && fs.existsSync(localPdfPath)) {
          const sourcePdfSha256 = createHash("sha256")
            .update(fs.readFileSync(localPdfPath))
            .digest("hex");
          if (sourcePdfSha256 !== patent.originalTextAsset.sourcePdfSha256) {
            fail("reviewed transcription sourcePdfSha256 does not match the local PDF.");
          }
        }
      }
    }

    // 8. A manual React edition may earn its fuller editorial-publication
    // designation only after its companion map and acceptance checks. That
    // designation is not a reader gate: every patent still exposes its authored
    // edition or complete reviewed ledger on the Original Patent Text face.
    const archivalEdition = archivalEditionForPublication(patent);
    if (archivalEdition) {
      publishedManualEdition = true;
      manualEditionCount++;
      const editionValidation = validateCuratedSpecificationEdition(archivalEdition);
      if (!editionValidation.valid) {
        fail(`manual archival edition: ${editionValidation.errors.join(" ")}`);
      }
      if (fs.existsSync(localPdfPath)) {
        const sourcePdfSha256 = createHash("sha256")
          .update(fs.readFileSync(localPdfPath))
          .digest("hex");
        if (sourcePdfSha256 !== archivalEdition.sourcePdfSha256) {
          fail("manual archival edition sourcePdfSha256 does not match the local PDF.");
        }
      }

      const editionClaims = archivalEdition.blocks.filter((block) => block.kind === "claim");
      const editionClaimNumbers = editionClaims.map((claim) => claim.number);
      const catalogClaimNumbers = patent.claims.map((claim) => claim.number);
      if (
        editionClaimNumbers.length !== catalogClaimNumbers.length ||
        editionClaimNumbers.some((number, index) => number !== catalogClaimNumbers[index])
      ) {
        fail("manual archival edition claim numbers do not exactly match the claim decoder.");
      }
      for (const editionClaim of editionClaims) {
        const decoderClaim = patent.claims.find((claim) => claim.number === editionClaim.number);
        const editionText = editionClaim.inlines.map((inline) => inline.text).join("");
        if (!decoderClaim || decoderClaim.originalText !== editionText) {
          fail(`Claim #${editionClaim.number} differs from the manual archival edition.`);
        }
      }

      const reviewedAsset = patent.originalTextAsset;
      if (reviewedAsset?.kind !== "reviewed-transcription") {
        fail("manual archival edition requires a reviewed-transcription ledger for claim parity.");
      } else {
        const reviewedLedgerPath = path.join(
          process.cwd(),
          "public",
          reviewedAsset.url.replace(/^\//, ""),
        );
        if (!fs.existsSync(reviewedLedgerPath)) {
          fail(
            "manual archival edition reviewed-transcription ledger is missing for claim parity.",
          );
        } else {
          const normalizedLedger = normalizeReviewedLedgerText(
            fs.readFileSync(reviewedLedgerPath, "utf8"),
          );
          if (reviewedAsset.pageAnchors) {
            const pageAnchorValidation = validateReviewedTranscriptionPageAnchors(
              fs.readFileSync(reviewedLedgerPath, "utf8"),
              reviewedAsset.pageCount,
              reviewedAsset.pageAnchors,
            );
            if (!pageAnchorValidation.valid) {
              warn(
                pageAnchorValidation.error ??
                  "manual reviewed-transcription page-anchor evidence is invalid.",
              );
            }
          }
          for (const claim of patent.claims) {
            if (!normalizedLedger.includes(normalizeReviewedLedgerText(claim.originalText))) {
              warn(`Claim #${claim.number} is absent from the reviewed-transcription ledger.`);
            }
          }
        }
      }

      try {
        const readings = archivalParallelReadingsFor(patent.id);
        const paragraphIndexes = archivalEdition.blocks.flatMap((block, index) =>
          block.kind === "paragraph" ? [index] : [],
        );
        const readingIndexes = Object.keys(readings)
          .map(Number)
          .sort((left, right) => left - right);
        if (JSON.stringify(readingIndexes) !== JSON.stringify(paragraphIndexes)) {
          warn(
            `manual parallel readings must cover exactly the rendered source paragraphs; expected [${paragraphIndexes.join(", ")}], received [${readingIndexes.join(", ")}].`,
          );
        }
        for (const [index, reading] of Object.entries(readings)) {
          if (reading.length === 0 || reading.some((paragraph) => !paragraph.trim())) {
            warn(`manual parallel reading for source paragraph ${index} is empty.`);
          }
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        warn(`manual parallel reading registry: ${message}`);
      }

      for (const block of archivalEdition.blocks) {
        for (const inlines of authoredInlinesForBlock(block)) {
          for (const inline of inlines) {
            if (inline.kind === "text" && BARE_DRAWING_REFERENCE.test(inline.text)) {
              warn(
                `manual archival edition leaves a drawing reference as inert prose: ${inline.text.match(BARE_DRAWING_REFERENCE)?.[0] ?? inline.text}.`,
              );
              continue;
            }
            if (inline.kind !== "reference" || inline.referenceType !== "figure") continue;
            if (!inline.figurePreviews?.length) {
              warn(`figure reference ${inline.text} has no authored local preview.`);
              continue;
            }
            for (const preview of inline.figurePreviews) {
              if (
                !preview.src.startsWith(`/patents/figures/${patent.id}-`) &&
                !preview.src.startsWith(`/patents/figures/${patent.id}/`)
              ) {
                fail(`figure reference ${inline.text} preview is not patent-local: ${preview.src}`);
                continue;
              }
              const previewPath = path.join(
                process.cwd(),
                "public",
                preview.src.replace(/^\//, ""),
              );
              if (!fs.existsSync(previewPath)) {
                warn(`figure reference ${inline.text} preview file not found at ${previewPath}`);
                continue;
              }
              if (fs.statSync(previewPath).size === 0) {
                warn(`figure reference ${inline.text} preview file is empty: ${previewPath}`);
                continue;
              }
              try {
                const dimensions = readPngDimensions(previewPath);
                if (
                  dimensions &&
                  (dimensions.width !== preview.width || dimensions.height !== preview.height)
                ) {
                  warn(
                    `figure reference ${inline.text} preview dimensions are ${dimensions.width}×${dimensions.height}, not the authored ${preview.width}×${preview.height}.`,
                  );
                }
              } catch (error: unknown) {
                const message = error instanceof Error ? error.message : String(error);
                fail(`figure reference ${inline.text} preview is invalid: ${message}`);
              }
            }
          }
        }
      }
    } else {
      manualEditionGaps.push(patent.id);
      console.warn(
        patent.archivalEdition
          ? patent.archivalEdition.completeFacsimileReviewed !== true
            ? `⚠️  ${prefix} The stored patent text remains visible; its archival edition has not passed full-facsimile review.`
            : `⚠️  ${prefix} The authored patent text remains visible; its richer editorial companion map is still in preparation.`
          : `⚠️  ${prefix} No structured edition is registered; the complete reviewed transcript remains visible.`,
      );
    }

    // 9. Check drawing callout coordinate bounds
    for (const drawing of patent.drawings ?? []) {
      for (const callout of drawing.callouts ?? []) {
        if (callout.x < 0 || callout.x > 100 || callout.y < 0 || callout.y > 100) {
          fail(
            `Drawing ${drawing.figureNumber} callout ${callout.id} coordinates (${callout.x}, ${callout.y}) out of [0, 100] bounds.`,
          );
        }
      }
    }

    // 10. Check plain English explanations
    if (
      !patent.plainEnglishExplanation?.overview ||
      !patent.plainEnglishExplanation.coreMechanism ||
      patent.plainEnglishExplanation.mechanicalBreakdown.length === 0
    ) {
      fail("Incomplete plain English explanation.");
    }

    // 11. Check historical context & patent wars
    if (
      !patent.historicalContext?.problemStatement ||
      !patent.historicalContext.breakthroughInsight ||
      !Array.isArray(patent.historicalContext.patentWars)
    ) {
      fail("Incomplete historical context or patent wars record.");
    }

    // 12. Executable vertical-slice coverage. These checks bind the catalogue
    // identity to the actual visual dispatcher, SI telemetry owner, and live
    // equation registry instead of inferring completion from file presence.
    if (visualDispatcherSource.includes(`case "${patent.id}":`)) {
      explicitVisualDispatchCount++;
    } else {
      fail("Missing explicit patent-id case in the interactive visual dispatcher.");
    }

    const physics = PATENT_PHYSICS_REGISTRY[patent.id];
    if (!physics) {
      fail("Missing PATENT_PHYSICS_REGISTRY owner.");
    } else {
      physicsRegistryCount++;
      const defaultControls = Object.fromEntries(
        physics.controls.map((control) => [control.id, control.defaultValue]),
      );
      try {
        const metrics = physics.computeMetrics(defaultControls);
        if (metrics.length === 0) {
          fail("Physics owner returned no default telemetry metrics.");
        }
        for (const metric of metrics) {
          if (
            !metric.label.trim() ||
            !metric.value.trim() ||
            /(?:NaN|Infinity|undefined)/.test(metric.value)
          ) {
            fail(`Physics owner returned malformed default telemetry: ${JSON.stringify(metric)}.`);
          }
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        fail(`Physics owner refused its admitted defaults: ${message}`);
      }
    }

    const equations = ALL_COLORIZED_EQUATIONS[patent.id];
    if (!equations?.length) {
      fail("Missing live colorized-equation registry entry.");
    } else {
      equationRegistryCount++;
    }

    if (patentErrorCount === 0 && pdfSizeBytes !== undefined) {
      console.log(
        publishedManualEdition
          ? `✓ ${prefix} Passed integrity and published-manual-edition gates (PDF verified: ${(pdfSizeBytes / 1024).toFixed(1)} KB).`
          : `✓ ${prefix} Passed catalog/source-integrity gates; complete source text remains visible (PDF verified: ${(pdfSizeBytes / 1024).toFixed(1)} KB).`,
      );
    } else {
      console.error(`✗ ${prefix} Failed ${patentErrorCount} verification gate(s).`);
    }
  }

  const coverageManifest = buildPatentCoverageManifest(allPatents, {
    assetExists: (publicUrl) =>
      fs.existsSync(path.join(process.cwd(), "public", publicUrl.replace(/^\//, ""))),
    isEditionPublished: (patent) => Boolean(archivalEditionForPublication(patent)),
    publicationDecision: evaluateArchivalPublicationState,
    hasVisualDispatch: (patentId) => visualDispatcherSource.includes(`case "${patentId}":`),
    hasTelemetryOwner: (patentId) => Boolean(PATENT_PHYSICS_REGISTRY[patentId]),
    hasEquationSet: (patentId) => Boolean(ALL_COLORIZED_EQUATIONS[patentId]?.length),
    sharedBusParticipation: (patentId) => sharedBusParticipationFor(patentId, threeVisualSources),
  });
  const manifestIds = new Set(coverageManifest.map((row) => row.patentId));
  if (coverageManifest.length !== allPatents.length || manifestIds.size !== allPatents.length) {
    console.error(
      `❌ Coverage manifest must contain exactly one row for each catalogue id; received ${coverageManifest.length} row(s) and ${manifestIds.size} unique id(s) for ${allPatents.length} patents.`,
    );
    errorCount++;
  }

  const wasmArtifacts = new Map<string, { expectedSha256: string; patentIds: string[] }>();
  for (const row of coverageManifest) {
    if (
      !row.source.pinnedFacsimile ||
      !row.presentation.explicitVisualDispatch ||
      row.presentation.defaultTelemetryOwner === "missing" ||
      !row.presentation.liveEquationSet
    ) {
      console.error(
        `❌ [${row.patentId}] Incomplete executable coverage row: ${JSON.stringify(row)}.`,
      );
      errorCount++;
    }
    if (row.runtime.sharedBus === "missing") {
      console.error(
        `❌ [${row.patentId}] 3D visual does not publish or subscribe to the shared telemetry bus.`,
      );
      errorCount++;
    }
    if (row.runtime.wasmSurface !== "none") {
      if (!row.runtime.wasmArtifactPresent || !row.runtime.wasmArtifactUrl) {
        console.error(
          `❌ [${row.patentId}] Declared ${row.runtime.wasmSurface} surface has no shipped artifact.`,
        );
        errorCount++;
        continue;
      }
      const descriptor = wasmSurfaceForPatent(row.patentId);
      if (!descriptor) {
        console.error(`❌ [${row.patentId}] WASM surface is missing its descriptor.`);
        errorCount++;
        continue;
      }
      const matchingRuntimeSources = runtimeOwnerSources.filter((source) =>
        source.includes(row.patentId),
      );
      if (!runtimeSourcesReachLoader(matchingRuntimeSources, descriptor.loaderFunction)) {
        console.error(
          `❌ [${row.patentId}] Declares ${descriptor.sourceCrate}, but its active visual/kernel owner does not call ${descriptor.loaderFunction}.`,
        );
        errorCount++;
      }
      const existing = wasmArtifacts.get(descriptor.artifactUrl);
      if (existing) {
        existing.patentIds.push(row.patentId);
      } else {
        wasmArtifacts.set(descriptor.artifactUrl, {
          expectedSha256: descriptor.artifactSha256,
          patentIds: [row.patentId],
        });
      }
    }
  }

  for (const [artifactUrl, descriptor] of wasmArtifacts) {
    const artifactPath = path.join(process.cwd(), "public", artifactUrl.replace(/^\//, ""));
    const actualSha256 = createHash("sha256").update(fs.readFileSync(artifactPath)).digest("hex");
    if (actualSha256 !== descriptor.expectedSha256) {
      console.error(
        `❌ WASM artifact ${artifactUrl} changed for ${descriptor.patentIds.join(", ")}: expected ${descriptor.expectedSha256}, received ${actualSha256}.`,
      );
      errorCount++;
    }
  }

  const wasmSurfaceCounts = Object.groupBy(coverageManifest, (row) => row.runtime.wasmSurface);
  const sharedBusCounts = Object.groupBy(coverageManifest, (row) => row.runtime.sharedBus);

  const actualManualEditionGaps = [...manualEditionGaps].sort();
  const expectedManualEditionGaps = [...EXPECTED_MANUAL_EDITION_GAPS].sort();
  if (JSON.stringify(actualManualEditionGaps) !== JSON.stringify(expectedManualEditionGaps)) {
    console.error(
      `❌ Published manual-edition coverage changed without updating the reviewed coverage contract. Expected gaps: ${expectedManualEditionGaps.join(", ") || "(none)"}. Actual gaps: ${actualManualEditionGaps.join(", ") || "(none)"}.`,
    );
    errorCount++;
  }

  // 13. Check chronological ordering of allPatents
  for (let i = 1; i < allPatents.length; i++) {
    if (allPatents[i].grantDate < allPatents[i - 1].grantDate) {
      console.error(
        `❌ Chronological ordering error: ${allPatents[i].id} (${allPatents[i].grantDate}) precedes ${allPatents[i - 1].id} (${allPatents[i - 1].grantDate})`,
      );
      errorCount++;
    }
  }

  // 14. Test search queries
  const testQueries = ["Tesla", "Wright", "821,393", "Transistor", "Kevlar", "Noyce", "Wozniak"];
  for (const q of testQueries) {
    const results = searchPatents(q);
    if (results.length === 0) {
      console.error(`❌ Search query "${q}" returned 0 results.`);
      errorCount++;
    }
  }

  console.log(
    `\nManual archival-edition coverage: ${manualEditionCount}/${allPatents.length}; raw source comparison layers: ${sourceTextLayerCount}/${allPatents.length}.`,
  );
  console.log(
    `Executable vertical slices: ${explicitVisualDispatchCount}/${allPatents.length} explicit visual routes; ${physicsRegistryCount}/${allPatents.length} default-stepping SI telemetry owners; ${equationRegistryCount}/${allPatents.length} live equation sets.`,
  );
  console.log(
    `Runtime ownership: ${wasmSurfaceCounts["patent-specific-wasm"]?.length ?? 0} patent-specific WASM surface; ${wasmSurfaceCounts["interpretive-wasm"]?.length ?? 0} dedicated interpretive WASM surfaces; ${wasmSurfaceCounts["generic-wasm"]?.length ?? 0} generic WASM consumers; ${wasmSurfaceCounts.none?.length ?? 0} typed-host-only records. Shared bus: ${sharedBusCounts.updater?.length ?? 0} updaters; ${sharedBusCounts.snapshot?.length ?? 0} typed snapshots; ${sharedBusCounts.missing?.length ?? 0} honest placeholders.`,
  );
  if (manualEditionGaps.length > 0) {
    console.warn(
      `Editorial companion preparation remains for: ${manualEditionGaps.join(", ")}. Complete source text remains visible.`,
    );
  }
  console.log(
    `Verification Result: ${
      errorCount === 0
        ? `ALL SOFTWARE AND PUBLISHED-ASSET CHECKS PASSED${warnCount > 0 ? ` (${warnCount} tracked imperfection warning(s))` : ""}; ${manualEditionCount}/${allPatents.length} MANUAL ARCHIVAL EDITIONS PUBLISHED`
        : `${errorCount} ERRORS FOUND`
    }`,
  );

  if (errorCount > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Verification failed with exception:", err);
  process.exit(1);
});
