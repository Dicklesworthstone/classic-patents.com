import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { gatlingGunArchivalEdition } from "@/data/editions/gatlingGunEdition";
import { gatlingGunPatent } from "@/data/patents/gatling-gun";
import { stepGatlingGun } from "@/physics/catalogKernels";
import { CATALOG_CLAIM_CONSTRAINTS } from "@/physics/claimConstraints";
import { ENERGY_CHANNEL_OMISSION_REASONS, energyChannelsFor } from "@/physics/energyChannels";
import { PATENT_PHYSICS_REGISTRY } from "@/physics/telemetryData";
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
    expect(threeSource).toContain("controls.setView");
    expect(threeSource).not.toContain("cameraRef");
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

  test("derives all 5 printed claims dynamically from edition without duplicate strings", () => {
    expect(gatlingGunPatent.claims).toHaveLength(5);
    const editionClaims = gatlingGunArchivalEdition.blocks.filter((b) => b.kind === "claim");
    expect(editionClaims).toHaveLength(5);

    for (let i = 1; i <= 5; i++) {
      const claim = gatlingGunPatent.claims.find((c) => c.number === i);
      const editionBlock = editionClaims.find((c) => c.number === i);
      expect(claim).toBeDefined();
      expect(editionBlock).toBeDefined();
      const expectedText = editionBlock?.inlines.map((inl) => inl.text).join("");
      expect(claim?.originalText).toBe(expectedText);
    }
  });

  test("aligns claim constraints with authentic US 36,836 claims 1 through 5", () => {
    const constraints = CATALOG_CLAIM_CONSTRAINTS["us-36836-gatling-gun"];
    expect(constraints).toBeDefined();
    expect(constraints.length).toBe(5);
    expect(constraints.map((c) => c.claimNumber)).toEqual([1, 2, 3, 4, 5]);
    expect(constraints[0].claimTitle).toContain("Co-Revolving Lock-Cylinder");
    expect(constraints[1].claimTitle).toContain("One Simultaneous Lock Per Barrel");
    expect(constraints[2].claimTitle).toContain("Stationary Cocking Ring");
  });

  test("binds energy output to honest omission reason without synthetic wattage", () => {
    expect(energyChannelsFor("us-36836-gatling-gun", {})).toEqual([]);
    expect(ENERGY_CHANNEL_OMISSION_REASONS["us-36836-gatling-gun"]).toContain(
      "no measured operator torque",
    );
  });

  test("provides valid provenance classifications for all Gatling metrics and controls", () => {
    const entry = PATENT_PHYSICS_REGISTRY["us-36836-gatling-gun"];
    expect(entry).toBeDefined();
    for (const ctrl of entry.controls) {
      expect(ctrl.provenance).toBeDefined();
    }
    const metrics = entry.computeMetrics({ crankRpm: 60, barrelCount: 6 });
    for (const m of metrics) {
      expect(m.provenance).toBeDefined();
    }
  });
});
