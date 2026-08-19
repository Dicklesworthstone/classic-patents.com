import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stepGatlingGun } from "@/physics/catalogKernels";
import { buildGatlingGunModel } from "./gatlingGunModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 36,836 Richard Gatling Revolving Battery Gun visual & ballistics boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(join(VISUALS_DIRECTORY, "three", "GatlingGun3D.tsx"), "utf8");
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "gatlingGunModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildGatlingGunModel");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(join(VISUALS_DIRECTORY, "three", "GatlingGun3D.tsx"), "utf8");
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "gatlingGunModel.ts"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
      expect(modelSource).not.toContain(forbidden);
    }
  });

  test("exposes authentic camera presets and cutaway mode for breech inspection", () => {
    const threeSource = readFileSync(join(VISUALS_DIRECTORY, "three", "GatlingGun3D.tsx"), "utf8");

    for (const preset of ["iso", "barrels", "breech_cam", "hopper", "crank", "top"]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("isCutaway");
    expect(threeSource).toContain("Gatling Gun 3D");
  });

  test("computes genuine Gatling rotary rate of fire and cooling intervals in SI units", () => {
    const result = stepGatlingGun({ crankRpm: 60, barrelCount: 6 });
    expect(result.roundsPerMin).toBe(360);
    expect(result.barrelCoolingIntervalS).toBeGreaterThan(0.8);
    expect(result.muzzleEnergyJoules).toBeGreaterThan(1500);
    expect(result.crankOmegaRadPerS).toBeCloseTo(2 * Math.PI, 2);
    expect(result.barrelSpacingRad).toBeCloseTo(Math.PI / 3, 4);
    expect(result.camStrokeStudio).toBeCloseTo(0.38, 3);
    expect(result.fireIntervalS).toBeCloseTo(result.cycleTimeMs / 1000, 4);
    expect(result.clusterRadiusPx).toBe(32);
  });

  test("builds and articulates procedural 6-barrel cluster and lock bolts correctly", () => {
    const { rootGroup, nodes, materials, dispose } = buildGatlingGunModel();
    expect(rootGroup.children.length).toBeGreaterThan(3);
    expect(nodes.barrels.length).toBe(6);
    expect(nodes.bolts.length).toBe(6);
    expect(nodes.breechCover).toBeDefined();

    // Verify material properties
    expect(materials.bluedSteel.metalness).toBeGreaterThan(0.8);
    expect(materials.bronzeReceiver.roughness).toBeLessThan(0.4);

    dispose();
  });
});
