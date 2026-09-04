import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import { initialRoombaState, ROOMBA_ROOM, stepRoomba } from "@/physics/roombaKernel";
import { buildRoombaModel } from "./RoombaModel";
import { ROOMBA_CAMERA_PRESETS, roombaCameraViewForViewport } from "./roombaCamera";

const ROOT = process.cwd();

function isEffectivelyVisible(candidate: THREE.Object3D) {
  let current: THREE.Object3D | null = candidate;
  while (current) {
    if (!current.visible) return false;
    current = current.parent;
  }
  return true;
}

function projectedMeshBounds(
  cameraView: ReturnType<typeof roombaCameraViewForViewport>,
  viewportWidth: number,
  viewportHeight: number,
  root: THREE.Object3D,
) {
  root.updateWorldMatrix(true, true);
  const camera = new THREE.PerspectiveCamera(42, viewportWidth / viewportHeight, 0.1, 1000);
  camera.position.set(...cameraView.pos);
  camera.lookAt(...cameraView.target);
  camera.updateProjectionMatrix();
  camera.updateWorldMatrix(true, false);

  const points: THREE.Vector3[] = [];
  root.traverse((candidate) => {
    if (!isEffectivelyVisible(candidate) || !(candidate instanceof THREE.Mesh)) return;
    const positions = candidate.geometry.getAttribute("position");
    if (!positions) return;

    for (let index = 0; index < positions.count; index += 1) {
      points.push(
        new THREE.Vector3(positions.getX(index), positions.getY(index), positions.getZ(index))
          .applyMatrix4(candidate.matrixWorld)
          .project(camera),
      );
    }
  });

  if (points.length === 0) throw new Error("Expected a visible Roomba mesh.");

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

function setModelState(
  model: ReturnType<typeof buildRoombaModel>,
  state: ReturnType<typeof initialRoombaState>,
) {
  model.mainGroup.position.set(state.displayX, 0, state.displayY);
  model.mainGroup.rotation.y = -state.heading;
  model.updateKinematics(state);
}

describe("Roomba desktop teaching camera", () => {
  test("tightens only desktop isometric while retaining room and compact presets", () => {
    const desktop = roombaCameraViewForViewport("iso", 1214);
    expect(desktop).toEqual({ pos: [0.55, -4.14, 0.5], target: [0.05, -4.55, 0] });
    expect(roombaCameraViewForViewport("iso", 720)).toEqual(ROOMBA_CAMERA_PRESETS.iso);
    expect(roombaCameraViewForViewport("iso", 320)).toEqual(ROOMBA_CAMERA_PRESETS.iso);
    expect(roombaCameraViewForViewport("cleaning_path", 1214)).toEqual(
      ROOMBA_CAMERA_PRESETS.cleaning_path,
    );
    expect(roombaCameraViewForViewport("robot_chassis", 1214)).toEqual(
      ROOMBA_CAMERA_PRESETS.robot_chassis,
    );

    const studioSource = readFileSync(
      join(ROOT, "src/components/patents/visuals/three/Roomba3D.tsx"),
      "utf8",
    );
    expect(studioSource).toContain("roombaCameraViewForViewport");
  });

  test("keeps the desktop chassis, drive, and Claim 1 contrast in their UI-safe lane", () => {
    const viewport = [1214, 460] as const;
    const cameraView = roombaCameraViewForViewport("iso", viewport[0]);
    const model = buildRoombaModel();
    try {
      const defaultState = initialRoombaState();
      setModelState(model, defaultState);
      const defaultBounds = projectedMeshBounds(cameraView, ...viewport, model.mainGroup);
      const sensorBounds = projectedMeshBounds(cameraView, ...viewport, model.opticalSensorGroup);
      const wheelBounds = projectedMeshBounds(cameraView, ...viewport, model.leftWheel);

      // The title toolbar ends near +0.70 NDC. The two lower HUD cards leave
      // a central lane bounded horizontally by about -0.55 and +0.25 NDC.
      expect(defaultBounds.minX).toBeGreaterThan(-0.3);
      expect(defaultBounds.maxX).toBeLessThan(0.2);
      expect(defaultBounds.minY).toBeGreaterThan(-0.25);
      expect(defaultBounds.maxY).toBeLessThan(0.66);
      expect(defaultBounds.widthPx).toBeGreaterThan(250);
      expect(defaultBounds.heightPx).toBeGreaterThan(175);
      expect(sensorBounds.widthPx).toBeGreaterThan(60);
      expect(wheelBounds.heightPx).toBeGreaterThan(50);

      // Drive Speed = 1 m/s is the V24 primary-control maximum. Advance the
      // same deterministic kernel tape for 0.2 s, including its brush/wheel
      // pose and resulting spiral displacement, instead of testing a static
      // proxy at the origin.
      let maxState = defaultState;
      for (let index = 0; index < 24; index += 1) {
        maxState = stepRoomba(
          {
            wheelSpeedMps: 1,
            turnRateRadSec: 1.5,
            roomWidth: ROOMBA_ROOM.width,
            roomHeight: ROOMBA_ROOM.height,
          },
          maxState,
          1 / 120,
        );
      }
      setModelState(model, maxState);
      const maxBounds = projectedMeshBounds(cameraView, ...viewport, model.mainGroup);
      expect(maxBounds.minX).toBeGreaterThan(-0.42);
      expect(maxBounds.maxX).toBeLessThan(0.23);
      expect(maxBounds.minY).toBeGreaterThan(-0.6);
      expect(maxBounds.maxY).toBeLessThan(0.46);
      expect(maxBounds.widthPx).toBeGreaterThan(350);
      expect(maxBounds.heightPx).toBeGreaterThan(220);

      // ClaimConstraintToggle removes only the optical emitter/detector
      // subsystem. The rest of the teaching model remains prominent.
      model.setOpticalSensorEnabled(false);
      expect(model.opticalSensorGroup.visible).toBe(false);
      const claimInvertedBounds = projectedMeshBounds(cameraView, ...viewport, model.mainGroup);
      expect(claimInvertedBounds.widthPx).toBeGreaterThan(350);
      expect(claimInvertedBounds.heightPx).toBeGreaterThan(210);
      expect(claimInvertedBounds.minX).toBeGreaterThan(-0.42);
      expect(claimInvertedBounds.maxX).toBeLessThan(0.23);
      expect(claimInvertedBounds.minY).toBeGreaterThan(-0.55);
      expect(claimInvertedBounds.maxY).toBeLessThan(0.46);
    } finally {
      model.dispose();
    }
  });
});
