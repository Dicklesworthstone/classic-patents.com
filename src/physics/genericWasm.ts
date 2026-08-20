/**
 * Generic FrankenSim crate composition for patents that have no per-machine
 * WASM module. Prefers `/wasm/fs-generic/` (`fs-wasm`: fs-ga, fs-sparse heat,
 * fs-fft wave). Falls back to host implementations of the documented layouts.
 * Never claims WASM unless the module actually instantiated.
 */

export type GenericKernelSource = "wasm" | "ts-fallback" | "unloaded";

type GaFn = (nPoints: number, steps: number) => Float64Array;
type HeatFn = (n: number, frames: number, stepsPerFrame: number) => Float64Array;
type WaveFn = (n: number, frames: number, stepsPerFrame: number) => Float64Array;
type FluidFn = (n: number, frames: number) => Float64Array;
type CyclicFn = (n: number, stiffness: number) => Float64Array;
type ModesFn = (n: number, k: number) => Float64Array;

let gaFn: GaFn | null = null;
let heatFn: HeatFn | null = null;
let waveFn: WaveFn | null = null;
let fluidFn: FluidFn | null = null;
let cyclicFn: CyclicFn | null = null;
let modesFn: ModesFn | null = null;
let loadAttempted = false;
let source: GenericKernelSource = "unloaded";

const orbitCache = new Map<string, Float64Array>();
const heatCache = new Map<string, Float64Array>();
const waveCache = new Map<string, Float64Array>();
const fluidCache = new Map<string, Float64Array>();
const cyclicCache = new Map<string, Float64Array>();
const modesCache = new Map<string, Float64Array>();

export function genericKernelSource(): GenericKernelSource {
  return source;
}

export async function ensureGenericWasm(): Promise<GenericKernelSource> {
  if (loadAttempted) return source;
  loadAttempted = true;
  if (typeof window === "undefined") {
    source = "ts-fallback";
    return source;
  }
  try {
    const jsUrl = "/wasm/fs-generic/fs_wasm.js";
    const wasmUrl = "/wasm/fs-generic/fs_wasm_bg.wasm";
    const jsText = await fetch(jsUrl, { signal: AbortSignal.timeout(10_000) }).then((r) => {
      if (!r.ok) throw new Error(`generic wasm glue ${r.status}`);
      return r.text();
    });
    const blobUrl = URL.createObjectURL(new Blob([jsText], { type: "text/javascript" }));
    try {
      const mod = (await import(/* webpackIgnore: true */ blobUrl)) as {
        default: (module_or_path?: unknown) => Promise<unknown>;
        ga_motor_orbit?: GaFn;
        heat_frames?: HeatFn;
        wave2d_frames?: WaveFn;
        fluid_frames?: FluidFn;
        cyclic_symmetry?: CyclicFn;
        laplacian_modes?: ModesFn;
        engine?: () => string;
      };
      await mod.default({ module_or_path: wasmUrl });
      if (typeof mod.ga_motor_orbit !== "function" || typeof mod.heat_frames !== "function") {
        throw new Error("fs-wasm motor/heat exports missing");
      }
      gaFn = mod.ga_motor_orbit;
      heatFn = mod.heat_frames;
      waveFn = typeof mod.wave2d_frames === "function" ? mod.wave2d_frames : null;
      fluidFn = typeof mod.fluid_frames === "function" ? mod.fluid_frames : null;
      cyclicFn = typeof mod.cyclic_symmetry === "function" ? mod.cyclic_symmetry : null;
      modesFn = typeof mod.laplacian_modes === "function" ? mod.laplacian_modes : null;
      source = "wasm";
    } finally {
      URL.revokeObjectURL(blobUrl);
    }
  } catch {
    gaFn = null;
    heatFn = null;
    waveFn = null;
    fluidFn = null;
    cyclicFn = null;
    modesFn = null;
    source = "ts-fallback";
  }
  return source;
}

/** PGA screw motor orbit. Layout: [nPoints, steps, then steps*nPoints*3 xyz]. */
export function gaMotorOrbit(nPoints: number, steps: number): Float64Array {
  const n = Math.max(3, Math.min(200, Math.floor(nPoints)));
  const s = Math.max(1, Math.min(240, Math.floor(steps)));
  const key = `${n}:${s}`;
  const cached = orbitCache.get(key);
  if (cached) return cached;
  let out: Float64Array;
  if (gaFn) {
    const raw = gaFn(n, s);
    out = raw instanceof Float64Array ? raw : Float64Array.from(raw);
  } else {
    out = gaMotorOrbitFallback(n, s);
  }
  orbitCache.set(key, out);
  return out;
}

/** Explicit 5-pt heat diffusion. Layout: frames * n * n, row-major. */
export function heatFrames(n: number, frames: number, stepsPerFrame = 2): Float64Array {
  const nn = Math.max(3, Math.min(96, Math.floor(n)));
  const f = Math.max(1, Math.min(240, Math.floor(frames)));
  const spf = Math.max(1, Math.min(40, Math.floor(stepsPerFrame)));
  const key = `${nn}:${f}:${spf}`;
  const cached = heatCache.get(key);
  if (cached) return cached;
  let out: Float64Array;
  if (heatFn) {
    const raw = heatFn(nn, f, spf);
    out = raw instanceof Float64Array ? raw : Float64Array.from(raw);
  } else {
    out = heatFramesFallback(nn, f, spf);
  }
  heatCache.set(key, out);
  return out;
}

/** 2-D wave snapshots. Layout: frames * n * n. */
export function wave2dFrames(n: number, frames: number, stepsPerFrame = 2): Float64Array {
  const nn = Math.max(8, Math.min(128, Math.floor(n)));
  const f = Math.max(1, Math.min(180, Math.floor(frames)));
  const spf = Math.max(1, Math.min(8, Math.floor(stepsPerFrame)));
  const key = `${nn}:${f}:${spf}`;
  const cached = waveCache.get(key);
  if (cached) return cached;
  let out: Float64Array;
  if (waveFn) {
    const raw = waveFn(nn, f, spf);
    out = raw instanceof Float64Array ? raw : Float64Array.from(raw);
  } else {
    out = wave2dFramesFallback(nn, f, spf);
  }
  waveCache.set(key, out);
  return out;
}

/** Stable-fluids density snapshots. Layout: frames * n * n. */
export function fluidFrames(n: number, frames: number): Float64Array {
  const nn = Math.max(16, Math.min(96, Math.floor(n)));
  const f = Math.max(1, Math.min(200, Math.floor(frames)));
  const key = `${nn}:${f}`;
  const cached = fluidCache.get(key);
  if (cached) return cached;
  let out: Float64Array;
  if (fluidFn) {
    const raw = fluidFn(nn, f);
    out = raw instanceof Float64Array ? raw : Float64Array.from(raw);
  } else {
    out = fluidFramesFallback(nn, f);
  }
  fluidCache.set(key, out);
  return out;
}

export function gaMotorFrameIndex(timeSec: number, omegaRadPerS: number, steps: number): number {
  const s = Math.max(1, Math.floor(steps));
  const turns = (Math.max(0, timeSec) * Math.max(0, omegaRadPerS)) / (Math.PI * 2);
  return Math.floor((((turns * s) % s) + s) % s);
}

export function sampleHeatAt(
  frames: Float64Array,
  n: number,
  frameCount: number,
  frame: number,
  u: number,
  v: number,
): number {
  const nn = Math.max(1, Math.floor(n));
  const fc = Math.max(1, Math.floor(frameCount));
  const f = ((Math.floor(frame) % fc) + fc) % fc;
  const x = Math.max(0, Math.min(nn - 1, Math.floor(u * nn)));
  const y = Math.max(0, Math.min(nn - 1, Math.floor(v * nn)));
  const idx = f * nn * nn + y * nn + x;
  return frames[idx] ?? 0;
}

export function sampleFluidAt(
  frames: Float64Array,
  n: number,
  frameCount: number,
  frame: number,
  u: number,
  v: number,
): number {
  return sampleHeatAt(frames, n, frameCount, frame, u, v);
}

/** Cyclic ring stencil. Layout: [n, first_row n, rhs n, sol n, harmonics n]. */
export function cyclicSymmetry(n: number, stiffness: number): Float64Array {
  const nn = Math.max(4, Math.min(64, Math.floor(n)));
  const kappa = Math.max(0.05, Math.min(4, stiffness));
  const key = `${nn}:${kappa.toFixed(4)}`;
  const cached = cyclicCache.get(key);
  if (cached) return cached;
  let out: Float64Array;
  if (cyclicFn) {
    const raw = cyclicFn(nn, kappa);
    out = raw instanceof Float64Array ? raw : Float64Array.from(raw);
  } else {
    out = cyclicSymmetryFallback(nn, kappa);
  }
  cyclicCache.set(key, out);
  return out;
}

export function cyclicSol(ring: Float64Array, index: number): number {
  const n = Math.max(1, Math.floor(ring[0] ?? 1));
  const i = ((Math.floor(index) % n) + n) % n;
  return ring[1 + 2 * n + i] ?? 0;
}

export function cyclicHarmonic(ring: Float64Array, k: number): number {
  const n = Math.max(1, Math.floor(ring[0] ?? 1));
  const i = ((Math.floor(k) % n) + n) % n;
  return ring[1 + 3 * n + i] ?? 0;
}

/**
 * 1-D Dirichlet Laplacian modes. Layout: k eigenvalues, then k blocks of n
 * eigenvector samples (fs-la jacobi_eigh / host sine modes).
 */
export function laplacianModes(n: number, k: number): Float64Array {
  const nn = Math.max(4, Math.min(80, Math.floor(n)));
  const kk = Math.max(1, Math.min(Math.min(8, nn), Math.floor(k)));
  const key = `${nn}:${kk}`;
  const cached = modesCache.get(key);
  if (cached) return cached;
  let out: Float64Array;
  if (modesFn) {
    const raw = modesFn(nn, kk);
    out = raw instanceof Float64Array ? raw : Float64Array.from(raw);
  } else {
    out = laplacianModesFallback(nn, kk);
  }
  modesCache.set(key, out);
  return out;
}

export function laplacianModeShape(
  modes: Float64Array,
  n: number,
  k: number,
  mode: number,
  node: number,
): number {
  const nn = Math.max(1, Math.floor(n));
  const kk = Math.max(1, Math.floor(k));
  const m = ((Math.floor(mode) % kk) + kk) % kk;
  const i = ((Math.floor(node) % nn) + nn) % nn;
  return modes[kk + m * nn + i] ?? 0;
}

/** Wright left/right bay tension from a 6-bay cyclic truss under a tip load. */
export function wrightBayTensions(
  liftNewtons: number,
  wingWarpDeg: number,
): {
  leftBayTension: number;
  rightBayTension: number;
} {
  const n = 6;
  const kappa = 0.35 + Math.min(3.5, Math.abs(wingWarpDeg) / 12);
  const ring = cyclicSymmetry(n, kappa);
  const loaded = cyclicSol(ring, 0);
  const opposite = cyclicSol(ring, n / 2);
  const peak = Math.max(1e-9, Math.abs(loaded), Math.abs(opposite));
  const mean = Math.max(0, liftNewtons / 2200);
  const split = ((loaded - opposite) / peak) * 0.85;
  const signed = wingWarpDeg >= 0 ? split : -split;
  return {
    leftBayTension: Number(Math.max(0, mean + signed).toFixed(4)),
    rightBayTension: Number(Math.max(0, mean - signed).toFixed(4)),
  };
}

/** Pelton nozzle jet density from the Stam-style fluid tape. Shared by 2D/3D/schematic. */
export function peltonJetCrate(headMeters: number): { jetCrateDensity: number } {
  const fluid = fluidFrames(16, 8);
  const frame = Math.abs(Math.floor(headMeters / 80)) % 8;
  return {
    jetCrateDensity: Number(sampleFluidAt(fluid, 16, 8, frame, 0.25, 0.95).toFixed(4)),
  };
}

/** Parsons steam density at mid-stage. Shared by 2D/3D. */
export function parsonsSteamCrate(rotorRpm: number): { steamCrateDensity: number } {
  const fluid = fluidFrames(16, 8);
  const frame = Math.abs(Math.floor(rotorRpm / 400)) % 8;
  return {
    steamCrateDensity: Number(sampleFluidAt(fluid, 16, 8, frame, 0.35, 0.5).toFixed(4)),
  };
}

/** Edison filament heat sample. Shared by 2D/3D/schematic. */
export function edisonHeatCrate(voltage: number): { filamentHeatSample: number } {
  const heat = heatFrames(12, 16, 2);
  const u = Math.max(0, Math.min(1, voltage / 130));
  return {
    filamentHeatSample: Number(sampleHeatAt(heat, 12, 16, 8, u, 0.3).toFixed(4)),
  };
}

/** Marconi spark-field RMS. Shared by 2D/3D. */
export function marconiWaveCrate(freqMhz: number): { sparkWaveRms: number } {
  const wave = wave2dFrames(16, 16, 2);
  const frame = Math.abs(Math.floor(freqMhz * 8)) % 16;
  return {
    sparkWaveRms: Number(waveFrameRms(wave, 16, 16, frame).toFixed(4)),
  };
}

/** Bell acoustic-ring RMS. Shared by 2D/3D. */
export function bellWaveCrate(freqHz: number): { acousticWaveRms: number } {
  const wave = wave2dFrames(16, 16, 2);
  const frame = Math.abs(Math.floor(freqHz / 27.5)) % 16;
  return {
    acousticWaveRms: Number(waveFrameRms(wave, 16, 16, frame).toFixed(4)),
  };
}

/** De Laval cream/skim lane densities. Shared by 2D/3D. */
export function delavalCreamCrate(bowlRpm: number): {
  creamCrateDensity: number;
  skimCrateDensity: number;
} {
  const fluid = fluidFrames(16, 8);
  const frame = Math.abs(Math.floor(bowlRpm / 800)) % 8;
  return {
    creamCrateDensity: Number(sampleFluidAt(fluid, 16, 8, frame, 0.3, 0.45).toFixed(4)),
    skimCrateDensity: Number(sampleFluidAt(fluid, 16, 8, frame, 0.75, 0.45).toFixed(4)),
  };
}

/** Gatling barrel-cluster stiffness. Shared by the crate and bolt flex. */
export function gatlingClusterKappa(crankRpm: number) {
  return Number((0.5 + crankRpm / 80).toFixed(4));
}

/** Peak-normalized cyclic solution at one ring seat. Shared by 3D flex. */
export function cyclicFlex(n: number, kappa: number, index: number) {
  const nn = Math.max(4, Math.floor(n));
  const ring = cyclicSymmetry(nn, kappa);
  let peak = 1e-9;
  for (let i = 0; i < nn; i++) peak = Math.max(peak, Math.abs(cyclicSol(ring, i)));
  return Number((cyclicSol(ring, index) / peak).toFixed(4));
}

/** Gatling barrel-cluster first harmonic. Shared by 2D/3D/HUD. */
export function gatlingClusterCrate(
  barrels: number,
  crankRpm: number,
): { clusterHarmonicH1: number; clusterKappa: number } {
  const kappa = gatlingClusterKappa(crankRpm);
  const ring = cyclicSymmetry(Math.max(4, barrels), kappa);
  return {
    clusterHarmonicH1: Number(cyclicHarmonic(ring, 1).toFixed(4)),
    clusterKappa: kappa,
  };
}

/** Gramme ring stiffness. Shared by the crate and flux flex. */
export function grammeRingKappa(shaftRate: number) {
  return Number((0.4 + shaftRate).toFixed(4));
}

/** Gramme 36-junction ring first harmonic. Shared by 2D/3D/HUD. */
export function grammeRingCrate(
  junctions: number,
  shaftRate: number,
): { ringHarmonicH1: number; ringKappa: number } {
  const kappa = grammeRingKappa(shaftRate);
  const ring = cyclicSymmetry(Math.max(4, junctions), kappa);
  return {
    ringHarmonicH1: Number(cyclicHarmonic(ring, 1).toFixed(4)),
    ringKappa: kappa,
  };
}

function rateKappa(base: number, rate: number, coupling: number) {
  return Number((base + Math.abs(rate) * coupling).toFixed(4));
}

function cyclicStudioFlex(n: number, kappa: number, amp: number, index = 0) {
  return Number((1 + amp * cyclicFlex(n, kappa, index)).toFixed(4));
}

/** Eastman n=8 sprocket analogue. Shared by 3D. */
export function eastmanSprocketCrate(filmAdvanceSpeedRadPerS: number): {
  sprocketKappa: number;
  sprocketFlex: number;
} {
  const sprocketKappa = rateKappa(0.4, filmAdvanceSpeedRadPerS, 0.05);
  return { sprocketKappa, sprocketFlex: cyclicStudioFlex(8, sprocketKappa, 0.12) };
}

/** Glidden n=6 flyer/reel twist. Shared by 3D. */
export function gliddenFlyerCrate(flyerOmegaRadPerS: number): {
  flyerKappa: number;
  flyerFlex: number;
} {
  const flyerKappa = rateKappa(0.4, flyerOmegaRadPerS, 0.03);
  return { flyerKappa, flyerFlex: cyclicStudioFlex(6, flyerKappa, 0.12) };
}

/** Reno n=8 cleat-loop sheave. Shared by 3D. */
export function renoSheaveCrate(sheaveOmegaRadPerS: number): {
  sheaveKappa: number;
  sheaveFlex: number;
} {
  const sheaveKappa = rateKappa(0.4, sheaveOmegaRadPerS, 0.05);
  return { sheaveKappa, sheaveFlex: cyclicStudioFlex(8, sheaveKappa, 0.12) };
}

/** McCormick n=6 reel-bat ring. Shared by 3D. */
export function mccormickReelCrate(reelRadPerSec: number): {
  reelKappa: number;
  reelFlex: number;
} {
  const reelKappa = rateKappa(0.4, reelRadPerSec, 0.05);
  return { reelKappa, reelFlex: cyclicStudioFlex(6, reelKappa, 0.18) };
}

/** Howe n=6 needle/shuttle coupling. Shared by 3D. */
export function howeShaftCrate(shaftRate: number): { shaftKappa: number; shaftFlex: number } {
  const shaftKappa = rateKappa(0.35, shaftRate, 0.04);
  return { shaftKappa, shaftFlex: cyclicStudioFlex(6, shaftKappa, 0.12) };
}

/** Six-bar lockstitch analogue of the needle/shuttle coupling. Shared by 3D. */
export function howeCyclicFlex(shaftRate: number) {
  return howeShaftCrate(shaftRate).shaftFlex;
}

/** Otis n=6 crown-sheave analogue. Shared by 3D. */
export function otisSheaveCrate(): { sheaveKappa: number; sheaveFlex: number } {
  const sheaveKappa = 0.4;
  return { sheaveKappa, sheaveFlex: cyclicStudioFlex(6, sheaveKappa, 0.15) };
}

/** Engelbart n=4 orthogonal-wheel analogue. Shared by 3D. */
export function engelbartXyCrate(): { xyKappa: number; flexX: number; flexY: number } {
  const xyKappa = 0.4;
  return {
    xyKappa,
    flexX: cyclicStudioFlex(4, xyKappa, 0.2, 0),
    flexY: cyclicStudioFlex(4, xyKappa, 0.2, 1),
  };
}

/** Sholes type-basket strike. Shared by 3D. */
export function sholesBasketCrate(
  typeBarCount: number,
  displayTypebarIndex: number,
): { basketKappa: number; strikeFlex: number } {
  const basketKappa = 0.35;
  return {
    basketKappa,
    strikeFlex: cyclicStudioFlex(Math.max(4, typeBarCount), basketKappa, 0.2, displayTypebarIndex),
  };
}

/** Hollerith dial-bank press. Shared by 3D. */
export function hollerithBankCrate(dialCount: number): { bankKappa: number; pressFlex: number } {
  const bankKappa = 0.35;
  return {
    bankKappa,
    pressFlex: cyclicStudioFlex(Math.max(4, dialCount), bankKappa, 0.12),
  };
}

/** Mergenthaler n=8 magazine ring. Shared by 3D. */
export function mergenthalerMagCrate(): { magKappa: number; magFlex: number } {
  const magKappa = 0.4;
  return { magKappa, magFlex: cyclicStudioFlex(8, magKappa, 0.15) };
}

/** Corliss n=4 rotary-valve ring. Shared by 3D. */
export function corlissValveCrate(crankAngleRad: number): {
  valveKappa: number;
  exhaustHarmonic: number;
} {
  const valveKappa = 2;
  const index = Math.abs(Math.floor(crankAngleRad * 2)) % 4;
  const ring = cyclicSymmetry(4, valveKappa);
  return {
    valveKappa,
    exhaustHarmonic: Number((0.05 * cyclicSol(ring, index)).toFixed(4)),
  };
}

function heatSampleU(u: number, v = 0.45): number {
  const heat = heatFrames(12, 16, 2);
  return Number(sampleHeatAt(heat, 12, 16, 8, Math.max(0, Math.min(1, u)), v).toFixed(4));
}

function waveRmsHint(hint: number): number {
  const wave = wave2dFrames(16, 16, 2);
  return Number(waveFrameRms(wave, 16, 16, Math.abs(Math.floor(hint)) % 16).toFixed(4));
}

function fluidDens(u: number, v: number, hint: number): number {
  const fluid = fluidFrames(16, 8);
  const frame = Math.abs(Math.floor(hint)) % 8;
  return Number(sampleFluidAt(fluid, 16, 8, frame, u, v).toFixed(4));
}

export function cycleHeatCrate(ratio: number): { cycleHeatSample: number } {
  return { cycleHeatSample: heatSampleU(ratio / 20, 0.45) };
}

export function jacketHeatCrate(tempC: number): { jacketHeatSample: number } {
  return { jacketHeatSample: heatSampleU(tempC / 400, 0.4) };
}

export function wortHeatCrate(tempC: number): { wortHeatSample: number } {
  return { wortHeatSample: heatSampleU((tempC + 10) / 80, 0.5) };
}

export function chainHeatCrate(tempC: number): { chainHeatSample: number } {
  return { chainHeatSample: heatSampleU(tempC / 180, 0.35) };
}

export function liftHeatCrate(volumeM3: number): { liftHeatSample: number } {
  return { liftHeatSample: heatSampleU(volumeM3 / 15000, 0.3) };
}

export function shockWaveCrate(ngPct: number): { shockWaveRms: number } {
  return { shockWaveRms: waveRmsHint(ngPct / 5) };
}

export function lineWaveCrate(currentMa: number): { lineWaveRms: number } {
  return { lineWaveRms: waveRmsHint(currentMa / 4) };
}

export function grooveWaveCrate(rpm: number): { grooveWaveRms: number } {
  return { grooveWaveRms: waveRmsHint(rpm / 4) };
}

export function lintFluidCrate(rpm: number): { lintCrateDensity: number } {
  return { lintCrateDensity: fluidDens(0.4, 0.4, rpm / 30) };
}

export function wakeFluidCrate(rpm: number): { wakeCrateDensity: number } {
  return { wakeCrateDensity: fluidDens(0.55, 0.4, rpm / 20) };
}

export function meltFluidCrate(tempC: number): { meltCrateDensity: number } {
  return { meltCrateDensity: fluidDens(0.5, 0.4, tempC / 12) };
}

export function bellowsFluidCrate(inflationPct: number): { bellowsCrateDensity: number } {
  return { bellowsCrateDensity: fluidDens(0.25, 0.8, inflationPct / 12) };
}

export function waveFrameRms(
  frames: Float64Array,
  n: number,
  frameCount: number,
  frame: number,
): number {
  const nn = Math.max(1, Math.floor(n));
  const fc = Math.max(1, Math.floor(frameCount));
  const f = ((Math.floor(frame) % fc) + fc) % fc;
  const base = f * nn * nn;
  let acc = 0;
  const m = nn * nn;
  for (let i = 0; i < m; i++) {
    const v = frames[base + i] ?? 0;
    acc += v * v;
  }
  return Math.sqrt(acc / Math.max(1, m));
}

function gaMotorOrbitFallback(nPoints: number, steps: number): Float64Array {
  const twoPi = Math.PI * 2;
  const seedR = 0.35;
  const offset = 1.0;
  const dtheta = twoPi / 60;
  const dz = 0.06;
  const out = new Float64Array(2 + steps * nPoints * 3);
  out[0] = nPoints;
  out[1] = steps;
  let cursor = 2;
  let theta = 0;
  let zOff = 0;
  for (let s = 0; s < steps; s++) {
    const c = Math.cos(theta);
    const sn = Math.sin(theta);
    for (let i = 0; i < nPoints; i++) {
      const a = (twoPi * i) / nPoints;
      const sx = offset + seedR * Math.cos(a);
      const sy = 0;
      const sz = seedR * Math.sin(a);
      out[cursor] = c * sx - sn * sy;
      out[cursor + 1] = sn * sx + c * sy;
      out[cursor + 2] = sz + zOff;
      cursor += 3;
    }
    theta += dtheta;
    zOff += dz;
  }
  return out;
}

function heatFramesFallback(n: number, frames: number, spf: number): Float64Array {
  const m = n * n;
  const u = new Float64Array(m);
  const au = new Float64Array(m);
  const h = 1 / (n + 1);
  const gauss = (x: number, y: number, cx: number, cy: number, s: number) =>
    Math.exp(-((x - cx) ** 2 + (y - cy) ** 2) / (2 * s * s));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const x = (i + 1) * h;
      const y = (j + 1) * h;
      u[i * n + j] = gauss(x, y, 0.3, 0.3, 0.07) - gauss(x, y, 0.7, 0.68, 0.08);
    }
  }
  const dt = 0.2;
  const out = new Float64Array(frames * m);
  for (let f = 0; f < frames; f++) {
    out.set(u, f * m);
    for (let s = 0; s < spf; s++) {
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          const idx = i * n + j;
          const c = u[idx] ?? 0;
          const up = i > 0 ? (u[(i - 1) * n + j] ?? 0) : c;
          const dn = i + 1 < n ? (u[(i + 1) * n + j] ?? 0) : c;
          const lf = j > 0 ? (u[i * n + (j - 1)] ?? 0) : c;
          const rt = j + 1 < n ? (u[i * n + (j + 1)] ?? 0) : c;
          au[idx] = 4 * c - up - dn - lf - rt;
        }
      }
      for (let i = 0; i < m; i++) {
        u[i] -= dt * (au[i] ?? 0);
      }
    }
  }
  return out;
}

function wave2dFramesFallback(n: number, frames: number, spf: number): Float64Array {
  const m = n * n;
  const uPrev = new Float64Array(m);
  const uCur = new Float64Array(m);
  const twoPi = Math.PI * 2;
  const sigma = 0.55;
  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n; col++) {
      const x = (twoPi * col) / n - Math.PI;
      const y = (twoPi * row) / n - Math.PI;
      const v = Math.exp(-(x * x + y * y) / (2 * sigma * sigma));
      const idx = row * n + col;
      uPrev[idx] = v;
      uCur[idx] = v;
    }
  }
  const dt = 0.08;
  const out = new Float64Array(frames * m);
  const lap = new Float64Array(m);
  for (let f = 0; f < frames; f++) {
    out.set(uCur, f * m);
    for (let s = 0; s < spf; s++) {
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          const idx = i * n + j;
          const c = uCur[idx] ?? 0;
          const up = i > 0 ? (uCur[(i - 1) * n + j] ?? 0) : c;
          const dn = i + 1 < n ? (uCur[(i + 1) * n + j] ?? 0) : c;
          const lf = j > 0 ? (uCur[i * n + (j - 1)] ?? 0) : c;
          const rt = j + 1 < n ? (uCur[i * n + (j + 1)] ?? 0) : c;
          lap[idx] = up + dn + lf + rt - 4 * c;
        }
      }
      for (let i = 0; i < m; i++) {
        const next = 2 * (uCur[i] ?? 0) - (uPrev[i] ?? 0) + dt * dt * (lap[i] ?? 0);
        uPrev[i] = uCur[i] ?? 0;
        uCur[i] = next;
      }
    }
  }
  return out;
}

function cyclicSymmetryFallback(n: number, kappa: number): Float64Array {
  const twoPi = Math.PI * 2;
  const first = new Float64Array(n);
  first[0] = 2 + kappa;
  first[1] = -1;
  first[n - 1] = -1;
  const rhs = new Float64Array(n);
  rhs[0] = 1;
  const sol = new Float64Array(n);
  const harmonics = new Float64Array(n);
  const hatC = new Float64Array(n);
  for (let k = 0; k < n; k++) {
    hatC[k] = 2 + kappa - 2 * Math.cos((twoPi * k) / n);
  }
  for (let j = 0; j < n; j++) {
    let v = 0;
    for (let k = 0; k < n; k++) {
      const denom = hatC[k] === 0 ? 1e-9 : (hatC[k] ?? 1e-9);
      v += Math.cos((twoPi * k * j) / n) / denom;
    }
    sol[j] = v / n;
  }
  for (let k = 0; k < n; k++) {
    let re = 0;
    let im = 0;
    for (let j = 0; j < n; j++) {
      const xj = sol[j] ?? 0;
      const ang = (twoPi * k * j) / n;
      re += xj * Math.cos(ang);
      im -= xj * Math.sin(ang);
    }
    harmonics[k] = Math.hypot(re, im) / n;
  }
  const out = new Float64Array(1 + 4 * n);
  out[0] = n;
  out.set(first, 1);
  out.set(rhs, 1 + n);
  out.set(sol, 1 + 2 * n);
  out.set(harmonics, 1 + 3 * n);
  return out;
}

function laplacianModesFallback(n: number, k: number): Float64Array {
  const out = new Float64Array(k + k * n);
  const norm = Math.sqrt(2 / (n + 1));
  for (let m = 0; m < k; m++) {
    const mode = m + 1;
    out[m] = 2 - 2 * Math.cos((Math.PI * mode) / (n + 1));
    for (let i = 0; i < n; i++) {
      out[k + m * n + i] = norm * Math.sin((Math.PI * mode * (i + 1)) / (n + 1));
    }
  }
  return out;
}

function fluidIdx(n: number, i: number, j: number): number {
  const ii = Math.max(0, Math.min(n - 1, i));
  const jj = Math.max(0, Math.min(n - 1, j));
  return jj * n + ii;
}

function fluidSample(field: Float64Array, n: number, x: number, y: number): number {
  const x0 = Math.max(0, Math.min(n - 1.001, x));
  const y0 = Math.max(0, Math.min(n - 1.001, y));
  const i = Math.floor(x0);
  const j = Math.floor(y0);
  const fx = x0 - i;
  const fy = y0 - j;
  const a = field[fluidIdx(n, i, j)] ?? 0;
  const b = field[fluidIdx(n, i + 1, j)] ?? 0;
  const c = field[fluidIdx(n, i, j + 1)] ?? 0;
  const d = field[fluidIdx(n, i + 1, j + 1)] ?? 0;
  return a * (1 - fx) * (1 - fy) + b * fx * (1 - fy) + c * (1 - fx) * fy + d * fx * fy;
}

function fluidFramesFallback(n: number, frames: number): Float64Array {
  const m = n * n;
  const vx = new Float64Array(m);
  const vy = new Float64Array(m);
  const dens = new Float64Array(m);
  const p = new Float64Array(m);
  const div = new Float64Array(m);
  const tmp = new Float64Array(m);
  const out = new Float64Array(frames * m);
  const dt = 1;
  const buoyancy = 0.12;
  const vmax = n / 4;
  const srcI = Math.floor(n * 0.25);
  const srcJ = n - 2;
  for (let frame = 0; frame < frames; frame++) {
    dens[fluidIdx(n, srcI, srcJ)] = Math.min(1, (dens[fluidIdx(n, srcI, srcJ)] ?? 0) + 0.8);
    vy[fluidIdx(n, srcI, srcJ)] += 0.35;
    for (let k = 0; k < m; k++) {
      vy[k] += dt * buoyancy * (dens[k] ?? 0);
    }
    tmp.set(dens);
    for (let j = 0; j < n; j++) {
      for (let i = 0; i < n; i++) {
        const k = j * n + i;
        const x = i - dt * (vx[k] ?? 0);
        const y = j - dt * (vy[k] ?? 0);
        dens[k] = fluidSample(tmp, n, x, y);
      }
    }
    for (let j = 0; j < n; j++) {
      for (let i = 0; i < n; i++) {
        const ip = Math.min(n - 1, i + 1);
        const im = Math.max(0, i - 1);
        const jp = Math.min(n - 1, j + 1);
        const jm = Math.max(0, j - 1);
        div[j * n + i] =
          0.5 *
          ((vx[j * n + ip] ?? 0) -
            (vx[j * n + im] ?? 0) +
            (vy[jp * n + i] ?? 0) -
            (vy[jm * n + i] ?? 0));
      }
    }
    p.fill(0);
    for (let it = 0; it < 8; it++) {
      tmp.set(p);
      for (let j = 1; j < n - 1; j++) {
        for (let i = 1; i < n - 1; i++) {
          p[j * n + i] =
            0.25 *
            ((tmp[j * n + (i + 1)] ?? 0) +
              (tmp[j * n + (i - 1)] ?? 0) +
              (tmp[(j + 1) * n + i] ?? 0) +
              (tmp[(j - 1) * n + i] ?? 0) -
              (div[j * n + i] ?? 0));
        }
      }
    }
    for (let j = 1; j < n - 1; j++) {
      for (let i = 1; i < n - 1; i++) {
        const k = j * n + i;
        vx[k] -= 0.5 * ((p[j * n + (i + 1)] ?? 0) - (p[j * n + (i - 1)] ?? 0));
        vy[k] -= 0.5 * ((p[(j + 1) * n + i] ?? 0) - (p[(j - 1) * n + i] ?? 0));
      }
    }
    for (let k = 0; k < m; k++) {
      vx[k] = Math.max(-vmax, Math.min(vmax, (vx[k] ?? 0) * 0.999));
      vy[k] = Math.max(-vmax, Math.min(vmax, (vy[k] ?? 0) * 0.999));
      dens[k] = Math.max(0, Math.min(1, (dens[k] ?? 0) * 0.994));
    }
    out.set(dens, frame * m);
  }
  return out;
}
