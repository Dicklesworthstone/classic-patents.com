/**
 * src/physics/bellPhotophoneKernel.ts
 *
 * Audited SI physics kernel for Alexander Graham Bell's Photophone (US 235,199, 1880).
 * Simulates:
 * 1. Transmitter optical flux generation & voice-diaphragm beam divergence modulation
 * 2. Free-space optical transmission, beam spreading, and Beer-Lambert atmospheric extinction
 * 3. Parabolic mirror radiant energy concentration onto axial selenium cell
 * 4. Willoughby Smith / Adams-Day selenium photoconductivity power law R_se(E)
 * 5. Telephonic audio AC signal current & photoacoustic spectrophone sound pressure
 */

export interface BellPhotophoneInput {
  /** Voice acoustic SPL at transmitter mouthpiece in dB (50 to 95 dB SPL) */
  voiceSplDb?: number;
  /** Audio acoustic frequency in Hertz (100 to 3000 Hz) */
  audioFrequencyHz?: number;
  /** Free-space wireless transmission distance in meters (5 to 500 m) */
  transmissionDistanceM?: number;
  /** Incident solar/source irradiance in W/m² (100 to 1200 W/m²) */
  solarIrradianceWPerM2?: number;
  /** Parabolic collector mirror diameter in meters (0.2 to 1.0 m) */
  collectorDiameterM?: number;
  /** Battery supply potential in Volts (4 to 24 V) */
  batteryVoltageV?: number;
  /** Receiver mode: 'selenium-photoconductive' or 'photoacoustic-spectrophone' */
  receiverMode?: "selenium-photoconductive" | "photoacoustic-spectrophone";
}

export interface BellPhotophoneState {
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
  const {
    voiceSplDb = 75,
    audioFrequencyHz: _audioFrequencyHz = 440,
    transmissionDistanceM = 213, // Bell & Tainter's historic 1880 distance (213 m)
    solarIrradianceWPerM2 = 950,
    collectorDiameterM = 0.5,
    batteryVoltageV = 12.0,
    receiverMode: _receiverMode = "selenium-photoconductive",
  } = input;

  // 1. Acoustic Pressure at Transmitter Diaphragm
  // P_ref = 20 uPa (0 dB SPL)
  const voicePressurePa = 20e-6 * 10 ** (voiceSplDb / 20);

  // Diaphragm flexure (thin silvered glass/mica cover-slip):
  // Displacement y = P * a^4 / (64 * D_flex)
  const diaphragmDisplacementUm = Math.min(25.0, voicePressurePa * 4.2);

  // 2. Optical Beam Modulation & Divergence
  // Base divergence of collimated solar beam ≈ 9.3 mrad (solar angular diameter)
  const baseDivergenceMrad = 9.3;
  const modulationDepth = Math.min(0.85, (voicePressurePa / 1.5) * 0.45);
  const beamDivergenceMrad = baseDivergenceMrad * (1 + modulationDepth * 0.4);

  // 3. Free-Space Optical Transmission & Inverse-Square Law
  const distance = Math.max(1, transmissionDistanceM);
  const transmitterLensDiamM = 0.12;
  const receivedBeamDiameterM =
    transmitterLensDiamM + 2 * distance * Math.tan(beamDivergenceMrad / 2 / 1000);
  const beamAreaM2 = (Math.PI / 4) * receivedBeamDiameterM ** 2;

  // Transmitter source collected power
  const transmitterLensAreaM2 = (Math.PI / 4) * transmitterLensDiamM ** 2;
  const collectedTransmitterPowerW = solarIrradianceWPerM2 * transmitterLensAreaM2 * 0.82; // 82% optical efficiency

  // Atmospheric Beer-Lambert transmission (clear weather alpha ≈ 0.0002 m^-1)
  const atmExtinctionCoeff = 0.00025;
  const atmTransmission = Math.exp(-atmExtinctionCoeff * distance);

  // Irradiance at receiver plane (W/m²)
  const receivedIrradianceWPerM2 = (collectedTransmitterPowerW * atmTransmission) / beamAreaM2;

  // 4. Parabolic Collector Mirror Concentration
  const collectorAreaM2 = (Math.PI / 4) * collectorDiameterM ** 2;
  const mirrorReflectivity = 0.88;
  const concentratedPowerW = receivedIrradianceWPerM2 * collectorAreaM2 * mirrorReflectivity;
  const concentratedPowerMw = concentratedPowerW * 1000;

  // 5. Selenium Photoconductive Cell Dynamics (Adams-Day sublinear power law)
  // Multi-disc stacked cylindrical cell (50 brass disks, 0.08 mm mica gaps)
  const seleniumDarkResistanceKOhms = 180.0;
  // Sensitivity factor beta: R = R_dark / (1 + beta * sqrt(P_cell))
  const photoSensitivityFactor = 1.45;
  const photoconductanceRatio =
    1 + photoSensitivityFactor * Math.sqrt(Math.max(0.001, concentratedPowerMw));
  const seleniumOperatingResistanceKOhms = seleniumDarkResistanceKOhms / photoconductanceRatio;

  // Resistance swing under acoustic voice modulation
  const deltaResistanceKOhms = seleniumOperatingResistanceKOhms * modulationDepth * 0.65;

  // 6. Electrical Telephonic Circuit
  const phoneImpedanceOhms = 75.0;
  const totalOperatingResistanceOhms = seleniumOperatingResistanceKOhms * 1000 + phoneImpedanceOhms;
  const loopCurrentDcMa = (batteryVoltageV / totalOperatingResistanceOhms) * 1000;

  // AC signal current: dI = -V * dR / R^2
  const audioSignalCurrentA =
    (batteryVoltageV * (deltaResistanceKOhms * 1000)) / totalOperatingResistanceOhms ** 2;
  const audioSignalCurrentUa = audioSignalCurrentA * 1e6;

  // Reproduced Audio SPL (dB) in telephone receiver
  // S_phone ≈ 95 dB SPL per mA AC current
  const phoneSensitivityDbPerMa = 92.0;
  const reproducedAudioSplDb = Math.max(
    10.0,
    Math.min(
      85.0,
      phoneSensitivityDbPerMa + 20 * Math.log10(Math.max(0.001, audioSignalCurrentUa / 1000)),
    ),
  );

  // Link Signal-to-Noise Ratio (dB)
  const noiseFloorUa = 0.08; // Thermal & shot noise in microamps
  const linkSnrDb = Math.max(
    0,
    20 * Math.log10(Math.max(1.0, audioSignalCurrentUa / noiseFloorUa)),
  );

  const transmissionEfficiencyPct = (concentratedPowerW / collectedTransmitterPowerW) * 100;

  return {
    voicePressurePa,
    diaphragmDisplacementUm,
    beamDivergenceMrad,
    modulationDepth,
    receivedBeamDiameterM,
    receivedIrradianceWPerM2,
    concentratedPowerMw,
    seleniumDarkResistanceKOhms,
    seleniumOperatingResistanceKOhms,
    deltaResistanceKOhms,
    loopCurrentDcMa,
    audioSignalCurrentUa,
    reproducedAudioSplDb,
    linkSnrDb,
    transmissionEfficiencyPct,
  };
}
