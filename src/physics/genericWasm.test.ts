import { describe, expect, test } from "bun:test";
import {
  bellWaveCrate,
  cyclicHarmonic,
  cyclicSol,
  cyclicSymmetry,
  delavalCreamCrate,
  edisonHeatCrate,
  fluidFrames,
  gaMotorFrameIndex,
  gaMotorOrbit,
  gatlingClusterCrate,
  genericKernelSource,
  grammeRingCrate,
  heatFrames,
  laplacianModeShape,
  laplacianModes,
  marconiWaveCrate,
  parsonsSteamCrate,
  peltonJetCrate,
  sampleFluidAt,
  sampleHeatAt,
  wakeFluidCrate,
  wave2dFrames,
  waveFrameRms,
  wortHeatCrate,
  wrightBayTensions,
} from "./genericWasm";

describe("generic FrankenSim crate composition", () => {
  test("gaMotorOrbit writes the documented [n, steps, xyz...] layout", () => {
    const n = 8;
    const steps = 12;
    const orbit = gaMotorOrbit(n, steps);
    expect(orbit[0]).toBe(n);
    expect(orbit[1]).toBe(steps);
    expect(orbit.length).toBe(2 + steps * n * 3);
    expect(Number.isFinite(orbit[2])).toBe(true);
    expect(gaMotorOrbit(n, steps)).toBe(orbit);
  });

  test("gaMotorFrameIndex wraps one turn onto the motor tape", () => {
    expect(gaMotorFrameIndex(0, Math.PI * 2, 60)).toBe(0);
    expect(gaMotorFrameIndex(0.5, Math.PI * 2, 60)).toBe(30);
    expect(gaMotorFrameIndex(1, Math.PI * 2, 60)).toBe(0);
  });

  test("heatFrames is frames*n*n and the hot blob is warmer than the cold blob", () => {
    const n = 12;
    const frames = 4;
    const heat = heatFrames(n, frames, 2);
    expect(heat.length).toBe(frames * n * n);
    const hot = sampleHeatAt(heat, n, frames, 0, 0.3, 0.3);
    const cold = sampleHeatAt(heat, n, frames, 0, 0.7, 0.68);
    expect(hot).toBeGreaterThan(cold);
  });

  test("wave2dFrames has a finite RMS on the first snapshot", () => {
    const n = 16;
    const frames = 6;
    const wave = wave2dFrames(n, frames, 2);
    expect(wave.length).toBe(frames * n * n);
    expect(waveFrameRms(wave, n, frames, 0)).toBeGreaterThan(0);
    expect(Number.isFinite(waveFrameRms(wave, n, frames, 3))).toBe(true);
  });

  test("SSR / bun tests stay on the host fallback until a browser loads fs-wasm", () => {
    expect(genericKernelSource()).toBe("unloaded");
  });

  test("cyclicSymmetry writes [n, first_row, rhs, sol, harmonics] and loads sector 0", () => {
    const n = 6;
    const ring = cyclicSymmetry(n, 0.5);
    expect(ring[0]).toBe(n);
    expect(ring.length).toBe(1 + 4 * n);
    expect(ring[1]).toBeCloseTo(2.5, 6);
    expect(cyclicSol(ring, 0)).toBeGreaterThan(cyclicSol(ring, 3));
    expect(cyclicHarmonic(ring, 0)).toBeGreaterThan(0);
  });

  test("laplacianModes has ascending eigenvalues and a peaked first sine mode", () => {
    const n = 17;
    const k = 3;
    const modes = laplacianModes(n, k);
    expect(modes.length).toBe(k + k * n);
    expect(modes[0]).toBeLessThan(modes[1] ?? 0);
    expect(Math.abs(laplacianModeShape(modes, n, k, 0, 8))).toBeGreaterThan(
      Math.abs(laplacianModeShape(modes, n, k, 0, 0)),
    );
  });

  test("wrightBayTensions puts more load on the high-AoA bay", () => {
    const pos = wrightBayTensions(2200, 12);
    const neg = wrightBayTensions(2200, -12);
    expect(pos.leftBayTension).toBeGreaterThan(pos.rightBayTension);
    expect(neg.rightBayTension).toBeGreaterThan(neg.leftBayTension);
  });

  test("fluidFrames is frames*n*n and the jet source is denser than the far field", () => {
    const n = 16;
    const frames = 4;
    const fluid = fluidFrames(n, frames);
    expect(fluid.length).toBe(frames * n * n);
    const src = sampleFluidAt(fluid, n, frames, 3, 0.25, 0.95);
    const far = sampleFluidAt(fluid, n, frames, 3, 0.85, 0.1);
    expect(src).toBeGreaterThan(far);
  });

  test("shared crate seats write finite named fields for 2D/3D/schematic", () => {
    expect(peltonJetCrate(450).jetCrateDensity).toBeGreaterThan(0);
    expect(parsonsSteamCrate(3000).steamCrateDensity).toBeGreaterThanOrEqual(0);
    expect(Number.isFinite(edisonHeatCrate(110).filamentHeatSample)).toBe(true);
    expect(marconiWaveCrate(0.85).sparkWaveRms).toBeGreaterThan(0);
    expect(bellWaveCrate(440).acousticWaveRms).toBeGreaterThan(0);
    const cream = delavalCreamCrate(6500);
    expect(cream.creamCrateDensity).toBeGreaterThanOrEqual(0);
    expect(cream.skimCrateDensity).toBeGreaterThanOrEqual(0);
    expect(Number.isFinite(gatlingClusterCrate(6, 60).clusterHarmonicH1)).toBe(true);
    expect(Number.isFinite(grammeRingCrate(36, 1).ringHarmonicH1)).toBe(true);
    expect(Number.isFinite(wortHeatCrate(22).wortHeatSample)).toBe(true);
    expect(wakeFluidCrate(120).wakeCrateDensity).toBeGreaterThanOrEqual(0);
  });
});
