/**
 * US 2,846,084 — Electronic Master Slave Manipulator.
 *
 * This is a source-bounded topology kernel, not an invented SI arm model.
 * The grant names seven corresponding movements, an error signal proportional
 * to position difference, a relative-speed tachometer path, and a limiter.
 * It does not publish arm dimensions, inertia, payload, gear ratios, motor
 * constants, force calibration, contact stiffness, gain, or bandwidth.
 */

export interface GoertzMasterSlaveControls {
  horizontalArmPivot: number;
  horizontalArmRoll: number;
  verticalArmPivot: number;
  verticalArmRoll: number;
  toolAxis171: number;
  toolAxis172: number;
  gripperClosure: number;
  contactResistance: number;
  forceReflectionEnabled: number;
  tachometerDampingEnabled: number;
  limiterEnabled: number;
}

export const GOERTZ_MASTER_SLAVE_DEFAULT_CONTROLS: GoertzMasterSlaveControls = {
  horizontalArmPivot: 0.18,
  horizontalArmRoll: -0.12,
  verticalArmPivot: 0.22,
  verticalArmRoll: 0.08,
  toolAxis171: -0.15,
  toolAxis172: 0.11,
  gripperClosure: 0.3,
  contactResistance: 0.45,
  forceReflectionEnabled: 1,
  tachometerDampingEnabled: 1,
  limiterEnabled: 1,
};

export type GoertzMotionChannel =
  | "horizontal-arm pivot about axis 113b"
  | "horizontal-arm roll"
  | "vertical-arm pivot about axis 126"
  | "vertical-arm roll"
  | "tool pivot about axis 171"
  | "tool pivot about axis 172"
  | "tool opening/closing";

export const GOERTZ_MOTION_CHANNELS: readonly GoertzMotionChannel[] = [
  "horizontal-arm pivot about axis 113b",
  "horizontal-arm roll",
  "vertical-arm pivot about axis 126",
  "vertical-arm roll",
  "tool pivot about axis 171",
  "tool pivot about axis 172",
  "tool opening/closing",
];

export interface GoertzMasterSlavePose {
  readonly masterChannels: readonly number[];
  readonly slaveChannels: readonly number[];
  readonly positionErrors: readonly number[];
  readonly errorMagnitude: number;
  readonly reflectedResistance: number;
  readonly limiterActive: boolean;
  readonly forceReflectionEnabled: boolean;
  readonly tachometerDampingEnabled: boolean;
  readonly activeClaim: 1 | 9 | 10 | 11 | 12 | 13;
  readonly state:
    | "correspondence"
    | "remote contact without reflection"
    | "force-reflecting remote contact"
    | "limited error response";
  readonly positionLaw: string;
  readonly refusal: { refused: true; reason: string };
}

function bounded(value: number | undefined, fallback: number, min = -1, max = 1): number {
  const candidate = typeof value === "number" && Number.isFinite(value) ? value : fallback;
  return Math.min(max, Math.max(min, candidate));
}

function binary(value: number | undefined, fallback: number): number {
  return bounded(value, fallback, 0, 1) >= 0.5 ? 1 : 0;
}

export function readGoertzMasterSlaveControls(
  params: Partial<GoertzMasterSlaveControls> | Record<string, number | undefined>,
): GoertzMasterSlaveControls {
  return {
    horizontalArmPivot: bounded(
      params.horizontalArmPivot,
      GOERTZ_MASTER_SLAVE_DEFAULT_CONTROLS.horizontalArmPivot,
    ),
    horizontalArmRoll: bounded(
      params.horizontalArmRoll,
      GOERTZ_MASTER_SLAVE_DEFAULT_CONTROLS.horizontalArmRoll,
    ),
    verticalArmPivot: bounded(
      params.verticalArmPivot,
      GOERTZ_MASTER_SLAVE_DEFAULT_CONTROLS.verticalArmPivot,
    ),
    verticalArmRoll: bounded(
      params.verticalArmRoll,
      GOERTZ_MASTER_SLAVE_DEFAULT_CONTROLS.verticalArmRoll,
    ),
    toolAxis171: bounded(params.toolAxis171, GOERTZ_MASTER_SLAVE_DEFAULT_CONTROLS.toolAxis171),
    toolAxis172: bounded(params.toolAxis172, GOERTZ_MASTER_SLAVE_DEFAULT_CONTROLS.toolAxis172),
    gripperClosure: bounded(
      params.gripperClosure,
      GOERTZ_MASTER_SLAVE_DEFAULT_CONTROLS.gripperClosure,
      0,
      1,
    ),
    contactResistance: bounded(
      params.contactResistance,
      GOERTZ_MASTER_SLAVE_DEFAULT_CONTROLS.contactResistance,
      0,
      1,
    ),
    forceReflectionEnabled: binary(
      params.forceReflectionEnabled,
      GOERTZ_MASTER_SLAVE_DEFAULT_CONTROLS.forceReflectionEnabled,
    ),
    tachometerDampingEnabled: binary(
      params.tachometerDampingEnabled,
      GOERTZ_MASTER_SLAVE_DEFAULT_CONTROLS.tachometerDampingEnabled,
    ),
    limiterEnabled: binary(
      params.limiterEnabled,
      GOERTZ_MASTER_SLAVE_DEFAULT_CONTROLS.limiterEnabled,
    ),
  };
}

/**
 * Maps the source-described seven correspondence channels to normalized state.
 * `contactResistance` is an illustrative scenario selector, not a material
 * measurement; it makes an obstruction visible by withholding part of the
 * commanded slave displacement. The feedback expressions are deliberately
 * dimensionless because the source does not provide the quantities needed for
 * SI dynamics.
 */
export function stepGoertzMasterSlaveTopology(
  params: Partial<GoertzMasterSlaveControls> | Record<string, number | undefined>,
): GoertzMasterSlavePose {
  const controls = readGoertzMasterSlaveControls(params);
  const masterChannels = [
    controls.horizontalArmPivot,
    controls.horizontalArmRoll,
    controls.verticalArmPivot,
    controls.verticalArmRoll,
    controls.toolAxis171,
    controls.toolAxis172,
    controls.gripperClosure,
  ] as const;
  const neutral = [0, 0, 0, 0, 0, 0, 0] as const;
  const dampingFactor = controls.tachometerDampingEnabled === 1 ? 0.68 : 1;
  const contactFraction = controls.contactResistance * dampingFactor;
  const rawErrors = masterChannels.map((value, index) => {
    const mismatch = (value - (neutral[index] ?? 0)) * contactFraction;
    return mismatch === 0 ? 0 : mismatch;
  });
  const rawMagnitude = Math.max(...rawErrors.map((value) => Math.abs(value)));
  // Claim 10/12’s limiting function is represented only as normalized command
  // clipping. It is not a source claim about a particular speed or voltage.
  const commandLimit = 0.55;
  const limiterActive = controls.limiterEnabled === 1 && rawMagnitude > commandLimit;
  const positionErrors = rawErrors.map((value) =>
    limiterActive ? Math.sign(value) * Math.min(Math.abs(value), commandLimit) : value,
  );
  const slaveChannels = masterChannels.map((value, index) => value - (positionErrors[index] ?? 0));
  const errorMagnitude = Math.max(...positionErrors.map((value) => Math.abs(value)));
  const forceReflectionEnabled = controls.forceReflectionEnabled === 1;
  const reflectedResistance = forceReflectionEnabled ? errorMagnitude : 0;
  const state: GoertzMasterSlavePose["state"] = limiterActive
    ? "limited error response"
    : controls.contactResistance === 0
      ? "correspondence"
      : forceReflectionEnabled
        ? "force-reflecting remote contact"
        : "remote contact without reflection";
  const activeClaim: GoertzMasterSlavePose["activeClaim"] = limiterActive
    ? controls.tachometerDampingEnabled === 1
      ? 12
      : 10
    : controls.tachometerDampingEnabled === 1
      ? 11
      : forceReflectionEnabled
        ? 9
        : 13;

  return {
    masterChannels,
    slaveChannels,
    positionErrors,
    errorMagnitude,
    reflectedResistance,
    limiterActive,
    forceReflectionEnabled,
    tachometerDampingEnabled: controls.tachometerDampingEnabled === 1,
    activeClaim,
    state,
    positionLaw:
      "normalized slave channel = master channel − source-shaped positional mismatch; E ∝ (master − slave)",
    refusal: {
      refused: true,
      reason:
        "US 2,846,084 states position correspondence, force reflection, relative-speed feedback, and limiting topology, but not arm dimensions, mass, inertia, transmission ratios, motor constants, control gains, payload, contact stiffness, force calibration, or bandwidth. This shared kernel therefore reports deterministic normalized channel correspondence only and refuses SI force, speed, or performance prediction.",
    },
  };
}
