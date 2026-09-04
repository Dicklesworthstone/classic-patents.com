import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import {
  CLAVEL_DELTA_ROBOT_CLAIM_PROBE_PARAMS,
  readClavelDeltaRobotClaimStates,
  stepClavelDeltaRobotTopology,
} from "@/physics/clavelDeltaRobotKernel";
import {
  CLAVEL_DELTA_ROBOT_CAMERA_VIEWS,
  clavelDeltaRobotViewForViewport,
} from "./clavelDeltaRobotCamera";
import { buildClavelDeltaRobotModel, CLAVEL_EXHIBIT_FLOOR_Y } from "./clavelDeltaRobotModel";

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

function projectedModelBounds(
  cameraView: ReturnType<typeof clavelDeltaRobotViewForViewport>,
  viewportWidth: number,
  viewportHeight: number,
  root: THREE.Object3D,
) {
  root.updateWorldMatrix(true, true);
  const bounds = new THREE.Box3().setFromObject(root);
  const camera = new THREE.PerspectiveCamera(42, viewportWidth / viewportHeight, 0.1, 1000);
  camera.position.set(...cameraView.position);
  camera.lookAt(...cameraView.target);
  camera.updateWorldMatrix(true, false);

  const projected = new THREE.Vector3();
  const result = { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity };
  for (const x of [bounds.min.x, bounds.max.x]) {
    for (const y of [bounds.min.y, bounds.max.y]) {
      for (const z of [bounds.min.z, bounds.max.z]) {
        projected.set(x, y, z).project(camera);
        result.minX = Math.min(result.minX, projected.x);
        result.maxX = Math.max(result.maxX, projected.x);
        result.minY = Math.min(result.minY, projected.y);
        result.maxY = Math.max(result.maxY, projected.y);
      }
    }
  }
  return result;
}

function isEffectivelyVisible(candidate: THREE.Object3D) {
  let current: THREE.Object3D | null = candidate;
  while (current) {
    if (!current.visible) return false;
    current = current.parent;
  }
  return true;
}

/**
 * Bounding-box corners can combine an exhibit foot with a distant platform
 * corner that no visitor can see at once. Frame the actual rendered vertices
 * instead, including every instance of the six named articulated parts.
 */
function projectedMeshBounds(
  cameraView: ReturnType<typeof clavelDeltaRobotViewForViewport>,
  viewportWidth: number,
  viewportHeight: number,
  root: THREE.Object3D,
) {
  root.updateWorldMatrix(true, true);
  const camera = new THREE.PerspectiveCamera(42, viewportWidth / viewportHeight, 0.1, 1000);
  camera.position.set(...cameraView.position);
  camera.lookAt(...cameraView.target);
  camera.updateProjectionMatrix();
  camera.updateWorldMatrix(true, false);

  const points: THREE.Vector3[] = [];
  root.traverse((candidate) => {
    if (!isEffectivelyVisible(candidate) || !(candidate instanceof THREE.Mesh)) return;
    const positions = candidate.geometry.getAttribute("position");
    if (!positions) return;

    const matrices: readonly THREE.Matrix4[] =
      candidate instanceof THREE.InstancedMesh
        ? Array.from({ length: candidate.count }, (_, index) => {
            const instance = new THREE.Matrix4();
            candidate.getMatrixAt(index, instance);
            return new THREE.Matrix4().multiplyMatrices(candidate.matrixWorld, instance);
          })
        : [candidate.matrixWorld];

    for (const matrix of matrices) {
      for (let index = 0; index < positions.count; index += 1) {
        points.push(
          new THREE.Vector3(positions.getX(index), positions.getY(index), positions.getZ(index))
            .applyMatrix4(matrix)
            .project(camera),
        );
      }
    }
  });

  if (points.length === 0) {
    throw new Error("Expected a visible Clavel mesh while measuring its overview frame.");
  }

  const minX = Math.min(...points.map((point) => point.x));
  const maxX = Math.max(...points.map((point) => point.x));
  const minY = Math.min(...points.map((point) => point.y));
  const maxY = Math.max(...points.map((point) => point.y));
  return {
    minX,
    maxX,
    minY,
    maxY,
    widthPx: ((maxX - minX) * viewportWidth) / 2,
    heightPx: ((maxY - minY) * viewportHeight) / 2,
  };
}

describe("US 4,976,582 Clavel Delta procedural visual boundary", () => {
  test("uses a closer desktop overview without changing compact or detail camera paths", () => {
    const desktop = clavelDeltaRobotViewForViewport("overview", 1200);
    const tablet = clavelDeltaRobotViewForViewport("overview", 720);
    const phone = clavelDeltaRobotViewForViewport("overview", 320);
    const narrowPhone = clavelDeltaRobotViewForViewport("overview", 288);
    const desktopPlatform = clavelDeltaRobotViewForViewport("platform", 1200);
    const compactPlatform = clavelDeltaRobotViewForViewport("platform", 320);
    const distance = (camera: typeof desktop) =>
      Math.hypot(
        camera.position[0] - camera.target[0],
        camera.position[1] - camera.target[1],
        camera.position[2] - camera.target[2],
      );

    expect(desktop).toEqual({ position: [1.48, 1.84, 5.1], target: [0, 0, 0] });
    expect(distance(desktop)).toBeLessThan(distance(tablet));
    // Preserve the prior conservative tablet and phone multipliers exactly.
    expect(tablet.target).toEqual([0, -0.35, 0]);
    expect(distance(phone) / distance(tablet)).toBeCloseTo(1.28 / 1.15, 8);
    expect(distance(narrowPhone) / distance(tablet)).toBeCloseTo(1.48 / 1.15, 8);
    expect(desktopPlatform.target).toEqual(CLAVEL_DELTA_ROBOT_CAMERA_VIEWS.platform.target);
    desktopPlatform.position.forEach((coordinate, index) => {
      expect(coordinate).toBeCloseTo(CLAVEL_DELTA_ROBOT_CAMERA_VIEWS.platform.position[index], 12);
    });
    expect(distance(compactPlatform) / distance(desktopPlatform)).toBeCloseTo(1.15, 8);
    expect(source("src/components/patents/visuals/three/ClavelDeltaRobot3D.tsx")).toContain(
      "useResponsiveStudioHud(true)",
    );
  });

  test("makes the desktop source topology materially legible while keeping its UI lane clear", () => {
    const viewport = [1214, 540] as const;
    const cameraView = clavelDeltaRobotViewForViewport("overview", viewport[0]);
    const model = buildClavelDeltaRobotModel();
    try {
      const topology = model.root.getObjectByName("Claim 1 three-actuator parallel topology");
      const base = model.root.getObjectByName("Base member 1");
      expect(topology).toBeDefined();
      expect(base).toBeDefined();
      if (!topology || !base) throw new Error("Clavel source topology is missing.");

      // These cover the relaxed display, the V24 primary-control maximum, and
      // the Claim 2 inversion that deliberately removes one lower bar per leg.
      for (const params of [
        {},
        { armOneInput: 1 },
        { armOneInput: 1, toolAxisInput: 1, claim2PairedBarsEnabled: 0 },
      ]) {
        model.updatePose(stepClavelDeltaRobotTopology(params));
        const bounds = projectedMeshBounds(cameraView, ...viewport, topology);
        // The cards end above NDC +0.70; retain a real gap rather than merely
        // avoiding clip-space loss. The opposite endpoint is kept 19px above
        // the lower edge, while the active source topology grows well beyond
        // the old roughly 185 px-wide desktop rendering.
        expect(bounds.minX).toBeGreaterThan(-0.36);
        expect(bounds.maxX).toBeLessThan(0.32);
        expect(bounds.minY).toBeGreaterThan(-0.93);
        expect(bounds.maxY).toBeLessThan(0.67);
        expect(bounds.widthPx).toBeGreaterThan(340);
        expect(bounds.heightPx).toBeGreaterThan(365);
      }

      // The generic ClaimConstraintToggle inverts Claim 1. That intentionally
      // withholds the articulated topology but must leave the fixed source base
      // clear and prominent rather than replacing it with a blank canvas.
      model.updatePose(
        stepClavelDeltaRobotTopology({
          armOneInput: 1,
          toolAxisInput: 1,
          claim1TopologyEnabled: 0,
        }),
      );
      expect(topology.visible).toBe(false);
      const baseBounds = projectedMeshBounds(cameraView, ...viewport, base);
      expect(baseBounds.minX).toBeGreaterThan(-0.36);
      expect(baseBounds.maxX).toBeLessThan(0.3);
      expect(baseBounds.minY).toBeGreaterThan(0.1);
      expect(baseBounds.maxY).toBeLessThan(0.5);
      expect(baseBounds.widthPx).toBeGreaterThan(360);
    } finally {
      model.dispose();
    }
  });

  test("preserves a conservative full-exhibit edge margin on tablet and phone", () => {
    const viewports = [
      [720, 540],
      [343, 440],
      [288, 440],
    ] as const;

    const model = buildClavelDeltaRobotModel();
    try {
      for (const [viewportWidth, viewportHeight] of viewports) {
        const cameraView = clavelDeltaRobotViewForViewport("overview", viewportWidth);
        for (const armOneInput of [-1, 0, 1] as const) {
          model.updatePose(stepClavelDeltaRobotTopology({ armOneInput }));
          const bounds = projectedModelBounds(
            cameraView,
            viewportWidth,
            viewportHeight,
            model.root,
          );
          // ±0.94 leaves at least 3% of the clip space on every edge. The
          // bound includes the unclaimed exhibit gantry because it visibly
          // supports the claimed mechanism and must not be sawed off at 320px.
          expect(bounds.minX).toBeGreaterThan(-0.94);
          expect(bounds.maxX).toBeLessThan(0.94);
          expect(bounds.minY).toBeGreaterThan(-0.94);
          expect(bounds.maxY).toBeLessThan(0.94);
        }
      }
    } finally {
      model.dispose();
    }
  });

  test("keeps the local canvas and every focusable control clear of the sticky museum masthead", () => {
    const studioSource = source("src/components/patents/visuals/three/ClavelDeltaRobot3D.tsx");

    // The card does not become a sticky scroll container. The document scroll
    // remains authoritative, while focus/claim buttons receive the same safe
    // masthead clearance as the audited Hull apparatus.
    expect(studioSource).toContain("scroll-mt-24");
    expect(studioSource).toContain("[&_button]:scroll-mt-24");
    expect(studioSource).toContain("[&_input]:scroll-mt-24");
    expect(studioSource).not.toContain("max-sm:sticky");
  });

  test("keeps one exact Reset action mounted outside the responsive control deck", () => {
    const studioSource = source("src/components/patents/visuals/three/ClavelDeltaRobot3D.tsx");
    const resetMarker = 'aria-label="Reset"';
    const controlDeckMarker = "{showControlDeck && (";

    expect(studioSource.match(new RegExp(resetMarker, "g"))?.length).toBe(1);
    expect(studioSource).toContain("const resetStudio = () => {");
    expect(studioSource).toContain("flushSync(() => {");
    expect(studioSource).toContain("resetParams();");
    expect(studioSource).toContain('setView("overview");');
    expect(studioSource).toContain(
      "studioRef.current?.controls.setView(initial.position, initial.target);",
    );
    expect(studioSource).toContain(controlDeckMarker);
    expect(studioSource.indexOf(resetMarker)).toBeLessThan(studioSource.indexOf(controlDeckMarker));
    expect(studioSource).toContain('data-clavel-delta-robot-reset="true"');
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

    const defaultSize = new THREE.Box3().setFromObject(model.root).getSize(new THREE.Vector3());
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

  test("seats the fixed base on a floor-connected exhibit gantry without treating it as claimed topology", () => {
    const model = buildClavelDeltaRobotModel();
    try {
      const base = model.root.getObjectByName("Base member 1");
      const support = model.root.getObjectByName("Fixed-world exhibit gantry (not a patent part)");
      const topology = model.root.getObjectByName("Claim 1 three-actuator parallel topology");
      expect(base).toBeInstanceOf(THREE.Mesh);
      expect(base?.rotation.y).toBeCloseTo(Math.PI, 12);
      expect(support).toBeDefined();
      expect(support?.parent).toBe(model.root);
      expect(support?.parent).not.toBe(topology);
      expect(support?.userData.sourceStatus).toBe("exhibit-support-not-a-patent-part");

      model.root.updateMatrixWorld(true);
      const baseBounds = new THREE.Box3().setFromObject(base as THREE.Object3D);
      for (let index = 1; index <= 3; index += 1) {
        const post = model.root.getObjectByName(
          `Exhibit support post ${index} (not a patent part)`,
        );
        const foot = model.root.getObjectByName(`Exhibit floor foot ${index} (not a patent part)`);
        const header = model.root.getObjectByName(
          `Exhibit base header ${index} (not a patent part)`,
        );
        expect(post).toBeInstanceOf(THREE.Mesh);
        expect(foot).toBeInstanceOf(THREE.Mesh);
        expect(header).toBeInstanceOf(THREE.Mesh);
        const postBounds = new THREE.Box3().setFromObject(post as THREE.Object3D);
        const footBounds = new THREE.Box3().setFromObject(foot as THREE.Object3D);
        const headerBounds = new THREE.Box3().setFromObject(header as THREE.Object3D);
        expect(postBounds.min.y).toBeCloseTo(CLAVEL_EXHIBIT_FLOOR_Y, 6);
        expect(postBounds.max.y).toBeCloseTo(baseBounds.min.y, 6);
        expect(footBounds.min.y).toBeCloseTo(CLAVEL_EXHIBIT_FLOOR_Y, 6);
        expect(headerBounds.intersectsBox(baseBounds)).toBe(true);
      }

      model.updatePose(stepClavelDeltaRobotTopology({ claim1TopologyEnabled: 0 }));
      expect(topology?.visible).toBe(false);
      expect(support?.visible).toBe(true);
      expect(base?.visible).toBe(true);
    } finally {
      model.dispose();
    }
  });

  test("makes source-described tool-axis rotation visible with a connected gripper and marker", () => {
    const model = buildClavelDeltaRobotModel();
    try {
      const tool = model.root.getObjectByName("Working member 9 and longitudinal axis 10");
      const bridge = model.root.getObjectByName("Working member 9 source-style gripper bridge");
      const jawA = model.root.getObjectByName("Working member 9 gripper jaw A");
      const jawB = model.root.getObjectByName("Working member 9 gripper jaw B");
      const marker = model.root.getObjectByName(
        "Tool-axis exhibit orientation marker (not a patent part)",
      );
      expect(tool).toBeInstanceOf(THREE.Group);
      expect(bridge?.parent).toBe(tool);
      expect(jawA?.parent).toBe(tool);
      expect(jawB?.parent).toBe(tool);
      expect(marker?.parent).toBe(tool);

      model.updatePose(stepClavelDeltaRobotTopology({ toolAxisInput: 0 }));
      model.root.updateMatrixWorld(true);
      const initialMarker = marker?.getWorldPosition(new THREE.Vector3()) ?? new THREE.Vector3();
      const initialToolCenter = tool?.getWorldPosition(new THREE.Vector3()) ?? new THREE.Vector3();
      model.updatePose(stepClavelDeltaRobotTopology({ toolAxisInput: 0.5 }));
      model.root.updateMatrixWorld(true);
      const rotatedMarker = marker?.getWorldPosition(new THREE.Vector3()) ?? new THREE.Vector3();
      const rotatedToolCenter = tool?.getWorldPosition(new THREE.Vector3()) ?? new THREE.Vector3();
      const initialOffset = initialMarker.clone().sub(initialToolCenter);
      const rotatedOffset = rotatedMarker.clone().sub(rotatedToolCenter);
      expect(initialOffset.length()).toBeCloseTo(rotatedOffset.length(), 8);
      expect(initialOffset.distanceTo(rotatedOffset)).toBeGreaterThan(0.2);
      expect(tool?.rotation.y).toBeCloseTo(Math.PI / 2, 12);
    } finally {
      model.dispose();
    }
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
    expect(studioSource).toContain('data-clavel-delta-robot-control-deck="true"');
    expect(studioSource).toContain("floor.position.y = CLAVEL_EXHIBIT_FLOOR_Y");
    expect(modelSource).toContain("Fixed-world exhibit gantry (not a patent part)");
    expect(modelSource).toContain("Working member 9 source-style gripper bridge");
    expect(studioSource).toContain('data-testid="clavel-delta-robot-three"');
    expect(simSource).toContain('data-testid="clavel-delta-robot-two"');
    expect(studioSource).toContain("data-clavel-frankensim-boundary");
    expect(simSource).toContain("FIXED-WORLD SUPPORT SYMBOL · EXHIBIT FRAME, NOT A PATENT PART");
    expect(studioSource).not.toContain("absolute bottom-3 left-3 right-3");
    expect(studioSource).toContain("This browser cannot create WebGL.");
    expect(simSource).toContain("TWO BARS / LEG");
    expect(simSource).toContain("Rigid closure");
    expect(simSource).toContain("rigid relation: |bar A| = |bar B| = L*");
  });
});
