import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import {
  readWrightControls,
  stepWrightFlyerSi,
  wrightHoverY,
  wrightSchematicPose,
  wrightWarpFromPointerNx,
} from "@/physics/wrightKernel";
import { buildWrightFlyerAirframe, updateWrightFlyerKinematics } from "./wrightFlyerAirframe";
import { wrightFlyerViewForViewport } from "./wrightFlyerCamera";

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
    expect(threeSource).toContain("const particleCount = 180");
    expect(threeSource).toContain("opacity: 0.55");
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

  test("keeps the full wing envelope inside phone and tablet overviews without weakening detail views", () => {
    const distance = (view: ReturnType<typeof wrightFlyerViewForViewport>) =>
      Math.hypot(
        view.pos[0] - view.target[0],
        view.pos[1] - view.target[1],
        view.pos[2] - view.target[2],
      );
    const desktopIso = wrightFlyerViewForViewport("iso", 1200);
    const tabletIso = wrightFlyerViewForViewport("iso", 768);
    const phoneIso = wrightFlyerViewForViewport("iso", 375);
    const desktopTop = wrightFlyerViewForViewport("top", 1200);
    const phoneTop = wrightFlyerViewForViewport("top", 375);
    const phoneDetail = wrightFlyerViewForViewport("wing_warp", 375);

    expect(distance(phoneIso) / distance(desktopIso)).toBeCloseTo(2.2, 8);
    expect(distance(tabletIso) / distance(desktopIso)).toBeCloseTo(1.6, 8);
    expect(distance(phoneTop) / distance(desktopTop)).toBeCloseTo(1.85, 8);
    expect(phoneDetail).toEqual(wrightFlyerViewForViewport("wing_warp", 1200));

    const threeSource = readFileSync(join(VISUALS_DIRECTORY, "three", "WrightFlyer3D.tsx"), "utf8");
    expect(threeSource).toContain("wrightFlyerViewForViewport");
    expect(threeSource).toContain('window.addEventListener("resize", restoreResponsiveView)');
    expect(threeSource).not.toContain("controls.setRadius(11)");
  });

  test("writes the same canonical airspeed key that the shared Wright kernel reads", () => {
    const threeSource = readFileSync(join(VISUALS_DIRECTORY, "three", "WrightFlyer3D.tsx"), "utf8");

    expect(threeSource).toContain('paramKey="airspeed"');
    expect(threeSource).toContain('updateParam("airspeed", val)');
    expect(threeSource).not.toContain('paramKey="airspeedKts"');
    expect(threeSource).not.toContain('updateParam("speed", val)');
  });

  test("computes genuine aerodynamic lift, induced drag, and adverse yaw cancellation in SI units", () => {
    const controls = readWrightControls({
      wingWarp: 6.0,
      rudder: 8.0,
      elevator: 3.0,
      airspeed: 30.0,
      coupled: 1,
    });
    expect(controls.airspeedMph).toBe(30);
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
    let meshCount = 0;
    airframe.group.traverse((candidate) => {
      if (candidate instanceof THREE.Mesh) meshCount += 1;
    });
    expect(meshCount).toBeLessThan(120);

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
    expect(airframe.leftTipUpper.rotation.x).toBeCloseTo((6 * 0.6 * Math.PI) / 180, 4);
    expect(airframe.rightTipUpper.rotation.x).toBeCloseTo((-6 * 0.6 * Math.PI) / 180, 4);
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
