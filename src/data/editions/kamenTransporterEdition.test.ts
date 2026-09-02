import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { kamenTransporterArchivalEdition } from "./kamenTransporterEdition";
import { archivalParallelReadingsFor } from "./parallelReadings";

const ROOT = process.cwd();
const PDF_PATH = join(ROOT, "public/patents/pdfs/us-5701965-kamen-transporter.pdf");
const LEDGER_PATH = join(
  ROOT,
  "public/patents/transcripts/us-5701965-kamen-transporter-reviewed.txt",
);

describe("US 5,701,965 Dean Kamen Human Transporter Archival Edition Contract", () => {
  test("pins the immutable source PDF digest", () => {
    expect(existsSync(PDF_PATH)).toBe(true);
    const bytes = readFileSync(PDF_PATH);
    const sha256 = createHash("sha256").update(bytes).digest("hex");
    expect(sha256).toBe(kamenTransporterArchivalEdition.sourcePdfSha256);
    expect(sha256).toBe("b1dac639b2b9905914433d27fd9b6cad82382239bc291d10ca3e1ac1ffe05f65");
  });

  test("reviewed ledger spans all 48 pages and validates markers", () => {
    expect(existsSync(LEDGER_PATH)).toBe(true);
    const ledger = readFileSync(LEDGER_PATH, "utf8");
    expect(ledger).toContain("--- REVIEWED TRANSCRIPTION PAGE 1 OF 48 ---");
    expect(ledger).toContain("--- REVIEWED TRANSCRIPTION PAGE 48 OF 48 ---");
  });

  test("figure crops exist on disk for all referenced figures", () => {
    const figDir = join(ROOT, "public/patents/figures/us-5701965-kamen-transporter");
    for (let i = 1; i <= 6; i++) {
      const figPath = join(figDir, `fig-${i}-source-crop-v1.png`);
      expect(existsSync(figPath)).toBe(true);
    }
  });

  test("contains exactly 54 printed claims", () => {
    const claimBlocks = kamenTransporterArchivalEdition.blocks.filter((b) => b.kind === "claim");
    expect(claimBlocks.length).toBe(54);
    const claimNumbers = claimBlocks.map((c) => (c as { number: number }).number);
    expect(claimNumbers).toEqual(Array.from({ length: 54 }, (_, i) => i + 1));
  });

  test("parallel readings cover all edition paragraphs with non-trivial text", () => {
    const registeredReadings = archivalParallelReadingsFor("us-5701965-kamen-transporter");
    const paragraphIndexes = kamenTransporterArchivalEdition.blocks.flatMap((b, i) =>
      b.kind === "paragraph" ? [i] : [],
    );

    const readingKeys = Object.keys(registeredReadings)
      .map(Number)
      .sort((a, b) => a - b);
    expect(readingKeys).toEqual(paragraphIndexes);

    for (const key of readingKeys) {
      const entries = registeredReadings[key];
      expect(entries.length).toBeGreaterThan(0);
      for (const entry of entries) {
        expect(entry.trim().length).toBeGreaterThan(35);
      }
    }
  });

  test("provides valid provenance classifications for all Kamen Transporter controls and metrics", () => {
    const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
    const config = PATENT_PHYSICS_REGISTRY["us-5701965-kamen-transporter"];
    expect(config).toBeDefined();

    for (const ctrl of config.controls) {
      expect(["source-disclosed", "scenario-reader"]).toContain(ctrl.provenance);
    }

    const defaultMetrics = config.computeMetrics({});
    for (const metric of defaultMetrics) {
      expect(["source-disclosed", "scenario-reader"]).toContain(metric.provenance);
    }
  });

  test("wires claim 1 and claim 16 constraints in claimConstraints", () => {
    const {
      CATALOG_CLAIM_CONSTRAINTS,
      applyClaimConstraintModifications,
    } = require("@/physics/claimConstraints");
    const constraints = CATALOG_CLAIM_CONSTRAINTS["us-5701965-kamen-transporter"];
    expect(constraints).toBeDefined();
    expect(constraints.length).toBeGreaterThanOrEqual(2);

    const claim1 = constraints.find((c: any) => c.claimNumber === 1);
    expect(claim1).toBeDefined();
    const claim16 = constraints.find((c: any) => c.claimNumber === 16);
    expect(claim16).toBeDefined();

    const activeRes = applyClaimConstraintModifications(
      "us-5701965-kamen-transporter",
      {},
      { 1: true, 16: true },
    );
    expect(activeRes.activeFailures.length).toBe(0);

    const invertedRes = applyClaimConstraintModifications(
      "us-5701965-kamen-transporter",
      {},
      { 1: false, 16: false },
    );
    expect(invertedRes.activeFailures.length).toBeGreaterThan(0);
    expect(invertedRes.modifiedParams.riderPitchLeanDeg).toBe(25);
    expect(invertedRes.refusalWarning).toContain("INVERTED PENDULUM INSTABILITY");
  });
});
