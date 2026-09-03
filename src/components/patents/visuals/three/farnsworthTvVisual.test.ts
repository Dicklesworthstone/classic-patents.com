import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { stepFarnsworthRasterFrame } from "@/physics/catalogKernels";
import { FrankenSimEngine } from "@/physics/engine";
import { computeFarnsworthRasterField } from "@/physics/fieldTextures";
import { buildFarnsworthTvModel, updateFarnsworthTvKinematics } from "./farnsworthTvModel";

const VISUALS_DIRECTORY = join(process.cwd(), "src", "components", "patents", "visuals");

describe("US 1,773,980 Philo T. Farnsworth Television System visual & electron optics boundary", () => {
  test("uses pure procedural Three.js WebGL architecture without external GLTF/GLB models", () => {
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "farnsworthTvModel.ts"),
      "utf8",
    );
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "FarnsworthTV3D.tsx"),
      "utf8",
    );
    const twoSource = readFileSync(join(VISUALS_DIRECTORY, "FarnsworthTVSim.tsx"), "utf8");
    const ownerSource = readFileSync(
      join(VISUALS_DIRECTORY, "PatentPhysicsRuntimeOwner.tsx"),
      "utf8",
    );

    expect(modelSource).not.toContain("useGLTF");
    expect(modelSource).not.toContain(".gltf");
    expect(modelSource).not.toContain(".glb");
    expect(modelSource).toContain("buildFarnsworthTvModel");
    expect(modelSource).toContain("updateFarnsworthTvKinematics");
    expect(modelSource).toContain("electronDisplaySpeed");
    expect(modelSource).toContain('focusCoil.name = "longitudinal-focus-solenoid"');
    expect(modelSource).toContain("new THREE.TorusGeometry(2.08, 0.035");
    expect(modelSource).not.toContain("new THREE.CylinderGeometry(2.15, 2.15, 7.2");
    expect(modelSource).not.toContain("20000000");
    expect(modelSource).not.toContain("stepFarnsworthTv");
    expect(modelSource).not.toContain("FrankenSimEngine");
    expect(threeSource).toContain("readFarnsworthTvTapeFrame");
    expect(twoSource).toContain("readFarnsworthTvTapeFrame");
    expect(ownerSource).toContain("createFarnsworthTvTransportUpdater");
    const baerOwnerSource = ownerSource.slice(
      ownerSource.indexOf("export function BaerOdysseyPhysicsRuntimeOwner"),
      ownerSource.indexOf("export function FarnsworthTvPhysicsRuntimeOwner"),
    );
    const farnsworthOwnerSource = ownerSource.slice(
      ownerSource.indexOf("export function FarnsworthTvPhysicsRuntimeOwner"),
      ownerSource.indexOf("export function EInkPhysicsRuntimeOwner"),
    );
    expect(farnsworthOwnerSource).toContain("getFarnsworthTvTapeFrame");
    expect(farnsworthOwnerSource).toContain("data-running");
    expect(baerOwnerSource).not.toContain("getFarnsworthTvTapeFrame");
    expect(baerOwnerSource).not.toContain("data-running");
    expect(threeSource).not.toContain("stepFarnsworthRasterFrame");
    expect(twoSource).not.toContain("stepFarnsworthRasterFrame");
    expect(threeSource).not.toContain("stepFarnsworthTv");
    expect(twoSource).not.toContain("stepFarnsworthTv");
    expect(threeSource).not.toContain("createStudioClock");
    expect(twoSource).not.toContain("createStudioClock");
    expect(threeSource).toContain("model.photocathode.add(photocathodeField)");
    expect(threeSource).toContain('preset === "iso" ? 2.15 : 1.55');
    expect(threeSource).not.toContain("scene.add(fieldPlane)");
    expect(modelSource.match(/tubeGroup\.add\(saddle[HV][12]\)/g)?.length).toBe(4);
    expect(threeSource).not.toContain("useGLTF");
  });

  test("maintains deterministic replay without ambient randomness or private clocks in frame loop", () => {
    const modelSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "farnsworthTvModel.ts"),
      "utf8",
    );
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "FarnsworthTV3D.tsx"),
      "utf8",
    );

    expect(modelSource).not.toContain("Math.random");
    expect(threeSource).not.toContain("Math.random");
    expect(threeSource).not.toContain("performance.now()");
  });

  test("exposes authentic camera presets and UI overlay for dissector tube inspection", () => {
    const threeSource = readFileSync(
      join(VISUALS_DIRECTORY, "three", "FarnsworthTV3D.tsx"),
      "utf8",
    );

    for (const preset of ["iso", "photocathode", "aperture", "coils", "electron_gun", "top"]) {
      expect(threeSource).toContain(preset);
    }
    expect(threeSource).toContain("isCutaway");
  });

  test("computes genuine electron velocity, relativistic beta, and photocathode current in SI units", () => {
    const deflectionGauss = FrankenSimEngine.farnsworthDeflectionGauss(0.42);
    const result = FrankenSimEngine.stepFarnsworthTv(1.5, deflectionGauss, 500);
    expect(result.electronVelocityMps).toBeGreaterThan(1e7);
    expect(result.relativisticBeta).toBeGreaterThan(0.05);
    expect(result.photocathodeCurrentUa).toBeGreaterThan(0);
    expect(result.gyroRadiusMm).toBeGreaterThan(0);
    expect(result.electronDisplaySpeed).toBeCloseTo((result.electronVelocityMps / 2e7) * 45, 1);
    expect(result.electronVelocityMegaMps).toBeCloseTo(result.electronVelocityMps / 1e6, 1);
    expect(result.relativisticPct).toBeCloseTo(result.relativisticBeta * 100, 1);
    expect(result.acceleratingVoltageVolts).toBe(1500);
    expect(result.rasterLinePct).toBeCloseTo(100 / 60, 5);
    expect(result.rasterLineWrapPct).toBe(100);
    expect(
      FrankenSimEngine.stepFarnsworthTv(1.5, deflectionGauss, 500, 120).rasterLinePct,
    ).toBeCloseTo(100 / 120, 5);
    expect(result.schematicCathodeR).toBe(28);
    expect(result.schematicEnvelopeW).toBe(290);
    expect(result.schematicDeflectorW).toBe(70);
    expect(result.schematicCollectorX).toBe(300);
    expect(result.horizontalSourceOmegaRadPerSec).toBeCloseTo(2 * Math.PI * 15_750, 8);
    expect(result.verticalSourceOmegaRadPerSec).toBeCloseTo(2 * Math.PI * 60, 8);
    expect(result.horizontalDisplayOmegaRadPerSec).toBeCloseTo(2 * Math.PI * 2, 8);
    expect(result.verticalDisplayOmegaRadPerSec).toBeCloseTo(2 * Math.PI * 0.25, 8);
    expect(result.scanLines).toBe(60);
    expect(result.scanAmp).toBe(0.9);
    expect(result.beamPathSpanX).toBe(8);
  });

  test("replays one bounded scan frame across raster, field, and 3D deflection", () => {
    const beam = FrankenSimEngine.stepFarnsworthTv(1.5, 120, 500, 60);
    const changedHorizontalBeam = FrankenSimEngine.stepFarnsworthTv(1.5, 120, 500, 60, 22, 60);
    const changedVerticalBeam = FrankenSimEngine.stepFarnsworthTv(1.5, 120, 500, 60, 15.75, 90);
    const denserRasterBeam = FrankenSimEngine.stepFarnsworthTv(1.5, 120, 500, 120);
    const first = stepFarnsworthRasterFrame(beam, 0.875);
    const replay = stepFarnsworthRasterFrame(beam, 0.875);
    const changedHorizontal = stepFarnsworthRasterFrame(changedHorizontalBeam, 0.875);
    const changedVertical = stepFarnsworthRasterFrame(changedVerticalBeam, 0.875);
    const denserRaster = stepFarnsworthRasterFrame(denserRasterBeam, 0.875);

    expect(replay).toEqual(first);
    expect(first.beamFraction).toBeGreaterThanOrEqual(0);
    expect(first.beamFraction).toBeLessThanOrEqual(1);
    expect(first.rasterXPercent).toBeCloseTo(first.beamFraction * 100, 10);
    expect(first.rasterYPercent).toBeGreaterThanOrEqual(0);
    expect(first.rasterYPercent).toBeLessThanOrEqual(100);
    expect(Math.abs(first.horizontalDeflectionUnits)).toBeLessThanOrEqual(beam.scanAmp);
    expect(Math.abs(first.verticalDeflectionUnits)).toBeLessThanOrEqual(beam.scanAmp);
    expect(changedHorizontal.horizontalDeflectionUnits).not.toBe(first.horizontalDeflectionUnits);
    expect(changedVertical.verticalDeflectionUnits).not.toBe(first.verticalDeflectionUnits);
    expect(denserRaster.rasterLineIndex).not.toBe(first.rasterLineIndex);
    expect(denserRaster.rasterYPercent).not.toBe(first.rasterYPercent);

    const baselineField = computeFarnsworthRasterField(
      first.beamFraction,
      16,
      undefined,
      first.rasterYPercent / 100,
    );
    const verticallyShiftedField = computeFarnsworthRasterField(
      changedVertical.beamFraction,
      16,
      undefined,
      changedVertical.rasterYPercent / 100,
    );
    expect(Array.from(verticallyShiftedField)).not.toEqual(Array.from(baselineField));
  });

  test("rewrites the caller-owned raster buffer without allocating a competing field", () => {
    const target = new Float32Array(16 * 16);
    const result = computeFarnsworthRasterField(0.35, 16, target);
    const snapshot = Array.from(result);

    expect(result).toBe(target);
    expect(snapshot.some((value) => value > 0)).toBe(true);
    expect(computeFarnsworthRasterField(0.35, 16, target)).toBe(target);
    expect(Array.from(target)).toEqual(snapshot);
  });

  test("builds and articulates procedural mahogany bench, borosilicate dissector envelope, photocathode disc, and anode aperture correctly", () => {
    const model = buildFarnsworthTvModel();
    expect(model.root.children.length).toBeGreaterThan(0);
    expect(model.tubeGroup).toBeDefined();
    expect(model.photocathode).toBeDefined();
    expect(model.lensBarrel).toBeDefined();
    expect(model.anodeFinger).toBeDefined();
    expect(model.apertureTip).toBeDefined();
    expect(model.focusCoil).toBeDefined();
    expect(model.beamPoints).toBeDefined();

    // Test kinematics update & cutaway mode
    const beam = FrankenSimEngine.stepFarnsworthTv(1.5, 120, 500);
    const frame = stepFarnsworthRasterFrame(beam, 1);
    updateFarnsworthTvKinematics(model, beam, frame, true, true);
    expect(model.beamPoints.visible).toBe(true);
    expect(model.materials.focusCoilMat.opacity).toBe(0.35);
    expect(Array.from(model.beamPos).every(Number.isFinite)).toBe(true);

    const replay = Array.from(model.beamPos);
    updateFarnsworthTvKinematics(model, beam, frame, true, false);
    expect(Array.from(model.beamPos)).toEqual(replay);
    expect(model.materials.focusCoilMat.opacity).toBe(1);

    const laterFrame = stepFarnsworthRasterFrame(beam, 1.1);
    updateFarnsworthTvKinematics(model, beam, laterFrame, true, false);
    expect(Array.from(model.beamPos)).not.toEqual(replay);

    model.dispose();
  });
});
