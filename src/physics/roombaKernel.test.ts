import { describe, expect, test } from "bun:test";
import {
  ROOMBA_FURNITURE,
  ROOMBA_ROOM,
  type RoombaControls,
  type RoombaState,
  stepRoomba,
} from "./roombaKernel";

describe("US 6,594,844 Autonomous Cleaning Robot: SOTA Collision Detection & Anti-Clipping", () => {
  const defaultControls: RoombaControls = {
    wheelSpeedMps: 0.3,
    turnRateRadSec: 1.5,
    roomWidth: ROOMBA_ROOM.width,
    roomHeight: ROOMBA_ROOM.height,
    sensorHeightInches: 0.5,
    wallDistanceInches: 2.6,
  };

  test("strictly prevents Roomba bumper from penetrating outer room perimeter walls", () => {
    let state: RoombaState | undefined;
    const BUMPER_RADIUS = 0.17;
    const maxX = ROOMBA_ROOM.width / 2 - BUMPER_RADIUS;
    const minX = -ROOMBA_ROOM.width / 2 + BUMPER_RADIUS;
    const maxY = ROOMBA_ROOM.height / 2 - BUMPER_RADIUS;
    const minY = -ROOMBA_ROOM.height / 2 + BUMPER_RADIUS;

    // Run for 300 steps (2.5 seconds)
    for (let i = 0; i < 300; i++) {
      state = stepRoomba(defaultControls, state, 1 / 120);

      // Anti-Clipping Invariant: Roomba coordinates must never exceed wall bumper bounds
      expect(state.x).toBeLessThanOrEqual(maxX + 1e-4);
      expect(state.x).toBeGreaterThanOrEqual(minX - 1e-4);
      expect(state.y).toBeLessThanOrEqual(maxY + 1e-4);
      expect(state.y).toBeGreaterThanOrEqual(minY - 1e-4);
    }
  });

  test("strictly prevents Roomba bumper from penetrating coffee table and armchair furniture", () => {
    let state: RoombaState | undefined;
    const BUMPER_RADIUS = 0.17;

    for (let i = 0; i < 600; i++) {
      state = stepRoomba(defaultControls, state, 1 / 120);

      // Verify distance to all furniture obstacle boxes
      for (const obs of ROOMBA_FURNITURE) {
        const halfW = obs.w / 2;
        const halfH = obs.h / 2;
        const clampedX = Math.max(obs.x - halfW, Math.min(obs.x + halfW, state.x));
        const clampedY = Math.max(obs.y - halfH, Math.min(obs.y + halfH, state.y));

        const deltaX = state.x - clampedX;
        const deltaY = state.y - clampedY;
        const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        // Distance from Roomba center to box boundary must be >= BUMPER_RADIUS - tolerance
        expect(dist).toBeGreaterThanOrEqual(BUMPER_RADIUS - 1e-4);
      }
    }
  });

  test("triggers cliff sensor retreat when floor surface is absent", () => {
    const cliffControls: RoombaControls = {
      ...defaultControls,
      sensorHeightInches: 2.0, // High above floor -> optical cliff detected
    };

    const state = stepRoomba(cliffControls, undefined, 1 / 120);
    expect(state.surfacePresent).toBe(false);
    expect(state.redirectReason).toBe("surface-absent");
    expect(state.mode).toBe("backup");
  });
});
