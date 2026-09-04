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
    expect(teslaProbe).toMatchObject({
      material:
        "Fig. 9 annulus R, four insulated-wire coils, disk D, generator G, and L/L′ circuits",
      qty: "n_D",
      value: "3600",
      unit: "rpm",
    });
    expect(teslaProbe?.note).toContain("Generator 3600 rpm");
    expect(teslaProbe?.note).toContain("n_D = n_G");
    expect(materialProbe("us-381968-tesla-motor", "stator", { frequency: 40 })?.value).toBe("2400");

    const fermiProbe = materialProbe("us-2708656-fermi-reactor", "graphite", {
      rodInsertionPct: 50,
    });
    expect(fermiProbe).toBeDefined();
    expect(fermiProbe?.material.toLowerCase()).toContain("graphite");

    const coltProbe = materialProbe("us-x9430-colt-revolver", "ratchet and shackle", {
      cockingTravelPct: 100,
      chamberIndex: 1,
    });
    expect(coltProbe).toMatchObject({
      qty: "lockwork stage",
      value: "full cock locked",
      unit: "source order",
    });
    expect(coltProbe?.note).toContain("Ratchet 100%");
    expect(coltProbe?.note).not.toContain("MPa");
  });

  test("computes interval ghosts for bounded SI physics quantities", () => {
    const wrightGhosts = intervalGhosts("us-821393-wright-flyer", { airspeed: 30, wingWarp: 5 });
    expect(wrightGhosts.length).toBeGreaterThan(0);
    for (const g of wrightGhosts) {
      expect(g.label).toBeDefined();
      expect(g.max).toBeGreaterThanOrEqual(g.min);
      expect(g.unit).toBeDefined();
    }

    const fermiGhosts = intervalGhosts("us-2708656-fermi-reactor", { rodWithdrawal: 83.5 });
    expect(fermiGhosts[0]?.label).toBe("normalized k_eff");
    expect(fermiGhosts[0]?.max).toBeGreaterThanOrEqual(fermiGhosts[0]?.min ?? 0);
  });

  test("computes fidelity fields and discrepancy bounds", () => {
    const wrightFidelity = fidelityField("us-821393-wright-flyer", { airspeed: 30 });
    expect(wrightFidelity).toBeDefined();
    expect(wrightFidelity?.part).toBeDefined();
    expect(wrightFidelity?.residual).toBeDefined();

    expect(fidelityField("us-381968-tesla-motor", { frequencyHz: 60 })).toMatchObject({
      part: "Fig. 9 disk vs generator",
      model: "3600",
      reference: "3600",
      residual: "0",
      unit: "rpm",
    });
    expect(intervalGhosts("us-381968-tesla-motor", { frequency: 60 })).toEqual([
      { label: "Disk", min: 1200, max: 7200, live: 3600, unit: "rpm" },
      { label: "B", min: 0.3, max: 1, live: 1, unit: "" },
    ]);
  });

  test("enforces refusal policy on unphysical visual smoke", () => {
    const spencerLow = smokePolicy("us-2495429-spencer-microwave", { rfPowerSetting: 100 });
    expect(spencerLow).toBeDefined();
    expect(spencerLow.allowed).toBe(false);

    const spencerHigh = smokePolicy("us-2495429-spencer-microwave", { rfPowerSetting: 800 });
    expect(spencerHigh.allowed).toBe(false);
    expect(spencerHigh.reason).toContain("does not quantify a plume");

    const goddard = smokePolicy("us-1102653-goddard-rocket", {});
    expect(goddard.allowed).toBe(true);
    expect(goddard.reason).toContain("de Laval exhaust");
  });

  test("drains Goddard US 1,102,653 weave surfaces from the de Laval kernel", () => {
    const probe = materialProbe("us-1102653-goddard-rocket", "Tapered tube 11", {
      chamberPressure: 350,
      expansionRatio: 3.5,
    });
    expect(probe).toMatchObject({
      qty: "v_e",
      unit: "m/s",
    });
    expect(probe?.note).toContain("lbf");
    const ghosts = intervalGhosts("us-1102653-goddard-rocket", {
      chamberPressure: 350,
      expansionRatio: 3.5,
    });
    expect(ghosts[0]?.label).toBe("v_e");
    expect(ghosts[0]?.unit).toBe("m/s");
    expect(fidelityField("us-1102653-goddard-rocket", { chamberPressure: 350 })).toMatchObject({
      unit: "",
    });
  });

  test("keeps Noyce US 2,981,877 weave surfaces inside the source topology boundary", () => {
    const probe = materialProbe("us-2981877-noyce-ic", "Lead across junction", {
      oxideThicknessUm: 1,
      leadStripWidthFraction: 0.12,
    });
    expect(probe).toMatchObject({
      qty: "t_ox",
      unit: "µm",
    });
    expect(probe?.note).toContain("Electrical performance is refused");
    expect(
      intervalGhosts("us-2981877-noyce-ic", {
        oxideThicknessUm: 1,
        leadStripWidthFraction: 0.12,
      }),
    ).toEqual([
      { label: "t_ox", min: 0.5, max: 2, live: 1, unit: "µm" },
      { label: "w_lead", min: 0.08, max: 0.28, live: 0.12, unit: "span fraction" },
    ]);
    expect(fidelityField("us-2981877-noyce-ic", { oxideThicknessUm: 1 })).toMatchObject({
      model: "1000",
      reference: "1000–2000",
      residual: "within source range",
      unit: "nm",
    });
    expect(datedScenarios("us-2981877-noyce-ic")).toEqual([
      {
        id: "noyce-filing-1959",
        date: "1959-07-30",
        name: "Filed semiconductor device-and-lead structure",
        writes: { oxideThicknessUm: 1, leadStripWidthFraction: 0.12 },
      },
    ]);
  });

  test("keeps Kilby US 3,138,743 weave surfaces inside its printed construction", () => {
    expect(
      intervalGhosts("us-3138743-kilby-integrated-circuit", {
        sectionRevealFraction: 0.25,
        wireArchFraction: 0.7,
      }),
    ).toEqual([
      { label: "section reveal", min: 0, max: 1, live: 0.25, unit: "fraction" },
      { label: "wire 70 arch", min: 0.2, max: 1, live: 0.7, unit: "fraction" },
    ]);
    expect(fidelityField("us-3138743-kilby-integrated-circuit", {})).toMatchObject({
      part: "Figure 6a wafer dimensions",
      model: "0.200 × 0.080 × 0.0025",
      reference: "0.200 × 0.080 × 0.0025",
      residual: "0",
    });
    expect(datedScenarios("us-3138743-kilby-integrated-circuit")).toEqual([
      {
        id: "kilby-application-1959",
        date: "1959-02-06",
        name: "US 3,138,743 application: Figure 6a source construction",
        writes: { sectionRevealFraction: 0, wireArchFraction: 0.55 },
      },
    ]);
    expect(coupleLinks("us-3138743-kilby-integrated-circuit", {})).toEqual([]);
  });

  test("drains Carrier US 808,897 weave surfaces from the spray-dew-point kernel", () => {
    const probe = materialProbe("us-808897-carrier-air-conditioner", "Separator plate", {
      inletTempC: 35,
      inletRhPct: 75,
      sprayWaterTempC: 8,
      reheatTempC: 22,
      airflowCfm: 15000,
    });
    expect(probe).toMatchObject({
      qty: "T_dp",
      unit: "°C",
    });
    expect(probe?.note).toContain("g/kg extracted");
    expect(
      intervalGhosts("us-808897-carrier-air-conditioner", {
        inletTempC: 35,
        inletRhPct: 75,
        sprayWaterTempC: 8,
      }),
    ).toMatchObject([
      { label: "T_dp", unit: "°C" },
      { label: "Δω", unit: "g/kg" },
    ]);
    expect(fidelityField("us-808897-carrier-air-conditioner", { reheatTempC: 22 })).toMatchObject({
      unit: "%",
    });
    expect(datedScenarios("us-808897-carrier-air-conditioner")[0]?.writes).toMatchObject({
      sprayRatePct: 60,
      airflowCfm: 15000,
    });
  });

  test("drains restored-patent weave surfaces from the shared kernels", () => {
    expect(materialProbe("us-608969-parsons-turbine", "Reversing turbine", {})?.qty).toBe(
      "P_shaft",
    );
    expect(intervalGhosts("us-608969-parsons-turbine", {})[0]?.label).toBe("Shaft");
    expect(datedScenarios("us-608969-parsons-turbine")[0]?.writes).toMatchObject({
      rotorRpm: 3000,
    });

    expect(materialProbe("us-3858232-boyle-smith-ccd", "Storage medium", {})).toMatchObject({
      qty: "Claim 1 medium",
      value: "continuous",
      unit: "single conductivity type",
    });
    expect(intervalGhosts("us-3858232-boyle-smith-ccd", {})[0]).toMatchObject({
      label: "Pulse overlap",
      unit: "t_p / delta-t",
    });
    expect(fidelityField("us-3858232-boyle-smith-ccd", {})).toMatchObject({
      part: "Figure 3 pulse-overlap inequality",
      reference: "> 0.333",
      unit: "t_p / delta-t",
    });
    expect(datedScenarios("us-3858232-boyle-smith-ccd")[0]).toMatchObject({
      id: "us-3858232-figure-3-source-sequence",
      writes: {
        clockStepRateHz: 1.2,
        pulseWidthToStepRatio: 0.5,
        pulseDepthNormalized: 0.78,
      },
    });
    expect(coupleLinks("us-3858232-boyle-smith-ccd", {})).toEqual([]);

    expect(materialProbe("us-3671542-kwolek-kevlar", "Dope", {})).toBeNull();
    expect(intervalGhosts("us-3671542-kwolek-kevlar", {})).toEqual([]);
    expect(fidelityField("us-3671542-kwolek-kevlar", {})).toBeNull();
    expect(coupleLinks("us-3671542-kwolek-kevlar", {})).toEqual([]);

    expect(materialProbe("us-542846-diesel-engine", "Claim 1 process", {})).toBeNull();
    expect(intervalGhosts("us-542846-diesel-engine", {})[0]?.unit).toBe(":1");
    expect(fidelityField("us-542846-diesel-engine", {})?.reference).toBe("26.2");
    expect(datedScenarios("us-542846-diesel-engine")[0]?.id).toBe("augsburg-1897");

    expect(materialProbe("us-586193-marconi-radio", "Contact receiver", {})?.qty).toBe("I_tube");
    expect(intervalGhosts("us-586193-marconi-radio", {})[0]?.label).toBe("Aerial");
    expect(spectralModes("us-586193-marconi-radio", {})).toEqual([]);
    expect(datedScenarios("us-586193-marconi-radio")[0]?.id).toBe("poldhu-1901-12-12");

    expect(materialProbe("us-2292387-lamarr-frequency-hopping", "Record strip", {})?.qty).toBe(
      "G_p",
    );
    expect(intervalGhosts("us-2292387-lamarr-frequency-hopping", {})[0]?.label).toBe("G_p");
    expect(fidelityField("us-2292387-lamarr-frequency-hopping", {})?.reference).toBe("88");
    expect(datedScenarios("us-2292387-lamarr-frequency-hopping")[0]?.writes).toMatchObject({
      channels: 88,
    });

    expect(materialProbe("us-2708656-fermi-reactor", "Lattice", {})?.qty).toBe("Claim 1 lattice");
    expect(intervalGhosts("us-2708656-fermi-reactor", {})[0]?.label).toBe("normalized k_eff");
    expect(fidelityField("us-2708656-fermi-reactor", {})?.reference).toBe("source-bounded");
    expect(datedScenarios("us-2708656-fermi-reactor")[0]?.id).toBe("patent-bare-ratio-example");

    expect(materialProbe("us-200521-edison-phonograph", "Cylinder A", {})?.qty).toBe("groove");
    expect(intervalGhosts("us-200521-edison-phonograph", {})[0]?.label).toBe("Groove");
    expect(datedScenarios("us-200521-edison-phonograph")[0]?.id).toBe("menlo-1877");

    expect(materialProbe("us-3541541-engelbart-mouse", "Position wheel", {})?.qty).toBe("ω");
    expect(intervalGhosts("us-3541541-engelbart-mouse", {})[0]?.unit).toBe("rad/s");
    expect(fidelityField("us-3541541-engelbart-mouse", {})).toEqual({
      part: "Wheel dimension and resolution",
      model: "illustrative scenario",
      reference: "not printed",
      residual: "withheld",
      unit: "source boundary",
    });
    expect(datedScenarios("us-3541541-engelbart-mouse")[0]?.id).toBe("sri-1968-12-09");

    expect(materialProbe("us-313224-mergenthaler-linotype", "Matrix-bar", {})?.qty).toBe("cycle");
    expect(intervalGhosts("us-313224-mergenthaler-linotype", {})[0]?.label).toBe("Cycle");
    expect(datedScenarios("us-313224-mergenthaler-linotype")[0]?.writes).toMatchObject({
      potTemp: 260,
    });

    expect(materialProbe("us-395781-hollerith-tabulating", "Record card", {})?.qty).toBe("cycle");
    expect(intervalGhosts("us-395781-hollerith-tabulating", {})[0]?.unit).toBe("ms");
  });

  test("computes spectral eigenmodes for resonant patents", () => {
    const teslaCoilModes = spectralModes("us-593138-tesla-coil", {
      disturbanceFrequencyHz: 925,
      secondaryLengthMiles: 50,
    });
    expect(teslaCoilModes.length).toBeGreaterThan(0);
  });

  test("returns authentic dated scenario flight and test cards", () => {
    const wrightScenarios = datedScenarios("us-821393-wright-flyer");
    expect(wrightScenarios.length).toBeGreaterThan(0);
    expect(wrightScenarios[0].date).toContain("1903");

    expect(datedScenarios("us-2708656-fermi-reactor")[0]?.id).toBe("patent-bare-ratio-example");
  });

  test("evaluates cross-patent Dirac coupling power links", () => {
    const wrightCouples = coupleLinks("us-821393-wright-flyer", { airspeed: 30 });
    expect(wrightCouples.length).toBeGreaterThan(0);

    const bulbCouples = coupleLinks("us-223898-edison-lightbulb", { voltage: 110 });
    expect(bulbCouples.length).toBeGreaterThan(0);

    expect(coupleLinks("us-381968-tesla-motor", { frequency: 60 })[0]?.from).toBe(
      "polyphase stator",
    );
    expect(coupleLinks("us-593138-tesla-coil", {})).toEqual([]);
    expect(coupleLinks("us-132-davenport-electric-motor", {}).length).toBe(1);
    expect(coupleLinks("us-347140-thomson-welding", {})[0]?.from).toBe("I²R");
    expect(coupleLinks("us-233692-pelton-water-wheel", {})[0]?.from).toBe("water jet");
    expect(coupleLinks("us-470918-reno-escalator", {})).toEqual([]);
    expect(coupleLinks("us-319596-maxim-machine-gun", {})[0]?.from).toBe("muzzle_gas");
    expect(coupleLinks("us-588-ericsson-propeller", {})[0]?.from).toBe("thrust · v");
    expect(coupleLinks("us-586193-marconi-radio", {})).toEqual([]);
    expect(coupleLinks("us-808897-carrier-air-conditioner", {})[0]?.from).toBe("fan");
    expect(coupleLinks("us-2708656-fermi-reactor", {})).toEqual([]);
    expect(coupleLinks("us-608969-parsons-turbine", {})[0]?.from).toBe("steam");
    expect(coupleLinks("us-400766-hall-aluminium", {})[0]?.from).toBe("bus");
    expect(coupleLinks("us-879532-de-forest-audion", {})[0]?.from).toBe("filament");
    expect(coupleLinks("us-307031-edison-indicator", {})[0]?.from).toBe("filament heat");
    expect(coupleLinks("us-361931-daimler-engine", {})).toEqual([]);
    expect(coupleLinks("gb-913-watt-separate-condenser", {})[0]?.from).toBe("furnace");
  });

  test("keeps Daimler weaves on source controls and source apparatus labels", () => {
    expect(intervalGhosts("us-361931-daimler-engine", {}).length).toBeGreaterThan(0);
    expect(intervalGhosts("us-361931-daimler-engine", {})[0]).toMatchObject({
      label: "Drive",
      live: 1,
      unit: "astern / neutral / ahead",
    });
    expect(datedScenarios("us-361931-daimler-engine")).toEqual([]);
    expect(materialProbe("us-361931-daimler-engine", "coupling", {})).toMatchObject({
      part: "coupling",
      qty: "source",
      value: "not stated",
      unit: "no numerical material or performance data",
    });
  });

  test("keeps Edison telemetry free of unsupported efficacy and life demonstrations", () => {
    const patentId = "us-223898-edison-lightbulb";
    expect(fidelityField(patentId, { voltage: 110, filamentLength: 22 })).toBeNull();
    expect(datedScenarios(patentId)).toEqual([]);
  });

  test("refuses to invent a watt-valued Howe hand-crank coupling", () => {
    expect(coupleLinks("us-4750-howe-sewing-machine", { crankRpm: 240 })).toEqual([]);
  });

  test("derives Pelton performance weaves and source bucket labels", () => {
    expect(intervalGhosts("us-233692-pelton-water-wheel", {}).length).toBeGreaterThan(0);
    expect(fidelityField("us-233692-pelton-water-wheel", {})).toBeNull();
    expect(datedScenarios("us-233692-pelton-water-wheel").length).toBeGreaterThan(0);
    expect(materialProbe("us-233692-pelton-water-wheel", "bucket B", {})).toMatchObject({
      part: "bucket B",
      qty: "source",
      value: "not stated",
      unit: "no numerical material or performance data",
    });
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
