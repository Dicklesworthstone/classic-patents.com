import { describe, expect, test } from "bun:test";
import {
  initialRoombaState,
  ROOMBA_COLLIDERS,
  ROOMBA_ROOM,
  type RoombaControls,
  type RoombaState,
  roombaChassisSpeedMps,
  stepRoomba,
} from "./roombaKernel";
import { roombaPoseHudPresentation } from "./roombaWasm";

describe("US 6,594,844 Autonomous Cleaning Robot: SOTA Collision Detection & Anti-Clipping", () => {
  const defaultControls: RoombaControls = {
    wheelSpeedMps: 0.3,
    turnRateRadSec: 1.5,
    roomWidth: ROOMBA_ROOM.width,
    roomHeight: ROOMBA_ROOM.height,
    sensorHeightInches: 0.5,
  };

  test("derives wall sensing from the shared room geometry when no test override is supplied", () => {
    const center = stepRoomba(defaultControls);
    expect(center.wallPresent).toBe(false);
    expect(center.redirectReason).toBe("none");

    const sensorGapM = 2.6 / 39.37007874015748;
    const nearRightWall = {
      ...center,
      x: ROOMBA_ROOM.width / 2 - 0.17 - sensorGapM,
      y: 0,
      heading: 0,
      mode: "straight" as const,
      timeInMode: 0,
    };
    const detected = stepRoomba(defaultControls, nearRightWall, 1 / 120);
    expect(detected.wallPresent).toBe(true);
    expect(detected.redirectReason).toBe("wall-detected");
    expect(detected.mode).toBe("turn");
  });

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

      // Verify distance to every low solid that actually reaches bumper height.
      for (const obs of ROOMBA_COLLIDERS) {
        const halfW = obs.w / 2;
        const halfH = obs.h / 2;
        const clampedX = Math.max(obs.x - halfW, Math.min(obs.x + halfW, state.x));
        const clampedY = Math.max(obs.y - halfH, Math.min(obs.y + halfH, state.y));

        const deltaX = state.x - clampedX;
        const deltaY = state.y - clampedY;
        const dist = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        // Distance from Roomba center to the solid must be >= bumper radius.
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

  test("Claim 1 inversion removes optical redirection but preserves mechanical projection", () => {
    const sensorGapM = 2.6 / 39.37007874015748;
    const initial = stepRoomba(defaultControls);
    const nearRightWall: RoombaState = {
      ...initial,
      x: ROOMBA_ROOM.width / 2 - 0.17 - sensorGapM,
      y: 0,
      heading: 0,
      mode: "straight",
      timeInMode: 0,
    };
    const noOpticalRedirect = stepRoomba(
      { ...defaultControls, opticalSensorEnabled: false },
      nearRightWall,
      1 / 120,
    );
    expect(noOpticalRedirect.opticalSensorEnabled).toBe(false);
    expect(noOpticalRedirect.wallPresent).toBe(false);
    expect(noOpticalRedirect.redirectReason).toBe("none");
    expect(noOpticalRedirect.mode).toBe("straight");

    const atWall = { ...noOpticalRedirect, x: ROOMBA_ROOM.width / 2 - 0.17 + 0.01 };
    const mechanicallyProjected = stepRoomba(
      { ...defaultControls, opticalSensorEnabled: false },
      atWall,
      1 / 120,
    );
    expect(mechanicallyProjected.x).toBeLessThanOrEqual(ROOMBA_ROOM.width / 2 - 0.17);
    expect(mechanicallyProjected.mode).toBe("backup");
  });

  test("reports signed chassis motion rather than the requested speed during redirects", () => {
    const initial = stepRoomba(defaultControls);
    const backup = stepRoomba(
      defaultControls,
      { ...initial, mode: "backup", timeInMode: 0 },
      1 / 120,
    );
    const turn = stepRoomba(defaultControls, { ...initial, mode: "turn", timeInMode: 0 }, 1 / 120);
    expect(roombaChassisSpeedMps(backup)).toBeLessThan(0);
    expect(roombaChassisSpeedMps(turn)).toBeCloseTo(0, 12);
  });

  test("fails closed before either runtime on invalid host inputs", () => {
    expect(() => stepRoomba({ ...defaultControls, wheelSpeedMps: Number.NaN })).toThrow(RangeError);
    expect(() => stepRoomba(defaultControls, undefined, 0.5)).toThrow(RangeError);
    expect(() =>
      stepRoomba(defaultControls, {
        ...initialRoombaState(),
        mode: "teleport" as RoombaState["mode"],
      }),
    ).toThrow(RangeError);
    expect(() =>
      stepRoomba({ ...defaultControls, opticalSensorEnabled: 1 as unknown as boolean }),
    ).toThrow(RangeError);
  });

  test("keeps the cold-start owner label distinct from an accepted fallback step", () => {
    expect(roombaPoseHudPresentation("HONEST_PLACEHOLDER").value).toBe("awaiting step");
    expect(roombaPoseHudPresentation("TS_FALLBACK").value).toBe("typed TS mirror");
    expect(roombaPoseHudPresentation("WASM").value).toBe("fs-mbd WASM");
  });
});
