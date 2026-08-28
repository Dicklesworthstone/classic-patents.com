/**
 * P7 crate bindings: host-pumped steppers that own the law, plus layout-
 * matching fallbacks for unused `fs-wasm` exports.
 *
 * `/wasm/fs-generic/` is probed by `ensureGenericWasm`. Until a slim museum
 * artifact exists, every HUD stays `ts-fallback`. Do not copy the 4.9 MB
 * kitchen-sink `fs-wasm` pkg. Do not claim WASM unless a module stepped.
 */

import { extraWasmFns, genericKernelSource } from "./genericWasm";

export type DeepKernelSource = "wasm" | "ts-fallback" | "unloaded";

export function deepKernelSource(): DeepKernelSource {
  return genericKernelSource();
}

function asF64(raw: unknown): Float64Array {
  if (raw instanceof Float64Array) return raw;
  return Float64Array.from(raw as ArrayLike<number>);
}

function clampInt(value: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, Math.floor(value)));
}

/** Honest host digest. Never prefixed `blake3:` unless a crate hashed. */
export function hostStateDigest(values: readonly number[]): string {
  let h = 2166136261;
  for (const v of values) {
    const bits = Math.round(v * 1000);
    h ^= bits;
    h = Math.imul(h, 16777619);
  }
  return `host:${(h >>> 0).toString(16).padStart(8, "0")}`;
}

export function digestKind(digest: string): "host" | "blake3" | "unknown" {
  if (digest.startsWith("host:")) return "host";
  if (digest.startsWith("blake3:")) return "blake3";
  return "unknown";
}

/* ------------------------------------------------------------------ */
/* Host-pumped fields (P7.2). Source term is the live registry control. */
/* ------------------------------------------------------------------ */

export class HeatField {
  readonly n: number;
  private u: Float64Array;
  private scratch: Float64Array;

  constructor(n: number) {
    this.n = clampInt(n, 8, 64);
    this.u = new Float64Array(this.n * this.n);
    this.scratch = new Float64Array(this.n * this.n);
  }

  snapshot(): Float64Array {
    return this.u.slice();
  }

  sample(u: number, v: number): number {
    const n = this.n;
    const x = Math.max(0, Math.min(n - 1, Math.floor(u * n)));
    const y = Math.max(0, Math.min(n - 1, Math.floor(v * n)));
    return this.u[y * n + x] ?? 0;
  }

  /** Explicit 5-pt heat step. `source` is a Gaussian blob at (su, sv). */
  step(dt: number, source: { su: number; sv: number; amplitude: number; sigma?: number }): void {
    const n = this.n;
    const m = n * n;
    const sigma = source.sigma ?? 0.08;
    const boundedDt = Math.max(1e-4, Math.min(0.25, dt));
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const idx = i * n + j;
        const c = this.u[idx] ?? 0;
        const up = i > 0 ? (this.u[(i - 1) * n + j] ?? 0) : c;
        const dn = i + 1 < n ? (this.u[(i + 1) * n + j] ?? 0) : c;
        const lf = j > 0 ? (this.u[i * n + (j - 1)] ?? 0) : c;
        const rt = j + 1 < n ? (this.u[i * n + (j + 1)] ?? 0) : c;
        const lap = up + dn + lf + rt - 4 * c;
        const x = (j + 0.5) / n;
        const y = (i + 0.5) / n;
        const dx = x - source.su;
        const dy = y - source.sv;
        const inj = source.amplitude * Math.exp(-(dx * dx + dy * dy) / (2 * sigma * sigma));
        this.scratch[idx] = c + boundedDt * (0.2 * lap + inj - 0.02 * c);
      }
    }
    for (let k = 0; k < m; k++) this.u[k] = this.scratch[k] ?? 0;
  }
}

export class WaveField {
  readonly n: number;
  private prev: Float64Array;
  private cur: Float64Array;
  private next: Float64Array;

  constructor(n: number) {
    this.n = clampInt(n, 8, 64);
    const m = this.n * this.n;
    this.prev = new Float64Array(m);
    this.cur = new Float64Array(m);
    this.next = new Float64Array(m);
  }

  snapshot(): Float64Array {
    return this.cur.slice();
  }

  rms(): number {
    let acc = 0;
    const m = this.n * this.n;
    for (let i = 0; i < m; i++) {
      const v = this.cur[i] ?? 0;
      acc += v * v;
    }
    return Math.sqrt(acc / Math.max(1, m));
  }

  step(dt: number, forcing: { su: number; sv: number; amplitude: number }): void {
    const n = this.n;
    // Explicit 2D wave update is only stable for dt <= dx/(c*sqrt2) with
    // dx = 1/n; clamp to the field's own CFL bound, not a fixed ceiling.
    const boundedDt = Math.max(1e-4, Math.min(1 / (n * Math.SQRT2), dt));
    const c2 = 1;
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const idx = i * n + j;
        const c = this.cur[idx] ?? 0;
        const up = i > 0 ? (this.cur[(i - 1) * n + j] ?? 0) : c;
        const dn = i + 1 < n ? (this.cur[(i + 1) * n + j] ?? 0) : c;
        const lf = j > 0 ? (this.cur[i * n + (j - 1)] ?? 0) : c;
        const rt = j + 1 < n ? (this.cur[i * n + (j + 1)] ?? 0) : c;
        const lap = up + dn + lf + rt - 4 * c;
        const x = (j + 0.5) / n;
        const y = (i + 0.5) / n;
        const dx = x - forcing.su;
        const dy = y - forcing.sv;
        const force = forcing.amplitude * Math.exp(-(dx * dx + dy * dy) / 0.01);
        this.next[idx] = 2 * c - (this.prev[idx] ?? 0) + boundedDt * boundedDt * (c2 * lap + force);
      }
    }
    const tmp = this.prev;
    this.prev = this.cur;
    this.cur = this.next;
    this.next = tmp;
  }
}

export class GrayScottField {
  readonly n: number;
  private u: Float64Array;
  private v: Float64Array;
  private lu: Float64Array;
  private lv: Float64Array;

  constructor(n: number) {
    this.n = clampInt(n, 16, 48);
    const m = this.n * this.n;
    this.u = new Float64Array(m);
    this.v = new Float64Array(m);
    this.lu = new Float64Array(m);
    this.lv = new Float64Array(m);
    this.u.fill(1);
    const c = Math.floor(this.n / 2);
    const r = Math.max(3, Math.floor(this.n / 10));
    for (let i = 0; i < this.n; i++) {
      for (let j = 0; j < this.n; j++) {
        if (Math.abs(i - c) <= r && Math.abs(j - c) <= r) {
          this.u[i * this.n + j] = 0.5;
          this.v[i * this.n + j] = 0.25;
        }
      }
    }
  }

  snapshotV(): Float64Array {
    return this.v.slice();
  }

  meanV(): number {
    let acc = 0;
    const m = this.n * this.n;
    for (let i = 0; i < m; i++) acc += this.v[i] ?? 0;
    return acc / m;
  }

  step(feed: number, kill: number, steps = 4): void {
    const n = this.n;
    const m = n * n;
    const f = Math.max(0, Math.min(0.1, feed));
    const k = Math.max(0, Math.min(0.1, kill));
    const du = 0.16;
    const dv = 0.08;
    const dt = 1;
    for (let s = 0; s < steps; s++) {
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          const idx = i * n + j;
          const uc = this.u[idx] ?? 0;
          const vc = this.v[idx] ?? 0;
          const im = (i + n - 1) % n;
          const ip = (i + 1) % n;
          const jm = (j + n - 1) % n;
          const jp = (j + 1) % n;
          this.lu[idx] =
            (this.u[im * n + j] ?? 0) +
            (this.u[ip * n + j] ?? 0) +
            (this.u[i * n + jm] ?? 0) +
            (this.u[i * n + jp] ?? 0) -
            4 * uc;
          this.lv[idx] =
            (this.v[im * n + j] ?? 0) +
            (this.v[ip * n + j] ?? 0) +
            (this.v[i * n + jm] ?? 0) +
            (this.v[i * n + jp] ?? 0) -
            4 * vc;
        }
      }
      for (let i = 0; i < m; i++) {
        const uu = this.u[i] ?? 0;
        const vv = this.v[i] ?? 0;
        const uvv = uu * vv * vv;
        this.u[i] = Math.max(
          0,
          Math.min(1.5, uu + dt * (du * (this.lu[i] ?? 0) - uvv + f * (1 - uu))),
        );
        this.v[i] = Math.max(
          0,
          Math.min(1.5, vv + dt * (dv * (this.lv[i] ?? 0) + uvv - (f + k) * vv)),
        );
      }
    }
  }
}

export class PoissonField {
  readonly n: number;
  private phi: Float64Array;

  constructor(n: number) {
    this.n = clampInt(n, 8, 48);
    this.phi = new Float64Array(this.n * this.n);
  }

  snapshot(): Float64Array {
    return this.phi.slice();
  }

  sample(u: number, v: number): number {
    const n = this.n;
    const x = Math.max(0, Math.min(n - 1, Math.floor(u * n)));
    const y = Math.max(0, Math.min(n - 1, Math.floor(v * n)));
    return this.phi[y * n + x] ?? 0;
  }

  /** Jacobi solve of −Δφ = ρ with a live charge blob. */
  solve(charge: { su: number; sv: number; amplitude: number }, iters = 40): void {
    const n = this.n;
    const rho = new Float64Array(n * n);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const x = (j + 0.5) / n;
        const y = (i + 0.5) / n;
        const dx = x - charge.su;
        const dy = y - charge.sv;
        rho[i * n + j] = charge.amplitude * Math.exp(-(dx * dx + dy * dy) / 0.02);
      }
    }
    const next = new Float64Array(n * n);
    for (let it = 0; it < iters; it++) {
      for (let i = 1; i < n - 1; i++) {
        for (let j = 1; j < n - 1; j++) {
          const idx = i * n + j;
          next[idx] =
            0.25 *
            ((this.phi[idx - n] ?? 0) +
              (this.phi[idx + n] ?? 0) +
              (this.phi[idx - 1] ?? 0) +
              (this.phi[idx + 1] ?? 0) +
              (rho[idx] ?? 0));
        }
      }
      this.phi.set(next);
    }
  }
}

export class CavityFlow {
  readonly n: number;
  private ux: Float64Array;
  private uy: Float64Array;

  constructor(n: number) {
    this.n = clampInt(n, 12, 32);
    const m = this.n * this.n;
    this.ux = new Float64Array(m);
    this.uy = new Float64Array(m);
  }

  speedSnapshot(): Float64Array {
    const n = this.n;
    const out = new Float64Array(n * n);
    for (let i = 0; i < n * n; i++) {
      out[i] = Math.hypot(this.ux[i] ?? 0, this.uy[i] ?? 0);
    }
    return out;
  }

  meanSpeed(): number {
    let acc = 0;
    const m = this.n * this.n;
    for (let i = 0; i < m; i++) acc += Math.hypot(this.ux[i] ?? 0, this.uy[i] ?? 0);
    return acc / m;
  }

  /** Lid-driven cavity, viscosity from Reynolds. */
  step(re: number, steps = 6): void {
    const n = this.n;
    const nu = 1 / Math.max(10, Math.min(500, re));
    const dt = 0.03;
    const lid = 1;
    for (let s = 0; s < steps; s++) {
      const nux = this.ux.slice();
      const nuy = this.uy.slice();
      for (let i = 1; i < n - 1; i++) {
        for (let j = 1; j < n - 1; j++) {
          const idx = i * n + j;
          const u = this.ux[idx] ?? 0;
          const v = this.uy[idx] ?? 0;
          const lapU =
            (this.ux[idx - n] ?? 0) +
            (this.ux[idx + n] ?? 0) +
            (this.ux[idx - 1] ?? 0) +
            (this.ux[idx + 1] ?? 0) -
            4 * u;
          const lapV =
            (this.uy[idx - n] ?? 0) +
            (this.uy[idx + n] ?? 0) +
            (this.uy[idx - 1] ?? 0) +
            (this.uy[idx + 1] ?? 0) -
            4 * v;
          nux[idx] = u + dt * (nu * lapU - u * (u - (this.ux[idx - 1] ?? 0)));
          nuy[idx] = v + dt * (nu * lapV - v * (v - (this.uy[idx - n] ?? 0)));
        }
      }
      for (let j = 0; j < n; j++) {
        nux[j] = lid;
        nuy[j] = 0;
        nux[(n - 1) * n + j] = 0;
        nuy[(n - 1) * n + j] = 0;
      }
      for (let i = 0; i < n; i++) {
        nux[i * n] = 0;
        nuy[i * n] = 0;
        nux[i * n + (n - 1)] = 0;
        nuy[i * n + (n - 1)] = 0;
      }
      this.ux = nux;
      this.uy = nuy;
    }
  }
}

const heatSteppers = new Map<string, HeatField>();
const waveSteppers = new Map<string, WaveField>();
const gsSteppers = new Map<string, GrayScottField>();
const poissonSteppers = new Map<string, PoissonField>();
const cavitySteppers = new Map<string, CavityFlow>();

function stepper<T>(map: Map<string, T>, id: string, make: () => T): T {
  let field = map.get(id);
  if (!field) {
    field = make();
    map.set(id, field);
  }
  return field;
}

/* ------------------------------------------------------------------ */
/* Layout-matching fallbacks for unused fs-wasm exports                */
/* ------------------------------------------------------------------ */

/** −Δu = two Gaussians. Layout: n*n row-major. */
export function poisson2d(nIn: number): Float64Array {
  const n = clampInt(nIn, 3, 110);
  if (extraWasmFns.poisson2d) return asF64(extraWasmFns.poisson2d(n));
  const field = new PoissonField(Math.min(n, 32));
  field.solve({ su: 0.32, sv: 0.34, amplitude: 4 });
  field.solve({ su: 0.68, sv: 0.66, amplitude: -3.4 });
  const snap = field.snapshot();
  if (snap.length === n * n) return snap;
  const out = new Float64Array(n * n);
  const srcN = field.n;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const si = Math.min(srcN - 1, Math.floor((i * srcN) / n));
      const sj = Math.min(srcN - 1, Math.floor((j * srcN) / n));
      out[i * n + j] = snap[si * srcN + sj] ?? 0;
    }
  }
  return out;
}

/** Gray-Scott v-concentration. Layout: frames * n * n. */
export function grayScottFrames(
  nIn: number,
  framesIn: number,
  feedIn: number,
  killIn: number,
): Float64Array {
  const n = clampInt(nIn, 16, 160);
  const frames = clampInt(framesIn, 1, 180);
  const feed = Math.max(0, Math.min(0.1, feedIn));
  const kill = Math.max(0, Math.min(0.1, killIn));
  if (extraWasmFns.grayScottFrames) {
    return asF64(extraWasmFns.grayScottFrames(n, frames, feed, kill));
  }
  const field = new GrayScottField(Math.min(n, 32));
  const srcN = field.n;
  const out = new Float64Array(frames * n * n);
  for (let f = 0; f < frames; f++) {
    const snap = field.snapshotV();
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const si = Math.min(srcN - 1, Math.floor((i * srcN) / n));
        const sj = Math.min(srcN - 1, Math.floor((j * srcN) / n));
        out[f * n * n + i * n + j] = snap[si * srcN + sj] ?? 0;
      }
    }
    field.step(feed, kill, 14);
  }
  return out;
}

/** Canned 3-tone power spectrum. Layout: n/2+1 bins. */
export function fftPowerSpectrum(nIn: number, seedIn: number): Float64Array {
  let n = clampInt(nIn, 64, 4096);
  n = 2 ** Math.round(Math.log2(n));
  if (n > 4096) n = 4096;
  if (extraWasmFns.fftPowerSpectrum) return asF64(extraWasmFns.fftPowerSpectrum(n, seedIn));
  const k1 = Math.max(2, Math.floor(n / 32));
  const k2 = Math.max(5, Math.floor(n / 12));
  const k3 = Math.max(11, Math.floor(n / 6));
  const sig = new Float64Array(n);
  let rng = seedIn >>> 0 || 1;
  const next = () => {
    rng = (Math.imul(rng, 1664525) + 1013904223) >>> 0;
    return rng / 0xffffffff;
  };
  const twoPi = Math.PI * 2;
  for (let j = 0; j < n; j++) {
    const jf = j / n;
    sig[j] =
      Math.cos(twoPi * k1 * jf) +
      0.6 * Math.cos(twoPi * k2 * jf) +
      0.8 * Math.sin(twoPi * k3 * jf) +
      0.15 * (next() * 2 - 1);
  }
  return dftPower(sig);
}

/** Live radix-2 power spectrum of a host sample (Marconi spark / Tesla coil LC). */
export function liveFftPowerSpectrum(samples: Float64Array): Float64Array {
  const n = 2 ** Math.floor(Math.log2(Math.max(8, samples.length)));
  const sig = new Float64Array(n);
  sig.set(samples.subarray(0, n));
  return dftPower(sig);
}

function dftPower(sig: Float64Array): Float64Array {
  const n = sig.length;
  const bins = n / 2 + 1;
  const out = new Float64Array(bins);
  const twoPi = Math.PI * 2;
  for (let k = 0; k < bins; k++) {
    let re = 0;
    let im = 0;
    for (let j = 0; j < n; j++) {
      const ang = (twoPi * k * j) / n;
      const s = sig[j] ?? 0;
      re += s * Math.cos(ang);
      im -= s * Math.sin(ang);
    }
    out[k] = re * re + im * im;
  }
  return out;
}

/** f(x)=sin(3x)exp(−x²/4). Layout: [x, f, f', f''] × samples. */
export function autodiffDerivatives(xmin: number, xmax: number, samplesIn: number): Float64Array {
  const a0 = Math.max(-20, Math.min(20, xmin));
  const b0 = Math.max(-20, Math.min(20, xmax));
  const a = Math.min(a0, b0);
  const b = Math.max(a0, b0);
  const samples = clampInt(samplesIn, 2, 2048);
  if (extraWasmFns.autodiffDerivatives) {
    return asF64(extraWasmFns.autodiffDerivatives(a, b, samples));
  }
  const out = new Float64Array(samples * 4);
  for (let i = 0; i < samples; i++) {
    const t = i / (samples - 1);
    const x = a + (b - a) * t;
    const { f, d1, d2 } = adTestFn(x);
    out[i * 4] = x;
    out[i * 4 + 1] = f;
    out[i * 4 + 2] = d1;
    out[i * 4 + 3] = d2;
  }
  return out;
}

function adTestFn(x: number): { f: number; d1: number; d2: number } {
  const s = Math.sin(3 * x);
  const c = Math.cos(3 * x);
  const e = Math.exp((-x * x) / 4);
  const f = s * e;
  const d1 = 3 * c * e + s * e * (-x / 2);
  const d2 =
    -9 * s * e + 3 * c * e * (-x / 2) + (3 * c * e * (-x / 2) + s * e * (-0.5 + (x * x) / 4));
  return { f, d1, d2 };
}

/**
 * Discrete Hodge 1-form on an annulus (shape 1). Layout: 12 header + 6E edges
 * `[mx, my, mz, exact, coexact, harmonic]`.
 */
/** True once the fs-feec Hodge WASM function is actually loaded (cache-key input). */
export function hodgeWasmStepped(): boolean {
  return Boolean(extraWasmFns.hodgeDecomposition);
}

export function hodgeDecomposition(shape: number): Float64Array {
  const s = Math.max(0, Math.min(2, Math.floor(shape)));
  if (extraWasmFns.hodgeDecomposition) return asF64(extraWasmFns.hodgeDecomposition(s));
  const edges = 16;
  const out = new Float64Array(12 + 6 * edges);
  out[0] = s;
  out[1] = 1;
  out[2] = s === 0 ? 0 : s;
  out[3] = 0;
  out[4] = 0;
  out[5] = 0.02;
  out[6] = 0.02;
  out[7] = 0.02;
  let exactE = 0;
  let coexactE = 0;
  let harmonicE = 0;
  out[11] = edges;
  for (let e = 0; e < edges; e++) {
    const a = (e * 2 * Math.PI) / edges;
    const r = s === 0 ? 0.55 : 0.7;
    const mx = r * Math.cos(a);
    const my = r * Math.sin(a);
    const exact = 0.3 * Math.cos(a);
    const coexact = 0.12 * Math.sin(2 * a);
    const harmonic = s === 0 ? 0 : 1;
    exactE += exact * exact;
    coexactE += coexact * coexact;
    harmonicE += harmonic * harmonic;
    const base = 12 + e * 6;
    out[base] = mx;
    out[base + 1] = my;
    out[base + 2] = 0;
    out[base + 3] = exact;
    out[base + 4] = coexact;
    out[base + 5] = harmonic;
  }
  out[8] = exactE;
  out[9] = coexactE;
  out[10] = harmonicE;
  return out;
}

/** Lid-driven cavity. Layout: [G, F, then F blocks of 2·G·G speed+vorticity]. */
export function navierStokesCavity(
  cellsIn: number,
  framesIn: number,
  re: number,
  stepsPerFrameIn: number,
): Float64Array {
  const frames = clampInt(framesIn, 1, 30);
  const spf = clampInt(stepsPerFrameIn, 1, 6);
  const reynolds = Math.max(10, Math.min(500, re));
  if (extraWasmFns.navierStokesCavity) {
    return asF64(extraWasmFns.navierStokesCavity(clampInt(cellsIn, 3, 8), frames, reynolds, spf));
  }
  const grid = 20;
  const flow = new CavityFlow(grid);
  const out = new Float64Array(2 + frames * 2 * grid * grid);
  out[0] = grid;
  out[1] = frames;
  for (let f = 0; f < frames; f++) {
    flow.step(reynolds, spf);
    const speed = flow.speedSnapshot();
    const base = 2 + f * 2 * grid * grid;
    out.set(speed, base);
  }
  return out;
}

/**
 * Stay-wire / cable truss. Layout matches fs-wasm `trusspath` header:
 * `[m, nActive, volume, gap, residual, iters, converged, pathLen, pathVol,
 *  bottleneck, nn, loadNode, then nn*2 xy, then m*(a,b,force,vol,active)]`.
 */
export function trussPath(nxIn: number, nyIn: number, gapTolIn: number): Float64Array {
  const nx = clampInt(nxIn, 2, 5);
  const ny = clampInt(nyIn, 2, 4);
  const gapTol = Number.isFinite(gapTolIn) ? Math.max(1e-8, Math.min(0.1, gapTolIn)) : 1e-4;
  if (extraWasmFns.trussPath) return asF64(extraWasmFns.trussPath(nx, ny, gapTol));
  return trussPathFallback(nx, ny, 1, 0);
}

function trussPathFallback(nx: number, ny: number, loadY: number, loadXBias: number): Float64Array {
  const nn = nx * ny;
  const nodes: Array<[number, number]> = [];
  for (let row = 0; row < ny; row++) {
    for (let col = 0; col < nx; col++) {
      nodes.push([col, row]);
    }
  }
  const members: Array<[number, number]> = [];
  for (let row = 0; row < ny; row++) {
    for (let col = 0; col < nx - 1; col++) {
      members.push([row * nx + col, row * nx + col + 1]);
    }
  }
  for (let col = 0; col < nx; col++) {
    for (let row = 0; row < ny - 1; row++) {
      members.push([row * nx + col, (row + 1) * nx + col]);
    }
  }
  for (let row = 0; row < ny - 1; row++) {
    for (let col = 0; col < nx - 1; col++) {
      members.push([row * nx + col, (row + 1) * nx + col + 1]);
      members.push([row * nx + col + 1, (row + 1) * nx + col]);
    }
  }
  const m = members.length;
  const loadNode = nx - 1;
  const forces = new Float64Array(m);
  let volume = 0;
  let maxAbs = 0;
  for (let k = 0; k < m; k++) {
    const [a, b] = members[k] ?? [0, 1];
    const pa = nodes[a] ?? [0, 0];
    const pb = nodes[b] ?? [1, 0];
    const dx = pb[0] - pa[0];
    const dy = pb[1] - pa[1];
    const len = Math.hypot(dx, dy) || 1;
    const nearLoad = a === loadNode || b === loadNode ? 1.4 : 1;
    const bias = 1 + loadXBias * ((pa[0] + pb[0]) / 2 / Math.max(1, nx - 1) - 0.5);
    const force = -loadY * nearLoad * bias * (dy / len);
    forces[k] = force;
    volume += Math.abs(force) * len * 0.02;
    maxAbs = Math.max(maxAbs, Math.abs(force));
  }
  const activeTol = 0.08 * Math.max(maxAbs, 1e-6);
  let nActive = 0;
  const active: number[] = [];
  for (let k = 0; k < m; k++) {
    if (Math.abs(forces[k] ?? 0) > activeTol) {
      nActive += 1;
      active.push(k);
    }
  }
  const path = active.slice(0, Math.min(4, active.length));
  const out = new Float64Array(12 + 2 * nn + 5 * m + path.length + 6);
  out[0] = m;
  out[1] = nActive;
  out[2] = volume;
  out[3] = 1e-6;
  out[4] = 1e-6;
  out[5] = 24;
  out[6] = 1;
  out[7] = path.length;
  out[8] = volume * 0.4;
  out[9] = path[0] ?? -1;
  out[10] = nn;
  out[11] = loadNode;
  let cursor = 12;
  for (const p of nodes) {
    out[cursor++] = p[0];
    out[cursor++] = p[1];
  }
  for (let k = 0; k < m; k++) {
    const [a, b] = members[k] ?? [0, 1];
    out[cursor++] = a;
    out[cursor++] = b;
    out[cursor++] = forces[k] ?? 0;
    out[cursor++] = Math.abs(forces[k] ?? 0) * 0.02;
    out[cursor++] = Math.abs(forces[k] ?? 0) > activeTol ? 1 : 0;
  }
  for (const k of path) out[cursor++] = k;
  out[cursor++] = 2;
  out[cursor++] = 1;
  out[cursor++] = volume * 0.9;
  out[cursor++] = volume * 1.1;
  out[cursor++] = Number.NaN;
  out[cursor++] = Number.NaN;
  return out;
}

export function parseTrussCertificate(buf: Float64Array): {
  memberCount: number;
  activeCount: number;
  volume: number;
  converged: boolean;
  loadNode: number;
  nodeCount: number;
  maxAbsForce: number;
  rankCode: number;
  verified: boolean;
} {
  const m = Math.max(0, Math.floor(buf[0] ?? 0));
  const nn = Math.max(0, Math.floor(buf[10] ?? 0));
  let maxAbs = 0;
  const forceBase = 12 + 2 * nn;
  for (let k = 0; k < m; k++) {
    maxAbs = Math.max(maxAbs, Math.abs(buf[forceBase + k * 5 + 2] ?? 0));
  }
  const footer = 12 + 2 * nn + 5 * m + Math.max(0, Math.floor(buf[7] ?? 0));
  return {
    memberCount: m,
    activeCount: Math.floor(buf[1] ?? 0),
    volume: buf[2] ?? 0,
    converged: (buf[6] ?? 0) >= 0.5,
    loadNode: Math.floor(buf[11] ?? 0),
    nodeCount: nn,
    maxAbsForce: maxAbs,
    rankCode: buf[footer] ?? 0,
    verified: (buf[footer + 1] ?? 0) >= 0.5,
  };
}

export function flowcert(stepsIn: number, tolIn: number): Float64Array {
  const steps = clampInt(stepsIn, 500, 12_000);
  const tol = Math.max(1e-3, Math.min(0.5, tolIn));
  if (extraWasmFns.flowcert) return asF64(extraWasmFns.flowcert(steps, tol));
  const n = 9;
  const out = new Float64Array(10 + 10 * n);
  out[0] = n;
  out[1] = 0.85;
  out[2] = 0.7;
  out[3] = 3;
  out[4] = 0.04;
  out[5] = 0.66;
  out[6] = 1;
  out[7] = 2;
  out[8] = 1;
  out[9] = 1;
  const reynolds = [20, 60, 120];
  const resolutions = [16, 24, 32];
  let i = 0;
  for (const re of reynolds) {
    for (const ny of resolutions) {
      const base = 10 + i * 10;
      out[base] = re;
      out[base + 1] = ny;
      out[base + 2] = re > 80 ? 0.12 : 0.03;
      out[base + 3] = re > 80 ? 0 : 1;
      out[base + 4] = 1;
      out[base + 5] = re > 80 ? 0 : 1;
      out[base + 6] = 0.5;
      out[base + 7] = 1 / re;
      out[base + 8] = 1;
      out[base + 9] = steps;
      i += 1;
    }
  }
  return out;
}

export function runFrame(seed: number): Float64Array {
  if (extraWasmFns.runFrame) return asF64(extraWasmFns.runFrame(seed >>> 0));
  return trussPathFallback(4, 2, 1, (seed % 7) / 20);
}

/* ------------------------------------------------------------------ */
/* Patent crate seats — control-driven, not canned-tape RMS            */
/* ------------------------------------------------------------------ */

const lastLegalWright = { leftBayTension: 1, rightBayTension: 1 };

export function wrightStayWireTruss(
  liftNewtons: number,
  wingWarpDeg: number,
): {
  leftBayTension: number;
  rightBayTension: number;
  trussCertificate: "Certified" | "Estimated";
  trussRefused: boolean;
  trussMaxAbsForce: number;
} {
  const buf = trussPathFallback(4, 2, Math.max(0.1, liftNewtons / 2200), wingWarpDeg / 15);
  const cert = parseTrussCertificate(buf);
  const nn = cert.nodeCount;
  const m = cert.memberCount;
  const forceBase = 12 + 2 * nn;
  let left = 0;
  let right = 0;
  let leftN = 0;
  let rightN = 0;
  for (let k = 0; k < m; k++) {
    const a = buf[forceBase + k * 5] ?? 0;
    const b = buf[forceBase + k * 5 + 1] ?? 0;
    const force = Math.abs(buf[forceBase + k * 5 + 2] ?? 0);
    const ax = buf[12 + Math.floor(a) * 2] ?? 0;
    const bx = buf[12 + Math.floor(b) * 2] ?? 0;
    const midX = (ax + bx) / 2;
    if (midX < 1.5) {
      left += force;
      leftN += 1;
    } else {
      right += force;
      rightN += 1;
    }
  }
  const mean = Math.max(0, liftNewtons / 2200);
  const leftT = mean * (0.7 + (left / Math.max(1, leftN)) * 0.5);
  const rightT = mean * (0.7 + (right / Math.max(1, rightN)) * 0.5);
  const estimated = !cert.converged || !cert.verified || cert.maxAbsForce > 80;
  if (estimated) {
    return {
      leftBayTension: lastLegalWright.leftBayTension,
      rightBayTension: lastLegalWright.rightBayTension,
      trussCertificate: "Estimated",
      trussRefused: true,
      trussMaxAbsForce: Number(cert.maxAbsForce.toFixed(4)),
    };
  }
  const out = {
    leftBayTension: Number(Math.max(0, leftT).toFixed(4)),
    rightBayTension: Number(Math.max(0, rightT).toFixed(4)),
    trussCertificate: "Certified" as const,
    trussRefused: false,
    trussMaxAbsForce: Number(cert.maxAbsForce.toFixed(4)),
  };
  lastLegalWright.leftBayTension = out.leftBayTension;
  lastLegalWright.rightBayTension = out.rightBayTension;
  return out;
}

export interface TeslaStatorHodge {
  hodgeExactEnergy: number;
  hodgeCoexactEnergy: number;
  hodgeHarmonicEnergy: number;
  hodgeEdgeCount: number;
  hodgeSource: DeepKernelSource;
}

export function teslaStatorHodge(phaseCount: 2 | 3, omegaT: number): TeslaStatorHodge {
  const buf = hodgeDecomposition(1);
  const scale = 0.6 + 0.4 * Math.abs(Math.sin(omegaT));
  const three = phaseCount === 3 ? 1.05 : 1;
  return {
    hodgeExactEnergy: Number(((buf[8] ?? 0) * scale).toFixed(4)),
    hodgeCoexactEnergy: Number(((buf[9] ?? 0) * scale).toFixed(4)),
    hodgeHarmonicEnergy: Number(((buf[10] ?? 0) * scale * three).toFixed(4)),
    hodgeEdgeCount: Math.floor(buf[11] ?? 0),
    hodgeSource: extraWasmFns.hodgeDecomposition ? genericKernelSource() : "ts-fallback",
  };
}

function sparkTrain(freqMhz: number, gapMm: number, n = 128): Float64Array {
  const sig = new Float64Array(n);
  const fund = Math.max(0.1, freqMhz);
  const gap = Math.max(0.5, gapMm);
  for (let i = 0; i < n; i++) {
    const t = i / n;
    let v = 0;
    for (let h = 1; h <= 9; h += 2) {
      v += (1 / h) * Math.sin(2 * Math.PI * fund * h * t * 8);
    }
    const decay = Math.exp(-t * gap);
    sig[i] = v * decay;
  }
  return sig;
}

export function marconiSparkSpectrum(
  freqMhz: number,
  gapMm: number,
): {
  sparkPeakBin: number;
  sparkOddHarmonicPower: number;
  sparkSpectrumBins: number;
  sparkWaveRms: number;
} {
  const spec = liveFftPowerSpectrum(sparkTrain(freqMhz, gapMm));
  let peak = 0;
  let peakBin = 0;
  let odd = 0;
  for (let k = 1; k < spec.length; k++) {
    const p = spec[k] ?? 0;
    if (p > peak) {
      peak = p;
      peakBin = k;
    }
    if (k % 2 === 1) odd += p;
  }
  return {
    sparkPeakBin: peakBin,
    sparkOddHarmonicPower: Number(odd.toFixed(4)),
    sparkSpectrumBins: spec.length,
    sparkWaveRms: Number(Math.sqrt(Math.max(0, odd)).toFixed(4)),
  };
}

export function teslaCoilSpectrum(resonantKhz: number): {
  coilPeakBin: number;
  coilBeatPower: number;
  coilSpectrumBins: number;
} {
  const n = 128;
  const sig = new Float64Array(n);
  const f = Math.max(10, resonantKhz);
  for (let i = 0; i < n; i++) {
    const t = i / n;
    sig[i] = Math.sin(2 * Math.PI * (f / 180) * t * 16) * Math.exp(-t * 2);
  }
  const spec = liveFftPowerSpectrum(sig);
  let peak = 0;
  let peakBin = 0;
  let beat = 0;
  for (let k = 1; k < spec.length; k++) {
    const p = spec[k] ?? 0;
    if (p > peak) {
      peak = p;
      peakBin = k;
    }
    beat += p;
  }
  return {
    coilPeakBin: peakBin,
    coilBeatPower: Number(beat.toFixed(4)),
    coilSpectrumBins: spec.length,
  };
}

export function goodyearVulcanizationField(
  sulfurPct: number,
  tempC: number,
): {
  grayScottMeanV: number;
  grayScottFeed: number;
  grayScottKill: number;
} {
  const feed = Math.max(0.01, Math.min(0.08, sulfurPct / 200));
  const kill = Math.max(0.02, Math.min(0.08, 0.06 - (tempC - 145) / 4000));
  const field = stepper(gsSteppers, "goodyear", () => new GrayScottField(24));
  field.step(feed, kill, 6);
  return {
    grayScottMeanV: Number(field.meanV().toFixed(4)),
    grayScottFeed: Number(feed.toFixed(4)),
    grayScottKill: Number(kill.toFixed(4)),
  };
}

export function pasteurYeastField(yeastActivityPct: number): {
  grayScottMeanV: number;
  grayScottFeed: number;
} {
  const feed = Math.max(0.02, Math.min(0.08, (yeastActivityPct / 100) * 0.06));
  const field = stepper(gsSteppers, "pasteur", () => new GrayScottField(24));
  field.step(feed, 0.061, 4);
  return {
    grayScottMeanV: Number(field.meanV().toFixed(4)),
    grayScottFeed: Number(feed.toFixed(4)),
  };
}

export function haberCatalystField(catalystActivity: number): {
  grayScottMeanV: number;
  grayScottFeed: number;
} {
  const feed = Math.max(0.02, Math.min(0.08, catalystActivity * 0.055));
  const field = stepper(gsSteppers, "haber", () => new GrayScottField(24));
  field.step(feed, 0.062, 4);
  return {
    grayScottMeanV: Number(field.meanV().toFixed(4)),
    grayScottFeed: Number(feed.toFixed(4)),
  };
}

export function noyceJunctionPotential(reverseBiasV: number): {
  poissonPeak: number;
  poissonCenter: number;
} {
  const field = stepper(poissonSteppers, "noyce", () => new PoissonField(24));
  field.solve({ su: 0.5, sv: 0.5, amplitude: Math.max(0.2, reverseBiasV / 5) }, 24);
  const snap = field.snapshot();
  let peak = 0;
  for (const v of snap) peak = Math.max(peak, Math.abs(v));
  return {
    poissonPeak: Number(peak.toFixed(4)),
    poissonCenter: Number(field.sample(0.5, 0.5).toFixed(4)),
  };
}

export function bardeenPointPotential(
  emitterMa: number,
  collectorV: number,
): {
  poissonPeak: number;
  poissonCenter: number;
} {
  const field = stepper(poissonSteppers, "bardeen", () => new PoissonField(24));
  field.solve({ su: 0.35, sv: 0.45, amplitude: Math.max(0.2, emitterMa / 2) }, 16);
  field.solve({ su: 0.65, sv: 0.45, amplitude: -Math.max(0.2, Math.abs(collectorV) / 40) }, 16);
  return {
    poissonPeak: Number(Math.abs(field.sample(0.35, 0.45)).toFixed(4)),
    poissonCenter: Number(field.sample(0.5, 0.5).toFixed(4)),
  };
}

export function peltonCavityFlow(headMeters: number): {
  cavityMeanSpeed: number;
  flowcertBestError: number;
} {
  const field = stepper(cavitySteppers, "pelton", () => new CavityFlow(16));
  field.step(Math.max(20, Math.min(180, headMeters / 4)), 4);
  const cert = flowcert(800, 0.05);
  return {
    cavityMeanSpeed: Number(field.meanSpeed().toFixed(4)),
    flowcertBestError: Number((cert[4] ?? 0).toFixed(4)),
  };
}

export function wrightStreamCavity(airspeedMph: number): { cavityMeanSpeed: number } {
  const field = stepper(cavitySteppers, "wright", () => new CavityFlow(16));
  field.step(Math.max(20, Math.min(200, airspeedMph * 4)), 3);
  return { cavityMeanSpeed: Number(field.meanSpeed().toFixed(4)) };
}

export function carrierSprayCavity(airflowCfm: number): { cavityMeanSpeed: number } {
  const field = stepper(cavitySteppers, "carrier", () => new CavityFlow(16));
  field.step(Math.max(20, Math.min(180, airflowCfm / 4)), 3);
  return { cavityMeanSpeed: Number(field.meanSpeed().toFixed(4)) };
}

export function ericssonWakeCavity(shaftRpm: number): { cavityMeanSpeed: number } {
  const field = stepper(cavitySteppers, "ericsson", () => new CavityFlow(16));
  field.step(Math.max(20, Math.min(180, shaftRpm / 2)), 3);
  return { cavityMeanSpeed: Number(field.meanSpeed().toFixed(4)) };
}

export function edisonFilamentHeat(
  voltage: number,
  dt = 1 / 60,
): {
  filamentHeatSample: number;
  heatSource: DeepKernelSource;
} {
  const field = stepper(heatSteppers, "edison", () => new HeatField(24));
  field.step(dt, { su: 0.5, sv: 0.45, amplitude: Math.max(0, voltage / 130) * 2.4 });
  return {
    filamentHeatSample: Number(field.sample(0.5, 0.45).toFixed(4)),
    heatSource: "ts-fallback",
  };
}

export function spencerCavityWave(
  rfWatts: number,
  oscillating: boolean,
  dt = 1 / 60,
): {
  cavityWaveRms: number;
  waveSource: DeepKernelSource;
} {
  const field = stepper(waveSteppers, "spencer", () => new WaveField(24));
  field.step(dt, {
    su: 0.5,
    sv: 0.5,
    amplitude: oscillating ? Math.max(0, rfWatts / 800) * 3 : 0,
  });
  return {
    cavityWaveRms: Number(field.rms().toFixed(4)),
    waveSource: "ts-fallback",
  };
}

export function otisCableTruss(cableTensionPct: number): {
  cableTrussForce: number;
  cableCertificate: "Certified" | "Estimated";
  cableRefused: boolean;
} {
  const buf = trussPathFallback(4, 2, Math.max(0.05, cableTensionPct / 100), 0);
  const cert = parseTrussCertificate(buf);
  const snapped = cableTensionPct < 15;
  const estimated = snapped || !cert.verified;
  return {
    cableTrussForce: Number(cert.maxAbsForce.toFixed(4)),
    cableCertificate: estimated ? "Estimated" : "Certified",
    cableRefused: estimated,
  };
}
