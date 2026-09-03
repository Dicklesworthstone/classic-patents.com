import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stepColtRevolver } from "@/physics/catalogKernels";
import { buildColtRevolverModel, updateColtRevolverKinematics } from "./coltRevolverModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US X9430 Colt Paterson Revolver visual & physics boundary", () => {
  test("uses pure procedural WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "ColtRevolver3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "coltRevolverModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildColtRevolverModel");
    expect(modelSource).toContain("updateColtRevolverKinematics");
    expect(modelSource).toContain("dispose");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "ColtRevolver3D.tsx"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
    }
  });

  test("limits control-deck animation to the properties that actually change", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "ColtRevolver3D.tsx"),
      "utf8",
    );

    expect(threeSource).not.toContain("transition-all");
    expect(threeSource).toContain("transition-colors");
    expect(threeSource).toContain("transition-[background-color,transform]");
    expect(threeSource).toContain("transition-[background-color,color,border-color,transform]");
  });

  test("exposes all 6 authentic camera presets and 8 historical patent callouts", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "ColtRevolver3D.tsx"),
      "utf8",
    );

    for (const preset of ["iso", "cylinder", "lockwork", "sightline", "loading_lever", "top"]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("1. Octagonal Rifled Barrel (.36 Caliber)");
    expect(threeSource).toContain("2. 5-Chamber Roll-Engraved Cylinder");
    expect(threeSource).toContain("3. Single-Action Spur Hammer");
    expect(threeSource).toContain("4. Paterson Folding Trigger");
    expect(threeSource).toContain("5. Black Walnut Plowhandle Grip");
    expect(threeSource).toContain("6. Creeping Loading Lever & Rammer");
    expect(threeSource).toContain("7. Transverse Takedown Wedge");
    expect(threeSource).toContain("8. Recoil Shield & Capping Channel");
  });

  test("keeps the complete Paterson profile in a portrait overview without remounting on pins", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "ColtRevolver3D.tsx"),
      "utf8",
    );

    expect(threeSource).toContain("function cameraPresetForViewport");
    expect(threeSource).toContain('cameraPresetForViewport("iso", window.innerWidth)');
    expect(threeSource).toContain("mobileDistanceMultiplier = 1.9");
    expect(threeSource).toContain("showCalloutPins,");
    expect(threeSource).toContain("pinGroup.visible = p.showCalloutPins");
    expect(threeSource).not.toContain("}, [showCalloutPins, live]);");
  });

  test("computes solid mechanics hoop stress and ballistics in reproducible SI units", () => {
    const fullCock = stepColtRevolver({ chamberPressureMpa: 85, cockingAngleDeg: 45 });
    expect(fullCock.isLocked).toBe(true);
    expect(fullCock.indexAngleDeg).toBe(72);
    expect(fullCock.schematicBoltRetractY).toBe(0);
    expect(fullCock.hoopStressMpa).toBe(100.7);
    expect(fullCock.muzzleVelocityMps).toBe(304);
    expect(fullCock.muzzleEnergyJoules).toBe(240);
    expect(fullCock.powderGrains).toBe(45);
    expect(fullCock.recoilKick).toBeCloseTo(0.05 + (304 / 400) * 0.1, 3);
    expect(fullCock.recoilKickX).toBeCloseTo(fullCock.recoilKick * 0.8, 3);

    const halfCock = stepColtRevolver({ chamberPressureMpa: 85, cockingAngleDeg: 22.5 });
    expect(halfCock.isLocked).toBe(false);
    expect(halfCock.indexAngleDeg).toBe(36);
    expect(halfCock.schematicBoltRetractY).toBe(8);

    const hammerDown = stepColtRevolver({ chamberPressureMpa: 85, cockingAngleDeg: 0 });
    expect(hammerDown.isLocked).toBe(false);
    expect(hammerDown.indexAngleDeg).toBe(0);
  });

  test("builds and articulates procedural 5-chamber cylinder, folding trigger, and lockwork cutaway correctly", () => {
    const model = buildColtRevolverModel();

    expect(model.group.children.length).toBeGreaterThan(3);
    expect(model.cylinderGroup).toBeDefined();
    expect(model.hammerGroup).toBeDefined();
    expect(model.triggerGroup).toBeDefined();
    expect(model.loadingLeverGroup).toBeDefined();
    expect(model.rammerPlunger).toBeDefined();

    updateColtRevolverKinematics(model, 45, 1, 50, true, true);
    expect(model.hammerGroup.rotation.z).toBeCloseTo(-(45 * Math.PI) / 180, 2);
    expect(model.blastMesh.visible).toBe(true);
    expect(model.lockworkCutawayGroup.visible).toBe(true);

    model.dispose();
  });
});
