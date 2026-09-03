import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { FrankenSimEngine } from "./engine";
import { readKamenTransporterControls } from "./kamenTransporterKernel";
import { computeParameterSensitivity } from "./sensitivityKernel";

const KAMEN_ID = "us-5701965-kamen-transporter";

function sourceCase(source: string, patentId: string, nextPatentId: string): string {
  const start = source.indexOf(`case "${patentId}":`);
  const end = source.indexOf(`case "${nextPatentId}":`, start);
  if (start < 0 || end < 0) {
    throw new Error(`Could not isolate the ${patentId} sensitivity branch.`);
  }
  return source.slice(start, end);
}

describe("Kamen transporter public source-bound engine boundary", () => {
  test("publishes only the reviewed topology, even when the legacy time argument is supplied", () => {
    const state = FrankenSimEngine.stepKamenTransporter(
      readKamenTransporterControls({ topologyState: 4 }),
      12,
    );

    expect(state).toMatchObject({
      topologyState: "climb",
      balanceLoopActive: true,
      clusterTopologyActive: true,
      stairSequenceActive: true,
      wheelControlMode: "balance-and-cluster-coordination",
      sourceClaimNumbers: [21, 22, 26],
    });
    expect(Object.keys(state).sort()).toEqual(
      [
        "balanceLoopActive",
        "clusterDisplayPoseRad",
        "clusterTopologyActive",
        "sourceBoundary",
        "sourceClaimNumbers",
        "stairSequenceActive",
        "stateLabel",
        "topologyState",
        "wheelControlMode",
      ].sort(),
    );
  });

  test("does not retain the retired SI step in the public engine wrapper", () => {
    const source = readFileSync(join(process.cwd(), "src", "physics", "engine.ts"), "utf8");
    const start = source.indexOf("stepKamenTransporter(");
    const end = source.indexOf("stepWatsonRcc(", start);
    const publicMethod = source.slice(start, end);

    expect(publicMethod).toContain("stepKamenTransporterTopology");
    expect(publicMethod).not.toContain("stepKamenTransporterSi");
    expect(publicMethod).not.toMatch(/torque|speed|mass|pid|N·m|m\/s/i);
  });

  test("refuses continuous sensitivity for both topology and retired scenario controls", () => {
    for (const control of [
      "topologyState",
      "riderPitchLeanDeg",
      "pitchLean",
      "velocityCommandMs",
      "velocityCommand",
      "riderMassKg",
    ]) {
      expect(computeParameterSensitivity(KAMEN_ID, control, {})).toBeNull();
    }

    const source = readFileSync(
      join(process.cwd(), "src", "physics", "sensitivityKernel.ts"),
      "utf8",
    );
    const kamenBranch = sourceCase(source, KAMEN_ID, "us-4976582-clavel-delta-robot");
    expect(kamenBranch).not.toMatch(/torque|speed|mass|pid|N·m|m\/s/i);
  });
});
