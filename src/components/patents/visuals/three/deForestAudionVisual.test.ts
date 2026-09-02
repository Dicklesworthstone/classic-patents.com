import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { stepDeForestAudion } from "@/physics/catalogKernels";
import { articulateDeForestAudionModel, buildDeForestAudionModel } from "./deForestAudionModel";

describe("US 879,532 Lee de Forest Audion Triode Visual & Electronics Boundary", () => {
  const rootDir = process.cwd();
  const modelPath = join(rootDir, "src/components/patents/visuals/three/deForestAudionModel.ts");
  const studioPath = join(rootDir, "src/components/patents/visuals/three/DeForestAudion3D.tsx");

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
    expect(studioSource).not.toContain("[cameraPreset, live]");
    expect(studioSource).toContain("controls.setView");
    const simSource = readFileSync(
      join(rootDir, "src/components/patents/visuals/DeForestAudionSim.tsx"),
      "utf-8",
    );
    expect(simSource).toContain("physics.electronDisplayAdvance");
    expect(simSource).toContain("physics.scopeSweepOmegaRadPerS");
    expect(simSource).not.toContain("time * 1.8");
    expect(simSource).not.toContain("- time * 6");
    expect(modelSource).not.toContain("const speed = 0.02");
    expect(studioSource).toContain("electronStreamAdvancePerFrame");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const modelSource = readFileSync(modelPath, "utf-8");
    const studioSource = readFileSync(studioPath, "utf-8");

    expect(modelSource).not.toContain("Math.random");
    expect(studioSource).not.toContain("Math.random");
    expect(studioSource).not.toContain("new THREE.Clock");
    expect(studioSource).not.toContain("performance.now");
  });

  test("2D plate/grid/filament sliders write the shared physics bus", () => {
    const simSource = readFileSync(
      join(rootDir, "src/components/patents/visuals/DeForestAudionSim.tsx"),
      "utf-8",
    );
    expect(simSource).toContain('usePatentPhysics("us-879532-de-forest-audion")');
    expect(simSource).toContain('updateParam("plateVoltageV"');
    expect(simSource).toContain('updateParam("gridBiasVoltageV"');
    expect(simSource).not.toContain("setPlateVoltageV");
  });

  test("computes genuine Child-Langmuir plate current, transconductance, and voltage gain in SI units", () => {
    const res = stepDeForestAudion({
      plateVoltageV: 45,
      gridBiasVoltageV: -1.5,
      filamentCurrentA: 1.0,
      gridSignalAmplitudeMv: 50,
      loadResistanceKOhms: 20,
    });

    expect(res.plateVoltageV).toBe(45);
    expect(res.filamentTemperatureK).toBeGreaterThan(2000);
    expect(res.amplificationFactorMu).toBe(12.0);
    expect(res.plateCurrentMa).toBeGreaterThan(0.5);
    expect(res.voltageGain).toBeGreaterThan(5.0);
    expect(res.outputSignalMv).toBeGreaterThan(250);
    expect(res.dynamicTransconductanceMicromhos).toBeGreaterThan(200);
    expect(res.gridCutoffVoltageV).toBeLessThan(-3.0);
  });

  test("builds and articulates procedural glass bulb, filament, grid, and plate collector", () => {
    const nodes = buildDeForestAudionModel();
    expect(nodes.root).toBeDefined();
    expect(nodes.glassBulb).toBeDefined();
    expect(nodes.filamentMesh).toBeDefined();
    expect(nodes.filamentLight).toBeDefined();
    expect(nodes.gridMesh).toBeDefined();
    expect(nodes.plateMesh).toBeDefined();
    expect(nodes.materials.length).toBeGreaterThan(4);

    const sim = stepDeForestAudion({ plateVoltageV: 45, filamentCurrentA: 1.0 });
    articulateDeForestAudionModel(
      nodes,
      {
        filamentTemperatureK: 2200,
        plateCurrentMa: 2.0,
        voltageGain: 8.5,
        isConducting: true,
        electronStreamAdvancePerFrame: sim.electronStreamAdvancePerFrame,
      },
      1.0,
    );

    expect(nodes.filamentLight.intensity).toBeGreaterThan(2.0);
  });

  test("derives all printed claims dynamically from edition without duplicate strings", () => {
    const { deForestAudionPatent } = require("@/data/patents/de-forest-audion");
    const { deForestAudionArchivalEdition } = require("@/data/editions/deForestAudionEdition");
    expect(deForestAudionPatent.claims.length).toBeGreaterThanOrEqual(1);
    const editionClaims = deForestAudionArchivalEdition.blocks.filter(
      (b: any) => b.kind === "claim",
    );
    expect(editionClaims.length).toBe(deForestAudionPatent.claims.length);

    for (const claim of deForestAudionPatent.claims) {
      const editionBlock = editionClaims.find((c: any) => c.number === claim.number);
      expect(editionBlock).toBeDefined();
      const expectedText = editionBlock.inlines.map((inl: any) => inl.text).join("");
      expect(claim.originalText).toBe(expectedText);
    }
  });

  test("provides valid provenance classifications for all Audion controls and metrics", () => {
    const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
    const entry = PATENT_PHYSICS_REGISTRY["us-879532-de-forest-audion"];
    expect(entry).toBeDefined();
    for (const ctrl of entry.controls) {
      expect(ctrl.provenance).toBeDefined();
    }
    const metrics = entry.computeMetrics({ plateVoltageV: 45, filamentCurrentA: 1.0 });
    for (const m of metrics) {
      expect(m.provenance).toBeDefined();
    }
  });
});
