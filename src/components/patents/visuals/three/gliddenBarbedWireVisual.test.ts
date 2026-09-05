import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import { stepGliddenBarbedWire } from "@/physics/catalogKernels";
import {
  GLIDDEN_BARBED_WIRE_CAMERA_PRESETS,
  GLIDDEN_COMPACT_ISOMETRIC_SAFE_ZONE,
  gliddenBarbedWireCameraForViewport,
  isGliddenCompactClaimViewport,
} from "./gliddenBarbedWireCamera";
import {
  buildGliddenBarbedWireModel,
  updateGliddenBarbedWireKinematics,
} from "./gliddenBarbedWireModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");
const COMPACT_AUDIT_VIEWPORT = { width: 286, height: 380 };
const CLAIM_FOCUS_AUDIT_VIEWPORT = { width: 341, height: 380 };
const LANDSCAPE_AUDIT_VIEWPORT = { width: 639, height: 380 };
const TABLET_AUDIT_VIEWPORT = { width: 718, height: 1024 };

function projectedObjectBounds(root: THREE.Object3D, camera: THREE.PerspectiveCamera) {
  const bounds = {
    minX: Number.POSITIVE_INFINITY,
    maxX: Number.NEGATIVE_INFINITY,
    minY: Number.POSITIVE_INFINITY,
    maxY: Number.NEGATIVE_INFINITY,
  };
  const point = new THREE.Vector3();
  root.traverse((node) => {
    let ancestor: THREE.Object3D | null = node;
    while (ancestor) {
      if (!ancestor.visible) return;
      ancestor = ancestor.parent;
    }
    const positions = (node as THREE.Mesh).geometry?.getAttribute("position");
    if (!positions) return;
    for (let index = 0; index < positions.count; index += 1) {
      point.fromBufferAttribute(positions, index).applyMatrix4(node.matrixWorld).project(camera);
      bounds.minX = Math.min(bounds.minX, point.x);
      bounds.maxX = Math.max(bounds.maxX, point.x);
      bounds.minY = Math.min(bounds.minY, point.y);
      bounds.maxY = Math.max(bounds.maxY, point.y);
    }
  });
  return bounds;
}

function projectedPixels(
  frame: ReturnType<typeof projectedObjectBounds>,
  canvasWidth: number,
  canvasHeight: number,
) {
  return {
    width: ((frame.maxX - frame.minX) * canvasWidth) / 2,
    height: ((frame.maxY - frame.minY) * canvasHeight) / 2,
  };
}

describe("US 157,124 Joseph Glidden Twisted Wire Barbed Fence visual & kinematics boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "GliddenBarbedWire3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "gliddenBarbedWireModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildGliddenBarbedWireModel");
    expect(modelSource).toContain("updateGliddenBarbedWireKinematics");
    expect(modelSource).toContain("gliddenFlyerCrate");
    expect(modelSource).not.toContain("0.4 + Math.abs(flyerOmegaRadPerS)");
  });

  test("does not expose a phantom second claim or unsupported gauge/production facts", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "GliddenBarbedWire3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "gliddenBarbedWireModel.ts"),
      "utf8",
    );
    const simSource = readFileSync(join(VISUALS_DIRECTORY, "GliddenBarbedWireSim.tsx"), "utf8");

    for (const source of [threeSource, modelSource, simSource]) {
      expect(source).not.toMatch(/Claim\s*2/i);
      expect(source).not.toContain("12-gauge");
      expect(source).not.toContain('"The Winner"');
    }
    expect(threeSource).not.toContain('label: "Production Rate"');
    expect(modelSource).toContain("single printed claim");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "GliddenBarbedWire3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "gliddenBarbedWireModel.ts"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
      expect(modelSource).not.toContain(forbidden);
    }
  });

  test("exposes authentic camera presets and cutaway mode for barbed wire machine inspection", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "GliddenBarbedWire3D.tsx"),
      "utf8",
    );

    for (const preset of [
      "iso",
      "barb_lock",
      "twisting_helix",
      "takeup_drum",
      "feed_spools",
      "top",
    ]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("isCutaway");
    expect(threeSource).toContain("Glidden Barbed Wire Machine 3D");
    expect(threeSource).toContain("controls.setView");
    expect(threeSource).not.toContain("cameraRef");
  });

  test("keeps both source-described working ends inside the compact overview through animation", () => {
    const { width, height } = COMPACT_AUDIT_VIEWPORT;
    const compactIso = gliddenBarbedWireCameraForViewport("iso", width, height);

    expect(compactIso).toEqual({ pos: [15.675, 10.725, 17.325], target: [0, 0, 0] });
    expect(
      gliddenBarbedWireCameraForViewport(
        "iso",
        LANDSCAPE_AUDIT_VIEWPORT.width,
        LANDSCAPE_AUDIT_VIEWPORT.height,
      ),
    ).toEqual(GLIDDEN_BARBED_WIRE_CAMERA_PRESETS.iso);
    expect(
      gliddenBarbedWireCameraForViewport(
        "iso",
        TABLET_AUDIT_VIEWPORT.width,
        TABLET_AUDIT_VIEWPORT.height,
      ),
    ).toEqual(GLIDDEN_BARBED_WIRE_CAMERA_PRESETS.iso);
    for (const preset of [
      "barb_lock",
      "twisting_helix",
      "takeup_drum",
      "feed_spools",
      "top",
    ] as const) {
      expect(gliddenBarbedWireCameraForViewport(preset, width, height)).toEqual(
        GLIDDEN_BARBED_WIRE_CAMERA_PRESETS[preset],
      );
    }

    const auditedStates = [
      { name: "default", twistsPerFoot: 5, isLocked: true },
      { name: "primary-control-max", twistsPerFoot: 10, isLocked: true },
      { name: "claim-inverted", twistsPerFoot: 10, isLocked: false },
    ] as const;

    for (const state of auditedStates) {
      const model = buildGliddenBarbedWireModel();
      try {
        const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
        camera.position.set(...compactIso.pos);
        camera.lookAt(...compactIso.target);
        camera.updateProjectionMatrix();
        camera.updateMatrixWorld();

        const envelope = {
          minX: Number.POSITIVE_INFINITY,
          maxX: Number.NEGATIVE_INFINITY,
          minY: Number.POSITIVE_INFINITY,
          maxY: Number.NEGATIVE_INFINITY,
        };
        const machineRpm = state.twistsPerFoot * 24;
        const flyerOmegaRadPerS = Number(((machineRpm * 2 * Math.PI) / 60).toFixed(3));
        const reelOmegaRadPerS = Number((flyerOmegaRadPerS * 0.2).toFixed(3));

        // Four seconds at the studio's 60 Hz cadence covers the rotating flyer
        // and reel at every state the viewport audit persists.
        for (let frame = 0; frame <= 240; frame += 1) {
          updateGliddenBarbedWireKinematics(
            model.nodes,
            model.materials,
            1 / 60,
            frame / 60,
            flyerOmegaRadPerS,
            reelOmegaRadPerS,
            state.isLocked,
            false,
          );
          model.rootGroup.updateMatrixWorld(true);
          const projection = projectedObjectBounds(model.rootGroup, camera);
          envelope.minX = Math.min(envelope.minX, projection.minX);
          envelope.maxX = Math.max(envelope.maxX, projection.maxX);
          envelope.minY = Math.min(envelope.minY, projection.minY);
          envelope.maxY = Math.max(envelope.maxY, projection.maxY);
        }

        expect(
          envelope.minX,
          `${state.name} feed support inside compact left edge`,
        ).toBeGreaterThan(GLIDDEN_COMPACT_ISOMETRIC_SAFE_ZONE.minX);
        expect(envelope.maxX, `${state.name} take-up reel inside compact right edge`).toBeLessThan(
          GLIDDEN_COMPACT_ISOMETRIC_SAFE_ZONE.maxX,
        );
        expect(envelope.minY, `${state.name} bench legs above compact floor`).toBeGreaterThan(
          GLIDDEN_COMPACT_ISOMETRIC_SAFE_ZONE.minY,
        );
        expect(envelope.maxY, `${state.name} flyer clear of compact toolbar`).toBeLessThan(
          GLIDDEN_COMPACT_ISOMETRIC_SAFE_ZONE.maxY,
        );
      } finally {
        model.dispose();
      }
    }
  });

  test("keeps the printed twisted strands and each barb legible in the live 375px reader canvas", () => {
    const { width, height } = CLAIM_FOCUS_AUDIT_VIEWPORT;
    expect(isGliddenCompactClaimViewport(width, height)).toBe(true);
    expect(
      isGliddenCompactClaimViewport(COMPACT_AUDIT_VIEWPORT.width, COMPACT_AUDIT_VIEWPORT.height),
    ).toBe(false);
    expect(gliddenBarbedWireCameraForViewport("iso", width, height)).not.toEqual(
      GLIDDEN_BARBED_WIRE_CAMERA_PRESETS.iso,
    );

    const auditedStates = [
      { name: "default", twistsPerFoot: 5, isLocked: true },
      { name: "primary-control-max", twistsPerFoot: 10, isLocked: true },
      { name: "claim-inverted", twistsPerFoot: 10, isLocked: false },
    ] as const;
    for (const state of auditedStates) {
      const model = buildGliddenBarbedWireModel();
      try {
        model.setCompactClaimFocus(true);
        expect(model.nodes.presentationPropsGroup.visible).toBe(false);
        expect(model.nodes.fencePostGroup?.visible).toBe(false);
        const view = gliddenBarbedWireCameraForViewport("iso", width, height);
        const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
        camera.position.set(...view.pos);
        camera.lookAt(...view.target);
        camera.updateProjectionMatrix();
        camera.updateMatrixWorld();

        const machineRpm = state.twistsPerFoot * 24;
        const flyerOmegaRadPerS = Number(((machineRpm * 2 * Math.PI) / 60).toFixed(3));
        updateGliddenBarbedWireKinematics(
          model.nodes,
          model.materials,
          1 / 60,
          0,
          flyerOmegaRadPerS,
          flyerOmegaRadPerS * 0.2,
          state.isLocked,
          false,
        );
        model.rootGroup.updateMatrixWorld(true);

        const wire = projectedObjectBounds(model.nodes.wireAssemblyGroup, camera);
        expect(wire.minX, `${state.name} strand left`).toBeGreaterThan(-0.65);
        expect(wire.maxX, `${state.name} strand right`).toBeLessThan(0.87);
        expect(wire.minY, `${state.name} strand lower`).toBeGreaterThan(-0.4);
        expect(wire.maxY, `${state.name} strand upper`).toBeLessThan(0.32);
        const wirePixels = projectedPixels(wire, width, height);
        expect(wirePixels.width, `${state.name} claimed strand width`).toBeGreaterThan(230);
        expect(wirePixels.height, `${state.name} claimed strand height`).toBeGreaterThan(100);

        for (const [index, barb] of model.nodes.barbGroups.entries()) {
          const pixels = projectedPixels(projectedObjectBounds(barb, camera), width, height);
          expect(
            Math.max(pixels.width, pixels.height),
            `${state.name} barb ${index + 1} readable dimension`,
          ).toBeGreaterThan(26);
        }
      } finally {
        model.dispose();
      }
    }

    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "GliddenBarbedWire3D.tsx"),
      "utf8",
    );
    expect(threeSource).toContain("setCompactClaimFocus");
    expect(threeSource).toContain("isGliddenCompactClaimViewport");
    expect(threeSource).toContain("synchronizeInitialOverview");
    expect(threeSource).toContain("requestAnimationFrame(synchronizeInitialOverview)");
  });

  test("computes genuine catenary sag, barb slip threshold, and locked state in SI units", () => {
    const result = stepGliddenBarbedWire({
      wireTensionN: 650,
      twistsPerFoot: 5,
      animalPushForceN: 120,
      barbSpacingInches: 5.0,
    });
    expect(result.sagCm).toBeGreaterThan(0);
    expect(result.barbSlipThresholdN).toBeGreaterThan(50);
    expect(result.isLocked).toBe(true);
    expect(result.tensileStrengthLbs).toBeGreaterThan(500);
    expect(result.twistWaveAmpPx).toBeCloseTo(10, 2);
  });

  test("builds and articulates procedural bench, flyer arbor, twisted wire strands, coiled barbs, and take-up reel correctly", () => {
    const { rootGroup, nodes, materials, dispose } = buildGliddenBarbedWireModel();
    expect(rootGroup.children.length).toBeGreaterThan(0);
    expect(nodes.bench).toBeDefined();
    expect(nodes.flyerGroup).toBeDefined();
    expect(nodes.strand1Mesh).toBeDefined();
    expect(nodes.strand2Mesh).toBeDefined();
    expect(nodes.barbGroups.length).toBe(5);
    expect(nodes.reelGroup).toBeDefined();

    updateGliddenBarbedWireKinematics(nodes, materials, 0.016, 0.5, 31.4, 6.28, true, true);
    expect(materials.castIron.transparent).toBe(true);
    expect(materials.walnutWood.opacity).toBe(0.45);

    dispose();
  });
});
