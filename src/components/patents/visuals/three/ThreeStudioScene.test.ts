import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import {
  classifySingleTouchGesture,
  createGlowPointTexture,
  TOUCH_ORBIT_THRESHOLD_PX,
} from "./ThreeStudioScene";

const THREE_DIRECTORY = join(process.cwd(), "src/components/patents/visuals/three");

describe("ThreeStudioScene Visual Foundation", () => {
  test("createGlowPointTexture returns a valid Three.js Texture instance in SSR/Node environment", () => {
    const tex = createGlowPointTexture();
    expect(tex).toBeDefined();
    expect(tex instanceof THREE.Texture).toBe(true);
  });

  test("enforces museum-grade ACES Filmic tone mapping and supported PCF shadows", () => {
    const source = readFileSync(join(THREE_DIRECTORY, "ThreeStudioScene.ts"), "utf8");

    expect(source).toContain("ACESFilmicToneMapping");
    expect(source).toContain("PCFShadowMap");
    expect(source).not.toContain("PCFSoftShadowMap");
    expect(source).toContain("DirectionalLight");
    expect(source).toContain("HemisphereLight");
    expect(source).toContain("SpotLight");
    expect(source).toContain("PerspectiveCamera");
  });

  test("maintains authentic environment styles and dynamic atmospheric configurations", () => {
    const source = readFileSync(join(THREE_DIRECTORY, "ThreeStudioScene.ts"), "utf8");

    for (const style of ["sky", "studio", "laboratory", "ocean"]) {
      expect(source).toContain(`"${style}"`);
    }

    expect(source).toContain("createProceduralSkyTexture");
    expect(source).toContain("createGlowPointTexture");
    expect(source).toContain("createCumulusCloudPuff");
  });

  test("exposes complete studio controls interface and lifecycle disposal methods", () => {
    const source = readFileSync(join(THREE_DIRECTORY, "ThreeStudioScene.ts"), "utf8");

    expect(source).toContain("setView");
    expect(source).toContain("setRadius");
    expect(source).toContain("updateEnvironment");
    expect(source).toContain("forceContextLoss");
    expect(source).toContain("threeFirstRenderMs");
    expect(source).toContain("threeCpuSubmitMs");
    expect(source).not.toContain("threeLastRenderMs");
    expect(source).toContain("threeDrawCalls");
    expect(source).toContain("threeTriangles");
    expect(source).toContain("renderer.info.memory.geometries");
    expect(source).toContain("nextFrameCount === 5");
    expect(source).toContain("nextFrameCount % 30");
  });

  test("publishes a renderer-owned frame receipt only after a completed render", () => {
    const source = readFileSync(join(THREE_DIRECTORY, "ThreeStudioScene.ts"), "utf8");

    expect(source).toContain('canvas.dataset.threeFrameCount = "0"');
    expect(source).toMatch(
      /renderWithoutDiagnostics\(renderScene, renderCamera\);\s+renderedFrameCount = nextFrameCount;\s+canvas\.dataset\.threeFrameCount = String\(renderedFrameCount\);/,
    );
  });

  test("keeps a one-finger vertical swipe available to the document while recognizing a deliberate horizontal orbit", () => {
    expect(classifySingleTouchGesture(TOUCH_ORBIT_THRESHOLD_PX - 1, 0)).toBe("pending");
    expect(classifySingleTouchGesture(0, TOUCH_ORBIT_THRESHOLD_PX)).toBe("scroll");
    expect(classifySingleTouchGesture(TOUCH_ORBIT_THRESHOLD_PX, TOUCH_ORBIT_THRESHOLD_PX)).toBe(
      "scroll",
    );
    expect(classifySingleTouchGesture(TOUCH_ORBIT_THRESHOLD_PX, 0)).toBe("orbit");
  });

  test("uses gesture-gated touch ownership instead of globally disabling page scroll", () => {
    const source = readFileSync(join(THREE_DIRECTORY, "ThreeStudioScene.ts"), "utf8");

    expect(source).toContain('touchAction = "pan-y"');
    expect(source).not.toContain('touchAction = "none"');
    expect(source).toContain("classifySingleTouchGesture");
    expect(source).toContain('touchGesture === "orbit"');
    expect(source).toContain("touchPointers.length >= 2");
    expect(source).toContain('touchGesture !== "pinch"');
    expect(source).toContain("gesturestart");
  });
});
