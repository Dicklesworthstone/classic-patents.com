import { describe, expect, test } from "bun:test";
import { applyClaimConstraintModifications, CATALOG_CLAIM_CONSTRAINTS } from "./claimConstraints";
import { computePortHamiltonianEnergy } from "./energyLedger";
import {
  computeCcdPotentialWellField,
  computeEdisonFilamentThermalField,
  createColormappedFieldTexture,
  createScalarDataTexture,
  generateVectorStreamlines,
  sampleThermalColormap,
} from "./fieldTextures";
import { computeParameterSensitivity } from "./sensitivityKernel";

describe("Deep FrankenSim WASM Integration Suite", () => {
  describe("Field Textures & Streamlines (Phase 1)", () => {
    test("generates valid scalar DataTexture with correct dimensions", () => {
      const data = new Float32Array(16 * 16).fill(0.5);
      const texture = createScalarDataTexture(data, 16, 16);
      expect(texture.image.width).toBe(16);
      expect(texture.image.height).toBe(16);
      expect(texture.version).toBeGreaterThan(0);

      const colorTex = createColormappedFieldTexture(data, 16, 16);
      expect(colorTex.image.width).toBe(16);
      expect(colorTex.image.height).toBe(16);
    });

    test("computes continuous thermal colormap without NaN or clamp overflow", () => {
      const [r0, , b0] = sampleThermalColormap(0.0);
      expect(r0).toBe(0.0);
      expect(b0).toBeGreaterThanOrEqual(0.4);

      const [r1, , b1] = sampleThermalColormap(1.0);
      expect(r1).toBe(1.0);
      expect(b1).toBeGreaterThanOrEqual(0.8);
    });

    test("computes Edison filament thermal diffusion grid", () => {
      const grid = computeEdisonFilamentThermalField(2200, 110, 1e-4, 32);
      expect(grid.length).toBe(32 * 32);
      let maxVal = 0;
      for (const val of grid) {
        maxVal = Math.max(maxVal, val);
        expect(val).toBeGreaterThanOrEqual(0);
        expect(val).toBeLessThanOrEqual(1.0);
      }
      expect(maxVal).toBeGreaterThan(0.4);
    });

    test("computes CCD 3-phase potential well profiles", () => {
      const grid = computeCcdPotentialWellField(0.5, [0.8, 0.2, 0.5, 0.9], 4, 32, 16);
      expect(grid.length).toBe(32 * 16);
      expect(grid[0]).toBeGreaterThanOrEqual(0);
      expect(grid[grid.length - 1]).toBeLessThanOrEqual(1.0);
    });

    test("generates deterministic 3D vector streamlines", () => {
      const evalField = (x: number, y: number, _z: number): [number, number, number] => [
        -y,
        x,
        0.1,
      ];
      const vertices = generateVectorStreamlines(evalField, 12, 8, 0.1, 2.0);
      expect(vertices.length).toBe(12 * 7 * 2 * 3); // 12 lines, 7 segments, 2 points per segment, 3 coords
      for (const coord of vertices) {
        expect(Number.isNaN(coord)).toBe(false);
        expect(Number.isFinite(coord)).toBe(true);
      }
    });
  });

  describe("Automatic Differentiation & Sensitivity Gradients (Phase 2)", () => {
    test("computes Wright Flyer adverse yaw sensitivity ∂N/∂δ_warp from the live kernel", () => {
      // Uncoupled: the raw adverse-yaw gradient must be negative (warping the
      // right wing down yaws the nose right; sign follows the kernel).
      const uncoupled = computeParameterSensitivity("us-821393-wright-flyer", "wingWarp", {
        wingWarp: 5.0,
        airspeed: 28.0,
        coupled: 0,
      });
      expect(uncoupled).not.toBeNull();
      expect(uncoupled?.metricName).toBe("Adverse Yaw Moment");
      expect(uncoupled?.derivativeValue).not.toBe(0);
      expect(uncoupled?.derivativeUnit).toContain("N·m / deg");

      // Claim 18 rudder interlock engaged: the coupled rudder cancels the
      // warp-induced adverse yaw, so the residual gradient is ~0.
      const coupled = computeParameterSensitivity("us-821393-wright-flyer", "wingWarp", {
        wingWarp: 5.0,
        airspeed: 28.0,
        coupled: 1,
      });
      expect(coupled).not.toBeNull();
      expect(Math.abs(coupled?.derivativeValue ?? 1)).toBeLessThan(0.05);
    });

    test("computes Tesla Fig. 9 generator-rate sensitivity ∂n_G/∂f", () => {
      const sens = computeParameterSensitivity("us-381968-tesla-motor", "frequency", {
        frequency: 60.0,
      });
      expect(sens).not.toBeNull();
      expect(sens?.metricName).toBe("Generator Rotation");
      expect(sens?.derivativeValue).toBe(60.0); // One generator revolution per Hz
      expect(sens?.derivativeUnit).toBe("RPM / Hz");
    });

    test("computes Watt separate condenser power sensitivity ∂P/∂P_boiler", () => {
      const sens = computeParameterSensitivity(
        "gb-913-watt-separate-condenser",
        "boilerPressurePsi",
        {
          boilerPressurePsi: 14.7,
          cylinderBoreInches: 24.0,
          pistonStrokeFeet: 6.0,
          strokesPerMinute: 18.0,
        },
      );
      expect(sens).not.toBeNull();
      expect(sens?.derivativeValue).toBeGreaterThan(1.0);
      expect(sens?.derivativeUnit).toContain("HP / PSI");
    });

    test("does not fabricate a Pelton sensitivity beyond the three-sheet source", () => {
      const sens = computeParameterSensitivity("us-233692-pelton-water-wheel", "waterHeadM", {
        flowRateLps: 45.0,
      });
      expect(sens).toBeNull();
    });

    test("labels the declared modern Otto-cycle sensitivity without calling it source telemetry", () => {
      const sens = computeParameterSensitivity("us-194047-otto-engine", "compressionRatio", {
        compressionRatio: 8.0,
      });
      expect(sens).not.toBeNull();
      expect(sens?.derivativeValue).toBeGreaterThan(1.0);
      expect(sens?.derivativeUnit).toContain("% / ratio");
      expect(sens?.interpretation).toContain("not a measured efficiency");
    });
  });

  describe("Port-Hamiltonian Energy Ledger (Phase 3)", () => {
    test("computes conservative energy balance for Wright Flyer", () => {
      const ledger = computePortHamiltonianEnergy("us-821393-wright-flyer", {
        airspeedKts: 28.0,
        altitudeM: 3.5,
        throttlePct: 80,
      });
      expect(ledger.energy.totalHamiltonianJoules).toBeGreaterThan(10000);
      expect(ledger.inputPowerWatts).toBeGreaterThan(5000);
      expect(ledger.isConservative).toBe(true);
      expect(ledger.stateDigest).toMatch(/^host:[0-9a-f]{8}$/);
      expect(ledger.digestKind).toBe("host");
    });

    test("does not fabricate a Tesla energy ledger beyond the Fig. 9 source", () => {
      const ledger = computePortHamiltonianEnergy("us-381968-tesla-motor", {
        frequency: 60.0,
      });
      expect(ledger.energy).toEqual({
        kineticJoules: 0,
        potentialJoules: 0,
        electromagneticJoules: 0,
        thermalJoules: 0,
        totalHamiltonianJoules: 0,
      });
      expect(ledger.inputPowerWatts).toBe(0);
      expect(ledger.dissipatedPowerWatts).toBe(0);
      expect(ledger.isConservative).toBe(true);
    });

    test("digests Edison's closed steady power flow as real host state", () => {
      const ledger = computePortHamiltonianEnergy("us-223898-edison-lightbulb", {
        voltage: 110,
        filamentLength: 22,
      });
      expect(ledger.energy.totalHamiltonianJoules).toBe(0);
      expect(ledger.inputPowerWatts).toBeGreaterThan(0);
      expect(ledger.dissipatedPowerWatts).toBe(ledger.inputPowerWatts);
      expect(ledger.stateDigest).toMatch(/^host:[0-9a-f]{8}$/);
      expect(ledger.stateDigest).not.toBe("host:00000000");
    });

    test("computes steam enthalpy power balance for Watt separate condenser", () => {
      const ledger = computePortHamiltonianEnergy("gb-913-watt-separate-condenser", {
        boilerPressurePsi: 14.7,
        hasSeparateCondenser: 1,
        strokesPerMinute: 18,
      });
      expect(ledger.energy.thermalJoules).toBeGreaterThan(5000);
      expect(ledger.inputPowerWatts).toBeGreaterThan(1000);
      expect(ledger.isConservative).toBe(true);
    });

    test("does not fabricate a Pelton energy ledger beyond the three-sheet source", () => {
      const ledger = computePortHamiltonianEnergy("us-233692-pelton-water-wheel", {
        waterHeadM: 150.0,
        flowRateLps: 45.0,
        wheelRpm: 320.0,
      });
      expect(ledger.energy).toEqual({
        kineticJoules: 0,
        potentialJoules: 0,
        electromagneticJoules: 0,
        thermalJoules: 0,
        totalHamiltonianJoules: 0,
      });
      expect(ledger.inputPowerWatts).toBe(0);
      expect(ledger.dissipatedPowerWatts).toBe(0);
      expect(ledger.isConservative).toBe(true);
    });

    test("does not fabricate an Otto energy ledger from unprinted operating data", () => {
      const ledger = computePortHamiltonianEnergy("us-194047-otto-engine", {
        rpm: 180,
        compressionRatio: 8,
      });
      expect(ledger.energy).toEqual({
        kineticJoules: 0,
        potentialJoules: 0,
        electromagneticJoules: 0,
        thermalJoules: 0,
        totalHamiltonianJoules: 0,
      });
      expect(ledger.inputPowerWatts).toBe(0);
      expect(ledger.dissipatedPowerWatts).toBe(0);
      expect(ledger.isConservative).toBe(true);
    });

    test("computes optical and thermal balance for Maiman ruby laser", () => {
      const ledger = computePortHamiltonianEnergy("us-3353115-maiman-laser", {
        pumpPowerWatts: 500.0,
      });
      expect(ledger.inputPowerWatts).toBe(500.0);
      expect(ledger.energy.thermalJoules).toBeGreaterThan(100);
      expect(ledger.isConservative).toBe(true);
    });
  });

  describe("Claim Inversion & Prior-Art Failure Modes (Phase 4)", () => {
    test("catalogue defines valid claim constraint definitions", () => {
      expect(CATALOG_CLAIM_CONSTRAINTS["us-821393-wright-flyer"]).toBeDefined();
      expect(CATALOG_CLAIM_CONSTRAINTS["us-381968-tesla-motor"]).toBeDefined();
      expect(CATALOG_CLAIM_CONSTRAINTS["us-223898-edison-lamp"]).toBeDefined();
    });

    test("inverting Wright Claim 1 induces authentic adverse yaw failure mode", () => {
      const res = applyClaimConstraintModifications(
        "us-821393-wright-flyer",
        { wingWarp: 6.0 },
        { 1: false }, // Inverted
      );
      expect(res.activeFailures.length).toBeGreaterThan(0);
      expect(res.modifiedParams.adverseYawMultiplier).toBe(3.5);
      expect(res.refusalWarning).toContain("Aerodynamic adverse yaw exceeds roll authority");
    });

    test("inverting Tesla Claim 1 preserves the source-bound circuit refusal", () => {
      const constraint = CATALOG_CLAIM_CONSTRAINTS["us-381968-tesla-motor"]?.[0];
      expect(constraint).toBeDefined();
      expect(constraint?.claimTitle).toBe("Independent Alternating-Current Motor Circuits");
      expect(constraint?.activeDescription).toContain("independently connected induced circuits");
      expect(constraint?.activeDescription).toContain("progressively shifts the motor poles");
      expect(constraint?.historicalPriorArt).toContain("collector rings");

      const visitorText = [
        constraint?.claimTitle,
        constraint?.activeDescription,
        constraint?.invertedDescription,
        constraint?.failureModeName,
        constraint?.historicalPriorArt,
      ].join(" ");
      expect(visitorText).not.toMatch(
        /polyphase|rotating B-field|zero starting torque|stalled rotor|overheating|standing wave/i,
      );

      const res = applyClaimConstraintModifications(
        "us-381968-tesla-motor",
        { frequency: 60.0 },
        { 1: false }, // Inverted
      );
      expect(res.modifiedParams).toEqual({ frequency: 60.0 });
      expect(res.modifiedParams).not.toHaveProperty("startingTorqueNm");
      expect(res.modifiedParams).not.toHaveProperty("isSinglePhaseStall");
      expect(res.activeFailures[0]).toContain("independent alternating-current circuits");
      expect(res.activeFailures[0]).toContain("progressive pole shifting");
      expect(res.refusalWarning).toContain("SOURCE-BOUND REFUSAL");
      expect(res.refusalWarning).not.toMatch(/torque|speed|heating|rotor-performance claim/i);
    });
  });
});
