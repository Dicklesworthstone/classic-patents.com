import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import { dieselCameraPresetForViewport } from "./dieselEngineCamera";
import { buildDieselEngineModel, updateDieselEngineKinematics } from "./dieselEngineModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 542,846 Diesel source-bounded visual", () => {
  test("keeps the overview close on tablet and backs it away only for narrow canvases", () => {
    const tablet = dieselCameraPresetForViewport("iso", 644);
    const phone = dieselCameraPresetForViewport("iso", 228);

    expect(Math.hypot(...phone.pos)).toBeGreaterThan(Math.hypot(...tablet.pos));
    expect(phone.target).toEqual(tablet.target);
  });

  test("keeps the 3D route source-bounded and free of later-engine assets", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "DieselEngine3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "dieselEngineModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(threeSource).toContain("held");
    expect(modelSource).toContain("CylinderC");
    expect(modelSource).toContain("AdmissionPlugD");
    expect(modelSource).toContain("AirReservoirL");
    expect(modelSource).toContain("AnnularSpaceS");
    for (const forbidden of ["Augsburg", "80-bar", "10-foot", "poppet", "blast-air"]) {
      expect(modelSource.toLowerCase()).not.toContain(forbidden.toLowerCase());
    }
  });

  test("uses deterministic named-organ pose without synthetic telemetry", () => {
    const { root, nodes } = buildDieselEngineModel();
    expect(root.children.length).toBeGreaterThan(5);

    updateDieselEngineKinematics(nodes, 0, true);
    const initial = nodes.plungerP.position.x;
    expect(nodes.annularSpaceS.visible).toBe(true);
    expect(nodes.cylinderLinerSolid.visible).toBe(false);
    expect(nodes.cylinderLinerCutaway.visible).toBe(true);
    expect(nodes.cylinderJacketSolid.visible).toBe(false);
    expect(nodes.cylinderJacketCutaway.visible).toBe(true);
    expect(nodes.cylinderHeadSolid.visible).toBe(false);
    expect(nodes.cylinderHeadCutaway.visible).toBe(true);

    updateDieselEngineKinematics(nodes, Math.PI / 2, false);
    expect(nodes.plungerP.position.x).not.toBe(initial);
    expect(nodes.annularSpaceS.visible).toBe(false);
    expect(nodes.cylinderLinerSolid.visible).toBe(true);
    expect(nodes.cylinderLinerCutaway.visible).toBe(false);
    expect(nodes.cylinderJacketSolid.visible).toBe(true);
    expect(nodes.cylinderJacketCutaway.visible).toBe(false);
    expect(nodes.cylinderHeadSolid.visible).toBe(true);
    expect(nodes.cylinderHeadCutaway.visible).toBe(false);
  });

  test("keeps the wrist pin, connecting rod, and crank pin closed through a full revolution", () => {
    const { root, nodes } = buildDieselEngineModel();

    for (const phase of [0, Math.PI / 3, Math.PI / 2, Math.PI, (3 * Math.PI) / 2]) {
      updateDieselEngineKinematics(nodes, phase, false);
      root.updateMatrixWorld(true);

      const wrist = nodes.wristPin.getWorldPosition(new THREE.Vector3());
      const crank = nodes.crankPin.getWorldPosition(new THREE.Vector3());
      const center = nodes.connectingRod.getWorldPosition(new THREE.Vector3());
      const halfLength = (1.2 * nodes.connectingRod.scale.x) / 2;
      const rodDirection = new THREE.Vector3(1, 0, 0).applyQuaternion(
        nodes.connectingRod.getWorldQuaternion(new THREE.Quaternion()),
      );
      const endpointA = center.clone().addScaledVector(rodDirection, -halfLength);
      const endpointB = center.clone().addScaledVector(rodDirection, halfLength);

      expect(wrist.distanceTo(crank)).toBeCloseTo(1.2, 6);
      expect(Math.min(endpointA.distanceTo(wrist), endpointB.distanceTo(wrist))).toBeLessThan(1e-6);
      expect(Math.min(endpointA.distanceTo(crank), endpointB.distanceTo(crank))).toBeLessThan(1e-6);
    }
  });

  test("spins the flywheel in one fixed plane around the transverse shaft", () => {
    const { root, nodes } = buildDieselEngineModel();

    for (const phase of [0, Math.PI / 2, Math.PI]) {
      updateDieselEngineKinematics(nodes, phase, false);
      root.updateMatrixWorld(true);
      const normal = new THREE.Vector3(0, 0, 1).applyQuaternion(
        nodes.flywheelRim.getWorldQuaternion(new THREE.Quaternion()),
      );
      expect(normal.x).toBeCloseTo(0, 6);
      expect(normal.y).toBeCloseTo(0, 6);
      expect(Math.abs(normal.z)).toBeCloseTo(1, 6);
    }
  });
});
