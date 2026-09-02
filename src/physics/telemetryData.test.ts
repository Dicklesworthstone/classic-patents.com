import { describe, expect, test } from "bun:test";
import { allPatents } from "@/data/patents";
import { daVinciRegistryEntry } from "./daVinciRegistry";
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

  test("registers source-topology claim switches as shared boolean controls", () => {
    const claimControls = [
      ["us-194047-otto-engine", "claim1ChargeGradingPresent"],
      ["us-593138-tesla-coil", "claim1CommonNodeConnected"],
      ["us-6594844-roomba", "opticalSensorEnabled"],
    ] as const;

    for (const [patentId, controlId] of claimControls) {
      const control = PATENT_PHYSICS_REGISTRY[patentId].controls.find(
        (candidate) => candidate.id === controlId,
      );
      expect(control).toMatchObject({ min: 0, max: 1, step: 1, defaultValue: 1, unit: "" });
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

  test("AMF Versatran exposes every normalized pose control on the shared telemetry bus", () => {
    const versatran = PATENT_PHYSICS_REGISTRY["us-3212649-amf-versatran"];
    const defaults = Object.fromEntries(
      versatran.controls.map((control) => [control.id, control.defaultValue]),
    );
    const baseline = versatran.computeMetrics(defaults);
    const moved = versatran.computeMetrics({ ...defaults, columnRotation: 0.05 });
    const baselinePose = baseline.find((metric) => metric.label === "Six-Motion Pose");
    const movedPose = moved.find((metric) => metric.label === "Six-Motion Pose");

    expect(baselinePose).toMatchObject({
      value: "C 0.00 · V 0.55 · A 0.55 · R 0.00 · S 0.00 · G 0.25",
      unit: "normalized display",
    });
    expect(movedPose).toMatchObject({
      value: "C 0.05 · V 0.55 · A 0.55 · R 0.00 · S 0.00 · G 0.25",
      unit: "normalized display",
    });
    expect(movedPose?.value).not.toBe(baselinePose?.value);
    expect(JSON.stringify(movedPose)).not.toMatch(/\b(?:m|N|Pa|W)\b/);
  });

  test("AMF Versatran exposes live signed tape/resolver terms and withholds them with Claim 8", () => {
    const versatran = PATENT_PHYSICS_REGISTRY["us-3212649-amf-versatran"];
    const playback = versatran.computeMetrics({
      teachReplayMode: 1,
      resolverPhaseOffset: 0.25,
      armTravel: 0.55,
    });
    expect(playback.find((metric) => metric.label === "Tape Command Phase")).toMatchObject({
      value: "0.550",
      unit: "normalized phase · arm channel",
    });
    expect(playback.find((metric) => metric.label === "Resolver Feedback Phase")).toMatchObject({
      value: "0.300",
      unit: "normalized phase · arm channel",
    });
    expect(playback.find((metric) => metric.label === "Signed Phase Error")).toMatchObject({
      value: "0.250",
      unit: "normalized phase · arm channel",
    });

    const withheld = versatran.computeMetrics({
      teachReplayMode: 1,
      claim8RecordPlaybackEnabled: 0,
    });
    expect(withheld.find((metric) => metric.label === "Program Mode")).toMatchObject({
      value: "REPLAY PATH WITHHELD",
    });
    expect(withheld.find((metric) => metric.label === "Tape Command Phase")).toMatchObject({
      value: "WITHHELD",
    });
    expect(withheld.find((metric) => metric.label === "Signed Phase Error")).toMatchObject({
      value: "WITHHELD",
    });
  });

  test("routes Da Vinci telemetry through the executable shared contact kernel", () => {
    const daVinci = PATENT_PHYSICS_REGISTRY["us-6331181-davinci"];
    expect(daVinciRegistryEntry).toBe(daVinci);
    expect(daVinci.engineMethod).toBe("FrankenSimEngine.stepDaVinci");
    expect(
      daVinci.computeMetrics({
        motionScaleRatio: 4,
        tremorFilterEnabled: 0,
        masterInputSpeedMps: 0.75,
        gripAngleDeg: 20,
      }),
    ).toMatchObject([
      { label: "Illustrative offset scale", value: "4:1" },
      { label: "Compatibility signal", value: "absent" },
      { label: "End-effector angle", value: "20", unit: "°" },
      { label: "Illustrative tip clearance", unit: "mm" },
    ]);
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

  test("keeps Spencer telemetry on the apparatus and quantities printed by US 2,495,429", () => {
    const spencer = PATENT_PHYSICS_REGISTRY["us-2495429-spencer-microwave"];
    expect(spencer.engineMethod).toBe(
      "Source-bounded TypeScript apparatus state; no quantitative tube model",
    );
    expect(spencer.controls.map((control) => control.id)).toEqual(["rfPowerSetting"]);
    expect(spencer.controls[0]).toMatchObject({ min: 0, max: 1, step: 1, unit: "on/off" });
    expect(spencer.computeMetrics({ rfPowerSetting: 1 })).toMatchObject([
      { label: "Energy Path", value: "active" },
      { label: "Oscillators", value: "10 and 11" },
      { label: "Common Guide", value: "23" },
      { label: "Conveyor", value: "28" },
    ]);

    const publicCopy = JSON.stringify(spencer).toLowerCase();
    for (const unsupported of [
      "2.45 ghz",
      "2450",
      "hull cutoff",
      "dielectric loss",
      "popcorn",
      "anode voltage",
      "magnetic field gauss",
    ]) {
      expect(publicCopy).not.toContain(unsupported);
    }
  });

  test("routes Goddard telemetry through the source-bounded 1914 apparatus", () => {
    const goddard = PATENT_PHYSICS_REGISTRY["us-1102653-goddard-rocket"];
    expect(goddard.engineMethod).toContain("stepGoddardApparatus");
    expect(goddard.controls.map((control) => control.id)).toEqual([
      "tubeLengthRatio",
      "primarySpinRpm",
      "gyroSpinRpm",
      "auxiliaryReleaseFraction",
      "primaryChargeConsumed",
      "gyroEnabled",
    ]);
    const metrics = goddard.computeMetrics({
      tubeLengthRatio: 2.5,
      primarySpinRpm: 120,
      gyroSpinRpm: 0,
      auxiliaryReleaseFraction: 0.5,
      primaryChargeConsumed: 0,
      gyroEnabled: 1,
    });
    expect(metrics[0]).toMatchObject({ label: "Claim 2 Tapered-Tube Ratio", value: "2.5" });
    expect(metrics[1]).toMatchObject({ label: "Claim 1 Firing Sequence", value: "premature" });
    expect(metrics.at(-1)).toMatchObject({
      label: "Instrument Support World Rate",
      value: ((120 * 2 * Math.PI) / 60).toFixed(2),
    });
    const metricLabels = metrics.map((metric) => metric.label.toLowerCase());
    for (const unsupported of ["thrust", "mach", "flight altitude", "chamber pressure"]) {
      expect(metricLabels.some((label) => label.includes(unsupported))).toBeFalse();
    }
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

  test("routes Diesel US 542,846 telemetry through the auto-ignition kernel", () => {
    const diesel = PATENT_PHYSICS_REGISTRY["us-542846-diesel-engine"];
    expect(diesel.engineMethod).toBe("FrankenSimEngine.stepDieselEngine");
    expect(diesel.controls.map((control) => control.id)).toEqual([
      "compRatio",
      "blastAirPressure",
      "cutoffRatio",
      "engineRpm",
    ]);
    const metrics = diesel.computeMetrics({
      compRatio: 18,
      blastAirPressure: 65,
      cutoffRatio: 1.6,
      engineRpm: 150,
    });
    expect(metrics.map((metric) => metric.label)).toEqual([
      "Compression Temperature",
      "Peak Cylinder Pressure",
      "Brake Thermal Efficiency",
      "Auto-Ignition State",
      "Crank ω",
    ]);
    // 18:1 compression of pure air sits in the self-igniting regime.
    expect(metrics[3]?.value).toBe("SELF-IGNITING");
  });

  test("routes Carrier US 808,897 telemetry through the wet-plate separator apparatus kernel", () => {
    const carrier = PATENT_PHYSICS_REGISTRY["us-808897-carrier-air-conditioner"];
    expect(carrier.engineMethod).toContain("stepCarrierAirConditioner");
    expect(carrier.controls.map((control) => control.id)).toEqual([
      "airflowCfm",
      "sprayRatePct",
      "separatorFaces",
    ]);
    const metrics = carrier.computeMetrics({
      airflowCfm: 15000,
      sprayRatePct: 60,
      separatorFaces: 6,
    });
    expect(metrics[0]?.label).toBe("Separator State");
    expect(metrics.some((metric) => metric.unit === "%")).toBe(true);
    expect(metrics.some((metric) => metric.unit === "W")).toBe(true);
  });

  test("keeps Daimler telemetry on the marine installation printed by US 361,931", () => {
    const daimler = PATENT_PHYSICS_REGISTRY["us-361931-daimler-engine"];
    expect(daimler.engineMethod).toContain("stepDaimlerMarineApparatus");
    expect(daimler.engineMethod).toContain("fs-mbd prismatic-joint WASM");
    expect(daimler.controls.map((control) => control.id)).toEqual([
      "shaftPosition",
      "coolingPumpEnabled",
    ]);
    expect(daimler.computeMetrics({ shaftPosition: 1, coolingPumpEnabled: 0 })).toMatchObject([
      { label: "Drive Selection", value: "ahead" },
      { label: "Ahead Contact", value: "coupling a / a²" },
      { label: "Astern Contact", value: "open" },
      { label: "Cooling Circulation", value: "fore-and-aft pipes s¹ / s²" },
    ]);
    expect(daimler.computeMetrics({ shaftPosition: -1, coolingPumpEnabled: 1 })).toMatchObject([
      { label: "Drive Selection", value: "astern" },
      { label: "Ahead Contact", value: "open" },
      { label: "Astern Contact", value: "disks e¹ / e² with a² / c" },
      { label: "Cooling Circulation", value: "fore-and-aft pipes s¹ / s² + pump u" },
    ]);

    const publicCopy = JSON.stringify(daimler).toLowerCase();
    for (const unsupported of [
      "800 rpm",
      "brake horsepower",
      "bmep",
      "motor carriage",
      "automobile",
      "epicyclic",
      "hot-tube ignition",
    ]) {
      expect(publicCopy).not.toContain(unsupported);
    }
  });

  test("keeps Pelton telemetry on the bucket geometry printed by US 233,692", () => {
    const pelton = PATENT_PHYSICS_REGISTRY["us-233692-pelton-water-wheel"];
    expect(pelton.engineMethod).toBe(
      "Source-bounded TypeScript apparatus state; no quantitative turbine model",
    );
    expect(pelton.controls.map((control) => control.id)).toEqual([
      "sourceFlowVisible",
      "claim1Active",
    ]);
    expect(pelton.computeMetrics({ sourceFlowVisible: 1, claim1Active: 1 })).toMatchObject([
      { label: "Source Water Path", value: "shown" },
      { label: "Stream Division", value: "central apex d" },
      { label: "Curved Bottoms", value: "two bottoms c" },
      { label: "Discharge", value: "flaring sides e" },
    ]);
    expect(pelton.computeMetrics({ sourceFlowVisible: 1, claim1Active: 0 })[1]).toMatchObject({
      label: "Stream Division",
      value: "claim element removed",
      progressPct: 0,
    });

    const publicCopy = JSON.stringify(pelton).toLowerCase();
    for (const unsupported of [
      "165",
      "90%",
      "88%",
      "headmeters",
      "runnerrpm",
      "shaft power",
      "jet velocity",
      "bucket count",
    ]) {
      expect(publicCopy).not.toContain(unsupported);
    }
  });

  test("keeps Edison Indicator telemetry qualitative because US 307,031 prints no operating values", () => {
    const edison = PATENT_PHYSICS_REGISTRY["us-307031-edison-indicator"];
    expect(edison.engineMethod).toBe(
      "Source-bounded TypeScript circuit state; no quantitative emission model",
    );
    expect(edison.controls.map((control) => control.id)).toEqual(["plateBiasPolarity"]);
    expect(edison.computeMetrics({ plateBiasPolarity: 1 })).toMatchObject([
      { label: "Internal Terminal", value: "in vacuous globe" },
      { label: "External Connection", value: "positive side" },
      { label: "Illustrated Apparatus", value: "galvanometer" },
      { label: "Printed Conductors", value: "1 and 2" },
    ]);

    const publicCopy = JSON.stringify(edison).toLowerCase();
    for (const unsupported of ["110 v", "microamp", "work function", "richardson", "2250"]) {
      expect(publicCopy).not.toContain(unsupported);
    }
  });

  test("routes Parsons, CCD, Kevlar, Marconi, Lamarr, Fermi, Engelbart, Linotype, and Hollerith onto their shared kernels", () => {
    const routed: Array<[string, string]> = [
      ["us-608969-parsons-turbine", "stepParsonsMarine"],
      ["us-3858232-boyle-smith-ccd", "stepBoyleSmithCcd"],
      ["us-3923554-boyle-smith-ccd", "stepBoyleSmithCcd"],
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
