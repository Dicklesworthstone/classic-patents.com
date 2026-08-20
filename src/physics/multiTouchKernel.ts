export interface MultiTouchControls {
  fingerCount: number; // 0, 1, or 2 fingers
  fingerSeparationMm: number; // Distance between dual contact points [15mm .. 120mm]
  touchPressureGrams: number; // Normal force / contact area [20g .. 200g]
  gestureVelocityMmS: number; // Gesture velocity for momentum calculation
}

export interface MultiTouchState {
  touch1X: number;
  touch1Y: number;
  touch2X: number;
  touch2Y: number;
  activeTouchCount: number;

  gestureMode: "Single-Finger Scroll" | "Pinch-to-Zoom" | "Two-Finger Rotate" | "Idle";
  zoomScale: number;
  rotationAngleDeg: number;
  mutualCapacitanceDeltaPf: number;

  sensorMatrix: number[][];
}

export function stepMultiTouch(
  c: MultiTouchControls,
  timeSec: number,
  prevState?: MultiTouchState,
): MultiTouchState {
  const count = Math.max(0, Math.min(2, Math.round(c.fingerCount ?? 2)));
  const sep = Math.max(15, Math.min(120, c.fingerSeparationMm ?? 50));
  const pressure = Math.max(10, Math.min(300, c.touchPressureGrams ?? 80));

  const mutualCapDelta = (pressure / 100) * 0.85;

  let t1x = 0;
  let t1y = 0;
  let t2x = 0;
  let t2y = 0;
  let mode: MultiTouchState["gestureMode"] = "Idle";
  let zoom = prevState ? prevState.zoomScale : 1.0;
  let rotDeg = 0;

  if (count === 1) {
    mode = "Single-Finger Scroll";
    t1x = 0.4 * Math.sin(timeSec * 2.0);
    t1y = 0.6 * Math.cos(timeSec * 2.0);
    zoom = 1.0;
  } else if (count === 2) {
    const halfSep = (sep / 1000) * 8.0;
    const centerShiftX = 0.2 * Math.sin(timeSec * 1.2);
    const centerShiftY = 0.1 * Math.cos(timeSec * 1.2);

    const angle = timeSec * 0.5;
    t1x = centerShiftX + Math.cos(angle) * halfSep;
    t1y = centerShiftY + Math.sin(angle) * halfSep;
    t2x = centerShiftX - Math.cos(angle) * halfSep;
    t2y = centerShiftY - Math.sin(angle) * halfSep;

    rotDeg = (angle * 180) / Math.PI;
    zoom = Number((sep / 50.0).toFixed(2));
    mode = Math.abs(rotDeg % 90) > 35 ? "Two-Finger Rotate" : "Pinch-to-Zoom";
  }

  const matrix: number[][] = Array.from({ length: 4 }, () => Array(4).fill(0.05));

  const applyTouchToMatrix = (tx: number, ty: number) => {
    const gx = ((tx + 1.0) / 2.0) * 3.0;
    const gy = ((ty + 1.0) / 2.0) * 3.0;

    for (let r = 0; r < 4; r++) {
      for (let col = 0; col < 4; col++) {
        const dist = Math.sqrt((r - gy) ** 2 + (col - gx) ** 2);
        const signal = Math.max(0, 1.0 - dist * 0.7) * mutualCapDelta;
        matrix[r][col] = Math.min(1.0, matrix[r][col] + signal);
      }
    }
  };

  if (count >= 1) applyTouchToMatrix(t1x, t1y);
  if (count >= 2) applyTouchToMatrix(t2x, t2y);

  return {
    touch1X: t1x,
    touch1Y: t1y,
    touch2X: t2x,
    touch2Y: t2y,
    activeTouchCount: count,
    gestureMode: mode,
    zoomScale: zoom,
    rotationAngleDeg: Number(rotDeg.toFixed(1)),
    mutualCapacitanceDeltaPf: Number(mutualCapDelta.toFixed(2)),
    sensorMatrix: matrix,
  };
}
