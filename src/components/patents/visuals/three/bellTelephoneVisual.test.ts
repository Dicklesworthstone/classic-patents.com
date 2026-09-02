import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stepBellTelephone } from "@/physics/catalogKernels";
import { buildBellTelephoneModel, updateBellTelephoneKinematics } from "./bellTelephoneModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src/components/patents/visuals");

describe("US 174,465 Alexander Graham Bell Telephone visual & acoustics boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "BellTelephone3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "bellTelephoneModel.ts"),
      "utf8",
    );

    expect(threeSource).not.toContain("GLTFLoader");
    expect(threeSource).not.toContain(".glb");
    expect(threeSource).not.toContain(".gltf");
    expect(modelSource).toContain("buildBellTelephoneModel");
    expect(modelSource).toContain("updateBellTelephoneKinematics");
    expect(modelSource).not.toContain("stepBellTelephone");
    expect(threeSource).toContain("p.bell");
    expect(threeSource).toContain("voiceAmplitudeDb");
    expect(threeSource).toContain("acousticFrequencyHz");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "BellTelephone3D.tsx"),
      "utf8",
    );
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "bellTelephoneModel.ts"),
      "utf8",
    );

    for (const forbidden of ["Math.random", "new THREE.Clock", "performance.now"]) {
      expect(threeSource).not.toContain(forbidden);
      expect(modelSource).not.toContain(forbidden);
    }
  });

  test("exposes authentic camera presets and cutaway mode for telephone transmitter inspection", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "BellTelephone3D.tsx"),
      "utf8",
    );

    for (const preset of [
      "iso",
      "speaking_horn",
      "liquid_transmitter",
      "battery_cells",
      "diaphragm_wire",
      "top",
    ]) {
      expect(threeSource).toContain(preset);
    }

    expect(threeSource).toContain("isCutaway");
    expect(threeSource).toContain("Bell Liquid Transmitter Telephone 3D");
  });

  test("computes genuine diaphragm deflection, liquid resistance modulation, and loop current in SI units", () => {
    const result = stepBellTelephone({
      voiceAmplitude: 75,
      airGap: 0.35,
      batteryVoltage: 6.0,
      liquidConductivity: 1.2,
      acousticFrequencyHz: 440,
    });
    expect(result.diaphragmUm).toBeGreaterThan(0.1);
    expect(result.baseResistanceOhms).toBeGreaterThan(10);
    expect(result.resistanceModulationOhms).toBeGreaterThan(1);
    expect(result.currentBaselineAmps).toBeGreaterThan(0.05);
    expect(result.currentBaselineMa).toBeCloseTo(result.currentBaselineAmps * 1000, 5);
    expect(result.modulatedMa).toBeGreaterThan(0.01);
    expect(result.diaphragmStudioScale).toBeCloseTo((result.diaphragmUm / 10) * 0.08, 4);
    expect(result.electronStudioSpeed).toBeCloseTo(result.electronDisplaySpeed * 0.5, 3);
    expect(result.toneGainSine).toBeCloseTo(0.075, 3);
    expect(result.scopeNorm).toBeCloseTo(1, 3);
    expect(result.scopeSineAmp).toBeCloseTo(30, 2);
    expect(result.scopeSampleCount).toBe(60);
    expect(result.scopeSamplePitchPx).toBe(5);
    expect(result.scopeSquareAmp).toBeCloseTo(37.5, 2);
    expect(result.voiceNorm).toBeCloseTo((75 - 40) / 55, 3);
    expect(result.toneGainSquare).toBeCloseTo(0.045, 3);

    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "BellTelephone3D.tsx"),
      "utf8",
    );
    expect(threeSource).toContain("currentBaselineMa");
    expect(threeSource).not.toContain("currentBaselineAmps * 1000");
  });

  test("keeps every physical control observable in the complete kernel state", () => {
    const baseline = stepBellTelephone({
      voiceAmplitude: 75,
      airGap: 0.35,
      batteryVoltage: 6,
      liquidConductivity: 1.2,
      acousticFrequencyHz: 440,
    });
    const louder = stepBellTelephone({
      voiceAmplitude: 90,
      airGap: 0.35,
      batteryVoltage: 6,
      liquidConductivity: 1.2,
      acousticFrequencyHz: 440,
    });
    const narrowerGap = stepBellTelephone({
      voiceAmplitude: 75,
      airGap: 0.1,
      batteryVoltage: 6,
      liquidConductivity: 1.2,
      acousticFrequencyHz: 440,
    });
    const higherVoltage = stepBellTelephone({
      voiceAmplitude: 75,
      airGap: 0.35,
      batteryVoltage: 12,
      liquidConductivity: 1.2,
      acousticFrequencyHz: 440,
    });
    const higherConductivity = stepBellTelephone({
      voiceAmplitude: 75,
      airGap: 0.35,
      batteryVoltage: 6,
      liquidConductivity: 2.4,
      acousticFrequencyHz: 440,
    });
    const higherFrequency = stepBellTelephone({
      voiceAmplitude: 75,
      airGap: 0.35,
      batteryVoltage: 6,
      liquidConductivity: 1.2,
      acousticFrequencyHz: 880,
    });

    expect(louder.diaphragmUm).toBeGreaterThan(baseline.diaphragmUm);
    expect(narrowerGap.modulatedMa).toBeGreaterThan(baseline.modulatedMa);
    expect(higherVoltage.currentBaselineAmps).toBeGreaterThan(baseline.currentBaselineAmps);
    expect(higherConductivity.baseResistanceOhms).toBeLessThan(baseline.baseResistanceOhms);
    expect(higherConductivity.electronStudioSpeed).toBeGreaterThan(baseline.electronStudioSpeed);
    expect(higherFrequency.acousticDisplayOmegaRadPerS).toBeGreaterThan(
      baseline.acousticDisplayOmegaRadPerS,
    );
  });

  test("builds and articulates procedural walnut baseboard, speaking cone, parchment diaphragm, and liquid cup correctly", () => {
    const model = buildBellTelephoneModel();
    expect(model.rootGroup.children.length).toBeGreaterThan(0);
    expect(model.hornMesh).toBeDefined();
    expect(model.diaphragmMesh).toBeDefined();
    expect(model.rodGroup).toBeDefined();
    expect(model.glassCup).toBeDefined();
    expect(model.waveRings.length).toBe(5);

    const bell = stepBellTelephone({
      voiceAmplitude: 75,
      airGap: 0.35,
      batteryVoltage: 6,
      liquidConductivity: 1.2,
      acousticFrequencyHz: 440,
    });
    updateBellTelephoneKinematics(model, 0.016, 0.5, bell, true, true);
    expect(model.materials.brass.opacity).toBe(0.35);
    expect(model.materials.glassCupMat.opacity).toBe(0.25);

    model.dispose();
  });
});
