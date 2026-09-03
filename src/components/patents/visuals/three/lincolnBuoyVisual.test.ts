import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stepLincolnBuoy } from "@/physics/catalogKernels";
import { lincolnBuoyViewForViewport } from "./LincolnBuoy3D";
import { buildLincolnBuoyModel, updateLincolnBuoyKinematics } from "./lincolnBuoyModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 6,469 Abraham Lincoln Buoying Vessels Over Shoals visual & hydrostatics boundary", () => {
  test("frames the complete hull and seven-unit smokestack envelope", () => {
    const desktop = lincolnBuoyViewForViewport("iso", 1200);
    const phone = lincolnBuoyViewForViewport("iso", 320);
    const distance = (camera: typeof desktop) =>
      Math.hypot(
        camera.pos[0] - camera.target[0],
        camera.pos[1] - camera.target[1],
        camera.pos[2] - camera.target[2],
      );

    expect(desktop.target).toEqual([0, 2.2, 0]);
    expect(distance(phone) / distance(desktop)).toBeCloseTo(1.2, 8);
  });

  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(join(VISUALS_DIRECTORY, "three", "LincolnBuoy3D.tsx"), "utf8");
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "lincolnBuoyModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildLincolnBuoyModel");
    expect(modelSource).toContain("updateLincolnBuoyKinematics");
    expect(modelSource).toContain("paddleDisplayOmegaRadPerS");
    expect(modelSource).not.toContain("-= 0.02");
    expect(modelSource).not.toContain("stepLincolnBuoy({})");
    expect(threeSource).toContain("p.weightTons");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(join(VISUALS_DIRECTORY, "three", "LincolnBuoy3D.tsx"), "utf8");
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "lincolnBuoyModel.ts"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
      expect(modelSource).not.toContain(forbidden);
    }
  });

  test("exposes authentic camera presets and UI overlay for steamboat buoyancy observation", () => {
    const threeSource = readFileSync(join(VISUALS_DIRECTORY, "three", "LincolnBuoy3D.tsx"), "utf8");

    for (const preset of ["iso", "bellows_chambers", "pilothouse", "paddlewheel", "keel", "top"]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("isCutaway");
    expect(threeSource).toContain("Abraham Lincoln (US 6,469)");
    expect(threeSource).toContain("controls.setView");
    expect(threeSource).not.toContain("cameraRef");
  });

  test("computes genuine hydrostatic buoyancy displacement, hull draft, and shoal clearance in SI units", () => {
    const result = stepLincolnBuoy({ inflationPct: 80, weightTons: 380, shoalDepth: 3.5 });
    expect(result.liftTons).toBeGreaterThan(20);
    expect(result.hullDraftFt).toBeLessThan(result.baseDraftFt);
    expect(result.liftKn).toBeGreaterThan(300);
    expect(result.paddleDisplayOmegaRadPerS).toBeCloseTo(1.2, 5);
    expect(result.bellowsFlarePx).toBeCloseTo(32, 2);
    expect(result.bellowsMidPx).toBeCloseTo(28, 2);
    expect(result.bellowsDropPx).toBeCloseTo(36, 2);
    expect(result.sandbarShoulderY).toBeCloseTo(186, 1);
    expect(result.hullStudioY).toBeLessThan(150);
  });

  test("builds and articulates procedural steamboat hull, expandable air bellows, and sandbar shelf correctly", () => {
    const model = buildLincolnBuoyModel();

    expect(model.rootGroup.children.length).toBeGreaterThan(2);
    expect(model.boatGroup).toBeDefined();
    expect(model.portBellows).toBeDefined();
    expect(model.stbdBellows).toBeDefined();
    expect(model.paddlewheelGroup).toBeDefined();
    expect(model.waterMesh).toBeDefined();
    expect(model.sandbarMesh).toBeDefined();
    expect(model.materials.bellowsRubber).toBeDefined();
    expect(model.materials.hullWood).toBeDefined();

    updateLincolnBuoyKinematics(model, 1 / 60, 85, 3.5, 5.2, 4.1, 1.2, true);
    expect(model.materials.hullWood.opacity).toBe(0.35);
    expect(model.portBellowsBody.scale.y).toBeGreaterThan(1.0);

    model.dispose();
  });

  test("derives all printed claims dynamically from edition without duplicate strings", () => {
    const { lincolnBuoyPatent } = require("@/data/patents/lincoln-buoy");
    const { lincolnBuoyArchivalEdition } = require("@/data/editions/lincolnBuoyEdition");
    expect(lincolnBuoyPatent.claims.length).toBe(1);
    const editionClaims = lincolnBuoyArchivalEdition.blocks.filter((b: any) => b.kind === "claim");
    expect(editionClaims.length).toBe(1);

    const editionBlock = editionClaims[0];
    expect(editionBlock).toBeDefined();
    const expectedText = editionBlock.inlines.map((inl: any) => inl.text).join("");
    expect(lincolnBuoyPatent.claims[0].originalText).toBe(expectedText);
  });

  test("provides valid provenance classifications for all Lincoln buoy controls and metrics", () => {
    const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
    const entry = PATENT_PHYSICS_REGISTRY["us-6469-lincoln-buoy"];
    expect(entry).toBeDefined();
    for (const ctrl of entry.controls) {
      expect(ctrl.provenance).toBeDefined();
    }
    const metrics = entry.computeMetrics({ inflationPct: 80, weightTons: 380, shoalDepth: 3.5 });
    for (const m of metrics) {
      expect(m.provenance).toBeDefined();
    }
  });

  test("registers explicit energy channel omission reason", () => {
    const {
      energyChannelsFor,
      ENERGY_CHANNEL_OMISSION_REASONS,
    } = require("@/physics/energyChannels");
    expect(ENERGY_CHANNEL_OMISSION_REASONS["us-6469-lincoln-buoy"]).toBeDefined();
    expect(energyChannelsFor("us-6469-lincoln-buoy", {})).toEqual([]);
  });
});
