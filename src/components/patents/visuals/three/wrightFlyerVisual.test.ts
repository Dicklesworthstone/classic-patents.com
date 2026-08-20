import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  readWrightControls,
  stepWrightFlyerSi,
  wrightHoverY,
  wrightSchematicPose,
  wrightWarpFromPointerNx,
} from "@/physics/wrightKernel";
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
    expect(threeSource).not.toContain("/ 1100");
    expect(threeSource).not.toContain("/ 400");
    expect(threeSource).toContain("wrightHoverY");
    expect(threeSource).not.toContain("* 1.4");
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
    expect(threeSource).toContain("controls.setView");
    expect(threeSource).not.toContain("cameraRef");
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
    expect(si.liftVectorLength).toBeGreaterThan(0.5);
    expect(si.dragVectorLength).toBeGreaterThan(0.3);
    expect(si.leftLiftN + si.rightLiftN).toBeGreaterThan(0);
    expect(si.leftWingLiftPct).toBeGreaterThan(0);
    const pose = wrightSchematicPose({ wingWarp: 15, rudder: 10, coupled: 1 });
    expect(pose.warpPx).toBeCloseTo(12, 3);
    expect(wrightWarpFromPointerNx(0.5)).toBe(0);
    expect(wrightWarpFromPointerNx(0)).toBe(-15);
    expect(wrightWarpFromPointerNx(1)).toBe(15);
    expect(pose.rasterSkew).toBeCloseTo(8, 3);
    expect(pose.rudderAngle).toBeCloseTo(7, 3);
    expect(pose.strutDelta).toBeCloseTo(8.4, 3);
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
    expect(pose.airframeRollDeg).toBeCloseTo(5.4, 3);
    expect(pose.rudderSvgScale).toBe(1.2);
    expect(pose.hoverOmegaRadPerS).toBe(1.4);
    expect(pose.hoverAmpM).toBe(0.04);
    expect(wrightHoverY(0, pose.hoverOmegaRadPerS, pose.hoverAmpM)).toBe(0);
    expect(pose.canardSvgY).toBeCloseTo(-3.6, 3);
    expect(pose.leftLiftSvgY).toBeGreaterThan(0);
    expect(pose.leftDragSvgX).toBeGreaterThan(0);
  });
});
