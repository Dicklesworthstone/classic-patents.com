import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import { stepEngelbartMouse } from "@/physics/catalogKernels";
import { applyClaimConstraintModifications } from "@/physics/claimConstraints";
import {
  buildEngelbartMouseModel,
  ENGELBART_DESK_Y,
  updateEngelbartMouseKinematics,
} from "./engelbartMouseModel";

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
    expect(modelSource).toContain("stepEngelbartResolver");
    expect(modelSource).not.toContain("engelbartXyCrate");
    expect(modelSource).not.toContain("cyclicStudioFlex");
    expect(threeSource).not.toContain("PortHamiltonianEnergyStrip");
    expect(threeSource).toContain("Energy telemetry is withheld");
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
    expect(threeSource).toContain('const DEFAULT_CAMERA_PRESET: CameraPreset = "xray"');
    expect(threeSource).toContain("p.isClicking,\n        p.isXRayMode,");
  });

  test("computes genuine wheel angular velocity, pulse rate, and DPI in SI units", () => {
    const result = stepEngelbartMouse({
      mouseSpeed: 350,
      wheelRadius: 10,
      pulsesPerRev: 200,
    });
    expect(result.omegaRadPerS).toBeGreaterThan(0);
    expect(result.pulseRateHz).toBeGreaterThan(0);
    expect(result.dpi).toBe(Math.round((200 * 25.4) / (2 * Math.PI * 10)));
    expect(result.pathDisplayOmega).toBeCloseTo(350 / 700, 3);
    expect(result.resolverSvgScale).toBe(40);
    expect(result.diameterToRadius).toBe(2);
    expect(result.pointerSvgWidth).toBe(400);
  });

  test("builds and articulates the housing, bottom wall, three buttons, X/Y position wheels, and potentiometers", () => {
    const model = buildEngelbartMouseModel();
    expect(model.rootGroup.children.length).toBeGreaterThan(0);
    expect(model.nodes.mouseGroup).toBeDefined();
    expect(model.nodes.body).toBeDefined();
    expect(model.nodes.basePlate).toBeDefined();
    expect(model.nodes.redButton).toBeDefined();
    expect(model.nodes.buttonCaps).toHaveLength(3);
    expect(model.nodes.switchLeaves).toHaveLength(3);
    expect(model.nodes.xWheelGroup).toBeDefined();
    expect(model.nodes.yWheelGroup).toBeDefined();
    expect(model.nodes.cord).toBeDefined();
    expect(model.nodes.cordSegments).toHaveLength(22);
    expect(model.nodes.ballBearing.name).toContain("54");
    expect(model.nodes.rightAngleBracket.name).toContain("30");

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

    // The positional boolean contract is deliberately tested because a prior
    // call-site inversion made the visibly labelled X-ray mode leave the
    // housing opaque while pressing the red button instead.
    updateEngelbartMouseKinematics(
      model.nodes,
      model.materials,
      1 / 60,
      0,
      mouse.pathDisplayOmega,
      mouse.resolverSvgScale,
      "figure8",
      10,
      200,
      false,
      true,
    );
    expect(model.nodes.body.material).toBe(model.materials.woodHousingXRay);
    expect(model.nodes.redButton.position.y).toBe(2.48);

    updateEngelbartMouseKinematics(
      model.nodes,
      model.materials,
      1 / 60,
      0,
      mouse.pathDisplayOmega,
      mouse.resolverSvgScale,
      "figure8",
      10,
      200,
      true,
      false,
    );
    expect(model.nodes.body.material).toBe(model.materials.woodHousing);
    expect(model.nodes.redButton.position.y).toBe(2.34);

    // Verify orthogonal independence: pure horizontal movement rotates X-wheel, leaving Y-wheel at zero rotation
    model.nodes.xWheelRim.rotation.y = 0;
    model.nodes.yWheelRim.rotation.y = 0;
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
    expect(model.nodes.xWheelRim.rotation.y).not.toBe(0);
    expect(Math.abs(model.nodes.yWheelRim.rotation.y)).toBe(0);

    // Verify orthogonal independence: pure vertical movement rotates Y-wheel, leaving X-wheel at zero rotation
    model.nodes.xWheelRim.rotation.y = 0;
    model.nodes.yWheelRim.rotation.y = 0;
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
    expect(Math.abs(model.nodes.xWheelRim.rotation.y)).toBe(0);
    expect(model.nodes.yWheelRim.rotation.y).not.toBe(0);

    model.dispose();
  });

  test("places both wheel rims and bearing 54 on one desk plane with perpendicular shaft axes", () => {
    const model = buildEngelbartMouseModel();
    updateEngelbartMouseKinematics(
      model.nodes,
      model.materials,
      1 / 30,
      0,
      0.5,
      40,
      "figure8",
      10,
      200,
      false,
      true,
      true,
    );
    model.rootGroup.updateMatrixWorld(true);

    const xBounds = new THREE.Box3().setFromObject(model.nodes.xWheelRim);
    const yBounds = new THREE.Box3().setFromObject(model.nodes.yWheelRim);
    const ballBounds = new THREE.Box3().setFromObject(model.nodes.ballBearing);
    expect(xBounds.min.y).toBeCloseTo(ENGELBART_DESK_Y, 2);
    expect(yBounds.min.y).toBeCloseTo(ENGELBART_DESK_Y, 2);
    expect(ballBounds.min.y).toBeCloseTo(ENGELBART_DESK_Y, 2);

    const xAxis = new THREE.Vector3(0, 1, 0).applyQuaternion(
      model.nodes.xWheelGroup.getWorldQuaternion(new THREE.Quaternion()),
    );
    const yAxis = new THREE.Vector3(0, 1, 0).applyQuaternion(
      model.nodes.yWheelGroup.getWorldQuaternion(new THREE.Quaternion()),
    );
    expect(Math.abs(xAxis.dot(yAxis))).toBeLessThan(1e-8);
    expect(Math.abs(xAxis.z)).toBeCloseTo(1, 8);
    expect(Math.abs(yAxis.x)).toBeCloseTo(1, 8);

    const baseBounds = new THREE.Box3().setFromObject(model.nodes.basePlate);
    const bracketBounds = new THREE.Box3().setFromObject(model.nodes.rightAngleBracket);
    expect(bracketBounds.min.y).toBeLessThanOrEqual(baseBounds.max.y + 1e-8);
    expect(bracketBounds.max.y).toBeGreaterThan(baseBounds.max.y);
    for (const panel of model.nodes.basePlate.children) {
      const panelBounds = new THREE.Box3().setFromObject(panel);
      expect(panelBounds.intersectsBox(xBounds)).toBe(false);
      expect(panelBounds.intersectsBox(yBounds)).toBe(false);
    }
    expect(model.nodes.basePlate.getObjectByName("Bottom wall 28 panel 1-1")).toBeUndefined();
    expect(model.nodes.basePlate.getObjectByName("Bottom wall 28 panel 3-3")).toBeUndefined();

    const housingBounds = new THREE.Box3().setFromObject(model.nodes.body);
    expect(housingBounds.intersectsBox(baseBounds)).toBe(true);
    const xPot = model.rootGroup.getObjectByName("X multiturn potentiometer 38");
    const yPot = model.rootGroup.getObjectByName("Y multiturn potentiometer 40");
    const arm32 = model.rootGroup.getObjectByName("Bracket arm 32 carrying X transducer");
    const arm36 = model.rootGroup.getObjectByName("Bracket arm 36 carrying Y transducer");
    expect(xPot).toBeDefined();
    expect(yPot).toBeDefined();
    expect(arm32).toBeDefined();
    expect(arm36).toBeDefined();
    if (!xPot || !yPot || !arm32 || !arm36) {
      throw new Error("The source-named transducers and bracket arms must exist.");
    }
    expect(
      new THREE.Box3().setFromObject(xPot).intersectsBox(new THREE.Box3().setFromObject(arm32)),
    ).toBe(true);
    expect(
      new THREE.Box3().setFromObject(yPot).intersectsBox(new THREE.Box3().setFromObject(arm36)),
    ).toBe(true);

    const stem = model.rootGroup.getObjectByName("Ball support 54 stem fixed to bottom wall 28");
    expect(stem).toBeDefined();
    if (!stem) throw new Error("Ball-bearing support 54 must include its bottom-wall stem.");
    const stemBounds = new THREE.Box3().setFromObject(stem);
    expect(stemBounds.intersectsBox(baseBounds)).toBe(true);
    expect(stemBounds.intersectsBox(ballBounds)).toBe(true);
    model.dispose();
  });

  test("keeps every allowed wheel radius on the desk and changes the visible geometry", () => {
    const model = buildEngelbartMouseModel();
    const scaleAndContact = (radiusMm: number) => {
      updateEngelbartMouseKinematics(
        model.nodes,
        model.materials,
        1 / 60,
        0,
        0.5,
        40,
        "figure8",
        radiusMm,
        200,
        false,
        true,
        true,
      );
      model.rootGroup.updateMatrixWorld(true);
      return {
        scale: model.nodes.xWheelRim.scale.x,
        minY: new THREE.Box3().setFromObject(model.nodes.xWheelRim).min.y,
      };
    };
    const minimum = scaleAndContact(6);
    const maximum = scaleAndContact(18);
    expect(minimum.minY).toBeCloseTo(ENGELBART_DESK_Y, 2);
    expect(maximum.minY).toBeCloseTo(ENGELBART_DESK_Y, 2);
    expect(maximum.scale).toBeGreaterThan(minimum.scale);
    model.dispose();
  });

  test("keeps conductor 18 flexible between the moving housing and fixed computer-side anchor", () => {
    const model = buildEngelbartMouseModel();
    const update = (time: number) =>
      updateEngelbartMouseKinematics(
        model.nodes,
        model.materials,
        1 / 60,
        time,
        0.5,
        40,
        "figure8",
        10,
        200,
        false,
        true,
        true,
      );
    update(0);
    const firstAtOrigin = model.nodes.cordSegments[0].position.clone();
    const lastAtOrigin = model.nodes.cordSegments.at(-1)?.position.clone();
    update(2);
    const firstAfterMotion = model.nodes.cordSegments[0].position.clone();
    const lastAfterMotion = model.nodes.cordSegments.at(-1)?.position.clone();
    expect(firstAfterMotion.distanceTo(firstAtOrigin)).toBeGreaterThan(0.1);
    expect(lastAfterMotion?.distanceTo(lastAtOrigin ?? new THREE.Vector3())).toBeLessThan(0.08);

    update(1.25);
    const deterministicX = model.nodes.xWheelRim.rotation.y;
    update(3.5);
    update(1.25);
    expect(model.nodes.xWheelRim.rotation.y).toBe(deterministicX);
    model.dispose();
  });

  test("maps shared Claim 1 inversion to a visible one-axis refusal without inventing trackball slip", () => {
    const constrained = applyClaimConstraintModifications(
      "us-3541541-engelbart-mouse",
      { mouseSpeed: 350, wheelRadius: 10, pulsesPerRev: 200 },
      { 1: false },
    );
    expect(constrained.modifiedParams.orthogonalAxes).toBe(1);
    expect(constrained.refusalWarning).toContain("second perpendicular supporting wheel");
    expect(constrained.activeFailures.join(" ")).not.toContain("trackball");

    const model = buildEngelbartMouseModel();
    updateEngelbartMouseKinematics(
      model.nodes,
      model.materials,
      1 / 60,
      1,
      0.5,
      40,
      "vertical",
      10,
      200,
      false,
      true,
      false,
    );
    expect(model.nodes.mouseGroup.position.z).toBe(0);
    expect(Math.abs(model.nodes.yWheelRim.rotation.y)).toBe(0);
    expect(model.nodes.yWheelGroup.visible).toBe(false);
    expect(model.nodes.yWheelGroup.position.y).toBe(model.nodes.xWheelGroup.position.y);
    expect(model.nodes.mouseGroup.rotation.z).not.toBe(0);

    model.dispose();
  });
});
