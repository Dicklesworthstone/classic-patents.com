/**
 * Source-bounded presentation step for US 233,692.
 *
 * The grant supplies geometry and relative arrangement, but no head, flow,
 * runner speed, bucket count, efficiency, or dimensions. This kernel therefore
 * owns only the reversible display kinematics driven by visitor parameters; it
 * refuses to manufacture hydraulic telemetry from absent source data.
 */
export interface PeltonWheelVisualControls {
  runnerRpm: number;
  jetEnabled: boolean;
}

export interface PeltonWheelVisualState {
  runnerOmegaRadPerS: number;
  jetDisplaySpeed: number;
  sprayDisplaySpeed: number;
  jetOpacity: number;
  sourceTelemetryAvailable: false;
}

export function stepPeltonWheelVisual(controls: PeltonWheelVisualControls): PeltonWheelVisualState {
  const runnerRpm = Number.isFinite(controls.runnerRpm) ? Math.max(0, controls.runnerRpm) : 0;
  const runnerOmegaRadPerS = (runnerRpm * 2 * Math.PI) / 60;
  return {
    runnerOmegaRadPerS,
    jetDisplaySpeed: controls.jetEnabled ? 0.08 : 0,
    sprayDisplaySpeed: controls.jetEnabled ? 0.04 : 0,
    jetOpacity: controls.jetEnabled ? 0.85 : 0.25,
    sourceTelemetryAvailable: false,
  };
}
