/**
 * src/physics/bellPhotophoneKernel.ts
 *
 * Source-bounded qualitative state for Alexander Graham Bell's Photophone
 * (US 235,199, 1880).
 *
 * The grant establishes causal arrangements—beam variation, a radiation-sensitive
 * receiver, and either direct sound or a telephone circuit. It does not establish
 * component dimensions, irradiance, atmospheric loss, selenium transfer curves,
 * telephone sensitivity, or a measured link budget. This module deliberately does
 * not manufacture SI telemetry from those missing facts.
 */

export interface BellPhotophoneInput {
  /** An authored schematic switch, not a measured voice level. */
  beamVariationActive?: boolean;
  /** @deprecated Accepted only while shared callers migrate; ignored by the qualitative model. */
  voiceSplDb?: number;
  /** @deprecated Accepted only while shared callers migrate; ignored by the qualitative model. */
  audioFrequencyHz?: number;
  /** @deprecated Accepted only while shared callers migrate; ignored by the qualitative model. */
  transmissionDistanceM?: number;
  /** @deprecated Accepted only while shared callers migrate; ignored by the qualitative model. */
  solarIrradianceWPerM2?: number;
  /** @deprecated Accepted only while shared callers migrate; ignored by the qualitative model. */
  collectorDiameterM?: number;
  /** @deprecated Accepted only while shared callers migrate; ignored by the qualitative model. */
  batteryVoltageV?: number;
}

export interface BellPhotophoneState {
  /** Explicitly prevents consumers from presenting these compatibility fields as measurements. */
  evidenceStatus: "qualitative-source-schematic";
  /** True only when the illustration should show a varying beam. */
  beamVariationActive: boolean;
  /** Visitor-facing provenance boundary for local visual consumers. */
  sourceBoundary:
    "US 235,199 describes the causal arrangement, not a measured optical or electrical link budget.";
  /** Voice acoustic pressure at diaphragm (Pascals) */
  voicePressurePa: number;
  /** Diaphragm peak mechanical displacement (micrometers) */
  diaphragmDisplacementUm: number;
  /** Beam divergence angle (milliradians) */
  beamDivergenceMrad: number;
  /** Optical modulation index m (0.0 to 1.0) */
  modulationDepth: number;
  /** Beam spot diameter at receiver plane (meters) */
  receivedBeamDiameterM: number;
  /** Irradiance reaching receiver aperture (W/m²) */
  receivedIrradianceWPerM2: number;
  /** Optical power concentrated onto selenium cell (milliwatts) */
  concentratedPowerMw: number;
  /** Dark electrical resistance of selenium cell (kΩ) */
  seleniumDarkResistanceKOhms: number;
  /** Operating illuminated resistance of selenium cell (kΩ) */
  seleniumOperatingResistanceKOhms: number;
  /** Dynamic peak-to-peak resistance swing under voice modulation (kΩ) */
  deltaResistanceKOhms: number;
  /** Total loop DC bias current (milliamperes) */
  loopCurrentDcMa: number;
  /** AC audio signal current delivered to telephone receiver (microamperes) */
  audioSignalCurrentUa: number;
  /** Reproduced audio sound pressure level in receiver ear-piece (dB SPL) */
  reproducedAudioSplDb: number;
  /** Signal-to-Noise ratio of optical link (dB) */
  linkSnrDb: number;
  /** Link transmission efficiency (%) */
  transmissionEfficiencyPct: number;
}

export function stepBellPhotophone(input: BellPhotophoneInput = {}): BellPhotophoneState {
  const beamVariationActive = input.beamVariationActive ?? true;

  return {
    evidenceStatus: "qualitative-source-schematic",
    beamVariationActive,
    sourceBoundary:
      "US 235,199 describes the causal arrangement, not a measured optical or electrical link budget.",
    // Compatibility values remain for registry consumers that have not yet been
    // migrated. They are intentionally zero, never a simulated measurement.
    voicePressurePa: 0,
    diaphragmDisplacementUm: 0,
    beamDivergenceMrad: 0,
    modulationDepth: beamVariationActive ? 1 : 0,
    receivedBeamDiameterM: 0,
    receivedIrradianceWPerM2: 0,
    concentratedPowerMw: 0,
    seleniumDarkResistanceKOhms: 0,
    seleniumOperatingResistanceKOhms: 0,
    deltaResistanceKOhms: 0,
    loopCurrentDcMa: 0,
    audioSignalCurrentUa: 0,
    reproducedAudioSplDb: 0,
    linkSnrDb: 0,
    transmissionEfficiencyPct: 0,
  };
}
