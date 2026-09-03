import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stepCorlissEngine } from "@/physics/catalogKernels";
import { buildCorlissEngineModel, updateCorlissEngineKinematics } from "./corlissSteamEngineModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 6,162 George Corliss Steam Engine visual & kinematics boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "CorlissSteamEngine3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "corlissSteamEngineModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildCorlissEngineModel");
    expect(modelSource).toContain("updateCorlissEngineKinematics");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "CorlissSteamEngine3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "corlissSteamEngineModel.ts"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
      expect(modelSource).not.toContain(forbidden);
    }
  });

  test("exposes authentic camera presets and UI overlay for Corliss engine observation", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "CorlissSteamEngine3D.tsx"),
      "utf8",
    );

    for (const preset of ["iso", "wrist_plate", "dashpots", "flywheel", "governor", "top"]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("MOBILE_CAMERA_PRESETS");
    expect(threeSource).toContain("iso: { pos: [17.0, 10.5, 22.5], target: [0, -0.5, 0] }");
    expect(threeSource).toContain('resolveCameraPreset("iso", container.clientWidth)');
    expect(threeSource).toContain("isCutaway");
    expect(threeSource).toContain("Corliss Steam Engine 3D");
  });

  test("computes genuine Corliss variable cutoff expansion work in SI units", () => {
    const result = stepCorlissEngine({ steamPressurePsi: 100, engineRpm: 65, cutoffPct: 25 });
    expect(result.indicatedHp).toBeGreaterThan(50);
    expect(result.thermalEfficiencyPct).toBeGreaterThan(15);
    expect(result.crankOmegaRadPerS).toBeCloseTo((65 * 2 * Math.PI) / 60, 2);
    expect(result.govSpread).toBeCloseTo(0.5125, 3);
    expect(result.wristAmp).toBeCloseTo(0.2675, 3);
    expect(result.pistonStrokePx).toBe(45);
    expect(result.wristPlateAmpPx).toBe(22);
    expect(result.intakeOpenWindowDeg).toBeCloseTo(45, 2);
    expect(result.flywheelSvgR).toBe(85);
    expect(result.spokeCount).toBe(6);
    expect(result.spokePitchDeg).toBe(60);
  });

  test("builds and articulates procedural wrist plate, 4 rotary valves, dashpots, and governor correctly", () => {
    const model = buildCorlissEngineModel();

    expect(model.rootGroup.children.length).toBeGreaterThan(4);
    expect(model.wristPlate).toBeDefined();
    expect(model.valveLevers.length).toBe(4);
    expect(model.dashpotRods.length).toBe(2);
    expect(model.governorBalls.length).toBe(2);
    expect(model.materials.mahogany).toBeDefined();
    expect(model.materials.castIron).toBeDefined();

    const corliss = stepCorlissEngine({ steamPressurePsi: 100, engineRpm: 65, cutoffPct: 25 });
    const { strokeX, wristAngle } = updateCorlissEngineKinematics(model, {
      crankAngleRad: Math.PI / 4,
      governorOmegaRadPerS: corliss.governorOmegaRadPerS,
      cutoffFraction: 0.25,
      isCutaway: true,
      dt: 1 / 60,
      govSpread: corliss.govSpread,
      wristAmp: corliss.wristAmp,
      wristLeadRad: corliss.wristLeadRad,
    });

    expect(strokeX).toBeDefined();
    expect(wristAngle).toBeCloseTo(
      Math.sin(Math.PI / 4 + corliss.wristLeadRad) * corliss.wristAmp,
      5,
    );
    expect(model.governorBalls[0]?.position.x).toBeCloseTo(-corliss.govSpread, 4);
    expect(model.materials.mahogany.opacity).toBe(0.35);

    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "CorlissSteamEngine3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "corlissSteamEngineModel.ts"),
      "utf8",
    );
    expect(modelSource).not.toContain("(rpm / 60) * 0.2");
    expect(modelSource).not.toContain("rpm / 120");
    expect(threeSource).toContain("governorOmegaRadPerS");

    model.dispose();
  });

  test("provides valid provenance classifications for all Corliss controls and metrics", () => {
    const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
    const entry = PATENT_PHYSICS_REGISTRY["us-6162-corliss-steam-engine"];
    expect(entry).toBeDefined();
    for (const ctrl of entry.controls) {
      expect(ctrl.provenance).toBeDefined();
    }
    const metrics = entry.computeMetrics({ steamPressurePsi: 100, engineRpm: 65, cutoffPct: 25 });
    for (const m of metrics) {
      expect(m.provenance).toBeDefined();
    }
  });

  test("modifies thermal efficiency when Claim 1 is inverted", () => {
    const { applyClaimConstraintModifications } = require("@/physics/claimConstraints");
    const normal = applyClaimConstraintModifications(
      "us-6162-corliss-steam-engine",
      {},
      { 1: true },
    );
    expect(normal.activeFailures.length).toBe(0);

    const inverted = applyClaimConstraintModifications(
      "us-6162-corliss-steam-engine",
      {},
      { 1: false },
    );
    expect(inverted.activeFailures.length).toBeGreaterThan(0);
    expect(inverted.modifiedParams.thermalEfficiencyPct).toBe(8.5);
    expect(inverted.refusalWarning).toContain("CUT-OFF DISENGAGEMENT FAILURE");
  });

  test("produces distinct telemetry envelopes when controls change", () => {
    const { PATENT_PHYSICS_REGISTRY } = require("@/physics/telemetryData");
    const entry = PATENT_PHYSICS_REGISTRY["us-6162-corliss-steam-engine"];
    const m100 = entry.computeMetrics({ steamPressurePsi: 100, engineRpm: 65, cutoffPct: 25 });
    const m120 = entry.computeMetrics({ steamPressurePsi: 120, engineRpm: 65, cutoffPct: 25 });
    const mCutoff = entry.computeMetrics({ steamPressurePsi: 100, engineRpm: 65, cutoffPct: 35 });

    const env100 = m100.map((m: any) => `${m.label} ${m.value}`).join("; ");
    const env120 = m120.map((m: any) => `${m.label} ${m.value}`).join("; ");
    const envCutoff = mCutoff.map((m: any) => `${m.label} ${m.value}`).join("; ");

    expect(env100).not.toBe(env120);
    expect(env100).not.toBe(envCutoff);
  });
});
