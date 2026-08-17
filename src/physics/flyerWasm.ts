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

let helloFn: HelloFn | null = null;
let loadAttempted = false;
let source: FlyerKernelSource = "unloaded";

export function flyerKernelSource(): FlyerKernelSource {
  return source;
}

export async function ensureFlyerWasm(): Promise<FlyerKernelSource> {
  if (loadAttempted) return source;
  loadAttempted = true;
  if (typeof window === "undefined") {
    source = "ts-lie-fallback";
    return source;
  }
  try {
    const jsUrl = "/wasm/fs-flyer/fs_flyer_wasm.js";
    const wasmUrl = "/wasm/fs-flyer/fs_flyer_wasm_bg.wasm";
    const jsText = await fetch(jsUrl).then((r) => {
      if (!r.ok) throw new Error(`flyer wasm glue ${r.status}`);
      return r.text();
    });
    const blobUrl = URL.createObjectURL(new Blob([jsText], { type: "text/javascript" }));
    const mod = (await import(/* webpackIgnore: true */ blobUrl)) as {
      default: (module_or_path?: unknown) => Promise<unknown>;
      flyer_hello_spin: HelloFn;
    };
    await mod.default({ module_or_path: wasmUrl });
    URL.revokeObjectURL(blobUrl);
    if (typeof mod.flyer_hello_spin !== "function") {
      throw new Error("flyer_hello_spin missing from wasm module");
    }
    helloFn = mod.flyer_hello_spin;
    source = "wasm";
  } catch {
    helloFn = null;
    source = "ts-lie-fallback";
  }
  return source;
}

export interface HelloState {
  quaternion: Quat;
  omega: Vec3;
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
    const parsed = JSON.parse(raw) as {
      ok?: { quaternion: number[]; omega_body: number[] };
    };
    if (parsed.ok?.quaternion && parsed.ok.omega_body) {
      return {
        quaternion: parsed.ok.quaternion as unknown as Quat,
        omega: parsed.ok.omega_body as unknown as Vec3,
      };
    }
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
