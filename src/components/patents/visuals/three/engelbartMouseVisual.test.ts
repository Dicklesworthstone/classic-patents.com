import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stepEngelbartMouse } from "@/physics/catalogKernels";
import { buildEngelbartMouseModel, updateEngelbartMouseKinematics } from "./engelbartMouseModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src", "components", "patents", "visuals");

describe("US 3,541,541 Douglas Engelbart Computer Mouse visual & resolver kinematics boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "engelbartMouseModel.ts"),
      "utf8",
    );
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "EngelbartMouse3D.tsx"),
      "utf8",
    );

    expect(modelSource).not.toContain("useGLTF");
    expect(modelSource).not.toContain(".gltf");
    expect(modelSource).not.toContain(".glb");
    expect(threeSource).not.toContain("useGLTF");
    expect(modelSource).toContain("engelbartXyCrate");
    expect(modelSource).not.toContain("cyclicSymmetry(4, 0.4)");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "engelbartMouseModel.ts"),
      "utf8",
    );
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "EngelbartMouse3D.tsx"),
      "utf8",
    );

    expect(modelSource).not.toContain("Math.random");
    expect(threeSource).not.toContain("Math.random");
    expect(threeSource).not.toContain("performance.now()");
  });

  test("exposes authentic camera presets and UI overlay for mouse kinematics inspection", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "EngelbartMouse3D.tsx"),
      "utf8",
    );

    for (const preset of ["iso", "wheels", "xray", "microswitch", "potentiometers", "top"]) {
      expect(threeSource).toContain(preset);
    }
  });

  test("computes genuine wheel angular velocity, pulse rate, and DPI in SI units", () => {
    const result = stepEngelbartMouse({
      mouseSpeed: 350,
      wheelRadius: 10,
      pulsesPerRev: 200,
    });
    expect(result.omegaRadPerS).toBeGreaterThan(0);
    expect(result.pulseRateHz).toBeGreaterThan(0);
    expect(result.dpi).toBeGreaterThan(100);
    expect(result.pathDisplayOmega).toBeCloseTo(350 * 0.018, 3);
    expect(result.resolverSvgScale).toBe(40);
    expect(result.diameterToRadius).toBe(2);
    expect(result.pointerSvgWidth).toBe(400);
  });

  test("builds and articulates procedural walnut body, metal base, red button, X/Y orthogonal wheels, and potentiometer resolvers correctly", () => {
    const model = buildEngelbartMouseModel();
    expect(model.rootGroup.children.length).toBeGreaterThan(0);
    expect(model.nodes.mouseGroup).toBeDefined();
    expect(model.nodes.body).toBeDefined();
    expect(model.nodes.basePlate).toBeDefined();
    expect(model.nodes.redButton).toBeDefined();
    expect(model.nodes.xWheelGroup).toBeDefined();
    expect(model.nodes.yWheelGroup).toBeDefined();
    expect(model.nodes.cord).toBeDefined();

    // Test kinematics update
    const mouse = stepEngelbartMouse({ mouseSpeed: 350, wheelRadius: 10, pulsesPerRev: 200 });
    updateEngelbartMouseKinematics(
      model.nodes,
      model.materials,
      1 / 60,
      1.0,
      mouse.pathDisplayOmega,
      mouse.resolverSvgScale,
      "figure8",
      10,
      200,
      false,
      false,
    );
    expect(model.nodes.mouseGroup.position.x).toBeDefined();

    // Verify orthogonal independence: pure horizontal movement rotates X-wheel, leaving Y-wheel at zero rotation
    model.nodes.xWheelRim.rotation.x = 0;
    model.nodes.yWheelRim.rotation.z = 0;
    updateEngelbartMouseKinematics(
      model.nodes,
      model.materials,
      1 / 60,
      0.5,
      mouse.pathDisplayOmega,
      1.0,
      "horizontal",
      10,
      200,
      false,
      false,
    );
    expect(model.nodes.xWheelRim.rotation.x).not.toBe(0);
    expect(model.nodes.yWheelRim.rotation.z).toBe(0);

    // Verify orthogonal independence: pure vertical movement rotates Y-wheel, leaving X-wheel at zero rotation
    model.nodes.xWheelRim.rotation.x = 0;
    model.nodes.yWheelRim.rotation.z = 0;
    updateEngelbartMouseKinematics(
      model.nodes,
      model.materials,
      1 / 60,
      0.5,
      mouse.pathDisplayOmega,
      1.0,
      "vertical",
      10,
      200,
      false,
      false,
    );
    expect(model.nodes.xWheelRim.rotation.x).toBe(0);
    expect(model.nodes.yWheelRim.rotation.z).not.toBe(0);

    model.dispose();
  });
});
