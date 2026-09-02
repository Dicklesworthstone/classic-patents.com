import { describe, expect, test } from "bun:test";
import * as fs from "node:fs";
import * as path from "node:path";
import { getColorizedEquationsForPatent } from "../src/data/colorizedEquations";
import {
  archivalEditionForPublication,
  evaluateArchivalPublicationState,
} from "../src/data/editions/publicationApproval";
import { allPatents } from "../src/data/patents";
import { CATALOG_CLAIM_CONSTRAINTS } from "../src/physics/claimConstraints";
import { energyChannelsFor } from "../src/physics/energyChannels";
import { PATENT_PHYSICS_REGISTRY } from "../src/physics/telemetryData";
import type { Patent } from "../src/types/patent";
import {
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
        patent("us-2-withheld"),
      ],
      {
        isEditionPublished: (entry) => entry.id === "us-1-published",
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

    expect(scenarios).toHaveLength(2);
    expect(scenarios[0]).toMatchObject({
      patentId: "us-1-published",
      route: "/patents/us-1-published",
      sourceState: "published",
      sourcePublicationState: "accepted",
      sourceReasonCode: "ACCEPTED",
      claimCount: 1,
      drawingCount: 1,
      hasReviewedLedger: true,
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
    expect(scenarios[1]?.sourceState).toBe("withheld");
  });

  test("rejects duplicate catalogue ids and missing or non-canonical PDF assets", () => {
    const facts = { isEditionPublished: () => false, assetExists: () => true };
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
      isEditionPublished: () => true,
    });
    expect(selectPatentE2EScenarios(scenarios, ["us-2", "us-2"])).toHaveLength(1);
    expect(() => selectPatentE2EScenarios(scenarios, ["us-404"])).toThrow("Unknown patent E2E id");
  });

  test("builds an exact manifest from the live catalogue and all pinned PDFs", () => {
    const scenarios = buildPatentE2EScenarios(allPatents, {
      isEditionPublished: (entry) => Boolean(archivalEditionForPublication(entry)),
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
    expect(scenarios.some((scenario) => scenario.sourceState === "published")).toBe(true);
    expect(scenarios.some((scenario) => scenario.sourceState === "withheld")).toBe(true);
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

    for (const scenario of scenarios) {
      for (const previewUrl of scenario.figurePreviewUrls) {
        expect(previewUrl.startsWith("/patents/figures/")).toBe(true);
      }
    }
  });
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
      isEditionPublished: () => true,
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
