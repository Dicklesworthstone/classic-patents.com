import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import { stepOttoEngine } from "@/physics/catalogKernels";
import {
  OTTO_MODEL_CONNECTING_ROD_LENGTH,
  OTTO_MODEL_CRANK_RADIUS,
  stepOttoMechanismFallback,
} from "@/physics/ottoKernel";
import {
  buildOttoEngineModel,
  OTTO_CONNECTING_ROD_LENGTH,
  OTTO_PISTON_LENGTH,
  OTTO_STUDIO_FLOOR_Y,
  ottoCombustionFlamePresentation,
  updateOttoEngineKinematics,
} from "./ottoEngineModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 194,047 Nikolaus Otto Four-Stroke Engine visual & kinematics boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(join(VISUALS_DIRECTORY, "three", "OttoEngine3D.tsx"), "utf8");
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "ottoEngineModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildOttoEngineModel");
    expect(modelSource).toContain("updateOttoEngineKinematics");
    expect(modelSource).toContain("stepOttoEngine({ engineRpm, compressionRatio })");
    expect(modelSource).not.toContain("stepOttoEngine({})");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(join(VISUALS_DIRECTORY, "three", "OttoEngine3D.tsx"), "utf8");
    const twoDSource = readFileSync(join(VISUALS_DIRECTORY, "OttoEngineSim.tsx"), "utf8");

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
    }
    expect(twoDSource).toContain('updateParam("isRunning"');
    expect(threeSource).toContain('updateParam("isRunning"');
  });

  test("exposes authentic camera presets and cutaway mode for internal 4-stroke observation", () => {
    const threeSource = readFileSync(join(VISUALS_DIRECTORY, "three", "OttoEngine3D.tsx"), "utf8");

    for (const preset of [
      "iso",
      "slide_valve",
      "cylinder_piston",
      "lay_shaft",
      "governor",
      "flywheels",
    ]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("cutawayMode");
    expect(threeSource).toContain("2:1 Lay Shaft");
    expect(threeSource).toContain("controls.setView");
    expect(threeSource).not.toContain("cameraRef");
  });

  test("keeps the modern ideal-cycle lens separate from source-bounded mechanism telemetry", () => {
    const otto = stepOttoEngine({
      engineRpm: 180,
      compressionRatio: 4.5,
    });

    expect(otto.thermalEfficiencyPct).toBeGreaterThan(25);
    expect(otto.govDisplayOmegaRadPerS).toBeCloseTo(9, 3);
    expect(otto.flyballRadius).toBeCloseTo(0.264, 3);
    expect(otto.pistonStrokePx).toBe(35);
    expect(otto.flywheelSvgR).toBe(80);
    expect(otto.spokeCount).toBe(6);
    expect(otto.spokePitchDeg).toBe(60);
    expect(otto.slideStroke).toBe(0.22);
    expect(otto.exhaustLiftAmp).toBe(0.12);
    expect(otto.sleeveHomeY).toBe(0.35);
    expect(otto.cylinderTdcX).toBe(-3.25);
    expect(otto.combustionLengthRef).toBe(1.8);
    expect(otto.expansionFade).toBe(0.7);

    const twoDSource = readFileSync(join(VISUALS_DIRECTORY, "OttoEngineSim.tsx"), "utf8");
    expect(twoDSource).toContain("otto.flywheelSvgR");
    expect(twoDSource).toContain("otto.spokePitchDeg");
    expect(twoDSource).not.toContain("* 80");
    expect(twoDSource).not.toContain("i * 60");
    expect(twoDSource).not.toContain("Indicated Power");
    expect(twoDSource).not.toContain("Peak Pressure");
    expect(twoDSource).toContain("declared r · not measured");

    const threeSource = readFileSync(join(VISUALS_DIRECTORY, "three", "OttoEngine3D.tsx"), "utf8");
    expect(threeSource).not.toContain('label: "BHP"');
    expect(threeSource).not.toContain('label: "P2"');
    expect(threeSource).not.toContain('label: "P3"');
  });

  test("builds and articulates procedural 4-stroke kinematic hierarchy correctly", () => {
    const { root, nodes, materials } = buildOttoEngineModel();
    expect(root.children.length).toBeGreaterThan(5);

    // The four-stroke cycle begins at intake TDC.
    const otto = stepOttoEngine({ engineRpm: 180, compressionRatio: 4.5 });
    const tdcPose = stepOttoMechanismFallback({
      crankAngleRad: 0,
      crankRadius: OTTO_MODEL_CRANK_RADIUS,
      connectingRodLength: OTTO_MODEL_CONNECTING_ROD_LENGTH,
      engineRpm: 180,
    });
    updateOttoEngineKinematics(
      nodes,
      materials,
      tdcPose,
      4.5,
      true,
      true,
      1 / 60,
      otto.govDisplayOmegaRadPerS,
    );
    const tdcPistonX = nodes.pistonGroup.position.x;

    // Intake ends at BDC one half-turn later.
    const bdcPose = stepOttoMechanismFallback({
      crankAngleRad: Math.PI,
      crankRadius: OTTO_MODEL_CRANK_RADIUS,
      connectingRodLength: OTTO_MODEL_CONNECTING_ROD_LENGTH,
      engineRpm: 180,
    });
    updateOttoEngineKinematics(
      nodes,
      materials,
      bdcPose,
      4.5,
      true,
      true,
      1 / 60,
      otto.govDisplayOmegaRadPerS,
    );
    const bdcPistonX = nodes.pistonGroup.position.x;

    expect(tdcPistonX).toBeLessThan(bdcPistonX); // Intake moves away from the head toward BDC.
    expect(nodes.cylinderCutawayMesh.visible).toBe(true);
    expect(nodes.cylinderJacketMesh.visible).toBe(false);
  });

  test("keeps the modeled connecting-rod ends seated on both kernel pins through the cycle", () => {
    const { nodes, materials, connectivityReceipt, dispose } = buildOttoEngineModel();
    const otto = stepOttoEngine({ engineRpm: 180, compressionRatio: 4.5 });
    for (const angle of [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2, 3.5 * Math.PI]) {
      const pose = stepOttoMechanismFallback({
        crankAngleRad: angle,
        crankRadius: OTTO_MODEL_CRANK_RADIUS,
        connectingRodLength: OTTO_MODEL_CONNECTING_ROD_LENGTH,
        engineRpm: 180,
      });
      updateOttoEngineKinematics(
        nodes,
        materials,
        pose,
        4.5,
        true,
        true,
        1 / 60,
        otto.govDisplayOmegaRadPerS,
      );
      nodes.root.updateMatrixWorld(true);
      const crankCenterX = 2.4;
      const modeledBigEndX =
        nodes.connectingRod.position.x +
        Math.cos(nodes.connectingRod.rotation.z) * OTTO_CONNECTING_ROD_LENGTH;
      const modeledBigEndY =
        nodes.connectingRod.position.y +
        Math.sin(nodes.connectingRod.rotation.z) * OTTO_CONNECTING_ROD_LENGTH;
      expect(nodes.connectingRod.position.x).toBeCloseTo(crankCenterX + pose.pistonPinX, 12);
      expect(nodes.connectingRod.position.y).toBeCloseTo(pose.pistonPinY, 12);
      expect(modeledBigEndX).toBeCloseTo(crankCenterX + pose.crankPinX, 12);
      expect(modeledBigEndY).toBeCloseTo(pose.crankPinY, 12);

      const wristPinWorld = nodes.wristPin.getWorldPosition(new THREE.Vector3());
      const crankPinWorld = nodes.crankPin.getWorldPosition(new THREE.Vector3());
      const modeledSmallEndWorld = nodes.connectingRod.localToWorld(new THREE.Vector3());
      const modeledBigEndWorld = nodes.connectingRod.localToWorld(
        new THREE.Vector3(OTTO_CONNECTING_ROD_LENGTH, 0, 0),
      );
      expect(wristPinWorld.distanceTo(modeledSmallEndWorld)).toBeLessThanOrEqual(1e-10);
      expect(crankPinWorld.distanceTo(modeledBigEndWorld)).toBeLessThanOrEqual(1e-10);

      const gasLength = 1.8 * nodes.combustionVolumeMesh.scale.y;
      const gasRightFaceX = nodes.combustionVolumeMesh.position.x + gasLength / 2;
      const pistonCrownX = nodes.pistonGroup.position.x - OTTO_PISTON_LENGTH / 2;
      expect(gasRightFaceX).toBeCloseTo(pistonCrownX, 12);
      for (const connection of connectivityReceipt()) {
        expect(connection.gapMeters).toBeLessThanOrEqual(1e-8);
      }
    }
    dispose();
  });

  test("seats the engine foundation on the studio floor and supports the counter-shaft", () => {
    const { root, dispose } = buildOttoEngineModel();
    root.updateMatrixWorld(true);
    const foot = root.getObjectByName("Engine foundation foot seated on studio floor");
    expect(foot).toBeDefined();
    const footCenter = foot?.getWorldPosition(new THREE.Vector3()) ?? new THREE.Vector3();
    expect(footCenter.y - 0.075).toBeCloseTo(OTTO_STUDIO_FLOOR_Y, 12);
    for (let index = 1; index <= 3; index++) {
      expect(root.getObjectByName(`Counter-shaft bed support ${index}`)).toBeDefined();
    }
    expect(root.getObjectByName("Cylinder-to-bed cooling-water inlet")).toBeDefined();
    dispose();
  });

  test("extinguishes the power-stroke flare and still applies cutaway changes when stopped", () => {
    const midPower = 2.5 * Math.PI;
    expect(ottoCombustionFlamePresentation(midPower, true, true)).toEqual({
      strokeIndex: 2,
      visible: true,
      opacity: 0.8,
      scale: 1.5,
    });
    expect(ottoCombustionFlamePresentation(midPower, false, true)).toEqual({
      strokeIndex: 2,
      visible: false,
      opacity: 0,
      scale: 1,
    });

    const { nodes, materials, dispose } = buildOttoEngineModel();
    const pose = stepOttoMechanismFallback({
      crankAngleRad: midPower,
      crankRadius: OTTO_MODEL_CRANK_RADIUS,
      connectingRodLength: OTTO_MODEL_CONNECTING_ROD_LENGTH,
      engineRpm: 180,
    });
    const otto = stepOttoEngine({ engineRpm: 180, compressionRatio: 4.5 });
    updateOttoEngineKinematics(
      nodes,
      materials,
      pose,
      4.5,
      false,
      false,
      1 / 60,
      otto.govDisplayOmegaRadPerS,
    );
    expect(nodes.cylinderJacketMesh.visible).toBe(true);
    expect(nodes.cylinderCutawayMesh.visible).toBe(false);
    expect(nodes.crankshaftGroup.rotation.z).toBeCloseTo(-Math.PI / 2, 12);
    expect(Math.abs(nodes.governorBallLeft.position.x)).toBeCloseTo(otto.sleeveRadius0, 12);
    expect(nodes.governorSleeve.position.y).toBeCloseTo(otto.sleeveHomeY, 12);
    dispose();
  });
});
