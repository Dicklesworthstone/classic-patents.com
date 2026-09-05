import { describe, expect, test } from "bun:test";
import { allPatents } from "@/data/patents";
import { buildPatentCoverageManifest, type SharedBusParticipation } from "./coverageManifest";
import {
  GENERIC_CRATE_EXPORT_AVAILABILITY,
  getAllPatentFieldInventories,
  KERNEL_MAPPING,
  verifyFieldInventoryCompleteness,
} from "./fieldInventory";
import type { QualifiedOutputRecord, StepReceipt, UniversalPatentPhysicsTelemetry } from "./types";
import {
  computeOutputDigest,
  deriveRuntimeExecutionState,
  TransportBus,
  validateEnvelopeOutputs,
} from "./useFrankenSimPhysics";

describe("Field-Level Inventory & Provenance Verification (classic-patentscom-2y5.5, 2y5.6)", () => {
  test("all 103 catalogue IDs have a complete field-level inventory with no unnamed owner, units, or origin", () => {
    const allInventories = getAllPatentFieldInventories();
    expect(Object.keys(allInventories)).toHaveLength(103);
    expect(allPatents).toHaveLength(103);

    let totalControls = 0;
    let totalOutputs = 0;

    for (const patent of allPatents) {
      const inventory = allInventories[patent.id];
      expect(inventory).toBeDefined();
      expect(inventory.patentId).toBe(patent.id);

      const verification = verifyFieldInventoryCompleteness(inventory);
      if (!verification.valid) {
        throw new Error(
          `Field inventory verification failed for ${patent.id}: ${verification.errors.join(", ")}`,
        );
      }
      expect(verification.valid).toBe(true);

      // Audit controls
      for (const ctrl of inventory.controls) {
        totalControls++;
        expect(ctrl.id.length).toBeGreaterThan(0);
        expect(ctrl.label.length).toBeGreaterThan(0);
        expect(typeof ctrl.unit).toBe("string");
        expect(ctrl.owner.length).toBeGreaterThan(0);
        expect(ctrl.owner).toContain("src/physics/");
        expect([
          "source-disclosed",
          "source-derived",
          "scenario-modern",
          "scenario-reader",
          "topology-normalized",
          "refusal-bounded",
        ]).toContain(ctrl.origin);
      }

      // Audit outputs
      for (const out of inventory.outputs) {
        totalOutputs++;
        expect(out.id.length).toBeGreaterThan(0);
        expect(out.label.length).toBeGreaterThan(0);
        expect(typeof out.unit).toBe("string");
        expect(out.owner.length).toBeGreaterThan(0);
        expect([
          "source-disclosed",
          "source-derived",
          "scenario-modern",
          "scenario-reader",
          "topology-normalized",
          "refusal-bounded",
        ]).toContain(out.origin);
        expect(out.governingFunction.length).toBeGreaterThan(0);
        expect(out.fallback.length).toBeGreaterThan(0);
        expect(out.domain.length).toBeGreaterThan(0);
        expect(out.refusal).toBeDefined();
        expect(typeof out.refusal.isRefused).toBe("boolean");
      }

      // Runtime owner audit
      expect(inventory.runtimeOwner.actualComputingOwner.length).toBeGreaterThan(0);
      expect(inventory.runtimeOwner.fallbackComputingOwner.length).toBeGreaterThan(0);
      expect(KERNEL_MAPPING[patent.id]).toBeDefined();

      // Energy channels audit
      expect(inventory.energyChannels).toBeDefined();
      if (!inventory.energyChannels?.hasEnergyChannels) {
        expect(inventory.energyChannels?.omissionReason).toBeDefined();
        expect(inventory.energyChannels?.omissionReason?.length).toBeGreaterThan(20);
      }
    }

    expect(totalControls).toBeGreaterThan(300);
    expect(totalOutputs).toBeGreaterThan(500);
  });

  test("coverage manifest includes field inventory on every row", () => {
    const manifest = buildPatentCoverageManifest(allPatents, {
      assetExists: () => true,
      isEditionPublished: () => true,
      hasVisualDispatch: () => true,
      hasTelemetryOwner: () => true,
      hasEquationSet: () => true,
      sharedBusParticipation: () => "updater" as SharedBusParticipation,
    });

    expect(manifest).toHaveLength(103);
    for (const row of manifest) {
      expect(row.fieldInventory).toBeDefined();
      expect(row.fieldInventory.patentId).toBe(row.patentId);
      expect(row.fieldInventory.controls).toBeDefined();
      expect(row.fieldInventory.outputs).toBeDefined();
      expect(verifyFieldInventoryCompleteness(row.fieldInventory).valid).toBe(true);
    }
  });

  test("generic crate export availability descriptor is complete and bound", () => {
    expect(GENERIC_CRATE_EXPORT_AVAILABILITY.length).toBeGreaterThanOrEqual(14);
    for (const descriptor of GENERIC_CRATE_EXPORT_AVAILABILITY) {
      expect(descriptor.crate.startsWith("fs-")).toBe(true);
      expect(descriptor.exportSymbol.length).toBeGreaterThan(0);
      expect(descriptor.internalBinding.length).toBeGreaterThan(0);
      expect(descriptor.domain.length).toBeGreaterThan(0);
      expect(descriptor.lawDescription.length).toBeGreaterThan(20);
      expect(descriptor.isBound).toBe(true);
    }
  });

  describe("Negative tests: runtime receipts and output qualification", () => {
    test("loaded-but-unstepped WASM module cannot promote execution state or provenance label", () => {
      // Receipt proves module is loaded in memory, but moduleStepped is FALSE
      const unsteppedReceipt: StepReceipt = {
        computingOwner: "fs-flyer-wasm",
        executionState: "loading",
        tick: 1,
        moduleLoaded: true,
        moduleStepped: false,
      };

      const derivedState = deriveRuntimeExecutionState({
        tick: 1,
        declaredProvenance: "WASM",
        receipt: unsteppedReceipt,
        isWasmLoaded: true,
      });

      // MUST NOT be "WASM" because the module did not step!
      expect(derivedState).toBe("fallback");
      expect(derivedState).not.toBe("WASM");
    });

    test("failed-step transitions to unavailable or refused and never reports WASM", () => {
      const errorReceipt: StepReceipt = {
        computingOwner: "fs-flyer-wasm",
        executionState: "unavailable",
        tick: 1,
        moduleLoaded: true,
        moduleStepped: false,
        error: new Error("WASM floating-point divide-by-zero"),
      };

      const derivedState = deriveRuntimeExecutionState({
        tick: 1,
        declaredProvenance: "WASM",
        receipt: errorReceipt,
      });

      expect(derivedState).toBe("unavailable");
      expect(derivedState).not.toBe("WASM");

      // Model refusal boundary triggered
      const refusalReceipt: StepReceipt = {
        computingOwner: "fs-flyer-wasm",
        executionState: "refused",
        tick: 1,
        refusal: {
          isRefused: true,
          reason: "Angle of attack exceeds post-stall boundary alpha > 22 deg",
        },
      };

      const refusedState = deriveRuntimeExecutionState({
        tick: 1,
        declaredProvenance: "WASM",
        receipt: refusalReceipt,
      });

      expect(refusedState).toBe("refused");
      expect(refusedState).not.toBe("WASM");
    });

    test("forbids mixed ticks in a single envelope", () => {
      const currentTick = 5;
      const validDigest1 = computeOutputDigest("lift", 3400, "fs-flyer-wasm", currentTick);
      const validDigest2 = computeOutputDigest("speed", 12.5, "fs-flyer-wasm", 4); // Stale tick 4!

      const qualifiedOutputs: Record<string, QualifiedOutputRecord> = {
        lift: {
          outputId: "lift",
          value: 3400,
          unit: "N",
          owner: "fs-flyer-wasm",
          provenance: "WASM",
          tick: currentTick,
          digest: validDigest1,
        },
        speed: {
          outputId: "speed",
          value: 12.5,
          unit: "m/s",
          owner: "fs-flyer-wasm",
          provenance: "WASM",
          tick: 4, // Stale!
          digest: validDigest2,
        },
      };

      const telemetry: UniversalPatentPhysicsTelemetry = {
        patentId: "us-821393-wright-flyer",
        domain: "aerodynamics_mbd",
        timestampMs: 5 * (1000 / 60),
        timeStepDt: 1 / 60,
        refusal: { isRefused: false },
        qualifiedOutputs,
      };

      const validation = validateEnvelopeOutputs(telemetry, currentTick);
      expect(validation.valid).toBe(false);
      expect(validation.violations.some((v) => v.includes("Mixed tick"))).toBe(true);
    });

    test("forbids borrowed or forged digests across outputs or owners", () => {
      const currentTick = 10;
      const genuineDigest = computeOutputDigest("drag", 280, "fs-flyer-wasm", currentTick);

      const qualifiedOutputs: Record<string, QualifiedOutputRecord> = {
        drag: {
          outputId: "drag",
          value: 280,
          unit: "N",
          owner: "fs-flyer-wasm",
          provenance: "WASM",
          tick: currentTick,
          digest: genuineDigest,
        },
        thrust: {
          outputId: "thrust",
          value: 450,
          unit: "N",
          owner: "fs-flyer-wasm",
          provenance: "WASM",
          tick: currentTick,
          digest: genuineDigest, // Borrowed digest from "drag"!
        },
      };

      const telemetry: UniversalPatentPhysicsTelemetry = {
        patentId: "us-821393-wright-flyer",
        domain: "aerodynamics_mbd",
        timestampMs: 10 * (1000 / 60),
        timeStepDt: 1 / 60,
        refusal: { isRefused: false },
        qualifiedOutputs,
      };

      const validation = validateEnvelopeOutputs(telemetry, currentTick);
      expect(validation.valid).toBe(false);
      expect(validation.violations.some((v) => v.includes("Borrowed or forged digest"))).toBe(true);
    });

    test("forbids forged WASM provenance on host TypeScript modules", () => {
      const currentTick = 8;
      const digest = computeOutputDigest("rpm", 450, "src/physics/catalogKernels.ts", currentTick);

      const qualifiedOutputs: Record<string, QualifiedOutputRecord> = {
        rpm: {
          outputId: "rpm",
          value: 450,
          unit: "RPM",
          owner: "src/physics/catalogKernels.ts", // Pure TS host module!
          provenance: "WASM", // Forged WASM claim!
          tick: currentTick,
          digest,
        },
      };

      const telemetry: UniversalPatentPhysicsTelemetry = {
        patentId: "us-194047-otto-engine",
        domain: "thermodynamics_transport",
        timestampMs: 8 * (1000 / 60),
        timeStepDt: 1 / 60,
        refusal: { isRefused: false },
        qualifiedOutputs,
      };

      const validation = validateEnvelopeOutputs(telemetry, currentTick);
      expect(validation.valid).toBe(false);
      expect(validation.violations.some((v) => v.includes("Forged WASM provenance"))).toBe(true);
    });

    test("permits legitimate mixed-owner envelope when all ticks and digests are valid", () => {
      const currentTick = 12;
      // Output 1: aerodynamic force from WASM kernel
      const wasmDigest = computeOutputDigest("liftNewtons", 3400, "fs-flyer-wasm", currentTick);
      // Output 2: visual airframe position from TypeScript host
      const hostDigest = computeOutputDigest(
        "pitchAngleRad",
        0.05,
        "src/physics/wrightKernel.ts",
        currentTick,
      );

      const qualifiedOutputs: Record<string, QualifiedOutputRecord> = {
        liftNewtons: {
          outputId: "liftNewtons",
          value: 3400,
          unit: "N",
          owner: "fs-flyer-wasm",
          provenance: "WASM",
          tick: currentTick,
          digest: wasmDigest,
        },
        pitchAngleRad: {
          outputId: "pitchAngleRad",
          value: 0.05,
          unit: "rad",
          owner: "src/physics/wrightKernel.ts",
          provenance: "fallback",
          tick: currentTick,
          digest: hostDigest,
        },
      };

      const telemetry: UniversalPatentPhysicsTelemetry = {
        patentId: "us-821393-wright-flyer",
        domain: "aerodynamics_mbd",
        timestampMs: 12 * (1000 / 60),
        timeStepDt: 1 / 60,
        refusal: { isRefused: false },
        qualifiedOutputs,
      };

      const validation = validateEnvelopeOutputs(telemetry, currentTick);
      expect(validation.valid).toBe(true);
      expect(validation.violations).toHaveLength(0);
    });
  });

  describe("Browser unload/reload and WASM-disabled truthful provenance", () => {
    test("WASM-disabled path reports TS_FALLBACK and preserves last valid state", () => {
      const bus = new TransportBus();
      const patentId = "us-test-wasm-disabled";
      const transport = bus.getTransport(patentId, {
        aero: {
          airspeedMps: 15,
          altitudeMeters: 5,
          angleOfAttackRad: 0.1,
          sideslipRad: 0,
          pitchRateRps: 0,
          rollRateRps: 0,
          yawRateRps: 0,
          liftNewtons: 3600,
          inducedDragNewtons: 300,
          parasiticDragNewtons: 200,
          thrustNewtons: 500,
          elevatorDeflectionDeg: 0,
          rudderDeflectionDeg: 0,
          wingWarpDeflectionDeg: 0,
        },
      });

      // Register updater with TS_FALLBACK
      const unregister = bus.registerUpdater(
        patentId,
        (prev) => ({
          aero: prev.aero
            ? {
                ...prev.aero,
                airspeedMps: prev.aero.airspeedMps + 0.1,
              }
            : undefined,
        }),
        "TS_FALLBACK",
      );

      const frames: any[] = [];
      const unsubscribe = transport.subscribe((f) => frames.push(f));

      // Initial frame
      expect(transport.lastFrame.tick).toBe(1);
      expect(transport.lastFrame.provenance).toBe("TS_FALLBACK");
      expect(transport.lastFrame.telemetry.aero?.airspeedMps).toBeCloseTo(15.1);

      // Unregister (simulates browser unload of 3D visual)
      unregister();
      unsubscribe();

      // Bus receipt reflects unmounted updater
      const receipt = bus.runtimeReceipt(patentId);
      expect(receipt.hasUpdater).toBe(false);
      expect(receipt.hasListeners).toBe(false);

      // Last valid state is preserved without substitution or destruction
      expect(transport.lastFrame.telemetry.patentId).toBe(patentId);
      expect(transport.lastFrame.telemetry.aero?.airspeedMps).toBeCloseTo(15.1);
      expect(transport.lastFrame.provenance).toBe("TS_FALLBACK");

      // Remounting another patent does not substitute or corrupt this patent
      const otherTransport = bus.getTransport("us-different-patent");
      expect(otherTransport.patentId).toBe("us-different-patent");
      expect(transport.patentId).toBe(patentId);
    });
  });
});
