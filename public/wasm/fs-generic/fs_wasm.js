/* @ts-self-types="./fs_wasm.d.ts" */

//#region exports

/**
 * @param {number} max_iters
 * @param {number} delta
 * @param {number} alpha
 * @returns {Float64Array}
 */
export function anytimebo(max_iters, delta, alpha) {
    _assertNum(max_iters);
    const ret = wasm.anytimebo(max_iters, delta, alpha);
    var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v1;
}

/**
 * @param {number} xmin
 * @param {number} xmax
 * @param {number} samples
 * @returns {Float64Array}
 */
export function autodiff_derivatives(xmin, xmax, samples) {
    _assertNum(samples);
    const ret = wasm.autodiff_derivatives(xmin, xmax, samples);
    var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v1;
}

/**
 * @param {number} shape
 * @returns {Float64Array}
 */
export function betti_shapes(shape) {
    _assertNum(shape);
    const ret = wasm.betti_shapes(shape);
    var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v1;
}

/**
 * @param {number} kind
 * @param {number} samples
 * @returns {Float64Array}
 */
export function chebyshev_fit(kind, samples) {
    _assertNum(kind);
    _assertNum(samples);
    const ret = wasm.chebyshev_fit(kind, samples);
    var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v1;
}

/**
 * @param {number} kind
 * @returns {Float64Array}
 */
export function chebyshev_spectrum(kind) {
    _assertNum(kind);
    const ret = wasm.chebyshev_spectrum(kind);
    var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v1;
}

/**
 * @param {number} seed
 * @param {number} gens
 * @returns {Float64Array}
 */
export function cmaes_trace(seed, gens) {
    _assertNum(seed);
    _assertNum(gens);
    const ret = wasm.cmaes_trace(seed, gens);
    var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v1;
}

/**
 * @param {number} count
 * @param {number} log10_big
 * @returns {Float64Array}
 */
export function compensated_sum(count, log10_big) {
    _assertNum(count);
    _assertNum(log10_big);
    const ret = wasm.compensated_sum(count, log10_big);
    var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v1;
}

/**
 * @param {number} base
 * @param {number} target
 * @param {number} radius
 * @returns {Float64Array}
 */
export function cutfem_quadtree(base, target, radius) {
    _assertNum(base);
    _assertNum(target);
    const ret = wasm.cutfem_quadtree(base, target, radius);
    var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v1;
}

/**
 * @param {number} n
 * @param {number} stiffness
 * @returns {Float64Array}
 */
export function cyclic_symmetry(n, stiffness) {
    _assertNum(n);
    const ret = wasm.cyclic_symmetry(n, stiffness);
    var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v1;
}

/**
 * A build stamp so the page can prove it's running the real engine.
 * @returns {string}
 */
export function engine() {
    let deferred1_0;
    let deferred1_1;
    try {
        const ret = wasm.engine();
        deferred1_0 = ret[0];
        deferred1_1 = ret[1];
        return getStringFromWasm0(ret[0], ret[1]);
    } finally {
        wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
    }
}

/**
 * @param {number} grid
 * @param {number} controls
 * @param {number} amp
 * @param {number} mode
 * @returns {Float64Array}
 */
export function ffd_deform(grid, controls, amp, mode) {
    _assertNum(grid);
    _assertNum(controls);
    _assertNum(mode);
    const ret = wasm.ffd_deform(grid, controls, amp, mode);
    var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v1;
}

/**
 * @param {number} n
 * @param {number} seed
 * @returns {Float64Array}
 */
export function fft_power_spectrum(n, seed) {
    _assertNum(n);
    _assertNum(seed);
    const ret = wasm.fft_power_spectrum(n, seed);
    var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v1;
}

/**
 * @param {number} x0
 * @param {number} steps
 * @returns {Float64Array}
 */
export function finite_difference_error(x0, steps) {
    _assertNum(steps);
    const ret = wasm.finite_difference_error(x0, steps);
    var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v1;
}

/**
 * @param {number} steps
 * @param {number} tol
 * @returns {Float64Array}
 */
export function flowcert(steps, tol) {
    _assertNum(steps);
    const ret = wasm.flowcert(steps, tol);
    var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v1;
}

/**
 * @param {number} n
 * @param {number} frames
 * @returns {Float64Array}
 */
export function fluid_frames(n, frames) {
    _assertNum(n);
    _assertNum(frames);
    const ret = wasm.fluid_frames(n, frames);
    var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v1;
}

/**
 * @param {number} lo
 * @param {number} hi
 * @param {number} steps
 * @returns {Float64Array}
 */
export function fluttercert(lo, hi, steps) {
    _assertNum(steps);
    const ret = wasm.fluttercert(lo, hi, steps);
    var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v1;
}

/**
 * @param {number} n_points
 * @param {number} steps
 * @returns {Float64Array}
 */
export function ga_motor_orbit(n_points, steps) {
    _assertNum(n_points);
    _assertNum(steps);
    const ret = wasm.ga_motor_orbit(n_points, steps);
    var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v1;
}

/**
 * @param {number} n_train
 * @param {number} samples
 * @returns {Float64Array}
 */
export function gp_regression(n_train, samples) {
    _assertNum(n_train);
    _assertNum(samples);
    const ret = wasm.gp_regression(n_train, samples);
    var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v1;
}

/**
 * @param {number} match_tol
 * @param {number} simplify_tol
 * @returns {Float64Array}
 */
export function grammarforge(match_tol, simplify_tol) {
    const ret = wasm.grammarforge(match_tol, simplify_tol);
    var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v1;
}

/**
 * @param {number} n
 * @param {number} frames
 * @param {number} feed
 * @param {number} kill
 * @returns {Float64Array}
 */
export function gray_scott_frames(n, frames, feed, kill) {
    _assertNum(n);
    _assertNum(frames);
    const ret = wasm.gray_scott_frames(n, frames, feed, kill);
    var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v1;
}

/**
 * @param {number} n
 * @param {number} frames
 * @param {number} steps_per_frame
 * @returns {Float64Array}
 */
export function heat_frames(n, frames, steps_per_frame) {
    _assertNum(n);
    _assertNum(frames);
    _assertNum(steps_per_frame);
    const ret = wasm.heat_frames(n, frames, steps_per_frame);
    var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v1;
}

/**
 * @param {number} shape
 * @returns {Float64Array}
 */
export function hodge_decomposition(shape) {
    _assertNum(shape);
    const ret = wasm.hodge_decomposition(shape);
    var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v1;
}

/**
 * @param {number} n
 * @param {number} maxit
 * @returns {Float64Array}
 */
export function krylov_convergence(n, maxit) {
    _assertNum(n);
    _assertNum(maxit);
    const ret = wasm.krylov_convergence(n, maxit);
    var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v1;
}

/**
 * @param {number} n
 * @param {number} k
 * @returns {Float64Array}
 */
export function laplacian_modes(n, k) {
    _assertNum(n);
    _assertNum(k);
    const ret = wasm.laplacian_modes(n, k);
    var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v1;
}

/**
 * @param {number} steps
 * @param {number} dt
 * @param {number} rho
 * @returns {Float64Array}
 */
export function lorenz_points(steps, dt, rho) {
    _assertNum(steps);
    const ret = wasm.lorenz_points(steps, dt, rho);
    var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v1;
}

/**
 * @param {number} w
 * @param {number} h
 * @param {number} cx
 * @param {number} cy
 * @param {number} scale
 * @param {number} maxiter
 * @returns {Float64Array}
 */
export function mandelbrot_certified(w, h, cx, cy, scale, maxiter) {
    _assertNum(w);
    _assertNum(h);
    _assertNum(maxiter);
    const ret = wasm.mandelbrot_certified(w, h, cx, cy, scale, maxiter);
    var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v1;
}

/**
 * @param {number} res
 * @param {number} kind
 * @param {number} iso
 * @returns {Float64Array}
 */
export function marching_cubes(res, kind, iso) {
    _assertNum(res);
    _assertNum(kind);
    const ret = wasm.marching_cubes(res, kind, iso);
    var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v1;
}

/**
 * @param {number} n
 * @param {number} points
 * @param {number} rmax
 * @returns {Float64Array}
 */
export function metamatcert(n, points, rmax) {
    _assertNum(n);
    _assertNum(points);
    const ret = wasm.metamatcert(n, points, rmax);
    var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v1;
}

/**
 * @param {number} cells
 * @param {number} frames
 * @param {number} re
 * @param {number} steps_per_frame
 * @returns {Float64Array}
 */
export function navier_stokes_cavity(cells, frames, re, steps_per_frame) {
    _assertNum(cells);
    _assertNum(frames);
    _assertNum(steps_per_frame);
    const ret = wasm.navier_stokes_cavity(cells, frames, re, steps_per_frame);
    var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v1;
}

/**
 * @param {number} lift
 * @param {number} ring_r
 * @param {number} inner
 * @returns {Float64Array}
 */
export function neuroshape(lift, ring_r, inner) {
    const ret = wasm.neuroshape(lift, ring_r, inner);
    var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v1;
}

/**
 * @param {number} n
 * @param {number} epsilon
 * @returns {Float64Array}
 */
export function optimal_transport(n, epsilon) {
    _assertNum(n);
    const ret = wasm.optimal_transport(n, epsilon);
    var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v1;
}

/**
 * @param {number} alpha
 * @param {number} n
 * @param {number} re_min
 * @param {number} re_max
 * @param {number} steps
 * @returns {Float64Array}
 */
export function orr_sommerfeld_curve(alpha, n, re_min, re_max, steps) {
    _assertNum(n);
    _assertNum(steps);
    const ret = wasm.orr_sommerfeld_curve(alpha, n, re_min, re_max, steps);
    var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v1;
}

/**
 * @param {number} re
 * @param {number} alpha
 * @param {number} n
 * @returns {number}
 */
export function orr_sommerfeld_max_growth(re, alpha, n) {
    _assertNum(n);
    const ret = wasm.orr_sommerfeld_max_growth(re, alpha, n);
    return ret;
}

/**
 * @param {number} n
 * @returns {Float64Array}
 */
export function poisson2d(n) {
    _assertNum(n);
    const ret = wasm.poisson2d(n);
    var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v1;
}

/**
 * @param {number} alpha
 * @param {number} sigma
 * @param {number} n
 * @returns {Float64Array}
 */
export function proofrobust(alpha, sigma, n) {
    _assertNum(n);
    const ret = wasm.proofrobust(alpha, sigma, n);
    var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v1;
}

/**
 * @param {number} max_log2
 * @param {number} seed
 * @returns {Float64Array}
 */
export function qmc_vs_mc(max_log2, seed) {
    _assertNum(max_log2);
    _assertNum(seed);
    const ret = wasm.qmc_vs_mc(max_log2, seed);
    var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v1;
}

/**
 * @param {number} n
 * @param {number} rank
 * @param {number} seed
 * @returns {Float64Array}
 */
export function randomized_svd(n, rank, seed) {
    _assertNum(n);
    _assertNum(rank);
    _assertNum(seed);
    const ret = wasm.randomized_svd(n, rank, seed);
    var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v1;
}

/**
 * @param {number} radius
 * @returns {Float64Array}
 */
export function robust_hull(radius) {
    _assertNum(radius);
    const ret = wasm.robust_hull(radius);
    var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v1;
}

/**
 * @param {number} seed
 * @returns {Float64Array}
 */
export function run_frame(seed) {
    _assertNum(seed);
    const ret = wasm.run_frame(seed);
    var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v1;
}

/**
 * @param {number} seed
 * @returns {Float64Array}
 */
export function run_ornithoid(seed) {
    _assertNum(seed);
    const ret = wasm.run_ornithoid(seed);
    var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v1;
}

/**
 * @param {number} lip_x1000
 * @returns {Float64Array}
 */
export function run_vessel(lip_x1000) {
    _assertNum(lip_x1000);
    const ret = wasm.run_vessel(lip_x1000);
    var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v1;
}

/**
 * @param {number} windtunnel_latency
 * @param {number} design_b_mean
 * @param {number} stop_threshold
 * @returns {Float64Array}
 */
export function schedule_campaign(windtunnel_latency, design_b_mean, stop_threshold) {
    const ret = wasm.schedule_campaign(windtunnel_latency, design_b_mean, stop_threshold);
    var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v1;
}

/**
 * @param {number} res
 * @param {number} kind
 * @param {number} t
 * @returns {Float64Array}
 */
export function sdf_volume(res, kind, t) {
    _assertNum(res);
    _assertNum(kind);
    const ret = wasm.sdf_volume(res, kind, t);
    var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v1;
}

/**
 * @param {number} threshold
 * @param {number} max_sensors
 * @param {number} b_prior_mean
 * @returns {Float64Array}
 */
export function sensorforge(threshold, max_sensors, b_prior_mean) {
    _assertNum(max_sensors);
    const ret = wasm.sensorforge(threshold, max_sensors, b_prior_mean);
    var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v1;
}

/**
 * @param {number} steps
 * @param {number} dt
 * @returns {Float64Array}
 */
export function symplectic_vs_euler(steps, dt) {
    _assertNum(steps);
    const ret = wasm.symplectic_vs_euler(steps, dt);
    var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v1;
}

/**
 * @param {number} center
 * @param {number} radius
 * @param {number} order
 * @returns {Float64Array}
 */
export function taylor_bound(center, radius, order) {
    _assertNum(order);
    const ret = wasm.taylor_bound(center, radius, order);
    var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v1;
}

/**
 * @param {number} nx
 * @param {number} ny
 * @param {number} iters
 * @param {number} volfrac
 * @returns {Float64Array}
 */
export function topopt_frames(nx, ny, iters, volfrac) {
    _assertNum(nx);
    _assertNum(ny);
    _assertNum(iters);
    const ret = wasm.topopt_frames(nx, ny, iters, volfrac);
    var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v1;
}

/**
 * @param {number} nx
 * @param {number} ny
 * @param {number} gap_tol
 * @returns {Float64Array}
 */
export function trusspath(nx, ny, gap_tol) {
    _assertNum(nx);
    _assertNum(ny);
    const ret = wasm.trusspath(nx, ny, gap_tol);
    var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v1;
}

/**
 * @param {number} n
 * @param {number} frames
 * @param {number} steps_per_frame
 * @returns {Float64Array}
 */
export function wave2d_frames(n, frames, steps_per_frame) {
    _assertNum(n);
    _assertNum(frames);
    _assertNum(steps_per_frame);
    const ret = wasm.wave2d_frames(n, frames, steps_per_frame);
    var v1 = getArrayF64FromWasm0(ret[0], ret[1]).slice();
    wasm.__wbindgen_free(ret[0], ret[1] * 8, 8);
    return v1;
}

//#endregion

//#region wasm imports
function __wbg_get_imports() {
    const import0 = {
        __proto__: null,
        __wbg___wbindgen_throw_344f42d3211c4765: function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        },
        __wbindgen_init_externref_table: function() {
            const table = wasm.__wbindgen_externrefs;
            const offset = table.grow(4);
            table.set(0, undefined);
            table.set(offset + 0, undefined);
            table.set(offset + 1, null);
            table.set(offset + 2, true);
            table.set(offset + 3, false);
        },
    };
    return {
        __proto__: null,
        "./fs_wasm_bg.js": import0,
    };
}


//#endregion

//#region intrinsics
function _assertNum(n) {
    if (typeof(n) !== 'number') throw new Error(`expected a number argument, found ${typeof(n)}`);
}

function getArrayF64FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getFloat64ArrayMemory0().subarray(ptr / 8, ptr / 8 + len);
}

let cachedFloat64ArrayMemory0 = null;
function getFloat64ArrayMemory0() {
    if (cachedFloat64ArrayMemory0 === null || cachedFloat64ArrayMemory0.byteLength === 0) {
        cachedFloat64ArrayMemory0 = new Float64Array(wasm.memory.buffer);
    }
    return cachedFloat64ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    return decodeText(ptr >>> 0, len);
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}


//#endregion

//#region wasm loading
let wasmModule, wasmInstance, wasm;
function __wbg_finalize_init(instance, module) {
    wasmInstance = instance;
    wasm = instance.exports;
    wasmModule = module;
    cachedFloat64ArrayMemory0 = null;
    cachedUint8ArrayMemory0 = null;
    wasm.__wbindgen_start();
    return wasm;
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);
            } catch (e) {
                const validResponse = module.ok && expectedResponseType(module.type);

                if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else { throw e; }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);
    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };
        } else {
            return instance;
        }
    }

    function expectedResponseType(type) {
        switch (type) {
            case 'basic': case 'cors': case 'default': return true;
        }
        return false;
    }
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (module !== undefined) {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();
    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }
    const instance = new WebAssembly.Instance(module, imports);
    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (module_or_path !== undefined) {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (module_or_path === undefined) {
        module_or_path = new URL('fs_wasm_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync, __wbg_init as default };
//#endregion
export { wasm as __wasm }
