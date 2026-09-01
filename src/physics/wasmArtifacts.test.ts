import { describe, expect, test } from "bun:test";
import { decodeDaimlerMarineWasmStep } from "./daimlerWasm";
import { decodeDaVinciTopologyWasmStep } from "./daVinciWasm";
import { decodeEdisonRadiativeWasmStep } from "./edisonWasm";
import { decodeFlyerState } from "./flyerWasm";
import { decodeGoddardApparatusWasmStep, decodeGoddardWasmStep } from "./goddardWasm";
import { decodeHoweTopologyWasmStep } from "./howeWasm";
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

  test("instantiates the source-bounded Goddard apparatus bundle and proves its refusal", async () => {
    const module = await import("../../public/wasm/fs-goddard/fs_goddard_wasm.js");
    const bytes = await wasmBytes("../../public/wasm/fs-goddard/fs_goddard_wasm_bg.wasm");
    expect(WebAssembly.validate(bytes)).toBe(true);
    await module.default({ module_or_path: bytes });

    const apparatus = decodeGoddardApparatusWasmStep(
      module.goddard_apparatus_step(0.25, 120, 6_000, 4.5, 0, false, true),
    );
    expect(apparatus).not.toBeNull();
    expect(apparatus?.primary_quaternion).toHaveLength(4);
    expect(apparatus?.gyro_quaternion).toHaveLength(4);
    expect(apparatus?.claim_2_satisfied).toBe(true);
    expect(apparatus?.auxiliary_nested).toBe(true);

    const brokenClaim = decodeGoddardApparatusWasmStep(
      module.goddard_apparatus_step(0.25, 120, 6_000, 2.5, 0.5, false, false),
    );
    expect(brokenClaim?.claim_2_satisfied).toBe(false);
    expect(brokenClaim?.claim_1_sequence_satisfied).toBe(false);

    const stoppedGyro = decodeGoddardApparatusWasmStep(
      module.goddard_apparatus_step(0.25, 120, 0, 4.5, 0, false, true),
    );
    expect(stoppedGyro?.camera_support_angular_velocity_rad_per_sec).toBeGreaterThan(0);

    const apparatusRefusal = JSON.parse(
      module.goddard_apparatus_step(Number.NaN, 120, 6_000, 4.5, 0, false, true),
    ) as { refusal?: { code: string; ranked_repairs: string[] } };
    expect(apparatusRefusal.refusal?.code).toBe("non-finite-input");
    expect(apparatusRefusal.refusal?.ranked_repairs.length).toBeGreaterThan(0);

    // The older export remains available only for the separately catalogued
    // adjacent liquid-propellant interpretation.
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

  test("instantiates the source-bounded Daimler marine bundle and proves its refusal", async () => {
    const module = await import("../../public/wasm/fs-daimler/fs_daimler_wasm.js");
    const bytes = await wasmBytes("../../public/wasm/fs-daimler/fs_daimler_wasm_bg.wasm");
    expect(WebAssembly.validate(bytes)).toBe(true);
    await module.default({ module_or_path: bytes });

    const ahead = decodeDaimlerMarineWasmStep(module.daimler_marine_step(1, false));
    expect(ahead).not.toBeNull();
    expect(ahead?.shaft_translation_along_axis_normalized).toBe(-1);
    expect(ahead?.shaft_axis).toEqual([1, 0, 0]);
    expect(ahead?.ahead_coupling_engaged).toBe(true);
    expect(ahead?.astern_gearing_engaged).toBe(false);

    const astern = decodeDaimlerMarineWasmStep(module.daimler_marine_step(-1, true));
    expect(astern?.shaft_translation_along_axis_normalized).toBe(1);
    expect(astern?.ahead_coupling_engaged).toBe(false);
    expect(astern?.astern_gearing_engaged).toBe(true);
    expect(astern?.propeller_rotation_sign).toBe(-1);
    expect(astern?.passive_fore_aft_cooling_path_present).toBe(true);
    expect(astern?.cooling_pump_active).toBe(true);

    const refused = JSON.parse(module.daimler_marine_step(2, false)) as {
      refusal?: { code: string; repairs: string[] };
    };
    expect(refused.refusal?.code).toBe("input-outside-domain");
    expect(refused.refusal?.repairs.length).toBeGreaterThan(0);
  });

  test("instantiates the source-bounded da Vinci joint bundle and proves its refusal", async () => {
    const module = await import("../../public/wasm/fs-davinci/fs_davinci_wasm.js");
    const bytes = await wasmBytes("../../public/wasm/fs-davinci/fs_davinci_wasm_bg.wasm");
    expect(WebAssembly.validate(bytes)).toBe(true);
    await module.default({ module_or_path: bytes });

    const topology = decodeDaVinciTopologyWasmStep(
      module.davinci_topology_step(0.2, -0.3, 0.4, -0.1, 1.2, 0.25, true),
    );
    expect(topology).not.toBeNull();
    expect(topology?.joint_dofs).toBe(6);
    expect(topology?.base_yaw_axis).toEqual([0, 1, 0]);
    expect(topology?.insertion_axis).toEqual([0, -1, 0]);
    expect(topology?.compatibility_identifier_present).toBe(true);

    const absent = decodeDaVinciTopologyWasmStep(
      module.davinci_topology_step(0.2, -0.3, 0.4, -0.1, 1.2, -0.4, false),
    );
    expect(absent?.base_yaw_rad).toBe(0.2);
    expect(absent?.insertion_normalized).toBe(-0.4);
    expect(absent?.compatibility_identifier_present).toBe(false);

    const refused = JSON.parse(module.davinci_topology_step(0, 0, 0, 0, 0, 1.2, true)) as {
      refusal?: { code: string; repairs: string[] };
    };
    expect(refused.refusal?.code).toBe("input-outside-domain");
    expect(refused.refusal?.repairs.length).toBeGreaterThan(0);
  });

  test("instantiates the source-bounded Howe multibody bundle and proves its refusal", async () => {
    const module = await import("../../public/wasm/fs-howe/fs_howe_wasm.js");
    const bytes = await wasmBytes("../../public/wasm/fs-howe/fs_howe_wasm_bg.wasm");
    expect(WebAssembly.validate(bytes)).toBe(true);
    await module.default({ module_or_path: bytes });

    const pass = decodeHoweTopologyWasmStep(module.howe_topology_step(1.5 * Math.PI, 0.65, true));
    expect(pass?.scalar_joint_coordinates).toBe(7);
    expect(pass?.independent_drive_dofs).toBe(1);
    expect(pass?.main_shaft_axis).toEqual([0, 0, 1]);
    expect(pass?.shuttle_axis).toEqual([1, 0, 0]);
    expect(pass?.shuttle_passes_loop).toBe(true);
    expect(pass?.needle_eye_offset_in).toBe(0.125);
    expect(pass?.baster_point_pitch_in).toBe(0.75);

    const removedClaim = decodeHoweTopologyWasmStep(
      module.howe_topology_step(1.5 * Math.PI, 0.65, false),
    );
    expect(removedClaim?.shuttle_passes_loop).toBe(false);
    expect(removedClaim?.shuttle_track_offset_normalized).toBe(0.55);

    const refused = JSON.parse(module.howe_topology_step(0, 1.2, true)) as {
      refusal?: { code: string; repairs: string[] };
    };
    expect(refused.refusal?.code).toBe("input-outside-domain");
    expect(refused.refusal?.repairs.length).toBeGreaterThan(0);
  });

  test("instantiates the Edison fs-conduction balance and proves its refusal", async () => {
    const module = await import("../../public/wasm/fs-edison/fs_edison_wasm.js");
    const bytes = await wasmBytes("../../public/wasm/fs-edison/fs_edison_wasm_bg.wasm");
    expect(WebAssembly.validate(bytes)).toBe(true);
    await module.default({ module_or_path: bytes });

    const state = decodeEdisonRadiativeWasmStep(
      module.edison_radiative_step(110, 150, Math.PI * 0.0001778 * 0.22, 0.8, 293.15),
    );
    expect(state).not.toBeNull();
    expect(state?.runtimeSource).toBe("wasm");
    expect(state?.filament_temperature_k).toBeGreaterThan(1800);
    expect(state?.relative_energy_closure).toBeLessThan(1e-12);

    const refused = JSON.parse(module.edison_radiative_step(110, 150, 0, 0.8, 293.15)) as {
      refusal?: { code: string; repairs: string[] };
    };
    expect(refused.refusal?.code).toBe("non-positive-area");
    expect(refused.refusal?.repairs.length).toBeGreaterThan(0);
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
    expect(decodeDaimlerMarineWasmStep("not json")).toBeNull();
    expect(decodeDaimlerMarineWasmStep('{"ok":{"shaft_axis":[1,0,0]}}')).toBeNull();
    expect(
      decodeDaimlerMarineWasmStep(
        '{"ok":{"shaft_translation_along_axis_normalized":-1,"shaft_axis":[1,0,0],"shaft_joint_dofs":1,"motor_rotation_sign":1,"propeller_rotation_sign":1,"ahead_coupling_engaged":true,"astern_gearing_engaged":true,"neutral":false,"thrust_can_maintain_ahead_contact":true,"passive_fore_aft_cooling_path_present":true,"cooling_pump_active":false}}',
      ),
    ).toBeNull();
    expect(decodeGoddardApparatusWasmStep("not json")).toBeNull();
    expect(decodeGoddardApparatusWasmStep('{"ok":{"primary_quaternion":[1,0,0,0]}}')).toBeNull();
    expect(
      decodeGoddardApparatusWasmStep(
        '{"ok":{"primary_quaternion":[2,0,0,0],"gyro_quaternion":[1,0,0,0],"primary_angular_velocity_rad_per_sec":1,"gyro_angular_velocity_rad_per_sec":2,"camera_support_angular_velocity_rad_per_sec":0,"primary_rim_speed_per_radius_mps_per_m":1,"tube_length_ratio":4.5,"claim_2_ratio_margin":1.5,"claim_2_satisfied":true,"claim_1_sequence_satisfied":true,"auxiliary_nested":true,"gyro_enabled":true}}',
      ),
    ).toBeNull();
    expect(decodeGoddardWasmStep("not json")).toBeNull();
    expect(decodeHoweTopologyWasmStep("not json")).toBeNull();
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
    expect(decodeEdisonRadiativeWasmStep("not json")).toBeNull();
    expect(decodeEdisonRadiativeWasmStep('{"ok":{"voltage_v":110}}')).toBeNull();
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
