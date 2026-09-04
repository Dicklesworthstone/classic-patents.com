/**
 * Source-bounded apparatus and wavelength kernel for Spencer's US 2,495,429.
 *
 * The grant closes a real causal path and prints a wavelength region, but it
 * does not provide the dimensions or operating card needed for a magnetron,
 * waveguide, field-strength, or cooking-performance solve. This kernel keeps
 * those two facts separate: source topology and the universal c = lambda f
 * relation are admitted; undisclosed quantitative performance is refused.
 */

export const SPENCER_MICROWAVE_PATENT_ID = "us-2495429-spencer-microwave";

export const SPENCER_SOURCE_WAVELENGTH_REFERENCE_M = 0.1;
export const SPENCER_SOURCE_MAINS_EXAMPLE_HZ = 60;
export const VACUUM_SPEED_OF_LIGHT_MPS = 299_792_458;
export const SPENCER_TEN_CM_VACUUM_FREQUENCY_HZ =
  VACUUM_SPEED_OF_LIGHT_MPS / SPENCER_SOURCE_WAVELENGTH_REFERENCE_M;

/** Deliberately slowed scene rate. It is not the source's 60-cycle supply. */
export const SPENCER_NORMALIZED_DISPLAY_PHASE_RATE_RAD_PER_S = 1.8;
/** Scene units per second, never metres per second. */
export const SPENCER_NORMALIZED_CONVEYOR_SPEED = 0.55;

export const SPENCER_SOURCE_PATH =
  "power lines 19 → transformer 18 → oscillators 10/11 → coaxial lines 24/25 and loops 26/27 → common wave guide 23 → conveyor 28";

export const SPENCER_FRANKENSIM_BOUNDARY =
  "The shipped generic FrankenSim browser surface has no parameterized electromagnetic waveguide or magnetron solver. fs-flux's quarter-wave transmission-line relation is not a substitute for this cavity-and-guide apparatus, and the grant does not provide the tube voltage, magnetic field, cavity dimensions, guide section, material-loss data, food mass, or exposure-time card needed to compose a valid quantitative solve.";

export const SPENCER_SOURCE_BOUNDARY = `US 2,495,429 supplies two push-pull magnetron oscillators (10 and 11), transformer 18 on an example 60-cycle supply, coaxial lines 24/25, loops 26/27, common hollow wave guide 23, transverse conveyor 28, and wavelengths of the order of ten centimetres or less. ${SPENCER_FRANKENSIM_BOUNDARY}`;

export interface SpencerMicrowaveControls {
  /** Binary reader control: highlights the printed path; it is not RF watts. */
  rfPowerSetting: 0 | 1;
}

export interface SpencerMicrowaveState {
  readonly controls: SpencerMicrowaveControls;
  readonly energyPathActive: boolean;
  readonly sourcePathContinuous: true;
  readonly sourcePath: string;
  readonly sourceNumerals: {
    readonly oscillators: readonly [10, 11];
    readonly transformer: 18;
    readonly supply: 19;
    readonly waveGuide: 23;
    readonly coaxialLines: readonly [24, 25];
    readonly couplingLoops: readonly [26, 27];
    readonly conveyor: 28;
  };
  readonly sourceWavelengthReferenceM: number;
  readonly sourceMainsExampleHz: number;
  readonly vacuumFrequencyAtTenCentimetersHz: number;
  readonly derivedRelation: "c = lambda f";
  readonly normalizedDisplayPhaseRateRadPerS: number;
  readonly normalizedConveyorSpeed: number;
  readonly quantitativeTubeModelAvailable: false;
  readonly quantitativeCookingModelAvailable: false;
  readonly kernelSource: "source-bounded-ts";
  readonly sourceBoundary: string;
  readonly refusal: { readonly refused: true; readonly reason: string };
}

function finiteOr(value: number | undefined, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function readSpencerMicrowaveControls(
  params: Partial<SpencerMicrowaveControls> | Record<string, number | undefined>,
): SpencerMicrowaveControls {
  return {
    rfPowerSetting: finiteOr(params.rfPowerSetting, 1) >= 0.5 ? 1 : 0,
  };
}

export function stepSpencerMicrowaveSource(
  params: Partial<SpencerMicrowaveControls> | Record<string, number | undefined>,
): SpencerMicrowaveState {
  const controls = readSpencerMicrowaveControls(params);
  return {
    controls,
    energyPathActive: controls.rfPowerSetting === 1,
    sourcePathContinuous: true,
    sourcePath: SPENCER_SOURCE_PATH,
    sourceNumerals: {
      oscillators: [10, 11],
      transformer: 18,
      supply: 19,
      waveGuide: 23,
      coaxialLines: [24, 25],
      couplingLoops: [26, 27],
      conveyor: 28,
    },
    sourceWavelengthReferenceM: SPENCER_SOURCE_WAVELENGTH_REFERENCE_M,
    sourceMainsExampleHz: SPENCER_SOURCE_MAINS_EXAMPLE_HZ,
    vacuumFrequencyAtTenCentimetersHz: SPENCER_TEN_CM_VACUUM_FREQUENCY_HZ,
    derivedRelation: "c = lambda f",
    normalizedDisplayPhaseRateRadPerS: SPENCER_NORMALIZED_DISPLAY_PHASE_RATE_RAD_PER_S,
    normalizedConveyorSpeed: SPENCER_NORMALIZED_CONVEYOR_SPEED,
    quantitativeTubeModelAvailable: false,
    quantitativeCookingModelAvailable: false,
    kernelSource: "source-bounded-ts",
    sourceBoundary: SPENCER_SOURCE_BOUNDARY,
    refusal: {
      refused: true,
      reason: `${SPENCER_SOURCE_BOUNDARY} This exhibit therefore refuses voltage, magnetic flux density, RF watts, electric-field magnitude, Hull cutoff, dielectric-loss density, temperature rise, cooking time, and efficiency. The animated alternation, field envelope, and conveyor speed are normalized explanatory coordinates only.`,
    },
  };
}
