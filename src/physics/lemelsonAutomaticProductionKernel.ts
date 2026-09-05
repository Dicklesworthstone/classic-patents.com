/**
 * US 3,313,014 — Automatic Production Apparatus and Method.
 *
 * The grant identifies carrier travel, lift, platform reach, rotation, marker
 * sensing, retention, control coupling, and release sequencing. It gives no
 * dimensions, payload, mass, motor rating, speed, acceleration, force, tool
 * process, controller interval, or positional tolerance. This kernel therefore
 * owns the source-described *topology* and ordered interlock only. It must not
 * be read as a dimensional throughput or machine-dynamics model.
 *
 * A future browser boundary may compose fs-time + fs-mbd for the named guided
 * joints only after a source-backed geometry and inertial parameter packet is
 * available. Until then, the registry identifies this truthful TypeScript
 * source-bounded topology step rather than implying that WASM has stepped it.
 */

export interface LemelsonAutomaticProductionControls {
  /** Normalized guideway pose: no source rail length or speed is printed. */
  carrierAddressFraction: number;
  /** Normalized vertical column pose: no source lift stroke is printed. */
  liftFraction: number;
  /** Normalized platform reach: no source rack stroke is printed. */
  reachFraction: number;
  /** Claim-linked station marker / sensing event. */
  stationDetected: number;
  /** Claim-linked portable-controller to station-control coupling. */
  stationCoupled: number;
  /** Normalized position inside the ordered locate→operate→release cycle. */
  cycleProgress: number;
}

export const LEMELSON_AUTOMATIC_PRODUCTION_DEFAULT_CONTROLS: LemelsonAutomaticProductionControls = {
  carrierAddressFraction: 0.58,
  liftFraction: 0.44,
  reachFraction: 0.66,
  stationDetected: 1,
  stationCoupled: 1,
  cycleProgress: 0.56,
};

export type LemelsonAutomaticProductionPhase =
  | "travel"
  | "marker recognized"
  | "retained and positioning"
  | "awaiting station coupling"
  | "coupled station operation"
  | "release and depart";

export interface LemelsonAutomaticProductionState extends LemelsonAutomaticProductionControls {
  /** Display-only arrangement vector: not metre coordinates. */
  normalizedPose: readonly [number, number, number, number];
  markerMatched: boolean;
  carrierLocked: boolean;
  controllerCoupled: boolean;
  machineCommandAuthorized: boolean;
  releaseAuthorized: boolean;
  phase: LemelsonAutomaticProductionPhase;
  /** Claim 7's portable controller must couple before station operation. */
  activeClaimProbe: "Claim 1 record activation" | "Claim 7 station coupling" | "Claim 20 release";
  commandChain: string;
  sourceBoundary: {
    isRefused: true;
    reason: string;
  };
}

function unit(value: number | undefined, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.min(1, Math.max(0, value))
    : fallback;
}

export function readLemelsonAutomaticProductionControls(
  raw: Partial<LemelsonAutomaticProductionControls> | Record<string, number | undefined>,
): LemelsonAutomaticProductionControls {
  const p = raw as Record<string, number | undefined>;
  return {
    carrierAddressFraction: unit(
      p.carrierAddressFraction ?? p.carrierAddress ?? p.carrierX ?? p.addressFraction ?? p.address,
      LEMELSON_AUTOMATIC_PRODUCTION_DEFAULT_CONTROLS.carrierAddressFraction,
    ),
    liftFraction: unit(
      p.liftFraction ?? p.lift ?? p.verticalLift ?? p.liftPose ?? p.mzLift,
      LEMELSON_AUTOMATIC_PRODUCTION_DEFAULT_CONTROLS.liftFraction,
    ),
    reachFraction: unit(
      p.reachFraction ?? p.reach ?? p.platformReach ?? p.myReach ?? p.extension,
      LEMELSON_AUTOMATIC_PRODUCTION_DEFAULT_CONTROLS.reachFraction,
    ),
    stationDetected: unit(
      p.stationDetected ?? p.marker ?? p.markerDetected ?? p.markerSensed ?? p.stationSensed,
      LEMELSON_AUTOMATIC_PRODUCTION_DEFAULT_CONTROLS.stationDetected,
    ),
    stationCoupled: unit(
      p.stationCoupled ?? p.coupled ?? p.contactsCoupled ?? p.stationContact ?? p.claim7,
      LEMELSON_AUTOMATIC_PRODUCTION_DEFAULT_CONTROLS.stationCoupled,
    ),
    cycleProgress: unit(
      p.cycleProgress ?? p.progress ?? p.cycle ?? p.sequenceProgress ?? p.cycleFraction,
      LEMELSON_AUTOMATIC_PRODUCTION_DEFAULT_CONTROLS.cycleProgress,
    ),
  };
}

/**
 * One source-bounded step shared by the 2D face, 3D model, telemetry badge,
 * claim weave, and colorized interlock. It deliberately returns no force,
 * speed, power, time, tolerance, payload, or dimensional position field.
 */
export function stepLemelsonAutomaticProductionTopology(
  raw: Partial<LemelsonAutomaticProductionControls> | Record<string, number | undefined>,
): LemelsonAutomaticProductionState {
  const controls = readLemelsonAutomaticProductionControls(raw);
  const markerMatched = controls.stationDetected >= 0.5;
  const afterLocate = controls.cycleProgress >= 0.2;
  const beforeRelease = controls.cycleProgress < 0.8;
  const carrierLocked = markerMatched && afterLocate && beforeRelease;
  const controllerCoupled = carrierLocked && controls.stationCoupled >= 0.5;
  const machineCommandAuthorized = controllerCoupled && controls.cycleProgress >= 0.5;
  const releaseAuthorized = markerMatched && controls.cycleProgress >= 0.8;

  const phase: LemelsonAutomaticProductionPhase = !markerMatched
    ? "travel"
    : releaseAuthorized
      ? "release and depart"
      : controls.cycleProgress < 0.2
        ? "marker recognized"
        : controls.cycleProgress < 0.5
          ? "retained and positioning"
          : !controllerCoupled
            ? "awaiting station coupling"
            : controls.cycleProgress < 0.8
              ? "coupled station operation"
              : "retained and positioning";

  const activeClaimProbe: LemelsonAutomaticProductionState["activeClaimProbe"] = releaseAuthorized
    ? "Claim 20 release"
    : controllerCoupled
      ? "Claim 7 station coupling"
      : "Claim 1 record activation";

  return {
    ...controls,
    normalizedPose: [
      controls.carrierAddressFraction,
      controls.liftFraction,
      controls.reachFraction,
      controls.cycleProgress,
    ],
    markerMatched,
    carrierLocked,
    controllerCoupled,
    machineCommandAuthorized,
    releaseAuthorized,
    phase,
    activeClaimProbe,
    commandChain: "marker → retain → position → couple → operate → release → travel",
    sourceBoundary: {
      isRefused: true,
      reason:
        "US 3,313,014 identifies guided carrier motion, marker sensing, program control, retention, coupling, and release but prints no dimensions, payload, motor rating, speed, acceleration, force, timing, position tolerance, or machine process model. This exhibit reports normalized topology and interlock states only.",
    },
  };
}
