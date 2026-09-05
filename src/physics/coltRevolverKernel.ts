/**
 * Source-bounded lockwork state for Samuel Colt's US X9430.
 *
 * The grant prints an ordered mechanism: hammer pin p withdraws locking key r;
 * lifter arm d then drives ratchet tooth s through the shackle; spring m seats
 * the key in the succeeding cylinder ward; only then can the trigger release
 * the hammer. It prints no caliber, pressure, powder charge, projectile mass,
 * velocity, stress geometry, force, timing, or calibrated hammer angle.
 */

import type { TapeUpdater } from "./useFrankenSimPhysics";

export const COLT_DISPLAY_CHAMBER_COUNT = 5;
export const COLT_DISPLAY_HAMMER_ARC_DEG = 45;
export const COLT_KERNEL_SOURCE = "source-bounded-ts" as const;
export const COLT_FRANKENSIM_BOUNDARY =
  "fs-mbd::revolute+ratchet+contact-browser-composition-unavailable" as const;
export const COLT_SOURCE_BOUNDARY =
  "US X9430 discloses the connected hammer-pin, spring key, lifter, ratchet, shackle, cylinder-ward, connecting-rod, and trigger sequence. It supplies no mass, inertia, force, friction, spring rate, contact geometry, time law, pressure, caliber, powder charge, projectile mass, velocity, or stress dimensions. The shared host therefore enforces only the printed event order and normalized connected coordinates. No FrankenSim fs-mbd ratchet/contact composition stepped this frame." as const;

export type ColtLockworkStage =
  | "rest-locked"
  | "key-withdrawing"
  | "ratchet-indexing"
  | "key-seating"
  | "full-cock-locked";

export interface ColtRuntimeControls {
  cockingTravelPct: number;
  chamberIndex: number;
  claim1CapsPresent: boolean;
  claim2PartitionsPresent: boolean;
  claim5ShacklePresent: boolean;
  claim6LockingAndTurningPresent: boolean;
}

/**
 * Raw UI / claim-constraint values accepted at the source boundary.  This is
 * deliberately structural rather than a string-indexed record: a fully read
 * `ColtRuntimeControls` object has no index signature, but it is still a
 * valid input to a subsequent source-order step.
 */
export interface ColtRuntimeControlInput {
  cockingTravelPct?: number;
  chamberIndex?: number;
  claim1CapsPresent?: number | boolean;
  claim2PartitionsPresent?: number | boolean;
  claim5ShacklePresent?: number | boolean;
  claim6LockingAndTurningPresent?: number | boolean;
}

export interface ColtLockworkState {
  controls: ColtRuntimeControls;
  stage: ColtLockworkStage;
  cockingProgress01: number;
  displayHammerAngleDeg: number;
  keyRetraction01: number;
  lifterStroke01: number;
  ratchetAdvanceFraction: number;
  cylinderAdvanceFraction: number;
  cylinderIndexAngleRad: number;
  ratchetIndexAngleRad: number;
  displayStepAngleRad: number;
  alignedChamberIndex: number;
  keySeated: boolean;
  lifterEngaged: boolean;
  cylinderAndRatchetCoupled: boolean;
  safeToReleaseHammer: boolean;
  sourceSequenceClosed: boolean;
}

export interface ColtTapeFrame {
  controls: ColtRuntimeControls;
  outputs: ColtLockworkState;
}

let latestColtTapeFrame: ColtTapeFrame | null = null;

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
}

function smoothstep01(value: number): number {
  const x = clamp01(value);
  return x * x * (3 - 2 * x);
}

function normalizeChamberIndex(index: number): number {
  const integer = Math.max(1, Math.round(Number.isFinite(index) ? index : 1));
  return ((integer - 1) % COLT_DISPLAY_CHAMBER_COUNT) + 1;
}

export function coltNextChamber(
  current: number,
  chamberCount = COLT_DISPLAY_CHAMBER_COUNT,
): number {
  const count = Math.max(1, Math.floor(chamberCount));
  const normalized = ((Math.max(1, Math.floor(current)) - 1) % count) + 1;
  return (normalized % count) + 1;
}

export function readColtRuntimeControls(raw: ColtRuntimeControlInput): ColtRuntimeControls {
  const r = raw as Record<string, any>;
  return {
    cockingTravelPct: Number(
      r.cockingTravelPct ?? r.cockingTravel ?? r.cocking ?? r.travelPct ?? r.travel ?? 0,
    ),
    chamberIndex: normalizeChamberIndex(
      Number(r.chamberIndex ?? r.chamber ?? r.ward ?? r.wardIndex ?? 1),
    ),
    claim1CapsPresent: Number(r.claim1CapsPresent ?? r.claim1Active ?? 1) >= 0.5,
    claim2PartitionsPresent: Number(r.claim2PartitionsPresent ?? r.claim2Active ?? 1) >= 0.5,
    claim5ShacklePresent: Number(r.claim5ShacklePresent ?? r.claim5Active ?? 1) >= 0.5,
    claim6LockingAndTurningPresent:
      Number(r.claim6LockingAndTurningPresent ?? r.claim6Active ?? 1) >= 0.5,
  };
}

/**
 * Normalize the source-described event order without inventing a force or
 * time law. Breakpoints are presentation coordinates, not historical angles.
 */
export function stepColtLockwork(controls: ColtRuntimeControlInput): ColtLockworkState {
  const c = readColtRuntimeControls(controls);
  const p = clamp01(c.cockingTravelPct / 100);
  const keyCanOperate = c.claim6LockingAndTurningPresent;
  const shackleCoupled = c.claim5ShacklePresent && c.claim6LockingAndTurningPresent;

  // Pin p withdraws the key before the lifter is admitted to a ratchet tooth.
  const withdrawal = smoothstep01(p / 0.18);
  const reseating = smoothstep01((p - 0.82) / 0.18);
  const keyRetraction01 = keyCanOperate ? withdrawal * (1 - reseating) : 1;
  const lifterStroke01 = smoothstep01((p - 0.14) / 0.68);
  const ratchetAdvanceFraction = lifterStroke01;
  const cylinderAdvanceFraction = shackleCoupled ? ratchetAdvanceFraction : 0;
  const stepAngle = (Math.PI * 2) / COLT_DISPLAY_CHAMBER_COUNT;
  const baseAngle = -(c.chamberIndex - 1) * stepAngle;
  const ratchetIndexAngleRad = baseAngle - ratchetAdvanceFraction * stepAngle;
  const cylinderIndexAngleRad = baseAngle - cylinderAdvanceFraction * stepAngle;
  const fullCock = p >= 0.995;
  const keySeated = keyCanOperate && (p <= 0.005 || (fullCock && keyRetraction01 <= 0.005));
  const safeToReleaseHammer = fullCock && keySeated && shackleCoupled;

  let stage: ColtLockworkStage;
  if (p <= 0.005) stage = "rest-locked";
  else if (p < 0.18) stage = "key-withdrawing";
  else if (p < 0.82) stage = "ratchet-indexing";
  else if (!fullCock) stage = "key-seating";
  else stage = "full-cock-locked";

  return {
    controls: c,
    stage,
    cockingProgress01: p,
    displayHammerAngleDeg: p * COLT_DISPLAY_HAMMER_ARC_DEG,
    keyRetraction01,
    lifterStroke01,
    ratchetAdvanceFraction,
    cylinderAdvanceFraction,
    cylinderIndexAngleRad,
    ratchetIndexAngleRad,
    displayStepAngleRad: stepAngle,
    alignedChamberIndex:
      cylinderAdvanceFraction >= 0.995 ? coltNextChamber(c.chamberIndex) : c.chamberIndex,
    keySeated,
    lifterEngaged: p >= 0.14 && p < 0.9,
    cylinderAndRatchetCoupled: shackleCoupled,
    safeToReleaseHammer,
    sourceSequenceClosed:
      keyCanOperate &&
      shackleCoupled &&
      (!fullCock || (keySeated && ratchetAdvanceFraction >= 0.995)),
  };
}

export function getColtTapeFrame(): ColtTapeFrame | null {
  return latestColtTapeFrame;
}

export function createColtTransportUpdater(readControls: () => ColtRuntimeControls): TapeUpdater {
  let ticksSincePublish = 4;
  return () => {
    const controls = readControls();
    const outputs = stepColtLockwork(controls);
    latestColtTapeFrame = { controls, outputs };
    ticksSincePublish += 1;
    if (ticksSincePublish < 5) return null;
    ticksSincePublish = 0;
    return {
      machine: {
        poseXMeters: outputs.cylinderAdvanceFraction,
        poseYMeters: outputs.keyRetraction01,
        headingRad: outputs.cylinderIndexAngleRad,
        modeLabel: outputs.stage,
        wheelSpeedMps: 0,
      },
    };
  };
}
