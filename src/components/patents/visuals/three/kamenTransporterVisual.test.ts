import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  KAMEN_TRANSPORTER_DEFAULT_CONTROLS,
  readKamenTransporterControls,
  stepKamenTransporterSi,
} from "@/physics/kamenTransporterKernel";
import {
  buildKamenTransporterModel,
  updateKamenTransporterKinematics,
} from "./kamenTransporterModel";

describe("US 5,701,965 Dean Kamen Human Transporter Visual & Dynamic Stabilization Boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const model = buildKamenTransporterModel();
    expect(model.root).toBeDefined();
    expect(model.chassis).toBeDefined();
    expect(model.leftCluster).toBeDefined();
    expect(model.rightCluster).toBeDefined();
    expect(model.leftWheel1).toBeDefined();
    expect(model.rightWheel1).toBeDefined();
    expect(model.stairTerrain).toBeDefined();
    expect(model.cgMarker).toBeDefined();

    // Verify cleanup
    expect(() => model.dispose()).not.toThrow();
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const controls = readKamenTransporterControls({
      riderPitchLeanDeg: 5,
      velocityCommandMs: 1.5,
      operatingMode: "balance_2wheel",
    });

    const run1 = stepKamenTransporterSi(controls);
    const run2 = stepKamenTransporterSi(controls);

    expect(run1.pitchAngleDeg).toBe(run2.pitchAngleDeg);
    expect(run1.balanceTorqueNm).toBe(run2.balanceTorqueNm);
    expect(run1.forwardVelocityMs).toBe(run2.forwardVelocityMs);
    expect(run1.stabilityMargin).toBe(run2.stabilityMargin);
  });

  test("computes genuine inverted pendulum equilibrium, natural frequency, and restoring torque in SI units", () => {
    const neutralControls = { ...KAMEN_TRANSPORTER_DEFAULT_CONTROLS };
    const neutral = stepKamenTransporterSi(neutralControls);

    expect(neutral.naturalFrequencyRadS).toBeGreaterThan(3.0); // sqrt(9.81 / 0.92) ~ 3.26 rad/s
    expect(neutral.isBalancing).toBe(true);
    expect(neutral.pitchRefusal).toBe(false);

    // Forward lean test
    const forwardLean = stepKamenTransporterSi({
      ...neutralControls,
      riderPitchLeanDeg: -8,
    });
    expect(forwardLean.pitchAngleDeg).toBeLessThan(0);
    expect(forwardLean.balanceTorqueNm).toBeLessThan(0); // Restoring forward acceleration

    // Safety refusal test on extreme tilt
    const extremeTilt = stepKamenTransporterSi({
      ...neutralControls,
      riderPitchLeanDeg: -35,
    });
    expect(extremeTilt.pitchRefusal).toBe(true);
    expect(extremeTilt.stabilityMargin).toBe(0);
  });

  test("projects the kernel-owned terminal wheel phase without recomputing speed", () => {
    const model = buildKamenTransporterModel();
    const controls = { ...KAMEN_TRANSPORTER_DEFAULT_CONTROLS };
    const tel = stepKamenTransporterSi(controls);
    const phase = 1.25;

    expect(() => {
      updateKamenTransporterKinematics(model, controls, tel, phase);
    }).not.toThrow();

    expect(model.chassis.position.y).toBeGreaterThan(0.2); // Elevated in 2-wheel balance mode
    expect(model.seatGroup.visible).toBe(true);
    expect(model.leftWheel1.rotation.z).toBeCloseTo(-phase, 12);
    expect(model.leftWheel2.rotation.z).toBeCloseTo(-phase, 12);
    expect(model.rightWheel1.rotation.z).toBeCloseTo(-phase, 12);
    expect(model.rightWheel2.rotation.z).toBeCloseTo(-phase, 12);

    const fasterTel = stepKamenTransporterSi({ ...controls, velocityCommandMs: 3 });
    updateKamenTransporterKinematics(model, controls, fasterTel, phase);
    expect(model.leftWheel1.rotation.z).toBeCloseTo(-phase, 12);

    const sceneSource = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/three/KamenTransporter3D.tsx"),
      "utf8",
    );
    expect(sceneSource).toContain("globalTransportBus.registerUpdater");
    expect(sceneSource).toContain("createKamenTransporterTransportUpdater");
    expect(sceneSource).not.toContain("wheelRollAngle +=");
    expect(sceneSource).not.toContain("* 0.016");

    const modelSource = readFileSync(
      join(process.cwd(), "src/components/patents/visuals/three/kamenTransporterModel.ts"),
      "utf8",
    );
    expect(modelSource).not.toContain("wheelSpinSpeed");
    expect(modelSource).toContain("-wheelRollAngleRad");

    model.dispose();
  });
});
