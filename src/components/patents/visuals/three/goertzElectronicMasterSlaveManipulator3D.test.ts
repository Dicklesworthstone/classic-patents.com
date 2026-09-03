import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import { stepGoertzMasterSlaveTopology } from "@/physics/goertzElectronicMasterSlaveManipulatorKernel";
import { buildGoertzElectronicMasterSlaveManipulatorModel } from "./goertzElectronicMasterSlaveManipulatorModel";

const THREE_DIRECTORY = join(process.cwd(), "src", "components", "patents", "visuals", "three");

function objectBox(root: THREE.Object3D, name: string): THREE.Box3 {
  const object = root.getObjectByName(name);
  expect(object).toBeDefined();
  return new THREE.Box3().setFromObject(object as THREE.Object3D);
}

describe("US 2,846,084 Goertz source-shaped visual boundary", () => {
  test("reconstructs both Figure 1 arm stacks and all seven source transmission paths", () => {
    const model = buildGoertzElectronicMasterSlaveManipulatorModel();
    try {
      const expectedNames = [
        "master support 50 wall anchor",
        "master upper hollow support portion 61",
        "master support leg 62",
        "master support leg 63",
        "master carriage 66",
        "master generally horizontal first arm 51",
        "master counterweight rod 117",
        "master second-arm transverse pivot group axis 126",
        "master nonrotatable outer section 130 of arm 52",
        "master rotatable inner tube 146 of generally vertical second arm 52",
        "master tool transverse pivot group axis 171",
        "master tool transverse pivot group axis 172",
        "master tool 53 fixed hand grip",
        "master tool 53 movable closing handle",
        "slave grasper 53 jaw carrier",
        "slave grasper 53 jaw A",
        "slave grasper 53 jaw B",
        "sealed-cell separation plane",
      ];
      expectedNames.forEach((name) => {
        expect(model.root.getObjectByName(name)).toBeDefined();
      });

      for (let channel = 1; channel <= 7; channel += 1) {
        expect(
          model.root.getObjectByName(`electrical correspondence channel ${channel}`),
        ).toBeInstanceOf(THREE.Line);
      }
      for (const unit of ["master", "slave"]) {
        for (const cable of ["160", "161", "162", "163", "164", "175", "176"]) {
          expect(
            model.root.getObjectByName(`${unit} source cable ${cable} routed through arms`),
          ).toBeInstanceOf(THREE.Line);
        }
      }
    } finally {
      model.dispose();
    }
  });

  test("keeps every moving member in a connected parent chain and every support grounded", () => {
    const model = buildGoertzElectronicMasterSlaveManipulatorModel();
    try {
      model.updatePose(
        stepGoertzMasterSlaveTopology({
          horizontalArmPivot: 0.7,
          horizontalArmRoll: -0.6,
          verticalArmPivot: 0.55,
          verticalArmRoll: -0.4,
          toolAxis171: 0.5,
          toolAxis172: -0.45,
          gripperClosure: 0.72,
          contactResistance: 0.6,
        }),
      );
      model.root.updateMatrixWorld(true);

      expect(
        model.root.getObjectByName("master horizontal-arm longitudinal roll group")?.parent?.name,
      ).toBe("master transverse pivot group axis 113b");
      expect(
        model.root.getObjectByName("master second-arm transverse pivot group axis 126")?.parent
          ?.name,
      ).toBe("master horizontal-arm longitudinal roll group");
      expect(
        model.root.getObjectByName("master vertical-arm longitudinal roll group")?.parent?.name,
      ).toBe("master second-arm transverse pivot group axis 126");
      expect(
        model.root.getObjectByName("master tool transverse pivot group axis 171")?.parent?.name,
      ).toBe("master vertical-arm longitudinal roll group");
      expect(
        model.root.getObjectByName("master tool transverse pivot group axis 172")?.parent?.name,
      ).toBe("master tool transverse pivot group axis 171");

      expect(
        objectBox(model.root, "master support 50 wall anchor").intersectsBox(
          objectBox(model.root, "master structural wall"),
        ),
      ).toBe(true);
      expect(
        objectBox(model.root, "master upper hollow support portion 61").intersectsBox(
          objectBox(model.root, "master support 50 wall anchor"),
        ),
      ).toBe(true);
      expect(
        objectBox(model.root, "master support leg 62").intersectsBox(
          objectBox(model.root, "master upper hollow support portion 61"),
        ),
      ).toBe(true);
      expect(
        objectBox(model.root, "master carriage 66 cross shaft axis 113b").intersectsBox(
          objectBox(model.root, "master support leg 62"),
        ),
      ).toBe(true);
      expect(
        objectBox(model.root, "master generally horizontal first arm 51").intersectsBox(
          objectBox(model.root, "master carriage 66"),
        ),
      ).toBe(true);
      expect(
        objectBox(model.root, "master nonrotatable outer section 130 of arm 52").intersectsBox(
          objectBox(model.root, "master arm 51 to arm 52 joint"),
        ),
      ).toBe(true);
      expect(
        objectBox(
          model.root,
          "master rotatable inner tube 146 of generally vertical second arm 52",
        ).intersectsBox(objectBox(model.root, "master nonrotatable outer section 130 of arm 52")),
      ).toBe(true);
      expect(
        objectBox(model.root, "slave grasper 53 jaw carrier").intersectsBox(
          objectBox(model.root, "slave grasper 53 jaw A"),
        ),
      ).toBe(true);
      expect(
        objectBox(model.root, "slave grasper 53 jaw carrier").intersectsBox(
          objectBox(model.root, "slave grasper 53 jaw B"),
        ),
      ).toBe(true);

      const floor = objectBox(model.root, "hot-cell exhibit foundation");
      expect(floor.intersectsBox(objectBox(model.root, "master structural wall"))).toBe(true);
      expect(floor.intersectsBox(objectBox(model.root, "slave sealed-cell structural wall"))).toBe(
        true,
      );
      expect(floor.intersectsBox(objectBox(model.root, "sealed-cell separation plane"))).toBe(true);
    } finally {
      model.dispose();
    }
  });

  test("keeps cable buffers stable while their attached arm route follows pose changes", () => {
    const model = buildGoertzElectronicMasterSlaveManipulatorModel();
    try {
      const cable = model.root.getObjectByName("master source cable 160 routed through arms");
      expect(cable).toBeInstanceOf(THREE.Line);
      if (!(cable instanceof THREE.Line)) throw new Error("Master cable 160 is missing.");
      const originalPositionAttribute = cable.geometry.getAttribute("position");
      model.updatePose(stepGoertzMasterSlaveTopology({ horizontalArmPivot: -0.4 }));
      const before = Array.from(
        (cable.geometry.getAttribute("position") as THREE.BufferAttribute).array as Float32Array,
      );
      model.updatePose(
        stepGoertzMasterSlaveTopology({
          horizontalArmPivot: 0.7,
          verticalArmPivot: -0.5,
          toolAxis171: 0.4,
        }),
      );
      const after = Array.from(
        (cable.geometry.getAttribute("position") as THREE.BufferAttribute).array as Float32Array,
      );
      expect(cable.geometry.getAttribute("position")).toBe(originalPositionAttribute);
      expect(after).not.toEqual(before);
      expect(after.every(Number.isFinite)).toBe(true);
    } finally {
      model.dispose();
    }
  });

  test("attaches the remote obstruction to the slave grasper and reflection cue to the master handle", () => {
    const model = buildGoertzElectronicMasterSlaveManipulatorModel();
    try {
      const reflected = stepGoertzMasterSlaveTopology({
        gripperClosure: 0.8,
        contactResistance: 0.7,
        forceReflectionEnabled: 1,
      });
      model.updatePose(reflected);
      model.root.updateMatrixWorld(true);

      const cue = model.root.getObjectByName(
        "Claim 9 reflected-resistance cue attached to master handle",
      );
      const specimen = model.root.getObjectByName("fragile glass specimen held by slave grasper");
      expect(cue?.visible).toBe(true);
      expect(cue?.parent?.name).toBe("master tool transverse pivot group axis 172");
      expect(specimen?.visible).toBe(true);
      expect(specimen?.parent?.name).toBe("slave tool transverse pivot group axis 172");
      expect(
        objectBox(model.root, "reflected-resistance cue shaft").intersectsBox(
          objectBox(model.root, "master tool 53 fixed hand grip"),
        ),
      ).toBe(true);

      model.updatePose(
        stepGoertzMasterSlaveTopology({
          gripperClosure: 0.8,
          contactResistance: 0.7,
          forceReflectionEnabled: 0,
        }),
      );
      expect(cue?.visible).toBe(false);
      expect(specimen?.visible).toBe(true);
    } finally {
      model.dispose();
    }
  });

  test("keeps both visual faces on the shared bus and refuses invented dynamics", () => {
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

    expect(modelSource).toContain("support leg 62");
    expect(modelSource).toContain("counterweight rod 117");
    expect(modelSource).toContain("rotatable inner tube 146");
    expect(modelSource).toContain("source cable ");
    expect(modelSource).toContain("electrical correspondence channel ");
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
