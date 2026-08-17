/**
 * CG2 / exp-map free rigid-body step, ported from frankensim `fs-time::lie`.
 * Used as the host fallback when `fs-flyer-wasm` is not instantiated.
 * Quaternion convention: [w, x, y, z].
 */

export type Quat = readonly [number, number, number, number];
export type Vec3 = readonly [number, number, number];

export function quatMul(a: Quat, b: Quat): Quat {
  return [
    a[0] * b[0] - a[1] * b[1] - a[2] * b[2] - a[3] * b[3],
    a[0] * b[1] + a[1] * b[0] + a[2] * b[3] - a[3] * b[2],
    a[0] * b[2] + a[2] * b[0] + a[3] * b[1] - a[1] * b[3],
    a[0] * b[3] + a[3] * b[0] + a[1] * b[2] - a[2] * b[1],
  ];
}

export function quatExp(hw: Vec3): Quat {
  const half: Vec3 = [0.5 * hw[0], 0.5 * hw[1], 0.5 * hw[2]];
  const theta2 = half[0] * half[0] + half[1] * half[1] + half[2] * half[2];
  const theta = Math.sqrt(theta2);
  let c: number;
  let sinc: number;
  if (theta < 1e-6) {
    c = 1.0 - 0.5 * theta2 + (theta2 * theta2) / 24.0;
    sinc = 1.0 - theta2 / 6.0 + (theta2 * theta2) / 120.0;
  } else {
    c = Math.cos(theta);
    sinc = Math.sin(theta) / theta;
  }
  return [c, sinc * half[0], sinc * half[1], sinc * half[2]];
}

export function quatExpStep(q: Quat, omegaBody: Vec3, h: number): Quat {
  return quatMul(q, quatExp([h * omegaBody[0], h * omegaBody[1], h * omegaBody[2]]));
}

export function rigidBodyStep(
  q: Quat,
  omega: Vec3,
  inertia: Vec3,
  h: number,
  torque: Vec3 = [0, 0, 0],
): { q: Quat; omega: Vec3 } {
  const euler = (w: Vec3): Vec3 => {
    const l: Vec3 = [inertia[0] * w[0], inertia[1] * w[1], inertia[2] * w[2]];
    return [
      (torque[0] + (l[1] * w[2] - l[2] * w[1])) / inertia[0],
      (torque[1] + (l[2] * w[0] - l[0] * w[2])) / inertia[1],
      (torque[2] + (l[0] * w[1] - l[1] * w[0])) / inertia[2],
    ];
  };
  const k1 = euler(omega);
  const wMid: Vec3 = [
    omega[0] + 0.5 * h * k1[0],
    omega[1] + 0.5 * h * k1[1],
    omega[2] + 0.5 * h * k1[2],
  ];
  const k2 = euler(wMid);
  const omegaNew: Vec3 = [omega[0] + h * k2[0], omega[1] + h * k2[1], omega[2] + h * k2[2]];
  return { q: quatExpStep(q, wMid, h), omega: omegaNew };
}
