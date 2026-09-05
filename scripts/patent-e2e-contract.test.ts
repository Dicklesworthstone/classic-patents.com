import { describe, expect, test } from "bun:test";
import * as fs from "node:fs";
import * as path from "node:path";
import { getColorizedEquationsForPatent } from "../src/data/colorizedEquations";
import {
  completeArchivalEditionForViewer,
  evaluateArchivalPublicationState,
} from "../src/data/editions/publicationApproval";
import { reviewedLedgerTextForViewer } from "../src/data/editions/reviewedLedgerPublicationEvidence.server";
import { patentSourceIdentity } from "../src/data/patentSourceIdentity.server";
import { allPatents } from "../src/data/patents";
import { CATALOG_CLAIM_CONSTRAINTS } from "../src/physics/claimConstraints";
import { energyChannelsFor } from "../src/physics/energyChannels";
import { PATENT_PHYSICS_REGISTRY } from "../src/physics/telemetryData";
import type { Patent } from "../src/types/patent";
import {
  assertPatentSourceIdentity,
  buildPatentE2EScenarios,
  classifyPatentE2EDiagnostic,
  createPatentE2EEvent,
  parsePatentE2EArgs,
  patentE2EExitCode,
  resolveChangedPatentIds,
  safeArtifactSegment,
  selectPatentE2EScenarios,
  serializePatentE2EEvent,
  stableFailureStem,
  summarizePatentE2EEvents,
  validatePatentE2EEventOrder,
} from "./patent-e2e-contract";

function patent(id: string, overrides: Partial<Patent> = {}): Patent {
  return {
    id,
    patentNumber: "US 1",
    shortTitle: "Test Mechanism",
    originalPdfUrl: `/patents/pdfs/${id}.pdf`,
    claims: [],
    drawings: [],
    ...overrides,
  } as Patent;
}

describe("patent E2E scenario contract", () => {
  test("source identity detects a changed figure version before asset assertions", () => {
    const crump = allPatents.find((entry) => entry.id === "us-5121329-crump-fdm");
    if (!crump) throw new Error("Missing Crump fixture");
    const original = patentSourceIdentity(crump);
    const changed = JSON.parse(
      JSON.stringify(crump).replace("/patents/figures/", "/patents/figure-revision/"),
    ) as Patent;
    expect(patentSourceIdentity(changed)).not.toBe(original);
    expect(() => assertPatentSourceIdentity(original, original)).not.toThrow();
    expect(() => assertPatentSourceIdentity(original, patentSourceIdentity(changed))).toThrow(
      "SOURCE_IDENTITY_MISMATCH",
    );
    expect(() => assertPatentSourceIdentity(original, null)).toThrow("deployed=missing");
  });

  test("held-model capability is explicit independently of face-label wording", () => {
    const scenarios = buildPatentE2EScenarios(
      [patent("us-3671542-kwolek-kevlar"), patent("us-821393-wright-flyer")],
      { rendersEdition: () => false, hasCompleteTranscript: () => true },
    );
    expect(scenarios[0].visualAvailability).toBe("source-hold");
    expect(scenarios[1].visualAvailability).toBe("interactive");
  });
  test("builds one source-state-aware scenario per exact catalogue id", () => {
    const scenarios = buildPatentE2EScenarios(
      [
        patent("us-1-published", {
          originalTextAsset: { kind: "reviewed-transcription" } as Patent["originalTextAsset"],
          archivalEdition: {
            kind: "manual-react-edition",
            sourcePdfSha256: "a".repeat(64),
            preparedBy: "E2E contract test",
            preparedAt: "2026-09-01",
            completeFacsimileReviewed: true,
            blocks: [
              {
                kind: "paragraph",
                inlines: [
                  {
                    kind: "reference",
                    referenceType: "figure",
                    text: "Fig. 1",
                    label: "Figure 1",
                    href: "?view=pdf-facsimile",
                    figurePreviews: [
                      {
                        src: "/patents/figures/us-1/fig-1.png",
                        alt: "Figure 1 source crop",
                        width: 800,
                        height: 600,
                      },
                    ],
                  },
                ],
              },
            ],
          } as Patent["archivalEdition"],
          claims: [{ number: 1 }] as Patent["claims"],
          drawings: [{ figureNumber: "1" }] as Patent["drawings"],
        }),
        patent("us-2-transcript"),
        patent("us-3-facsimile"),
      ],
      {
        rendersEdition: (entry) => entry.id === "us-1-published",
        hasCompleteTranscript: (entry) => entry.id === "us-2-transcript",
        assetExists: () => true,
        equationIdsForPatent: () => ["equation-1"],
        claimProbeCountForPatent: () => 2,
        hasEnergyChannelsForPatent: () => true,
        controlsForPatent: () => [
          {
            id: "input-rate",
            label: "Input Rate",
            min: 0,
            max: 10,
            step: 1,
            defaultValue: 5,
            unit: "Hz",
          },
        ],
      },
    );

    expect(scenarios).toHaveLength(3);
    expect(scenarios[0]).toMatchObject({
      patentId: "us-1-published",
      route: "/patents/us-1-published",
      sourceState: "edition",
      sourcePublicationState: "accepted",
      sourceReasonCode: "ACCEPTED",
      claimCount: 1,
      drawingCount: 1,
      hasReviewedLedger: true,
      hasCompleteTranscript: false,
      hasStoredEdition: true,
      figurePreviewUrls: ["/patents/figures/us-1/fig-1.png"],
      equationIds: ["equation-1"],
      claimProbeCount: 2,
      hasEnergyChannels: true,
      controls: [
        {
          id: "input-rate",
          label: "Input Rate",
          min: 0,
          max: 10,
          step: 1,
          defaultValue: 5,
          unit: "Hz",
        },
      ],
    });
    expect(scenarios[1]).toMatchObject({
      patentId: "us-2-transcript",
      sourceState: "transcript",
      hasCompleteTranscript: true,
    });
    expect(scenarios[2]).toMatchObject({
      patentId: "us-3-facsimile",
      sourceState: "facsimile",
      hasCompleteTranscript: false,
    });
  });

  test("rejects duplicate catalogue ids and missing or non-canonical PDF assets", () => {
    const facts = {
      rendersEdition: () => false,
      hasCompleteTranscript: () => true,
      assetExists: () => true,
    };
    expect(() => buildPatentE2EScenarios([patent("us-1"), patent("us-1")], facts)).toThrow(
      "Duplicate patent id",
    );
    expect(() =>
      buildPatentE2EScenarios(
        [patent("us-2", { originalPdfUrl: "https://example.test/remote.pdf" })],
        facts,
      ),
    ).toThrow("non-canonical pinned PDF URL");
    expect(() =>
      buildPatentE2EScenarios([patent("us-3")], {
        ...facts,
        assetExists: () => false,
      }),
    ).toThrow("missing pinned PDF");
  });

  test("selects exact ids and fails loudly for an unknown id", () => {
    const scenarios = buildPatentE2EScenarios([patent("us-1"), patent("us-2")], {
      rendersEdition: () => true,
      hasCompleteTranscript: () => false,
    });
    expect(selectPatentE2EScenarios(scenarios, ["us-2", "us-2"])).toHaveLength(1);
    expect(() => selectPatentE2EScenarios(scenarios, ["us-404"])).toThrow("Unknown patent E2E id");
  });

  test("builds an exact manifest from the live catalogue and all pinned PDFs", () => {
    const scenarios = buildPatentE2EScenarios(allPatents, {
      rendersEdition: (entry) => {
        return Boolean(completeArchivalEditionForViewer(entry));
      },
      hasCompleteTranscript: (entry) => Boolean(reviewedLedgerTextForViewer(entry)),
      publicationDecision: evaluateArchivalPublicationState,
      assetExists: (publicUrl) =>
        fs.existsSync(path.join(process.cwd(), "public", publicUrl.replace(/^\/+/, ""))),
      equationIdsForPatent: (entry) =>
        getColorizedEquationsForPatent(entry.id).map((equation) => equation.id),
      claimProbeCountForPatent: (entry) => (CATALOG_CLAIM_CONSTRAINTS[entry.id] ?? []).length,
      hasEnergyChannelsForPatent: (entry) => {
        const physics = PATENT_PHYSICS_REGISTRY[entry.id];
        if (!physics) return false;
        const defaults = Object.fromEntries(
          physics.controls.map((control) => [control.id, control.defaultValue]),
        );
        return energyChannelsFor(entry.id, defaults).length > 0;
      },
      controlsForPatent: (entry) =>
        (PATENT_PHYSICS_REGISTRY[entry.id]?.controls ?? []).map((control) => ({
          id: control.id,
          label: control.label,
          min: control.min,
          max: control.max,
          step: control.step,
          defaultValue: control.defaultValue,
          unit: control.unit ?? "",
        })),
    });

    expect(scenarios).toHaveLength(allPatents.length);
    expect(scenarios.length).toBeGreaterThan(100);
    expect(new Set(scenarios.map((scenario) => scenario.patentId)).size).toBe(scenarios.length);
    expect(scenarios.map((scenario) => scenario.patentId)).toEqual(
      allPatents.map((entry) => entry.id),
    );
    expect(scenarios.every((scenario) => scenario.route === `/patents/${scenario.patentId}`)).toBe(
      true,
    );
    expect(scenarios.some((scenario) => scenario.sourceState === "edition")).toBe(true);
    expect(scenarios.some((scenario) => scenario.sourceState === "transcript")).toBe(true);
    // The synthetic fixture above pins the facsimile branch. The live catalogue
    // currently happens to have a complete text delivery for every record.
    for (const scenario of scenarios) {
      const patent = allPatents.find((entry) => entry.id === scenario.patentId);
      if (!patent) throw new Error(`Missing catalogue patent ${scenario.patentId}`);
      const completeEdition = completeArchivalEditionForViewer(patent);
      const expectedDelivery = completeEdition
        ? "edition"
        : scenario.hasCompleteTranscript
          ? "transcript"
          : "facsimile";
      expect(scenario.sourceState).toBe(expectedDelivery);
    }
    expect(
      scenarios.every(
        (scenario) => scenario.sourceState !== "transcript" || scenario.hasCompleteTranscript,
      ),
    ).toBe(true);
    expect(scenarios.every((scenario) => scenario.sourceReasonCode.length > 0)).toBe(true);
    expect(
      scenarios.every(
        (scenario) =>
          scenario.sourceDecision.acceptedFigureCount <=
          scenario.sourceDecision.requiredFigureCount,
      ),
    ).toBe(true);
    expect(scenarios.some((scenario) => scenario.figurePreviewUrls.length > 0)).toBe(true);
    expect(scenarios.some((scenario) => scenario.claimProbeCount > 0)).toBe(true);
    expect(scenarios.some((scenario) => scenario.hasEnergyChannels)).toBe(true);
    expect(scenarios.some((scenario) => !scenario.hasEnergyChannels)).toBe(true);
    expect(scenarios.some((scenario) => scenario.controls.length > 0)).toBe(true);

    const lemelsonProduction = scenarios.find(
      (scenario) => scenario.patentId === "us-3313014-lemelson-automatic-production",
    );
    expect(lemelsonProduction?.sourceDecision.figureAttestation).toMatchObject({
      reviewer: expect.any(String),
      reviewedAt: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
      acceptanceBasis: expect.any(String),
      sourcePdfSha256: expect.stringMatching(/^[a-f0-9]{64}$/),
      matchesEdition: true,
      matchesLocators: true,
    });
    expect(lemelsonProduction?.sourceDecision.figureAttestation?.acceptedOccurrenceCount).toBe(
      lemelsonProduction?.sourceDecision.requiredFigureCount,
    );
    expect(lemelsonProduction?.sourceState).toBe("edition");
    expect(lemelsonProduction?.sourceReasonCode).toBe("ACCEPTED");
    expect(lemelsonProduction?.sourceDecision.acceptedFigureCount).toBe(
      lemelsonProduction?.sourceDecision.requiredFigureCount,
    );
    expect(
      lemelsonProduction?.sourceDecision.figures.every(
        (figure) =>
          figure.status === "accepted" &&
          figure.sourcePdfPage !== null &&
          figure.sourceRegion !== null,
      ),
    ).toBe(true);

    const gatlingGun = scenarios.find((scenario) => scenario.patentId === "us-36836-gatling-gun");
    expect(gatlingGun?.sourceDecision.figureAttestation).toMatchObject({
      matchesEdition: true,
      matchesLocators: true,
    });
    expect(gatlingGun?.sourceReasonCode).toBe("ACCEPTED");
    expect(gatlingGun?.sourceDecision.acceptedFigureCount).toBe(
      gatlingGun?.sourceDecision.requiredFigureCount,
    );

    const marconiRadio = scenarios.find(
      (scenario) => scenario.patentId === "us-586193-marconi-radio",
    );
    expect(marconiRadio?.sourceDecision.figureAttestation).toMatchObject({
      matchesEdition: true,
      matchesLocators: true,
    });
    expect(marconiRadio?.sourceReasonCode).toBe("ACCEPTED");
    expect(marconiRadio?.sourceDecision.acceptedFigureCount).toBe(
      marconiRadio?.sourceDecision.requiredFigureCount,
    );

    const zeppelinAirship = scenarios.find(
      (scenario) => scenario.patentId === "us-621195-zeppelin-airship",
    );
    expect(zeppelinAirship?.sourceDecision.figureAttestation).toMatchObject({
      matchesEdition: true,
      matchesLocators: true,
    });
    expect(zeppelinAirship?.sourceReasonCode).toBe("ACCEPTED");
    expect(zeppelinAirship?.sourceDecision.acceptedFigureCount).toBe(
      zeppelinAirship?.sourceDecision.requiredFigureCount,
    );

    const renoEscalator = scenarios.find(
      (scenario) => scenario.patentId === "us-470918-reno-escalator",
    );
    expect(renoEscalator?.sourceDecision.figureAttestation).toMatchObject({
      matchesEdition: true,
      matchesLocators: true,
    });
    expect(renoEscalator?.sourceReasonCode).toBe("ACCEPTED");
    expect(renoEscalator?.sourceDecision.acceptedFigureCount).toBe(
      renoEscalator?.sourceDecision.requiredFigureCount,
    );

    const teslaMotor = scenarios.find((s) => s.patentId === "us-381968-tesla-motor");
    expect(teslaMotor?.sourceDecision.ledgerContent).toMatchObject({
      status: "verified",
      valid: true,
      coverageFraction: 1,
      missingSectionIndexes: [],
      missingClaimNumbers: [],
    });
    expect(teslaMotor?.sourceDecision.pinnedPdfBytes).toMatchObject({
      canonicalPublicPdfUrl: "/patents/pdfs/us-381968-tesla-motor.pdf",
      availability: "verified",
      matchesExpected: true,
      reason: "VERIFIED",
    });
    expect(teslaMotor?.sourceDecision.pinnedPdfBytes.expectedSha256).toMatch(/^[a-f0-9]{64}$/);
    expect(teslaMotor?.sourceDecision.pinnedPdfBytes.actualSha256).toMatch(/^[a-f0-9]{64}$/);
    expect(teslaMotor?.sourceDecision.pinnedPdfBytes.actualSha256).toBe(
      teslaMotor?.sourceDecision.pinnedPdfBytes.expectedSha256,
    );

    const pasteur = scenarios.find(
      (scenario) => scenario.patentId === "us-135245-pasteur-fermentation",
    );
    expect(pasteur?.sourceDecision.figureAttestation).toMatchObject({
      matchesEdition: true,
      matchesLocators: true,
      acceptedOccurrenceCount: 3,
    });
    expect(pasteur?.sourceDecision.acceptedFigureCount).toBe(3);
    expect(
      pasteur?.sourceDecision.figures.every(
        (figure) =>
          figure.status === "accepted" &&
          figure.sourcePdfPage === 1 &&
          figure.sourceRaster?.width === 2320 &&
          figure.sourceRaster.height === 3408 &&
          figure.sourceRectPixels !== null &&
          figure.sourceRegion !== null &&
          figure.locatorEvidenceReference?.startsWith(
            "docs/provenance/us-135245-pasteur-fermentation.md#",
          ),
      ),
    ).toBe(true);

    for (const scenario of scenarios) {
      for (const previewUrl of scenario.figurePreviewUrls) {
        expect(previewUrl.startsWith("/patents/figures/")).toBe(true);
      }
    }
  }, 30_000);
});

describe("patent E2E CLI contract", () => {
  test("requires one explicit selection mode and preserves the exact 320px phone viewport", () => {
    const options = parsePatentE2EArgs([
      "--patent",
      "us-1",
      "--patent",
      "us-2",
      "--viewports",
      "desktop,phone",
      "--base-url",
      "http://127.0.0.1:3000/",
    ]);
    expect(options.patentIds).toEqual(["us-1", "us-2"]);
    expect(options.viewports).toEqual(["desktop", "phone"]);
    expect(options.baseUrl).toBe("http://127.0.0.1:3000");
    expect(parsePatentE2EArgs(["--self-test-failure"]).selfTestFailure).toBe(true);
    expect(() => parsePatentE2EArgs([])).toThrow("Select exactly one");
    expect(() => parsePatentE2EArgs(["--all", "--changed"])).toThrow("Select exactly one");
    expect(() => parsePatentE2EArgs(["--all", "--viewports", "wide"])).toThrow(
      "Unknown E2E viewport",
    );
  });

  test("maps patent-local changes exactly and expands shared-surface changes to the catalogue", () => {
    const scenarios = buildPatentE2EScenarios([patent("us-1-alpha"), patent("us-2-beta")], {
      rendersEdition: () => true,
      hasCompleteTranscript: () => false,
    });
    expect(
      resolveChangedPatentIds(
        scenarios,
        ["src/data/patents/alpha.ts"],
        () => 'export const value = { id: "us-1-alpha" };',
      ),
    ).toEqual(["us-1-alpha"]);
    expect(
      resolveChangedPatentIds(scenarios, ["src/physics/telemetryData.ts"], () => "shared registry"),
    ).toEqual(["us-1-alpha", "us-2-beta"]);
    expect(resolveChangedPatentIds(scenarios, [], () => undefined)).toEqual([]);
  });
});

describe("structured E2E diagnostics", () => {
  test("serializes validated JSONL events and redacts common secret shapes", () => {
    const event = createPatentE2EEvent({
      runId: "run-1",
      sequence: 1,
      patentId: "us-1",
      route: "/patents/us-1",
      viewport: "phone",
      face: "interactive-sim",
      action: "shared-control",
      status: "fail",
      durationMs: Number.NaN,
      errors: ["authorization=secret bearer abc.def token=also-secret"],
      consoleErrors: ["cookie=console-secret"],
      pageErrors: ["password=page-secret"],
      networkErrors: ["token=network-secret"],
      artifactPaths: ["artifacts/run/us-1.png"],
      timestamp: "2026-09-01T00:00:00.000Z",
    });
    const line = serializePatentE2EEvent(event);
    expect(line).not.toContain("secret");
    expect(JSON.parse(line)).toMatchObject({
      schemaVersion: "classic-patents.e2e-event.v1",
      durationMs: 0,
      viewport: "phone",
    });
  });

  test("summarizes failures deterministically and produces a nonzero exit code", () => {
    const pass = createPatentE2EEvent({
      runId: "run-1",
      sequence: 1,
      patentId: "us-1",
      route: "/patents/us-1",
      viewport: "desktop",
      face: "route",
      action: "http-200",
      status: "pass",
      durationMs: 12,
    });
    const fail = createPatentE2EEvent({
      runId: "run-1",
      sequence: 2,
      patentId: "us-2",
      route: "/patents/us-2",
      viewport: "phone",
      face: "source",
      action: "publication-state",
      status: "fail",
      durationMs: 8,
    });
    const summary = summarizePatentE2EEvents({
      runId: "run-1",
      startedAt: "2026-09-01T00:00:00.000Z",
      finishedAt: "2026-09-01T00:01:00.000Z",
      baseUrl: "http://127.0.0.1:3088",
      selectedPatents: ["us-1", "us-2"],
      selectedViewports: ["desktop", "phone"],
      artifactDirectory: "artifacts/run-1",
      events: [pass, fail],
    });
    expect(summary).toMatchObject({ eventCount: 2, passedActions: 1, failedActions: 1 });
    expect(summary.failedPatents).toEqual(["us-2"]);
    expect(summary.actionGroups).toEqual([
      expect.objectContaining({
        patentId: "us-1",
        viewport: "desktop",
        face: "route",
        action: "http-200",
        passedActions: 1,
        failedActions: 0,
      }),
      expect.objectContaining({
        patentId: "us-2",
        viewport: "phone",
        face: "source",
        action: "publication-state",
        passedActions: 0,
        failedActions: 1,
      }),
    ]);
    expect(patentE2EExitCode(summary)).toBe(1);
  });

  test("creates stable, filesystem-safe failure names", () => {
    expect(safeArtifactSegment("Claim 1 / source:state")).toBe("claim-1-source-state");
    expect(stableFailureStem("US 1", "phone", "Original Patent", "PDF 200")).toBe(
      "us-1__phone__original-patent__pdf-200",
    );
  });

  test("capture events do not double-count a failure or hide an uncaught scenario failure", () => {
    const event = createPatentE2EEvent({
      runId: "run-1",
      sequence: 1,
      patentId: "us-1",
      route: "/patents/us-1",
      viewport: "phone",
      face: "route",
      action: "source-identity",
      status: "fail",
      durationMs: 1,
    });
    const evidence = {
      ...event,
      sequence: 2,
      action: "failure-evidence",
      artifactPaths: ["failure.png"],
    };
    const summarize = (events: (typeof event)[]) =>
      summarizePatentE2EEvents({
        runId: "run-1",
        startedAt: "2026-09-05T00:00:00Z",
        finishedAt: "2026-09-05T00:01:00Z",
        baseUrl: "http://127.0.0.1:4245",
        selectedPatents: ["us-1"],
        selectedViewports: ["phone"],
        artifactDirectory: "/fixture",
        events,
      });
    const paired = summarize([event, evidence]);
    expect(paired).toMatchObject({ eventCount: 2, failedActions: 1, failureEvidenceEvents: 1 });
    expect(
      paired.actionGroups.find((group) => group.action === "failure-evidence")?.artifactPaths,
    ).toEqual(["failure.png"]);
    expect(patentE2EExitCode(paired)).toBe(1);
    const unpaired = summarize([evidence]);
    expect(unpaired.failedActions).toBe(1);
    expect(patentE2EExitCode(unpaired)).toBe(1);
  });

  test("validates deterministic event order and rejects missing or repeated sequence numbers", () => {
    const first = createPatentE2EEvent({
      runId: "run-1",
      sequence: 1,
      patentId: "us-1",
      route: "/patents/us-1",
      viewport: "desktop",
      face: "route",
      action: "http-200",
      status: "pass",
      durationMs: 1,
    });
    const second = createPatentE2EEvent({
      runId: "run-1",
      sequence: 2,
      patentId: "us-1",
      route: "/patents/us-1",
      viewport: "desktop",
      face: "route",
      action: "identity",
      status: "pass",
      durationMs: 1,
    });
    expect(validatePatentE2EEventOrder([first, second])).toEqual([]);
    expect(validatePatentE2EEventOrder([second, first])).toEqual([
      "event index 0 has sequence 2; expected 1",
      "event index 1 has sequence 1; expected 2",
    ]);
    expect(() => serializePatentE2EEvent({ ...first, sequence: 0 })).toThrow(
      "sequence must be a positive integer",
    );
  });

  test("allows only documented cancellation noise and rejects actionable browser failures", () => {
    expect(classifyPatentE2EDiagnostic("[http 404] /favicon.ico")).toMatchObject({
      allowed: true,
    });
    expect(
      classifyPatentE2EDiagnostic(
        "[requestfailed] GET http://localhost/_next/static/chunk.js net::ERR_ABORTED",
      ),
    ).toMatchObject({ allowed: true });
    expect(classifyPatentE2EDiagnostic("[http 500] /patents/us-1").allowed).toBe(false);
    expect(classifyPatentE2EDiagnostic("[pageerror] hydration failed").allowed).toBe(false);
    expect(classifyPatentE2EDiagnostic("[http 400] /_next/static/chunk.js").allowed).toBe(false);
  });
});
