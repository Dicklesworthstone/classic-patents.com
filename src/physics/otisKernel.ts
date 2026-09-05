/**
 * Source-bounded topology kernel for Otis's US 31,128 hoisting apparatus.
 *
 * The grant supplies connected parts and discrete operating logic, but no
 * mass, speed, force, spring rate, stopping distance, engagement time, power,
 * or overall dimensions. This kernel therefore owns normalized coordinates,
 * one declared display-rate integration, and claim predicates only.
 */

export type OtisDriveCommand = -1 | 0 | 1;
export type OtisMechanismMode =
  | "raise"
  | "lower"
  | "service-stop"
  | "lower-limit-stop"
  | "rope-failure-hook-lock"
  | "claim-1-free-fall-counterfactual";

export const OTIS_LOWER_LIMIT_NORMALIZED = 0.03;
export const OTIS_DEFAULT_PLATFORM_POSITION = 0.55;
export const OTIS_DECLARED_MAX_DISPLAY_TRAVEL_PER_S = 0.12;

export interface OtisTopologyControls {
  platformPositionNormalized: number;
  drivePhaseRad: number;
  driveCommand: OtisDriveCommand;
  ropeGIntact: boolean;
  stopRopePulled: boolean;
  claim1HookLockEnabled: boolean;
  claim3BrakeInterlockEnabled: boolean;
  claim4CounterpoiseEnabled: boolean;
}

export interface OtisTopologyState {
  scalarJointCoordinates: 12;
  independentDriveDofs: 1;
  platformAxis: [0, 1, 0];
  safetyBarAxis: [0, 1, 0];
  safetyLeverAxis: [0, 0, 1];
  windingDrumAxis: [0, 0, 1];
  shipperAxis: [1, 0, 0];
  brakeAxis: [0, 0, 1];
  counterpoiseAxis: [0, 1, 0];
  platformPositionNormalized: number;
  counterpoisePositionNormalized: number;
  drivePhaseRad: number;
  requestedDriveDirection: OtisDriveCommand;
  platformMotionDirection: OtisDriveCommand;
  shipperPositionNormalized: -1 | 0 | 1;
  straightBeltOWorking: boolean;
  crossBeltPWorking: boolean;
  bothBeltsIdle: boolean;
  brakeZEngaged: boolean;
  stopRopeGeometryActive: boolean;
  lowerLimitStopActive: boolean;
  ropeGTaut: boolean;
  safetyBarReleaseNormalized: 0 | 1;
  safetyLeverRotationNormalized: 0 | 1;
  pawlsFEngaged: boolean;
  claim1HookLockSatisfied: boolean;
  freeFallCounterfactual: boolean;
  claim3StopInterlockSatisfied: boolean;
  claim4CounterpoiseTopologySatisfied: boolean;
  mechanismMode: OtisMechanismMode;
  displayRateSlopePerPct?: number;
}

function isDriveCommand(value: number): value is OtisDriveCommand {
  return value === -1 || value === 0 || value === 1;
}

export function readOtisTopologyControls(
  params: Record<string, any>,
  overrides: Partial<OtisTopologyControls> = {},
): OtisTopologyControls {
  const rawCommand =
    overrides.driveCommand ?? params.driveCommand ?? params.command ?? params.direction ?? 0;
  const ropePct =
    params.ropeGIntegrityPct ??
    params.ropeIntegrity ??
    params.ropeGIntegrity ??
    params.ropeIntegrityPct ??
    100;
  const stopPulled = params.stopRopePulled ?? params.stopRope ?? params.shipperStop ?? 0;
  return {
    platformPositionNormalized:
      overrides.platformPositionNormalized ??
      (params.platformPositionPct ?? OTIS_DEFAULT_PLATFORM_POSITION * 100) / 100,
    drivePhaseRad: overrides.drivePhaseRad ?? 0,
    driveCommand: isDriveCommand(rawCommand) ? rawCommand : 0,
    ropeGIntact: overrides.ropeGIntact ?? ropePct >= 15,
    stopRopePulled: overrides.stopRopePulled ?? (stopPulled === 1 || stopPulled === true),
    claim1HookLockEnabled:
      overrides.claim1HookLockEnabled ??
      (params.claim1HookLockEnabled !== undefined
        ? Boolean(params.claim1HookLockEnabled)
        : params.claim1Active !== undefined
          ? Boolean(params.claim1Active)
          : true),
    claim3BrakeInterlockEnabled:
      overrides.claim3BrakeInterlockEnabled ??
      (params.claim3BrakeInterlockEnabled !== undefined
        ? Boolean(params.claim3BrakeInterlockEnabled)
        : params.claim3Active !== undefined
          ? Boolean(params.claim3Active)
          : true),
    claim4CounterpoiseEnabled:
      overrides.claim4CounterpoiseEnabled ??
      (params.claim4CounterpoiseEnabled !== undefined
        ? Boolean(params.claim4CounterpoiseEnabled)
        : params.claim4Active !== undefined
          ? Boolean(params.claim4Active)
          : true),
  };
}

export function stepOtis1861Topology(controls: OtisTopologyControls): OtisTopologyState {
  const {
    platformPositionNormalized,
    drivePhaseRad,
    driveCommand,
    ropeGIntact,
    stopRopePulled,
    claim1HookLockEnabled,
    claim3BrakeInterlockEnabled,
    claim4CounterpoiseEnabled,
  } = controls;
  if (
    !Number.isFinite(platformPositionNormalized) ||
    platformPositionNormalized < 0 ||
    platformPositionNormalized > 1 ||
    !Number.isFinite(drivePhaseRad) ||
    !isDriveCommand(driveCommand)
  ) {
    throw new RangeError("Otis topology controls are outside their declared normalized domains");
  }

  const lowerLimitStopActive =
    driveCommand < 0 && platformPositionNormalized <= OTIS_LOWER_LIMIT_NORMALIZED;
  const stopRequested = stopRopePulled || driveCommand === 0 || lowerLimitStopActive;
  const straightBeltOWorking = driveCommand > 0 && !stopRequested;
  const crossBeltPWorking = driveCommand < 0 && !stopRequested;
  const bothBeltsIdle = stopRequested;
  const brakeZEngaged = stopRequested && claim3BrakeInterlockEnabled;
  const shipperPositionNormalized = straightBeltOWorking ? -1 : crossBeltPWorking ? 1 : 0;

  const ropeFailed = !ropeGIntact;
  const pawlsFEngaged = ropeFailed && claim1HookLockEnabled;
  const freeFallCounterfactual = ropeFailed && !claim1HookLockEnabled;
  const platformMotionDirection: OtisDriveCommand = ropeFailed
    ? freeFallCounterfactual
      ? -1
      : 0
    : stopRequested
      ? 0
      : driveCommand;
  const mechanismMode: OtisMechanismMode = pawlsFEngaged
    ? "rope-failure-hook-lock"
    : freeFallCounterfactual
      ? "claim-1-free-fall-counterfactual"
      : lowerLimitStopActive
        ? "lower-limit-stop"
        : stopRequested
          ? "service-stop"
          : platformMotionDirection > 0
            ? "raise"
            : "lower";

  return {
    scalarJointCoordinates: 12,
    independentDriveDofs: 1,
    platformAxis: [0, 1, 0],
    safetyBarAxis: [0, 1, 0],
    safetyLeverAxis: [0, 0, 1],
    windingDrumAxis: [0, 0, 1],
    shipperAxis: [1, 0, 0],
    brakeAxis: [0, 0, 1],
    counterpoiseAxis: [0, 1, 0],
    platformPositionNormalized,
    counterpoisePositionNormalized: claim4CounterpoiseEnabled
      ? 1 - platformPositionNormalized
      : platformPositionNormalized,
    drivePhaseRad: ((drivePhaseRad % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI),
    requestedDriveDirection: driveCommand,
    platformMotionDirection,
    shipperPositionNormalized,
    straightBeltOWorking,
    crossBeltPWorking,
    bothBeltsIdle,
    brakeZEngaged,
    stopRopeGeometryActive: stopRequested,
    lowerLimitStopActive,
    ropeGTaut: ropeGIntact,
    safetyBarReleaseNormalized: ropeFailed ? 1 : 0,
    safetyLeverRotationNormalized: pawlsFEngaged ? 1 : 0,
    pawlsFEngaged,
    claim1HookLockSatisfied: pawlsFEngaged,
    freeFallCounterfactual,
    claim3StopInterlockSatisfied: !stopRequested || (bothBeltsIdle && brakeZEngaged),
    claim4CounterpoiseTopologySatisfied: claim4CounterpoiseEnabled,
    mechanismMode,
    displayRateSlopePerPct: OTIS_DECLARED_MAX_DISPLAY_TRAVEL_PER_S / 100,
  };
}

/** Integrate only the declared normalized studio coordinate; no historical speed is implied. */
export function advanceOtisPlatformPosition(
  position: number,
  direction: OtisDriveCommand,
  displayRatePct: number,
  dtSeconds: number,
): number {
  if (
    !Number.isFinite(position) ||
    !Number.isFinite(displayRatePct) ||
    !Number.isFinite(dtSeconds) ||
    position < 0 ||
    position > 1 ||
    displayRatePct < 0 ||
    displayRatePct > 100 ||
    dtSeconds < 0
  ) {
    throw new RangeError("Otis display integration inputs are outside their declared domains");
  }
  return Math.min(
    1,
    Math.max(
      0,
      position +
        direction * OTIS_DECLARED_MAX_DISPLAY_TRAVEL_PER_S * (displayRatePct / 100) * dtSeconds,
    ),
  );
}
