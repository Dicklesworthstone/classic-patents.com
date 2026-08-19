import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stepEricssonPropeller } from "@/physics/catalogKernels";
import {
  buildEricssonPropellerModel,
  updateEricssonPropellerKinematics,
} from "./ericssonPropellerModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 588 John Ericsson Screw Propeller visual & hydrodynamics boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "EricssonPropeller3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "ericssonPropellerModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildEricssonPropellerModel");
    expect(modelSource).toContain("updateEricssonPropellerKinematics");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "EricssonPropeller3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "ericssonPropellerModel.ts"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
      expect(modelSource).not.toContain(forbidden);
    }
  });

  test("exposes camera presets and a source-bounded UI overlay for screw propeller observation", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "EricssonPropeller3D.tsx"),
      "utf8",
    );

    for (const preset of [
      "iso",
      "propeller_drum",
      "helical_blades",
      "sternpost",
      "rudder",
      "top",
    ]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("isCutaway");
    expect(threeSource).toContain("Ericsson Spiral-Plate Reader Aid 3D");
    expect(threeSource).toContain("Source-bounded reader aid");
    expect(threeSource).toContain("Source spiral");
  });

  test("marks hydrodynamic output as illustrative while preserving the printed geometry", () => {
    const result = stepEricssonPropeller({ shaftRpm: 120, bladePitchAngleDeg: 35 });
    expect(result.isIllustrativeDisplayModel).toBe(true);
    expect(result.sourceSpiralAdvanceDiameters).toBe(3);
    expect(result.sourceCasingClearanceInches).toBe(0.125);
    expect(result.bladeSvgRx).toBe(10);
    expect(result.forwardBladeSvgRy).toBe(50);
    expect(result.aftBladeSvgRy).toBe(45);
    expect(result.wakeFlowSpeed).toBeCloseTo(6.5, 5);
    expect(result.wakeSwirlCoeff).toBeCloseTo(0.08, 5);
    expect(result.wakeOpacity).toBeGreaterThan(0);
  });

  test("builds and articulates procedural tandem drums, concentric shafts, and wake particles correctly", () => {
    const model = buildEricssonPropellerModel();

    expect(model.rootGroup.children.length).toBeGreaterThan(3);
    expect(model.hullGroup).toBeDefined();
    expect(model.forwardDrumGroup).toBeDefined();
    expect(model.aftDrumGroup).toBeDefined();
    expect(model.innerShaftMesh).toBeDefined();
    expect(model.outerShaftMesh).toBeDefined();
    expect(model.materials.bronzeGunmetal).toBeDefined();
    expect(model.materials.copperSheathing).toBeDefined();

    const screw = stepEricssonPropeller({ shaftRpm: 120, bladePitchAngleDeg: 35 });
    updateEricssonPropellerKinematics(
      model,
      0.016,
      screw.shaftOmegaRadPerS,
      screw.wakeSwirlScale,
      screw.wakeFlowSpeed,
      screw.wakeSwirlCoeff,
      true,
      true,
    );
    expect(model.materials.bronzeGunmetal.opacity).toBe(0.45);
    expect(model.wakePoints.visible).toBe(true);

    model.dispose();
  });
});
