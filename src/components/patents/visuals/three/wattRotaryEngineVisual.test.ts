import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { readWattRotaryControls, stepWattRotaryEngine } from "@/physics/wattRotaryKernel";
import { buildWattRotaryEngineModel } from "./wattRotaryEngineModel";

describe("James Watt 1781 Rotary Motion 3D WebGL Procedural Model", () => {
  test("3D studio mounts through createThreeStudioScene instead of a private Scene/Renderer", () => {
    const studioSource = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/three/WattRotaryEngine3D.tsx"),
      "utf8",
    );
    expect(studioSource).toContain("createThreeStudioScene");
    expect(studioSource).not.toContain("OrbitControls");
    expect(studioSource).not.toContain("new THREE.WebGLRenderer");
    expect(studioSource).toContain("controls.setView");
    expect(studioSource).toContain("readWattRotaryControls");
    expect(studioSource).toContain("planetOrbitAngleDeg");
    expect(studioSource).not.toContain("p.strokeRateSpm, p.gearRatioNpOverNs");
  });

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
    const controls = readWattRotaryControls({ strokeRateSpm: 20, gearRatioNpOverNs: 1.0 });

    model.updateAnimation(stepWattRotaryEngine(controls, 0));
    const initialSunAngle = model.sunGearGroup.rotation.z;

    const quarter = stepWattRotaryEngine(controls, 0.75);
    model.updateAnimation(quarter);
    const quarterSunAngle = model.sunGearGroup.rotation.z;
    const quarterPlanetX = model.planetGearGroup.position.x;

    expect(quarterSunAngle).not.toBe(initialSunAngle);
    expect(quarterPlanetX).toBeGreaterThan(2.2);

    const modelSource = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/three/wattRotaryEngineModel.ts"),
      "utf8",
    );
    expect(modelSource).not.toContain("(spm * 2 * Math.PI) / 60");

    model.dispose();
  });

  test("maintains exact geometric seating and epicyclic tooth meshing through full 360-degree orbit", () => {
    const model = buildWattRotaryEngineModel();
    const controls = readWattRotaryControls({ strokeRateSpm: 20, gearRatioNpOverNs: 1.0 });

    for (let sec = 0; sec <= 3.0; sec += 0.25) {
      const telemetry = stepWattRotaryEngine(controls, sec);
      model.updateAnimation(telemetry);

      const beamAngleRad = (telemetry.beamAngleDeg * Math.PI) / 180;
      const rightBeamEndX = Math.cos(beamAngleRad) * 2.2;
      const rightBeamEndY = 3.2 + Math.sin(beamAngleRad) * 2.2;

      // Connecting rod top matches right beam end
      expect(model.connectingRodGroup.position.x).toBeCloseTo(rightBeamEndX, 5);
      expect(model.connectingRodGroup.position.y).toBeCloseTo(rightBeamEndY, 5);

      // Planet gear rotation matches connecting rod sway angle
      expect(model.planetGearGroup.rotation.z).toBeCloseTo(model.connectingRodGroup.rotation.z, 5);

      // Connecting rod bottom reaches planet center
      const rodAngle = model.connectingRodGroup.rotation.z;
      const rodLength = Math.hypot(
        model.planetGearGroup.position.x - rightBeamEndX,
        model.planetGearGroup.position.y - rightBeamEndY,
      );
      const computedBottomX = rightBeamEndX + rodLength * Math.sin(rodAngle);
      const computedBottomY = rightBeamEndY - rodLength * Math.cos(rodAngle);
      expect(computedBottomX).toBeCloseTo(model.planetGearGroup.position.x, 5);
      expect(computedBottomY).toBeCloseTo(model.planetGearGroup.position.y, 5);

      // Sun gear rotates at conjugate rolling angle 2*theta - rodAngle
      const phase = (telemetry.planetOrbitAngleDeg * Math.PI) / 180;
      const expectedSunAngle = 2 * phase - rodAngle;
      expect(model.sunGearGroup.rotation.z).toBeCloseTo(expectedSunAngle, 5);
      expect(model.flywheelGroup.rotation.z).toBeCloseTo(expectedSunAngle, 5);
    }

    model.dispose();
  });

  test("disposes all allocated geometries and materials cleanly", () => {
    const model = buildWattRotaryEngineModel();
    expect(() => model.dispose()).not.toThrow();
  });
});
