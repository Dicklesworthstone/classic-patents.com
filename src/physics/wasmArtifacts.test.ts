import { describe, expect, test } from "bun:test";
import { decodeDaimlerMarineWasmStep } from "./daimlerWasm";
import { decodeDaVinciTopologyWasmStep } from "./daVinciWasm";
import { decodeEdisonRadiativeWasmStep } from "./edisonWasm";
import { decodeFlyerState } from "./flyerWasm";
import { decodeGoddardApparatusWasmStep, decodeGoddardWasmStep } from "./goddardWasm";
import { decodeHoweTopologyWasmStep } from "./howeWasm";
import { decodeOtisTopologyWasmStep } from "./otisWasm";
import { decodeOttoTopologyStep } from "./ottoWasm";
import { initialRoombaState, ROOMBA_COLLIDERS, ROOMBA_ROOM } from "./roombaKernel";
import { decodeRoombaWasmStep } from "./roombaWasm";
import { decodeTeslaTransformerWasmStep } from "./teslaWasm";

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

  test("instantiates the source-bounded Otis multibody bundle and proves its refusal", async () => {
    const module = await import("../../public/wasm/fs-otis/fs_otis_wasm.js");
    const bytes = await wasmBytes("../../public/wasm/fs-otis/fs_otis_wasm_bg.wasm");
    expect(WebAssembly.validate(bytes)).toBe(true);
    await module.default({ module_or_path: bytes });

    const raise = decodeOtisTopologyWasmStep(
      module.otis_topology_step(0.55, 0, 1, true, false, true, true, true),
    );
    expect(raise?.scalar_joint_coordinates).toBe(12);
    expect(raise?.independent_drive_dofs).toBe(1);
    expect(raise?.platform_axis).toEqual([0, 1, 0]);
    expect(raise?.shipper_axis).toEqual([1, 0, 0]);
    expect(raise?.straight_belt_o_working).toBe(true);
    expect(raise?.counterpoise_position_normalized).toBeCloseTo(0.45, 12);

    const caught = decodeOtisTopologyWasmStep(
      module.otis_topology_step(0.55, 0, 1, false, false, true, true, true),
    );
    expect(caught?.pawls_f_engaged).toBe(true);
    expect(caught?.mechanism_mode).toBe("rope-failure-hook-lock");

    const counterfactual = decodeOtisTopologyWasmStep(
      module.otis_topology_step(0.55, 0, 1, false, false, false, true, true),
    );
    expect(counterfactual?.free_fall_counterfactual).toBe(true);
    expect(counterfactual?.platform_motion_direction).toBe(-1);

    const refused = JSON.parse(
      module.otis_topology_step(1.2, 0, 1, true, false, true, true, true),
    ) as { refusal?: { code: string; repairs: string[] } };
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

  test("instantiates the source-bounded Tesla distributed-wave bundle and proves its refusal", async () => {
    const module = await import("../../public/wasm/fs-tesla/fs_tesla_wasm.js");
    const bytes = await wasmBytes("../../public/wasm/fs-tesla/fs_tesla_wasm_bg.wasm");
    expect(WebAssembly.validate(bytes)).toBe(true);
    await module.default({ module_or_path: bytes });

    const transformerInputs = {
      frequencyHz: 925,
      propagationSpeedMps: 185_000 * 1609.344,
      conductorLengthM: 50 * 1609.344,
    };
    const result = decodeTeslaTransformerWasmStep(
      module.tesla_transformer_step(
        transformerInputs.frequencyHz,
        transformerInputs.propagationSpeedMps,
        transformerInputs.conductorLengthM,
      ),
      transformerInputs,
    );
    expect(result).not.toBeNull();
    expect(result?.wavelength_m).toBeCloseTo(200 * 1609.344, 8);
    expect(result?.quarter_wave_length_m).toBeCloseTo(50 * 1609.344, 8);
    expect(result?.electrical_length_rad).toBeCloseTo(Math.PI / 2, 12);
    expect(result?.length_error_m).toBeCloseTo(0, 8);

    const refused = JSON.parse(
      module.tesla_transformer_step(-10, 185_000 * 1609.344, 50 * 1609.344),
    ) as {
      refusal?: { code: string; ranked_repairs: string[] };
    };
    expect(refused.refusal?.code).toBe("input-outside-domain");
    expect(refused.refusal?.ranked_repairs.length).toBeGreaterThan(0);
  });

  test("instantiates the Otto fs-mbd composition and proves closure, timing, and refusal", async () => {
    const module = await import("../../public/wasm/fs-otto/fs_otto_wasm.js");
    const bytes = await wasmBytes("../../public/wasm/fs-otto/fs_otto_wasm_bg.wasm");
    expect(WebAssembly.validate(bytes)).toBe(true);
    await module.default({ module_or_path: bytes });

    const inputs = {
      crankAngleRad: 3.5 * Math.PI,
      crankRadius: 0.65,
      connectingRodLength: 2.4,
      engineRpm: 180,
    };
    const state = decodeOttoTopologyStep(
      module.otto_topology_step(
        inputs.crankAngleRad,
        inputs.crankRadius,
        inputs.connectingRodLength,
        inputs.engineRpm,
      ),
      inputs,
    );
    expect(state).not.toBeNull();
    expect(state?.scalarJointCoordinates).toBe(8);
    expect(state?.independentDriveDofs).toBe(1);
    expect(state?.connectingRodSpan).toBeCloseTo(inputs.connectingRodLength, 12);
    expect(state?.sideShaftAngleRad).toBeCloseTo(1.75 * Math.PI, 12);
    expect(state?.exhaustLiftNormalized).toBeCloseTo(1, 12);
    expect(state?.cyclePhase).toBe("exhaust");

    const refused = JSON.parse(module.otto_topology_step(0, 0.65, 0.65, 180)) as {
      refusal?: { code: string; repairs: string[] };
    };
    expect(refused.refusal?.code).toBe("impossible-linkage");
    expect(refused.refusal?.repairs.length).toBeGreaterThan(0);
  });

  test("instantiates the Roomba fs-mbd composition and proves motion, claim inversion, and refusal", async () => {
    const module = await import("../../public/wasm/fs-roomba/fs_roomba_wasm.js");
    const bytes = await wasmBytes("../../public/wasm/fs-roomba/fs_roomba_wasm_bg.wasm");
    expect(WebAssembly.validate(bytes)).toBe(true);
    await module.default({ module_or_path: bytes });

    const previous = initialRoombaState();
    const controls = {
      wheelSpeedMps: 0.3,
      turnRateRadSec: 1.5,
      roomWidth: ROOMBA_ROOM.width,
      roomHeight: ROOMBA_ROOM.height,
      sensorHeightInches: 0.5,
      opticalSensorEnabled: true,
    };
    const expected = { controls, previous, dt: 1 / 120, colliders: ROOMBA_COLLIDERS };
    const packet = new Float64Array(18 + ROOMBA_COLLIDERS.length * 4);
    packet.set([
      1,
      expected.dt,
      controls.wheelSpeedMps,
      controls.turnRateRadSec,
      controls.roomWidth,
      controls.roomHeight,
      controls.sensorHeightInches,
      -1,
      1,
      previous.x,
      previous.y,
      previous.heading,
      0,
      previous.timeInMode,
      previous.randomSeed,
      previous.leftWheelAngleRad,
      previous.rightWheelAngleRad,
      previous.sideBrushAngleRad,
    ]);
    ROOMBA_COLLIDERS.forEach((collider, index) => {
      packet.set([collider.x, collider.y, collider.w, collider.h], 18 + index * 4);
    });

    const raw = module.roomba_step(packet);
    const state = decodeRoombaWasmStep(raw, expected);
    expect(state).not.toBeNull();
    expect(state?.runtimeSource).toBe("wasm");
    expect(state?.x).toBeGreaterThan(0);
    expect(state?.heading).toBeGreaterThan(0);
    expect(state?.surfaceOverlapFraction).toBe(1);
    expect(state?.redirectReason).toBe("none");

    const cliffPacket = packet.slice();
    cliffPacket[6] = 2;
    const cliffExpected = {
      ...expected,
      controls: { ...controls, sensorHeightInches: 2 },
    };
    const cliff = decodeRoombaWasmStep(module.roomba_step(cliffPacket), cliffExpected);
    expect(cliff?.surfacePresent).toBe(false);
    expect(cliff?.redirectReason).toBe("surface-absent");
    expect(cliff?.mode).toBe("backup");

    cliffPacket[8] = 0;
    const claimInversion = decodeRoombaWasmStep(module.roomba_step(cliffPacket), {
      ...cliffExpected,
      controls: { ...cliffExpected.controls, opticalSensorEnabled: false },
    });
    expect(claimInversion?.opticalSensorEnabled).toBe(false);
    expect(claimInversion?.redirectReason).toBe("none");
    expect(claimInversion?.mode).toBe("spiral");

    const malformed = JSON.parse(module.roomba_step(packet.subarray(0, 17))) as {
      refusal?: { code: string; repairs: string[] };
    };
    expect(malformed.refusal?.code).toBe("malformed-packet");
    expect(malformed.refusal?.repairs.length).toBeGreaterThan(0);

    const oversized = new Float64Array(18 + 65 * 4);
    oversized.set(packet.subarray(0, 18));
    const bounded = JSON.parse(module.roomba_step(oversized)) as {
      refusal?: { code: string; repairs: string[] };
    };
    expect(bounded.refusal?.code).toBe("resource-bound");

    const wrongWheel = JSON.parse(raw) as { ok: { left_wheel_speed_mps: number } };
    wrongWheel.ok.left_wheel_speed_mps += 1;
    expect(decodeRoombaWasmStep(JSON.stringify(wrongWheel), expected)).toBeNull();

    const wrongHeading = JSON.parse(raw) as { ok: { heading_rad: number } };
    wrongHeading.ok.heading_rad += 0.1;
    expect(decodeRoombaWasmStep(JSON.stringify(wrongHeading), expected)).toBeNull();

    const wrongSeed = JSON.parse(raw) as { ok: { random_seed: number } };
    wrongSeed.ok.random_seed += 1;
    expect(decodeRoombaWasmStep(JSON.stringify(wrongSeed), expected)).toBeNull();

    const falseClearReceipt = JSON.parse(raw) as {
      ok: { contact_normal_x: number };
    };
    falseClearReceipt.ok.contact_normal_x = 1;
    expect(decodeRoombaWasmStep(JSON.stringify(falseClearReceipt), expected)).toBeNull();

    const contactPart = ROOMBA_COLLIDERS[0];
    const contactPrevious = {
      ...previous,
      x: contactPart.x,
      y: contactPart.y,
      mode: "straight" as const,
      timeInMode: 0.2,
    };
    const contactPacket = packet.slice();
    contactPacket[9] = contactPrevious.x;
    contactPacket[10] = contactPrevious.y;
    contactPacket[12] = 1;
    contactPacket[13] = contactPrevious.timeInMode;
    const contactExpected = { ...expected, previous: contactPrevious };
    const contactRaw = module.roomba_step(contactPacket);
    const contact = decodeRoombaWasmStep(contactRaw, contactExpected);
    expect(contact?.contactPartId).toBe(contactPart.id);
    const reversedContactNormal = JSON.parse(contactRaw) as {
      ok: { contact_normal_x: number; contact_normal_y: number };
    };
    reversedContactNormal.ok.contact_normal_x *= -1;
    reversedContactNormal.ok.contact_normal_y *= -1;
    expect(decodeRoombaWasmStep(JSON.stringify(reversedContactNormal), contactExpected)).toBeNull();

    const shiftedContact = JSON.parse(contactRaw) as {
      ok: { x_m: number; y_m: number };
    };
    shiftedContact.ok.y_m += 0.01;
    expect(decodeRoombaWasmStep(JSON.stringify(shiftedContact), contactExpected)).toBeNull();

    const penetrating = JSON.parse(raw) as {
      ok: { x_m: number; y_m: number };
    };
    penetrating.ok.x_m = ROOMBA_COLLIDERS[0].x;
    penetrating.ok.y_m = ROOMBA_COLLIDERS[0].y;
    expect(decodeRoombaWasmStep(JSON.stringify(penetrating), expected)).toBeNull();

    const contradictoryEnvelope = JSON.parse(raw) as Record<string, unknown>;
    contradictoryEnvelope.refusal = { code: "contradictory-owner-envelope" };
    expect(decodeRoombaWasmStep(JSON.stringify(contradictoryEnvelope), expected)).toBeNull();
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
    expect(
      decodeOttoTopologyStep("not json", {
        crankAngleRad: 0,
        crankRadius: 0.65,
        connectingRodLength: 2.4,
        engineRpm: 180,
      }),
    ).toBeNull();
    expect(decodeOtisTopologyWasmStep("not json")).toBeNull();
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

    expect(decodeTeslaTransformerWasmStep("not json")).toBeNull();
    expect(decodeEdisonRadiativeWasmStep("not json")).toBeNull();
    expect(decodeEdisonRadiativeWasmStep('{"ok":{"voltage_v":110}}')).toBeNull();
    expect(decodeTeslaTransformerWasmStep('{"ok":{"wavelength_m":321868.8}}')).toBeNull();
    expect(
      decodeTeslaTransformerWasmStep(
        '{"ok":{"wavelength_m":321868.8,"quarter_wave_length_m":80467.2,"electrical_length_rad":1.5707963267948966,"quarter_wave_error_rad":0,"length_error_m":0,"length_ratio":1,"remote_terminal_profile_fraction":2}}',
      ),
    ).toBeNull();
    expect(
      decodeTeslaTransformerWasmStep(
        '{"ok":{"wavelength_m":321868.8,"quarter_wave_length_m":80467.2,"electrical_length_rad":1.5707963267948966,"quarter_wave_error_rad":0,"length_error_m":0,"length_ratio":1,"remote_terminal_profile_fraction":null}}',
      ),
    ).toBeNull();
    expect(
      decodeTeslaTransformerWasmStep(
        `{"ok":{"wavelength_m":321868.8,"quarter_wave_length_m":80467.2,"electrical_length_rad":${Math.PI / 3},"quarter_wave_error_rad":${-Math.PI / 6},"length_error_m":0,"length_ratio":1,"remote_terminal_profile_fraction":${Math.sin(Math.PI / 3)}}}`,
      ),
    ).toBeNull();
    expect(
      decodeTeslaTransformerWasmStep(
        '{"ok":{"wavelength_m":321868.8,"quarter_wave_length_m":80467.2,"electrical_length_rad":1.5707963267948966,"quarter_wave_error_rad":0,"length_error_m":0,"length_ratio":1,"remote_terminal_profile_fraction":1}}',
        {
          frequencyHz: 1000,
          propagationSpeedMps: 185_000 * 1609.344,
          conductorLengthM: 50 * 1609.344,
        },
      ),
    ).toBeNull();

    expect(decodeFlyerState("not json")).toBeNull();
    expect(decodeFlyerState('{"ok":{"quaternion":[1,0,0],"omega_body":[0,0,0]}}')).toBeNull();
    expect(decodeFlyerState('{"ok":{"quaternion":[2,0,0,0],"omega_body":[0,0,0]}}')).toBeNull();
    expect(decodeFlyerState('{"ok":{"quaternion":[1,0,0,0],"omega_body":[0,null,0]}}')).toBeNull();

    expect(
      decodeRoombaWasmStep("not json", {
        controls: {
          wheelSpeedMps: 0.3,
          turnRateRadSec: 1.5,
          roomWidth: ROOMBA_ROOM.width,
          roomHeight: ROOMBA_ROOM.height,
        },
        previous: initialRoombaState(),
        dt: 1 / 120,
        colliders: ROOMBA_COLLIDERS,
      }),
    ).toBeNull();
  });
});
