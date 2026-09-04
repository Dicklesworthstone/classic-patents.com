import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { boyleSmithCcdPatent } from "@/data/patents/boyle-smith-ccd";
import { validateReviewedTranscription } from "@/data/patents/sourceTextValidation";
import { applyClaimConstraintModifications } from "@/physics/claimConstraints";
import {
  boyleSmithCcdArchivalEdition,
  boyleSmithCcdClaimText,
  boyleSmithCcdClaimTexts,
  boyleSmithCcdParallelReadings,
} from "./boyleSmithCcdEdition";

describe("US 3,858,232 Willard S. Boyle & George E. Smith Charge-Coupled Devices Archival Edition Publication Contract", () => {
  const root = process.cwd();

  test("matches the cryptographic SHA-256 digest of the pinned 19-page USPTO facsimile PDF", () => {
    const pdfPath = join(root, "public/patents/pdfs/us-3858232-boyle-smith-ccd.pdf");
    expect(existsSync(pdfPath)).toBe(true);

    const hasher = new Bun.CryptoHasher("sha256");
    hasher.update(readFileSync(pdfPath));
    const digest = hasher.digest("hex");

    expect(digest).toBe("769ab5a1dc91d51bfeebea53b082de4d9b712deb41c096cdac41aae4d3142ec2");
    expect(boyleSmithCcdArchivalEdition.sourcePdfSha256).toBe(digest);
    expect(boyleSmithCcdPatent.originalTextAsset?.sourcePdfSha256).toBe(digest);
  });

  test("pins and validates the 19-page reviewed ledger transcript", () => {
    const ledgerPath = join(
      root,
      "public/patents/transcripts/us-3858232-boyle-smith-ccd-reviewed.txt",
    );
    expect(existsSync(ledgerPath)).toBe(true);

    const ledger = readFileSync(ledgerPath, "utf8");
    expect(validateReviewedTranscription(ledger, 19)).toEqual({ valid: true });
    expect(ledger).toContain("--- REVIEWED TRANSCRIPTION PAGE 1 OF 19 ---");
    expect(ledger).toContain("--- REVIEWED TRANSCRIPTION PAGE 19 OF 19 ---");
  });

  test("verifies all referenced source figure crops exist on disk", () => {
    const figureRefs = [
      "1a",
      "1b",
      "1c",
      "1d",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7a",
      "7b",
      "7c",
      "8",
      "9a",
      "9b",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
    ];

    for (const fig of figureRefs) {
      const figPath = join(
        root,
        `public/patents/figures/us-3858232-boyle-smith-ccd-fig-${fig}-preview.png`,
      );
      expect(existsSync(figPath)).toBe(true);
    }
  });

  test("exposes all 32 printed claims via dynamic single-source lookup", () => {
    expect(boyleSmithCcdClaimTexts.length).toBe(32);
    expect(boyleSmithCcdPatent.claims.length).toBe(32);

    for (let i = 1; i <= 32; i++) {
      const claimText = boyleSmithCcdClaimText(i);
      expect(claimText).toBeDefined();
      expect(claimText.length).toBeGreaterThan(20);
      expect(boyleSmithCcdPatent.claims[i - 1].originalText).toBe(claimText);
    }
  });

  test("validates parallel readings map covers the archival paragraph blocks", () => {
    const paragraphIndexes = boyleSmithCcdArchivalEdition.blocks.flatMap((block, index) =>
      block.kind === "paragraph" ? [index] : [],
    );
    const readingIndexes = Object.keys(boyleSmithCcdParallelReadings)
      .map(Number)
      .sort((a, b) => a - b);

    expect(readingIndexes).toEqual(paragraphIndexes);
  });

  test("provides valid provenance classifications for all Boyle-Smith CCD controls and metrics", () => {
    const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
    const entry = PATENT_PHYSICS_REGISTRY["us-3858232-boyle-smith-ccd"];
    expect(entry).toBeDefined();
    for (const ctrl of entry.controls) {
      expect(ctrl.provenance).toBeDefined();
    }
    const metrics = entry.computeMetrics({});
    for (const m of metrics) {
      expect(m.provenance).toBeDefined();
    }
    const publicPhysics = JSON.stringify(entry);
    for (const unsupported of [
      "gateVoltageV",
      "clockFrequencyMhz",
      "incidentLux",
      "fullWellCapacityElectrons",
      "snrDb",
      "darkElectrons",
    ]) {
      expect(publicPhysics).not.toContain(unsupported);
    }
  });

  test("maps Claim 1 inversion only to the printed single-conductivity storage boundary", () => {
    const result = applyClaimConstraintModifications(
      "us-3858232-boyle-smith-ccd",
      { pulseWidthToStepRatio: 0.5 },
      { 1: false },
    );
    expect(result.modifiedParams).toMatchObject({
      pulseWidthToStepRatio: 0.5,
      claim1SingleConductivityPresent: 0,
    });
    expect(result.modifiedParams.chargeTransferEfficiencyPct).toBeUndefined();
    expect(result.modifiedParams.gateVoltageV).toBeUndefined();
    expect(result.activeFailures[0]).toContain("continuous single-conductivity");
    expect(result.refusalWarning).toContain("not inferred");
  });

  test("enforces figure acceptance pending hold while ledger is verified", () => {
    const { evaluateArchivalPublicationState } = require("./publicationApproval");
    const decision = evaluateArchivalPublicationState(boyleSmithCcdPatent);
    expect(decision.isPublished).toBe(false);
    expect(decision.reasonCode).toBe("FIGURE_ACCEPTANCE_PENDING");
    expect(decision.state.evidence.ledgerContent.valid).toBe(true);
    expect(decision.state.evidence.ledgerContent.status).toBe("verified");
  });
});
