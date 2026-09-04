import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import { gatlingGunArchivalEdition } from "@/data/editions/gatlingGunEdition";
import { gatlingGunPatent } from "@/data/patents/gatling-gun";
import { stepGatlingGun } from "@/physics/catalogKernels";
import { CATALOG_CLAIM_CONSTRAINTS } from "@/physics/claimConstraints";
import { ENERGY_CHANNEL_OMISSION_REASONS, energyChannelsFor } from "@/physics/energyChannels";
import { PATENT_PHYSICS_REGISTRY } from "@/physics/telemetryData";
import { gatlingGunCameraForViewport } from "./gatlingGunCamera";
import { buildGatlingGunModel } from "./gatlingGunModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

function projectedMeshBounds(root: THREE.Object3D, camera: THREE.PerspectiveCamera) {
  const bounds = {
    minX: Number.POSITIVE_INFINITY,
    maxX: Number.NEGATIVE_INFINITY,
    minY: Number.POSITIVE_INFINITY,
    maxY: Number.NEGATIVE_INFINITY,
  };

  root.updateMatrixWorld(true);
  root.traverse((node) => {
    if (!(node instanceof THREE.Mesh) || !node.visible) return;
    node.geometry.computeBoundingBox();
    const localBounds = node.geometry.boundingBox;
    if (!localBounds) return;

    for (const x of [localBounds.min.x, localBounds.max.x]) {
      for (const y of [localBounds.min.y, localBounds.max.y]) {
        for (const z of [localBounds.min.z, localBounds.max.z]) {
          const projected = new THREE.Vector3(x, y, z)
            .applyMatrix4(node.matrixWorld)
            .project(camera);
          bounds.minX = Math.min(bounds.minX, projected.x);
          bounds.maxX = Math.max(bounds.maxX, projected.x);
          bounds.minY = Math.min(bounds.minY, projected.y);
          bounds.maxY = Math.max(bounds.maxY, projected.y);
        }
      }
    }
  });
  return bounds;
}

describe("US 36,836 Richard Gatling Revolving Battery Gun visual & ballistics boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(join(VISUALS_DIRECTORY, "three", "GatlingGun3D.tsx"), "utf8");
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "gatlingGunModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildGatlingGunModel");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(join(VISUALS_DIRECTORY, "three", "GatlingGun3D.tsx"), "utf8");
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "gatlingGunModel.ts"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
      expect(modelSource).not.toContain(forbidden);
    }
  });

  test("exposes authentic camera presets and cutaway mode for breech inspection", () => {
    const threeSource = readFileSync(join(VISUALS_DIRECTORY, "three", "GatlingGun3D.tsx"), "utf8");

    for (const preset of ["iso", "barrels", "breech_cam", "hopper", "crank", "top"]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("isCutaway");
    expect(threeSource).toContain("Gatling Gun 3D");
    expect(threeSource).toContain("controls.setView");
    expect(threeSource).not.toContain("cameraRef");
    expect(threeSource).toContain("gatlingGunCameraForViewport");
  });

  test("keeps the complete animated source-model envelope inside the exact 320px phone canvas", () => {
    const model = buildGatlingGunModel();
    try {
      const desktop = gatlingGunCameraForViewport("iso", 1216, 460);
      const tablet = gatlingGunCameraForViewport("iso", 718, 460);
      expect(desktop).toEqual({ pos: [9, 5, 10], target: [0, 0, 0] });
      expect(tablet).toEqual(desktop);

      // V26's 320px browser viewport produces a 286 × 380px studio canvas.
      // Sweep every barrel/crank orientation: the primary-control maximum can
      // reach any phase, while claim inversion may freeze an arbitrary one.
      const canvasWidth = 286;
      const cameraView = gatlingGunCameraForViewport("iso", canvasWidth, 380);
      const camera = new THREE.PerspectiveCamera(38, canvasWidth / 380, 0.1, 1000);
      camera.position.set(...cameraView.pos);
      camera.lookAt(...cameraView.target);
      camera.updateProjectionMatrix();
      camera.updateMatrixWorld();

      for (let phaseIndex = 0; phaseIndex < 72; phaseIndex++) {
        const phase = (phaseIndex * Math.PI * 2) / 72;
        model.nodes.barrelClusterGroup.rotation.x = phase;
        model.nodes.crankGroup.rotation.x = phase;
        const frame = projectedMeshBounds(model.rootGroup, camera);
        expect(frame.minX, `phase ${phaseIndex} left edge`).toBeGreaterThan(-0.8);
        expect(frame.maxX, `phase ${phaseIndex} muzzle edge`).toBeLessThan(0.85);
        expect(frame.minY, `phase ${phaseIndex} lower edge`).toBeGreaterThan(-0.65);
        expect(frame.maxY, `phase ${phaseIndex} upper edge`).toBeLessThan(0.45);
      }
    } finally {
      model.dispose();
    }
  });

  test("computes genuine Gatling rotary rate of fire and cooling intervals in SI units", () => {
    const result = stepGatlingGun({ crankRpm: 60, barrelCount: 6 });
    expect(result.roundsPerMin).toBe(360);
    expect(result.barrelCoolingIntervalS).toBeGreaterThan(0.8);
    expect(result.muzzleEnergyJoules).toBeGreaterThan(1500);
    expect(result.crankOmegaRadPerS).toBeCloseTo(2 * Math.PI, 2);
    expect(result.barrelSpacingRad).toBeCloseTo(Math.PI / 3, 4);
    expect(result.camStrokeStudio).toBeCloseTo(0.38, 3);
    expect(result.fireIntervalS).toBeCloseTo(result.cycleTimeMs / 1000, 4);
    expect(result.clusterRadiusPx).toBe(32);
  });

  test("builds and articulates procedural 6-barrel cluster and lock bolts correctly", () => {
    const { rootGroup, nodes, materials, dispose } = buildGatlingGunModel();
    expect(rootGroup.children.length).toBeGreaterThan(3);
    expect(nodes.barrels.length).toBe(6);
    expect(nodes.bolts.length).toBe(6);
    expect(nodes.breechCover).toBeDefined();

    // Verify material properties
    expect(materials.bluedSteel.metalness).toBeGreaterThan(0.8);
    expect(materials.bronzeReceiver.roughness).toBeLessThan(0.4);

    dispose();
  });

  test("derives all 5 printed claims dynamically from edition without duplicate strings", () => {
    expect(gatlingGunPatent.claims).toHaveLength(5);
    const editionClaims = gatlingGunArchivalEdition.blocks.filter((b) => b.kind === "claim");
    expect(editionClaims).toHaveLength(5);

    for (let i = 1; i <= 5; i++) {
      const claim = gatlingGunPatent.claims.find((c) => c.number === i);
      const editionBlock = editionClaims.find((c) => c.number === i);
      expect(claim).toBeDefined();
      expect(editionBlock).toBeDefined();
      const expectedText = editionBlock?.inlines.map((inl) => inl.text).join("");
      expect(claim?.originalText).toBe(expectedText);
    }
  });

  test("aligns claim constraints with authentic US 36,836 claims 1 through 5", () => {
    const constraints = CATALOG_CLAIM_CONSTRAINTS["us-36836-gatling-gun"];
    expect(constraints).toBeDefined();
    expect(constraints.length).toBe(5);
    expect(constraints.map((c) => c.claimNumber)).toEqual([1, 2, 3, 4, 5]);
    expect(constraints[0].claimTitle).toContain("Co-Revolving Lock-Cylinder");
    expect(constraints[1].claimTitle).toContain("One Simultaneous Lock Per Barrel");
    expect(constraints[2].claimTitle).toContain("Stationary Cocking Ring");
  });

  test("binds energy output to honest omission reason without synthetic wattage", () => {
    expect(energyChannelsFor("us-36836-gatling-gun", {})).toEqual([]);
    expect(ENERGY_CHANNEL_OMISSION_REASONS["us-36836-gatling-gun"]).toContain(
      "no measured operator torque",
    );
  });

  test("provides valid provenance classifications for all Gatling metrics and controls", () => {
    const entry = PATENT_PHYSICS_REGISTRY["us-36836-gatling-gun"];
    expect(entry).toBeDefined();
    for (const ctrl of entry.controls) {
      expect(ctrl.provenance).toBeDefined();
    }
    const metrics = entry.computeMetrics({ crankRpm: 60, barrelCount: 6 });
    for (const m of metrics) {
      expect(m.provenance).toBeDefined();
    }
  });
});
