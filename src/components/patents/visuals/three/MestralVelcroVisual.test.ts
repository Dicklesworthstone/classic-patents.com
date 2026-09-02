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
});
