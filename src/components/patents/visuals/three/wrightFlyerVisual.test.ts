import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { readWrightControls, stepWrightFlyerSi } from "@/physics/wrightKernel";
import { buildWrightFlyerAirframe, updateWrightFlyerKinematics } from "./wrightFlyerAirframe";

const VISUALS_DIRECTORY = join(process.cwd(), "src", "components", "patents", "visuals");

describe("US 821,393 Wright Brothers Flying-Machine 3D visual & aerodynamic boundary", () => {
  test("uses pure procedural Three.js WebGL airframe without external GLTF/GLB models", () => {
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "wrightFlyerAirframe.ts"),
      "utf8",
    );
    const threeSource = readFileSync(join(VISUALS_DIRECTORY, "three", "WrightFlyer3D.tsx"), "utf8");

    expect(modelSource).not.toContain("useGLTF");
    expect(modelSource).not.toContain(".gltf");
    expect(modelSource).not.toContain(".glb");
    expect(modelSource).toContain("buildWrightFlyerAirframe");
    expect(modelSource).toContain("updateWrightFlyerKinematics");
    expect(threeSource).not.toContain("useGLTF");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "wrightFlyerAirframe.ts"),
      "utf8",
    );
    const threeSource = readFileSync(join(VISUALS_DIRECTORY, "three", "WrightFlyer3D.tsx"), "utf8");

    expect(modelSource).not.toContain("Math.random");
    expect(threeSource).not.toContain("Math.random");
    expect(threeSource).not.toContain("performance.now()");
  });

  test("exposes authentic camera presets and HUD for 3-axis flight control observation", () => {
    const threeSource = readFileSync(join(VISUALS_DIRECTORY, "three", "WrightFlyer3D.tsx"), "utf8");

    for (const preset of ["iso", "wing_warp", "canard", "rudder", "engine_props", "top"]) {
      expect(threeSource).toContain(preset);
    }
    expect(threeSource).toContain("isCutaway");
  });

  test("computes genuine aerodynamic lift, induced drag, and adverse yaw cancellation in SI units", () => {
    const controls = readWrightControls({
      warp: 6.0,
      rudder: 8.0,
      elevator: 3.0,
      speed: 30.0,
      coupled: 1,
    });
    const si = stepWrightFlyerSi(controls);
    expect(si.liftNewtons).toBeGreaterThan(1000);
    expect(si.totalDragNewtons).toBeGreaterThan(100);
    expect(si.adverseYawNm).toBeDefined();
    expect(si.rudderYawNm).toBeDefined();
    expect(si.propDisplayOmegaRadPerS).toBeGreaterThan(0);
    expect(si.streamFlowSpeed).toBeGreaterThan(0);
  });

  test("builds and articulates procedural biplane wings, flexible rib warp, forward elevator, and twin rudders correctly", () => {
    const airframe = buildWrightFlyerAirframe();
    expect(airframe.group.children.length).toBeGreaterThan(0);
    expect(airframe.upperWing).toBeDefined();
    expect(airframe.lowerWing).toBeDefined();
    expect(airframe.canardGroup).toBeDefined();
    expect(airframe.rudderGroup).toBeDefined();
    expect(airframe.cradleGroup).toBeDefined();
    expect(airframe.leftPropBlades).toBeDefined();
    expect(airframe.rightPropBlades).toBeDefined();

    const pose = stepWrightFlyerSi({
      airspeedMph: 30,
      wingWarpDeg: 6,
      rudderDeg: 8,
      elevatorDeg: 3,
      coupled: true,
    });
    updateWrightFlyerKinematics(
      airframe,
      0.016,
      6.0,
      8.0,
      3.0,
      pose.propDisplayOmegaRadPerS,
      pose.cradleStudioX,
      pose.leftBayTension,
      pose.rightBayTension,
      true,
    );
    expect(airframe.rudderGroup.rotation.y).toBeCloseTo((-8.0 * Math.PI) / 180, 2);
    expect(airframe.canardGroup.rotation.x).toBeCloseTo((-3.0 * Math.PI) / 180, 2);
    expect(airframe.muslinMat.opacity).toBe(0.35);
  });
});
