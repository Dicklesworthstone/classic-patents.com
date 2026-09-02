import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { hallAluminiumPatent } from "@/data/patents/hall-aluminium";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";
import type { CuratedSpecificationEdition } from "@/types/patent";
import {
  HALL_ALUMINIUM_PARALLEL_READINGS,
  hallAluminiumArchivalEdition,
  manualHallClaimText,
} from "./hallAluminiumEdition";

describe("Charles Martin Hall US 400,766 Archival Edition Contract", () => {
  const rootDir = process.cwd();
  const expectedSha256 = "8a9cda34caaa0426bc62d75ca3910cab636c9f0329cb2f6193019c95c5d94791";

  test("pins the immutable source PDF and matches SHA-256 digest", () => {
    const pdfPath = resolve(rootDir, "public/patents/pdfs/us-400766-hall-aluminium.pdf");
    expect(existsSync(pdfPath)).toBe(true);

    const fileBuffer = readFileSync(pdfPath);
    const actualSha256 = createHash("sha256").update(fileBuffer).digest("hex");
    expect(actualSha256).toBe(expectedSha256);
    expect(hallAluminiumArchivalEdition.sourcePdfSha256).toBe(expectedSha256);
  });

  test("publishes the candidate edition and validates its curated structure", () => {
    const validation = validateCuratedSpecificationEdition(
      hallAluminiumArchivalEdition as unknown as CuratedSpecificationEdition,
      { requireCompleteFacsimileReview: false },
    );
    expect(validation.valid).toBe(true);
    expect(validation.errors).toEqual([]);
    expect(hallAluminiumArchivalEdition.completeFacsimileReviewed).toBe(false);
  });

  test("keeps every authored source block verbatim in the reviewed transcript ledger", () => {
    const ledger = readFileSync(
      resolve(rootDir, "public/patents/transcripts/us-400766-hall-aluminium-reviewed.txt"),
      "utf8",
    );
    expect(validateReviewedTranscription(ledger, 3)).toEqual({ valid: true });
    const normalizedLedger = ledger.replace(/\s+/g, " ").trim();
    for (const block of hallAluminiumArchivalEdition.blocks) {
      if (block.kind !== "paragraph" && block.kind !== "claim") continue;
      const sourceText = block.inlines
        .map((inline) => inline.text)
        .join("")
        .replace(/\s+/g, " ")
        .trim();
      expect(normalizedLedger).toContain(sourceText);
    }
  });

  test("preserves superseded v1 crops while publishing the v2 figure previews", () => {
    const figures = [
      {
        path: "public/patents/figures/us-400766-hall-aluminium/fig-1-source-crop-v1.png",
        width: 1630,
        height: 1360,
      },
      {
        path: "public/patents/figures/us-400766-hall-aluminium/fig-2-source-crop-v1.png",
        width: 1500,
        height: 960,
      },
    ];

    for (const fig of figures) {
      const fullPath = resolve(rootDir, fig.path);
      expect(existsSync(fullPath)).toBe(true);
    }
    expect(hallAluminiumPatent.archivalEdition).toBe(hallAluminiumArchivalEdition);
    const figureReferences = hallAluminiumArchivalEdition.blocks.flatMap((block) => {
      const inlines = block.kind === "paragraph" ? block.inlines : [];
      return inlines.flatMap((inline) =>
        inline.kind === "reference" && inline.referenceType === "figure" ? [inline] : [],
      );
    });
    expect(figureReferences.length).toBeGreaterThan(0);
    expect(
      figureReferences.every((reference) =>
        reference.figurePreviews?.every((preview: { src: string }) =>
          /-v2\.png$/.test(preview.src),
        ),
      ),
    ).toBe(true);
  });

  test("confirms reviewed transcript ledger exists and contains page markers", () => {
    const transcriptPath = resolve(
      rootDir,
      "public/patents/transcripts/us-400766-hall-aluminium-reviewed.txt",
    );
    expect(existsSync(transcriptPath)).toBe(true);

    const content = readFileSync(transcriptPath, "utf8");
    expect(content).toContain("--- REVIEWED TRANSCRIPTION PAGE 1 OF 3 ---");
    expect(content).toContain("--- REVIEWED TRANSCRIPTION PAGE 2 OF 3 ---");
    expect(content).toContain("--- REVIEWED TRANSCRIPTION PAGE 3 OF 3 ---");
    // The reviewed ledger is raw OCR text; punctuation noise around the
    // inventor name varies, so match the name modulo quote/period/underscore.
    expect(content.replace(/['._]/g, "")).toContain("CHARLES M HALL");
    expect(content).toContain("400,766");
  });

  test("exposes all printed claims via dynamic single-source lookup", () => {
    const claim1 = manualHallClaimText(1);
    expect(claim1).toContain(
      "1. As an improvement in the art of manufacturing aluminium, the herein-described process, which consists in dissolving alumina in a fused bath composed of the fluorides of aluminium and a metal more electro-positive than aluminium",
    );

    const claim2 = manualHallClaimText(2);
    expect(claim2).toContain(
      "2. As an improvement in the art of manufacturing aluminium, the herein-described process, which consists in dissolving alumina in a fused bath composed of the fluorides of aluminium and sodium",
    );

    const claim3 = manualHallClaimText(3);
    expect(claim3).toContain(
      "3. As an improvement in the art of manufacturing aluminium, the herein-described process, which consists in dissolving alumina in a fused bath composed of the fluorides of aluminium, sodium, and lithium",
    );
    expect(hallAluminiumPatent.claims.map((claim) => claim.number)).toEqual([1, 2, 3]);
    expect(hallAluminiumPatent.claims.map((claim) => claim.originalText)).toEqual([
      manualHallClaimText(1),
      manualHallClaimText(2),
      manualHallClaimText(3),
    ]);
    expect(hallAluminiumPatent.stats).toMatchObject({ totalClaims: 3, independentClaims: 3 });
  });

  test("validates parallel readings map covers the archival blocks", () => {
    const keys = Object.keys(HALL_ALUMINIUM_PARALLEL_READINGS).map(Number);
    expect(keys.length).toBeGreaterThanOrEqual(10);

    const paragraphIndexes = hallAluminiumArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );

    expect(keys.sort((a, b) => a - b)).toEqual(paragraphIndexes.sort((a, b) => a - b));

    for (const key of keys) {
      const block = hallAluminiumArchivalEdition.blocks[key];
      expect(block).toBeDefined();
      expect(block.kind).toBe("paragraph");
      const reading = HALL_ALUMINIUM_PARALLEL_READINGS[key];
      expect(reading).toBeDefined();
      expect(reading.length).toBeGreaterThan(0);
      expect(reading[0].trim().length).toBeGreaterThan(20);
    }
  });

  test("provides valid provenance classifications for all Hall Aluminium controls and metrics", () => {
    const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
    const entry = PATENT_PHYSICS_REGISTRY["us-400766-hall-aluminium"];
    expect(entry).toBeDefined();
    for (const ctrl of entry.controls) {
      expect(ctrl.provenance).toBe("scenario-modern");
    }
    const metrics = entry.computeMetrics({});
    for (const m of metrics) {
      expect(m.provenance).toBe("scenario-modern");
    }
  });

  test("enforces figure acceptance pending audit hold in publication state registry", () => {
    const { evaluateTypedArchivalPublicationState } = require("./archivalPublicationState");
    const decision = evaluateTypedArchivalPublicationState(hallAluminiumPatent, {
      hasCompanionReadings: true,
    });
    expect(decision.isPublished).toBe(false);
    expect(decision.state.kind).toBe("candidate");
    expect(decision.reasonCode).toBe("AUDIT_FIGURE_ACCEPTANCE_PENDING");
  });
});
