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
  readonly forceReflectionEnabled: boolean;
  readonly tachometerDampingEnabled: boolean;
  readonly limiterEnabled: boolean;
  readonly mismatchChannel: GoertzMotionChannel | null;
  readonly activeClaim: 1 | 9 | 10 | 11 | 12;
  readonly state:
    | "correspondence"
    | "remote gripper obstruction without reflection"
    | "force-reflecting remote gripper obstruction";
  readonly positionLaw: string;
  readonly quantitativeDynamicsAvailable: false;
  readonly refusal: { refused: true; reason: string };
}

export const GOERTZ_MASTER_SLAVE_SOURCE_BOUNDARY =
  "US 2,846,084 specifies seven corresponding motions, a position-error signal whose amplitude is proportional to positional difference and whose phase gives direction, force on both corresponding members, an opposing relative-speed tachometer path, and an abnormal-condition limiter. It does not publish arm dimensions, mass, inertia, transmission ratios, motor constants, control gains, limiter threshold, payload, contact stiffness, force calibration, motion history, or bandwidth.";

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
  const p = params as Record<string, number | undefined>;
  return {
    horizontalArmPivot: bounded(
      p.horizontalArmPivot ?? p.hPivot ?? p.armPivot ?? p.horizontalPivot ?? p.axis113b,
      GOERTZ_MASTER_SLAVE_DEFAULT_CONTROLS.horizontalArmPivot,
    ),
    horizontalArmRoll: bounded(
      p.horizontalArmRoll ?? p.hRoll ?? p.armRoll ?? p.horizontalRoll,
      GOERTZ_MASTER_SLAVE_DEFAULT_CONTROLS.horizontalArmRoll,
    ),
    verticalArmPivot: bounded(
      p.verticalArmPivot ?? p.vPivot ?? p.vertPivot ?? p.verticalPivot ?? p.axis126,
      GOERTZ_MASTER_SLAVE_DEFAULT_CONTROLS.verticalArmPivot,
    ),
    verticalArmRoll: bounded(
      p.verticalArmRoll ?? p.vRoll ?? p.vertRoll ?? p.verticalRoll,
      GOERTZ_MASTER_SLAVE_DEFAULT_CONTROLS.verticalArmRoll,
    ),
    toolAxis171: bounded(
      p.toolAxis171 ?? p.axis171 ?? p.toolPivot171 ?? p.wrist171 ?? p.pitch171,
      GOERTZ_MASTER_SLAVE_DEFAULT_CONTROLS.toolAxis171,
    ),
    toolAxis172: bounded(
      p.toolAxis172 ?? p.axis172 ?? p.toolPivot172 ?? p.wrist172 ?? p.yaw172,
      GOERTZ_MASTER_SLAVE_DEFAULT_CONTROLS.toolAxis172,
    ),
    gripperClosure: bounded(
      p.gripperClosure ?? p.gripper ?? p.closure ?? p.grip ?? p.jawClosure ?? p.toolClosure,
      GOERTZ_MASTER_SLAVE_DEFAULT_CONTROLS.gripperClosure,
      0,
      1,
    ),
    contactResistance: bounded(
      p.contactResistance ?? p.contact ?? p.resistance ?? p.obstruction ?? p.gripperObstruction,
      GOERTZ_MASTER_SLAVE_DEFAULT_CONTROLS.contactResistance,
      0,
      1,
    ),
    forceReflectionEnabled: binary(
      p.forceReflectionEnabled ?? p.forceReflection ?? p.reflection ?? p.forceFeedback ?? p.claim9,
      GOERTZ_MASTER_SLAVE_DEFAULT_CONTROLS.forceReflectionEnabled,
    ),
    tachometerDampingEnabled: binary(
      p.tachometerDampingEnabled ??
        p.tachometerDamping ??
        p.tachometer ??
        p.damping ??
        p.rateFeedback ??
        p.claim11,
      GOERTZ_MASTER_SLAVE_DEFAULT_CONTROLS.tachometerDampingEnabled,
    ),
    limiterEnabled: binary(
      p.limiterEnabled ?? p.limiter ?? p.saturationLimiter ?? p.claim10 ?? p.claim12,
      GOERTZ_MASTER_SLAVE_DEFAULT_CONTROLS.limiterEnabled,
    ),
  };
}

/**
 * Maps the source-described seven correspondence channels to normalized state.
 * `contactResistance` is an illustrative scenario selector, not a material
 * measurement. It withholds only part of the slave gripper's commanded closure,
 * matching the source's fragile-beaker explanation while leaving the other six
 * channels in correspondence. The tachometer and limiter flags disclose their
 * source-described control paths but cannot alter this static pose: doing so
 * would require motion history and a limiter threshold that the grant does not
 * supply.
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
  const gripperMismatch = controls.gripperClosure * controls.contactResistance;
  const positionErrors = [0, 0, 0, 0, 0, 0, gripperMismatch] as const;
  const slaveChannels = masterChannels.map((value, index) => value - (positionErrors[index] ?? 0));
  const errorMagnitude = Math.max(...positionErrors.map((value) => Math.abs(value)));
  const forceReflectionEnabled = controls.forceReflectionEnabled === 1;
  const reflectedResistance = forceReflectionEnabled ? errorMagnitude : 0;
  const contactActive = gripperMismatch > 0;
  const state: GoertzMasterSlavePose["state"] = !contactActive
    ? "correspondence"
    : forceReflectionEnabled
      ? "force-reflecting remote gripper obstruction"
      : "remote gripper obstruction without reflection";
  const tachometerDampingEnabled = controls.tachometerDampingEnabled === 1;
  const limiterEnabled = controls.limiterEnabled === 1;
  const activeClaim: GoertzMasterSlavePose["activeClaim"] = !forceReflectionEnabled
    ? 1
    : limiterEnabled && tachometerDampingEnabled
      ? 12
      : limiterEnabled
        ? 10
        : tachometerDampingEnabled
          ? 11
          : 9;

  return {
    masterChannels,
    slaveChannels,
    positionErrors,
    errorMagnitude,
    reflectedResistance,
    forceReflectionEnabled,
    tachometerDampingEnabled,
    limiterEnabled,
    mismatchChannel: contactActive ? "tool opening/closing" : null,
    activeClaim,
    state,
    positionLaw:
      "E ∝ q_m − q_s, with phase indicating correction direction; the static exhibit withholds only illustrative slave-gripper closure",
    quantitativeDynamicsAvailable: false,
    refusal: {
      refused: true,
      reason: `${GOERTZ_MASTER_SLAVE_SOURCE_BOUNDARY} This shared kernel therefore reports deterministic normalized channel correspondence only; it refuses SI force, speed, transient, stability, or performance prediction and does not numerically step the tachometer or limiter paths.`,
    },
  };
}
