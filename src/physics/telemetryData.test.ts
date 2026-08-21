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
      if (patent.id !== "us-542846-diesel-engine") {
        expect(entry.controls.length).toBeGreaterThan(0);
      }
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

  test("Boyle CCD leftover US 3,923,554 bus is the published US 3,858,232 kernel", () => {
    const published = PATENT_PHYSICS_REGISTRY["us-3858232-boyle-smith-ccd"];
    const leftover = PATENT_PHYSICS_REGISTRY["us-3923554-boyle-smith-ccd"];
    expect(leftover).toBe(published);
    expect(published.controls.some((control) => control.id === "clockFrequencyMhz")).toBe(true);
    expect(published.controls.some((control) => control.id === "clockFreq")).toBe(false);
    expect(published.controls.some((control) => control.id === "gateVoltageV")).toBe(true);
  });

  test("does not keep a sourceFocus facsimile slider on any catalog patent", () => {
    for (const patent of allPatents) {
      const entry = PATENT_PHYSICS_REGISTRY[patent.id];
      expect(entry.controls.some((control) => control.id === "sourceFocus")).toBe(false);
      expect(entry.domainTitle.startsWith("Source Guide")).toBe(false);
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

  test("keeps Pasteur telemetry on the process printed by US 135,245", () => {
    const pasteur = PATENT_PHYSICS_REGISTRY["us-135245-pasteur-fermentation"];
    expect(pasteur.engineMethod).toBe(
      "Source-bounded TypeScript reader state; no quantitative process model",
    );
    expect(pasteur.controls.map((control) => control.id)).toEqual([
      "co2SweepPct",
      "sprayCoveragePct",
      "wortTempC",
    ]);
    expect(pasteur.computeMetrics({})).toMatchObject([
      { label: "CO₂ sweep", value: "100%", unit: "reader control" },
      { label: "Spray coverage", value: "100%", unit: "reader control" },
      { label: "Printed yeast band", value: "21.25 °C", unit: "20–22.5 °C" },
      { label: "Sequence state", value: "Ready for yeast", unit: "source sequence" },
    ]);
    const publicCopy = JSON.stringify(pasteur).toLowerCase();
    for (const unsupported of [
      "log reduction",
      "alcohol yield",
      "co₂ overpressure",
      "shelf life",
      "pasteurization bath",
      "thermal hold",
      "swan-neck",
    ]) {
      expect(publicCopy).not.toContain(unsupported);
    }
  });

  test("routes Goddard US 1,102,653 telemetry through the de Laval kernel", () => {
    const goddard = PATENT_PHYSICS_REGISTRY["us-1102653-goddard-rocket"];
    expect(goddard.engineMethod).toContain("stepGoddardRocket");
    expect(goddard.controls.map((control) => control.id)).toEqual([
      "chamberPressure",
      "expansionRatio",
      "flightAltitudeMiles",
    ]);
    const metrics = goddard.computeMetrics({
      chamberPressure: 350,
      expansionRatio: 3.5,
      flightAltitudeMiles: 18,
    });
    expect(metrics[0]?.label).toBe("Exit Mach Number");
    expect(metrics.some((metric) => metric.label.includes("Thrust"))).toBe(true);
  });

  test("routes Noyce US 2,981,877 telemetry through the planar-junction kernel", () => {
    const noyce = PATENT_PHYSICS_REGISTRY["us-2981877-noyce-ic"];
    expect(noyce.engineMethod).toContain("stepNoyceIC");
    expect(noyce.controls.map((control) => control.id)).toEqual([
      "reverseBias",
      "oxideThickness",
      "clockFrequencyMhz",
    ]);
    expect(
      noyce.computeMetrics({ reverseBias: 5, oxideThickness: 0.5, clockFrequencyMhz: 10 }),
    ).toMatchObject([
      { label: "Depletion Barrier (W)", unit: "µm" },
      { label: "Junction Capacitance", unit: "pF/mm²" },
      { label: "Propagation Delay (tpd)", unit: "ns" },
      { label: "Breakdown Margin", unit: "V", value: "30.0" },
    ]);
  });

  test("holds Diesel US 542,846 telemetry without synthetic state", () => {
    const diesel = PATENT_PHYSICS_REGISTRY["us-542846-diesel-engine"];
    expect(diesel.engineMethod).toBe("source-edition-hold");
    expect(diesel.controls).toEqual([]);
    expect(diesel.computeMetrics({})).toEqual([
      {
        label: "Publication state",
        value: "HELD",
        unit: "source review",
        badgeColor: "amber",
        progressPct: 0,
      },
      {
        label: "Telemetry",
        value: "WITHHELD",
        unit: "no measured values",
        badgeColor: "rose",
        progressPct: 0,
      },
    ]);
  });

  test("routes Carrier US 808,897 telemetry through the spray-dew-point kernel", () => {
    const carrier = PATENT_PHYSICS_REGISTRY["us-808897-carrier-air-conditioner"];
    expect(carrier.engineMethod).toContain("stepCarrierAirConditioner");
    expect(carrier.controls.map((control) => control.id)).toEqual([
      "inletTempC",
      "inletRhPct",
      "sprayWaterTempC",
      "reheatTempC",
      "airflowCfm",
    ]);
    const metrics = carrier.computeMetrics({
      inletTempC: 35,
      inletRhPct: 75,
      sprayWaterTempC: 8,
      reheatTempC: 22,
      airflowCfm: 15000,
    });
    expect(metrics[0]?.label).toBe("Inlet dew point");
    expect(metrics.some((metric) => metric.unit === "g/kg")).toBe(true);
    expect(metrics.some((metric) => metric.unit === "W")).toBe(true);
  });

  test("routes Parsons, CCD, Kevlar, Marconi, Lamarr, Fermi, Engelbart, Linotype, and Hollerith onto their shared kernels", () => {
    const routed: Array<[string, string]> = [
      ["us-608969-parsons-turbine", "stepParsonsTurbine"],
      ["us-3858232-boyle-smith-ccd", "stepBoyleSmithCCD"],
      ["us-3923554-boyle-smith-ccd", "stepBoyleSmithCCD"],
      ["us-3671542-kwolek-kevlar", "stepKevlarContinuum"],
      ["us-586193-marconi-radio", "stepMarconiRadio"],
      ["us-2292387-lamarr-frequency-hopping", "stepLamarrFrequencyHopping"],
      ["us-2708656-fermi-reactor", "stepFermiReactor"],
      ["us-3541541-engelbart-mouse", "stepEngelbartMouse"],
      ["us-313224-mergenthaler-linotype", "stepMergenthalerLinotype"],
      ["us-395781-hollerith-tabulating", "stepHollerithTabulating"],
    ];
    for (const [id, method] of routed) {
      const entry = PATENT_PHYSICS_REGISTRY[id];
      expect(entry.engineMethod).toContain(method);
      expect(entry.controls.some((control) => control.id === "sourceFocus")).toBe(false);
      expect(entry.computeMetrics({}).length).toBeGreaterThan(0);
    }
  });
});
