import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { validateCuratedSpecificationEdition } from "@/data/archivalEditionValidation";
import { kamenMedicationInjectionPatent } from "@/data/patents/kamen-medication-injection-device";
import {
  validateReviewedTranscription,
  validateReviewedTranscriptionLiteralCoverage,
  validateReviewedTranscriptionPageAnchors,
} from "@/data/patents/sourceTextValidation";
import {
  kamenMedicationInjectionArchivalEdition,
  kamenMedicationInjectionParallelReadings,
} from "./kamenMedicationInjectionEdition";
import {
  archivalEditionForPublication,
  evaluateArchivalPublicationState,
} from "./publicationApproval";
import {
  evaluateReviewedLedgerTextEvidence,
  literalLedgerSectionsForEdition,
} from "./reviewedLedgerPublicationEvidence";

describe("US 3,858,581 manual source edition", () => {
  test("pins the reviewed eight-page facsimile and all printed claims", () => {
    expect(validateCuratedSpecificationEdition(kamenMedicationInjectionArchivalEdition)).toEqual({
      valid: true,
      errors: [],
    });
    const pdf = readFileSync(
      `${process.cwd()}/public${kamenMedicationInjectionPatent.originalPdfUrl}`,
    );
    expect(createHash("sha256").update(pdf).digest("hex")).toBe(
      kamenMedicationInjectionArchivalEdition.sourcePdfSha256,
    );
    expect(kamenMedicationInjectionPatent.claims.map((item) => item.number)).toEqual([
      1, 2, 3, 4, 5,
    ]);
    expect(kamenMedicationInjectionPatent.stats).toMatchObject({
      totalClaims: 5,
      independentClaims: 1,
    });
  }, 30_000);

  test("reads every legal claim from the manual edition", () => {
    const claims = kamenMedicationInjectionArchivalEdition.blocks.filter(
      (
        block,
      ): block is Extract<
        (typeof kamenMedicationInjectionArchivalEdition.blocks)[number],
        { kind: "claim" }
      > => block.kind === "claim",
    );
    expect(kamenMedicationInjectionPatent.claims.map((item) => item.originalText)).toEqual(
      claims.map((item) => item.inlines.map((inline) => inline.text).join("")),
    );
    expect(
      kamenMedicationInjectionPatent.claims.map(
        (item) => item.plainEnglish.split(/\s+/).length > 30,
      ),
    ).toEqual([true, true, true, true, true]);
    expect(kamenMedicationInjectionPatent.claims[1]?.dependsOn).toEqual([1]);
    expect(kamenMedicationInjectionPatent.claims[2]?.dependsOn).toEqual([2]);
    expect(kamenMedicationInjectionPatent.claims[3]?.dependsOn).toEqual([2]);
    expect(kamenMedicationInjectionPatent.claims[4]?.dependsOn).toEqual([4]);
  });

  test("binds source crops, term notes, readings, and ledger anchors", () => {
    const inlines = kamenMedicationInjectionArchivalEdition.blocks.flatMap((block) =>
      "inlines" in block ? block.inlines : block.kind === "figure-sheet" ? block.description : [],
    );
    const figures = inlines.filter((inline) => inline.kind === "reference");
    expect(figures).not.toHaveLength(0);
    for (const reference of figures)
      for (const preview of reference.figurePreviews ?? [])
        expect(existsSync(resolve(process.cwd(), "public", preview.src.slice(1)))).toBe(true);
    const terms = inlines.filter(
      (inline): inline is Extract<(typeof inlines)[number], { kind: "term" }> =>
        inline.kind === "term",
    );
    expect(terms.map((item) => item.text)).toEqual([
      "rotational traverse",
      "pulse-counting means",
      "uniform pitch",
      "motor-off interval",
    ]);
    expect(terms.every((item) => item.definition.length > 80)).toBe(true);
    const paragraphIndexes = kamenMedicationInjectionArchivalEdition.blocks.flatMap(
      (block, index) => (block.kind === "paragraph" ? [index] : []),
    );
    expect(
      Object.keys(kamenMedicationInjectionParallelReadings)
        .map(Number)
        .sort((a, b) => a - b),
    ).toEqual(paragraphIndexes);
    for (const index of paragraphIndexes)
      expect(kamenMedicationInjectionParallelReadings[index]?.join(" ").length).toBeGreaterThan(40);
    const asset = kamenMedicationInjectionPatent.originalTextAsset;
    if (!asset) throw new Error("Kamen reviewed ledger is missing.");
    const ledger = readFileSync(`${process.cwd()}/public${asset.url}`, "utf8");
    expect(validateReviewedTranscription(ledger, 8)).toEqual({ valid: true });
    expect(validateReviewedTranscriptionPageAnchors(ledger, 8, asset.pageAnchors ?? [])).toEqual({
      valid: true,
    });
    for (const claim of claims(kamenMedicationInjectionArchivalEdition))
      expect(ledger).toContain(claim.inlines.map((inline) => inline.text).join(""));
  });

  test("pins every visitor-facing source block and legal claim to the reviewed ledger", () => {
    const asset = kamenMedicationInjectionPatent.originalTextAsset;
    if (!asset) throw new Error("Kamen reviewed ledger is missing.");
    const ledger = readFileSync(`${process.cwd()}/public${asset.url}`, "utf8");
    const literalSections = literalLedgerSectionsForEdition(
      kamenMedicationInjectionArchivalEdition,
    );

    expect(literalSections).toHaveLength(58);
    expect(validateReviewedTranscriptionLiteralCoverage(ledger, 8, literalSections)).toEqual({
      valid: true,
    });
    expect(evaluateReviewedLedgerTextEvidence(kamenMedicationInjectionPatent, ledger)).toEqual({
      status: "verified",
      valid: true,
      ledgerUrl: "/patents/transcripts/us-3858581-kamen-medication-injection-device-reviewed.txt",
      authoredSectionCount: 58,
      coveredSectionCount: 58,
      coverageFraction: 1,
      missingSectionIndexes: [],
      missingClaimNumbers: [],
      error: null,
    });
  }, 30_000);

  test("publishes only the locator-bound, independently reviewed archival edition", () => {
    const decision = evaluateArchivalPublicationState(kamenMedicationInjectionPatent);

    expect(decision).toMatchObject({
      isPublished: true,
      status: "published",
      reasonCode: "ACCEPTED",
      figureManifest: {
        requiredFigureCount: 33,
        acceptedFigureCount: 33,
        attestation: {
          sourcePdfSha256: "1aa0df879ec119a9ad4025774e482dfc41e748127bc3f83cde31047daeedc35d",
          acceptanceBasis: "independent-figure-review",
          acceptedOccurrenceCount: 33,
          acceptedAssetCount: 6,
          matchesEdition: true,
          matchesLocators: true,
        },
      },
    });
    expect(
      decision.figureManifest.figures.every(
        (figure) =>
          figure.status === "accepted" &&
          figure.locatorEvidenceReference ===
            "docs/provenance/us-3858581-kamen-medication-injection-device.md#figure-crop-review-and-preservation-boundary",
      ),
    ).toBe(true);
    expect(archivalEditionForPublication(kamenMedicationInjectionPatent)).toBe(
      kamenMedicationInjectionArchivalEdition,
    );
  });

  test("provides valid provenance classifications for all Kamen medication injection controls and metrics", () => {
    const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
    const entry = PATENT_PHYSICS_REGISTRY["us-3858581-kamen-medication-injection-device"];
    expect(entry).toBeDefined();
    for (const ctrl of entry.controls) {
      expect(ctrl.provenance).toBeDefined();
    }
    const metrics = entry.computeMetrics({});
    for (const m of metrics) {
      expect(m.provenance).toBeDefined();
    }
  });

  test("registers explicit energy channel omission reason for Kamen medication injection", () => {
    const {
      energyChannelsFor,
      ENERGY_CHANNEL_OMISSION_REASONS,
    } = require("@/physics/energyChannels");
    expect(
      ENERGY_CHANNEL_OMISSION_REASONS["us-3858581-kamen-medication-injection-device"],
    ).toBeDefined();
    expect(energyChannelsFor("us-3858581-kamen-medication-injection-device", {})).toEqual([]);
  });

  test("wires claim 1 inversion probe to open the motor circuit and report nonclinical refusal", () => {
    const { applyClaimConstraintModifications } = require("@/physics/claimConstraints");
    const { stepKamenInjectionMechanism } = require("@/physics/kamenInjectionKernel");

    const result = applyClaimConstraintModifications(
      "us-3858581-kamen-medication-injection-device",
      { motorCircuitClosed: 1 },
      { 1: false },
    );
    expect(result.modifiedParams.motorCircuitClosed).toBe(0);
    expect(result.refusalWarning).toContain("NONCLINICAL MECHANISM REFUSAL");

    const pose = stepKamenInjectionMechanism(result.modifiedParams);
    expect(pose.motorCircuitClosed).toBe(false);
    expect(pose.motorState).toBe("open");
  });
});

function claims(edition: typeof kamenMedicationInjectionArchivalEdition) {
  return edition.blocks.filter(
    (block): block is Extract<(typeof edition.blocks)[number], { kind: "claim" }> =>
      block.kind === "claim",
  );
}
