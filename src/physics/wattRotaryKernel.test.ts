import { describe, expect, test } from "bun:test";
import { readWattRotaryControls, stepWattRotaryEngine } from "./wattRotaryKernel";

describe("James Watt 1781 Sun & Planet Epicyclic Physics Kernel (GB 1306)", () => {
  test("computes exact 2:1 epicyclic speed multiplication for equal sun and planet gears", () => {
    const controls = readWattRotaryControls({ strokeRateSpm: 20, gearRatioNpOverNs: 1.0 });
    const telemetry = stepWattRotaryEngine(controls, 0);

    expect(telemetry.speedMultiplier).toBe(2.0);
    expect(telemetry.shaftRpm).toBe(40.0);
    expect(telemetry.cycleOmegaRadPerS).toBeCloseTo((20 * 2 * Math.PI) / 60, 6);
    expect(telemetry.shaftAngularVelocityRadS).toBeCloseTo((40 * 2 * Math.PI) / 60, 3);
  });

  test("calculates authentic piston force, indicated power, and imperial horsepower in SI units", () => {
    const controls = readWattRotaryControls({
      strokeRateSpm: 20,
      boilerPressureKpa: 70,
      flywheelMassKg: 3500,
    });
    const telemetry = stepWattRotaryEngine(controls, 0.75); // quarter-cycle phase

    // Cylinder diameter 0.76 m, area ~0.4536 m^2 -> 70 kPa * 0.4536 m^2 ~ 31.7 kN
    expect(telemetry.pistonForceN).toBeGreaterThan(25000);
    expect(telemetry.pistonForceN).toBeLessThan(40000);

    // Indicated power at 20 SPM should be ~18 - 25 kW (~25 - 35 hp)
    expect(telemetry.meanPowerKw).toBeGreaterThan(10);
    expect(telemetry.meanPowerKw).toBeLessThan(40);
    expect(telemetry.brakeHorsepower).toBeGreaterThan(15);
    expect(telemetry.brakeHorsepower).toBeLessThan(50);
  });

  test("tracks planetary orbit coordinates and flywheel kinetic energy deterministically", () => {
    const controls = readWattRotaryControls({ strokeRateSpm: 20, flywheelMassKg: 3500 });

    const t0 = stepWattRotaryEngine(controls, 0.0);
    expect(t0.planetPosX).toBeCloseTo(0.0, 2);
    expect(t0.planetPosY).toBeCloseTo(-0.9, 2); // rOrbit = 0.45 + 0.45 = 0.9 m

    const tHalf = stepWattRotaryEngine(controls, 1.5); // t = 1.5s = half cycle at 20 SPM (period = 3s)
    expect(tHalf.planetPosX).toBeCloseTo(0.0, 2);
    expect(tHalf.planetPosY).toBeCloseTo(0.9, 2); // top dead center

    expect(t0.flywheelKineticEnergyJ).toBeGreaterThan(50000);
    expect(t0.speedFluctuationCoeff).toBeLessThan(0.25);
  });
});
