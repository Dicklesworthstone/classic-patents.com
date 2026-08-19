import { describe, expect, test } from "bun:test";
import { allPatents } from "@/data/patents";
import { PATENT_PHYSICS_REGISTRY } from "./telemetryData";

describe("Physics Telemetry Data Registry", () => {
  test("ensures every catalog patent is registered in PATENT_PHYSICS_REGISTRY", () => {
    for (const patent of allPatents) {
      const entry = PATENT_PHYSICS_REGISTRY[patent.id];
      expect(entry).toBeDefined();
      expect(entry.domain.trim().length).toBeGreaterThan(0);
      expect(entry.domainTitle.trim().length).toBeGreaterThan(0);
      expect(entry.equationName.trim().length).toBeGreaterThan(0);
      expect(entry.governingEquation.trim().length).toBeGreaterThan(0);
      expect(entry.engineMethod.trim().length).toBeGreaterThan(0);
      expect(entry.pedagogicalInsight.trim().length).toBeGreaterThan(20);
      expect(entry.controls.length).toBeGreaterThan(0);
    }
  });

  test("validates physics control sliders bounds and default values", () => {
    for (const [_id, meta] of Object.entries(PATENT_PHYSICS_REGISTRY)) {
      for (const ctrl of meta.controls) {
        expect(ctrl.id.trim().length).toBeGreaterThan(0);
        expect(ctrl.label.trim().length).toBeGreaterThan(0);
        expect(ctrl.min).toBeLessThan(ctrl.max);
        expect(ctrl.step).toBeGreaterThan(0);
        expect(ctrl.defaultValue).toBeGreaterThanOrEqual(ctrl.min);
        expect(ctrl.defaultValue).toBeLessThanOrEqual(ctrl.max);
      }
    }
  });

  test("computes valid real-time physics telemetry metrics for every registered machine", () => {
    for (const [_id, meta] of Object.entries(PATENT_PHYSICS_REGISTRY)) {
      const defaultParams: Record<string, number> = {};
      for (const ctrl of meta.controls) {
        defaultParams[ctrl.id] = ctrl.defaultValue;
      }

      const metrics = meta.computeMetrics(defaultParams);
      expect(metrics).toBeDefined();
      expect(metrics.length).toBeGreaterThan(0);
      for (const m of metrics) {
        expect(m.label.trim().length).toBeGreaterThan(0);
        expect(m.value.trim().length).toBeGreaterThan(0);
        expect(m.badgeColor).toBeDefined();
        if (m.progressPct !== undefined) {
          expect(m.progressPct).toBeGreaterThanOrEqual(0);
          expect(m.progressPct).toBeLessThanOrEqual(100);
        }
      }
    }
  });

  test("Wright Flyer exemplar registers Prandtl induced drag and 3-axis flight controls", () => {
    const wright = PATENT_PHYSICS_REGISTRY["us-821393-wright-flyer"];
    expect(wright).toBeDefined();
    expect(wright.governingEquation).toContain("C_{D_i}");
    expect(wright.controls.some((c) => c.id === "airspeed")).toBe(true);
    expect(wright.controls.some((c) => c.id === "wingWarp")).toBe(true);

    const metrics = wright.computeMetrics({
      airspeed: 28,
      wingWarp: 0,
      elevator: 0,
      coupled: 1,
    });
    expect(metrics.some((m) => m.label.includes("Lift"))).toBe(true);
    expect(metrics.some((m) => m.label.includes("Drag"))).toBe(true);
  });

  test("keeps Edison phonograph telemetry within the quantities printed by US 200,521", () => {
    const edison = PATENT_PHYSICS_REGISTRY["us-200521-edison-phonograph"];
    expect(edison.engineMethod).toContain("illustrative display motion only");
    expect(edison.controls.map((control) => control.unit)).toEqual(["model RPM", "model dB"]);
    expect(edison.computeMetrics({})).toMatchObject([
      { label: "Source Helical Groove Pitch", value: "10", unit: "grooves/in" },
      { label: "Source Shaft Thread Pitch", value: "10", unit: "threads/in" },
      { label: "Named Drive", value: "Clock-work M or other power", unit: "source text" },
    ]);
    expect(edison.pedagogicalInsight).toContain("controls animate reader-aid motion only");
    expect(edison.pedagogicalInsight).toContain(
      "no rate, dimension, diaphragm material, or audio bandwidth",
    );
  });

  test("keeps Ericsson propeller telemetry within the quantities printed by US 588", () => {
    const ericsson = PATENT_PHYSICS_REGISTRY["us-588-ericsson-propeller"];
    expect(ericsson.engineMethod).toContain("illustrative display motion only");
    expect(ericsson.controls.map((control) => control.unit)).toEqual([
      "model RPM",
      "model degrees",
    ]);
    expect(ericsson.computeMetrics({})).toMatchObject([
      { label: "Source Spiral Advance", value: "3", unit: "diameters per turn" },
      { label: "Source Shaft Relation", value: "b opposite a", unit: "lower stated speed" },
      { label: "Source Casing Clearance", value: "about 1/8", unit: "inch" },
    ]);
    expect(ericsson.pedagogicalInsight).toContain(
      "no shaft rate, propeller dimensions, vessel speed",
    );
  });

  test("keeps Goddard US 1,102,653 telemetry at the printed apparatus boundary", () => {
    const goddard = PATENT_PHYSICS_REGISTRY["us-1102653-goddard-rocket"];
    expect(goddard.engineMethod).toContain("No performance engine");
    expect(goddard.governingEquation).toBe("L \\ge 3D");
    expect(goddard.controls.map((control) => control.unit)).toEqual(["source component"]);
    expect(goddard.computeMetrics({ sourceFocus: 3 })).toMatchObject([
      { label: "Claim 2 Tube-Length Floor", value: "at least 3", unit: "longest diameters" },
      { label: "Propelling Charge", value: "explosive disks", unit: "source text" },
      { label: "Highlighted Apparatus", value: "spin-producing passages", unit: "source guide" },
    ]);
    expect(goddard.pedagogicalInsight).toContain("no liquid-propellant cycle");
  });

  test("keeps Noyce US 2,981,877 at the printed oxide-and-lead construction boundary", () => {
    const noyce = PATENT_PHYSICS_REGISTRY["us-2981877-noyce-ic"];
    expect(noyce.engineMethod).toContain("No numerical performance engine");
    expect(noyce.controls.map((control) => control.unit)).toEqual(["source figure"]);
    expect(noyce.computeMetrics({ sourceFocus: 3 })).toMatchObject([
      { label: "Highlighted Source Relation", value: "Fig. 5: equivalent circuit" },
      { label: "Insulating Support", value: "oxide of the semiconductor", unit: "source text" },
      { label: "Illustrated Oxide Thickness", value: "about 1–2", unit: "microns" },
    ]);
    expect(noyce.pedagogicalInsight).toContain("does not supply a voltage, clock rate");
    expect(noyce.pedagogicalInsight).toContain("depletion width, capacitance");
  });

  test("keeps Carrier US 808,897 at the printed wet-plate separator boundary", () => {
    const carrier = PATENT_PHYSICS_REGISTRY["us-808897-carrier-air-conditioner"];
    expect(carrier.engineMethod).toContain("No numerical air-conditioning engine");
    expect(carrier.controls.map((control) => control.unit)).toEqual(["source relationship"]);
    expect(carrier.computeMetrics({ sourceFocus: 2 })).toMatchObject([
      {
        label: "Highlighted Source Relation",
        value: "Figs. 2–4: wet sinuous plates, flanges, and gutters",
      },
      { label: "Treating Medium", value: "water or other suitable liquid", unit: "source text" },
      { label: "Claim Set", value: "five separator-plate claims", unit: "source text" },
    ]);
    expect(carrier.pedagogicalInsight).toContain("does not state chilled-water temperature");
    expect(carrier.pedagogicalInsight).toContain("humidity setpoint, or automatic control law");
  });

  test("keeps Parsons US 608,969 at the printed marine-routing boundary", () => {
    const parsons = PATENT_PHYSICS_REGISTRY["us-608969-parsons-turbine"];
    expect(parsons.engineMethod).toContain("No numerical turbine-performance engine");
    expect(parsons.controls.map((control) => control.unit)).toEqual(["source figure"]);
    expect(parsons.computeMetrics({ sourceFocus: 2 })).toMatchObject([
      {
        label: "Highlighted Source Arrangement",
        value: "Fig. 2: main and reversing turbines X and Y",
      },
      {
        label: "Claimed Connection Modes",
        value: "series; simple parallel; compound parallel",
        unit: "source text",
      },
      {
        label: "Reversing-Turbine Condition",
        value: "runs in condenser vacuum when idle",
        unit: "Claim 2 / 3",
      },
    ]);
    expect(parsons.pedagogicalInsight).toContain("does not state a blade profile, rotor speed");
    expect(parsons.pedagogicalInsight).toContain(
      "Turbinia speed, or electric-generator performance",
    );
  });

  test("keeps Boyle-Smith US 3,858,232 on the withheld information-storage boundary", () => {
    const boyleSmith = PATENT_PHYSICS_REGISTRY["us-3858232-boyle-smith-ccd"];
    expect(boyleSmith.engineMethod).toContain("No quantitative CCD-performance engine");
    expect(boyleSmith.controls.map((control) => control.unit)).toEqual(["source figure group"]);
    expect(boyleSmith.computeMetrics({ sourceFocus: 2 })).toMatchObject([
      { label: "Highlighted Source Group", value: "Figs. 11–16: further device embodiments" },
      { label: "Printed Title", value: "Information Storage Devices", unit: "source text" },
      { label: "Printed Claims", value: "32", unit: "source text" },
    ]);
    expect(boyleSmith.pedagogicalInsight).toContain("original-text face remains withheld");
    expect(boyleSmith.pedagogicalInsight).toContain(
      "three-phase gate geometry, charge-transfer efficiency",
    );
  });

  test("keeps Kwolek US 3,671,542 on its incomplete-edition source boundary", () => {
    const kwolek = PATENT_PHYSICS_REGISTRY["us-3671542-kwolek-kevlar"];
    expect(kwolek.engineMethod).toContain("No materials-performance engine");
    expect(kwolek.controls.map((control) => control.unit)).toEqual(["source group"]);
    expect(kwolek.computeMetrics({ sourceFocus: 2 })).toMatchObject([
      {
        label: "Highlighted Source Group",
        value: "Figs. I–III: phase, optical, and diffraction plots",
      },
      { label: "Printed Claims", value: "2", unit: "source text" },
      { label: "Manual Edition", value: "withheld", unit: "58-page review incomplete" },
    ]);
    expect(kwolek.pedagogicalInsight).toContain("not yet been manually authored");
    expect(kwolek.pedagogicalInsight).toContain("strength, modulus, density, thermal limit");
  });

  test("keeps Marconi US 586,193 on the held source-review boundary", () => {
    const marconi = PATENT_PHYSICS_REGISTRY["us-586193-marconi-radio"];
    expect(marconi.engineMethod).toContain("No RF-performance engine");
    expect(marconi.controls.map((control) => control.unit)).toEqual(["source figure group"]);
    expect(marconi.computeMetrics({ sourceFocus: 2 })).toMatchObject([
      {
        label: "Highlighted Source Group",
        value: "Figs. 4–8: receiver contact, relay, and trembler",
      },
      { label: "Printed Claims", value: "56", unit: "source text" },
      {
        label: "Visual Status",
        value: "withheld",
        unit: "independent source review pending",
      },
    ]);
    expect(marconi.pedagogicalInsight).toContain("quarter-wave antenna geometry");
    expect(marconi.pedagogicalInsight).toContain(
      "operating frequency, spark voltage, power, range",
    );
  });

  test("keeps Lamarr US 2,292,387 on the held synchronized-record boundary", () => {
    const lamarr = PATENT_PHYSICS_REGISTRY["us-2292387-lamarr-frequency-hopping"];
    expect(lamarr.engineMethod).toContain("No RF-performance engine");
    expect(lamarr.controls.map((control) => control.unit)).toEqual(["source figure group"]);
    expect(lamarr.computeMetrics({ sourceFocus: 2 })).toMatchObject([
      {
        label: "Highlighted Source Group",
        value: "Figs. 4–6: record strip, control head, and starting pin",
      },
      { label: "Illustrated Tuning Positions", value: "7 transmitter / 4 receiver" },
      { label: "Printed Claims", value: "6", unit: "source text" },
      {
        label: "Visual Status",
        value: "withheld",
        unit: "independent source review pending",
      },
    ]);
    expect(lamarr.pedagogicalInsight).toContain("seven tuning condensers");
    expect(lamarr.pedagogicalInsight).toContain(
      "hop rate, RF bandwidth, processing gain, jamming margin",
    );
  });

  test("keeps Fermi US 2,708,656 on the held lattice-claim boundary", () => {
    const fermi = PATENT_PHYSICS_REGISTRY["us-2708656-fermi-reactor"];
    expect(fermi.engineMethod).toContain("No reactor-operation engine");
    const metrics = fermi.computeMetrics({ sourceFocus: 2 });
    expect(metrics[0]).toMatchObject({
      label: "Highlighted Source Group",
      value: "Source sheets 10–18",
    });
    expect(metrics[1]).toMatchObject({ label: "Printed Figures", value: "42 on 27 sheets" });
    expect(metrics[2]).toMatchObject({ label: "Printed Claims", value: "8" });
    expect(fermi.pedagogicalInsight).toContain("delayed-neutron kinetics, control-rod behavior");
  });

  test("keeps Engelbart US 3,541,541 on its held two-wheel source boundary", () => {
    const engelbart = PATENT_PHYSICS_REGISTRY["us-3541541-engelbart-mouse"];
    expect(engelbart.engineMethod).toContain("No pointing-device performance engine");
    expect(engelbart.controls.map((control) => control.unit)).toEqual(["source figure group"]);
    expect(engelbart.computeMetrics({ sourceFocus: 2 })).toMatchObject([
      {
        label: "Highlighted Source Group",
        value: "Figs. 4–5: potentiometer and shaft-encoder arrangements",
      },
      { label: "Printed Figures", value: "7" },
      { label: "Printed Claims", value: "8" },
      { label: "Visual Status", value: "withheld" },
    ]);
    expect(JSON.stringify(engelbart).toLowerCase()).not.toContain("wheel radius");
  });

  test("keeps Mergenthaler US 313,224 at its held matrix-bar source boundary", () => {
    const mergenthaler = PATENT_PHYSICS_REGISTRY["us-313224-mergenthaler-linotype"];
    expect(mergenthaler.engineMethod).toContain("No printing-form performance engine");
    expect(mergenthaler.controls.map((control) => control.unit)).toEqual(["source drawing group"]);
    expect(mergenthaler.computeMetrics({ sourceFocus: 2 })).toMatchObject([
      {
        label: "Highlighted Source Group",
        value: "Figs. 18–34: stops, keys, spacing, and mold arrangements",
      },
      { label: "Printed Figures", value: "51 on 17 sheets" },
      { label: "Printed Claims", value: "70" },
      { label: "Visual Status", value: "withheld" },
    ]);
    const published = JSON.stringify(mergenthaler).toLowerCase();
    expect(published).not.toContain("90 magazine channels");
    expect(published).not.toContain("240°c");
    expect(published).not.toContain("seven-bit");
  });
});
