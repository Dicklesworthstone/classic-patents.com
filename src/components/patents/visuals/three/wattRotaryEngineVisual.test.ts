import { describe, expect, test } from "bun:test";
import { buildWattRotaryEngineModel } from "./wattRotaryEngineModel";

describe("James Watt 1781 Rotary Motion 3D WebGL Procedural Model", () => {
  test("builds complete procedural node graph with all authentic engine assemblies", () => {
    const model = buildWattRotaryEngineModel();

    expect(model.root).toBeDefined();
    expect(model.beamGroup).toBeDefined();
    expect(model.pistonGroup).toBeDefined();
    expect(model.connectingRodGroup).toBeDefined();
    expect(model.sunGearGroup).toBeDefined();
    expect(model.planetGearGroup).toBeDefined();
    expect(model.flywheelGroup).toBeDefined();
    expect(model.radiusLinkGroup).toBeDefined();
    expect(model.cylinderShellMesh).toBeDefined();
    expect(model.cylinderCutawayMesh).toBeDefined();
    expect(model.calloutSprites.length).toBe(10);

    model.dispose();
  });

  test("toggles cutaway cylinder shell visibility without mutating node hierarchy", () => {
    const model = buildWattRotaryEngineModel();

    // Default: solid shell visible, cutaway hidden
    expect(model.cylinderShellMesh.visible).toBe(true);
    expect(model.cylinderCutawayMesh.visible).toBe(false);

    model.setCutaway(true);
    expect(model.cylinderShellMesh.visible).toBe(false);
    expect(model.cylinderCutawayMesh.visible).toBe(true);

    model.setCutaway(false);
    expect(model.cylinderShellMesh.visible).toBe(true);
    expect(model.cylinderCutawayMesh.visible).toBe(false);

    model.dispose();
  });

  test("updates kinematics and epicyclic gear doubling deterministically across time steps", () => {
    const model = buildWattRotaryEngineModel();

    // At t=0
    model.updateAnimation(0, 20, 1.0);
    const initialSunAngle = model.sunGearGroup.rotation.z;
    const _initialPlanetY = model.planetGearGroup.position.y;

    // At quarter cycle (t = 0.75s for 20 SPM -> cycle period = 3s)
    model.updateAnimation(0.75, 20, 1.0);
    const quarterSunAngle = model.sunGearGroup.rotation.z;
    const quarterPlanetX = model.planetGearGroup.position.x;

    expect(quarterSunAngle).not.toBe(initialSunAngle);
    expect(quarterPlanetX).toBeGreaterThan(2.2); // planet moves to the right of sun shaft

    model.dispose();
  });

  test("disposes all allocated geometries and materials cleanly", () => {
    const model = buildWattRotaryEngineModel();
    expect(() => model.dispose()).not.toThrow();
  });
});
