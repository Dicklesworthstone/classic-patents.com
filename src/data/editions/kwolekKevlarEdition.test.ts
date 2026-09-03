import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { kwolekKevlarPatent } from "@/data/patents/kwolek-kevlar";
import { kwolekKevlarClaims, kwolekKevlarSourceAuthoringWip } from "./kwolekKevlarEdition";
import { archivalParallelReadingsFor } from "./parallelReadings";

describe("US 3,671,542 Stephanie Kwolek source-authoring boundary", () => {
  test("pins the 58-page facsimile while withholding the incomplete legacy edition and ledger", () => {
    expect(kwolekKevlarPatent.archivalEdition).toBeUndefined();
    expect(kwolekKevlarPatent.originalTextAsset).toBeUndefined();
    expect(kwolekKevlarPatent.filingDate).toBe("1969-05-23");
    expect(kwolekKevlarSourceAuthoringWip.sourcePdfSha256).toBe(
      "7a2b753cf8d6f329d5fad750dc2de510f723876cac6aa41a4076f0343a7a62c4",
    );
    const pdf = readFileSync(`${process.cwd()}/public${kwolekKevlarPatent.originalPdfUrl}`);
    expect(createHash("sha256").update(pdf).digest("hex")).toBe(
      kwolekKevlarSourceAuthoringWip.sourcePdfSha256,
    );
    expect(kwolekKevlarSourceAuthoringWip.pageCount).toBe(58);
    expect(kwolekKevlarSourceAuthoringWip.manuallyCheckedPages).toBe(10);
    expect(kwolekKevlarSourceAuthoringWip.remainingWork).toContain("PDF pages 11–58");
  });

  test("keeps the two checked printed claims, without pretending to publish the specification", () => {
    expect(kwolekKevlarPatent.claims.map((claim) => claim.number)).toEqual([1, 2]);
    expect(kwolekKevlarClaims).toHaveLength(2);
    expect(kwolekKevlarPatent.claims[0]?.originalText).toBe(kwolekKevlarClaims[0].text);
    expect(kwolekKevlarPatent.claims[1]?.originalText).toBe(kwolekKevlarClaims[1].text);
    expect(kwolekKevlarPatent.stats).toMatchObject({
      totalClaims: 2,
      independentClaims: 1,
    });
    expect(kwolekKevlarPatent.originalText).toContain("The full 58-page historical instrument");
    expect(kwolekKevlarPatent.historicalContext.patentWars).toEqual([]);
  });

  test("retains source-derived figure sheets and the legacy ledger as non-public research evidence", () => {
    for (let figure = 1; figure <= 9; figure += 1) {
      expect(
        existsSync(
          resolve(
            process.cwd(),
            `public/patents/figures/us-3671542-kwolek-kevlar/fig-${figure}-source-preview.png`,
          ),
        ),
      ).toBe(true);
    }
    const ledger = readFileSync(
      `${process.cwd()}/public/patents/transcripts/us-3671542-kwolek-kevlar-reviewed.txt`,
      "utf8",
    );
    expect(ledger).toContain("--- REVIEWED TRANSCRIPTION PAGE 1 OF 58 ---");
    expect(ledger).toContain("--- REVIEWED TRANSCRIPTION PAGE 58 OF 58 ---");
    expect(ledger).toContain("What is claimed is:");
    expect(ledger).toContain("1. Optically anisotropic dope consisting essentially of:");
    expect(ledger).toContain("2. Dope of claim 1 wherein said liquid medium is concentrated");
    expect(kwolekKevlarPatent.originalTextAsset?.url).not.toBe(
      "/patents/transcripts/us-3671542-kwolek-kevlar-reviewed.txt",
    );
    expect(archivalParallelReadingsFor(kwolekKevlarPatent.id)).toEqual({});

    const recordSource = readFileSync(`${process.cwd()}/src/data/patents/kwolek-kevlar.ts`, "utf8");
    expect(recordSource).not.toContain('kind: "reviewed-transcription"');
  });

  test("keeps public telemetry at the checked claim boundary instead of aliasing the legacy material model", () => {
    const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
    const entry = PATENT_PHYSICS_REGISTRY["us-3671542-kwolek-kevlar"];
    expect(entry).not.toBe(PATENT_PHYSICS_REGISTRY["_legacy-unpublished-us-3671542-kwolek-kevlar"]);
    expect(entry.controls).toEqual([]);
    expect(entry.engineMethod).toContain(
      "quantitative processing and material-performance model withheld",
    );
    const metrics = entry.computeMetrics({});
    expect(metrics).toMatchObject([
      { label: "Claim 1", value: "optically anisotropic dope", provenance: "source-disclosed" },
      { label: "Claim 2", value: "> about 98% H₂SO₄", provenance: "source-disclosed" },
      { label: "Visual Model", value: "WITHHELD", provenance: "refusal-bounded" },
    ]);
    const publicCopy = JSON.stringify(entry).toLowerCase();
    for (const unsupportedAssertion of ["gpa", "ballistic", "impact", "draw ratio"]) {
      expect(publicCopy).not.toContain(unsupportedAssertion);
    }

    const { computePortHamiltonianEnergy } = require("@/physics/energyLedger");
    expect(computePortHamiltonianEnergy(kwolekKevlarPatent.id, {}).energy).toEqual({
      kineticJoules: 0,
      potentialJoules: 0,
      electromagneticJoules: 0,
      thermalJoules: 0,
      totalHamiltonianJoules: 0,
    });
    const { computeParameterSensitivity } = require("@/physics/sensitivityKernel");
    expect(computeParameterSensitivity(kwolekKevlarPatent.id, "drawRatio", {})).toBeNull();
  });

  test("registers explicit energy channel omission reason for Kwolek", () => {
    const {
      energyChannelsFor,
      ENERGY_CHANNEL_OMISSION_REASONS,
    } = require("@/physics/energyChannels");
    expect(ENERGY_CHANNEL_OMISSION_REASONS["us-3671542-kwolek-kevlar"]).toBeDefined();
    expect(energyChannelsFor("us-3671542-kwolek-kevlar", {})).toEqual([]);
  });

  test("enforces primary facsimile pending audit hold in publication state registry", () => {
    const { evaluateTypedArchivalPublicationState } = require("./archivalPublicationState");
    const decision = evaluateTypedArchivalPublicationState(kwolekKevlarPatent, {
      hasCompanionReadings: true,
    });
    expect(decision.isPublished).toBe(false);
    expect(decision.state.kind).toBe("facsimile-only");
    expect(decision.reasonCode).toBe("AUDIT_PRIMARY_FACSIMILE_PENDING");
  });
});
