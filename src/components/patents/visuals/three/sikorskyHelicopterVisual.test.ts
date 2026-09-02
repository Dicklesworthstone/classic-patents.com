import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import * as THREE from "three";
import {
  DEFAULT_SIKORSKY_CONTROLS,
  INITIAL_SIKORSKY_STATE,
  stepSikorskyHelicopterSi,
} from "@/physics/sikorskyHelicopterKernel";
import { buildSikorskyHelicopterModel } from "./sikorskyHelicopterModel";

describe("US 2,318,259 Sikorsky Helicopter 3D Procedural Model", () => {
  test("instantiates full procedural 3D hierarchy: fuselage truss, engine, rotor mast, swashplate, tail boom, tail rotor", () => {
    const model = buildSikorskyHelicopterModel();
    expect(model.root.name).toBe("US 2,318,259 Sikorsky VS-300 Helicopter 3D Studio Model");
    expect(model.root.children.length).toBeGreaterThan(0);

    model.root.updateMatrixWorld(true);
    for (const [strutName, wheelName] of [
      ["SikorskyLeftLandingStrut", "SikorskyLeftMainWheel"],
      ["SikorskyRightLandingStrut", "SikorskyRightMainWheel"],
      ["SikorskyTailWheelStrut", "SikorskyTailWheel"],
    ] as const) {
      const strut = model.root.getObjectByName(strutName) as THREE.Mesh;
      const wheel = model.root.getObjectByName(wheelName) as THREE.Mesh;
      const height = (strut.geometry as THREE.CylinderGeometry).parameters.height;
      const center = strut.getWorldPosition(new THREE.Vector3());
      const axis = new THREE.Vector3(0, height / 2, 0).applyQuaternion(
        strut.getWorldQuaternion(new THREE.Quaternion()),
      );
      const wheelCenter = wheel.getWorldPosition(new THREE.Vector3());
      expect(
        Math.min(
          center.clone().add(axis).distanceTo(wheelCenter),
          center.sub(axis).distanceTo(wheelCenter),
        ),
      ).toBeLessThan(1e-9);
    }
    model.dispose();
  });

  test("keeps the full airframe visible by default on narrow viewports", () => {
    const source = readFileSync(
      resolve(process.cwd(), "src/components/patents/visuals/three/SikorskyHelicopter3D.tsx"),
      "utf8",
    );
    expect(source).toContain("useResponsiveStudioHud(true)");
    expect(source).toContain("MOBILE_OVERVIEW");
    expect(source).toContain("flex-nowrap");
  });

  test("updates 3D articulated rotor kinematics and flight attitude from SI physics telemetry", () => {
    const model = buildSikorskyHelicopterModel();
    const result = stepSikorskyHelicopterSi(
      INITIAL_SIKORSKY_STATE,
      DEFAULT_SIKORSKY_CONTROLS,
      0.016,
    );

    expect(() => {
      model.updateState(result.metrics, DEFAULT_SIKORSKY_CONTROLS, result.state);
    }).not.toThrow();

    // High collective pitch & cyclic forward tilt
    const climbControls = {
      ...DEFAULT_SIKORSKY_CONTROLS,
      collectivePitchDeg: 14.0,
      cyclicPitchForwardDeg: 6.0,
      tailRotorPedalPercent: 30.0,
    };
    const climbResult = stepSikorskyHelicopterSi(result.state, climbControls, 0.05);
    expect(() => {
      model.updateState(climbResult.metrics, climbControls, climbResult.state);
    }).not.toThrow();

    model.dispose();
  });
});
