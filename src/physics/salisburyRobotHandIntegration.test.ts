import { describe, expect, it } from "bun:test";
import { ALL_COLORIZED_EQUATIONS } from "@/data/colorizedEquations";
import { applyClaimConstraintModifications, CATALOG_CLAIM_CONSTRAINTS } from "./claimConstraints";
import { ENERGY_CHANNEL_OMISSION_REASONS, energyChannelsFor } from "./energyChannels";
import { FrankenSimEngine } from "./engine";
import { SALISBURY_HAND_DEFAULT_CONTROLS } from "./salisburyRobotHandKernel";
import { specClausesFor } from "./specClauses";
import { PATENT_PHYSICS_REGISTRY } from "./telemetryData";

const PATENT_ID = "us-4921293-salisbury-robot-hand";
const DEFAULT_PARAMS: Record<string, number> = {
  tensionT1N: SALISBURY_HAND_DEFAULT_CONTROLS.tensionT1N,
  tensionT2N: SALISBURY_HAND_DEFAULT_CONTROLS.tensionT2N,
  tensionT3N: SALISBURY_HAND_DEFAULT_CONTROLS.tensionT3N,
  tensionT4N: SALISBURY_HAND_DEFAULT_CONTROLS.tensionT4N,
  radiusScaleMm: SALISBURY_HAND_DEFAULT_CONTROLS.radiusScaleMm,
  firstIdlerFixed: 1,
};

describe("US 4,921,293 Salisbury hand full physics weave", () => {
  it("routes every public control and metric through the source-bounded engine step", () => {
    const entry = PATENT_PHYSICS_REGISTRY[PATENT_ID];
    expect(entry).toBeDefined();
    expect(entry.engineMethod).toBe("FrankenSimEngine.stepSalisburyRobotHand");
    expect(entry.controls.map((control) => control.id)).toEqual([
      "tensionT1N",
      "tensionT2N",
      "tensionT3N",
      "tensionT4N",
      "radiusScaleMm",
      "firstIdlerFixed",
    ]);
    expect(
      entry.controls
        .slice(0, 4)
        .every((control) => control.label.startsWith("Representative digit")),
    ).toBe(true);
    expect(entry.pedagogicalInsight).toContain("mirrors the representative digit pose");

    const metrics = entry.computeMetrics(DEFAULT_PARAMS);
    expect(metrics.map((metric) => metric.label)).toEqual([
      "Axis 1 source torque",
      "Axis 2 source torque",
      "Axis 3 source torque",
      "Connected source topology",
      "Historic dynamics",
    ]);
    expect(metrics.slice(0, 3).every((metric) => Number.isFinite(Number(metric.value)))).toBe(true);
    expect(metrics[3]?.value).toBe("3 palm-rooted digits / 9 joints / 12 cable ends");
    expect(metrics[4]?.value).toBe("not disclosed");
  });

  it("publishes only the three equations printed beside Figure 3", () => {
    const equations = ALL_COLORIZED_EQUATIONS[PATENT_ID];
    expect(equations).toHaveLength(1);
    expect(equations[0]?.id).toBe("salisbury-figure-3-torque-map");
    expect(equations[0]?.rawLatex).toBe(
      "\\begin{aligned}\\tau_1&=-T_1R_1+T_2R_2+T_3R_2-T_4R_1\\\\\\tau_2&=T_1R_3+T_2R_2-T_3R_2-T_4R_3\\\\\\tau_3&=T_2R_2-T_3R_2\\end{aligned}",
    );
    expect(
      equations[0]?.variables.map((variable) => variable.telemetryKey).filter(Boolean),
    ).toEqual(["tensionT1N", "tensionT2N", "tensionT3N", "tensionT4N", "radiusScaleMm"]);
  });

  it("weaves exact source clauses without manufacturing missing dynamics", () => {
    const clauses = specClausesFor(PATENT_ID, DEFAULT_PARAMS);
    expect(clauses.map((clause) => clause.id)).toEqual([
      "salisbury-connected-arm-hand",
      "salisbury-four-contiguous-pulleys",
      "salisbury-base-paired-pull",
      "salisbury-strain-tension",
      "salisbury-radius-boundary",
      "salisbury-claim-2-idler",
    ]);
    expect(clauses.every((clause) => !clause.caption.includes("NaN"))).toBe(true);
    expect(clauses.at(-1)?.active).toBe(true);

    const releasedIdler = specClausesFor(PATENT_ID, {
      ...DEFAULT_PARAMS,
      firstIdlerFixed: 0,
    });
    expect(releasedIdler.at(-1)?.active).toBe(false);
    expect(releasedIdler.at(-1)?.tone).toBe("broken");
  });

  it("keeps Claim 1 and Claim 2 inversions inside their documented boundaries", () => {
    expect(
      CATALOG_CLAIM_CONSTRAINTS[PATENT_ID]?.map((constraint) => constraint.claimNumber),
    ).toEqual([1, 2]);

    const claimOneRemoved = applyClaimConstraintModifications(PATENT_ID, DEFAULT_PARAMS, {
      1: false,
      2: true,
    });
    expect([
      claimOneRemoved.modifiedParams.tensionT1N,
      claimOneRemoved.modifiedParams.tensionT2N,
      claimOneRemoved.modifiedParams.tensionT3N,
      claimOneRemoved.modifiedParams.tensionT4N,
    ]).toEqual([0, 0, 0, 0]);
    expect(claimOneRemoved.refusalWarning).toContain("no historic cable pretension");

    const claimTwoRemoved = applyClaimConstraintModifications(PATENT_ID, DEFAULT_PARAMS, {
      1: true,
      2: false,
    });
    expect(claimTwoRemoved.modifiedParams.firstIdlerFixed).toBe(0);
    expect(claimTwoRemoved.modifiedParams.tensionT1N).toBe(DEFAULT_PARAMS.tensionT1N);
    expect(claimTwoRemoved.refusalWarning).toContain("does not authorize");
  });

  it("exposes the connected topology while refusing an invented power balance", () => {
    const state = FrankenSimEngine.stepSalisburyRobotHand(SALISBURY_HAND_DEFAULT_CONTROLS);
    expect(state.scalarJointCoordinates).toBe(9);
    expect(state.digitCount).toBe(3);
    expect(state.palmRootPresent).toBe(true);
    expect(state.jointParentCoordinates).toEqual([-1, 0, 1, -1, 3, 4, -1, 6, 7]);
    expect(state.cableEndCount).toBe(12);
    expect(state.axis1).toEqual([0, 1, 0]);
    expect(state.axis2).toEqual([1, 0, 0]);
    expect(state.axis3).toEqual([1, 0, 0]);
    expect(state.historicalDynamicsAvailable).toBe(false);
    expect(state.historicalDynamicsRefusal).toContain("force closure");

    expect(energyChannelsFor(PATENT_ID, DEFAULT_PARAMS)).toEqual([]);
    expect(ENERGY_CHANNEL_OMISSION_REASONS[PATENT_ID]).toContain("no cable speed");
    expect(ENERGY_CHANNEL_OMISSION_REASONS[PATENT_ID].length).toBeGreaterThan(80);
  });
});
