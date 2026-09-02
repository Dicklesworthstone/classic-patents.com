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
});
