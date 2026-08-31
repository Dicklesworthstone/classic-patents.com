import { describe, expect, test } from "bun:test";
import { decodeFlyerState } from "./flyerWasm";
import { decodeGoddardWasmStep } from "./goddardWasm";
import { decodeTeslaWasmStep } from "./teslaWasm";

async function wasmBytes(relativePath: string): Promise<ArrayBuffer> {
  return Bun.file(new URL(relativePath, import.meta.url)).arrayBuffer();
}

describe("shipped FrankenSim WebAssembly artifacts", () => {
  test("instantiates and steps the generic FrankenSim bundle", async () => {
    const module = await import("../../public/wasm/fs-generic/fs_wasm.js");
    const bytes = await wasmBytes("../../public/wasm/fs-generic/fs_wasm_bg.wasm");
    expect(WebAssembly.validate(bytes)).toBe(true);
    await module.default({ module_or_path: bytes });

    expect(module.engine()).toContain("FrankenSim numerical kernels");
    const orbit = module.ga_motor_orbit(4, 3);
    expect(Array.from(orbit.slice(0, 2))).toEqual([4, 3]);
    expect(orbit).toHaveLength(2 + 4 * 3 * 3);
    expect(Array.from(orbit).every(Number.isFinite)).toBe(true);

    const coreOutputs = [
      module.heat_frames(8, 2, 1),
      module.wave2d_frames(8, 2, 1),
      module.fluid_frames(16, 2),
      module.cyclic_symmetry(6, 0.5),
      module.laplacian_modes(8, 2),
    ];
    for (const output of coreOutputs) {
      expect(output.length).toBeGreaterThan(0);
      expect(Array.from(output).every(Number.isFinite)).toBe(true);
    }
  });

  test("instantiates the Flyer bundle and proves its typed refusal boundary", async () => {
    const module = await import("../../public/wasm/fs-flyer/fs_flyer_wasm.js");
    const bytes = await wasmBytes("../../public/wasm/fs-flyer/fs_flyer_wasm_bg.wasm");
    expect(WebAssembly.validate(bytes)).toBe(true);
    await module.default({ module_or_path: bytes });

    const stepped = JSON.parse(
      module.flyer_hello_spin(0.9, 1.1, 1.7, 1, 0, 0, 0, 0.08, 0.18, 0.05, 1 / 120, 1),
    ) as { ok?: { quaternion: number[]; omega_body: number[] } };
    expect(stepped.ok?.quaternion).toHaveLength(4);
    expect(stepped.ok?.omega_body).toHaveLength(3);

    const refused = JSON.parse(
      module.flyer_hello_spin(0, 1.1, 1.7, 1, 0, 0, 0, 0.08, 0.18, 0.05, 1 / 120, 1),
    ) as { refusal?: { code: string } };
    expect(refused.refusal?.code).toBeDefined();
  });

  test("instantiates the dedicated interpretive Goddard bundle and proves its refusal", async () => {
    const module = await import("../../public/wasm/fs-goddard/fs_goddard_wasm.js");
    const bytes = await wasmBytes("../../public/wasm/fs-goddard/fs_goddard_wasm_bg.wasm");
    expect(WebAssembly.validate(bytes)).toBe(true);
    await module.default({ module_or_path: bytes });

    const result = decodeGoddardWasmStep(module.goddard_rocket_step(350, 1.8, 4.2, 3.5));
    expect(result).not.toBeNull();
    expect(result?.chamber_pressure_psi).toBe(350);
    expect(result?.thrust_newtons).toBeGreaterThan(0);
    expect(result?.specific_impulse_sec).toBeGreaterThan(0);

    const refused = JSON.parse(module.goddard_rocket_step(Number.NaN, 1.8, 4.2, 3.5)) as {
      refusal?: { code: string; ranked_repairs: string[] };
    };
    expect(refused.refusal?.code).toBe("non-finite-input");
    expect(refused.refusal?.ranked_repairs.length).toBeGreaterThan(0);
  });

  test("instantiates the dedicated interpretive Tesla bundle and proves its refusal", async () => {
    const module = await import("../../public/wasm/fs-tesla/fs_tesla_wasm.js");
    const bytes = await wasmBytes("../../public/wasm/fs-tesla/fs_tesla_wasm_bg.wasm");
    expect(WebAssembly.validate(bytes)).toBe(true);
    await module.default({ module_or_path: bytes });

    const result = decodeTeslaWasmStep(module.tesla_coil_step(100, 15, 12, 145));
    expect(result).not.toBeNull();
    expect(result?.resonant_freq_khz).toBe(100);
    expect(result?.secondary_potential_mv).toBeGreaterThan(0);
    expect(result?.streamer_length_meters).toBeGreaterThan(0);

    const refused = JSON.parse(module.tesla_coil_step(100, 0, 12, 145)) as {
      refusal?: { code: string; ranked_repairs: string[] };
    };
    expect(refused.refusal?.code).toBe("input-outside-domain");
    expect(refused.refusal?.ranked_repairs.length).toBeGreaterThan(0);
  });

  test("host decoders fail closed on malformed or non-finite owner output", () => {
    expect(decodeGoddardWasmStep("not json")).toBeNull();
    expect(decodeGoddardWasmStep('{"ok":{"thrust_newtons":1}}')).toBeNull();
    expect(
      decodeGoddardWasmStep(
        '{"ok":{"chamber_pressure_psi":350,"chamber_pressure_pa":2413166,"exhaust_velocity_mps":-1,"thrust_newtons":2983,"specific_impulse_sec":169,"mach_exit":2}}',
      ),
    ).toBeNull();
    expect(
      decodeGoddardWasmStep(
        '{"ok":{"chamber_pressure_psi":350,"chamber_pressure_pa":2413166,"exhaust_velocity_mps":1657,"thrust_newtons":2983,"specific_impulse_sec":169,"mach_exit":null}}',
      ),
    ).toBeNull();

    expect(decodeTeslaWasmStep("not json")).toBeNull();
    expect(decodeTeslaWasmStep('{"ok":{"resonant_freq_khz":100}}')).toBeNull();
    expect(
      decodeTeslaWasmStep(
        '{"ok":{"resonant_freq_khz":100,"secondary_potential_mv":-1,"streamer_length_inches":2,"streamer_length_meters":0.05}}',
      ),
    ).toBeNull();
    expect(
      decodeTeslaWasmStep(
        '{"ok":{"resonant_freq_khz":100,"secondary_potential_mv":1,"streamer_length_inches":2,"streamer_length_meters":null}}',
      ),
    ).toBeNull();

    expect(decodeFlyerState("not json")).toBeNull();
    expect(decodeFlyerState('{"ok":{"quaternion":[1,0,0],"omega_body":[0,0,0]}}')).toBeNull();
    expect(decodeFlyerState('{"ok":{"quaternion":[2,0,0,0],"omega_body":[0,0,0]}}')).toBeNull();
    expect(decodeFlyerState('{"ok":{"quaternion":[1,0,0,0],"omega_body":[0,null,0]}}')).toBeNull();
  });
});
