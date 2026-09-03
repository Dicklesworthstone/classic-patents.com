import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stepGoertzMasterSlaveTopology } from "@/physics/goertzElectronicMasterSlaveManipulatorKernel";
import { buildGoertzElectronicMasterSlaveManipulatorModel } from "./goertzElectronicMasterSlaveManipulatorModel";

const THREE_DIRECTORY = join(process.cwd(), "src", "components", "patents", "visuals", "three");

describe("US 2,846,084 Goertz procedural visual boundary", () => {
  test("builds named source-topology assemblies and updates them from the shared seven channels", () => {
    const model = buildGoertzElectronicMasterSlaveManipulatorModel();
    expect(model.root.getObjectByName("master support 50")).toBeDefined();
    expect(model.root.getObjectByName("master first arm 51")).toBeDefined();
    expect(model.root.getObjectByName("slave second arm 52")).toBeDefined();
    expect(model.root.getObjectByName("master axes 171 and 172 tool joint")).toBeDefined();
    expect(
      model.root.getObjectByName("seven duplicated electrical correspondence systems"),
    ).toBeDefined();

    const reflected = stepGoertzMasterSlaveTopology({
      horizontalArmPivot: 0.5,
      contactResistance: 0.9,
      tachometerDampingEnabled: 0,
      limiterEnabled: 0,
      forceReflectionEnabled: 1,
    });
    model.updatePose(reflected);
    expect(model.root.getObjectByName("Claim 9 reflected-resistance indicator")?.visible).toBe(
      true,
    );

    model.updatePose(
      stepGoertzMasterSlaveTopology({
        horizontalArmPivot: 0.5,
        contactResistance: 0.9,
        tachometerDampingEnabled: 0,
        limiterEnabled: 0,
        forceReflectionEnabled: 0,
      }),
    );
    expect(model.root.getObjectByName("Claim 9 reflected-resistance indicator")?.visible).toBe(
      false,
    );
    model.dispose();
  });

  test("keeps both visual faces on the shared bus and does not present invented physics", () => {
    const modelSource = readFileSync(
      join(THREE_DIRECTORY, "goertzElectronicMasterSlaveManipulatorModel.ts"),
      "utf8",
    );
    const studioSource = readFileSync(
      join(THREE_DIRECTORY, "GoertzElectronicMasterSlaveManipulator3D.tsx"),
      "utf8",
    );
    const simSource = readFileSync(
      join(
        process.cwd(),
        "src",
        "components",
        "patents",
        "visuals",
        "GoertzElectronicMasterSlaveManipulatorSim.tsx",
      ),
      "utf8",
    );

    expect(modelSource).toContain("first arm 51");
    expect(modelSource).toContain("second arm 52");
    expect(modelSource).toContain("source cable route");
    expect(modelSource).not.toContain("useGLTF");
    expect(modelSource).not.toContain(".gltf");
    expect(modelSource).not.toContain(".glb");
    expect(modelSource).not.toContain("Math.random");
    expect(studioSource).toContain("createThreeStudioScene");
    expect(studioSource).toContain("usePatentPhysics");
    expect(studioSource).toContain("useFrankenSimPhysics");
    expect(studioSource).toContain("isRefused: true");
    expect(studioSource).toContain("stepGoertzMasterSlaveTopology");
    expect(studioSource).toContain("ClaimConstraintToggle");
    expect(studioSource).toContain("effectiveParams");
    expect(studioSource).toContain('role="status"');
    expect(studioSource).not.toContain("Math.random");
    expect(studioSource).not.toContain("performance.now()");
    expect(simSource).toContain("usePatentPhysics");
    expect(simSource).toContain("ClaimConstraintToggle");
    expect(simSource).toContain("claimConstraintStateParamId");
    expect(simSource).toContain("effectiveParams");
    expect(simSource).toContain('role="status"');
    expect(simSource).toContain("normalized source topology");
  });
});
