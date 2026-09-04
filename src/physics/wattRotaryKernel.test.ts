import { describe, expect, test } from "bun:test";
import {
  canonicalWattGearRatio,
  createWattRotaryTransportUpdater,
  getWattRotaryTapeFrame,
  readWattRotaryControls,
  readWattRotaryRuntimeControls,
  stepWattRotaryEngine,
  WATT_ROTARY_KINEMATIC_GEOMETRY,
} from "./wattRotaryKernel";

describe("James Watt 1781 Sun & Planet Epicyclic Physics Kernel (GB 1306)", () => {
  test("computes exact 2:1 epicyclic speed multiplication for equal sun and planet gears", () => {
    const controls = readWattRotaryControls({ strokeRateSpm: 20, gearRatioNpOverNs: 1.0 });
    const telemetry = stepWattRotaryEngine(controls, 0);

    expect(telemetry.speedMultiplier).toBe(2.0);
    expect(telemetry.meanShaftRpm).toBe(40.0);
    expect(telemetry.cycleOmegaRadPerS).toBeCloseTo((20 * 2 * Math.PI) / 60, 6);
    expect(telemetry.meanShaftAngularVelocityRadS).toBeCloseTo((40 * 2 * Math.PI) / 60, 3);
    expect(telemetry.shaftRpm).not.toBe(telemetry.meanShaftRpm);
  });

  test("calculates declared-scenario piston force, indicated power, and horsepower in SI units", () => {
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

  test("keeps every moving wheel clear of the common foundation through a full orbit", () => {
    const geometry = WATT_ROTARY_KINEMATIC_GEOMETRY;
    const flywheelBottomY =
      geometry.sunCenterY - geometry.flywheelRadiusM - geometry.flywheelRimRadiusM;
    expect(flywheelBottomY - geometry.foundationTopY).toBeGreaterThanOrEqual(
      geometry.minimumMovingClearanceM,
    );

    for (const ratio of [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]) {
      const controls = readWattRotaryControls({ gearRatioNpOverNs: ratio });
      for (let sample = 0; sample <= 96; sample += 1) {
        const telemetry = stepWattRotaryEngine(controls, (3 * sample) / 96);
        const planetBottomY =
          geometry.sunCenterY + telemetry.planetPosY - telemetry.planetPitchRadiusM;
        expect(planetBottomY).toBeGreaterThan(geometry.foundationTopY);
      }
    }
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

  test("quantizes the public ratio control to buildable quarter-step gear pairs", () => {
    expect(canonicalWattGearRatio(-10)).toBe(0.5);
    expect(canonicalWattGearRatio(0.62)).toBe(0.5);
    expect(canonicalWattGearRatio(0.63)).toBe(0.75);
    expect(canonicalWattGearRatio(1.88)).toBe(2);
    expect(canonicalWattGearRatio(Number.NaN)).toBe(1);
  });

  test("closes the fixed rod and external epicyclic mesh through full cycles at every ratio", () => {
    for (const ratio of [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]) {
      const initial = stepWattRotaryEngine(
        readWattRotaryControls({ strokeRateSpm: 20, gearRatioNpOverNs: ratio }),
        0,
      );
      for (let sample = 0; sample <= 96; sample += 1) {
        const timeSec = (3 * sample) / 96;
        const telemetry = stepWattRotaryEngine(
          readWattRotaryControls({ strokeRateSpm: 20, gearRatioNpOverNs: ratio }),
          timeSec,
        );

        expect(Number.isFinite(telemetry.beamAngleRad)).toBe(true);
        expect(Math.abs(telemetry.connectingRodConstraintResidualM)).toBeLessThan(1e-10);
        expect(Math.abs(telemetry.gearMeshConstraintResidualRad)).toBeLessThan(1e-10);
        expect(telemetry.planetBodyAngleRad).toBeCloseTo(
          telemetry.connectingRodAngleRad - initial.connectingRodAngleRad,
          12,
        );
        expect(telemetry.sunShaftAngleRad).toBeCloseTo(
          telemetry.speedMultiplier * telemetry.planetOrbitAngleRad -
            ratio * telemetry.planetBodyAngleRad,
          12,
        );
        expect(telemetry.sunPitchRadiusM + telemetry.planetPitchRadiusM).toBeCloseTo(
          WATT_ROTARY_KINEMATIC_GEOMETRY.gearCenterDistanceM,
          12,
        );
        expect(telemetry.planetTeeth / telemetry.sunTeeth).toBe(ratio);
      }
    }
  });

  test("rocks the bolted planet with the rod and gives both gears the no-slip pitch velocity", () => {
    const dt = 1e-5;
    for (const ratio of [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]) {
      const controls = readWattRotaryControls({ strokeRateSpm: 20, gearRatioNpOverNs: ratio });
      for (const timeSec of [0.2, 0.8, 1.4, 2.2]) {
        const pose = stepWattRotaryEngine(controls, timeSec);
        const next = stepWattRotaryEngine(controls, timeSec + dt);

        expect((next.planetBodyAngleRad - pose.planetBodyAngleRad) / dt).toBeCloseTo(
          pose.planetAngularVelocityRadS,
          4,
        );
        expect(pose.sunShaftAngleRad).toBeCloseTo(
          pose.speedMultiplier * pose.planetOrbitAngleRad - ratio * pose.planetBodyAngleRad,
          12,
        );
        expect((next.sunShaftAngleRad - pose.sunShaftAngleRad) / dt).toBeCloseTo(
          pose.shaftAngularVelocityRadS,
          4,
        );

        const sunPitchVelocity = pose.sunPitchRadiusM * pose.shaftAngularVelocityRadS;
        const planetPitchVelocity =
          pose.gearCenterDistanceM * pose.cycleOmegaRadPerS -
          pose.planetPitchRadiusM * pose.planetAngularVelocityRadS;
        expect(sunPitchVelocity).toBeCloseTo(planetPitchVelocity, 10);
      }
    }
  });

  test("delivers exactly the net gear ratio after one complete rocking-rod cycle", () => {
    for (const ratio of [0.5, 1, 2]) {
      const controls = readWattRotaryControls({ strokeRateSpm: 20, gearRatioNpOverNs: ratio });
      const start = stepWattRotaryEngine(controls, 0);
      const end = stepWattRotaryEngine(controls, 3);

      expect(end.planetBodyAngleRad).toBeCloseTo(start.planetBodyAngleRad, 12);
      expect(end.sunShaftAngleRad - start.sunShaftAngleRad).toBeCloseTo(
        2 * Math.PI * (1 + ratio),
        12,
      );
    }
  });

  test("keeps one fixed-step transport state across running, held, and reset states", () => {
    let controls = readWattRotaryRuntimeControls({ strokeRateSpm: 20, isRunning: 1 });
    const updater = createWattRotaryTransportUpdater(() => controls);

    for (let tick = 0; tick < 10; tick += 1) updater({} as never, 1 / 60);
    const running = getWattRotaryTapeFrame();
    expect(running).not.toBeNull();
    expect(running?.timeSec).toBeCloseTo(10 / 60, 12);

    controls = readWattRotaryRuntimeControls({ strokeRateSpm: 20, isRunning: 0 });
    for (let tick = 0; tick < 6; tick += 1) updater({} as never, 1 / 60);
    expect(getWattRotaryTapeFrame()?.timeSec).toBeCloseTo(running?.timeSec ?? -1, 12);

    controls = readWattRotaryRuntimeControls({
      strokeRateSpm: 20,
      isRunning: 1,
      resetEpoch: 1,
    });
    updater({} as never, 1 / 60);
    expect(getWattRotaryTapeFrame()?.timeSec).toBeCloseTo(1 / 60, 12);
  });

  test("keeps the shaft angle continuous when the carrier crosses a revolution boundary", () => {
    const controls = readWattRotaryControls({ strokeRateSpm: 20, gearRatioNpOverNs: 0.5 });
    const before = stepWattRotaryEngine(controls, 3 - 1e-6);
    const boundary = stepWattRotaryEngine(controls, 3);
    const after = stepWattRotaryEngine(controls, 3 + 1e-6);

    expect(boundary.planetOrbitAngleRad).toBeCloseTo(2 * Math.PI, 12);
    expect(boundary.sunShaftAngleRad).toBeCloseTo(3 * Math.PI, 12);
    expect(boundary.sunShaftAngleDeg).toBeCloseTo(180, 10);
    expect(boundary.sunShaftAngleRad - before.sunShaftAngleRad).toBeGreaterThan(0);
    expect(after.sunShaftAngleRad - boundary.sunShaftAngleRad).toBeGreaterThan(0);
    expect(after.sunShaftAngleRad - boundary.sunShaftAngleRad).toBeCloseTo(
      boundary.sunShaftAngleRad - before.sunShaftAngleRad,
      10,
    );
  });

  test("is exactly replayable for equal inputs and simulation time", () => {
    const controls = readWattRotaryControls({
      strokeRateSpm: 26,
      boilerPressureKpa: 95,
      gearRatioNpOverNs: 1.75,
      flywheelMassKg: 4250,
    });
    expect(stepWattRotaryEngine(controls, 17.125)).toEqual(stepWattRotaryEngine(controls, 17.125));
  });
});
