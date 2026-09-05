import { describe, expect, it } from "bun:test";
import {
  CANONICAL_COUPLED_PORT_SCHEMAS,
  type CoupledLabAction,
  type CoupledPortSchema,
  coupleEdgesFor,
  createInitialElectricalChainState,
  createInitialMechanicalChainState,
  executeCoupledLabReplay,
  stepElectricalChainLab,
  stepMechanicalChainLab,
  validateCoupledPortDimensions,
} from "./coupleGraph";
import { areDimensionsEqual, DIM_CURRENT, DIM_FORCE, DIM_POWER, DIM_VOLTAGE } from "./qty";

describe("fs-couple Multi-Patent Port-Thermodynamic Solver", () => {
  describe("Port Schema and Dimensional Contracts", () => {
    it("validates that all canonical port schemas contract to Power (Watts)", () => {
      for (const [_key, schema] of Object.entries(CANONICAL_COUPLED_PORT_SCHEMAS)) {
        const result = validateCoupledPortDimensions(schema);
        expect(result.valid).toBeTrue();
        expect(result.refusalReason).toBeUndefined();
        expect(areDimensionsEqual(result.productDimension, DIM_POWER)).toBeTrue();
      }
    });

    it("rejects port schemas where effort × flow does not equal Power", () => {
      const invalidSchema: CoupledPortSchema = {
        portId: "invalid_force_squared",
        name: "Unphysical Force-Force Port",
        kind: "mechanical_translational",
        direction: "out",
        effortName: "Force 1",
        effortUnit: "N",
        effortDimension: DIM_FORCE,
        flowName: "Force 2",
        flowUnit: "N",
        flowDimension: DIM_FORCE,
      };

      const result = validateCoupledPortDimensions(invalidSchema);
      expect(result.valid).toBeFalse();
      expect(result.refusalReason).toBeDefined();
      expect(result.refusalReason).toContain("Port power pairing error");
    });

    it("rejects port schemas with mismatched declared unit and dimension", () => {
      const mismatchedSchema: CoupledPortSchema = {
        portId: "mismatched_effort_unit",
        name: "Mismatched Unit Port",
        kind: "electrical",
        direction: "out",
        effortName: "Voltage Pretending to be Force",
        effortUnit: "N", // Newton is Force, not Voltage
        effortDimension: DIM_VOLTAGE,
        flowName: "Current",
        flowUnit: "A",
        flowDimension: DIM_CURRENT,
      };

      const result = validateCoupledPortDimensions(mismatchedSchema);
      expect(result.valid).toBeFalse();
      expect(result.refusalReason).toContain("has dimension");
    });
  });

  describe("Pilot Lab 1: Mechanical Rotary Chain (Corliss -> Arkwright -> Howe)", () => {
    it("initializes with authentic component specifications and educational disclosure", () => {
      const state = createInitialMechanicalChainState();
      expect(state.labId).toBe("mechanical-rotary-chain");
      expect(state.compositionClassification).toBe("educational-composition");
      expect(state.compositionDisclosure).toContain("Educational Composition");
      expect(state.components.length).toBe(3);
      expect(state.connections.length).toBe(2);
      expect(state.clock.tick).toBe(0);
      expect(state.clock.simTimeSec).toBe(0);
    });

    it("transfers power across clutches and conserves energy in steady state", () => {
      let state = createInitialMechanicalChainState();

      // Step for 10 ticks to reach steady state
      for (let i = 0; i < 10; i++) {
        state = stepMechanicalChainLab(state, {
          engineRpm: 65,
          steamPressurePsi: 100,
          cutoffPct: 25,
          clutch1Connected: true,
          clutch2Connected: true,
        });
      }

      // Check rotary drive state
      const drive = state.componentStates["rotary-drive"];
      expect(drive.isRunning).toBeTrue();
      expect(drive.inputPowerWatts).toBeGreaterThan(0);
      expect(drive.telemetry.engineRpm).toBe(65);

      // Check Arkwright spinning frame response
      const arkwright = state.componentStates["arkwright-spinning"];
      expect(arkwright.isRunning).toBeTrue();
      expect(arkwright.inputPowerWatts).toBeGreaterThan(50);
      expect(arkwright.telemetry.wheelRpm).toBeCloseTo(180, 0);
      expect(Number(arkwright.telemetry.flyerSpindleRpm)).toBeGreaterThan(2000);
      expect(Number(arkwright.telemetry.outputYarnCountNe)).toBeGreaterThanOrEqual(6.0);

      // Check Howe sewing machine response
      const howe = state.componentStates["howe-sewing"];
      expect(howe.isRunning).toBeTrue();
      expect(howe.inputPowerWatts).toBeGreaterThan(20);
      expect(howe.telemetry.crankRpm).toBeCloseTo(240, 0);
      expect(Number(howe.telemetry.stitchesPerMinute)).toBeCloseTo(240, 0);
      expect(Number(howe.telemetry.clothFeedMmPerS)).toBeGreaterThan(10);

      // Check energy conservation and passivity
      expect(state.energy.isConserved).toBeTrue();
      expect(state.energy.isPassive).toBeTrue();
      expect(Math.abs(state.energy.measuredResidualWatts)).toBeLessThanOrEqual(
        state.energy.toleranceWatts,
      );
    });

    it("stops power transmission when Clutch 1 is disconnected and decelerates downstream components", () => {
      let state = createInitialMechanicalChainState();

      // Run steady first
      for (let i = 0; i < 5; i++) {
        state = stepMechanicalChainLab(state, { clutch1Connected: true, clutch2Connected: true });
      }

      const prevArkwrightRpm = Number(
        state.componentStates["arkwright-spinning"].telemetry.wheelRpm,
      );
      expect(prevArkwrightRpm).toBeGreaterThan(100);

      // Disconnect Clutch 1
      for (let i = 0; i < 30; i++) {
        state = stepMechanicalChainLab(state, { clutch1Connected: false, clutch2Connected: true });
      }

      // Clutch 1 transferred power must be exactly 0
      expect(state.connections[0].connected).toBeFalse();
      expect(state.connections[0].transitionState).toBe("disengaged");
      expect(state.connections[0].transferredPowerWatts).toBe(0);

      // Arkwright speed must have decelerated toward 0
      const deceleratedRpm = Number(state.componentStates["arkwright-spinning"].telemetry.wheelRpm);
      expect(deceleratedRpm).toBeLessThan(prevArkwrightRpm * 0.5);

      // Howe sewing machine must also slow down because upstream Arkwright slowed down
      const howeRpm = Number(state.componentStates["howe-sewing"].telemetry.crankRpm);
      expect(howeRpm).toBeLessThan(100);

      // Energy conservation must still hold during spindown
      expect(state.energy.isConserved).toBeTrue();
      expect(Math.abs(state.energy.measuredResidualWatts)).toBeLessThanOrEqual(
        state.energy.toleranceWatts,
      );
    });

    it("exhibits physically defined friction slip transition on clutch reconnection", () => {
      let state = createInitialMechanicalChainState();

      // Disconnect first
      for (let i = 0; i < 35; i++) {
        state = stepMechanicalChainLab(state, { clutch1Connected: false });
      }

      expect(state.connections[0].transitionState).toBe("disengaged");
      expect(Number(state.componentStates["arkwright-spinning"].telemetry.wheelRpm)).toBeLessThan(
        50,
      );

      // Reconnect Clutch 1: tick 1 of reconnection must enter slipping state
      state = stepMechanicalChainLab(state, { clutch1Connected: true });
      expect(state.connections[0].connected).toBeTrue();
      expect(state.connections[0].transitionState).toBe("slipping");
      expect(state.connections[0].couplingLossWatts).toBeGreaterThan(0); // Slip friction dissipation

      // Step until slip phase completes
      for (let i = 0; i < 25; i++) {
        state = stepMechanicalChainLab(state, { clutch1Connected: true });
      }

      expect(state.connections[0].transitionState).toBe("engaged");
      expect(state.connections[0].transitionProgress).toBe(1.0);
      expect(state.connections[0].couplingLossWatts).toBe(0); // No slip once locked
      expect(Number(state.componentStates["arkwright-spinning"].telemetry.wheelRpm)).toBeCloseTo(
        180,
        0,
      );
    });

    it("detects injected energy errors and refuses non-passive states", () => {
      let state = createInitialMechanicalChainState();
      state = stepMechanicalChainLab(state, { clutch1Connected: true });
      expect(state.energy.injectedEnergyError).toBeFalse();

      // Inject unphysical negative dissipation fault
      const faultState = stepMechanicalChainLab(state, {
        clutch1Connected: true,
        injectedFault: "negative_dissipation",
      });

      expect(faultState.energy.injectedEnergyError).toBeTrue();
      expect(faultState.energy.isPassive).toBeFalse();
      expect(faultState.energy.refusal).toBeDefined();
      expect(faultState.energy.refusal?.isRefused).toBeTrue();
      expect(faultState.energy.refusal?.reason).toContain("Negative dissipation detected");
    });
  });

  describe("Pilot Lab 2: Electrical Power Chain (Dynamo -> Transformer -> Lamp)", () => {
    it("initializes with authentic component specifications and educational disclosure", () => {
      const state = createInitialElectricalChainState();
      expect(state.labId).toBe("electrical-power-chain");
      expect(state.compositionClassification).toBe("educational-composition");
      expect(state.compositionDisclosure).toContain("Gramme Dynamo US 120,057");
      expect(state.components.length).toBe(3);
      expect(state.connections.length).toBe(2);
    });

    it("solves closed-circuit power transmission, heats filament, and conserves power", () => {
      let state = createInitialElectricalChainState();

      // Step for 15 ticks to heat filament toward thermal equilibrium
      for (let i = 0; i < 15; i++) {
        state = stepElectricalChainLab(state, {
          shaftRate: 1.0,
          fieldExcitation: 1.0,
          switch1Connected: true,
          switch2Connected: true,
        });
      }

      // Check Dynamo
      const dynamo = state.componentStates["gramme-dynamo"];
      expect(dynamo.isRunning).toBeTrue();
      expect(Number(dynamo.telemetry.openCircuitEmfV)).toBe(120);
      expect(Number(dynamo.telemetry.loadCurrentA)).toBeGreaterThan(0.5);

      // Check Transformer
      const transformer = state.componentStates["tesla-transformer"];
      expect(transformer.isRunning).toBeTrue();
      expect(transformer.inputPowerWatts).toBeGreaterThan(0);
      expect(transformer.outputPowerWatts).toBeGreaterThan(0);

      // Check Edison Lamp
      const lamp = state.componentStates["edison-lamp"];
      expect(lamp.isRunning).toBeTrue();
      expect(lamp.inputPowerWatts).toBeGreaterThan(0);
      expect(Number(lamp.telemetry.filamentTempK)).toBeGreaterThan(500);
      expect(Number(lamp.telemetry.radiativePowerW)).toBeGreaterThan(0);

      // Energy conservation
      expect(state.energy.isConserved).toBeTrue();
      expect(state.energy.isPassive).toBeTrue();
      expect(Math.abs(state.energy.measuredResidualWatts)).toBeLessThanOrEqual(
        state.energy.toleranceWatts,
      );
    });

    it("stops power transmission when Switch 1 opens, placing generator in open circuit and cooling lamp", () => {
      let state = createInitialElectricalChainState();

      // Heat up first
      for (let i = 0; i < 15; i++) {
        state = stepElectricalChainLab(state, { switch1Connected: true, switch2Connected: true });
      }

      const hotTemp = Number(state.componentStates["edison-lamp"].telemetry.filamentTempK);
      expect(hotTemp).toBeGreaterThan(600);

      // Open Switch 1
      for (let i = 0; i < 20; i++) {
        state = stepElectricalChainLab(state, { switch1Connected: false, switch2Connected: true });
      }

      expect(state.connections[0].connected).toBeFalse();
      expect(state.connections[0].transferredPowerWatts).toBe(0);

      // Generator must be in open-circuit state: terminal voltage == EMF, load current == 0
      const dynamo = state.componentStates["gramme-dynamo"];
      expect(Number(dynamo.telemetry.loadCurrentA)).toBe(0);
      expect(Number(dynamo.telemetry.terminalVoltageV)).toBe(120);

      // Lamp must have cooled down toward ambient
      const cooledTemp = Number(state.componentStates["edison-lamp"].telemetry.filamentTempK);
      expect(cooledTemp).toBeLessThan(hotTemp * 0.75);

      // Energy balance during cooling must remain conserved
      expect(state.energy.isConserved).toBeTrue();
    });

    it("detects unphysical energy injection and negative resistance in electrical load", () => {
      let state = createInitialElectricalChainState();
      state = stepElectricalChainLab(state, { switch1Connected: true, switch2Connected: true });

      const faultState = stepElectricalChainLab(state, {
        switch1Connected: true,
        switch2Connected: true,
        injectedFault: "negative_resistance",
      });

      expect(faultState.energy.injectedEnergyError).toBeTrue();
      expect(faultState.energy.isPassive).toBeFalse();
      expect(faultState.energy.refusal).toBeDefined();
      expect(faultState.energy.refusal?.reason).toContain("Negative dissipation detected");
    });
  });

  describe("Deterministic Replay Integrity", () => {
    it("reproduces bit-exact trajectories across identical action recordings for Mechanical Lab", () => {
      const actions: CoupledLabAction[] = [
        {
          tick: 3,
          type: "toggle_connection",
          targetId: "clutch-engine-to-arkwright",
          value: false,
        },
        { tick: 8, type: "toggle_connection", targetId: "clutch-engine-to-arkwright", value: true },
        { tick: 12, type: "toggle_connection", targetId: "clutch-arkwright-to-howe", value: false },
      ];

      const run1 = executeCoupledLabReplay("mechanical-rotary-chain", {}, actions, 20);
      const run2 = executeCoupledLabReplay("mechanical-rotary-chain", {}, actions, 20);

      expect(run1.length).toBe(21); // initial + 20 ticks
      expect(run2.length).toBe(21);

      for (let i = 0; i < run1.length; i++) {
        const s1 = run1[i];
        const s2 = run2[i];

        expect(s1.clock.tick).toBe(s2.clock.tick);
        expect(s1.clock.simTimeSec).toBe(s2.clock.simTimeSec);

        // Connection states
        expect(s1.connections[0].connected).toBe(s2.connections[0].connected);
        expect(s1.connections[0].transferredPowerWatts).toBe(
          s2.connections[0].transferredPowerWatts,
        );
        expect(s1.connections[1].connected).toBe(s2.connections[1].connected);
        expect(s1.connections[1].transferredPowerWatts).toBe(
          s2.connections[1].transferredPowerWatts,
        );

        // Component telemetries
        expect(s1.componentStates["rotary-drive"].inputPowerWatts).toBe(
          s2.componentStates["rotary-drive"].inputPowerWatts,
        );
        expect(s1.componentStates["arkwright-spinning"].telemetry.wheelRpm).toBe(
          s2.componentStates["arkwright-spinning"].telemetry.wheelRpm,
        );
        expect(s1.componentStates["howe-sewing"].telemetry.crankRpm).toBe(
          s2.componentStates["howe-sewing"].telemetry.crankRpm,
        );

        // Energy residuals
        expect(s1.energy.measuredResidualWatts).toBe(s2.energy.measuredResidualWatts);
      }
    });

    it("reproduces bit-exact trajectories across identical action recordings for Electrical Lab", () => {
      const actions: CoupledLabAction[] = [
        {
          tick: 4,
          type: "toggle_connection",
          targetId: "switch-generator-to-transformer",
          value: false,
        },
        {
          tick: 10,
          type: "toggle_connection",
          targetId: "switch-generator-to-transformer",
          value: true,
        },
      ];

      const run1 = executeCoupledLabReplay("electrical-power-chain", {}, actions, 18);
      const run2 = executeCoupledLabReplay("electrical-power-chain", {}, actions, 18);

      expect(run1.length).toBe(19);
      expect(run2.length).toBe(19);

      for (let i = 0; i < run1.length; i++) {
        const s1 = run1[i];
        const s2 = run2[i];

        expect(s1.clock.tick).toBe(s2.clock.tick);
        expect(s1.connections[0].transferredPowerWatts).toBe(
          s2.connections[0].transferredPowerWatts,
        );
        expect(s1.componentStates["edison-lamp"].telemetry.filamentTempK).toBe(
          s2.componentStates["edison-lamp"].telemetry.filamentTempK,
        );
        expect(s1.energy.measuredResidualWatts).toBe(s2.energy.measuredResidualWatts);
      }
    });
  });

  describe("Backwards Compatibility for Single-Patent coupleEdgesFor", () => {
    it("preserves established coupleEdgesFor outputs across flagship patents", () => {
      const wright = coupleEdgesFor("us-821393-wright-flyer", { wingWarp: 8, airspeed: 28 });
      expect(wright.length).toBeGreaterThan(0);
      expect(wright[0].from).toBe("wing warp");
      expect(wright[0].to).toBe("adverse yaw");

      const tesla = coupleEdgesFor("us-381968-tesla-motor", { frequency: 60 });
      expect(tesla.length).toBe(2);
      expect(tesla[0].from).toBe("generator G");

      const edison = coupleEdgesFor("us-223898-edison-lightbulb", { voltage: 110 });
      expect(edison.length).toBe(1);
      expect(edison[0].from).toBe("I²R");

      const gramme = coupleEdgesFor("us-120057-gramme-dynamo", { shaftRate: 1.0 });
      expect(gramme.length).toBe(1);
      expect(gramme[0].from).toBe("shaft rate");

      const arkwright = coupleEdgesFor("gb-931-arkwright-water-frame", { totalDraftRatio: 6 });
      expect(arkwright.length).toBe(1);
      expect(arkwright[0].from).toBe("draft");

      const howe = coupleEdgesFor("us-4750-howe-sewing-machine", { crankRpm: 240 });
      expect(howe.length).toBe(1);
      expect(howe[0].from).toBe("main shaft C");
    });
  });
});
