import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { buildPeltonWheelModel, updatePeltonWheelKinematics } from "./peltonWheelModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 233,692 Lester Pelton source-bounded visual", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(join(VISUALS_DIRECTORY, "three", "PeltonWheel3D.tsx"), "utf8");
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "peltonWheelModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildPeltonWheelModel");
    expect(modelSource).toContain("updatePeltonWheelKinematics");
    expect(modelSource).toContain("sourceArrangementGroup");
    expect(modelSource).toContain("representative source bucket");
    expect(modelSource).not.toContain("fluidFrames");
    expect(modelSource).not.toContain("sampleFluidAt");
    expect(modelSource).not.toContain("headMeters");
    expect(modelSource).not.toContain("runnerRpm");
    expect(modelSource).not.toContain("stepPeltonWheel({})");
    expect(threeSource).toContain("params.sourceFlowVisible ?? 1");
    expect(threeSource).toContain('updateParam("sourceFlowVisible"');
    expect(threeSource).toContain("params.claim1Active ?? 1");
    expect(threeSource).toContain("model.runnerGroup.visible = p.claim1Active");
    expect(threeSource).not.toContain("setClaimStates");
    expect(threeSource).not.toContain("setShowJet");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(join(VISUALS_DIRECTORY, "three", "PeltonWheel3D.tsx"), "utf8");
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "peltonWheelModel.ts"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
      expect(modelSource).not.toContain(forbidden);
    }
  });

  test("exposes authentic camera presets and UI overlay for impulse turbine observation", () => {
    const threeSource = readFileSync(join(VISUALS_DIRECTORY, "three", "PeltonWheel3D.tsx"), "utf8");

    for (const preset of ["iso", "split_bucket", "nozzle", "runner_wheel", "discharge", "top"]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("Pelton Water Wheel 3D");
    expect(threeSource).toContain("controls.setView");
    expect(threeSource).not.toContain("cameraRef");
  });

  test("does not invent operating values absent from the three-sheet grant", () => {
    const source = readFileSync(join(VISUALS_DIRECTORY, "three", "peltonWheelModel.ts"), "utf8");
    expect(source).not.toContain("165°");
    expect(source).not.toContain("needle spear");
    expect(source).not.toContain("pressure gauge");
    expect(source).not.toContain("bucketCount = 18");
    expect(source).not.toContain("casingGroup");
    expect(source).not.toContain("tailrace");
  });

  test("supports the posed runner and nozzle while keeping the support outside claimed topology", () => {
    const model = buildPeltonWheelModel();

    expect(model.rootGroup.children.length).toBeGreaterThan(3);
    expect(model.runnerGroup).toBeDefined();
    expect(model.sourceArrangementGroup).toBeDefined();
    expect(model.displaySupportGroup.parent).toBe(model.rootGroup);
    expect(model.displaySupportGroup.name).toBe("NeutralDisplaySupportNotClaimedApparatus");
    expect(
      model.displaySupportGroup.getObjectsByProperty("name", "DisplayShaftCradle"),
    ).toHaveLength(2);
    expect(model.materials.bronzeBucket).toBeDefined();
    expect(model.materials.waterJet).toBeDefined();

    updatePeltonWheelKinematics(model, true);
    expect(model.jetPoints.visible).toBe(true);
    expect(model.sprayPoints.visible).toBe(true);

    updatePeltonWheelKinematics(model, true, false);
    expect(model.jetPoints.visible).toBe(true);
    expect(model.sprayPoints.visible).toBe(false);

    model.dispose();
  });
});
