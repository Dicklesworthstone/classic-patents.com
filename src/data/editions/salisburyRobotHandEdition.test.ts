import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { salisburyRobotHandPatent } from "@/data/patents/salisbury-robot-hand";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";
import {
  salisburyRobotHandArchivalEdition,
  salisburyRobotHandParallelReadings,
} from "./salisburyRobotHandEdition";

const normalizeSourceText = (value: string) => value.replace(/\s+/g, " ").trim();

describe("US 4,921,293 Salisbury & Ruoff Multi-Fingered Robotic Hand manual source edition", () => {
  test("pins the ten-page Salisbury facsimile, filing date, and all nine printed claims", () => {
    expect(salisburyRobotHandPatent.archivalEdition).toBe(salisburyRobotHandArchivalEdition);
    expect(salisburyRobotHandPatent.filingDate).toBe("1984-12-12");
    expect(salisburyRobotHandPatent.grantDate).toBe("1990-05-01");
    expect(salisburyRobotHandArchivalEdition.sourcePdfSha256).toBe(
      "a630e3a6c5e3bee141740ed3de4d315ea4ded7f525d5db8f8c4f9605af52fbed",
    );
    expect(validateCuratedSpecificationEdition(salisburyRobotHandArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    const pdf = readFileSync(`${process.cwd()}/public${salisburyRobotHandPatent.originalPdfUrl}`);
    expect(createHash("sha256").update(pdf).digest("hex")).toBe(
      salisburyRobotHandArchivalEdition.sourcePdfSha256,
    );
    expect(salisburyRobotHandPatent.claims.map((claim) => claim.number)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9,
    ]);
    expect(salisburyRobotHandPatent.stats).toMatchObject({ totalClaims: 9, independentClaims: 2 });
  });

  test("keeps the typed legal claims exactly synchronized with the public decoders", () => {
    const authoredClaims = salisburyRobotHandArchivalEdition.blocks.filter(
      (
        block,
      ): block is Extract<
        (typeof salisburyRobotHandArchivalEdition.blocks)[number],
        { kind: "claim" }
      > => block.kind === "claim",
    );
    expect(salisburyRobotHandPatent.claims.map((claim) => claim.originalText)).toEqual(
      authoredClaims.map((claim) => claim.inlines.map((inline) => inline.text).join("")),
    );
    for (const claim of salisburyRobotHandPatent.claims) {
      expect(claim.plainEnglish.split(/\s+/).length).toBeGreaterThan(30);
      expect(claim.keyInnovations).not.toHaveLength(0);
    }
  });

  test("uses an authored local source crop for every printed figure citation", () => {
    const references = salisburyRobotHandArchivalEdition.blocks.flatMap((block) =>
      "inlines" in block
        ? block.inlines.filter(
            (inline): inline is Extract<(typeof block.inlines)[number], { kind: "reference" }> =>
              inline.kind === "reference" && inline.referenceType === "figure",
          )
        : [],
    );
    expect(references).not.toHaveLength(0);
    for (const reference of references) {
      expect(reference.figurePreviews?.length).toBeGreaterThan(0);
      for (const preview of reference.figurePreviews ?? []) {
        expect(preview.src).toStartWith("/patents/figures/us-4921293-salisbury-robot-hand/");
        expect(existsSync(resolve(process.cwd(), "public", preview.src.slice(1)))).toBe(true);
      }
    }

    expect(
      new Set(references.flatMap((reference) => reference.figurePreviews?.map((p) => p.src))),
    ).toEqual(
      new Set(
        Array.from(
          { length: 7 },
          (_, index) =>
            `/patents/figures/us-4921293-salisbury-robot-hand/fig-${index + 1}-source-crop-v1.png`,
        ),
      ),
    );

    const unauthoredFigureCitations = salisburyRobotHandArchivalEdition.blocks.flatMap((block) =>
      "inlines" in block
        ? block.inlines.filter(
            (inline) => inline.kind !== "reference" && /\bFIGS?\./.test(inline.text),
          )
        : [],
    );
    expect(unauthoredFigureCitations).toEqual([]);
  });

  test("contains parallel readings for every paragraph index", () => {
    const paragraphIndices = salisburyRobotHandArchivalEdition.blocks
      .map((block, idx) => (block.kind === "paragraph" ? idx : null))
      .filter((idx): idx is number => idx !== null);

    for (const idx of paragraphIndices) {
      const reading = salisburyRobotHandParallelReadings[idx];
      expect(reading).toBeDefined();
      expect(reading?.join(" ").length).toBeGreaterThan(40);
    }
  });

  test("validates the reviewed transcription ledger across all 10 pages", () => {
    const ledger = readFileSync(
      `${process.cwd()}/public/patents/transcripts/us-4921293-salisbury-robot-hand-reviewed.txt`,
      "utf8",
    );
    const result = validateReviewedTranscription(ledger, 10);
    expect(result.valid).toBe(true);

    const normalizedLedger = normalizeSourceText(ledger);
    for (const block of salisburyRobotHandArchivalEdition.blocks) {
      if (block.kind === "masthead") {
        for (const line of block.lines) {
          expect(normalizedLedger).toContain(normalizeSourceText(line));
        }
      } else if (block.kind === "heading") {
        expect(normalizedLedger).toContain(normalizeSourceText(block.text));
      } else if (block.kind === "paragraph" || block.kind === "claim") {
        expect(normalizedLedger).toContain(
          normalizeSourceText(block.inlines.map((inline) => inline.text).join("")),
        );
      } else if (block.kind === "equation") {
        expect(normalizedLedger).toContain(normalizeSourceText(block.text));
      }
    }

    expect(JSON.stringify(salisburyRobotHandArchivalEdition)).not.toContain(
      "--- REVIEWED TRANSCRIPTION PAGE",
    );
    expect(JSON.stringify(salisburyRobotHandArchivalEdition)).not.toContain("Drawing sheet");
  });

  test("publishes only reviewed source text and source-bounded annotations", () => {
    expect(salisburyRobotHandPatent.originalTextAsset).toEqual({
      url: "/patents/transcripts/us-4921293-salisbury-robot-hand-reviewed.txt",
      pageCount: 10,
      kind: "reviewed-transcription",
      reviewedBy: "Classic Patents editorial agent (GPT-5.6)",
      reviewedAt: "2026-09-01",
      sourcePdfSha256: salisburyRobotHandArchivalEdition.sourcePdfSha256,
    });

    const terms = salisburyRobotHandArchivalEdition.blocks.flatMap((block) =>
      "inlines" in block ? block.inlines.filter((inline) => inline.kind === "term") : [],
    );
    expect(terms.length).toBeGreaterThanOrEqual(6);
    for (const annotation of terms) {
      expect(annotation.definition.length).toBeGreaterThan(80);
    }

    expect(salisburyRobotHandPatent.historicalContext.patentWars).toEqual([]);
    expect(salisburyRobotHandPatent.originalText).not.toContain("What is claimed");
  });

  test("provides valid provenance classifications for all Salisbury controls and metrics", () => {
    const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
    const config = PATENT_PHYSICS_REGISTRY["us-4921293-salisbury-robot-hand"];
    expect(config).toBeDefined();

    for (const ctrl of config.controls) {
      expect(["source-disclosed", "scenario-reader"]).toContain(ctrl.provenance);
    }

    const defaultMetrics = config.computeMetrics({});
    for (const metric of defaultMetrics) {
      expect(["source-disclosed", "scenario-reader"]).toContain(metric.provenance);
    }
  });

  test("wires claim 1 and claim 2 constraints in claimConstraints", () => {
    const {
      CATALOG_CLAIM_CONSTRAINTS,
      applyClaimConstraintModifications,
    } = require("@/physics/claimConstraints");
    const constraints = CATALOG_CLAIM_CONSTRAINTS["us-4921293-salisbury-robot-hand"];
    expect(constraints).toBeDefined();
    expect(constraints.length).toBeGreaterThanOrEqual(2);

    const claim1 = constraints.find((c: any) => c.claimNumber === 1);
    expect(claim1).toBeDefined();
    const claim2 = constraints.find((c: any) => c.claimNumber === 2);
    expect(claim2).toBeDefined();

    const activeRes = applyClaimConstraintModifications(
      "us-4921293-salisbury-robot-hand",
      {},
      { 1: true, 2: true },
    );
    expect(activeRes.activeFailures.length).toBe(0);

    const invertedRes = applyClaimConstraintModifications(
      "us-4921293-salisbury-robot-hand",
      {},
      { 1: false, 2: false },
    );
    expect(invertedRes.activeFailures.length).toBeGreaterThan(0);
    expect(invertedRes.modifiedParams.tensionT1N).toBe(0);
    expect(invertedRes.modifiedParams.firstIdlerFixed).toBe(0);
    expect(invertedRes.refusalWarning).toContain("SOURCE BOUNDARY");
  });
});
