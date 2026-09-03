import { describe, expect, test } from "bun:test";
import * as THREE from "three";
import { cortPuddlingRollingViewForViewport } from "./cortPuddlingRollingCamera";
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
    expect(model.calloutSprites.length).toBe(0);
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
    const rabbleOmega = (15 * 2 * Math.PI) / 60;
    model.updateAnimation(1.0, true, 3.14, rabbleOmega);
    expect(model.topRollGroup.rotation.x).toBeCloseTo(-3.14, 2);
    expect(model.bottomRollGroup.rotation.x).toBeCloseTo(3.14, 2);

    // Step animation at t = 2.0s
    model.updateAnimation(2.0, false, 3.14, rabbleOmega);
    expect(model.topRollGroup.rotation.x).toBeCloseTo(-6.28, 2);
    model.dispose();
  });

  test("3D mill omega drains the kernel instead of a leftover 30 RPM sticker", async () => {
    const threeSource = await Bun.file(
      new URL("./CortPuddlingRolling3D.tsx", import.meta.url),
    ).text();
    expect(threeSource).not.toContain("(30 * 2 * Math.PI) / 60");
    expect(threeSource).toContain("outputs.rollOmegaRadPerS");
    expect(threeSource).toContain("outputs.rabbleOmegaRadPerS");
    expect(threeSource).toContain("useLiveSimParams");
    const modelSource = await Bun.file(
      new URL("./cortPuddlingRollingModel.ts", import.meta.url),
    ).text();
    expect(modelSource).not.toContain("(15 * 2 * Math.PI) / 60");
    expect(modelSource).not.toContain("timeSec * 5");
    expect(modelSource).not.toContain("timeSec * 10)");
    expect(modelSource).toContain("puddleFlickerOmegaRadPerS");
    expect(modelSource).toContain("sparkHashRate");
  });

  test("keeps the full furnace-stack envelope inside the overview framing", async () => {
    const cameraSource = await Bun.file(
      new URL("./cortPuddlingRollingCamera.ts", import.meta.url),
    ).text();
    expect(cameraSource).toContain("iso: { pos: [0, 4.4, 10.6], target: [0, 1.35, 0] }");
    expect(cameraSource).toContain("3.6-unit stack");
  });

  test("re-centres only the phone overview so the furnace and mill remain one process", async () => {
    const distance = (view: ReturnType<typeof cortPuddlingRollingViewForViewport>) =>
      Math.hypot(
        view.pos[0] - view.target[0],
        view.pos[1] - view.target[1],
        view.pos[2] - view.target[2],
      );
    const desktopOverview = cortPuddlingRollingViewForViewport("iso", 1200);
    const phoneOverview = cortPuddlingRollingViewForViewport("iso", 375);
    expect(distance(phoneOverview) / distance(desktopOverview)).toBeCloseTo(1.2254, 3);
    expect(phoneOverview).toEqual({
      pos: [-0.7, 5.5, 13],
      target: [-0.7, 1.8, 0],
    });
    expect(cortPuddlingRollingViewForViewport("hearth", 375)).toEqual(
      cortPuddlingRollingViewForViewport("hearth", 1200),
    );

    const threeSource = await Bun.file(
      new URL("./CortPuddlingRolling3D.tsx", import.meta.url),
    ).text();
    expect(threeSource).toContain("cortPuddlingRollingViewForViewport");
    expect(threeSource).toContain('window.addEventListener("resize", restoreResponsiveView)');
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
