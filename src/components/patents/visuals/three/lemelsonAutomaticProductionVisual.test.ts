import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ALL_COLORIZED_EQUATIONS } from "@/data/colorizedEquations";
import { stepLemelsonAutomaticProductionTopology } from "@/physics/lemelsonAutomaticProductionKernel";
import { PATENT_PHYSICS_REGISTRY } from "@/physics/telemetryData";
import { buildLemelsonAutomaticProductionModel } from "./lemelsonAutomaticProductionModel";

const PATENT_ID = "us-3313014-lemelson-automatic-production";
const THREE_DIRECTORY = join(process.cwd(), "src", "components", "patents", "visuals", "three");

describe("US 3,313,014 automatic-production source-bounded visual", () => {
  test("keeps the carrier, column, platform, portable controller, and station interface connected", () => {
    const model = buildLemelsonAutomaticProductionModel();
    expect(model.root.getObjectByName("Overhead trackway 21 and slide bars 28")).toBeDefined();
    expect(
      model.root.getObjectByName("Carrier 22 with vertical column 23 and portable controller 47"),
    ).toBeDefined();
    expect(model.root.getObjectByName("Vertical column 23 and Mz guide")).toBeDefined();
    expect(model.root.getObjectByName("Platform beam 35 and My rack reach")).toBeDefined();
    expect(
      model.root.getObjectByName("Controller-to-station coupling path 85/86/87"),
    ).toBeDefined();

    model.update(
      stepLemelsonAutomaticProductionTopology({
        carrierAddressFraction: 0.5,
        liftFraction: 0.5,
        reachFraction: 0.8,
        stationDetected: 1,
        stationCoupled: 1,
        cycleProgress: 0.6,
      }),
    );
    expect(
      model.root.getObjectByName("Controller-to-station coupling path 85/86/87")?.visible,
    ).toBe(true);
    model.update(
      stepLemelsonAutomaticProductionTopology({
        stationDetected: 1,
        stationCoupled: 0,
        cycleProgress: 0.6,
      }),
    );
    expect(
      model.root.getObjectByName("Controller-to-station coupling path 85/86/87")?.visible,
    ).toBe(false);
    expect(() => model.dispose()).not.toThrow();
  });

  test("keeps both visual faces on the shared bus and declares the numerical boundary", () => {
    const modelSource = readFileSync(
      join(THREE_DIRECTORY, "lemelsonAutomaticProductionModel.ts"),
      "utf8",
    );
    const studioSource = readFileSync(
      join(THREE_DIRECTORY, "LemelsonAutomaticProduction3D.tsx"),
      "utf8",
    );
    const simSource = readFileSync(
      join(
        process.cwd(),
        "src",
        "components",
        "patents",
        "visuals",
        "LemelsonAutomaticProductionSim.tsx",
      ),
      "utf8",
    );

    expect(modelSource).toContain("no dimensions");
    expect(modelSource).toContain("Fixed contacts 87");
    expect(modelSource).not.toContain("useGLTF");
    expect(modelSource).not.toContain(".gltf");
    expect(modelSource).not.toContain(".glb");
    expect(modelSource).not.toContain("Math.random");
    expect(studioSource).toContain("createThreeStudioScene");
    expect(studioSource).toContain("usePatentPhysics");
    expect(studioSource).toContain("useFrankenSimPhysics");
    expect(studioSource).toContain("isRefused: true");
    expect(studioSource).toContain("stepLemelsonAutomaticProductionTopology");
    expect(studioSource).not.toContain("Math.random");
    expect(studioSource).not.toContain("performance.now()");
    expect(simSource).toContain("usePatentPhysics");
    expect(simSource).toContain("Quantitative refusal");
  });

  test("publishes only normalized topology metrics and a source-bounded equation", () => {
    const registry = PATENT_PHYSICS_REGISTRY[PATENT_ID];
    const equations = ALL_COLORIZED_EQUATIONS[PATENT_ID];
    expect(registry.engineMethod).toContain("source-bounded topology");
    expect(JSON.stringify(registry)).not.toContain("mechanicalPowerWatts");
    expect(JSON.stringify(registry)).not.toContain("speedMps");
    expect(equations).toHaveLength(1);
    expect(equations[0]?.rawLatex).toContain("m_{recognized}");
    expect(JSON.stringify(equations)).not.toContain("claimRef");
  });
});
