import { describe, expect, it } from "bun:test";
import { ALL_COLORIZED_EQUATIONS } from "@/data/colorizedEquations";
import { applyClaimConstraintModifications, CATALOG_CLAIM_CONSTRAINTS } from "./claimConstraints";
import {
  CLAVEL_DELTA_ROBOT_DEFAULT_CONTROLS,
  stepClavelDeltaRobotTopology,
} from "./clavelDeltaRobotKernel";
import { ENERGY_CHANNEL_OMISSION_REASONS, energyChannelsFor } from "./energyChannels";
import { FrankenSimEngine } from "./engine";
import { specClausesFor } from "./specClauses";
import { PATENT_PHYSICS_REGISTRY } from "./telemetryData";

const PATENT_ID = "us-4976582-clavel-delta-robot";
const DEFAULT_PARAMS: Record<string, number> = {
  ...CLAVEL_DELTA_ROBOT_DEFAULT_CONTROLS,
} as Record<string, number>;

describe("US 4,976,582 Clavel Delta robot complete source-bounded weave", () => {
  it("routes the shared controls and metrics through one explicit no-WASM topology step", () => {
    const entry = PATENT_PHYSICS_REGISTRY[PATENT_ID];
    expect(entry).toBeDefined();
    expect(entry.domain).toBe("source_bounded_robot_kinematics");
    expect(entry.engineMethod).toBe(
      "stepClavelDeltaRobotTopology (source-bounded TypeScript normalized closed-chain topology; generic fs-mbd lacks holonomic loop constraints; no FrankenSim/WASM module)",
    );
    expect(entry.controls.map((control) => control.id)).toEqual([
      "armOneInput",
      "armTwoInput",
      "armThreeInput",
      "toolAxisInput",
      "claim1TopologyEnabled",
      "claim2PairedBarsEnabled",
      "claim8BaseMotorEnabled",
    ]);

    const metrics = entry.computeMetrics(DEFAULT_PARAMS);
    expect(metrics.map((metric) => metric.label)).toEqual([
      "Claim Topology",
      "Paired Bars",
      "Declared bar length",
      "Rigid-link closure residual",
      "Pair-vector residual",
      "Platform center",
      "Physical performance",
    ]);
    expect(metrics[0]?.value).toBe("VISIBLE");
    expect(metrics[1]?.value).toBe("2 / LEG");
    expect(metrics[2]?.value).toBe("1.653");
    expect(metrics[3]?.value).toMatch(/^\d\.\d\de[+-]\d+$/);
    expect(metrics[4]?.value).toBe("0.000");
    expect(metrics.at(-1)?.value).toBe("refused");
    expect(metrics.at(-1)?.provenance).toBe("refusal-bounded");
  });

  it("shares the deterministic paired-bar state with the engine facade", () => {
    const params = { ...DEFAULT_PARAMS, armOneInput: 0.4, armTwoInput: -0.2 };
    const kernelState = stepClavelDeltaRobotTopology(params);
    expect(FrankenSimEngine.stepClavelDeltaRobotTopology(params)).toEqual(kernelState);
    expect(kernelState.legs).toHaveLength(3);
    expect(kernelState.legs.every((leg) => leg.pairedBarVectorError < 1e-9)).toBe(true);
    expect(kernelState.legs.every((leg) => leg.pairedBarLengthError < 1e-9)).toBe(true);
    expect(kernelState.closureResidual).toBeLessThan(1e-9);
    expect(kernelState.configurationRefusal.refused).toBe(false);
    expect(kernelState.platformAttitudeDeviation).toBe(0);
    expect(kernelState.refusal.reason).toContain("no calibrated dimensions");
  });

  it("binds the normalized rigid paired-bar equation only to declared telemetry", () => {
    const equations = ALL_COLORIZED_EQUATIONS[PATENT_ID];
    expect(equations).toHaveLength(1);
    expect(equations[0]?.id).toBe("clavel-delta-paired-bar-attitude-invariant");
    expect(equations[0]?.claimRef).toBe(2);
    expect(equations[0]?.rawLatex).toContain("\\lVert\\mathbf{l}_{i,a}^{*}\\rVert");
    expect(equations[0]?.rawLatex).toContain("\\mathbf{l}_{i,a}^{*}-\\mathbf{l}_{i,b}^{*}");
    expect(
      equations[0]?.variables.map((variable) => variable.telemetryMetricLabel).filter(Boolean),
    ).toEqual([
      "Platform center",
      "Declared bar length",
      "Rigid-link closure residual",
      "Pair-vector residual",
      "Paired Bars",
    ]);
    expect(
      equations[0]?.variables.find((variable) => variable.id === "actuator_input")?.telemetryKey,
    ).toBe("armOneInput");
  });

  it("weaves exact source clauses and leaves each withdrawn construction unscored", () => {
    const active = specClausesFor(PATENT_ID, DEFAULT_PARAMS);
    expect(active.map((clause) => clause.id)).toEqual([
      "clavel-delta-fixed-orientation",
      "clavel-delta-two-parallel-bars",
      "clavel-delta-supplementary-motor",
    ]);
    expect(active.every((clause) => clause.active)).toBe(true);

    const withheld = specClausesFor(PATENT_ID, {
      ...DEFAULT_PARAMS,
      claim1TopologyEnabled: 0,
      claim2PairedBarsEnabled: 0,
      claim8BaseMotorEnabled: 0,
    });
    expect(withheld.every((clause) => !clause.active)).toBe(true);
    expect(withheld.every((clause) => clause.tone === "broken")).toBe(true);
  });

  it("keeps Claim 1, Claim 2, and Claim 8 inversions inside legal-topology bounds", () => {
    expect(
      CATALOG_CLAIM_CONSTRAINTS[PATENT_ID]?.map((constraint) => constraint.claimNumber),
    ).toEqual([1, 2, 8]);

    const comparison = applyClaimConstraintModifications(PATENT_ID, DEFAULT_PARAMS, {
      1: true,
      2: false,
      8: false,
    });
    expect(comparison.modifiedParams.claim2PairedBarsEnabled).toBe(0);
    expect(comparison.modifiedParams.claim8BaseMotorEnabled).toBe(0);
    expect(comparison.activeFailures).toHaveLength(2);
    expect(comparison.refusalWarning).toBeNull();
  });

  it("refuses an invented energy balance", () => {
    expect(energyChannelsFor(PATENT_ID, DEFAULT_PARAMS)).toEqual([]);
    expect(ENERGY_CHANNEL_OMISSION_REASONS[PATENT_ID]).toContain("no dimensions");
    expect(ENERGY_CHANNEL_OMISSION_REASONS[PATENT_ID].length).toBeGreaterThan(80);
  });
});
