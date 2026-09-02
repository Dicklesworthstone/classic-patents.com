import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { stepHaberAmmonia } from "@/physics/catalogKernels";
import { buildHaberAmmoniaModel, HABER_3D_SOURCE_BOUNDARY } from "./haberAmmoniaModel";

describe("US 971,501 Fritz Haber Ammonia Synthesis Visual Boundary", () => {
  const rootDir = process.cwd();
  const modelPath = join(rootDir, "src/components/patents/visuals/three/haberAmmoniaModel.ts");
  const studioPath = join(rootDir, "src/components/patents/visuals/three/HaberAmmonia3D.tsx");

  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    expect(existsSync(modelPath)).toBe(true);
    expect(existsSync(studioPath)).toBe(true);

    const modelSource = readFileSync(modelPath, "utf-8");
    const studioSource = readFileSync(studioPath, "utf-8");

    expect(modelSource).not.toContain("GLTFLoader");
    expect(modelSource).not.toContain(".gltf");
    expect(modelSource).not.toContain(".glb");

    expect(studioSource).not.toContain("GLTFLoader");
    expect(studioSource).not.toContain(".gltf");
    expect(studioSource).not.toContain(".glb");
    expect(studioSource).toContain('usePatentPhysics("us-971501-haber-ammonia")');
    expect(studioSource).toContain('updateParam("pressureAtm"');
    expect(studioSource).not.toContain("setPressureAtm");
    expect(modelSource).not.toContain("const compSpeed = 4.0");
    expect(modelSource).toContain("HABER_3D_SOURCE_BOUNDARY");
    expect(modelSource).toContain("No Drawing");
    const simSource = readFileSync(
      join(rootDir, "src/components/patents/visuals/HaberAmmoniaSim.tsx"),
      "utf-8",
    );
    expect(simSource).toContain("physics.compressorDisplayOmegaRadPerS");
    expect(simSource).not.toContain("time * 6)");
    expect(simSource).toContain("physics.catalystParticleAdvance");
    expect(simSource).toContain("physics.condenserDripAdvance");
    expect(simSource).toContain("sourceBoundedVisualOnly");
    expect(studioSource).toContain("sourceBoundedVisualOnly");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const modelSource = readFileSync(modelPath, "utf-8");
    const studioSource = readFileSync(studioPath, "utf-8");

    expect(modelSource).not.toContain("Math.random");
    expect(studioSource).not.toContain("Math.random");
    expect(studioSource).not.toContain("new THREE.Clock");
    expect(studioSource).not.toContain("performance.now");
  });

  test("computes genuine Le Chatelier equilibrium, kinetics, and exotherm in SI units", () => {
    const res = stepHaberAmmonia({
      pressureAtm: 175,
      temperatureCelsius: 530,
      feedFlowRateMolesPerSec: 50,
      catalystActivity: 1.0,
    });

    expect(res.pressureAtm).toBe(175);
    expect(res.pressureMpa).toBeCloseTo(17.73, 1);
    expect(res.catalystTemperatureCelsius).toBe(530);
    expect(res.ammoniaYieldPct).toBeGreaterThan(6.0);
    expect(res.ammoniaYieldPct).toBeLessThan(18.0);
    expect(res.ammoniaProductionKgPerHour).toBeGreaterThan(10);
    expect(res.reactionHeatGeneratedKw).toBeGreaterThan(5);
    expect(res.feedPreheatTemperatureCelsius).toBeGreaterThan(100);
    expect(res.recycleRatio).toBeGreaterThan(5);
    expect(res.compressorDisplayOmegaRadPerS).toBeCloseTo(4.0, 3);
    expect(res.loopFlowAdvance).toBeCloseTo(0.02, 4);
    const doubleFeed = stepHaberAmmonia({ feedFlowRateMolesPerSec: 100 });
    expect(doubleFeed.compressorDisplayOmegaRadPerS).toBeCloseTo(8.0, 3);
  });

  test("refuses the unsupported process-loop model because the grant has no drawing", () => {
    expect(HABER_3D_SOURCE_BOUNDARY).toContain("no drawing");
    expect(() => buildHaberAmmoniaModel()).toThrow(HABER_3D_SOURCE_BOUNDARY);
  });

  test("derives all 6 printed claims dynamically from edition without duplicate strings", () => {
    const { haberAmmoniaPatent } = require("@/data/patents/haber-ammonia");
    const { haberAmmoniaArchivalEdition } = require("@/data/editions/haberAmmoniaEdition");
    expect(haberAmmoniaPatent.claims.length).toBe(6);
    const editionClaims = haberAmmoniaArchivalEdition.blocks.filter((b: any) => b.kind === "claim");
    expect(editionClaims.length).toBe(6);

    for (const claim of haberAmmoniaPatent.claims) {
      const editionBlock = editionClaims.find((c: any) => c.number === claim.number);
      expect(editionBlock).toBeDefined();
      const expectedText = editionBlock.inlines.map((inl: any) => inl.text).join("");
      expect(claim.originalText).toBe(expectedText);
    }
  });

  test("provides valid provenance classifications for all Haber controls and metrics", () => {
    const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
    const entry = PATENT_PHYSICS_REGISTRY["us-971501-haber-ammonia"];
    expect(entry).toBeDefined();
    for (const ctrl of entry.controls) {
      expect(ctrl.provenance).toBeDefined();
    }
    const metrics = entry.computeMetrics({ pressureAtm: 175, temperatureCelsius: 530 });
    for (const m of metrics) {
      expect(m.provenance).toBeDefined();
    }
  });

  test("binds energy output to honest omission reason without synthetic wattage", () => {
    const {
      energyChannelsFor,
      ENERGY_CHANNEL_OMISSION_REASONS,
    } = require("@/physics/energyChannels");
    expect(energyChannelsFor("us-971501-haber-ammonia", {})).toEqual([]);
    expect(ENERGY_CHANNEL_OMISSION_REASONS["us-971501-haber-ammonia"]).toContain(
      "no continuous mechanical or electrical power consumption",
    );
  });
});
