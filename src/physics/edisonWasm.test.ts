import { describe, expect, test } from "bun:test";
import {
  decodeEdisonRadiativeWasmStep,
  EDISON_SOURCE_FILAMENT_DIAMETER_M,
  edisonFilamentAreaM2,
  stepEdisonRadiativeBalance,
} from "./edisonWasm";

describe("Edison fs-conduction browser boundary", () => {
  test("derives cylindrical area from the source's seven-thousandths-inch wire", () => {
    expect(EDISON_SOURCE_FILAMENT_DIAMETER_M).toBeCloseTo(0.0001778, 10);
    expect(edisonFilamentAreaM2(22)).toBeCloseTo(Math.PI * 0.0001778 * 0.22, 12);
  });

  test("fallback closes the same declared gray-body energy balance", () => {
    const state = stepEdisonRadiativeBalance({
      voltageV: 110,
      hotResistanceOhm: 150,
      filamentLengthCm: 22,
    });
    expect(state).not.toBeNull();
    expect(state?.runtimeSource).toBe("ts-fallback");
    expect(state?.current_a).toBeCloseTo(110 / 150, 12);
    expect(state?.filament_temperature_k).toBeGreaterThan(1800);
    expect(state?.filament_temperature_k).toBeLessThan(2200);
    expect(state?.relative_energy_closure).toBeLessThan(1e-12);
  });

  test("decoder fails closed on malformed, non-finite, or non-closing owner output", () => {
    expect(decodeEdisonRadiativeWasmStep("not json")).toBeNull();
    expect(decodeEdisonRadiativeWasmStep('{"ok":{"voltage_v":110}}')).toBeNull();
    expect(
      decodeEdisonRadiativeWasmStep(
        '{"ok":{"voltage_v":110,"current_a":0.7333333333333333,"joule_power_w":80.66666666666666,"filament_temperature_k":1950,"radiative_power_w":80.66666666666666,"relative_energy_closure":0}}',
      ),
    ).not.toBeNull();
    expect(
      decodeEdisonRadiativeWasmStep(
        '{"ok":{"voltage_v":110,"current_a":0.7,"joule_power_w":80,"filament_temperature_k":1950,"radiative_power_w":80,"relative_energy_closure":0}}',
      ),
    ).toBeNull();
    expect(
      decodeEdisonRadiativeWasmStep(
        JSON.stringify({
          ok: {
            voltage_v: 110,
            current_a: 1,
            joule_power_w: 110,
            filament_temperature_k: 1900,
            radiative_power_w: 80,
            relative_energy_closure: 0,
          },
        }),
      ),
    ).toBeNull();
  });

  test("invalid declared domains refuse before crossing the runtime seam", () => {
    expect(
      stepEdisonRadiativeBalance({
        voltageV: 110,
        hotResistanceOhm: 0,
        filamentLengthCm: 22,
      }),
    ).toBeNull();
    expect(
      stepEdisonRadiativeBalance({
        voltageV: 110,
        hotResistanceOhm: 150,
        filamentLengthCm: 22,
        emissivity: 1.2,
      }),
    ).toBeNull();
  });
});
