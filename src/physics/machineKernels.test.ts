import { describe, expect, test } from "bun:test";
import {
  ccdWellSvgDepth,
  LINOTYPE_CHARS_PER_LINE,
  sholesTypebarPose,
  stepCcdWells,
  stepEngelbartResolver,
  stepHoweLockstitch,
  stepHoweSewingMachine,
  stepMergenthalerLinotype,
  stepOtisElevator,
  stepRenoEscalator,
  stepSholesTypewriter,
} from "./machineKernels";

describe("Machine Kernels & Mechanical Kinematics", () => {
  test("stepCcdWells computes 3-phase bucket-brigade potential wells and charge transfer efficiency", () => {
    const res1 = stepCcdWells(1, 800, 10, 8);
    expect(res1.wells[0]).toBeGreaterThan(0);
    expect(res1.cte).toBeGreaterThan(0.999);
    expect(res1.ctePct).toBeCloseTo(res1.cte * 100, 4);
    expect(res1.packetOpacity).toBeCloseTo(0.35 + res1.cte * 0.55, 4);
    expect(res1.wellSvgDepths[0]).toBe(ccdWellSvgDepth(res1.wells[0], res1.fullWellElectrons));
    expect(res1.fullWellElectrons).toBeGreaterThan(50000);
    expect(res1.phasePeriodNs).toBeCloseTo(33.3, 1);

    const res2 = stepCcdWells(2, 800, 10, 8);
    expect(res2.wells[1]).toBeGreaterThan(0);

    const res3 = stepCcdWells(3, 800, 10, 8);
    expect(res3.wells[2]).toBeGreaterThan(0);
  });

  test("stepHoweSewingMachine and stepHoweLockstitch compute eye-pointed needle kinematics and shuttle loop capture", () => {
    const machine = stepHoweSewingMachine(300, 120, 3.5);
    expect(machine.stitchesPerMinute).toBe(300);
    expect(machine.stitchFrequencyHz).toBe(5);
    expect(machine.clothFeedMmPerS).toBe(17.5);

    // Needle Top Dead Center (crankDeg = 90)
    const atTdc = stepHoweLockstitch(90);
    expect(atTdc.needleY).toBeCloseTo(45, 1);
    expect(atTdc.loopOpen).toBe(true);
    expect(atTdc.loopWidth).toBeGreaterThan(0);
    expect(atTdc.loopSvgControlX).toBeCloseTo(atTdc.loopWidth * 1.5, 2);

    // Needle Bottom Dead Center (crankDeg = 270)
    const atBdc = stepHoweLockstitch(270);
    expect(atBdc.needleY).toBeCloseTo(-45, 1);
    expect(atBdc.loopOpen).toBe(false);
  });

  test("stepEngelbartResolver computes orthogonal wheel rotation and encoder pulses", () => {
    const res = stepEngelbartResolver(100, 50, 10, 200);
    expect(res.pulsesX).toBeGreaterThan(0);
    expect(res.pulsesY).toBeGreaterThan(0);
    expect(res.pulsesX).toBeGreaterThan(res.pulsesY);
  });

  test("stepSholesTypewriter computes authentic key-lever to typebar drop and escapement step", () => {
    expect(LINOTYPE_CHARS_PER_LINE).toBe(42);
    const cycle = stepSholesTypewriter(60, 2.5);
    expect(cycle.eventsPerSecond).toBe(1);
    expect(cycle.completedSteps).toBe(2);
    expect(cycle.keyCyclePct).toBe(0.5);
    expect(cycle.displayTypebarIndex).toBe(2);
    expect(cycle.displayColumnWrap).toBe(12);
    expect(cycle.columnPitchPx).toBe(6);
    expect(cycle.typebarOuterRx).toBe(140);
    expect(cycle.ratchetSvgR).toBe(18);
    const bar = sholesTypebarPose(0, 0);
    expect(bar.isActive).toBe(true);
    expect(bar.xEnd).toBe(cycle.typebarHubX);
  });

  test("stepMergenthalerLinotype computes matrix justification, lead pot solidification, and slug ejection", () => {
    const res = stepMergenthalerLinotype({
      matrixRatePerMin: 60,
      spacebandWedgeMm: 6.5,
      potTempC: 260,
      elapsedS: 0.8,
    });
    expect(res.justificationWidthMm).toBeGreaterThan(100);
    expect(res.isEutecticTemp).toBe(true);
    expect(res.brinellHardness).toBe(24);
    expect(res.solidificationTimeMs).toBe(450);
    expect(res.slugSvgWidth).toBeGreaterThan(250);
  });

  test("stepRenoEscalator computes inclined cleat deck throughput, motor torque, and comb-plate clearance", () => {
    const res = stepRenoEscalator({
      passengerCount: 30,
      inclineAngleDeg: 25,
      velocityMps: 0.45,
      elapsedS: 1.0,
    });
    expect(res.throughputPerHour).toBeGreaterThan(5000);
    expect(res.motorTorqueNm).toBeGreaterThan(0);
    expect(res.motorPowerKw).toBeGreaterThan(0);
    expect(res.combPlateClearanceMm).toBe(1.2);
  });

  test("stepOtisElevator computes spring-bow deflection and safety pawl arrest under simulated rope snap", () => {
    // Normal hoisting condition
    const normal = stepOtisElevator({ cabPayloadKg: 650, cableTensionPct: 100 });
    expect(normal.isSnapped).toBe(false);
    expect(normal.isPawlEngaged).toBe(false);
    expect(normal.springDeflectionCm).toBe(10);
    expect(normal.stoppingDistanceCm).toBe(0);

    // Emergency rope severed condition
    const snapped = stepOtisElevator({ cabPayloadKg: 650, cableTensionPct: 0 });
    expect(snapped.isSnapped).toBe(true);
    expect(snapped.isPawlEngaged).toBe(true);
    expect(snapped.springDeflectionCm).toBe(0);
    expect(snapped.stoppingDistanceCm).toBe(4.5);
    expect(snapped.peakArrestForceKn).toBeGreaterThan(15);
    expect(snapped.pawlEngagementMs).toBe(38);
  });
});
