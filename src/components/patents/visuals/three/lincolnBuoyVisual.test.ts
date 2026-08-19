import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stepLincolnBuoy } from "@/physics/catalogKernels";
import { buildLincolnBuoyModel, updateLincolnBuoyKinematics } from "./lincolnBuoyModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 6,469 Abraham Lincoln Buoying Vessels Over Shoals visual & hydrostatics boundary", () => {
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
});
