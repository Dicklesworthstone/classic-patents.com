import { describe, expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { PhysicsTelemetryBadge } from "@/components/patents/PhysicsTelemetryBadge";
import { ALL_COLORIZED_EQUATIONS } from "@/data/colorizedEquations";
import {
  stepGoodyearRubber,
  stepHallAluminium,
  stepMarconiRadio,
  stepThomsonWelding,
} from "./catalogKernels";
import { stepClavelDeltaRobotTopology } from "./clavelDeltaRobotKernel";
import { readCrumpFdmControls, stepCrumpFdmSi } from "./crumpFdmKernel";
import { stepDieselEngine } from "./dieselEngineKernel";
import { stepEdisonRadiativeBalance } from "./edisonWasm";
import { computeParameterSensitivity } from "./sensitivityKernel";
import { PATENT_PHYSICS_REGISTRY } from "./telemetryData";
import { setPatentPhysicsParam } from "./usePatentPhysics";
import { readWrightControls, stepWrightFlyerSi } from "./wrightKernel";

/** Scale-aware central difference: h = eps * max(1, |x|) */
function centralDiff(fn: (x: number) => number, x: number, eps = 1e-4): number {
  const h = eps * Math.max(1, Math.abs(x));
  return (fn(x + h) - fn(x - h)) / (2 * h);
}

/** One-sided forward difference for lower boundary: h = eps * max(1, |x|) */
function forwardDiff(fn: (x: number) => number, x: number, eps = 1e-4): number {
  const h = eps * Math.max(1, Math.abs(x));
  return (fn(x + h) - fn(x)) / h;
}

/** One-sided backward difference for upper boundary: h = eps * max(1, |x|) */
function backwardDiff(fn: (x: number) => number, x: number, eps = 1e-4): number {
  const h = eps * Math.max(1, Math.abs(x));
  return (fn(x) - fn(x - h)) / h;
}

describe("classic-patentscom-2y5.4 Companion Verification: Parameter Sensitivities", () => {
  // =========================================================================
  // Requirement 1: Edison 110 V / 200 Ω gives 1.1 W/V with documented tolerance
  // =========================================================================
  describe("Requirement 1: Edison 110 V / 200 Ω gives 1.1 W/V", () => {
    test("Edison sensitivity derivative evaluates to exactly 1.1 W / V (tolerance 1e-6)", () => {
      const id = "us-223898-edison-lightbulb";
      const params = { voltage: 110, hotResistanceOhm: 200 };
      const sens = computeParameterSensitivity(id, "voltage", params);

      expect(sens).toBeDefined();
      expect(sens?.metricName).toBe("Filament Joule Heat");
      expect(sens?.derivativeSymbol).toBe("∂P / ∂V");
      expect(sens?.derivativeUnit).toBe("W / V");
      expect(sens?.derivativeValue).toBeCloseTo(1.1, 6);
      expect(sens?.interpretation).toContain("2V/R");
      expect(sens?.interpretation).toContain("current hot resistance");

      // Verify alias ID works identically
      const aliasSens = computeParameterSensitivity("us-223898-edison-lamp", "voltage", params);
      expect(aliasSens).toEqual(sens);
    });

    test("Edison numerical central difference matches analytical derivative 1.1 W/V", () => {
      const R = 200;
      const fn = (V: number) => (V * V) / R; // P = V^2 / R
      const numDeriv = centralDiff(fn, 110, 1e-4);
      expect(numDeriv).toBeCloseTo(1.1, 5);

      // Verify against stepEdisonRadiativeBalance
      const balanceProbe = (V: number) => {
        const state = stepEdisonRadiativeBalance({
          voltageV: V,
          hotResistanceOhm: R,
          filamentLengthCm: 22,
        });
        if (!state) throw new Error("Expected state");
        return state.joule_power_w;
      };
      const balanceDeriv = centralDiff(balanceProbe, 110, 1e-4);
      expect(balanceDeriv).toBeCloseTo(1.1, 5);
    });

    test("Edison voltage domain boundaries and one-sided finite differences", () => {
      const id = "us-223898-edison-lightbulb";
      const R = 200;

      // Point at 50 V
      const sens50 = computeParameterSensitivity(id, "voltage", {
        voltage: 50,
        hotResistanceOhm: R,
      });
      expect(sens50?.derivativeValue).toBeCloseTo((2 * 50) / 200, 5); // 0.5 W/V
      const fn = (V: number) => (V * V) / R;
      const fwdDeriv = forwardDiff(fn, 50, 1e-4);
      expect(sens50?.derivativeValue).toBeCloseTo(fwdDeriv, 3);

      // Point at 150 V
      const sens150 = computeParameterSensitivity(id, "voltage", {
        voltage: 150,
        hotResistanceOhm: R,
      });
      expect(sens150?.derivativeValue).toBeCloseTo((2 * 150) / 200, 5); // 1.5 W/V
      const bwdDeriv = backwardDiff(fn, 150, 1e-4);
      expect(sens150?.derivativeValue).toBeCloseTo(bwdDeriv, 3);

      // Refusal when resistance out of bounds ([100, 500] Ohm) or negative voltage
      expect(
        computeParameterSensitivity(id, "voltage", {
          voltage: 110,
          hotResistanceOhm: 50, // < 100 Ohm
        }),
      ).toBeNull();
      expect(
        computeParameterSensitivity(id, "voltage", {
          voltage: 110,
          hotResistanceOhm: 600, // > 500 Ohm
        }),
      ).toBeNull();
      expect(
        computeParameterSensitivity(id, "voltage", {
          voltage: -5,
          hotResistanceOhm: R,
        }),
      ).toBeNull();
    });
  });

  // =========================================================================
  // Requirement 2: Compare continuous branches against scale-aware central diffs
  // =========================================================================
  describe("Requirement 2: Scale-aware central differences across continuous catalogue models", () => {
    test("Thomson Welding: weldCurrentAmps (I²R derivative) and clampPressureMpa", () => {
      const id = "us-347140-thomson-welding";
      const current = 4500;
      const pressure = 40;
      const params = { weldCurrentAmps: current, clampPressureMpa: pressure };

      const sensCurrent = computeParameterSensitivity(id, "weldCurrentAmps", params);
      expect(sensCurrent).toBeDefined();
      expect(sensCurrent?.derivativeUnit).toBe("W / A");
      const currentFn = (I: number) =>
        stepThomsonWelding({ ...params, weldCurrentAmps: I }).jouleWatts;
      expect(sensCurrent?.derivativeValue).toBeCloseTo(centralDiff(currentFn, current, 1e-4), 4);

      const sensPressure = computeParameterSensitivity(id, "clampPressureMpa", params);
      expect(sensPressure).toBeDefined();
      expect(sensPressure?.derivativeUnit).toBe("mm / MPa");
      const pressureFn = (P: number) =>
        stepThomsonWelding({ ...params, clampPressureMpa: P }).upsetBurrWidthMmUnrounded;
      expect(sensPressure?.derivativeValue).toBeCloseTo(centralDiff(pressureFn, pressure, 1e-4), 5);
    });

    test("Goodyear Rubber: appliedTensileStretch, vulcanTemp, and specimenTempC", () => {
      const id = "us-3633-goodyear-rubber";
      const params = {
        vulcanTemp: 145,
        sulfurPct: 8,
        appliedTensileStretch: 1.8,
        specimenTempC: 35,
      };

      // Stretch derivative
      const sensStretch = computeParameterSensitivity(id, "appliedTensileStretch", params);
      expect(sensStretch).toBeDefined();
      expect(sensStretch?.derivativeUnit).toBe("MPa / λ");
      const stretchFn = (s: number) => stepGoodyearRubber(145, 8, 30, s, 35).stressMpaUnrounded;
      expect(sensStretch?.derivativeValue).toBeCloseTo(centralDiff(stretchFn, 1.8, 1e-4), 2);

      // Cure temperature derivative (Arrhenius rate)
      const sensCure = computeParameterSensitivity(id, "vulcanTemp", params);
      expect(sensCure).toBeDefined();
      const cureFn = (T: number) => stepGoodyearRubber(T, 8, 30, 1.8, 35).rateRelUnrounded;
      expect(sensCure?.derivativeValue).toBeCloseTo(centralDiff(cureFn, 145, 1e-4), 3);

      // Specimen temperature derivative (Entropic restoring stress ∂P/∂T = P / T_K)
      const sensSpecimen = computeParameterSensitivity(id, "specimenTempC", params);
      expect(sensSpecimen).toBeDefined();
      const rubberAt35 = stepGoodyearRubber(145, 8, 30, 1.8, 35);
      expect(sensSpecimen?.derivativeValue).toBeCloseTo(
        rubberAt35.stressMpaUnrounded / (35 + 273.15),
        4,
      );
    });

    test("Hall Aluminium: currentAmperes Faradaic production rate and bath temperature", () => {
      const id = "us-400766-hall-aluminium";
      const params = {
        currentAmperes: 300000,
        bathTemperatureCelsius: 980,
        aluminaConcentrationPct: 5.5,
      };

      // Current derivative
      const sensCurrent = computeParameterSensitivity(id, "currentAmperes", params);
      expect(sensCurrent).toBeDefined();
      expect(sensCurrent?.derivativeUnit).toBe("kg / (h·A)");
      const hallRef = stepHallAluminium(params);
      expect(hallRef.productionSlopeKgPerHourPerAmpere).not.toBeNull();
      expect(sensCurrent?.derivativeValue).toBeCloseTo(
        hallRef.productionSlopeKgPerHourPerAmpere as number,
        6,
      );

      // Bath temperature derivative
      const sensTemp = computeParameterSensitivity(id, "bathTemperatureCelsius", params);
      expect(sensTemp).toBeDefined();
      expect(hallRef.productionSlopeKgPerHourPerCelsius).not.toBeNull();
      expect(sensTemp?.derivativeValue).toBeCloseTo(
        hallRef.productionSlopeKgPerHourPerCelsius as number,
        5,
      );
    });

    test("Crump FDM: printSpeedMmS, layerHeightMm, and roadWidthMm volumetric extrusion flow", () => {
      const id = "us-5121329-crump-fdm";
      const params = { printSpeedMmS: 25, layerHeightMm: 0.25, roadWidthMm: 0.6 };

      // Flow rate Q = v * w * h = 25 * 0.6 * 0.25 = 3.75 mm^3/s
      // ∂Q/∂v = w * h = 0.6 * 0.25 = 0.15 mm^3/s / (mm/s)
      const sensSpeed = computeParameterSensitivity(id, "printSpeedMmS", params);
      expect(sensSpeed?.derivativeValue).toBeCloseTo(0.15, 6);
      const speedFn = (v: number) =>
        stepCrumpFdmSi(readCrumpFdmControls({ ...params, printSpeedMmS: v }))
          .volumetricFlowRateMm3S;
      expect(sensSpeed?.derivativeValue).toBeCloseTo(centralDiff(speedFn, 25, 1e-4), 5);

      // Layer thickness sensitivity ∂τ/∂h (thermal cooling time constant)
      const sensHeight = computeParameterSensitivity(id, "layerHeightMm", params);
      expect(sensHeight?.derivativeUnit).toBe("s / mm");
      const heightFn = (h: number) =>
        stepCrumpFdmSi(readCrumpFdmControls({ ...params, layerHeightMm: h }))
          .coolingTimeConstantSec;
      expect(sensHeight?.derivativeValue).toBeCloseTo(centralDiff(heightFn, 0.25, 1e-4), 5);
    });

    test("Wright Flyer: wingWarp yaw moment derivative and uncoupled rudder", () => {
      const id = "us-821393-wright-flyer";
      const params = { airspeed: 28, wingWarp: 5, rudder: 0, elevator: 0, coupled: 0 };

      // Uncoupled rudder yaw sensitivity
      const sensRudder = computeParameterSensitivity(id, "rudder", params);
      expect(sensRudder).toBeDefined();
      expect(sensRudder?.derivativeUnit).toBe("N·m / deg");
      const rudderFn = (r: number) =>
        stepWrightFlyerSi(readWrightControls({ ...params, rudder: r })).netYawNm;
      expect(sensRudder?.derivativeValue).toBeCloseTo(centralDiff(rudderFn, 0, 1e-3), 2);

      // Wing warp yaw sensitivity
      const sensWarp = computeParameterSensitivity(id, "wingWarp", params);
      expect(sensWarp).toBeDefined();
      const warpFn = (w: number) =>
        stepWrightFlyerSi(readWrightControls({ ...params, wingWarp: w })).netYawNm;
      expect(sensWarp?.derivativeValue).toBeCloseTo(centralDiff(warpFn, 5, 1e-3), 2);
    });

    test("Diesel Engine: compressionRatio and cutoffRatio sensitivities", () => {
      const id = "us-542846-diesel-engine";
      const params = {
        compressionRatio: 18,
        cutoffRatio: 1.6,
        blastAirPressureBar: 65,
        engineRpm: 150,
      };

      const sensCr = computeParameterSensitivity(id, "compressionRatio", params);
      expect(sensCr).toBeDefined();
      expect(sensCr?.derivativeUnit).toBe("°C / ratio");
      const dieselRef = stepDieselEngine({
        compressionRatio: 18,
        cutoffRatio: 1.6,
        blastAirPressureBar: 65,
        engineRpm: 150,
      });
      expect(sensCr?.derivativeValue).toBeCloseTo(
        dieselRef.compressionTemperatureSlopeKPerRatio,
        4,
      );

      const sensCutoff = computeParameterSensitivity(id, "cutoffRatio", params);
      expect(sensCutoff).toBeDefined();
      expect(sensCutoff?.derivativeUnit).toBe("percentage points / ratio");
      expect(sensCutoff?.derivativeValue).toBeCloseTo(
        dieselRef.brakeEfficiencySlopePctPerCutoffRatio,
        5,
      );
    });

    test("Marconi Spark Radio: aerialHeight scale and sparkGapMm span derivatives", () => {
      const id = "us-586193-marconi-radio";
      const params = { aerialHeight: 88, sparkGapMm: 12, sparkVoltage: 28 };

      const sensHeight = computeParameterSensitivity(id, "aerialHeight", params);
      expect(sensHeight?.derivativeValue).toBeCloseTo(1 / 88, 5);
      const heightFn = (h: number) => stepMarconiRadio(h, 12, 28).mastStudioScale;
      expect(sensHeight?.derivativeValue).toBeCloseTo(centralDiff(heightFn, 88, 1e-4), 4);

      const sensGap = computeParameterSensitivity(id, "sparkGapMm", params);
      expect(sensGap?.derivativeValue).toBeCloseTo(0.18 / 23, 5);
      const gapFn = (g: number) => stepMarconiRadio(88, g, 28).sparkGapStudioHalfSpan;
      const h = 1.0;
      const numGapDiff = (gapFn(12 + h) - gapFn(12 - h)) / (2 * h);
      expect(sensGap?.derivativeValue).toBeCloseTo(numGapDiff, 3);
    });

    test("Kamen Segway: riderMassKg and groundFrictionCoeff grip traction derivatives", () => {
      const id = "us-6302230-kamen-segway";
      const params = { riderPitchDeg: 3, riderMassKg: 75, groundFrictionCoeff: 0.8 };

      // F_max = mu * (m_rider + m_chassis) * g where m_chassis = 43 kg
      // ∂F_max / ∂mu = (75 + 43) * 9.80665 = 118 * 9.80665 = 1157.1847 N
      const sensFriction = computeParameterSensitivity(id, "groundFrictionCoeff", params);
      expect(sensFriction?.derivativeValue).toBeCloseTo(118 * 9.80665, 1);

      // ∂F_max / ∂m = mu * g = 0.8 * 9.80665 = 7.84532 N / kg
      const sensMass = computeParameterSensitivity(id, "riderMassKg", params);
      expect(sensMass?.derivativeValue).toBeCloseTo(0.8 * 9.80665, 4);
    });

    test("Clavel Delta Robot: arm inputs normalized platform height derivatives", () => {
      const id = "us-4976582-clavel-delta-robot";
      const params = { armOneInput: 0.2, armTwoInput: -0.15, armThreeInput: 0.1 };

      const sensArm1 = computeParameterSensitivity(id, "armOneInput", params);
      expect(sensArm1).toBeDefined();
      expect(sensArm1?.derivativeUnit).toBe("normalized / input fraction");

      const arm1Fn = (theta1: number) =>
        stepClavelDeltaRobotTopology({ ...params, armOneInput: theta1 }).platformCenter[1];
      expect(sensArm1?.derivativeValue).toBeCloseTo(centralDiff(arm1Fn, 0.2, 1e-4), 3);
    });
  });

  // =========================================================================
  // Requirement 3: Boundary Refusals & Claim Interlocks
  // =========================================================================
  describe("Requirement 3: Domain boundaries, explicit refusal, and claim interlocks", () => {
    test("Wright Flyer rudder derivative is withheld when Claim 18 coupling is engaged", () => {
      const id = "us-821393-wright-flyer";
      const coupled = computeParameterSensitivity(id, "rudder", {
        coupled: 1,
        rudder: 5,
        airspeed: 28,
      });
      expect(coupled).toBeNull();

      const uncoupled = computeParameterSensitivity(id, "rudder", {
        coupled: 0,
        rudder: 5,
        airspeed: 28,
      });
      expect(uncoupled).toBeDefined();
      expect(uncoupled?.derivativeValue).not.toBe(0);
    });

    test("Hall-Héroult bath temperature refuses below 920 °C or above 1020 °C", () => {
      const id = "us-400766-hall-aluminium";
      expect(
        computeParameterSensitivity(id, "currentAmperes", {
          bathTemperatureCelsius: 915,
          currentAmperes: 300000,
          aluminaConcentrationPct: 5.5,
        }),
      ).toBeNull();
      expect(
        computeParameterSensitivity(id, "bathTemperatureCelsius", {
          bathTemperatureCelsius: 1025,
          currentAmperes: 300000,
          aluminaConcentrationPct: 5.5,
        }),
      ).toBeNull();
    });

    test("Clavel Delta Robot withholds sensitivity when Claim 1 topology is disabled", () => {
      const id = "us-4976582-clavel-delta-robot";
      const params = { armOneInput: 0.2, armTwoInput: -0.1, armThreeInput: 0.1 };

      const active = computeParameterSensitivity(id, "armOneInput", {
        ...params,
        claim1TopologyEnabled: 1,
      });
      expect(active).toBeDefined();

      const refused = computeParameterSensitivity(id, "armOneInput", {
        ...params,
        claim1TopologyEnabled: 0,
      });
      expect(refused).toBeNull();
    });

    test("Kamen Segway withholds sensitivity when Claim 1 balance loop is disabled", () => {
      const id = "us-6302230-kamen-segway";
      const params = { riderPitchDeg: 3, riderMassKg: 75, groundFrictionCoeff: 0.85 };

      const active = computeParameterSensitivity(id, "groundFrictionCoeff", {
        ...params,
        claim1BalanceEnabled: 1,
      });
      expect(active).toBeDefined();

      const refused = computeParameterSensitivity(id, "groundFrictionCoeff", {
        ...params,
        claim1BalanceEnabled: 0,
      });
      expect(refused).toBeNull();
    });

    test("DaVinci Interface withholds sensitivity when input states are out of bounds", () => {
      const id = "us-6331181-davinci";
      const validParams = {
        compatibilitySignalPresent: 1,
        calibrationRecordAvailable: 1,
        engagementSignalPresent: 1,
      };

      const active = computeParameterSensitivity(id, "compatibilitySignalPresent", validParams);
      expect(active).toBeDefined();

      const outOfBoundsHigh = computeParameterSensitivity(id, "compatibilitySignalPresent", {
        ...validParams,
        calibrationRecordAvailable: 1.5,
      });
      expect(outOfBoundsHigh).toBeNull();

      const outOfBoundsLow = computeParameterSensitivity(id, "engagementSignalPresent", {
        ...validParams,
        compatibilitySignalPresent: -0.2,
      });
      expect(outOfBoundsLow).toBeNull();
    });

    test("Kamen Transporter cluster sensitivity withholds when parameters out of bounds", () => {
      const id = "us-5701965-kamen-transporter";
      const valid = computeParameterSensitivity(id, "claim16ClusterEnabled", {
        topologyState: 3,
        claim16ClusterEnabled: 1,
      });
      expect(valid).toBeDefined();

      const invalidState = computeParameterSensitivity(id, "claim16ClusterEnabled", {
        topologyState: 7,
        claim16ClusterEnabled: 1,
      });
      expect(invalidState).toBeNull();

      const invalidCluster = computeParameterSensitivity(id, "claim16ClusterEnabled", {
        topologyState: 2,
        claim16ClusterEnabled: -1,
      });
      expect(invalidCluster).toBeNull();
    });
  });

  // =========================================================================
  // Requirement 4: Cross-Face Browser Non-Default Control & Unit Alignment
  // =========================================================================
  describe("Requirement 4: Cross-face browser non-default control and unit alignment", () => {
    test("Edison non-default 110 V / 200 Ω updates live badge markup and sensitivity card", () => {
      const id = "us-223898-edison-lightbulb";
      setPatentPhysicsParam(id, "hotResistanceOhm", 200);
      setPatentPhysicsParam(id, "voltage", 110);

      const html = renderToStaticMarkup(
        <PhysicsTelemetryBadge patentId={id} equations={ALL_COLORIZED_EQUATIONS[id] ?? []} />,
      );

      expect(html).toContain('data-testid="parameter-sensitivity"');
      expect(html).toContain("Filament Joule Heat");
      expect(html).toContain("∂P / ∂V (host sensitivity)");
      expect(html).toContain("1.1");
      expect(html).toContain("W / V");
      expect(html).toContain("2V/R");
    });

    test("Crump FDM non-default speed 30 mm/s and road 0.8 mm align across metrics and sensitivity", () => {
      const id = "us-5121329-crump-fdm";
      setPatentPhysicsParam(id, "roadWidthMm", 0.8);
      setPatentPhysicsParam(id, "layerHeightMm", 0.3);
      setPatentPhysicsParam(id, "printSpeedMmS", 30);

      const html = renderToStaticMarkup(
        <PhysicsTelemetryBadge patentId={id} equations={ALL_COLORIZED_EQUATIONS[id] ?? []} />,
      );

      // Volumetric flow rate sensitivity = w * h = 0.8 * 0.3 = 0.24 mm³/s / (mm/s)
      expect(html).toContain('data-testid="parameter-sensitivity"');
      expect(html).toContain("Volumetric Extrusion Flow Rate");
      expect(html).toContain("0.24");
      expect(html).toContain("mm³/s / (mm/s)");
      expect(html).toContain("proportional filament feed");
    });

    test("Thomson Welding non-default current 5000 A displays 1.8 W/A in badge markup", () => {
      const id = "us-347140-thomson-welding";
      setPatentPhysicsParam(id, "clampPressureMpa", 45);
      setPatentPhysicsParam(id, "weldCurrentAmps", 5000);

      const html = renderToStaticMarkup(
        <PhysicsTelemetryBadge patentId={id} equations={ALL_COLORIZED_EQUATIONS[id] ?? []} />,
      );

      // d(I²R)/dI = 2 * 5000 * 0.00018 = 1.8 W / A
      expect(html).toContain('data-testid="parameter-sensitivity"');
      expect(html).toContain("Joule Heating Rate");
      expect(html).toContain("1.8");
      expect(html).toContain("W / A");
    });

    test("Segway non-default friction 0.8 displays matching grip traction slope in badge markup", () => {
      const id = "us-6302230-kamen-segway";
      setPatentPhysicsParam(id, "riderMassKg", 80);
      setPatentPhysicsParam(id, "groundFrictionCoeff", 0.8);

      const html = renderToStaticMarkup(
        <PhysicsTelemetryBadge patentId={id} equations={ALL_COLORIZED_EQUATIONS[id] ?? []} />,
      );

      // dF_max / dmu = (80 + 43) * 9.80665 = 123 * 9.80665 = 1206.21795 N
      const expectedSlope = (123 * 9.80665).toFixed(2);
      expect(html).toContain('data-testid="parameter-sensitivity"');
      expect(html).toContain("Maximum Ground Grip Traction");
      expect(html).toContain("N / μ");
      expect(html).toContain(expectedSlope);
    });
  });

  // =========================================================================
  // Requirement 5: Model Provenance, WASM Stepping, and Fallback Verification
  // =========================================================================
  describe("Requirement 5: Model provenance and stepped WASM / fallback verification", () => {
    test("Wright Flyer stepped kernel logs actual controls, SI units, and aerodynamic balance", () => {
      const controls = readWrightControls({
        airspeed: 32,
        wingWarp: 4,
        rudder: -2,
        elevator: 1.5,
        coupled: 0,
      });
      const result = stepWrightFlyerSi(controls);

      expect(result.airspeedMps).toBeCloseTo(32 * 0.44704, 3);
      expect(result.liftNewtons).toBeGreaterThan(1500);
      expect(result.totalDragNewtons).toBeGreaterThan(100);

      // Verify log metadata
      const sens = computeParameterSensitivity("us-821393-wright-flyer", "wingWarp", {
        airspeed: 32,
        wingWarp: 4,
        rudder: -2,
        coupled: 0,
      });
      expect(sens).toBeDefined();
      expect(sens?.derivativeUnit).toBe("N·m / deg");
    });

    test("Edison bulb stepped radiative balance verifies SI watts, Stefan-Boltzmann, and resistance bounds", () => {
      const result = stepEdisonRadiativeBalance({
        voltageV: 110,
        hotResistanceOhm: 200,
        filamentLengthCm: 22,
      });

      expect(result).toBeDefined();
      if (!result) throw new Error("Expected result");
      expect(result.joule_power_w).toBeCloseTo((110 * 110) / 200, 5); // 60.5 W
      expect(result.filament_temperature_k).toBeGreaterThan(1800);
      expect(result.filament_temperature_k).toBeLessThan(3000);
      expect(result.radiative_power_w).toBeCloseTo(60.5, 2);
    });

    test("Catalogue registry entries declare authentic engineMethod provenance", () => {
      const wright = PATENT_PHYSICS_REGISTRY["us-821393-wright-flyer"];
      expect(wright.engineMethod).toContain("FrankenSimEngine.stepWrightFlyer");

      const edison = PATENT_PHYSICS_REGISTRY["us-223898-edison-lightbulb"];
      expect(edison.engineMethod).toContain("fs-conduction incandescent radiative balance");

      const crump = PATENT_PHYSICS_REGISTRY["us-5121329-crump-fdm"];
      expect(crump.engineMethod).toContain("fs-crump-wasm");

      const clavel = PATENT_PHYSICS_REGISTRY["us-4976582-clavel-delta-robot"];
      expect(clavel.engineMethod).toContain("stepClavelDeltaRobotTopology");
    });
  });
});
