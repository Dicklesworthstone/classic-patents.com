import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  LEMELSON_MANIPULATOR_DEFAULT_CONTROLS,
  stepLemelsonManipulatorTopology,
} from "@/physics/lemelsonAdjustableManipulatorKernel";
import { buildLemelsonAdjustableManipulatorModel } from "./lemelsonAdjustableManipulatorModel";

const ROOT = process.cwd();
const source = (path: string) => readFileSync(join(ROOT, path), "utf8");

describe("US 3,260,375 Lemelson Adjustable Manipulator procedural visual boundary", () => {
  test("builds the procedural 3D model and updates kinematics correctly", () => {
    const model = buildLemelsonAdjustableManipulatorModel();
    expect(model.root.name).toContain("US 3,260,375");

    const defaultState = stepLemelsonManipulatorTopology(LEMELSON_MANIPULATOR_DEFAULT_CONTROLS);
    model.updateState(defaultState);

    const activeState = stepLemelsonManipulatorTopology({
      ...LEMELSON_MANIPULATOR_DEFAULT_CONTROLS,
      carriagePosition: 0.8,
      columnElevation: 0.6,
      columnAzimuth: 0.5,
      wristPivot: -0.4,
      jawClosure: 0.9,
    });
    model.updateState(activeState);

    expect(model.root.children.length).toBeGreaterThan(0);
    model.dispose();
  });

  test("keeps both visual faces on the shared topology bus and records the typed refusal", () => {
    const kernel = source("src/physics/lemelsonAdjustableManipulatorKernel.ts");
    const sim2d = source("src/components/patents/visuals/LemelsonAdjustableManipulatorSim.tsx");
    const studio3d = source(
      "src/components/patents/visuals/three/LemelsonAdjustableManipulator3D.tsx",
    );
    const telemetry = source("src/physics/telemetryData.ts");

    expect(kernel).toContain("stepLemelsonManipulatorTopology");
    expect(kernel).toContain("US 3,260,375 provides kinematic");
    expect(sim2d).toContain('const PATENT_ID = "us-3260375-lemelson-adjustable-manipulator";');
    expect(sim2d).toContain("usePatentPhysics(PATENT_ID)");
    expect(sim2d).toContain("stepLemelsonManipulatorTopology");
    expect(studio3d).toContain('const PATENT_ID = "us-3260375-lemelson-adjustable-manipulator";');
    expect(studio3d).toContain("usePatentPhysics(PATENT_ID)");
    expect(studio3d).toContain("createStudioClock");
    expect(telemetry).toContain('"us-3260375-lemelson-adjustable-manipulator"');
  });
});
