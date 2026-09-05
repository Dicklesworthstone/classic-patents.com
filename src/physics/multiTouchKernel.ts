/**
 * Claim-bounded command classifier for US 7,479,949.
 *
 * The grant claims heuristics applied after one or more finger contacts are
 * detected. It does not disclose a capacitance value, sensor-grid geometry,
 * contact pressure, scan rate, or a numeric angular threshold. This kernel
 * models only the transparent geometry of the claimed decision; the threshold
 * and contact distances are reader-selected illustrations.
 */
export interface MultiTouchControls {
  /** Number of contacts supplied to the command heuristic (0, 1, or 2). */
  fingerCount: number;
  /** Reader-selected distance used to illustrate the Claim 8 pinch command. */
  fingerSeparationMm: number;
  /** Angle from the screen's vertical direction, used for Claim 1's initial motion. */
  initialMotionAngleDeg?: number;
  /** Illustrative decision boundary; the grant does not print its value. */
  initialAngleThresholdDeg?: number;
  /**
   * Claim 1 probe. When false, retain visible contacts but refuse to route
   * them to one of the grant's command outcomes.
   */
  claim1HeuristicActive?: boolean;
  /**
   * Deprecated presentation inputs retained temporarily so older callers do
   * not silently create a second simulation. Neither is read by this kernel.
   */
  touchPressureGrams?: number;
  gestureVelocityMmS?: number;
}

export type MultiTouchGestureMode =
  | "Vertical Screen Scroll"
  | "Two-Dimensional Translation"
  | "Pinch-to-Zoom"
  | "Idle";

export interface MultiTouchState {
  touch1X: number;
  touch1Y: number;
  touch2X: number;
  touch2Y: number;
  activeTouchCount: number;
  gestureMode: MultiTouchGestureMode;
  /** Angle from vertical, rather than a claim of a hardware-sensed angle. */
  initialMotionAngleDeg: number;
  /** Reader-selected comparison boundary, explicitly not a source constant. */
  initialAngleThresholdDeg: number;
  /** Claim 8 illustration: contact separation divided by a 50 mm display baseline. */
  zoomScale: number;
}

const clamp = (value: number, lower: number, upper: number) =>
  Math.min(upper, Math.max(lower, value));

/**
 * Returns a stable, replayable projection of the grant's decision topology.
 * `timeSec` only advances the display position of a classified gesture; it
 * never changes the classification. A caller that needs a different command
 * changes a registered control, rather than waiting for an animation phase.
 */
export function stepMultiTouch(
  controls: MultiTouchControls,
  timeSec: number,
  _previousState?: MultiTouchState,
): MultiTouchState {
  const contactCount = clamp(Math.round(controls.fingerCount ?? 0), 0, 2);
  const separationMm = clamp(controls.fingerSeparationMm ?? 50, 15, 120);
  const initialMotionAngleDeg = clamp(Math.abs(controls.initialMotionAngleDeg ?? 15), 0, 90);
  const initialAngleThresholdDeg = clamp(controls.initialAngleThresholdDeg ?? 30, 1, 89);
  const claim1HeuristicActive = controls.claim1HeuristicActive ?? true;

  // The periodic position makes the source-topology decision legible in the
  // studio. The direction is fully determined by the input angle, measured
  // from the positive screen-vertical axis: Δx = r sin θ, Δy = r cos θ.
  const travel = 0.38 * Math.sin(Math.max(0, timeSec) * 1.2);
  const directionRad = (initialMotionAngleDeg * Math.PI) / 180;
  const touch1X = travel * Math.sin(directionRad);
  const touch1Y = travel * Math.cos(directionRad);

  if (contactCount === 0) {
    return {
      touch1X: 0,
      touch1Y: 0,
      touch2X: 0,
      touch2Y: 0,
      activeTouchCount: 0,
      gestureMode: "Idle",
      initialMotionAngleDeg,
      initialAngleThresholdDeg,
      zoomScale: 1,
    };
  }

  if (!claim1HeuristicActive) {
    return {
      touch1X,
      touch1Y,
      touch2X: 0,
      touch2Y: 0,
      activeTouchCount: contactCount,
      gestureMode: "Idle",
      initialMotionAngleDeg,
      initialAngleThresholdDeg,
      zoomScale: 1,
    };
  }

  if (contactCount === 1) {
    return {
      touch1X,
      touch1Y,
      touch2X: 0,
      touch2Y: 0,
      activeTouchCount: 1,
      gestureMode:
        initialMotionAngleDeg <= initialAngleThresholdDeg
          ? "Vertical Screen Scroll"
          : "Two-Dimensional Translation",
      initialMotionAngleDeg,
      initialAngleThresholdDeg,
      zoomScale: 1,
    };
  }

  // Claim 8 is a dependent two-finger pinch-to-zoom command. A 50 mm
  // baseline is a readable exhibit scale, never an asserted historic value.
  const halfSeparation = (separationMm / 50) * 0.4;
  return {
    touch1X: -halfSeparation,
    touch1Y: 0,
    touch2X: halfSeparation,
    touch2Y: 0,
    activeTouchCount: 2,
    gestureMode: "Pinch-to-Zoom",
    initialMotionAngleDeg,
    initialAngleThresholdDeg,
    zoomScale: Number((separationMm / 50).toFixed(2)),
  };
}
