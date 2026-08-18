import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stepColtRevolver } from "@/physics/catalogKernels";

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

  test("exposes all 5 authentic camera presets and 8 historical patent callouts", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "ColtRevolver3D.tsx"),
      "utf8",
    );

    for (const preset of ["iso", "cylinder", "lockwork", "sightline", "top"]) {
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

  test("computes solid mechanics hoop stress and ballistics in reproducible SI units", () => {
    const fullCock = stepColtRevolver({ chamberPressureMpa: 85, cockingAngleDeg: 45 });
    expect(fullCock.isLocked).toBe(true);
    expect(fullCock.indexAngleDeg).toBe(72);
    expect(fullCock.hoopStressMpa).toBe(100.7);
    expect(fullCock.muzzleVelocityMps).toBe(304);
    expect(fullCock.muzzleEnergyJoules).toBe(240);
    expect(fullCock.powderGrains).toBe(45);

    const halfCock = stepColtRevolver({ chamberPressureMpa: 85, cockingAngleDeg: 22.5 });
    expect(halfCock.isLocked).toBe(false);
    expect(halfCock.indexAngleDeg).toBe(36);

    const hammerDown = stepColtRevolver({ chamberPressureMpa: 85, cockingAngleDeg: 0 });
    expect(hammerDown.isLocked).toBe(false);
    expect(hammerDown.indexAngleDeg).toBe(0);
  });
});
