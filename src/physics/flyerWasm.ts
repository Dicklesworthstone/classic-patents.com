/**
 * Wright Flyer WASM seam.
 * Prefers `fs-flyer-wasm::flyer_hello_spin`. Falls back to the TS CG2 step
 * from `lie.ts`. Never claims WASM unless the module actually instantiated.
 */

import { type Quat, rigidBodyStep, type Vec3 } from "./lie";

export const FLYER_INERTIA: Vec3 = [0.9, 1.1, 1.7];
export const FLYER_OMEGA0: Vec3 = [0.08, 0.18, 0.05];

export type FlyerKernelSource = "wasm" | "ts-lie-fallback" | "unloaded";

type HelloFn = (
  ixx: number,
  iyy: number,
  izz: number,
  qw: number,
  qx: number,
  qy: number,
  qz: number,
  wx: number,
  wy: number,
  wz: number,
  dtS: number,
  steps: number,
) => string;

type AeroFn = (
  ixx: number,
  iyy: number,
  izz: number,
  qw: number,
  qx: number,
  qy: number,
  qz: number,
  wx: number,
  wy: number,
  wz: number,
  tx: number,
  ty: number,
  tz: number,
  dtS: number,
  steps: number,
) => string;

let helloFn: HelloFn | null = null;
let aeroFn: AeroFn | null = null;
let loadPromise: Promise<FlyerKernelSource> | null = null;
let source: FlyerKernelSource = "unloaded";
let aeroSource: "wasm" | "ts-lie-fallback" = "ts-lie-fallback";

export function flyerAeroSource(): "wasm" | "ts-lie-fallback" {
  return aeroSource;
}

export function flyerKernelSource(): FlyerKernelSource {
  return source;
}

export function ensureFlyerWasm(): Promise<FlyerKernelSource> {
  loadPromise ??= initializeFlyerWasm();
  return loadPromise;
}

async function initializeFlyerWasm(): Promise<FlyerKernelSource> {
  if (typeof window === "undefined") {
    source = "ts-lie-fallback";
    return source;
  }
  try {
    const jsUrl = "/wasm/fs-flyer/fs_flyer_wasm.js";
    const wasmUrl = "/wasm/fs-flyer/fs_flyer_wasm_bg.wasm";
    const jsText = await fetch(jsUrl, { signal: AbortSignal.timeout(10_000) }).then((r) => {
      if (!r.ok) throw new Error(`flyer wasm glue ${r.status}`);
      return r.text();
    });
    const blobUrl = URL.createObjectURL(new Blob([jsText], { type: "text/javascript" }));
    try {
      const mod = (await import(/* webpackIgnore: true */ blobUrl)) as {
        default: (module_or_path?: unknown) => Promise<unknown>;
        flyer_hello_spin: HelloFn;
        flyer_aero_step?: AeroFn;
      };
      await mod.default({ module_or_path: wasmUrl });
      if (typeof mod.flyer_hello_spin !== "function") {
        throw new Error("flyer_hello_spin missing from wasm module");
      }
      helloFn = mod.flyer_hello_spin;
      source = "wasm";
      if (typeof mod.flyer_aero_step === "function") {
        aeroFn = mod.flyer_aero_step;
        aeroSource = "wasm";
      }
    } finally {
      URL.revokeObjectURL(blobUrl);
    }
  } catch {
    helloFn = null;
    aeroFn = null;
    source = "ts-lie-fallback";
    aeroSource = "ts-lie-fallback";
  }
  return source;
}

export interface HelloState {
  quaternion: Quat;
  omega: Vec3;
}

export function decodeFlyerState(raw: string): HelloState | null {
  try {
    const parsed = JSON.parse(raw) as {
      ok?: { quaternion?: unknown; omega_body?: unknown };
    };
    const quaternion = parsed.ok?.quaternion;
    const omega = parsed.ok?.omega_body;
    if (!Array.isArray(quaternion) || quaternion.length !== 4) return null;
    if (!Array.isArray(omega) || omega.length !== 3) return null;
    if (!quaternion.every((value) => typeof value === "number" && Number.isFinite(value))) {
      return null;
    }
    if (!omega.every((value) => typeof value === "number" && Number.isFinite(value))) return null;
    const normSquared = quaternion.reduce((sum, value) => sum + value * value, 0);
    if (Math.abs(normSquared - 1) > 1e-6) return null;
    return { quaternion: quaternion as unknown as Quat, omega: omega as unknown as Vec3 };
  } catch {
    return null;
  }
}

export function stepFlyerHello(state: HelloState, dtS: number): HelloState {
  const dt = Math.min(1, Math.max(1e-9, dtS));
  if (helloFn) {
    const raw = helloFn(
      FLYER_INERTIA[0],
      FLYER_INERTIA[1],
      FLYER_INERTIA[2],
      state.quaternion[0],
      state.quaternion[1],
      state.quaternion[2],
      state.quaternion[3],
      state.omega[0],
      state.omega[1],
      state.omega[2],
      dt,
      1,
    );
    const decoded = decodeFlyerState(raw);
    if (decoded) return decoded;
  }
  const next = rigidBodyStep(state.quaternion, state.omega, FLYER_INERTIA, dt);
  return { quaternion: next.q, omega: next.omega };
}

export function identityFlyerState(): HelloState {
  return {
    quaternion: [1, 0, 0, 0],
    omega: [...FLYER_OMEGA0],
  };
}

/** CG2 step with body torque. hello_spin is torque-free; this is the aero kernel. */
export function stepFlyerAero(state: HelloState, torque: Vec3, dtS: number): HelloState {
  const dt = Math.min(1, Math.max(1e-9, dtS));
  if (aeroFn) {
    const raw = aeroFn(
      FLYER_INERTIA[0],
      FLYER_INERTIA[1],
      FLYER_INERTIA[2],
      state.quaternion[0],
      state.quaternion[1],
      state.quaternion[2],
      state.quaternion[3],
      state.omega[0],
      state.omega[1],
      state.omega[2],
      torque[0],
      torque[1],
      torque[2],
      dt,
      1,
    );
    const decoded = decodeFlyerState(raw);
    if (decoded) return decoded;
  }
  const next = rigidBodyStep(state.quaternion, state.omega, FLYER_INERTIA, dt, torque);
  return { quaternion: next.q, omega: next.omega };
}
