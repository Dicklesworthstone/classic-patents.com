import { expect, test } from "bun:test";

test("concurrent WASM consumers share one in-flight load and receive the final source", async () => {
  const code = String.raw`
    const generic = await import("./src/physics/genericWasm.ts");
    const goddard = await import("./src/physics/goddardWasm.ts");
    const davinci = await import("./src/physics/daVinciWasm.ts");
    const edison = await import("./src/physics/edisonWasm.ts");
    const tesla = await import("./src/physics/teslaWasm.ts");
    const flyer = await import("./src/physics/flyerWasm.ts");
    const { FrankenSimEngine } = await import("./src/physics/engine.ts");
    Object.defineProperty(globalThis, "window", { configurable: true, value: {} });

    const init = "export default async function init() {}";
    const sources = {
      generic: [
        init,
        "export function ga_motor_orbit(n, s) { return new Float64Array(2 + n * s * 3); }",
        "export function heat_frames(n, f) { return new Float64Array(n * n * f); }",
        "export const wave2d_frames = heat_frames;",
        "export function fluid_frames(n, f) { return new Float64Array(n * n * f); }",
        "export function cyclic_symmetry(n) { return new Float64Array(1 + 4 * n); }",
        "export function laplacian_modes(n, k) { return new Float64Array(k + k * n); }",
      ].join("\n"),
      goddard: [
        init,
        "export function goddard_apparatus_step() {",
        "  return JSON.stringify({ ok: { primary_quaternion: [1, 0, 0, 0], gyro_quaternion: [1, 0, 0, 0], primary_angular_velocity_rad_per_sec: 12.56, gyro_angular_velocity_rad_per_sec: 628.3, camera_support_angular_velocity_rad_per_sec: 0, primary_rim_speed_per_radius_mps_per_m: 12.56, tube_length_ratio: 4.5, claim_2_ratio_margin: 1.5, claim_2_satisfied: true, claim_1_sequence_satisfied: true, auxiliary_nested: true, gyro_enabled: true } });",
        "}",
        "export function goddard_rocket_step() {",
        "  return JSON.stringify({ ok: { chamber_pressure_psi: 350, chamber_pressure_pa: 2413166, exhaust_velocity_mps: 1657, thrust_newtons: 2983, specific_impulse_sec: 169, mach_exit: 2 } });",
        "}",
      ].join("\n"),
      davinci: [
        init,
        "export function davinci_topology_step() {",
        "  return JSON.stringify({ ok: { joint_dofs: 6, base_yaw_axis: [0, 1, 0], carriage_pitch_axis: [1, 0, 0], insertion_axis: [0, -1, 0], distal_pitch_axis: [1, 0, 0], distal_yaw_axis: [0, 0, 1], tool_roll_axis: [0, 1, 0], base_yaw_rad: 0, carriage_pitch_rad: 0, distal_pitch_rad: 0, distal_yaw_rad: 0, tool_roll_rad: 0, insertion_normalized: 0, compatibility_identifier_present: true } });",
        "}",
      ].join("\n"),
      edison: [
        init,
        "export function edison_radiative_step() {",
        "  return JSON.stringify({ ok: { voltage_v: 110, current_a: 0.7333333333333333, joule_power_w: 80.66666666666666, filament_temperature_k: 1950, radiative_power_w: 80.66666666666666, relative_energy_closure: 0 } });",
        "}",
      ].join("\n"),
      tesla: [
        init,
        "export function tesla_coil_step() {",
        "  return JSON.stringify({ ok: { resonant_freq_khz: 100, secondary_potential_mv: 1.2, streamer_length_inches: 33.6, streamer_length_meters: 0.853 } });",
        "}",
      ].join("\n"),
      flyer: [init, "export function flyer_hello_spin() { return '{}'; }"].join("\n"),
    };
    const counts = new Map();
    globalThis.fetch = async (input) => {
      const url = String(input);
      counts.set(url, (counts.get(url) ?? 0) + 1);
      const key = url.includes("fs-generic")
        ? "generic"
        : url.includes("fs-goddard")
          ? "goddard"
          : url.includes("fs-edison")
            ? "edison"
          : url.includes("fs-davinci")
            ? "davinci"
          : url.includes("fs-tesla")
            ? "tesla"
            : "flyer";
      return new Response(sources[key], { status: 200 });
    };

    const cases = [
      [generic.ensureGenericWasm, "wasm", generic.genericKernelSource],
      [goddard.ensureGoddardWasm, "wasm", goddard.goddardKernelSource],
      [edison.ensureEdisonWasm, "wasm", edison.edisonKernelSource],
      [davinci.ensureDaVinciTopologyWasm, "wasm", davinci.daVinciTopologyKernelSource],
      [tesla.ensureTeslaWasm, "wasm", tesla.teslaKernelSource],
      [flyer.ensureFlyerWasm, "wasm", flyer.flyerKernelSource],
    ];
    for (const [load, expected, readSource] of cases) {
      const results = await Promise.all([load(), load(), load()]);
      if (results.some((result) => result !== expected) || readSource() !== expected) {
        throw new Error("a concurrent caller observed an intermediate source");
      }
    }
    if (counts.size !== 6 || [...counts.values()].some((count) => count !== 1)) {
      throw new Error("a loader performed duplicate glue fetches");
    }
    if (FrankenSimEngine.stepGoddardApparatus(0, 120, 6000, 4.5, 0, false, true).runtimeSource !== "wasm") {
      throw new Error("Goddard loaded the module without accepting the source apparatus WASM step");
    }
    if (
      FrankenSimEngine.stepTeslaCoil(100, 15, 12, 145, 0.18, 850).runtimeSource !== "wasm"
    ) {
      throw new Error("Tesla loaded the module without accepting a valid WASM step");
    }
    console.log("loader-concurrency-ok");
  `;
  const child = Bun.spawn({
    cmd: [process.execPath, "-e", code],
    cwd: process.cwd(),
    stdout: "pipe",
    stderr: "pipe",
  });
  const [exitCode, stdout, stderr] = await Promise.all([
    child.exited,
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
  ]);

  expect(stderr).toBe("");
  expect(exitCode).toBe(0);
  expect(stdout.trim()).toBe("loader-concurrency-ok");
});
