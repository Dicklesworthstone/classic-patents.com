import { describe, expect, test } from "bun:test";
import {
  HULL_SLA_DEFAULT_CONTROLS,
  stepHullStereolithographySi,
} from "./hullStereolithographyKernel";

describe("US 4,575,330 Charles W. Hull Stereolithography SI Physics Kernel", () => {
  test("computes Beer-Lambert photopolymer cure depth and parabolic line width", () => {
    const controls = { ...HULL_SLA_DEFAULT_CONTROLS };
    const tel = stepHullStereolithographySi(controls);

    expect(tel.isCured).toBe(true);
    expect(tel.peakExposureMJCm2).toBeGreaterThan(controls.criticalExposureMJCm2);
    expect(tel.cureDepthUm).toBeGreaterThan(controls.layerThicknessUm);
    expect(tel.interlayerAdhesionRatio).toBeGreaterThanOrEqual(1.0);
    expect(tel.curedLineWidthUm).toBeGreaterThan(0);
    expect(tel.polymerizationConversionPct).toBeGreaterThan(50);
  });

  test("triggers underexposure refusal when cure depth is less than layer thickness", () => {
    // High scan speed leads to low exposure
    const controls = {
      ...HULL_SLA_DEFAULT_CONTROLS,
      laserScanSpeedMmS: 1500,
      laserPowerMw: 10,
    };
    const tel = stepHullStereolithographySi(controls);

    expect(tel.underexposureRefusal).toBe(true);
    expect(tel.refusalReason).toContain("Underexposure delamination");
  });

  test("triggers overpenetration refusal when cure depth greatly exceeds layer step", () => {
    // Very high power and low speed
    const controls = {
      ...HULL_SLA_DEFAULT_CONTROLS,
      laserPowerMw: 150,
      laserScanSpeedMmS: 50,
      layerThicknessUm: 40,
    };
    const tel = stepHullStereolithographySi(controls);

    expect(tel.overpenetrationRefusal).toBe(true);
    expect(tel.refusalReason).toContain("Overpenetration Z-distortion");
  });

  test("calculates layer build time and viscous resin recoating settling time", () => {
    const controls = { ...HULL_SLA_DEFAULT_CONTROLS, resinViscosityCp: 2000 };
    const tel = stepHullStereolithographySi(controls);

    expect(tel.recoatMeniscusSettlingTimeSec).toBeGreaterThan(3.0);
    expect(tel.layerBuildTimeSec).toBeGreaterThan(tel.recoatMeniscusSettlingTimeSec);
    expect(tel.totalBuildTimeMin).toBeGreaterThan(0);
  });
});
