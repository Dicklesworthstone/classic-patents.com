/**
 * lemelsonMachineVisionKernel.ts
 *
 * SI Video Scanning and Dimensional Inspection Physics Kernel for Jerome H. Lemelson's
 * landmark Machine Vision Patent (US Patent 3,081,379 - "Automatic Measurement Apparatus").
 *
 * Models raster electron beam deflection, video waveform generation, optical gating,
 * pulse duration gauging, and automated defect diverter actuation in strict SI units.
 */

export interface LemelsonMachineVisionControls {
  readonly scanLineCount: number; // e.g. 525
  readonly frameRateHz: number; // e.g. 30
  readonly targetWidthM: number; // e.g. 0.2 (m)
  readonly illuminationLux: number; // e.g. 1500
  readonly thresholdVoltage: number; // e.g. 0.45 (V)
  readonly nominalPartWidthM: number; // e.g. 0.08 (m)
  readonly actualPartWidthM: number; // e.g. 0.082 (m)
  readonly flawDepthM: number; // e.g. 0.0 (m)
  readonly gateWindowStartUs: number; // e.g. 12.0 (us)
  readonly gateWindowWidthUs: number; // e.g. 25.0 (us)
  readonly gateSolenoidCurrentA: number; // e.g. 2.5 (A)
  readonly conveyorSpeedMPerS: number; // e.g. 0.25 (m/s)
}

export const LEMELSON_MACHINE_VISION_DEFAULT_CONTROLS: LemelsonMachineVisionControls = {
  scanLineCount: 525,
  frameRateHz: 30,
  targetWidthM: 0.2,
  illuminationLux: 1500,
  thresholdVoltage: 0.45,
  nominalPartWidthM: 0.08,
  actualPartWidthM: 0.082,
  flawDepthM: 0.0,
  gateWindowStartUs: 12.0,
  gateWindowWidthUs: 25.0,
  gateSolenoidCurrentA: 2.5,
  conveyorSpeedMPerS: 0.25,
};

export interface LemelsonMachineVisionMetrics {
  readonly horizontalScanFreqHz: number;
  readonly linePeriodUs: number;
  readonly activeSweepTimeUs: number;
  readonly scanBeamVelocityMPerS: number;
  readonly videoPeakVoltageV: number;
  readonly pulseWidthUs: number;
  readonly measuredPartWidthMm: number;
  readonly dimensionalErrorMm: number;
  readonly isDefective: boolean;
  readonly defectDetected: boolean;
  readonly solenoidForceN: number;
  readonly gateResponseTimeMs: number;
}

export interface LemelsonMachineVisionSiState {
  readonly controls: LemelsonMachineVisionControls;
  readonly metrics: LemelsonMachineVisionMetrics;
  readonly beamPositionX: number;
  readonly rawVideoVolts: number;
  readonly clippedVideoVolts: number;
  readonly gateActive: boolean;
  readonly defectDetected: boolean;
  readonly isDefective: boolean;
  readonly refusal: {
    readonly isRefused: boolean;
    readonly reason: string;
  };
}

export type LemelsonMachineVisionState = LemelsonMachineVisionSiState;

export function readLemelsonMachineVisionControls(
  raw: Record<string, number | undefined>,
): LemelsonMachineVisionControls {
  return {
    scanLineCount: Math.max(
      100,
      Math.min(1200, raw.scanLineCount ?? LEMELSON_MACHINE_VISION_DEFAULT_CONTROLS.scanLineCount),
    ),
    frameRateHz: Math.max(
      10,
      Math.min(120, raw.frameRateHz ?? LEMELSON_MACHINE_VISION_DEFAULT_CONTROLS.frameRateHz),
    ),
    targetWidthM: Math.max(
      0.05,
      Math.min(1.0, raw.targetWidthM ?? LEMELSON_MACHINE_VISION_DEFAULT_CONTROLS.targetWidthM),
    ),
    illuminationLux: Math.max(
      100,
      Math.min(
        10000,
        raw.illuminationLux ?? LEMELSON_MACHINE_VISION_DEFAULT_CONTROLS.illuminationLux,
      ),
    ),
    thresholdVoltage: Math.max(
      0.05,
      Math.min(
        1.0,
        raw.thresholdVoltage ?? LEMELSON_MACHINE_VISION_DEFAULT_CONTROLS.thresholdVoltage,
      ),
    ),
    nominalPartWidthM: Math.max(
      0.01,
      Math.min(
        0.5,
        raw.nominalPartWidthM ?? LEMELSON_MACHINE_VISION_DEFAULT_CONTROLS.nominalPartWidthM,
      ),
    ),
    actualPartWidthM: Math.max(
      0.01,
      Math.min(
        0.5,
        raw.actualPartWidthM ??
          raw.nominalPartWidthM ??
          LEMELSON_MACHINE_VISION_DEFAULT_CONTROLS.actualPartWidthM,
      ),
    ),
    flawDepthM: Math.max(
      0.0,
      Math.min(0.05, raw.flawDepthM ?? LEMELSON_MACHINE_VISION_DEFAULT_CONTROLS.flawDepthM),
    ),
    gateWindowStartUs: Math.max(
      0.0,
      Math.min(
        60.0,
        raw.gateWindowStartUs ?? LEMELSON_MACHINE_VISION_DEFAULT_CONTROLS.gateWindowStartUs,
      ),
    ),
    gateWindowWidthUs: Math.max(
      1.0,
      Math.min(
        60.0,
        raw.gateWindowWidthUs ?? LEMELSON_MACHINE_VISION_DEFAULT_CONTROLS.gateWindowWidthUs,
      ),
    ),
    gateSolenoidCurrentA: Math.max(
      0.1,
      Math.min(
        10.0,
        raw.gateSolenoidCurrentA ?? LEMELSON_MACHINE_VISION_DEFAULT_CONTROLS.gateSolenoidCurrentA,
      ),
    ),
    conveyorSpeedMPerS: Math.max(
      0.01,
      Math.min(
        2.0,
        raw.conveyorSpeedMPerS ?? LEMELSON_MACHINE_VISION_DEFAULT_CONTROLS.conveyorSpeedMPerS,
      ),
    ),
  };
}

export function stepLemelsonMachineVisionSi(
  controls: LemelsonMachineVisionControls = LEMELSON_MACHINE_VISION_DEFAULT_CONTROLS,
  timeSec = 0,
): LemelsonMachineVisionSiState {
  const f_H = controls.scanLineCount * controls.frameRateHz; // e.g. 525 * 30 = 15750 Hz
  const T_H = (1.0 / f_H) * 1e6; // Line period in microseconds (e.g. 63.49 us)
  const T_active = T_H * 0.84; // Active scan time excluding blanking (~53.33 us)
  const v_scan = controls.targetWidthM / (T_active * 1e-6); // Beam velocity in m/s

  // Detected pulse duration
  const clampedActualPartWidthM = Math.min(controls.targetWidthM, controls.actualPartWidthM);
  const pulseWidthUs = (clampedActualPartWidthM / v_scan) * 1e6;
  const measuredPartWidthMm = pulseWidthUs * 1e-6 * v_scan * 1000;
  const nominalPartWidthMm = controls.nominalPartWidthM * 1000;
  const dimensionalErrorMm = Math.abs(measuredPartWidthMm - nominalPartWidthMm);

  // Peak video voltage
  const baseResponsivity = 0.0006;
  const videoPeakVoltageV = Math.min(1.2, controls.illuminationLux * baseResponsivity);

  // Solenoid magnetic force: F = (N*I)^2 * mu0 * A / (2 * g^2)
  const N = 450; // turns
  const I = Math.max(0.1, controls.gateSolenoidCurrentA);
  const mu0 = 4 * Math.PI * 1e-7;
  const A = 0.0004; // 4 cm^2 pole area
  const g = 0.008; // 8 mm air gap
  const solenoidForceN = ((N * I) ** 2 * mu0 * A) / (2 * g ** 2);
  const gateMassKg = 0.35;
  const gateResponseTimeMs = Math.sqrt((2 * gateMassKg * g) / Math.max(1.0, solenoidForceN)) * 1000;

  // Scanning phase
  const linePeriodSec = 1.0 / f_H;
  const linePhase = (timeSec % linePeriodSec) / linePeriodSec;
  const timeInLineUs = linePhase * T_H;

  const partFraction = clampedActualPartWidthM / controls.targetWidthM;
  const partStart = 0.5 - partFraction / 2;
  const partEnd = 0.5 + partFraction / 2;

  let rawVideo = 0.1;
  if (linePhase >= partStart && linePhase <= partEnd) {
    rawVideo = videoPeakVoltageV;
    if (controls.flawDepthM > 0.0005 && Math.abs(linePhase - 0.5) < 0.05) {
      rawVideo -= Math.min(0.6, controls.flawDepthM * 300);
    }
  }

  const clippedVideo = rawVideo >= controls.thresholdVoltage ? 1.0 : 0.0;
  const gateActive =
    timeInLineUs >= controls.gateWindowStartUs &&
    timeInLineUs <= controls.gateWindowStartUs + controls.gateWindowWidthUs;

  const isDefective =
    dimensionalErrorMm > nominalPartWidthMm * 0.025 ||
    (controls.flawDepthM > 0.0005 && rawVideo < controls.thresholdVoltage);

  const metrics: LemelsonMachineVisionMetrics = {
    horizontalScanFreqHz: f_H,
    linePeriodUs: T_H,
    activeSweepTimeUs: T_active,
    scanBeamVelocityMPerS: v_scan,
    videoPeakVoltageV,
    pulseWidthUs,
    measuredPartWidthMm,
    dimensionalErrorMm,
    isDefective,
    defectDetected: isDefective,
    solenoidForceN,
    gateResponseTimeMs,
  };

  return {
    controls,
    metrics,
    beamPositionX: linePhase,
    rawVideoVolts: rawVideo,
    clippedVideoVolts: clippedVideo,
    gateActive,
    defectDetected: isDefective,
    isDefective,
    refusal: {
      isRefused: true,
      reason:
        "US 3,081,379 provides raster line scan geometry, video waveform gating, and pulse duration measurement principles, but does not state empirical vidicon photocathode dark-current figures or specific tube signal-to-noise ratios.",
    },
  };
}

// Backward compatibility helper
export function stepLemelsonMachineVision(rawControls?: any, timeSec = 0) {
  const controls = readLemelsonMachineVisionControls(rawControls ?? {});
  const si = stepLemelsonMachineVisionSi(controls, timeSec);
  return {
    timestamp: timeSec,
    beamPositionX: si.beamPositionX,
    beamVelocityMps: si.metrics.scanBeamVelocityMPerS,
    rawVideoVolts: si.rawVideoVolts,
    clippedVideoVolts: si.clippedVideoVolts,
    gateActive: si.gateActive,
    measuredPulseDurationUs: si.metrics.pulseWidthUs,
    measuredWidthMm: si.metrics.measuredPartWidthMm,
    dimensionalErrorMm: si.metrics.dimensionalErrorMm,
    defectDetected: si.defectDetected,
    isDefective: si.isDefective,
    diverterSolenoidForceN: si.metrics.solenoidForceN,
    throughputPartsPerMin: 150,
  };
}
