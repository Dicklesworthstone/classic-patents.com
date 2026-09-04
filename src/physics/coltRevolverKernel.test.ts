import { describe, expect, test } from "bun:test";
import {
  COLT_DISPLAY_CHAMBER_COUNT,
  COLT_SOURCE_BOUNDARY,
  coltNextChamber,
  readColtRuntimeControls,
  stepColtLockwork,
} from "./coltRevolverKernel";

describe("US X9430 source-bounded lockwork", () => {
  test("withdraws the key before indexing and seats it only after the ratchet step", () => {
    const rest = stepColtLockwork({ cockingTravelPct: 0 });
    const withdrawing = stepColtLockwork({ cockingTravelPct: 10 });
    const indexing = stepColtLockwork({ cockingTravelPct: 50 });
    const seating = stepColtLockwork({ cockingTravelPct: 90 });
    const fullCock = stepColtLockwork({ cockingTravelPct: 100 });

    expect(rest.stage).toBe("rest-locked");
    expect(rest.keySeated).toBe(true);
    expect(rest.cylinderAdvanceFraction).toBe(0);
    expect(withdrawing.stage).toBe("key-withdrawing");
    expect(withdrawing.keyRetraction01).toBeGreaterThan(0);
    expect(withdrawing.ratchetAdvanceFraction).toBe(0);
    expect(indexing.stage).toBe("ratchet-indexing");
    expect(indexing.keyRetraction01).toBeCloseTo(1, 8);
    expect(indexing.cylinderAdvanceFraction).toBeGreaterThan(0);
    expect(indexing.cylinderAdvanceFraction).toBeLessThan(1);
    expect(seating.stage).toBe("key-seating");
    expect(seating.ratchetAdvanceFraction).toBeGreaterThan(0.9);
    expect(seating.keyRetraction01).toBeLessThan(1);
    expect(fullCock.stage).toBe("full-cock-locked");
    expect(fullCock.keySeated).toBe(true);
    expect(fullCock.safeToReleaseHammer).toBe(true);
    expect(fullCock.cylinderAdvanceFraction).toBe(1);
  });

  test("advances exactly one display ward during cocking and never invents a firing advance", () => {
    const start = stepColtLockwork({ cockingTravelPct: 0, chamberIndex: 3 });
    const cocked = stepColtLockwork({ cockingTravelPct: 100, chamberIndex: 3 });
    const released = stepColtLockwork({ cockingTravelPct: 0, chamberIndex: 4 });

    expect(cocked.alignedChamberIndex).toBe(4);
    expect(cocked.cylinderIndexAngleRad - start.cylinderIndexAngleRad).toBeCloseTo(
      -(Math.PI * 2) / COLT_DISPLAY_CHAMBER_COUNT,
      10,
    );
    // Committing the already-aligned chamber and dropping the hammer preserves
    // cylinder pose: release itself contributes no extra ratchet step.
    expect(released.cylinderIndexAngleRad).toBeCloseTo(cocked.cylinderIndexAngleRad, 10);
    expect(coltNextChamber(5)).toBe(1);
  });

  test("withholds cylinder motion or safe release when printed couplings are absent", () => {
    const noShackle = stepColtLockwork({
      cockingTravelPct: 100,
      claim5ShacklePresent: 0,
    });
    const noLock = stepColtLockwork({
      cockingTravelPct: 100,
      claim6LockingAndTurningPresent: 0,
    });

    expect(noShackle.ratchetAdvanceFraction).toBe(1);
    expect(noShackle.cylinderAdvanceFraction).toBe(0);
    expect(noShackle.safeToReleaseHammer).toBe(false);
    expect(noLock.keySeated).toBe(false);
    expect(noLock.safeToReleaseHammer).toBe(false);
    expect(noLock.sourceSequenceClosed).toBe(false);
  });

  test("documents the missing physical card instead of fabricating ballistics", () => {
    const controls = readColtRuntimeControls({});
    expect(controls.cockingTravelPct).toBe(0);
    expect(COLT_SOURCE_BOUNDARY).toContain("no mass, inertia, force, friction");
    expect(COLT_SOURCE_BOUNDARY).toContain("pressure");
    expect(COLT_SOURCE_BOUNDARY).toContain("No FrankenSim");
  });
});
