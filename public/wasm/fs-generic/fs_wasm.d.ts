/* tslint:disable */
/* eslint-disable */

export function anytimebo(max_iters: number, delta: number, alpha: number): Float64Array;

export function autodiff_derivatives(xmin: number, xmax: number, samples: number): Float64Array;

export function betti_shapes(shape: number): Float64Array;

export function chebyshev_fit(kind: number, samples: number): Float64Array;

export function chebyshev_spectrum(kind: number): Float64Array;

export function cmaes_trace(seed: number, gens: number): Float64Array;

export function compensated_sum(count: number, log10_big: number): Float64Array;

export function cutfem_quadtree(base: number, target: number, radius: number): Float64Array;

export function cyclic_symmetry(n: number, stiffness: number): Float64Array;

/**
 * A build stamp so the page can prove it's running the real engine.
 */
export function engine(): string;

export function ffd_deform(grid: number, controls: number, amp: number, mode: number): Float64Array;

export function fft_power_spectrum(n: number, seed: number): Float64Array;

export function finite_difference_error(x0: number, steps: number): Float64Array;

export function flowcert(steps: number, tol: number): Float64Array;

export function fluid_frames(n: number, frames: number): Float64Array;

export function fluttercert(lo: number, hi: number, steps: number): Float64Array;

export function ga_motor_orbit(n_points: number, steps: number): Float64Array;

export function gp_regression(n_train: number, samples: number): Float64Array;

export function grammarforge(match_tol: number, simplify_tol: number): Float64Array;

export function gray_scott_frames(n: number, frames: number, feed: number, kill: number): Float64Array;

export function heat_frames(n: number, frames: number, steps_per_frame: number): Float64Array;

export function hodge_decomposition(shape: number): Float64Array;

export function krylov_convergence(n: number, maxit: number): Float64Array;

export function laplacian_modes(n: number, k: number): Float64Array;

export function lorenz_points(steps: number, dt: number, rho: number): Float64Array;

export function mandelbrot_certified(w: number, h: number, cx: number, cy: number, scale: number, maxiter: number): Float64Array;

export function marching_cubes(res: number, kind: number, iso: number): Float64Array;

export function metamatcert(n: number, points: number, rmax: number): Float64Array;

export function navier_stokes_cavity(cells: number, frames: number, re: number, steps_per_frame: number): Float64Array;

export function neuroshape(lift: number, ring_r: number, inner: number): Float64Array;

export function optimal_transport(n: number, epsilon: number): Float64Array;

export function orr_sommerfeld_curve(alpha: number, n: number, re_min: number, re_max: number, steps: number): Float64Array;

export function orr_sommerfeld_max_growth(re: number, alpha: number, n: number): number;

export function poisson2d(n: number): Float64Array;

export function proofrobust(alpha: number, sigma: number, n: number): Float64Array;

export function qmc_vs_mc(max_log2: number, seed: number): Float64Array;

export function randomized_svd(n: number, rank: number, seed: number): Float64Array;

export function robust_hull(radius: number): Float64Array;

export function run_frame(seed: number): Float64Array;

export function run_ornithoid(seed: number): Float64Array;

export function run_vessel(lip_x1000: number): Float64Array;

export function schedule_campaign(windtunnel_latency: number, design_b_mean: number, stop_threshold: number): Float64Array;

export function sdf_volume(res: number, kind: number, t: number): Float64Array;

export function sensorforge(threshold: number, max_sensors: number, b_prior_mean: number): Float64Array;

export function symplectic_vs_euler(steps: number, dt: number): Float64Array;

export function taylor_bound(center: number, radius: number, order: number): Float64Array;

export function topopt_frames(nx: number, ny: number, iters: number, volfrac: number): Float64Array;

export function trusspath(nx: number, ny: number, gap_tol: number): Float64Array;

export function wave2d_frames(n: number, frames: number, steps_per_frame: number): Float64Array;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly anytimebo: (a: number, b: number, c: number) => [number, number];
    readonly autodiff_derivatives: (a: number, b: number, c: number) => [number, number];
    readonly chebyshev_fit: (a: number, b: number) => [number, number];
    readonly chebyshev_spectrum: (a: number) => [number, number];
    readonly compensated_sum: (a: number, b: number) => [number, number];
    readonly engine: () => [number, number];
    readonly fft_power_spectrum: (a: number, b: number) => [number, number];
    readonly finite_difference_error: (a: number, b: number) => [number, number];
    readonly flowcert: (a: number, b: number) => [number, number];
    readonly fluid_frames: (a: number, b: number) => [number, number];
    readonly fluttercert: (a: number, b: number, c: number) => [number, number];
    readonly ga_motor_orbit: (a: number, b: number) => [number, number];
    readonly grammarforge: (a: number, b: number) => [number, number];
    readonly gray_scott_frames: (a: number, b: number, c: number, d: number) => [number, number];
    readonly heat_frames: (a: number, b: number, c: number) => [number, number];
    readonly laplacian_modes: (a: number, b: number) => [number, number];
    readonly lorenz_points: (a: number, b: number, c: number) => [number, number];
    readonly mandelbrot_certified: (a: number, b: number, c: number, d: number, e: number, f: number) => [number, number];
    readonly marching_cubes: (a: number, b: number, c: number) => [number, number];
    readonly metamatcert: (a: number, b: number, c: number) => [number, number];
    readonly neuroshape: (a: number, b: number, c: number) => [number, number];
    readonly orr_sommerfeld_curve: (a: number, b: number, c: number, d: number, e: number) => [number, number];
    readonly orr_sommerfeld_max_growth: (a: number, b: number, c: number) => number;
    readonly poisson2d: (a: number) => [number, number];
    readonly proofrobust: (a: number, b: number, c: number) => [number, number];
    readonly qmc_vs_mc: (a: number, b: number) => [number, number];
    readonly randomized_svd: (a: number, b: number, c: number) => [number, number];
    readonly robust_hull: (a: number) => [number, number];
    readonly schedule_campaign: (a: number, b: number, c: number) => [number, number];
    readonly sdf_volume: (a: number, b: number, c: number) => [number, number];
    readonly sensorforge: (a: number, b: number, c: number) => [number, number];
    readonly symplectic_vs_euler: (a: number, b: number) => [number, number];
    readonly taylor_bound: (a: number, b: number, c: number) => [number, number];
    readonly topopt_frames: (a: number, b: number, c: number, d: number) => [number, number];
    readonly trusspath: (a: number, b: number, c: number) => [number, number];
    readonly wave2d_frames: (a: number, b: number, c: number) => [number, number];
    readonly run_frame: (a: number) => [number, number];
    readonly run_ornithoid: (a: number) => [number, number];
    readonly run_vessel: (a: number) => [number, number];
    readonly betti_shapes: (a: number) => [number, number];
    readonly cmaes_trace: (a: number, b: number) => [number, number];
    readonly cutfem_quadtree: (a: number, b: number, c: number) => [number, number];
    readonly cyclic_symmetry: (a: number, b: number) => [number, number];
    readonly ffd_deform: (a: number, b: number, c: number, d: number) => [number, number];
    readonly gp_regression: (a: number, b: number) => [number, number];
    readonly hodge_decomposition: (a: number) => [number, number];
    readonly krylov_convergence: (a: number, b: number) => [number, number];
    readonly navier_stokes_cavity: (a: number, b: number, c: number, d: number) => [number, number];
    readonly optimal_transport: (a: number, b: number) => [number, number];
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
