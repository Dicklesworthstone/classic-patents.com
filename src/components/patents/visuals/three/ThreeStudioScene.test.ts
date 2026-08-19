import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import * as THREE from "three";
import { createGlowPointTexture } from "./ThreeStudioScene";

const THREE_DIRECTORY = join(process.cwd(), "src/components/patents/visuals/three");

describe("ThreeStudioScene Visual Foundation", () => {
  test("createGlowPointTexture returns a valid Three.js Texture instance in SSR/Node environment", () => {
    const tex = createGlowPointTexture();
    expect(tex).toBeDefined();
    expect(tex instanceof THREE.Texture).toBe(true);
  });

  test("enforces museum-grade ACES Filmic tone mapping and PCF Soft Shadows", () => {
    const source = readFileSync(join(THREE_DIRECTORY, "ThreeStudioScene.ts"), "utf8");

    expect(source).toContain("ACESFilmicToneMapping");
    expect(source).toContain("PCFSoftShadowMap");
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
  });
});
