import { describe, expect, test } from "bun:test";
import { CRUMP_FDM_DEFAULT_CONTROLS } from "./crumpFdmKernel";
import { decodeCrumpFdmWasmStep, stepCrumpFdmPhysics } from "./crumpFdmWasm";

const VALID_RECEIPT = JSON.stringify({
  ok: {
    capillary_owner: "fs-flux::capillary::step_newtonian_circular_capillary",
    thermal_owner: "fs-conduction::reduced_slab::step_first_mode_slab_cooling",
    pressure_drop_pa: 2_887_718.555,
    wall_shear_rate_per_s: 644.577,
    hydraulic_power_w: 0.01169,
    cooling_time_constant_s: 0.0494,
    time_to_threshold_s: 0.045,
    threshold_temperature_check_k: 378.15,
    capillary_boundary: "newtonian-incompressible-fully-developed-laminar-no-slip-circular-land",
    thermal_boundary: "one-dimensional-fixed-boundary-first-mode-screen-no-phase-change",
  },
});

describe("Crump FDM generic FrankenSim browser boundary", () => {
  test("admits a complete owner receipt", () => {
    const decoded = decodeCrumpFdmWasmStep(VALID_RECEIPT);
    expect(decoded?.capillary_owner).toStartWith("fs-flux::capillary");
    expect(decoded?.thermal_owner).toStartWith("fs-conduction::reduced_slab");
  });

  test("rejects partial, mistyped, and physically invalid receipts", () => {
    expect(decodeCrumpFdmWasmStep("{}")).toBeNull();
    expect(
      decodeCrumpFdmWasmStep(
        VALID_RECEIPT.replace(
          "fs-flux::capillary::step_newtonian_circular_capillary",
          "host-owned-capillary",
        ),
      ),
    ).toBeNull();
    expect(decodeCrumpFdmWasmStep(VALID_RECEIPT.replace("378.15", "377.15"))).toBeNull();
  });

  test("cold-start fallback is finite, explicit, and equation-owned", () => {
    const state = stepCrumpFdmPhysics(CRUMP_FDM_DEFAULT_CONTROLS);
    expect(state.runtimeSource).toBe("ts-fallback");
    expect(state.capillaryOwner).toBe("fs-flux::capillary::step_newtonian_circular_capillary");
    expect(state.thermalOwner).toBe("fs-conduction::reduced_slab::step_first_mode_slab_cooling");
    expect(Number.isFinite(state.nozzlePressureDropMPa)).toBe(true);
    expect(Number.isFinite(state.timeToGlassTransitionSec)).toBe(true);
  });
});
