import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  kamenSegwayArchivalEdition,
  kamenSegwayParallelReadings,
} from "@/data/editions/kamenSegwayEdition";
import { archivalParallelReadingsFor } from "@/data/editions/parallelReadings";
import { kamenSegwayPatent } from "@/data/patents/kamen-segway";
import { normalizeReviewedLedgerText } from "@/data/patents/sourceTextValidation";
import { PATENT_PHYSICS_REGISTRY } from "@/physics/telemetryData";
import type { CuratedSpecificationBlock, CuratedSpecificationInline } from "@/types/patent";

const PATENT_ID = "us-6302230-kamen-segway";
const EXPECTED_PDF_SHA256 = "bcda272e161a0b973db9d64090f8102447e9aa35914a9a73e70a38736b7934db";

describe("US 6,302,230 Dean Kamen Segway Human Transporter Archival Edition Contract", () => {
  test("pins the reviewed 29-page facsimile and all 7 printed claims", () => {
    const pdfPath = resolve(process.cwd(), "public/patents/pdfs/us-6302230-kamen-segway.pdf");
    expect(existsSync(pdfPath)).toBe(true);

    const pdfBytes = readFileSync(pdfPath);
    const pdfDigest = createHash("sha256").update(pdfBytes).digest("hex");
    expect(pdfDigest).toBe(EXPECTED_PDF_SHA256);
    expect(kamenSegwayArchivalEdition.sourcePdfSha256).toBe(EXPECTED_PDF_SHA256);
    expect(kamenSegwayArchivalEdition.completeFacsimileReviewed).toBe(true);

    const claimBlocks = kamenSegwayArchivalEdition.blocks.filter(
      (b: CuratedSpecificationBlock): b is Extract<CuratedSpecificationBlock, { kind: "claim" }> =>
        b.kind === "claim",
    );
    expect(claimBlocks).toHaveLength(7);
    expect(claimBlocks.map((c: { number: number }) => c.number)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  test("contains every published literal source block in the reviewed 29-page ledger", () => {
    const ledgerPath = resolve(
      process.cwd(),
      "public/patents/transcripts/us-6302230-kamen-segway-reviewed.txt",
    );
    expect(existsSync(ledgerPath)).toBe(true);
    const ledger = readFileSync(ledgerPath, "utf8");

    for (let page = 1; page <= 29; page++) {
      expect(
        ledger.includes(`--- REVIEWED TRANSCRIPTION PAGE ${page} OF 29 ---`),
        `Missing page ${page}`,
      ).toBe(true);
    }

    const normalizedLedger = normalizeReviewedLedgerText(ledger);
    for (const block of kamenSegwayArchivalEdition.blocks) {
      if (block.kind === "paragraph" || block.kind === "claim") {
        for (const inline of block.inlines) {
          if (inline.kind === "text") {
            const normalizedText = normalizeReviewedLedgerText(inline.text);
            const sample = normalizedText.slice(0, Math.min(30, normalizedText.length));
            expect(normalizedLedger.includes(sample)).toBe(true);
          }
        }
      }
    }
  });

  test("pins source crops, technical term annotations, and parallel readings", () => {
    for (let fig = 1; fig <= 12; fig++) {
      const cropPath = resolve(
        process.cwd(),
        `public/patents/figures/us-6302230-kamen-segway/fig-${fig}-source-crop-v1.png`,
      );
      expect(existsSync(cropPath)).toBe(true);
    }

    const inlines = kamenSegwayArchivalEdition.blocks.flatMap((block: CuratedSpecificationBlock) =>
      "inlines" in block ? block.inlines : block.kind === "figure-sheet" ? block.description : [],
    );
    const references = inlines.filter(
      (
        inline: CuratedSpecificationInline,
      ): inline is Extract<CuratedSpecificationInline, { kind: "reference" }> =>
        inline.kind === "reference",
    );
    expect(references.length).toBeGreaterThanOrEqual(6);
    for (const reference of references) {
      expect(reference.figurePreviews?.length).toBeGreaterThan(0);
      for (const preview of reference.figurePreviews ?? []) {
        expect(existsSync(resolve(process.cwd(), "public", preview.src.slice(1)))).toBe(true);
      }
    }

    const terms = inlines.filter(
      (
        inline: CuratedSpecificationInline,
      ): inline is Extract<CuratedSpecificationInline, { kind: "term" }> => inline.kind === "term",
    );
    expect(terms.length).toBeGreaterThanOrEqual(3);
    expect(terms.every((term: { definition: string }) => term.definition.length > 30)).toBe(true);

    const readings = archivalParallelReadingsFor(PATENT_ID);
    expect(readings).toBeDefined();

    const paragraphIndexes = kamenSegwayArchivalEdition.blocks.flatMap(
      (block: CuratedSpecificationBlock, index: number) =>
        block.kind === "paragraph" ? [index] : [],
    );
    for (const index of paragraphIndexes) {
      expect(readings[index]).toBeDefined();
      expect(kamenSegwayParallelReadings[index]?.join(" ").length).toBeGreaterThan(30);
    }
  });

  test("provides valid provenance classifications for all Segway controls and metrics", () => {
    const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
    const entry = PATENT_PHYSICS_REGISTRY["us-6302230-kamen-segway"];
    expect(entry).toBeDefined();
    for (const ctrl of entry.controls) {
      expect(ctrl.provenance).toBeDefined();
    }
    const metrics = entry.computeMetrics({});
    for (const m of metrics) {
      expect(m.provenance).toBeDefined();
    }
  });

  test("wires claim 1 and claim 2 inversion probes through the balance/alarm kernel", () => {
    const { applyClaimConstraintModifications } = require("@/physics/claimConstraints");
    const { stepKamenSegwaySi } = require("@/physics/kamenSegwayKernel");

    const invertedClaim1 = applyClaimConstraintModifications(
      "us-6302230-kamen-segway",
      {},
      {
        1: false,
        2: true,
      },
    );
    expect(invertedClaim1.refusalWarning).toContain("SOURCE-BOUND REFUSAL");
    expect(invertedClaim1.modifiedParams.claim1BalanceEnabled).toBe(0);
    const tel1 = stepKamenSegwaySi({
      riderPitchDeg: 4.5,
      steeringInput: 0,
      riderMassKg: 75,
      groundFrictionCoeff: 0.85,
      speedLimitMS: 5.5,
      claim1BalanceEnabled: false,
      claim2RippleEnabled: true,
    });
    expect(tel1.pitchOverturnRefusal).toBe(true);
    expect(tel1.claim1BalanceWithheld).toBe(true);

    const tel2 = stepKamenSegwaySi({
      riderPitchDeg: 4.5,
      steeringInput: 0,
      riderMassKg: 75,
      groundFrictionCoeff: 0.85,
      speedLimitMS: 5.5,
      claim1BalanceEnabled: true,
      claim2RippleEnabled: false,
    });
    expect(tel2.tactileAlarmActive).toBe(false);
    expect(tel2.claim2RippleWithheld).toBe(true);
  });

  test("keeps figure identity and historical context faithful to the reviewed source", () => {
    const firstDrawing = kamenSegwayPatent.drawings[0];
    expect(firstDrawing?.figureNumber).toBe("1");
    expect(firstDrawing?.title).toStartWith("FIG. 1:");
    expect(firstDrawing?.callouts.every((callout) => callout.figureRef === "Fig. 1")).toBe(true);

    for (const drawing of kamenSegwayPatent.drawings) {
      expect(
        drawing.callouts.every((callout) => callout.figureRef === `Fig. ${drawing.figureNumber}`),
      ).toBe(true);
    }

    const provenance = readFileSync(
      resolve(process.cwd(), "docs/provenance/us-6302230-kamen-segway.md"),
      "utf8",
    );
    expect(provenance).toContain("Sheet 1 of 16 (FIG. 1)");
    expect(provenance).not.toContain("FIGS. 1A, 1B");
    expect(kamenSegwayParallelReadings[15]?.join(" ")).toContain("Figures 1 and 2");

    expect(kamenSegwayPatent.historicalContext.patentWars).toEqual([]);
    const publicCopy = JSON.stringify(kamenSegwayPatent).toLowerCase();
    for (const unsupportedAssertion of ["18 hz", "ninebot", "usitc", "five solid-state"]) {
      expect(publicCopy).not.toContain(unsupportedAssertion);
    }
  });

  test("classifies the interactive model as modern and preserves its source boundary", () => {
    const registry = PATENT_PHYSICS_REGISTRY[PATENT_ID];
    expect(registry?.provenance).toBe("scenario-modern");
    for (const control of registry?.controls ?? []) {
      expect(control.provenance).toBeDefined();
      expect(control.provenanceCitation).toBeTruthy();
    }
    for (const metric of registry?.computeMetrics({}) ?? []) {
      expect(metric.provenance).toBeDefined();
      expect(metric.provenanceCitation).toBeTruthy();
    }
  });
});
