/**
 * Source-bounded topology and geometry kernel for Schawlow and Townes's
 * US 2,929,922, "Masers and Maser Communications System."
 *
 * The grant supplies a complete communications topology and several concrete
 * generator dimensions/material properties. It does not supply optical-pump
 * power, transition wavelength, cross-section, gain coefficient, cavity loss,
 * detector calibration, field strength, or time history. This kernel therefore
 * computes only source-supported geometry and exact dimensionless bookkeeping;
 * excitation, aperture, and modulation controls are normalized teaching inputs.
 */

export const TOWNES_MASER_SOURCE_BOUNDARY =
  "US 2,929,922 prints generator 10, modulated amplifier 12, detector 13, a roughly 10 cm by 1 cm chamber 14, potassium vapor near 435 K and 0.001 mm Hg, sapphire end assemblies with an approximately 500 Å gold coating, a stated 97% reflection / 2% absorption / 1% transmission example, potassium pumping lamps, focal-plane aperture mode selection, and longitudinal-field modulation. It does not print pump watts, transition wavelength, gain cross-section, excited-state lifetime, internal loss, lens focal lengths, aperture diameter, magnetic-field strength, detector responsivity, or transient initial conditions.";

export interface TownesMaserControls {
  /** Normalized teaching command; the patent gives no pump-power datum. */
  pumpExcitationPct: number;
  /** Reader-scaled chamber length around the source's approximately 10 cm example. */
  cavityLengthCm: number;
  /** Reader-scaled chamber diameter around the source's approximately 1 cm example. */
  chamberDiameterCm: number;
  /** Reader-scaled end reflectivity around the source's 97% example. */
  endReflectivityPct: number;
  /** Normalized focal-plane aperture opening; the patent gives no aperture diameter. */
  modeApertureOpenPct: number;
  /** Normalized longitudinal magnetic-field command; the patent gives no field strength. */
  modulationFieldPct: number;
  /** Claim-1 system gate used by the claim-inversion teaching view. */
  claim1PathPresent: number;
}

export const TOWNES_MASER_DEFAULT_CONTROLS: TownesMaserControls = {
  pumpExcitationPct: 70,
  cavityLengthCm: 10,
  chamberDiameterCm: 1,
  endReflectivityPct: 97,
  modeApertureOpenPct: 55,
  modulationFieldPct: 35,
  claim1PathPresent: 1,
};

export interface TownesMaserTopologyState {
  readonly controls: TownesMaserControls;
  readonly sourceChamberLengthCm: 10;
  readonly sourceChamberDiameterCm: 1;
  readonly sourcePotassiumTemperatureK: 435;
  readonly sourcePotassiumPressureMmHg: 0.001;
  readonly sourceGoldCoatingAngstrom: 500;
  readonly sourceEndReflectivityPct: 97;
  readonly sourceEndAbsorptivityPct: 2;
  readonly sourceEndTransmissivityPct: 1;
  readonly chamberAspectRatio: number;
  readonly readerRoundTripReflectivityFraction: number;
  readonly pumpingPathPresent: boolean;
  readonly modeSelectorOpen: boolean;
  readonly zeemanModulationPathPresent: boolean;
  readonly claim1PathPresent: boolean;
  readonly signalPathComplete: boolean;
  readonly state:
    | "claim-1 communications path withheld"
    | "pump path idle"
    | "mode-selection aperture closed"
    | "generator → modulated amplifier → detector";
  readonly quantitativeOpticalPerformanceAvailable: false;
  readonly quantitativeEnergyAvailable: false;
  readonly sourceBoundary: string;
  readonly refusal: { readonly refused: true; readonly reason: string };
}

function finiteOr(value: number | undefined, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function readTownesMaserControls(
  params: Partial<TownesMaserControls> | Record<string, number | undefined>,
): TownesMaserControls {
  return {
    pumpExcitationPct: clamp(
      finiteOr(params.pumpExcitationPct, TOWNES_MASER_DEFAULT_CONTROLS.pumpExcitationPct),
      0,
      100,
    ),
    cavityLengthCm: clamp(
      finiteOr(params.cavityLengthCm, TOWNES_MASER_DEFAULT_CONTROLS.cavityLengthCm),
      5,
      20,
    ),
    chamberDiameterCm: clamp(
      finiteOr(params.chamberDiameterCm, TOWNES_MASER_DEFAULT_CONTROLS.chamberDiameterCm),
      0.5,
      2,
    ),
    endReflectivityPct: clamp(
      finiteOr(params.endReflectivityPct, TOWNES_MASER_DEFAULT_CONTROLS.endReflectivityPct),
      90,
      99,
    ),
    modeApertureOpenPct: clamp(
      finiteOr(params.modeApertureOpenPct, TOWNES_MASER_DEFAULT_CONTROLS.modeApertureOpenPct),
      0,
      100,
    ),
    modulationFieldPct: clamp(
      finiteOr(params.modulationFieldPct, TOWNES_MASER_DEFAULT_CONTROLS.modulationFieldPct),
      0,
      100,
    ),
    claim1PathPresent:
      finiteOr(params.claim1PathPresent, TOWNES_MASER_DEFAULT_CONTROLS.claim1PathPresent) >= 0.5
        ? 1
        : 0,
  };
}

export function stepTownesMaserTopology(
  params: Partial<TownesMaserControls> | Record<string, number | undefined>,
): TownesMaserTopologyState {
  const controls = readTownesMaserControls(params);
  const claim1PathPresent = controls.claim1PathPresent === 1;
  const pumpingPathPresent = claim1PathPresent && controls.pumpExcitationPct > 0;
  const modeSelectorOpen = claim1PathPresent && controls.modeApertureOpenPct > 0;
  const zeemanModulationPathPresent = claim1PathPresent && controls.modulationFieldPct > 0;
  const signalPathComplete = pumpingPathPresent && modeSelectorOpen;
  const state: TownesMaserTopologyState["state"] = !claim1PathPresent
    ? "claim-1 communications path withheld"
    : !pumpingPathPresent
      ? "pump path idle"
      : !modeSelectorOpen
        ? "mode-selection aperture closed"
        : "generator → modulated amplifier → detector";

  return {
    controls,
    sourceChamberLengthCm: 10,
    sourceChamberDiameterCm: 1,
    sourcePotassiumTemperatureK: 435,
    sourcePotassiumPressureMmHg: 0.001,
    sourceGoldCoatingAngstrom: 500,
    sourceEndReflectivityPct: 97,
    sourceEndAbsorptivityPct: 2,
    sourceEndTransmissivityPct: 1,
    chamberAspectRatio: Number((controls.cavityLengthCm / controls.chamberDiameterCm).toFixed(3)),
    readerRoundTripReflectivityFraction: Number(
      ((controls.endReflectivityPct / 100) ** 2).toFixed(6),
    ),
    pumpingPathPresent,
    modeSelectorOpen,
    zeemanModulationPathPresent,
    claim1PathPresent,
    signalPathComplete,
    state,
    quantitativeOpticalPerformanceAvailable: false,
    quantitativeEnergyAvailable: false,
    sourceBoundary: TOWNES_MASER_SOURCE_BOUNDARY,
    refusal: {
      refused: true,
      reason: `${TOWNES_MASER_SOURCE_BOUNDARY} The shared exhibit therefore refuses output watts, threshold gain, population density, beam divergence, mode spacing, cavity Q, detector output, and transient performance.`,
    },
  };
}
