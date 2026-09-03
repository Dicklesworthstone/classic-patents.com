import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import {
  CLAVEL_DELTA_ROBOT_CLAIM_PROBE_PARAMS,
  readClavelDeltaRobotClaimStates,
  stepClavelDeltaRobotTopology,
} from "@/physics/clavelDeltaRobotKernel";
import { clavelDeltaRobotViewForViewport } from "./ClavelDeltaRobot3D";
import { buildClavelDeltaRobotModel } from "./clavelDeltaRobotModel";

const ROOT = process.cwd();
const THREE_DIRECTORY = join(ROOT, "src", "components", "patents", "visuals", "three");
const source = (path: string) => readFileSync(join(ROOT, path), "utf8");

function namedInstancedPart(root: THREE.Object3D, name: string): THREE.InstancedMesh {
  const part = root.getObjectByName(name);
  expect(part).toBeInstanceOf(THREE.InstancedMesh);
  if (!(part instanceof THREE.InstancedMesh)) {
    throw new Error(`Expected ${name} to remain an observable instanced patent part.`);
  }
  return part;
}

describe("US 4,976,582 Clavel Delta procedural visual boundary", () => {
  test("frames the complete lower platform above the overview controls", () => {
    const desktop = clavelDeltaRobotViewForViewport("overview", 1200);
    const phone = clavelDeltaRobotViewForViewport("overview", 320);
    const distance = (camera: typeof desktop) =>
      Math.hypot(
        camera.position[0] - camera.target[0],
        camera.position[1] - camera.target[1],
        camera.position[2] - camera.target[2],
      );

    expect(distance(desktop)).toBeGreaterThan(11);
    expect(desktop.target).toEqual([0, -1, 0]);
    expect(distance(phone) / distance(desktop)).toBeCloseTo(0.85, 8);
    expect(source("src/components/patents/visuals/three/ClavelDeltaRobot3D.tsx")).toContain(
      "useResponsiveStudioHud(true)",
    );
  });

  test("builds the patent-named base, three control arms, six lower bars, platform, and tool axis", () => {
    const model = buildClavelDeltaRobotModel();
    expect(model.root.name).toContain("US 4,976,582");
    expect(model.root.getObjectByName("Base member 1")).toBeDefined();
    expect(model.root.getObjectByName("Movable member 8")).toBeDefined();
    expect(model.root.getObjectByName("Working member 9 and longitudinal axis 10")).toBeDefined();
    expect(
      model.root.getObjectByName("Base-mounted supplementary motor 11 and telescopic arm 14"),
    ).toBeDefined();
    expect(
      model.root.getObjectByName("Actuator 1, axis 2, fixed portion 3, control arm 4"),
    ).toBeDefined();
    expect(
      model.root.getObjectByName("Actuator 2, axis 2, fixed portion 3, control arm 4"),
    ).toBeDefined();
    expect(
      model.root.getObjectByName("Actuator 3, axis 2, fixed portion 3, control arm 4"),
    ).toBeDefined();

    const defaultSize = new THREE.Box3()
      .setFromObject(model.root)
      .getSize(new THREE.Vector3());
    expect(defaultSize.y).toBeGreaterThan(1.5);

    const lowerBarB = model.root.getObjectByName("Linking bar 5b");
    const topologyGroup = model.root.getObjectByName("Claim 1 three-actuator parallel topology");
    const toolGroup = model.root.getObjectByName("Working member 9 and longitudinal axis 10");
    model.updatePose(stepClavelDeltaRobotTopology({ toolAxisInput: 0.35 }));
    expect(lowerBarB?.visible).toBe(true);
    expect(toolGroup?.visible).toBe(true);
    expect(toolGroup?.rotation.y).toBeCloseTo(0.35 * Math.PI, 12);

    model.updatePose(stepClavelDeltaRobotTopology({ claim2PairedBarsEnabled: 0 }));
    expect(lowerBarB?.visible).toBe(false);
    model.updatePose(stepClavelDeltaRobotTopology({ claim8BaseMotorEnabled: 0 }));
    expect(toolGroup?.visible).toBe(false);
    model.updatePose(stepClavelDeltaRobotTopology({ claim1TopologyEnabled: 0 }));
    expect(topologyGroup?.visible).toBe(false);
    model.dispose();
  });

  test("batches repeated articulated parts while preserving their named topology and poses", () => {
    const model = buildClavelDeltaRobotModel();
    try {
      const state = stepClavelDeltaRobotTopology({
        armOneInput: 0.4,
        armTwoInput: -0.2,
        armThreeInput: 0.65,
      });
      model.updatePose(state);

      for (const name of [
        "Cardan joint 6a",
        "Cardan joint 6b",
        "Linking bar 5a",
        "Linking bar 5b",
        "Cardan joint 7a",
        "Cardan joint 7b",
      ]) {
        const part = namedInstancedPart(model.root, name);
        expect(part.count).toBe(3);
        expect(part.userData.actuatorIndices).toEqual([1, 2, 3]);
      }

      const lowerBarA = namedInstancedPart(model.root, "Linking bar 5a");
      const matrix = new THREE.Matrix4();
      lowerBarA.getMatrixAt(0, matrix);
      const position = new THREE.Vector3();
      const rotation = new THREE.Quaternion();
      const scale = new THREE.Vector3();
      matrix.decompose(position, rotation, scale);
      const [upperX, upperY, upperZ] = state.legs[0].upperJointA;
      const [lowerX, lowerY, lowerZ] = state.legs[0].lowerJointA;
      expect(position.x).toBeCloseTo((upperX + lowerX) / 2, 6);
      expect(position.y).toBeCloseTo((upperY + lowerY) / 2, 6);
      expect(position.z).toBeCloseTo((upperZ + lowerZ) / 2, 6);
      expect(scale.y).toBeCloseTo(
        new THREE.Vector3(upperX, upperY, upperZ).distanceTo(
          new THREE.Vector3(lowerX, lowerY, lowerZ),
        ),
        6,
      );

      model.updatePose(stepClavelDeltaRobotTopology({ claim2PairedBarsEnabled: 0 }));
      expect(namedInstancedPart(model.root, "Linking bar 5b").visible).toBe(false);
      expect(namedInstancedPart(model.root, "Cardan joint 6b").visible).toBe(false);
      expect(namedInstancedPart(model.root, "Cardan joint 7b").visible).toBe(false);
    } finally {
      model.dispose();
    }
  });

  test("uses the shared claim controls and makes each source-bound withdrawal observable", () => {
    expect(CLAVEL_DELTA_ROBOT_CLAIM_PROBE_PARAMS).toEqual({
      1: "claim1TopologyEnabled",
      2: "claim2PairedBarsEnabled",
      8: "claim8BaseMotorEnabled",
    });
    expect(readClavelDeltaRobotClaimStates({})).toEqual({ 1: true, 2: true, 8: true });
    expect(
      readClavelDeltaRobotClaimStates({
        claim1TopologyEnabled: 0,
        claim2PairedBarsEnabled: 0,
        claim8BaseMotorEnabled: 0,
      }),
    ).toEqual({ 1: false, 2: false, 8: false });

    const twoD = source("src/components/patents/visuals/ClavelDeltaRobotSim.tsx");
    const threeD = source("src/components/patents/visuals/three/ClavelDeltaRobot3D.tsx");
    for (const face of [twoD, threeD]) {
      expect(face).toContain("usePatentPhysics");
      expect(face).toContain("readClavelDeltaRobotClaimStates(params)");
      expect(face).toContain("CLAVEL_DELTA_ROBOT_CLAIM_PROBE_PARAMS");
      expect(face).not.toContain("useState<Record<number, boolean>>");
    }
  });

  test("keeps both visual faces procedural, deterministic, and honest about the no-WASM boundary", () => {
    const modelSource = readFileSync(join(THREE_DIRECTORY, "clavelDeltaRobotModel.ts"), "utf8");
    const studioSource = readFileSync(join(THREE_DIRECTORY, "ClavelDeltaRobot3D.tsx"), "utf8");
    const simSource = source("src/components/patents/visuals/ClavelDeltaRobotSim.tsx");

    for (const prohibited of [
      "useGLTF",
      ".gltf",
      ".glb",
      "Math.random",
      "new THREE.Clock",
      "performance.now",
    ]) {
      expect(modelSource).not.toContain(prohibited);
      expect(studioSource).not.toContain(prohibited);
    }
    expect(modelSource).toContain("Linking bar 5a");
    expect(modelSource).toContain("Linking bar 5b");
    expect(studioSource).toContain("createThreeStudioScene");
    expect(studioSource).toContain("createStudioClock");
    expect(studioSource).toContain("useFrankenSimPhysics");
    expect(studioSource).toContain("isRefused: true");
    expect(studioSource).toContain('data-clavel-delta-robot-webgl-fallback="true"');
    expect(studioSource).toContain('data-clavel-delta-robot-ui-toggle="true"');
    expect(studioSource).toContain('data-clavel-delta-robot-ui-overlay="true"');
    expect(studioSource).toContain("floor.position.y = -2.18");
    expect(studioSource).toContain("max-h-[calc(100%-4.5rem)]");
    expect(studioSource).toContain("This browser cannot create WebGL.");
    expect(simSource).toContain("TWO BARS / LEG");
    expect(simSource).toContain("Rigid closure");
    expect(simSource).toContain("rigid relation: |bar A| = |bar B| = L*");
  });
});
