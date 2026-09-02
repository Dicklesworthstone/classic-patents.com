import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  readWattRotaryControls,
  stepWattRotaryEngine,
  WATT_ROTARY_KINEMATIC_GEOMETRY,
} from "@/physics/wattRotaryKernel";
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
    expect(studioSource).toContain("updateAnimation(out)");
    expect(studioSource).toContain("telemetry.shaftRpm");
    expect(studioSource).not.toContain("p.strokeRateSpm, p.gearRatioNpOverNs");
  });

  test("builds complete procedural node graph with all authentic engine assemblies", () => {
    const model = buildWattRotaryEngineModel();

    expect(model.root).toBeDefined();
    expect(model.beamGroup).toBeDefined();
    expect(model.pistonGroup).toBeDefined();
    expect(model.pistonLinkGroup).toBeDefined();
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

  test("maintains rod closure, pitch-circle contact, and one epicyclic constraint across every ratio", () => {
    const model = buildWattRotaryEngineModel();
    for (const ratio of [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]) {
      const controls = readWattRotaryControls({ strokeRateSpm: 20, gearRatioNpOverNs: ratio });

      for (let sec = 0; sec <= 3; sec += 0.125) {
        const telemetry = stepWattRotaryEngine(controls, sec);
        model.updateAnimation(telemetry);

        expect(Math.abs(telemetry.connectingRodConstraintResidualM)).toBeLessThan(1e-10);
        expect(Math.abs(telemetry.gearMeshConstraintResidualRad)).toBeLessThan(1e-10);
        expect(telemetry.sunPitchRadiusM + telemetry.planetPitchRadiusM).toBeCloseTo(
          WATT_ROTARY_KINEMATIC_GEOMETRY.gearCenterDistanceM,
          10,
        );
        expect(telemetry.planetPitchRadiusM / telemetry.sunPitchRadiusM).toBeCloseTo(ratio, 10);

        // The fixed-length rod starts at the beam pin and lands at the planet bearing.
        expect(model.connectingRodGroup.position.x).toBeCloseTo(telemetry.rightBeamEndX, 10);
        expect(model.connectingRodGroup.position.y).toBeCloseTo(telemetry.rightBeamEndY, 10);
        expect(model.connectingRodGroup.scale.y).toBe(1);
        const computedBottomX =
          telemetry.rightBeamEndX +
          telemetry.connectingRodLengthM * Math.sin(model.connectingRodGroup.rotation.z);
        const computedBottomY =
          telemetry.rightBeamEndY -
          telemetry.connectingRodLengthM * Math.cos(model.connectingRodGroup.rotation.z);
        expect(computedBottomX).toBeCloseTo(model.planetGearGroup.position.x, 10);
        expect(computedBottomY).toBeCloseTo(model.planetGearGroup.position.y, 10);

        // The restrained planet has a fixed world orientation; sun and
        // flywheel share the source-required keyed shaft angle.
        expect(model.planetGearGroup.rotation.z).toBeCloseTo(telemetry.planetBodyAngleRad, 12);
        expect(model.planetGearGroup.rotation.z).toBe(0);
        expect(model.sunGearGroup.rotation.z).toBeCloseTo(telemetry.sunShaftAngleRad, 12);
        expect(model.flywheelGroup.rotation.z).toBeCloseTo(telemetry.sunShaftAngleRad, 12);

        const activeGear = model.getActiveGearGeometry();
        expect(activeGear.ratio).toBe(ratio);
        expect(activeGear.sunTeeth).toBe(telemetry.sunTeeth);
        expect(activeGear.planetTeeth).toBe(telemetry.planetTeeth);
        expect(activeGear.sunPitchRadiusM).toBeCloseTo(telemetry.sunPitchRadiusM, 12);
        expect(activeGear.planetPitchRadiusM).toBeCloseTo(telemetry.planetPitchRadiusM, 12);
      }
    }

    const modelSource = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/three/wattRotaryEngineModel.ts"),
      "utf8",
    );
    expect(modelSource).not.toContain("2 * phase - rodAngle");
    expect(modelSource).not.toContain("rodLength / 2.3");

    const svgSource = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/WattRotaryEngineSim.tsx"),
      "utf8",
    );
    expect(svgSource).toContain("const sunAngleDeg = -telemetry.sunShaftAngleDeg;");
    expect(svgSource).toContain("const planetAngleDeg = -telemetry.planetBodyAngleDeg;");
    expect(svgSource).not.toContain("INITIAL_WATT_CONNECTING_ROD_ANGLE_RAD");

    model.dispose();
  });

  test("disposes all allocated geometries and materials cleanly", () => {
    const model = buildWattRotaryEngineModel();
    expect(() => model.dispose()).not.toThrow();
  });
});
