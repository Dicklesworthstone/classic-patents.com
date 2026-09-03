import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
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
    expect(model.root.getObjectByName("master correspondence-system riser")).toBeDefined();
    expect(model.root.getObjectByName("slave correspondence-system riser")).toBeDefined();
    expect(model.root.getObjectByName("master grasper jaw carrier")).toBeDefined();

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

  test("keeps fixed cable buffers and closes the visual signal and gripper paths", () => {
    const model = buildGoertzElectronicMasterSlaveManipulatorModel();
    try {
      const masterCable = model.root.getObjectByName("master source cable route 160–164");
      expect(masterCable).toBeInstanceOf(THREE.Line);
      if (!(masterCable instanceof THREE.Line)) throw new Error("Master cable line is missing.");
      const originalPositionAttribute = masterCable.geometry.getAttribute("position");
      model.updatePose(stepGoertzMasterSlaveTopology({ horizontalArmPivot: -0.4 }));
      model.updatePose(stepGoertzMasterSlaveTopology({ horizontalArmPivot: 0.7 }));
      expect(masterCable.geometry.getAttribute("position")).toBe(originalPositionAttribute);

      model.root.updateMatrixWorld(true);
      const box = (name: string) => {
        const part = model.root.getObjectByName(name);
        expect(part).toBeDefined();
        return new THREE.Box3().setFromObject(part as THREE.Object3D);
      };
      expect(
        box("master correspondence-system riser").intersectsBox(
          box("seven duplicated electrical correspondence systems"),
        ),
      ).toBe(true);
      expect(
        box("slave correspondence-system riser").intersectsBox(
          box("seven duplicated electrical correspondence systems"),
        ),
      ).toBe(true);
      expect(box("master grasper jaw carrier").intersectsBox(box("master grasper jaw A"))).toBe(
        true,
      );
      expect(box("master grasper jaw carrier").intersectsBox(box("master grasper jaw B"))).toBe(
        true,
      );
      expect(box("master grasper jaw carrier").intersectsBox(box("master tool 53 stem"))).toBe(
        true,
      );
      expect(model.root.getObjectByName("master grasper jaw carrier")?.position.z).toBeLessThan(
        model.root.getObjectByName("master grasper jaw A")?.position.z ?? -Infinity,
      );
    } finally {
      model.dispose();
    }
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
    expect(studioSource).toContain('data-mobile-layout="controls-below-canvas"');
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
