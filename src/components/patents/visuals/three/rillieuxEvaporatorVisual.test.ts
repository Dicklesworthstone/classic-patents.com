import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stepRillieuxEvaporator } from "@/physics/rillieuxEvaporatorKernel";
import { createRillieuxEvaporatorModel } from "./rillieuxEvaporatorModel";

describe("Norbert Rillieux Multiple-Effect Evaporator 3D Visual & Thermodynamics Test Suite", () => {
  test("2D and 3D share the catalog physics bus for US 3,237", () => {
    const threeSource = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/three/RillieuxEvaporator3D.tsx"),
      "utf8",
    );
    const simSource = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/RillieuxEvaporatorSim.tsx"),
      "utf8",
    );
    expect(threeSource).toContain('usePatentPhysics("us-3237-rillieux-evaporator")');
    expect(simSource).toContain('usePatentPhysics("us-3237-rillieux-evaporator")');
    expect(threeSource).not.toContain("us-4879-rillieux-evaporator");
    expect(threeSource).not.toContain("US 4,879");
    expect(threeSource).toContain("juiceFeedRateKgPerH: p.juiceFeedRateKgPerH");
    expect(simSource).not.toContain("setJuiceFeedRateKgPerH");
    expect(threeSource).toContain("Modern SI teaching controls");
    expect(simSource).toContain("Modern SI teaching controls");
    const modelSource = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/three/rillieuxEvaporatorModel.ts"),
      "utf8",
    );
    expect(modelSource).not.toContain("const boilSpeed = 8.0");
    expect(modelSource).toContain("boilDisplayOmegaRadPerS");
  });

  test("keeps the studio animation loop alive after a visible frame", () => {
    const source = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/three/RillieuxEvaporator3D.tsx"),
      "utf8",
    );
    const loopStart = source.indexOf("const animate =");
    const loopEnd = source.indexOf("return () =>", loopStart);
    const loop = source.slice(loopStart, loopEnd);

    expect(loop).toMatch(
      /animFrameRef\.current = requestAnimationFrame\(animate\);\s*if \(!studio\.isVisible\(\)\) \{/,
    );
  });

  test("creates valid Three.js model hierarchy with 3 vessels, tube bundles, and condenser", () => {
    const model = createRillieuxEvaporatorModel();
    expect(model.group).toBeDefined();
    expect(model.vessels.length).toBe(3);
    expect(model.tubeBundles.length).toBe(3);
    expect(model.vaporTrunks.length).toBe(2);
    expect(model.condenserGroup).toBeDefined();
    expect(model.materials.length).toBeGreaterThan(5);
    expect(model.geometries.length).toBeGreaterThan(10);

    model.dispose();
  });

  test("physics step updates model without throwing across double, triple, and quadruple effects", () => {
    const model = createRillieuxEvaporatorModel();

    for (const n of [2, 3, 4]) {
      const state = stepRillieuxEvaporator({
        juiceFeedRateKgPerH: 12000,
        initialBrixDeg: 14,
        targetBrixDeg: 65,
        numberOfEffects: n,
      });
      expect(state.steamEconomyRatio).toBeGreaterThan(1.5);
      expect(state.fuelSavingsPct).toBeGreaterThan(50);
      expect(state.effects.length).toBe(n);
      expect(() => model.update(state, 0.5)).not.toThrow();
    }

    model.dispose();
  });

  test("calculates authentic chemical mass balance and cascading steam economy", () => {
    const state = stepRillieuxEvaporator({
      juiceFeedRateKgPerH: 10000,
      initialBrixDeg: 14,
      targetBrixDeg: 65,
      numberOfEffects: 3,
    });

    // Mass balance: Feed = Syrup + Evap
    expect(state.syrupOutputRateKgPerH + state.totalEvaporationKgPerH).toBeCloseTo(10000, 1);
    // Solute conservation: 10000 * 0.14 = Syrup * 0.65
    const solidsIn = 10000 * 0.14;
    const solidsOut = state.syrupOutputRateKgPerH * 0.65;
    expect(solidsOut).toBeCloseTo(solidsIn, 1);

    // Steam economy must exceed 2.5 in a triple effect
    expect(state.steamEconomyRatio).toBeGreaterThan(2.5);
    // Primary steam consumption must be less than half of total water evaporated
    expect(state.primarySteamConsumptionKgPerH).toBeLessThan(state.totalEvaporationKgPerH * 0.5);
    expect(state.boilDisplayOmegaRadPerS).toBeCloseTo(state.totalEvaporationKgPerH / 1000, 3);
    const halfFeed = stepRillieuxEvaporator({
      juiceFeedRateKgPerH: 5000,
      initialBrixDeg: 14,
      targetBrixDeg: 65,
      numberOfEffects: 3,
    });
    expect(halfFeed.boilDisplayOmegaRadPerS).toBeLessThan(state.boilDisplayOmegaRadPerS);
  });
});
