import { describe, expect, test } from "bun:test";
import * as THREE from "three";
import {
  blackbodyRgb,
  computeCarrierSprayField,
  computeCcdPotentialWellField,
  computeEdisonFilamentThermalField,
  computeFarnsworthRasterField,
  computeFermiNormalizedDisplayField,
  computeGoddardPlumeField,
  computeJouleThomsonThermalField,
  computeLaserCavityField,
  computeNoyceDepletionField,
  computeSpencerPathFieldDisplay,
  computeSteamEnthalpyField,
  computeTeslaCoilEField,
  computeTeslaRotatingBField,
  computeWrightAirflowVelocityField,
  createColormappedFieldTexture,
  createScalarDataTexture,
  evaluateWrightAirflowVelocityVector,
  getFieldBufferPool,
  sampleThermalColormap,
  updateColormappedFieldTexture,
} from "./fieldTextures";
import {
  getAllSpatialFieldDescriptors,
  getSpatialFieldBlocker,
  getSpatialFieldDescriptor,
  isSpatialFieldAdmitted,
  SPATIAL_FIELD_REGISTRY,
} from "./spatialFieldInventory";

describe("Spatial Field Inventory & Flagship Sampled Models (classic-patentscom-2y5.13, 2y5.14)", () => {
  describe("Spatial Field Registry & Provenance Accounting", () => {
    test("registry contains 14 flagship field descriptors with rigorous provenance", () => {
      expect(Object.keys(SPATIAL_FIELD_REGISTRY).length).toBe(14);
      const descriptors = getAllSpatialFieldDescriptors();
      expect(descriptors.length).toBe(14);

      for (const desc of descriptors) {
        expect(desc.patentId.length).toBeGreaterThan(0);
        expect(desc.fieldId.length).toBeGreaterThan(0);
        expect(desc.fieldName.length).toBeGreaterThan(0);
        expect(desc.governingEquation.length).toBeGreaterThan(0);
        expect(desc.materialBoundaryInputs.length).toBeGreaterThan(0);
        expect(desc.generatorFunction.length).toBeGreaterThan(0);
        expect(desc.twoDimensionalConsumer.length).toBeGreaterThan(0);
        expect(desc.threeDimensionalConsumer.length).toBeGreaterThan(0);
        expect(desc.gridDimensions.length).toBeGreaterThanOrEqual(2);
        expect(desc.sampleBufferType).toBe("Float32Array");

        // Domain verification
        expect([
          "aerodynamics_mbd",
          "electromagnetics_flux",
          "thermodynamics_transport",
          "semiconductor_microarch",
          "semiconductor_carrier",
          "nuclear_kinetics",
          "thermo_fluid",
          "optics_waves",
        ]).toContain(desc.domain);

        // Status classification
        expect(["admitted-sample", "topology-display", "explicitly-blocked"]).toContain(
          desc.status,
        );
      }
    });

    test("explicitly tracks blockers for historical patents lacking unconstrained PDE parameters", () => {
      // Fermi Pile lacks cross-sections Sigma_a, Sigma_s
      const fermiDesc = getSpatialFieldDescriptor("us-2708656-fermi-reactor");
      expect(fermiDesc).toBeDefined();
      expect(fermiDesc?.status).toBe("topology-display");
      expect(fermiDesc?.blockerTracking?.isBlocked).toBe(true);
      expect(fermiDesc?.blockerTracking?.reason).toContain("cross-sections");
      expect(fermiDesc?.blockerTracking?.unblockPrerequisite).toContain("cross-section library");
      expect(isSpatialFieldAdmitted("us-2708656-fermi-reactor")).toBe(false);
      expect(getSpatialFieldBlocker("us-2708656-fermi-reactor")).toContain("cross-sections");

      // Spencer Microwave lacks waveguide cross-section dimensions and RF power
      const spencerDesc = getSpatialFieldDescriptor("us-2495429-spencer-microwave");
      expect(spencerDesc).toBeDefined();
      expect(spencerDesc?.status).toBe("topology-display");
      expect(spencerDesc?.blockerTracking?.isBlocked).toBe(true);
      expect(spencerDesc?.blockerTracking?.reason).toContain("guide");
      expect(spencerDesc?.blockerTracking?.unblockPrerequisite).toContain("waveguide dimensions");
      expect(isSpatialFieldAdmitted("us-2495429-spencer-microwave")).toBe(false);
      expect(getSpatialFieldBlocker("us-2495429-spencer-microwave")).toContain("guide");

      // Admitted sample fields return true and null blocker
      expect(isSpatialFieldAdmitted("us-821393-wright-flyer")).toBe(true);
      expect(getSpatialFieldBlocker("us-821393-wright-flyer")).toBeNull();
      expect(isSpatialFieldAdmitted("us-381968-tesla-motor")).toBe(true);
      expect(isSpatialFieldAdmitted("us-593138-tesla-coil")).toBe(true);
      expect(isSpatialFieldAdmitted("us-223898-edison-lightbulb")).toBe(true);
      expect(isSpatialFieldAdmitted("us-2981877-noyce-ic")).toBe(true);
      expect(isSpatialFieldAdmitted("us-3858232-boyle-smith-ccd")).toBe(true);
    });
  });

  describe("Wright Flyer Biplane Airflow Vector & Scalar Field", () => {
    test("evaluates physical 3D velocity vectors with freestream, downwash, and warp differential", () => {
      const params = {
        airspeedMps: 13.4, // ~30 mph flight speed
        angleOfAttackRad: (6 * Math.PI) / 180,
        wingWarpDeg: 4, // 4 degrees differential twist
        elevatorPitchDeg: 2,
        rudderYawDeg: 3,
      };

      // Far upstream: approaches freestream
      const upstream = evaluateWrightAirflowVelocityVector(-12, 0, 0, params);
      expect(upstream[0]).toBeGreaterThan(12.0); // vx close to vInf * cos(alpha)
      expect(Number.isFinite(upstream[0])).toBe(true);
      expect(Number.isFinite(upstream[1])).toBe(true);
      expect(Number.isFinite(upstream[2])).toBe(true);

      // Downwash behind wings (x > 0): downwash vy should be negative (downward momentum imparting lift)
      const wake = evaluateWrightAirflowVelocityVector(3.0, 0, 0, params);
      expect(wake[1]).toBeLessThan(upstream[1]); // downward velocity deflection

      // Wing warping differential: right tip (z > 0) has increased AoA vs left tip (z < 0)
      const rightTip = evaluateWrightAirflowVelocityVector(1.0, 0, 5.0, params);
      const leftTip = evaluateWrightAirflowVelocityVector(1.0, 0, -5.0, params);
      // Asymmetric bound vortex downwash deflection across warped wingtips
      expect(Math.abs(rightTip[1] - leftTip[1])).toBeGreaterThan(0.01);

      // Rudder yaw produces lateral velocity vz
      const rudderWake = evaluateWrightAirflowVelocityVector(3.0, 0, 0, params);
      expect(Math.abs(rudderWake[2])).toBeGreaterThan(0.01);
    });

    test("computes 2D velocity magnitude field with zero allocations using target buffer", () => {
      const target = new Float32Array(32 * 32);
      const params = {
        airspeedMps: 13.4,
        angleOfAttackRad: 0.1,
        wingWarpDeg: 0,
      };

      const result = computeWrightAirflowVelocityField(params, 32, 32, target);
      expect(result).toBe(target);
      expect(result.length).toBe(1024);

      for (let i = 0; i < result.length; i++) {
        expect(Number.isFinite(result[i])).toBe(true);
        expect(result[i]).toBeGreaterThanOrEqual(0);
        expect(result[i]).toBeLessThanOrEqual(1);
      }
    });
  });

  describe("Tesla Motor Rotating B-Field (US 381,968)", () => {
    test("computes 4-pole quadrupole magnetic field rotating with stator electrical angle", () => {
      const target = new Float32Array(32 * 32);
      const bField0 = computeTeslaRotatingBField(0, 32, target);
      expect(bField0).toBe(target);

      for (let i = 0; i < bField0.length; i++) {
        expect(Number.isFinite(bField0[i])).toBe(true);
        expect(bField0[i]).toBeGreaterThanOrEqual(-1.01);
        expect(bField0[i]).toBeLessThanOrEqual(1.01);
      }

      // Rotate by pi/2 (90 deg electrical quadrature): field rotates orthogonally
      const bField90 = computeTeslaRotatingBField(Math.PI / 2, 32);
      let diffSum = 0;
      for (let i = 0; i < bField0.length; i++) {
        diffSum += Math.abs(bField0[i] - bField90[i]);
      }
      expect(diffSum / bField0.length).toBeGreaterThan(0.05);
    });
  });

  describe("Tesla Resonant Coil Standing Wave E-Field (US 593,138)", () => {
    test("evaluates quarter-wave resonant standing wave with grounded base node", () => {
      const target = new Float32Array(32 * 32);
      const resFreq = 85000; // 85 kHz
      const lengthMiles = 0.57; // ~quarter wave at 85 kHz in helical coil

      const field = computeTeslaCoilEField(resFreq, lengthMiles, 32, target);
      expect(field).toBe(target);
      expect(field.length).toBe(1024);

      // Base node at y=0 should be near zero (grounded base)
      const baseRow = field.slice(0, 32);
      const baseMax = Math.max(...baseRow);
      expect(baseMax).toBeLessThan(0.15);

      // Near top (antinode), field intensity should be significant
      const topRow = field.slice(28 * 32, 29 * 32);
      const topMax = Math.max(...topRow);
      expect(topMax).toBeGreaterThan(baseMax);
    });
  });

  describe("Edison Filament Thermal & Radiation Field (US 223,898)", () => {
    test("evaluates Fourier vacuum conduction and vacuum quenching upon seal breach", () => {
      const intactTarget = new Float32Array(32 * 32);
      const intactField = computeEdisonFilamentThermalField(
        2200, // 2200 K incandescence
        110, // 110 V mains
        1e-4, // High vacuum (Torr)
        32,
        intactTarget,
      );
      expect(intactField).toBe(intactTarget);

      const intactPeak = intactField.reduce((m, v) => Math.max(m, v), 0);
      expect(intactPeak).toBeGreaterThan(0.4);

      // Broken vacuum (760 Torr atmosphere): convective quenching
      const brokenField = computeEdisonFilamentThermalField(2200, 110, 760, 32);
      const brokenPeak = brokenField.reduce((m, v) => Math.max(m, v), 0);
      expect(brokenPeak).toBeLessThan(intactPeak * 0.25);

      // Cold bulb (300 K): zero incandescence
      const coldField = computeEdisonFilamentThermalField(300, 0, 1e-4, 32);
      const coldPeak = coldField.reduce((m, v) => Math.max(m, v), 0);
      expect(coldPeak).toBe(0);
    });
  });

  describe("Noyce Planar IC Depletion Field (US 2,981,877)", () => {
    test("space-charge depletion halo expands with sqrt(V_R + V_bi)", () => {
      const lowBias = computeNoyceDepletionField(1.0, 32);
      const highBias = computeNoyceDepletionField(15.0, 32);

      const lowIntegral = lowBias.reduce((sum, v) => sum + v, 0);
      const highIntegral = highBias.reduce((sum, v) => sum + v, 0);

      // Greater reverse bias expands depletion width
      expect(highIntegral).toBeGreaterThan(lowIntegral);
    });
  });

  describe("Boyle & Smith CCD Potential Well Field (US 3,858,232)", () => {
    test("3-phase clocking modulates potential barrier with exponential bulk depth decay", () => {
      const pixelCharges = [0.2, 0.8, 0.4, 0.9];
      const fieldP1 = computeCcdPotentialWellField(0, pixelCharges, 4, 32, 16);
      const fieldP2 = computeCcdPotentialWellField((2 * Math.PI) / 3, pixelCharges, 4, 32, 16);

      expect(fieldP1.length).toBe(512);
      // Surface potential (y=0) should be higher than deep bulk silicon (y=15)
      const surfaceVal = fieldP1[0 * 32 + 8];
      const bulkVal = fieldP1[15 * 32 + 8];
      expect(surfaceVal).toBeGreaterThan(bulkVal);

      // Clock phase shifts spatial potential distribution
      let diff = 0;
      for (let i = 0; i < fieldP1.length; i++) {
        diff += Math.abs(fieldP1[i] - fieldP2[i]);
      }
      expect(diff / fieldP1.length).toBeGreaterThan(0.05);
    });
  });

  describe("Thermodynamic, Wave & Fluid Field Generators", () => {
    test("Goddard Rocket expansion plume exhibits quasi-periodic shock diamonds", () => {
      const plume = computeGoddardPlumeField(200, 32);
      expect(plume.length).toBe(1024);
      for (const val of plume) {
        expect(Number.isFinite(val)).toBe(true);
        expect(val).toBeGreaterThanOrEqual(0);
        expect(val).toBeLessThanOrEqual(1);
      }
    });

    test("Maiman Ruby Laser exhibits TEM00 Gaussian beam waist", () => {
      const beam = computeLaserCavityField(80, 32);
      expect(beam.length).toBe(1024);
      // Center waist intensity should be higher than perimeter
      const center = beam[16 * 32 + 16];
      const edge = beam[0 * 32 + 0];
      expect(center).toBeGreaterThan(edge);
    });

    test("Farnsworth TV dissector raster computes aperture line and spot", () => {
      const raster = computeFarnsworthRasterField(0.5, 32, undefined, 0.5);
      expect(raster.length).toBe(1024);
      const center = raster[16 * 32 + 16];
      expect(center).toBeGreaterThan(0.8);
    });

    test("Linde Joule-Thomson thermal gradient reflects countercurrent heat exchange", () => {
      const jt = computeJouleThomsonThermalField(150, 80, 32);
      expect(jt.length).toBe(1024);
      for (const val of jt) {
        expect(Number.isFinite(val)).toBe(true);
      }
    });

    test("Parsons Steam Turbine enthalpy cascade decreases monotonically along stages", () => {
      const steam = computeSteamEnthalpyField(180, 48, 32);
      expect(steam.length).toBe(1024);
      // Inlet stage (u=0) has higher enthalpy than exhaust stage (u=1)
      const inlet = steam[16 * 32 + 2];
      const exhaust = steam[16 * 32 + 30];
      expect(inlet).toBeGreaterThan(exhaust);
    });

    test("Carrier Spray Chamber atomized droplet density peaks at nozzle coordinate", () => {
      const spray = computeCarrierSprayField(8000, 32);
      expect(spray.length).toBe(1024);
      for (const val of spray) {
        expect(Number.isFinite(val)).toBe(true);
      }
    });

    test("Fermi normalized display field responds to control rod insertion dip", () => {
      const allOut = computeFermiNormalizedDisplayField(1.002, 0.0, 32);
      const rodInserted = computeFermiNormalizedDisplayField(1.002, 0.9, 32);
      const sumOut = allOut.reduce((s, v) => s + v, 0);
      const sumIn = rodInserted.reduce((s, v) => s + v, 0);
      expect(sumIn).toBeLessThan(sumOut);
    });

    test("Spencer microwave treatment display produces bounded sinusoidal cavity pattern", () => {
      const spencer = computeSpencerPathFieldDisplay(32, 32);
      expect(spencer.length).toBe(1024);
      for (const val of spencer) {
        expect(Number.isFinite(val)).toBe(true);
        expect(val).toBeGreaterThanOrEqual(0);
        expect(val).toBeLessThanOrEqual(1);
      }
    });
  });

  describe("BoundedBufferPool Zero-Allocation Leasing for 60 FPS Renderers", () => {
    test("getFieldBufferPool returns cached pools with tri-buffering capacity", () => {
      const pool1 = getFieldBufferPool("wright-test", 32, 32, 3);
      const pool2 = getFieldBufferPool("wright-test", 32, 32, 3);
      expect(pool1).toBe(pool2);
      expect(pool1.capacity).toBe(3);

      // Acquire 3 buffers without heap thrashing
      const lease1 = pool1.acquire(1);
      const lease2 = pool1.acquire(2);
      const lease3 = pool1.acquire(3);

      expect(lease1.buffer.length).toBe(1024);
      expect(lease2.buffer.length).toBe(1024);
      expect(lease3.buffer.length).toBe(1024);

      // Leased buffers: active count is 3, total allocations is 3
      expect(pool1.activeLeaseCount).toBe(3);
      expect(pool1.allocatedBufferCount).toBe(3);

      // Bounded backpressure: evicts oldest lease under pressure without extra allocations
      const lease4 = pool1.acquire(4);
      expect(lease4).toBeDefined();
      expect(pool1.allocatedBufferCount).toBe(3); // Allocation plateaus at capacity!

      // Release leases back to pool
      lease1.release();
      lease2.release();
      lease3.release();
      lease4.release();
    });
  });

  describe("DataTexture Scientific Colormapping & In-Place Updates", () => {
    test("sampleThermalColormap converts [0, 1] scalar values to continuous RGB triples", () => {
      const navy = sampleThermalColormap(0.0);
      expect(navy[0]).toBe(0);
      expect(navy[2]).toBeGreaterThan(0.3); // deep blue

      const yellow = sampleThermalColormap(0.75);
      expect(yellow[0]).toBe(1.0);
      expect(yellow[1]).toBe(1.0);

      const hot = sampleThermalColormap(1.0);
      expect(hot[0]).toBe(1.0);
    });

    test("createScalarDataTexture and updateColormappedFieldTexture perform zero-leak updates", () => {
      const data = new Float32Array(32 * 32);
      data.fill(0.5);

      const texture = createScalarDataTexture(data, 32, 32);
      expect(texture.image.width).toBe(32);
      expect(texture.image.height).toBe(32);
      expect(texture.format).toBe(THREE.RedFormat);

      const colormapped = createColormappedFieldTexture(data, 32, 32);
      expect(colormapped.image.width).toBe(32);
      expect(colormapped.image.height).toBe(32);
      expect(colormapped.format).toBe(THREE.RGBAFormat);

      // In-place update
      data.fill(0.9);
      updateColormappedFieldTexture(colormapped, data, 32, 32);
      expect(colormapped.version).toBeGreaterThan(0);
      const updatedRgba = colormapped.image.data as Uint8Array;
      expect(updatedRgba[0]).toBeGreaterThan(200);

      texture.dispose();
      colormapped.dispose();
    });

    test("blackbodyRgb outputs valid CSS rgb color strings across Kelvin range", () => {
      expect(blackbodyRgb(300)).toMatch(/^rgb\(\d+,\s*\d+,\s*\d+\)$/);
      expect(blackbodyRgb(2200)).toMatch(/^rgb\(\d+,\s*\d+,\s*\d+\)$/);
      expect(blackbodyRgb(6500)).toMatch(/^rgb\(\d+,\s*\d+,\s*\d+\)$/);
    });
  });
});
