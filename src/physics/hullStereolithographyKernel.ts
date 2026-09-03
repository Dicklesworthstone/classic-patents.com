/**
 * Source-bounded apparatus kernel for Charles W. Hull's US 4,575,330.
 *
 * The grant discloses the topology and sequence of the preferred apparatus,
 * plus a small set of source-card measurements. It does not disclose the
 * resin/material parameters needed to predict cure depth, conversion,
 * adhesion, recoating time, or build duration. This kernel therefore owns the
 * observable apparatus state and explicitly refuses those numerical results.
 */

export const HULL_FRANKENSIM_ELEVATOR_OWNER = "fs-mbd::JointModel::prismatic";
export const HULL_FRANKENSIM_OPTICAL_ATTENUATION_OWNER = "fs-render::volumes::beer_lambert";

export const HULL_PREFERRED_LAMP_POWER_W = 350;
export const HULL_FIBER_BUNDLE_DIAMETER_MM = 1;
export const HULL_FIBER_BUNDLE_LENGTH_M = 1;
export const HULL_SPOT_DIAMETER_UPPER_BOUND_MM = 1;
export const HULL_SURFACE_IRRADIANCE_APPROX_W_CM2 = 1;

export const HULL_SLA_SOURCE_BOUNDARY = `US 4,575,330 discloses a ${HULL_PREFERRED_LAMP_POWER_W} W mercury short-arc lamp, a ${HULL_FIBER_BUNDLE_DIAMETER_MM} mm UV-transmitting fiber bundle ${HULL_FIBER_BUNDLE_LENGTH_M} m long, an electronic shutter, a quartz lens, a spot somewhat under ${HULL_SPOT_DIAMETER_UPPER_BOUND_MM} mm, and about ${HULL_SURFACE_IRRADIANCE_APPROX_W_CM2} W/cm² long-wave UV intensity at the working surface. It does not print spectral radiant power at the resin, scan dwell or speed, absorption/extinction coefficients, critical exposure, reaction kinetics, layer thickness, viscosity, platform stroke or speed, part dimensions, or a build-time datum.`;

export interface HullStereolithographyControls {
  /** Reader-requested state of the source-described electronic shutter. */
  shutterRequestedOpen: number;
  /** Normalized plotter/carriage coordinate; the grant supplies no travel. */
  scanXFraction: number;
  /** Normalized plotter/carriage coordinate; the grant supplies no travel. */
  scanZFraction: number;
  /** 0 = next-layer working position; 1 = illustrative recoating over-travel. */
  recoatExcursionFraction: number;
  /** Illustrative lamina count, not the printed count of a source object. */
  displayLaminaCount: number;
}

export interface HullStereolithographyTelemetry {
  readonly controls: HullStereolithographyControls;
  readonly shutterRequestedOpen: boolean;
  readonly shutterOpen: boolean;
  readonly shutterInterlockActive: boolean;
  readonly exposureAtWorkingSurface: boolean;
  readonly spotXFraction: number;
  readonly spotZFraction: number;
  readonly platformDepthFraction: number;
  readonly visibleLaminaCount: number;
  readonly workingSurfaceHeld: true;
  readonly objectSupportedByPlatform: true;
  readonly laminaeRemainIntegrated: true;
  readonly apparatusState:
    | "working-position / shutter-open"
    | "working-position / shutter-closed"
    | "recoating-excursion / shutter-interlocked";
  readonly printedSourceCard: {
    readonly lampElectricalPowerW: 350;
    readonly fiberBundleDiameterMm: 1;
    readonly fiberBundleLengthM: 1;
    readonly spotDiameterUpperBoundMm: 1;
    readonly surfaceIrradianceApproxWcm2: 1;
  };
  readonly quantitativeCureAvailable: false;
  readonly quantitativeMotionAvailable: false;
  readonly sourceBoundary: string;
  readonly owners: {
    readonly elevator: typeof HULL_FRANKENSIM_ELEVATOR_OWNER;
    readonly opticalAttenuationCandidate: typeof HULL_FRANKENSIM_OPTICAL_ATTENUATION_OWNER;
  };
  readonly refusal: { readonly refused: true; readonly reason: string };
}

export const HULL_SLA_DEFAULT_CONTROLS: HullStereolithographyControls = {
  shutterRequestedOpen: 1,
  scanXFraction: 0,
  scanZFraction: 0,
  recoatExcursionFraction: 0,
  displayLaminaCount: 7,
};

function finiteOr(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function readHullStereolithographyControls(
  params?:
    | Partial<HullStereolithographyControls>
    | Record<string, number | boolean | string | undefined>,
): HullStereolithographyControls {
  return {
    shutterRequestedOpen:
      finiteOr(params?.shutterRequestedOpen, HULL_SLA_DEFAULT_CONTROLS.shutterRequestedOpen) >= 0.5
        ? 1
        : 0,
    scanXFraction: clamp(
      finiteOr(params?.scanXFraction, HULL_SLA_DEFAULT_CONTROLS.scanXFraction),
      -1,
      1,
    ),
    scanZFraction: clamp(
      finiteOr(params?.scanZFraction, HULL_SLA_DEFAULT_CONTROLS.scanZFraction),
      -1,
      1,
    ),
    recoatExcursionFraction: clamp(
      finiteOr(params?.recoatExcursionFraction, HULL_SLA_DEFAULT_CONTROLS.recoatExcursionFraction),
      0,
      1,
    ),
    displayLaminaCount: Math.round(
      clamp(
        finiteOr(params?.displayLaminaCount, HULL_SLA_DEFAULT_CONTROLS.displayLaminaCount),
        1,
        12,
      ),
    ),
  };
}

export function stepHullStereolithographyTopology(
  params:
    | Partial<HullStereolithographyControls>
    | Record<string, number | boolean | string | undefined> = HULL_SLA_DEFAULT_CONTROLS,
): HullStereolithographyTelemetry {
  const controls = readHullStereolithographyControls(params);
  const shutterRequestedOpen = controls.shutterRequestedOpen === 1;
  const atWorkingPosition = controls.recoatExcursionFraction <= 0.02;
  const shutterOpen = shutterRequestedOpen && atWorkingPosition;
  const shutterInterlockActive = shutterRequestedOpen && !atWorkingPosition;
  const refusalReason = `${HULL_SLA_SOURCE_BOUNDARY} ${HULL_FRANKENSIM_ELEVATOR_OWNER} can own a prismatic elevator only after its stroke, timing, and load card exists. ${HULL_FRANKENSIM_OPTICAL_ATTENUATION_OWNER} can own optical attenuation only after the resin extinction/absorption card exists and does not itself supply photopolymer cure kinetics. This exhibit therefore refuses cure depth, cured line width, conversion, adhesion strength, recoating time, build duration, and actuator force.`;

  return {
    controls,
    shutterRequestedOpen,
    shutterOpen,
    shutterInterlockActive,
    exposureAtWorkingSurface: shutterOpen,
    spotXFraction: controls.scanXFraction,
    spotZFraction: controls.scanZFraction,
    platformDepthFraction: controls.recoatExcursionFraction,
    visibleLaminaCount: controls.displayLaminaCount,
    workingSurfaceHeld: true,
    objectSupportedByPlatform: true,
    laminaeRemainIntegrated: true,
    apparatusState: shutterInterlockActive
      ? "recoating-excursion / shutter-interlocked"
      : shutterOpen
        ? "working-position / shutter-open"
        : "working-position / shutter-closed",
    printedSourceCard: {
      lampElectricalPowerW: HULL_PREFERRED_LAMP_POWER_W,
      fiberBundleDiameterMm: HULL_FIBER_BUNDLE_DIAMETER_MM,
      fiberBundleLengthM: HULL_FIBER_BUNDLE_LENGTH_M,
      spotDiameterUpperBoundMm: HULL_SPOT_DIAMETER_UPPER_BOUND_MM,
      surfaceIrradianceApproxWcm2: HULL_SURFACE_IRRADIANCE_APPROX_W_CM2,
    },
    quantitativeCureAvailable: false,
    quantitativeMotionAvailable: false,
    sourceBoundary: HULL_SLA_SOURCE_BOUNDARY,
    owners: {
      elevator: HULL_FRANKENSIM_ELEVATOR_OWNER,
      opticalAttenuationCandidate: HULL_FRANKENSIM_OPTICAL_ATTENUATION_OWNER,
    },
    refusal: { refused: true, reason: refusalReason },
  };
}

/**
 * Compatibility entry point retained for the shared engine registry. Despite
 * the historic name, it returns source topology plus SI source-card constants,
 * never a fabricated photopolymer solve.
 */
export function stepHullStereolithographySi(
  controls: HullStereolithographyControls,
): HullStereolithographyTelemetry {
  return stepHullStereolithographyTopology(controls);
}

export function stepHullStereolithography(
  params: Record<
    string,
    number | boolean | string
  > = HULL_SLA_DEFAULT_CONTROLS as unknown as Record<string, number | boolean | string>,
): HullStereolithographyTelemetry {
  return stepHullStereolithographyTopology(params);
}
