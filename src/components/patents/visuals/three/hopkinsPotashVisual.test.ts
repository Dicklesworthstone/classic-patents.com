import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { HOPKINS_DEFAULT_CONTROLS, stepHopkinsPotash } from "@/physics/hopkinsPotashKernel";
import { animateHopkinsPotashModel, buildHopkinsPotashModel } from "./hopkinsPotashModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src", "components", "patents", "visuals");

describe("US X1 Samuel Hopkins Potash 3D Visual & Shared Physics Contract", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "hopkinsPotashModel.ts"),
      "utf8",
    );
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "HopkinsPotash3D.tsx"),
      "utf8",
    );

    expect(modelSource).not.toContain("useGLTF");
    expect(modelSource).not.toContain(".gltf");
    expect(modelSource).not.toContain(".glb");
    expect(modelSource).toContain("buildHopkinsPotashModel");
    expect(modelSource).toContain("animateHopkinsPotashModel");
    expect(threeSource).not.toContain("useGLTF");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "hopkinsPotashModel.ts"),
      "utf8",
    );
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "HopkinsPotash3D.tsx"),
      "utf8",
    );

    expect(modelSource).not.toContain("Math.random");
    expect(threeSource).not.toContain("Math.random");
    expect(threeSource).not.toContain("performance.now()");
  });

  test("uses the exact catalogue id us-x1-hopkins-potash on all 3D surfaces and energy strip", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "HopkinsPotash3D.tsx"),
      "utf8",
    );

    expect(threeSource).toContain('usePatentPhysics("us-x1-hopkins-potash")');
    expect(threeSource).toContain('useFrankenSimPhysics("us-x1-hopkins-potash"');
    expect(threeSource).toContain('patentId="us-x1-hopkins-potash"');
    expect(threeSource).not.toContain('patentId="us-1-hopkins-potash"');
  });

  test("builds and articulates procedural reverberatory kiln, leaching tub, and boiling pot", () => {
    const model = buildHopkinsPotashModel();
    expect(model.rootGroup).toBeDefined();
    expect(model.nodes.furnaceBody).toBeDefined();
    expect(model.nodes.leachTub).toBeDefined();
    expect(model.nodes.evapPot).toBeDefined();
    expect(model.nodes.ashBed).toBeDefined();

    expect(() =>
      animateHopkinsPotashModel(model, { roastTempC: 750, ashBatchKg: 80 }, 1.0),
    ).not.toThrow();

    model.materials.brickMasonry.dispose();
    model.materials.oakWood.dispose();
    model.materials.castIron.dispose();
  });

  test("computes genuine Arrhenius calcination and leaching kinetics in SI units", () => {
    const cold = stepHopkinsPotash({ roastTempC: 500, roastTimeHours: 1 });
    const hot = stepHopkinsPotash({ roastTempC: 850, roastTimeHours: 3 });

    expect(hot.decarbonizationPct).toBeGreaterThan(cold.decarbonizationPct);
    expect(hot.pearlAshYieldKg).toBeGreaterThan(cold.pearlAshYieldKg);
    expect(hot.pearlAshPurityPct).toBeGreaterThan(cold.pearlAshPurityPct);
    expect(hot.thermalEnergyJoules).toBeGreaterThan(0);
  });

  test("connects roastTempC control directly to the pearl-ash spec clause", () => {
    const { specClausesFor } = require("@/physics/specClauses");
    const activeClauses = specClausesFor("us-x1-hopkins-potash", { roastTempC: 750 });
    const pearlAshClause = activeClauses.find((c: any) => c.id === "pearl-ash");
    expect(pearlAshClause).toBeDefined();
    expect(pearlAshClause?.active).toBe(true);

    const coldClauses = specClausesFor("us-x1-hopkins-potash", { roastTempC: 500 });
    const coldPearlAsh = coldClauses.find((c: any) => c.id === "pearl-ash");
    expect(coldPearlAsh?.active).toBe(false);
  });

  test("provides valid provenance classifications for all Hopkins controls and metrics", () => {
    const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
    const entry = PATENT_PHYSICS_REGISTRY["us-x1-hopkins-potash"];
    expect(entry).toBeDefined();
    for (const ctrl of entry.controls) {
      expect(ctrl.provenance).toBeDefined();
    }
    const metrics = entry.computeMetrics(HOPKINS_DEFAULT_CONTROLS);
    for (const m of metrics) {
      expect(m.provenance).toBeDefined();
    }
  });

  test("derives energy channels from live stepHopkinsPotash output", () => {
    const { energyChannelsFor } = require("@/physics/energyChannels");
    const channels = energyChannelsFor("us-x1-hopkins-potash", HOPKINS_DEFAULT_CONTROLS);
    expect(channels.length).toBe(3);
    const hopkins = stepHopkinsPotash(HOPKINS_DEFAULT_CONTROLS);
    const expectedWatts = Math.max(100, Math.round(hopkins.thermalEnergyJoules / (2.5 * 3600)));
    expect(channels[0]?.watts).toBe(expectedWatts);
  });

  test("produces distinct telemetry envelopes when furnace temperature changes", () => {
    const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
    const entry = PATENT_PHYSICS_REGISTRY["us-x1-hopkins-potash"];
    const m750 = entry.computeMetrics({ ...HOPKINS_DEFAULT_CONTROLS, roastTempC: 750 });
    const m775 = entry.computeMetrics({ ...HOPKINS_DEFAULT_CONTROLS, roastTempC: 775 });
    const m500 = entry.computeMetrics({ ...HOPKINS_DEFAULT_CONTROLS, roastTempC: 500 });

    const env750 = m750.map((m: any) => `${m.label} ${m.value}`).join("; ");
    const env775 = m775.map((m: any) => `${m.label} ${m.value}`).join("; ");
    const env500 = m500.map((m: any) => `${m.label} ${m.value}`).join("; ");

    expect(env750).not.toBe(env775);
    expect(env750).not.toBe(env500);
    expect(env775).not.toBe(env500);
  });
});
