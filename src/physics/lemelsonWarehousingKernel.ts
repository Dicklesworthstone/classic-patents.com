export interface LemelsonWarehousingSIState {
  readonly position: [number, number, number];
  readonly velocity: [number, number, number];
  readonly acceleration: [number, number, number];
  readonly energy: {
    readonly kinetic: number;
    readonly potential: number;
    readonly thermal: number;
    readonly total: number;
  };
  readonly power: number;
  readonly efficiency: number;
  readonly forces: {
    readonly gravity: number;
    readonly thrust: number;
  };
}

export interface LemelsonWarehousingControls {
  readonly targetBayX: number; // Column index (1 to 10)
  readonly targetShelfZ: number; // Shelf level (1 to 6)
  readonly bayWidth: number; // Distance between bays (m, e.g. 1.2 m)
  readonly shelfHeight: number; // Distance between shelves (m, e.g. 0.8 m)
  readonly payloadMass: number; // Payload mass (kg, e.g. 250 kg)
  readonly traverseSpeed: number; // Aisle traverse cruise speed (m/s, e.g. 1.5 m/s)
  readonly hoistSpeed: number; // Vertical hoist speed (m/s, e.g. 0.6 m/s)
  readonly forkSpeed: number; // Lateral fork speed (m/s, e.g. 0.3 m/s)
  readonly operationMode: number; // 0: Auto Deposit, 1: Auto Retrieve, 2: Continuous Shuttle
}

export interface LemelsonWarehousingTelemetry {
  readonly carriageX: number; // Horizontal position along aisle (m)
  readonly elevatorZ: number; // Vertical position on mast (m)
  readonly forkY: number; // Lateral reach into cubicle (m)
  readonly velocityX: number; // Horizontal speed (m/s)
  readonly velocityZ: number; // Vertical speed (m/s)
  readonly velocityY: number; // Fork reach speed (m/s)
  readonly counterPrCx: number; // Horizontal predetermining counter remaining counts
  readonly counterPrCz: number; // Vertical predetermining counter remaining counts
  readonly scannerVoltageX: number; // Phototube amplifier output voltage (V, 0-10V)
  readonly scannerVoltageZ: number; // Vertical phototube amplifier output (V, 0-10V)
  readonly markerPulseActive: boolean; // Optical pulse relay trigger
  readonly activeMotor: "Mx (Traverse)" | "Mz (Hoist)" | "My (Forks)" | "Braked / Idle";
  readonly cyclePhase: number; // 0: Idle, 1: Traverse X, 2: Hoist Z, 3: Fork Extend, 4: Vertical Transfer, 5: Fork Retract, 6: Return Home
  readonly cyclePhaseName: string;
  readonly mechanicalPowerWatts: number; // Instantaneous mechanical drive power (W)
  readonly kineticEnergyJoules: number; // Total system kinetic energy (J)
  readonly potentialEnergyJoules: number; // Elevator gravitational potential energy (J)
  readonly positioningAccuracyMm: number; // Alignment error relative to bay center (mm)
  readonly totalPalletsHandled: number;
}

export const DEFAULT_LEMELSON_CONTROLS: LemelsonWarehousingControls = {
  targetBayX: 5,
  targetShelfZ: 3,
  bayWidth: 1.2,
  shelfHeight: 0.8,
  payloadMass: 250,
  traverseSpeed: 1.2,
  hoistSpeed: 0.5,
  forkSpeed: 0.25,
  operationMode: 0,
};

const CRANE_TARE_MASS = 500; // kg (Aisle carriage + mast)
const ELEVATOR_TARE_MASS = 100; // kg (Elevator carriage + forks)
const GRAVITY = 9.80665; // m/s^2
const MAX_FORK_REACH = 0.85; // m

export function readLemelsonWarehousingControls(
  params: Record<string, number>,
): LemelsonWarehousingControls {
  return {
    targetBayX: Math.max(1, Math.min(10, Math.round(params.targetBayX ?? 5))),
    targetShelfZ: Math.max(1, Math.min(6, Math.round(params.targetShelfZ ?? 3))),
    bayWidth: Math.max(0.8, Math.min(2.0, params.bayWidth ?? 1.2)),
    shelfHeight: Math.max(0.5, Math.min(1.5, params.shelfHeight ?? 0.8)),
    payloadMass: Math.max(50, Math.min(1000, params.payloadMass ?? 250)),
    traverseSpeed: Math.max(0.4, Math.min(3.0, params.traverseSpeed ?? 1.2)),
    hoistSpeed: Math.max(0.2, Math.min(1.5, params.hoistSpeed ?? 0.5)),
    forkSpeed: Math.max(0.1, Math.min(0.8, params.forkSpeed ?? 0.25)),
    operationMode: Math.max(0, Math.min(2, Math.round(params.operationMode ?? 0))),
  };
}

export function stepLemelsonWarehousingSi(
  controls: LemelsonWarehousingControls,
  elapsedSec: number,
): LemelsonWarehousingTelemetry {
  const targetX = controls.targetBayX * controls.bayWidth;
  const targetZ = controls.targetShelfZ * controls.shelfHeight;

  // Phase durations
  const traverseTime = targetX / controls.traverseSpeed;
  const hoistTime = targetZ / controls.hoistSpeed;
  const forkExtendTime = MAX_FORK_REACH / controls.forkSpeed;
  const vertShiftTime = 0.05 / (controls.hoistSpeed * 0.4); // 50 mm engage shift
  const forkRetractTime = MAX_FORK_REACH / controls.forkSpeed;
  const returnTraverseTime = targetX / controls.traverseSpeed;
  const returnHoistTime = targetZ / controls.hoistSpeed;

  const singleCycleDuration =
    traverseTime +
    hoistTime +
    forkExtendTime +
    vertShiftTime +
    forkRetractTime +
    Math.max(returnTraverseTime, returnHoistTime) +
    1.0; // 1s dwell

  const cycleIndex = Math.floor(elapsedSec / singleCycleDuration);
  const tInCycle = elapsedSec % singleCycleDuration;

  let phase = 0;
  let phaseName = "Idle / Ready";
  let curX = 0;
  let curZ = 0.2; // Floor resting clearance
  let curY = 0;
  let vx = 0;
  let vz = 0;
  let vy = 0;
  let activeMotor: "Mx (Traverse)" | "Mz (Hoist)" | "My (Forks)" | "Braked / Idle" =
    "Braked / Idle";

  const tEnd1 = traverseTime;
  const tEnd2 = tEnd1 + hoistTime;
  const tEnd3 = tEnd2 + forkExtendTime;
  const tEnd4 = tEnd3 + vertShiftTime;
  const tEnd5 = tEnd4 + forkRetractTime;

  if (tInCycle < tEnd1) {
    // Phase 1: Horizontal traverse along aisle track
    phase = 1;
    phaseName = "Phase 1: Horizontal Aisle Traverse (Mx)";
    activeMotor = "Mx (Traverse)";
    const prog = tInCycle / traverseTime;
    curX = prog * targetX;
    vx = controls.traverseSpeed;
  } else if (tInCycle < tEnd2) {
    // Phase 2: Vertical elevator hoist
    phase = 2;
    phaseName = "Phase 2: Vertical Elevator Hoist (Mz)";
    activeMotor = "Mz (Hoist)";
    curX = targetX;
    const prog = (tInCycle - tEnd1) / hoistTime;
    curZ = 0.2 + prog * (targetZ - 0.2);
    vz = controls.hoistSpeed;
  } else if (tInCycle < tEnd3) {
    // Phase 3: Lateral fork reach into storage bay
    phase = 3;
    phaseName = "Phase 3: Lateral Fork Extension (My)";
    activeMotor = "My (Forks)";
    curX = targetX;
    curZ = targetZ;
    const prog = (tInCycle - tEnd2) / forkExtendTime;
    curY = prog * MAX_FORK_REACH;
    vy = controls.forkSpeed;
  } else if (tInCycle < tEnd4) {
    // Phase 4: Vertical transfer / engagement shift
    phase = 4;
    phaseName = "Phase 4: Pallet Seating Transfer (Mz)";
    activeMotor = "Mz (Hoist)";
    curX = targetX;
    curY = MAX_FORK_REACH;
    const prog = (tInCycle - tEnd3) / vertShiftTime;
    curZ = targetZ - prog * 0.05;
    vz = -controls.hoistSpeed * 0.4;
  } else if (tInCycle < tEnd5) {
    // Phase 5: Lateral fork retraction
    phase = 5;
    phaseName = "Phase 5: Fork Retraction (My Reverse)";
    activeMotor = "My (Forks)";
    curX = targetX;
    curZ = targetZ - 0.05;
    const prog = (tInCycle - tEnd4) / forkRetractTime;
    curY = MAX_FORK_REACH * (1 - prog);
    vy = -controls.forkSpeed;
  } else {
    // Phase 6: Return to home position
    phase = 6;
    phaseName = "Phase 6: Return to Home Station";
    activeMotor = "Mx (Traverse)";
    const remTime = tInCycle - tEnd5;
    const returnProgX = Math.min(1, remTime / returnTraverseTime);
    const returnProgZ = Math.min(1, remTime / returnHoistTime);
    curX = targetX * (1 - returnProgX);
    curZ = (targetZ - 0.05) * (1 - returnProgZ) + 0.2 * returnProgZ;
    curY = 0;
    vx = returnProgX < 1 ? -controls.traverseSpeed : 0;
    vz = returnProgZ < 1 ? -controls.hoistSpeed : 0;
  }

  // Optical scanner simulation along X and Z
  // Distance to nearest bay upright
  const nearestBayX = Math.round(curX / controls.bayWidth);
  const distToMarkerX = Math.abs(curX - nearestBayX * controls.bayWidth);
  const scannerVoltageX = 10 * Math.exp(-(distToMarkerX * distToMarkerX) / (2 * 0.04 * 0.04));

  const nearestShelfZ = Math.round(curZ / controls.shelfHeight);
  const distToMarkerZ = Math.abs(curZ - nearestShelfZ * controls.shelfHeight);
  const scannerVoltageZ = 10 * Math.exp(-(distToMarkerZ * distToMarkerZ) / (2 * 0.03 * 0.03));

  const markerPulseActive = scannerVoltageX > 4.5 || scannerVoltageZ > 4.5;

  // Predetermining counters decrementing toward zero
  const bayCountPassedX = Math.floor(curX / controls.bayWidth);
  const counterPrCx = Math.max(0, controls.targetBayX - bayCountPassedX);

  const shelfCountPassedZ = Math.floor(curZ / controls.shelfHeight);
  const counterPrCz = Math.max(0, controls.targetShelfZ - shelfCountPassedZ);

  // Power & Energetics
  const currentPayload = phase >= 3 && phase <= 4 ? controls.payloadMass : 0;
  const totalMovingMass = CRANE_TARE_MASS + ELEVATOR_TARE_MASS + currentPayload;

  const mechanicalPowerWatts =
    Math.abs(vx) > 0
      ? (totalMovingMass * 0.05 + 50) * Math.abs(vx) // Rolling resistance + friction
      : Math.abs(vz) > 0
        ? (ELEVATOR_TARE_MASS + currentPayload) * GRAVITY * Math.abs(vz)
        : Math.abs(vy) > 0
          ? 120 * Math.abs(vy)
          : 15; // Quiescent standby

  const kineticEnergyJoules =
    0.5 * totalMovingMass * vx * vx +
    0.5 * (ELEVATOR_TARE_MASS + currentPayload) * (vz * vz + vy * vy);

  const potentialEnergyJoules = (ELEVATOR_TARE_MASS + currentPayload) * GRAVITY * curZ;

  const positioningAccuracyMm =
    phase === 3 || phase === 4 || phase === 5
      ? Math.abs(curX - targetX) * 1000 + Math.abs(curZ - targetZ) * 1000
      : 0.5;

  return {
    carriageX: curX,
    elevatorZ: curZ,
    forkY: curY,
    velocityX: vx,
    velocityZ: vz,
    velocityY: vy,
    counterPrCx,
    counterPrCz,
    scannerVoltageX,
    scannerVoltageZ,
    markerPulseActive,
    activeMotor,
    cyclePhase: phase,
    cyclePhaseName: phaseName,
    mechanicalPowerWatts,
    kineticEnergyJoules,
    potentialEnergyJoules,
    positioningAccuracyMm,
    totalPalletsHandled: cycleIndex + (phase >= 5 ? 1 : 0),
  };
}

export function lemelsonWarehousingTelemetryToSiState(
  t: LemelsonWarehousingTelemetry,
): LemelsonWarehousingSIState {
  return {
    position: [t.carriageX, t.forkY, t.elevatorZ],
    velocity: [t.velocityX, t.velocityY, t.velocityZ],
    acceleration: [0, 0, 0],
    energy: {
      kinetic: t.kineticEnergyJoules,
      potential: t.potentialEnergyJoules,
      thermal: 0,
      total: t.kineticEnergyJoules + t.potentialEnergyJoules,
    },
    power: t.mechanicalPowerWatts,
    efficiency: 0.88,
    forces: {
      gravity: (ELEVATOR_TARE_MASS + 250) * GRAVITY,
      thrust: t.mechanicalPowerWatts / Math.max(0.1, Math.abs(t.velocityX) + Math.abs(t.velocityZ)),
    },
  };
}
