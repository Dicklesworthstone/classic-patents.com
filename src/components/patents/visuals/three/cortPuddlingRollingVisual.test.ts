import { describe, expect, test } from "bun:test";
import * as THREE from "three";
import { buildCortPuddlingRollingModel } from "./cortPuddlingRollingModel";

describe("Henry Cort Puddling & Grooved Rolling 3D WebGL Model", () => {
  test("builds complete procedural 3D model hierarchy", () => {
    const model = buildCortPuddlingRollingModel();
    expect(model.root).toBeDefined();
    expect(model.furnaceGroup).toBeDefined();
    expect(model.roofGroup).toBeDefined();
    expect(model.rabbleGroup).toBeDefined();
    expect(model.puddleBallMesh).toBeDefined();
    expect(model.topRollGroup).toBeDefined();
    expect(model.bottomRollGroup).toBeDefined();
    expect(model.billetMesh).toBeDefined();
    expect(model.calloutSprites.length).toBe(10);
    model.dispose();
  });

  test("toggles cutaway roof visibility", () => {
    const model = buildCortPuddlingRollingModel();
    model.setCutaway(true);
    expect(model.roofGroup.visible).toBe(false);

    model.setCutaway(false);
    expect(model.roofGroup.visible).toBe(true);
    model.dispose();
  });

  test("toggles callout pins visibility", () => {
    const model = buildCortPuddlingRollingModel();
    model.setShowCallouts(false);
    for (const sprite of model.calloutSprites) {
      expect(sprite.visible).toBe(false);
    }

    model.setShowCallouts(true);
    for (const sprite of model.calloutSprites) {
      expect(sprite.visible).toBe(true);
    }
    model.dispose();
  });

  test("animates rolls and rabble deterministically without errors", () => {
    const model = buildCortPuddlingRollingModel();
    // Step animation at t = 1.0s, coming to nature = true, rollOmega = 3.14 rad/s
    model.updateAnimation(1.0, true, 3.14);
    expect(model.topRollGroup.rotation.x).toBeCloseTo(-3.14, 2);
    expect(model.bottomRollGroup.rotation.x).toBeCloseTo(3.14, 2);

    // Step animation at t = 2.0s
    model.updateAnimation(2.0, false, 3.14);
    expect(model.topRollGroup.rotation.x).toBeCloseTo(-6.28, 2);
    model.dispose();
  });

  test("properly cleans up WebGL geometries and materials on disposal", () => {
    const model = buildCortPuddlingRollingModel();
    let meshCount = 0;
    model.root.traverse((obj) => {
      if (obj instanceof THREE.Mesh) meshCount++;
    });
    expect(meshCount).toBeGreaterThan(15);
    expect(() => model.dispose()).not.toThrow();
  });
});
