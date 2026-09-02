/* tslint:disable */
/* eslint-disable */

/**
 * Source-bounded US 1,102,653 apparatus step composed from `fs-mbd`.
 *
 * The two speed inputs are declared visitor controls because the facsimile
 * prints no numerical spin rates. The output deliberately contains no liquid
 * propellant, de Laval, Mach, thrust, or trajectory field.
 */
export function goddard_apparatus_step(elapsed_seconds: number, primary_spin_rpm: number, gyro_spin_rpm: number, tube_length_ratio: number, auxiliary_release_fraction: number, primary_charge_substantially_consumed: boolean, gyro_enabled: boolean): string;

export function goddard_rocket_step(chamber_pressure_psi: number, fuel_flow_kg_per_sec: number, throat_area_cm2: number, expansion_ratio: number): string;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly goddard_apparatus_step: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => [number, number];
    readonly goddard_rocket_step: (a: number, b: number, c: number, d: number) => [number, number];
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
