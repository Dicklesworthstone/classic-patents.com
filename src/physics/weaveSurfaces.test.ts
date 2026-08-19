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

    expect(intervalGhosts("us-2708656-fermi-reactor", { rodInsertionPct: 40 })).toEqual([]);
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

    const goddard = smokePolicy("us-1102653-goddard-rocket", {});
    expect(goddard.allowed).toBe(false);
    expect(goddard.reason).toContain("no numerical exhaust performance");
  });

  test("keeps Goddard US 1,102,653 source probes free of inherited liquid-rocket telemetry", () => {
    const probe = materialProbe("us-1102653-goddard-rocket", "Tapered tube 11", {});
    expect(probe).toMatchObject({
      material: "Solid explosive disks and tapered discharge tube",
      qty: "Claim 2",
      value: "L ≥ 3D",
      unit: "minimum geometry",
    });
    expect(probe?.note).toContain("no material, pressure, exhaust-speed, or thrust value");
    expect(intervalGhosts("us-1102653-goddard-rocket", {})).toEqual([]);
  });

  test("keeps Noyce US 2,981,877 weave surfaces on the printed oxide-and-lead relation", () => {
    const probe = materialProbe("us-2981877-noyce-ic", "Lead across junction", {});
    expect(probe).toMatchObject({
      material: "Oxide of the semiconductor supporting an adherent metal strip",
      qty: "Claim 1",
      value: "insulated crossing",
      unit: "source relation",
    });
    expect(probe?.note).toContain("no depletion width, breakdown voltage, capacitance, clock rate");
    expect(intervalGhosts("us-2981877-noyce-ic", { sourceFocus: 4 })).toEqual([
      { label: "Source Fig.", min: 1, max: 4, live: 4, unit: "guide selection" },
    ]);
    expect(fidelityField("us-2981877-noyce-ic", {})).toMatchObject({
      model: "not computed",
      unit: "source boundary",
    });
    expect(datedScenarios("us-2981877-noyce-ic")).toEqual([
      {
        id: "noyce-filing-1959",
        date: "1959-07-30",
        name: "Filed semiconductor device-and-lead structure",
        writes: { sourceFocus: 1 },
      },
    ]);
  });

  test("keeps Carrier US 808,897 weave surfaces on the printed wet-plate relation", () => {
    const probe = materialProbe("us-808897-carrier-air-conditioner", "Separator plate", {});
    expect(probe).toMatchObject({
      material: "Wet sinuous separator plates with rear flanges and gutters",
      qty: "Claim 1",
      value: "front wet / rear separation",
      unit: "source relation",
    });
    expect(probe?.note).toContain("not a chilled-water temperature, dew point, air-flow rate");
    expect(intervalGhosts("us-808897-carrier-air-conditioner", { sourceFocus: 2 })).toEqual([
      { label: "Source relation", min: 1, max: 3, live: 2, unit: "guide selection" },
    ]);
    expect(fidelityField("us-808897-carrier-air-conditioner", {})).toMatchObject({
      model: "not computed",
      unit: "source boundary",
    });
    expect(datedScenarios("us-808897-carrier-air-conditioner")).toEqual([
      {
        id: "carrier-filing-1904",
        date: "1904-09-16",
        name: "Filed air-purifying separator apparatus",
        writes: { sourceFocus: 1 },
      },
    ]);
  });

  test("keeps Parsons US 608,969 weave surfaces on the printed marine-routing relation", () => {
    const probe = materialProbe("us-608969-parsons-turbine", "Reversing turbine", {});
    expect(probe).toMatchObject({
      material: "Screw-shafts, turbine sets, and selectable steam-routing pipes and valves",
      qty: "Claim 1",
      value: "series / parallel selection",
      unit: "source relation",
    });
    expect(probe?.note).toContain("not a blade profile, pressure, rotor speed, stage count");
    expect(intervalGhosts("us-608969-parsons-turbine", { sourceFocus: 3 })).toEqual([
      { label: "Source arrangement", min: 1, max: 3, live: 3, unit: "guide selection" },
    ]);
    expect(datedScenarios("us-608969-parsons-turbine")).toEqual([
      {
        id: "parsons-filing-1898",
        date: "1898-03-04",
        name: "Filed marine turbine-connection arrangement",
        writes: { sourceFocus: 1 },
      },
    ]);
  });

  test("keeps Boyle-Smith US 3,858,232 weave surfaces on the withheld source boundary", () => {
    const probe = materialProbe("us-3858232-boyle-smith-ccd", "Storage minimum", {});
    expect(probe).toMatchObject({
      material:
        "Semiconductor storage medium with sequentially established potential-energy minima",
      qty: "Claim 2",
      value: "stored charge → adjacent minimum",
      unit: "source relation",
    });
    expect(probe?.note).toContain("original-text face is withheld");
    expect(intervalGhosts("us-3858232-boyle-smith-ccd", { sourceFocus: 2 })).toEqual([
      { label: "Source group", min: 1, max: 3, live: 2, unit: "guide selection" },
    ]);
    expect(fidelityField("us-3858232-boyle-smith-ccd", {})).toMatchObject({
      model: "not computed",
      unit: "source boundary",
    });
    expect(datedScenarios("us-3858232-boyle-smith-ccd")).toEqual([
      {
        id: "boyle-smith-filing-1971",
        date: "1971-11-09",
        name: "Filed information-storage device",
        writes: { sourceFocus: 1 },
      },
    ]);
    expect(coupleLinks("us-3858232-boyle-smith-ccd", {})).toEqual([]);
  });

  test("keeps Kwolek US 3,671,542 weave surfaces on the incomplete-edition boundary", () => {
    const probe = materialProbe("us-3671542-kwolek-kevlar", "Dope", {});
    expect(probe).toMatchObject({
      material: "Carbocyclic aromatic polyamide dope in a selected liquid medium",
      qty: "Claim 1",
      value: "optically anisotropic dope",
      unit: "source relation",
    });
    expect(probe?.note).toContain("manual source edition is withheld");
    expect(probe?.note).toContain("strength, modulus, density, thermal limit");
    expect(intervalGhosts("us-3671542-kwolek-kevlar", {})).toEqual([]);
    expect(fidelityField("us-3671542-kwolek-kevlar", {})).toBeNull();
    expect(datedScenarios("us-3671542-kwolek-kevlar")).toEqual([]);
    expect(coupleLinks("us-3671542-kwolek-kevlar", {})).toEqual([]);
  });

  test("keeps Marconi US 586,193 on its reviewed receiver-and-reset boundary", () => {
    const probe = materialProbe("us-586193-marconi-radio", "Contact receiver", {});
    expect(probe).toMatchObject({
      material: "Imperfect electrical contact, local circuit, and shaking means",
      qty: "Claim 1",
      value: "received oscillations → resettable contact",
      unit: "source relation",
    });
    expect(probe?.note).toContain("independent publication review");
    expect(intervalGhosts("us-586193-marconi-radio", {})).toEqual([]);
    expect(fidelityField("us-586193-marconi-radio", {})).toMatchObject({
      model: "not computed",
      unit: "source boundary",
    });
    expect(spectralModes("us-586193-marconi-radio", {})).toEqual([]);
    expect(datedScenarios("us-586193-marconi-radio")).toEqual([]);
    expect(coupleLinks("us-586193-marconi-radio", {})).toEqual([]);
  });

  test("keeps Lamarr US 2,292,387 on its reviewed matched-record boundary", () => {
    const probe = materialProbe("us-2292387-lamarr-frequency-hopping", "Record strip", {});
    expect(probe).toMatchObject({
      material: "Matched record strips and record-actuated tuning means",
      qty: "Claim 1",
      value: "synchronous strip motion → maintained tuning",
      unit: "source relation",
    });
    expect(probe?.note).toContain("independent publication review");
    expect(intervalGhosts("us-2292387-lamarr-frequency-hopping", {})).toEqual([]);
    expect(fidelityField("us-2292387-lamarr-frequency-hopping", {})).toMatchObject({
      model: "not computed",
      unit: "source boundary",
    });
    expect(datedScenarios("us-2292387-lamarr-frequency-hopping")).toEqual([]);
    expect(coupleLinks("us-2292387-lamarr-frequency-hopping", {})).toEqual([]);
  });

  test("keeps Fermi US 2,708,656 on its held Claim 1 contour boundary", () => {
    expect(materialProbe("us-2708656-fermi-reactor", "Lattice", {})).toMatchObject({
      qty: "Claim 1",
      value: "figure-defined lattice relation",
      unit: "source relation",
    });
    expect(intervalGhosts("us-2708656-fermi-reactor", {})).toEqual([]);
    expect(fidelityField("us-2708656-fermi-reactor", {})).toMatchObject({
      model: "not computed",
      unit: "source boundary",
    });
    expect(datedScenarios("us-2708656-fermi-reactor")).toEqual([]);
    expect(coupleLinks("us-2708656-fermi-reactor", {})).toEqual([]);
  });

  test("keeps Engelbart US 3,541,541 on its held two-wheel source boundary", () => {
    const probe = materialProbe("us-3541541-engelbart-mouse", "Position wheel", {});
    expect(probe).toMatchObject({
      material: "Perpendicular position wheels, transducer means, and flexible conductor",
      qty: "Claim 1",
      value: "apparatus relation",
      unit: "source guide",
    });
    expect(probe?.note).toContain("no wheel material, radius, friction, resolution");
    expect(intervalGhosts("us-3541541-engelbart-mouse", { sourceFocus: 3 })).toEqual([
      { label: "Source group", min: 1, max: 3, live: 3, unit: "facsimile guide" },
    ]);
    expect(fidelityField("us-3541541-engelbart-mouse", {})).toMatchObject({
      model: "not computed",
      unit: "source boundary",
    });
    expect(datedScenarios("us-3541541-engelbart-mouse")).toEqual([
      {
        id: "engelbart-filing-1967",
        date: "1967-06-21",
        name: "Filed X-Y position indicator",
        writes: { sourceFocus: 1 },
      },
    ]);
    expect(coupleLinks("us-3541541-engelbart-mouse", {})).toEqual([]);
  });

  test("computes spectral eigenmodes for resonant patents", () => {
    const teslaCoilModes = spectralModes("us-593138-tesla-coil", { secondaryTurns: 1000 });
    expect(teslaCoilModes.length).toBeGreaterThan(0);
  });

  test("returns authentic dated scenario flight and test cards", () => {
    const wrightScenarios = datedScenarios("us-821393-wright-flyer");
    expect(wrightScenarios.length).toBeGreaterThan(0);
    expect(wrightScenarios[0].date).toContain("1903");

    expect(datedScenarios("us-2708656-fermi-reactor")).toEqual([]);
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
