import { describe, expect, test } from "bun:test";
import { MESTRAL_VELCRO_DEFAULTS, stepMestralVelcroSi } from "@/physics/mestralVelcroKernel";
import { createMestralVelcroModel } from "./mestralVelcroModel";

describe("Mestral Velcro 3D Procedural Model", () => {
  test("instantiates procedural hook and loop arrays with valid Three.js hierarchy", () => {
    const model = createMestralVelcroModel();
    expect(model.rootGroup).toBeDefined();
    expect(model.rootGroup.name).toBe("mestral-velcro-root");
    expect(model.lowerTapeGroup.children.length).toBeGreaterThan(10);
    expect(model.upperTapeGroup.children.length).toBeGreaterThan(10);
    expect(model.hookMeshes.length).toBe(80);
    expect(model.loopMeshes.length).toBe(80);

    // Update model with default SI physics telemetry
    const tel = stepMestralVelcroSi(MESTRAL_VELCRO_DEFAULTS);
    expect(() => model.update(MESTRAL_VELCRO_DEFAULTS, tel, 0.45)).not.toThrow();

    // Verify upper tape position and loop positions
    expect(model.upperTapeGroup.position.y).toBeCloseTo(1.1, 1);
    for (const mesh of model.hookMeshes) {
      expect(Number.isFinite(mesh.position.x)).toBe(true);
      expect(Number.isFinite(mesh.position.y)).toBe(true);
      expect(Number.isFinite(mesh.position.z)).toBe(true);
    }

    // Clean disposal
    expect(() => model.dispose()).not.toThrow();
  });

  test("computes continuous deformation across peeling angle sweep", () => {
    const model = createMestralVelcroModel();
    const angles = [30, 60, 90, 120, 150];

    for (const angle of angles) {
      const controls = { ...MESTRAL_VELCRO_DEFAULTS, peelAngleDeg: angle };
      const tel = stepMestralVelcroSi(controls);
      expect(() => model.update(controls, tel, 0.5)).not.toThrow();
      expect(tel.totalPeelForceN).toBeGreaterThan(0);
      expect(tel.forceAnisotropyRatio).toBeGreaterThan(5);
    }

    model.dispose();
  });

  test("derives all printed claims dynamically from edition without duplicate strings", () => {
    const { mestralVelcroPatent } = require("@/data/patents/mestral-velcro");
    const { mestralVelcroArchivalEdition } = require("@/data/editions/mestralVelcroEdition");
    expect(mestralVelcroPatent.claims.length).toBeGreaterThan(0);
    const editionClaims = mestralVelcroArchivalEdition.blocks.filter(
      (b: any) => b.kind === "claim",
    );
    expect(editionClaims.length).toBe(mestralVelcroPatent.claims.length);

    for (const claim of mestralVelcroPatent.claims) {
      const editionBlock = editionClaims.find((c: any) => c.number === claim.number);
      expect(editionBlock).toBeDefined();
      const expectedText = editionBlock.inlines.map((inl: any) => inl.text).join("");
      expect(claim.originalText).toBe(expectedText);
    }
  });

  test("provides valid provenance classifications for all Mestral controls and metrics", () => {
    const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
    const entry = PATENT_PHYSICS_REGISTRY["us-2717437-mestral-velcro"];
    expect(entry).toBeDefined();
    for (const ctrl of entry.controls) {
      expect(ctrl.provenance).toBeDefined();
    }
    const metrics = entry.computeMetrics(MESTRAL_VELCRO_DEFAULTS);
    for (const m of metrics) {
      expect(m.provenance).toBeDefined();
    }
  });

  test("connects energy channels directly to live telemetry calculation", () => {
    const { energyChannelsFor } = require("@/physics/energyChannels");
    const channels = energyChannelsFor("us-2717437-mestral-velcro", MESTRAL_VELCRO_DEFAULTS);
    expect(channels.length).toBe(3);
    const tel = stepMestralVelcroSi(MESTRAL_VELCRO_DEFAULTS);
    expect(channels[0]?.watts).toBeCloseTo(tel.peelDisengagementPowerWatts, 4);
  });

  test("wires claim 1 and claim 3 inversion probes through hook/loop engagement", () => {
    const { applyClaimConstraintModifications } = require("@/physics/claimConstraints");
    const { readMestralVelcroControls } = require("@/physics/mestralVelcroKernel");

    const res1 = applyClaimConstraintModifications(
      "us-2717437-mestral-velcro",
      {},
      { 1: false, 3: true },
    );
    expect(res1.modifiedParams.heatSettingTempC).toBe(25);
    expect(res1.refusalWarning).toContain("THERMAL SETTING LOSS");

    const tel1 = stepMestralVelcroSi(readMestralVelcroControls(res1.modifiedParams));
    expect(tel1.thermalRetentionFraction).toBeLessThan(0.01);
    expect(tel1.singleHookReleaseForceN).toBeLessThan(0.001);

    const res3 = applyClaimConstraintModifications(
      "us-2717437-mestral-velcro",
      {},
      { 1: true, 3: false },
    );
    expect(res3.modifiedParams.engagementRatio).toBe(0.05);
    expect(res3.refusalWarning).toContain("HOOK GEOMETRY LOSS");
  });
});
