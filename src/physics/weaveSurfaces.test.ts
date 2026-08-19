import { describe, expect, test } from "bun:test";
import {
  coupleLinks,
  datedScenarios,
  fidelityField,
  intervalGhosts,
  kittyHawkResidual,
  materialProbe,
  mmsResidual,
  smokePolicy,
  spectralModes,
  whitneySamples,
} from "./weaveSurfaces";

describe("FrankenSim Weave Surfaces Boundary", () => {
  test("computes material probes for representative patents", () => {
    const wrightProbe = materialProbe("us-821393-wright-flyer", "wing", {
      airspeed: 30,
      wingWarp: 4,
    });
    expect(wrightProbe).toBeDefined();
    expect(wrightProbe?.material).toContain("muslin");

    const teslaProbe = materialProbe("us-381968-tesla-motor", "stator", { frequencyHz: 60 });
    expect(teslaProbe).toBeDefined();
    expect(teslaProbe?.qty).toBeDefined();

    const fermiProbe = materialProbe("us-2708656-fermi-reactor", "graphite", {
      rodInsertionPct: 50,
    });
    expect(fermiProbe).toBeDefined();
    expect(fermiProbe?.material.toLowerCase()).toContain("graphite");
  });

  test("computes interval ghosts for bounded SI physics quantities", () => {
    const wrightGhosts = intervalGhosts("us-821393-wright-flyer", { airspeed: 30, wingWarp: 5 });
    expect(wrightGhosts.length).toBeGreaterThan(0);
    for (const g of wrightGhosts) {
      expect(g.label).toBeDefined();
      expect(g.max).toBeGreaterThanOrEqual(g.min);
      expect(g.unit).toBeDefined();
    }

    const fermiGhosts = intervalGhosts("us-2708656-fermi-reactor", { rodInsertionPct: 40 });
    expect(fermiGhosts.length).toBeGreaterThan(0);
    expect(fermiGhosts[0].live).toBeGreaterThan(0);
  });

  test("computes fidelity fields and discrepancy bounds", () => {
    const wrightFidelity = fidelityField("us-821393-wright-flyer", { airspeed: 30 });
    expect(wrightFidelity).toBeDefined();
    expect(wrightFidelity?.part).toBeDefined();
    expect(wrightFidelity?.residual).toBeDefined();

    const teslaFidelity = fidelityField("us-381968-tesla-motor", { frequencyHz: 60 });
    expect(teslaFidelity).toBeDefined();
  });

  test("enforces refusal policy on unphysical visual smoke", () => {
    const spencerLow = smokePolicy("us-2495429-spencer-microwave", { rfPowerSetting: 100 });
    expect(spencerLow).toBeDefined();
    expect(spencerLow.allowed).toBe(false);

    const spencerHigh = smokePolicy("us-2495429-spencer-microwave", { rfPowerSetting: 800 });
    expect(spencerHigh.allowed).toBe(true);
  });

  test("computes spectral eigenmodes for resonant patents", () => {
    const marconiModes = spectralModes("us-586193-marconi-radio", { aerialHeightMeters: 45 });
    expect(marconiModes.length).toBeGreaterThan(0);
    expect(marconiModes[0].freqHz).toBeGreaterThan(0);

    const teslaCoilModes = spectralModes("us-593138-tesla-coil", { secondaryTurns: 1000 });
    expect(teslaCoilModes.length).toBeGreaterThan(0);
  });

  test("returns authentic dated scenario flight and test cards", () => {
    const wrightScenarios = datedScenarios("us-821393-wright-flyer");
    expect(wrightScenarios.length).toBeGreaterThan(0);
    expect(wrightScenarios[0].date).toContain("1903");

    const fermiScenarios = datedScenarios("us-2708656-fermi-reactor");
    expect(fermiScenarios.length).toBeGreaterThan(0);
    expect(fermiScenarios[0].date).toContain("1942");
  });

  test("evaluates cross-patent Dirac coupling power links", () => {
    const wrightCouples = coupleLinks("us-821393-wright-flyer", { airspeed: 30 });
    expect(wrightCouples.length).toBeGreaterThan(0);

    const bulbCouples = coupleLinks("us-223898-edison-lightbulb", { voltage: 110 });
    expect(bulbCouples.length).toBeGreaterThan(0);
  });

  test("computes Kitty Hawk 1903 empirical flight residuals", () => {
    const residual = kittyHawkResidual({ airspeed: 30, wingWarp: 0 });
    expect(residual.liveMph).toBe(30);
    expect(residual.histMph).toBe(30);
    expect(residual.histLiftN).toBeGreaterThan(3000);
  });

  test("computes Whitney discrete 1-form stator field samples", () => {
    const samples = whitneySamples(Math.PI / 4);
    expect(samples.length).toBe(8);
    expect(samples[0].bx).toBeDefined();
    expect(samples[0].by).toBeDefined();
  });

  test("computes manufactured solution residuals on schematics", () => {
    const mms = mmsResidual("us-821393-wright-flyer", { airspeed: 30 });
    expect(mms).toBeDefined();
    expect(mms?.residual).toBeDefined();
  });
});
