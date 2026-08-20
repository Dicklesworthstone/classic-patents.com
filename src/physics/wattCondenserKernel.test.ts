import { describe, expect, test } from "bun:test";
import { stepWattCondenser, WATT_DEFAULT_CONTROLS } from "./wattCondenserKernel";

describe("James Watt Separate Condenser Physics Kernel (GB 913 / 1769)", () => {
  test("computes baseline Boulton & Watt pumping engine outputs accurately", () => {
    const out = stepWattCondenser(WATT_DEFAULT_CONTROLS);

    // Deep vacuum in separate condenser (< 6 kPa absolute / ~28+ inches Hg)
    expect(out.condenserPressureAbsKpa).toBeLessThan(8.0);
    expect(out.vacuumDepthInchesHg).toBeGreaterThan(27.0);

    // Cylinder kept hot at steam saturation temperature (Principle 1)
    expect(out.cylinderWallTempC).toBeGreaterThanOrEqual(100.0);
    expect(out.steamTempC).toBeGreaterThanOrEqual(100.0);

    // Realistic indicated power for 38" cylinder, 6ft stroke, 14 spm
    expect(out.indicatedHorsepower).toBeGreaterThan(20.0);
    expect(out.indicatedHorsepower).toBeLessThan(50.0);
    expect(out.indicatedPowerKw).toBeGreaterThan(15.0);

    // Thermal efficiency in the ~3.0% to 5.0% historical range
    expect(out.thermalEfficiencyPct).toBeGreaterThan(2.5);
    expect(out.thermalEfficiencyPct).toBeLessThan(6.0);

    // Specific fuel consumption ~ 2.0 to 4.0 kg coal / kWh
    expect(out.specificFuelConsumptionKgPerKwh).toBeGreaterThan(1.5);
    expect(out.specificFuelConsumptionKgPerKwh).toBeLessThan(5.0);

    // Substantial mine water pumping delivery (> 15,000 gallons/hour at 183m)
    expect(out.waterPumpedGallonsPerHour).toBeGreaterThan(10000);
    expect(out.coalSavedTonsPerYear).toBeGreaterThan(100);
  });

  test("demonstrates Newcomen thermal quench penalty when separate condenser is disabled", () => {
    const wattMode = stepWattCondenser({
      ...WATT_DEFAULT_CONTROLS,
      hasSeparateCondenser: true,
      hasSteamJacket: true,
    });
    const newcomenMode = stepWattCondenser({
      ...WATT_DEFAULT_CONTROLS,
      hasSeparateCondenser: false,
      hasSteamJacket: false,
    });

    // Newcomen cylinder wall suffers massive cyclic chilling
    expect(newcomenMode.cylinderWallTempC).toBeLessThan(wattMode.cylinderWallTempC - 25.0);

    // Newcomen requires vastly more heat input and coal per unit power
    expect(newcomenMode.heatInputRateKw).toBeGreaterThan(wattMode.heatInputRateKw * 3.0);
    expect(newcomenMode.coalConsumptionKgPerHour).toBeGreaterThan(
      wattMode.coalConsumptionKgPerHour * 3.0,
    );
    expect(newcomenMode.thermalEfficiencyPct).toBeLessThan(wattMode.thermalEfficiencyPct * 0.4);
    expect(newcomenMode.newcomenFuelMultiplier).toBeGreaterThan(3.0);
  });

  test("responds monotonically and stably across full parameter sweeps", () => {
    // Boiler pressure sweep increases piston force and indicated power
    const lowP = stepWattCondenser({ boilerPressurePsi: 1.0 });
    const highP = stepWattCondenser({ boilerPressurePsi: 8.0 });
    expect(highP.pistonPistonForceKn).toBeGreaterThan(lowP.pistonPistonForceKn);
    expect(highP.indicatedPowerKw).toBeGreaterThan(lowP.indicatedPowerKw);

    // Higher condenser temperature degrades vacuum depth
    const coldCond = stepWattCondenser({ condenserTempC: 15 });
    const hotCond = stepWattCondenser({ condenserTempC: 55 });
    expect(coldCond.vacuumDepthInchesHg).toBeGreaterThan(hotCond.vacuumDepthInchesHg);
    expect(coldCond.indicatedPowerKw).toBeGreaterThan(hotCond.indicatedPowerKw);
  });
});
