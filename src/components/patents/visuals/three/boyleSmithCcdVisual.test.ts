import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stepBoyleSmithCcd } from "@/physics/catalogKernels";
import { createBoyleSmithCcdModel } from "./boyleSmithCcdModel";

describe("US 3,858,232 Willard Boyle & George Smith Charge-Coupled Devices Visual Boundary", () => {
  const root = process.cwd();

  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const modelPath = join(root, "src/components/patents/visuals/three/boyleSmithCcdModel.ts");
    const studioPath = join(root, "src/components/patents/visuals/three/BoyleSmithCcd3D.tsx");

    const modelCode = readFileSync(modelPath, "utf8");
    const studioCode = readFileSync(studioPath, "utf8");

    expect(modelCode).not.toContain("GLTFLoader");
    expect(modelCode).not.toContain(".gltf");
    expect(modelCode).not.toContain(".glb");

    expect(studioCode).not.toContain("GLTFLoader");
    expect(studioCode).not.toContain(".gltf");
    expect(studioCode).not.toContain(".glb");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const modelPath = join(root, "src/components/patents/visuals/three/boyleSmithCcdModel.ts");
    const modelCode = readFileSync(modelPath, "utf8");

    expect(modelCode).not.toContain("Math.random()");
    expect(modelCode).not.toContain("Date.now()");
    expect(modelCode).not.toContain("performance.now()");
  });

  test("computes genuine surface potential, full-well capacity, and CTE in SI units", () => {
    // Normal 10V gate clock
    const normal = stepBoyleSmithCcd({ gateVoltageV: 10, incidentLux: 250 });
    expect(normal.surfacePotentialV).toBeGreaterThan(5.0);
    expect(normal.fullWellCapacityElectrons).toBeGreaterThan(100000);
    expect(normal.totalCollectedElectrons).toBeGreaterThan(0);
    expect(normal.ctePct).toBeGreaterThan(99.9);
    expect(normal.snrDb).toBeGreaterThan(10);

    // High 15V gate clock increases well depth and capacity
    const highV = stepBoyleSmithCcd({ gateVoltageV: 15, incidentLux: 250 });
    expect(highV.surfacePotentialV).toBeGreaterThan(normal.surfacePotentialV);
    expect(highV.fullWellCapacityElectrons).toBeGreaterThan(normal.fullWellCapacityElectrons);
  });

  test("builds and articulates procedural silicon substrate, oxide layer, gate array, and electron packets", () => {
    const model = createBoyleSmithCcdModel();
    expect(model.nodes.siliconSubstrate).toBeDefined();
    expect(model.nodes.oxideLayer).toBeDefined();
    expect(model.nodes.gateArray).toBeDefined();
    expect(model.nodes.electronPackets).toBeDefined();
    expect(model.nodes.dipPackage).toBeDefined();
    expect(model.nodes.leadPins).toBeDefined();

    // Update with animation time step
    model.update({ gateVoltageV: 10, clockFrequencyMhz: 5.0 }, 0.5);
    expect(model.nodes.group.children.length).toBeGreaterThan(4);

    model.dispose();
  });
});
