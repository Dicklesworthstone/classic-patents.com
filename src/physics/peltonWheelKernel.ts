/**
 * Source-bounded presentation step for US 233,692.
 *
 * The grant supplies geometry and relative arrangement, but no head, flow,
 * runner speed, bucket count, efficiency, or dimensions. This kernel therefore
 * owns only the reversible display kinematics driven by visitor parameters; it
 * refuses to manufacture hydraulic telemetry from absent source data.
 */
export interface PeltonWheelVisualControls {
  jetEnabled: boolean;
}

export interface PeltonWheelVisualState {
  runnerOmegaRadPerS: number;
  jetOpacity: number;
  sourceTelemetryAvailable: false;
}

export function stepPeltonWheelVisual(controls: PeltonWheelVisualControls): PeltonWheelVisualState {
  return {
    // The grant gives no operating speed. Keep the archival model posed rather
    // than converting an invented visitor rpm into a claimed machine state.
    runnerOmegaRadPerS: 0,
    jetOpacity: controls.jetEnabled ? 0.85 : 0.25,
    sourceTelemetryAvailable: false,
  };
}
