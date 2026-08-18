import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stepEricssonPropeller } from "@/physics/catalogKernels";
import { buildEricssonPropellerModel } from "./ericssonPropellerModel";

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

  test("exposes authentic camera presets and UI overlay for screw propeller observation", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "EricssonPropeller3D.tsx"),
      "utf8",
    );

    for (const preset of ["iso", "propeller_drum", "helical_blades", "sternpost", "top"]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("Ericsson Screw Propeller 3D");
  });

  test("computes genuine marine thrust, ship speed, and slip fraction in SI units", () => {
    const result = stepEricssonPropeller({ shaftRpm: 120, bladePitchAngleDeg: 35 });
    expect(result.thrustKn).toBeGreaterThan(5);
    expect(result.shipSpeedKnots).toBeGreaterThan(4);
    expect(result.slipFraction).toBeGreaterThan(0);
    expect(result.slipFraction).toBeLessThan(1);
  });

  test("builds and articulates procedural tandem drums, concentric shafts, and wake particles correctly", () => {
    const {
      rootGroup,
      hullGroup,
      forwardDrumGroup,
      aftDrumGroup,
      innerShaftMesh,
      outerShaftMesh,
      materials,
      dispose,
    } = buildEricssonPropellerModel();

    expect(rootGroup.children.length).toBeGreaterThan(3);
    expect(hullGroup).toBeDefined();
    expect(forwardDrumGroup).toBeDefined();
    expect(aftDrumGroup).toBeDefined();
    expect(innerShaftMesh).toBeDefined();
    expect(outerShaftMesh).toBeDefined();
    expect(materials.bronzeGunmetal).toBeDefined();
    expect(materials.copperSheathing).toBeDefined();

    dispose();
  });
});
