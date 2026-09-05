import { describe, expect, test } from "bun:test";
import { claimConstraintStateParamId } from "./claimConstraints";
import { PATENT_PHYSICS_REGISTRY } from "./telemetryData";
import {
  getEffectivePatentPhysicsParams,
  getLastParamChange,
  getPatentPhysicsParams,
  getPhysicsTick,
  resetPatentPhysicsParams,
  setPatentPhysicsParam,
  subscribePatentPhysics,
} from "./usePatentPhysics";

describe("Physics Bus & Reactive Parameter Subscriptions (usePatentPhysics)", () => {
  const testPatentId = "us-821393-wright-flyer";

  test("getPatentPhysicsParams initializes default controls from physics registry", () => {
    const params = getPatentPhysicsParams(testPatentId);
    expect(params).toBeDefined();
    expect(params.airspeed).toBe(28); // Default Wright airspeed (28 mph)
    expect(params.wingWarp).toBe(0);
    expect(params.rudder).toBe(0);
    expect(params.elevator).toBe(0);
    expect(params.coupled).toBe(1);
  });

  test("setPatentPhysicsParam updates parameters and tracks tick changes", () => {
    const initialTick = getPhysicsTick(testPatentId);
    setPatentPhysicsParam(testPatentId, "airspeed", 35);

    const updated = getPatentPhysicsParams(testPatentId);
    expect(updated.airspeed).toBe(35);
    expect(getPhysicsTick(testPatentId)).toBeGreaterThan(initialTick);

    const change = getLastParamChange(testPatentId);
    expect(change).not.toBeNull();
    expect(change?.id).toBe("airspeed");
    expect(change?.to).toBe(35);
  });

  test("subscribePatentPhysics notifies subscribers upon parameter changes and unsubscribes cleanly", () => {
    let notifiedValue = -1;
    const unsubscribe = subscribePatentPhysics(testPatentId, (params) => {
      notifiedValue = params.airspeed;
    });

    setPatentPhysicsParam(testPatentId, "airspeed", 42);
    expect(notifiedValue).toBe(42);

    // Unsubscribe and verify no further notifications
    unsubscribe();
    setPatentPhysicsParam(testPatentId, "airspeed", 50);
    expect(notifiedValue).toBe(42); // Unchanged after unsubscription
  });

  test("resetPatentPhysicsParams restores default parameters and notifies listeners", () => {
    setPatentPhysicsParam(testPatentId, "airspeed", 60);
    expect(getPatentPhysicsParams(testPatentId).airspeed).toBe(60);

    resetPatentPhysicsParams(testPatentId);
    const restored = getPatentPhysicsParams(testPatentId);
    expect(restored.airspeed).toBe(28);
  });

  test("canonicalizes 3D slider aliases seamlessly across component boundaries", () => {
    const maximId = "us-319596-maxim-machine-gun";
    setPatentPhysicsParam(maximId, "fireRateRpm", 700);

    const params = getPatentPhysicsParams(maximId);
    expect(params.firingRate).toBe(700);
    expect(params.fireRateRpm).toBe(700);
  });

  test("Diesel 3D compression changes the canonical control, subscriber and live model output", () => {
    const id = "us-542846-diesel-engine";
    resetPatentPhysicsParams(id);
    const initial = PATENT_PHYSICS_REGISTRY[id].computeMetrics(getPatentPhysicsParams(id));
    const observations: number[] = [];
    const unsubscribe = subscribePatentPhysics(id, (params) => observations.push(params.compRatio));
    try {
      setPatentPhysicsParam(id, "compressionRatio", 21.5);
      const params = getPatentPhysicsParams(id);
      expect(params.compRatio).toBe(21.5);
      expect(params.compressionRatio).toBe(21.5);
      expect(observations).toEqual([21.5]);
      expect(getLastParamChange(id)?.id).toBe("compRatio");
      const changed = PATENT_PHYSICS_REGISTRY[id].computeMetrics(params);
      expect(changed.find((metric) => metric.label === "Compression Temperature")?.value).not.toBe(
        initial.find((metric) => metric.label === "Compression Temperature")?.value,
      );
      setPatentPhysicsParam(id, "compRatio", 12);
      expect(getPatentPhysicsParams(id).compressionRatio).toBe(12);
      setPatentPhysicsParam(id, "blastAirPressureBar", 75);
      expect(getPatentPhysicsParams(id).blastAirPressure).toBe(75);
      expect(getPatentPhysicsParams(id).blastAirPressureBar).toBe(75);
    } finally {
      unsubscribe();
      resetPatentPhysicsParams(id);
    }
  });

  test("Otto aliases cr and rpm update canonical controls and notify subscribers", () => {
    const id = "us-194047-otto-engine";
    resetPatentPhysicsParams(id);
    const initial = PATENT_PHYSICS_REGISTRY[id].computeMetrics(getPatentPhysicsParams(id));
    const observations: number[] = [];
    const unsubscribe = subscribePatentPhysics(id, (params) =>
      observations.push(params.compressionRatio),
    );
    try {
      setPatentPhysicsParam(id, "cr", 6.5);
      const params = getPatentPhysicsParams(id);
      expect(params.compressionRatio).toBe(6.5);
      expect(params.cr).toBe(6.5);
      expect(observations).toEqual([6.5]);
      expect(getLastParamChange(id)?.id).toBe("compressionRatio");
      const changed = PATENT_PHYSICS_REGISTRY[id].computeMetrics(params);
      expect(changed.find((metric) => metric.label === "Modern Ideal Efficiency")?.value).not.toBe(
        initial.find((metric) => metric.label === "Modern Ideal Efficiency")?.value,
      );
      setPatentPhysicsParam(id, "rpm", 240);
      expect(getPatentPhysicsParams(id).engineRpm).toBe(240);
      expect(getPatentPhysicsParams(id).rpm).toBe(240);
    } finally {
      unsubscribe();
      resetPatentPhysicsParams(id);
    }
  });

  test("Corliss aliases (pressure, rpm, cutoff) update canonical controls and notify subscribers", () => {
    const id = "us-6162-corliss-steam-engine";
    resetPatentPhysicsParams(id);
    const initial = PATENT_PHYSICS_REGISTRY[id].computeMetrics(getPatentPhysicsParams(id));
    const observations: number[] = [];
    const unsubscribe = subscribePatentPhysics(id, (params) =>
      observations.push(params.steamPressurePsi),
    );
    try {
      setPatentPhysicsParam(id, "pressure", 140);
      const params = getPatentPhysicsParams(id);
      expect(params.steamPressurePsi).toBe(140);
      expect(params.boilerPressure).toBe(140);
      expect(params.pressure).toBe(140);
      expect(observations).toEqual([140]);
      expect(getLastParamChange(id)?.id).toBe("steamPressurePsi");

      const changed = PATENT_PHYSICS_REGISTRY[id].computeMetrics(params);
      expect(changed.find((metric) => metric.label === "Indicated Horsepower")?.value).not.toBe(
        initial.find((metric) => metric.label === "Indicated Horsepower")?.value,
      );

      setPatentPhysicsParam(id, "rpm", 90);
      expect(getPatentPhysicsParams(id).engineRpm).toBe(90);
      expect(getPatentPhysicsParams(id).rpm).toBe(90);

      setPatentPhysicsParam(id, "cutoff", 40);
      expect(getPatentPhysicsParams(id).cutoffPct).toBe(40);
      expect(getPatentPhysicsParams(id).cutoff).toBe(40);
      expect(getPatentPhysicsParams(id).cutoffPercentage).toBe(40);
    } finally {
      unsubscribe();
      resetPatentPhysicsParams(id);
    }
  });

  test("DeLaval aliases (rpm, rotorRpm, flow, feedRateLph) update canonical controls and notify subscribers", () => {
    const id = "us-247804-delaval-separator";
    resetPatentPhysicsParams(id);
    const initial = PATENT_PHYSICS_REGISTRY[id].computeMetrics(getPatentPhysicsParams(id));
    const observations: number[] = [];
    const unsubscribe = subscribePatentPhysics(id, (params) => observations.push(params.bowlRpm));
    try {
      setPatentPhysicsParam(id, "rpm", 8000);
      const params = getPatentPhysicsParams(id);
      expect(params.bowlRpm).toBe(8000);
      expect(params.rotorRpm).toBe(8000);
      expect(params.rpm).toBe(8000);
      expect(observations).toEqual([8000]);
      expect(getLastParamChange(id)?.id).toBe("bowlRpm");

      const changed = PATENT_PHYSICS_REGISTRY[id].computeMetrics(params);
      expect(changed.find((metric) => metric.label === "Centrifugal G-Force")?.value).not.toBe(
        initial.find((metric) => metric.label === "Centrifugal G-Force")?.value,
      );

      setPatentPhysicsParam(id, "flow", 450);
      expect(getPatentPhysicsParams(id).rawMilkFlowLph).toBe(450);
      expect(getPatentPhysicsParams(id).flow).toBe(450);
      expect(getPatentPhysicsParams(id).feedRateLph).toBe(450);
    } finally {
      unsubscribe();
      resetPatentPhysicsParams(id);
    }
  });

  test("Haber ammonia aliases (synthesisPressureBar, synthesisTempC, feedFlow, activity) update canonical controls and notify subscribers", () => {
    const id = "us-971501-haber-ammonia";
    resetPatentPhysicsParams(id);
    const initial = PATENT_PHYSICS_REGISTRY[id].computeMetrics(getPatentPhysicsParams(id));
    const observations: number[] = [];
    const unsubscribe = subscribePatentPhysics(id, (params) =>
      observations.push(params.pressureAtm),
    );
    try {
      setPatentPhysicsParam(id, "synthesisPressureBar", 200);
      const params = getPatentPhysicsParams(id);
      expect(params.pressureAtm).toBeCloseTo(200 / 1.01325, 2);
      expect(observations.length).toBe(1);

      const changed = PATENT_PHYSICS_REGISTRY[id].computeMetrics(params);
      expect(changed.find((m) => m.label === "Ammonia Conversion Yield")?.value).not.toBe(
        initial.find((m) => m.label === "Ammonia Conversion Yield")?.value,
      );

      setPatentPhysicsParam(id, "synthesisTempC", 580);
      expect(getPatentPhysicsParams(id).temperatureCelsius).toBe(580);
      expect(getPatentPhysicsParams(id).synthesisTempC).toBe(580);

      setPatentPhysicsParam(id, "feedFlow", 80);
      expect(getPatentPhysicsParams(id).feedFlowRateMolesPerSec).toBe(80);
      expect(getPatentPhysicsParams(id).feedFlow).toBe(80);

      setPatentPhysicsParam(id, "activity", 1.5);
      expect(getPatentPhysicsParams(id).catalystActivity).toBe(1.5);
      expect(getPatentPhysicsParams(id).activity).toBe(1.5);
    } finally {
      unsubscribe();
      resetPatentPhysicsParams(id);
    }
  });

  test("Parsons Reaction Turbine aliases (steamPressureBar, rpm, turbineRpm, pressure) update canonical controls and notify subscribers", () => {
    const id = "us-328710-parsons-turbine";
    resetPatentPhysicsParams(id);
    const initial = PATENT_PHYSICS_REGISTRY[id].computeMetrics(getPatentPhysicsParams(id));
    const observations: number[] = [];
    const unsubscribe = subscribePatentPhysics(id, (params) =>
      observations.push(params.inletPressurePsi),
    );
    try {
      setPatentPhysicsParam(id, "steamPressureBar", 15);
      const params = getPatentPhysicsParams(id);
      expect(params.inletPressurePsi).toBeCloseTo(15 * 14.5038, 2);
      expect(observations.length).toBe(1);

      const changed = PATENT_PHYSICS_REGISTRY[id].computeMetrics(params);
      expect(changed.find((m) => m.label === "Shaft Power Output")?.value).not.toBe(
        initial.find((m) => m.label === "Shaft Power Output")?.value,
      );

      setPatentPhysicsParam(id, "rpm", 4500);
      expect(getPatentPhysicsParams(id).rotorRpm).toBe(4500);
      expect(getPatentPhysicsParams(id).rpm).toBe(4500);
      expect(getPatentPhysicsParams(id).turbineRpm).toBe(4500);
    } finally {
      unsubscribe();
      resetPatentPhysicsParams(id);
    }
  });

  test("Morse Telegraph aliases (lineVoltage, current, lineResistance, wpm) update canonical controls and notify subscribers", () => {
    const id = "us-1647-morse-telegraph";
    resetPatentPhysicsParams(id);
    const initial = PATENT_PHYSICS_REGISTRY[id].computeMetrics(getPatentPhysicsParams(id));
    const observations: number[] = [];
    const unsubscribe = subscribePatentPhysics(id, (params) => observations.push(params.currentMa));
    try {
      setPatentPhysicsParam(id, "current", 85);
      const params = getPatentPhysicsParams(id);
      expect(params.currentMa).toBe(85);
      expect(observations.length).toBe(1);

      const changed = PATENT_PHYSICS_REGISTRY[id].computeMetrics(params);
      expect(changed.find((m) => m.label === "Magnetic Pull Force")?.value).not.toBe(
        initial.find((m) => m.label === "Magnetic Pull Force")?.value,
      );

      setPatentPhysicsParam(id, "lineVoltage", 36);
      expect(getPatentPhysicsParams(id).lineVoltageV).toBe(36);
      expect(getPatentPhysicsParams(id).lineVoltage).toBe(36);

      setPatentPhysicsParam(id, "wpm", 28);
      expect(getPatentPhysicsParams(id).wpmSpeed).toBe(28);
      expect(getPatentPhysicsParams(id).wpm).toBe(28);
    } finally {
      unsubscribe();
      resetPatentPhysicsParams(id);
    }
  });

  test("De Forest Audion aliases (gridVoltage, plateVoltage, filamentCurrent, loadResistance) update canonical controls and notify subscribers", () => {
    const id = "us-879532-de-forest-audion";
    resetPatentPhysicsParams(id);
    const initial = PATENT_PHYSICS_REGISTRY[id].computeMetrics(getPatentPhysicsParams(id));
    const observations: number[] = [];
    const unsubscribe = subscribePatentPhysics(id, (params) =>
      observations.push(params.gridBiasVoltageV),
    );
    try {
      setPatentPhysicsParam(id, "gridVoltage", -0.5);
      const params = getPatentPhysicsParams(id);
      expect(params.gridBiasVoltageV).toBe(-0.5);
      expect(observations.length).toBe(1);

      const changed = PATENT_PHYSICS_REGISTRY[id].computeMetrics(params);
      expect(changed.find((m) => m.label === "Illustrative Plate Current")?.value).not.toBe(
        initial.find((m) => m.label === "Illustrative Plate Current")?.value,
      );

      setPatentPhysicsParam(id, "plateVoltage", 60);
      expect(getPatentPhysicsParams(id).plateVoltageV).toBe(60);

      setPatentPhysicsParam(id, "filamentCurrent", 1.2);
      expect(getPatentPhysicsParams(id).filamentCurrentA).toBe(1.2);

      setPatentPhysicsParam(id, "loadResistance", 35);
      expect(getPatentPhysicsParams(id).loadResistanceKOhms).toBe(35);
    } finally {
      unsubscribe();
      resetPatentPhysicsParams(id);
    }
  });

  test("Farnsworth TV aliases (anodeKv, deflectionCoilCurrent, lightIntensity) update canonical controls and notify subscribers", () => {
    const id = "us-1773980-farnsworth-tv";
    resetPatentPhysicsParams(id);
    const initial = PATENT_PHYSICS_REGISTRY[id].computeMetrics(getPatentPhysicsParams(id));
    const observations: number[] = [];
    const unsubscribe = subscribePatentPhysics(id, (params) =>
      observations.push(params.anodeVoltage),
    );
    try {
      setPatentPhysicsParam(id, "anodeKv", 2.5);
      const params = getPatentPhysicsParams(id);
      expect(params.anodeVoltage).toBe(2500);
      expect(observations.length).toBe(1);

      const changed = PATENT_PHYSICS_REGISTRY[id].computeMetrics(params);
      expect(changed.find((m) => m.label === "Electron Beam Speed")?.value).not.toBe(
        initial.find((m) => m.label === "Electron Beam Speed")?.value,
      );

      setPatentPhysicsParam(id, "deflectionCoilCurrent", 0.65);
      expect(getPatentPhysicsParams(id).coilCurrent).toBe(0.65);

      setPatentPhysicsParam(id, "lightIntensity", 850);
      expect(getPatentPhysicsParams(id).lightIntensityLux).toBe(850);
    } finally {
      unsubscribe();
      resetPatentPhysicsParams(id);
    }
  });

  test("Edison Phonograph aliases (cylinderRpm, rpm, voiceVolume, volumeDb) update canonical controls and notify subscribers", () => {
    const id = "us-200521-edison-phonograph";
    resetPatentPhysicsParams(id);
    const initial = PATENT_PHYSICS_REGISTRY[id].computeMetrics(getPatentPhysicsParams(id));
    const observations: number[] = [];
    const unsubscribe = subscribePatentPhysics(id, (params) =>
      observations.push(params.mandrelRpm),
    );
    try {
      setPatentPhysicsParam(id, "rpm", 90);
      const params = getPatentPhysicsParams(id);
      expect(params.mandrelRpm).toBe(90);
      expect(params.rpm).toBe(90);
      expect(params.cylinderRpm).toBe(90);
      expect(observations).toEqual([90]);
      expect(getLastParamChange(id)?.id).toBe("mandrelRpm");

      const changed = PATENT_PHYSICS_REGISTRY[id].computeMetrics(params);
      expect(changed.find((m) => m.label === "Illustrative Helical Advance")?.value).not.toBe(
        initial.find((m) => m.label === "Illustrative Helical Advance")?.value,
      );

      setPatentPhysicsParam(id, "volumeDb", 85);
      expect(getPatentPhysicsParams(id).voiceVolumeDb).toBe(85);
      expect(getPatentPhysicsParams(id).voiceVolume).toBe(85);
      expect(getPatentPhysicsParams(id).volumeDb).toBe(85);
    } finally {
      unsubscribe();
      resetPatentPhysicsParams(id);
    }
  });

  test("Gramme Dynamo aliases (rotorRpm, shaftRpm, speed, shaftRateFactor) update canonical controls and notify subscribers", () => {
    const id = "us-120057-gramme-dynamo";
    resetPatentPhysicsParams(id);
    const initial = PATENT_PHYSICS_REGISTRY[id].computeMetrics(getPatentPhysicsParams(id));
    const observations: number[] = [];
    const unsubscribe = subscribePatentPhysics(id, (params) => observations.push(params.shaftRate));
    try {
      setPatentPhysicsParam(id, "speed", 2.2);
      const params = getPatentPhysicsParams(id);
      expect(params.shaftRate).toBe(2.2);
      expect(params.speed).toBe(2.2);
      expect(params.rotorRpm).toBe(2.2);
      expect(observations).toEqual([2.2]);
      expect(getLastParamChange(id)?.id).toBe("shaftRate");

      const changed = PATENT_PHYSICS_REGISTRY[id].computeMetrics(params);
      expect(changed.find((m) => m.label === "Induced e.m.f. (illustrative)")?.value).not.toBe(
        initial.find((m) => m.label === "Induced e.m.f. (illustrative)")?.value,
      );

      setPatentPhysicsParam(id, "shaftRateFactor", 1.8);
      expect(getPatentPhysicsParams(id).shaftRate).toBe(1.8);
      expect(getPatentPhysicsParams(id).shaftRpm).toBe(1.8);
    } finally {
      unsubscribe();
      resetPatentPhysicsParams(id);
    }
  });

  test("Fessenden Wireless aliases (carrierFreqKhz, modulationPct, inductanceUh, distanceKm) update canonical controls and notify subscribers", () => {
    const id = "us-706737-fessenden-wireless";
    resetPatentPhysicsParams(id);
    const initial = PATENT_PHYSICS_REGISTRY[id].computeMetrics(getPatentPhysicsParams(id));
    const observations: number[] = [];
    const unsubscribe = subscribePatentPhysics(id, (params) =>
      observations.push(params.carrierFrequencyKhz),
    );
    try {
      setPatentPhysicsParam(id, "carrierFreqKhz", 65);
      const params = getPatentPhysicsParams(id);
      expect(params.carrierFrequencyKhz).toBe(65);
      expect(params.carrierFreq).toBe(65);
      expect(params.frequencyKhz).toBe(65);
      expect(observations).toEqual([65]);
      expect(getLastParamChange(id)?.id).toBe("carrierFrequencyKhz");

      const changed = PATENT_PHYSICS_REGISTRY[id].computeMetrics(params);
      expect(changed.find((m) => m.label === "Radiation Resistance")?.value).not.toBe(
        initial.find((m) => m.label === "Radiation Resistance")?.value,
      );

      setPatentPhysicsParam(id, "modulationPct", 45);
      expect(getPatentPhysicsParams(id).audioModulationPct).toBe(45);
      expect(getPatentPhysicsParams(id).modDepthPct).toBe(45);

      setPatentPhysicsParam(id, "inductanceUh", 320);
      expect(getPatentPhysicsParams(id).antennaTuningUh).toBe(320);
      expect(getPatentPhysicsParams(id).tuningUh).toBe(320);

      setPatentPhysicsParam(id, "distanceKm", 40);
      expect(getPatentPhysicsParams(id).transmissionDistanceKm).toBe(40);
      expect(getPatentPhysicsParams(id).rangeKm).toBe(40);
    } finally {
      unsubscribe();
      resetPatentPhysicsParams(id);
    }
  });

  test("Gatling Gun aliases (rpm, speed, barrels, numBarrels) update canonical controls and notify subscribers", () => {
    const id = "us-36836-gatling-gun";
    resetPatentPhysicsParams(id);
    const initial = PATENT_PHYSICS_REGISTRY[id].computeMetrics(getPatentPhysicsParams(id));
    const observations: number[] = [];
    const unsubscribe = subscribePatentPhysics(id, (params) => observations.push(params.crankRpm));
    try {
      setPatentPhysicsParam(id, "speed", 90);
      const params = getPatentPhysicsParams(id);
      expect(params.crankRpm).toBe(90);
      expect(params.speed).toBe(90);
      expect(params.rpm).toBe(90);
      expect(observations).toEqual([90]);
      expect(getLastParamChange(id)?.id).toBe("crankRpm");

      const changed = PATENT_PHYSICS_REGISTRY[id].computeMetrics(params);
      expect(changed.find((m) => m.label === "Rate of Fire")?.value).not.toBe(
        initial.find((m) => m.label === "Rate of Fire")?.value,
      );

      setPatentPhysicsParam(id, "barrels", 10);
      expect(getPatentPhysicsParams(id).barrelCount).toBe(10);
      expect(getPatentPhysicsParams(id).barrels).toBe(10);
      expect(getPatentPhysicsParams(id).numBarrels).toBe(10);
    } finally {
      unsubscribe();
      resetPatentPhysicsParams(id);
    }
  });

  test("Tesla Coil aliases (freq, frequency, secondaryLength, wireLengthMiles) update canonical controls and notify subscribers", () => {
    const id = "us-593138-tesla-coil";
    resetPatentPhysicsParams(id);
    const initial = PATENT_PHYSICS_REGISTRY[id].computeMetrics(getPatentPhysicsParams(id));
    const observations: number[] = [];
    const unsubscribe = subscribePatentPhysics(id, (params) =>
      observations.push(params.disturbanceFrequencyHz),
    );
    try {
      setPatentPhysicsParam(id, "freq", 1200);
      const params = getPatentPhysicsParams(id);
      expect(params.disturbanceFrequencyHz).toBe(1200);
      expect(params.freq).toBe(1200);
      expect(params.frequency).toBe(1200);
      expect(observations).toEqual([1200]);
      expect(getLastParamChange(id)?.id).toBe("disturbanceFrequencyHz");

      const changed = PATENT_PHYSICS_REGISTRY[id].computeMetrics(params);
      expect(changed.find((m) => m.label === "Quarter-Wave Target")?.value).not.toBe(
        initial.find((m) => m.label === "Quarter-Wave Target")?.value,
      );

      setPatentPhysicsParam(id, "secondaryLength", 65);
      expect(getPatentPhysicsParams(id).secondaryLengthMiles).toBe(65);
      expect(getPatentPhysicsParams(id).secondaryLength).toBe(65);
      expect(getPatentPhysicsParams(id).wireLengthMiles).toBe(65);
    } finally {
      unsubscribe();
      resetPatentPhysicsParams(id);
    }
  });

  test("Tesla Teleautomaton aliases (rudder, rudderDeg, throttle, throttlePct) update canonical controls and notify subscribers", () => {
    const id = "us-613809-tesla-teleautomaton";
    resetPatentPhysicsParams(id);
    const initial = PATENT_PHYSICS_REGISTRY[id].computeMetrics(getPatentPhysicsParams(id));
    const observations: number[] = [];
    const unsubscribe = subscribePatentPhysics(id, (params) =>
      observations.push(params.propellerThrottlePct),
    );
    try {
      setPatentPhysicsParam(id, "throttle", 90);
      const params = getPatentPhysicsParams(id);
      expect(params.propellerThrottlePct).toBe(90);
      expect(params.throttle).toBe(90);
      expect(params.throttlePct).toBe(90);
      expect(observations).toEqual([90]);
      expect(getLastParamChange(id)?.id).toBe("propellerThrottlePct");

      const changed = PATENT_PHYSICS_REGISTRY[id].computeMetrics(params);
      expect(changed.find((m) => m.label === "Propulsion Motor")?.value).not.toBe(
        initial.find((m) => m.label === "Propulsion Motor")?.value,
      );

      setPatentPhysicsParam(id, "rudder", 25);
      expect(getPatentPhysicsParams(id).rudderAngle).toBe(25);
      expect(getPatentPhysicsParams(id).rudder).toBe(25);
      expect(getPatentPhysicsParams(id).rudderDeg).toBe(25);
    } finally {
      unsubscribe();
      resetPatentPhysicsParams(id);
    }
  });

  test("shares claim state across subscribers while retaining raw controls and deriving effective topology", () => {
    const goertzId = "us-2846084-goertz-electronic-master-slave-manipulator";
    resetPatentPhysicsParams(goertzId);
    const claim9Param = claimConstraintStateParamId(9);
    const observations: number[] = [];
    const unsubscribeA = subscribePatentPhysics(goertzId, (params) => {
      observations.push(params[claim9Param] ?? -1);
    });
    const unsubscribeB = subscribePatentPhysics(goertzId, (params) => {
      observations.push((params[claim9Param] ?? -1) * 10);
    });

    setPatentPhysicsParam(goertzId, claim9Param, 0);

    expect(observations).toEqual([0, 0]);
    expect(getPatentPhysicsParams(goertzId)[claim9Param]).toBe(0);
    expect(getPatentPhysicsParams(goertzId).forceReflectionEnabled).toBe(1);
    expect(getEffectivePatentPhysicsParams(goertzId).forceReflectionEnabled).toBe(0);

    unsubscribeA();
    unsubscribeB();
    resetPatentPhysicsParams(goertzId);
    expect(getPatentPhysicsParams(goertzId)[claim9Param]).toBeUndefined();
    expect(getEffectivePatentPhysicsParams(goertzId).forceReflectionEnabled).toBe(1);
  });

  test("preserves hidden claim state when an ordinary aliased control is updated", () => {
    const maximId = "us-319596-maxim-machine-gun";
    const claim1Param = claimConstraintStateParamId(1);
    resetPatentPhysicsParams(maximId);
    setPatentPhysicsParam(maximId, claim1Param, 0);
    setPatentPhysicsParam(maximId, "fireRateRpm", 680);

    const params = getPatentPhysicsParams(maximId);
    expect(params[claim1Param]).toBe(0);
    expect(params.firingRate).toBe(680);
    resetPatentPhysicsParams(maximId);
  });

  test("Davenport Electric Motor aliases update canonical controls, notify subscribers, and update metrics", () => {
    const id = "us-132-davenport-electric-motor";
    resetPatentPhysicsParams(id);
    const initial = PATENT_PHYSICS_REGISTRY[id].computeMetrics(getPatentPhysicsParams(id));
    const observations: number[] = [];
    const unsubscribe = subscribePatentPhysics(id, (params) =>
      observations.push(params.batteryVoltage),
    );
    try {
      setPatentPhysicsParam(id, "batteryVolts", 18);
      const params = getPatentPhysicsParams(id);
      expect(params.batteryVoltage).toBe(18);
      expect(params.batteryVolts).toBe(18);
      expect(params.v).toBe(18);
      expect(observations).toEqual([18]);
      expect(getLastParamChange(id)?.id).toBe("batteryVoltage");

      const changed = PATENT_PHYSICS_REGISTRY[id].computeMetrics(params);
      expect(changed.find((m) => m.label === "Motor Speed")?.value).not.toBe(
        initial.find((m) => m.label === "Motor Speed")?.value,
      );

      setPatentPhysicsParam(id, "torque", 1.5);
      expect(getPatentPhysicsParams(id).loadTorque).toBe(1.5);
      expect(getPatentPhysicsParams(id).torque).toBe(1.5);
      expect(getPatentPhysicsParams(id).load).toBe(1.5);
      expect(getPatentPhysicsParams(id).torqueNm).toBe(1.5);
    } finally {
      unsubscribe();
      resetPatentPhysicsParams(id);
    }
  });

  test("Glidden Barbed Wire aliases update canonical controls, notify subscribers, and update metrics", () => {
    const id = "us-157124-glidden-barbed-wire";
    resetPatentPhysicsParams(id);
    const initial = PATENT_PHYSICS_REGISTRY[id].computeMetrics(getPatentPhysicsParams(id));
    const observations: number[] = [];
    const unsubscribe = subscribePatentPhysics(id, (params) =>
      observations.push(params.wireTensionN),
    );
    try {
      setPatentPhysicsParam(id, "tension", 900);
      const params = getPatentPhysicsParams(id);
      expect(params.wireTensionN).toBe(900);
      expect(params.tension).toBe(900);
      expect(params.tensionN).toBe(900);
      expect(params.lineTensionN).toBe(900);
      expect(observations).toEqual([900]);
      expect(getLastParamChange(id)?.id).toBe("wireTensionN");

      const changed = PATENT_PHYSICS_REGISTRY[id].computeMetrics(params);
      expect(changed.find((m) => m.label === "Span Sag")?.value).not.toBe(
        initial.find((m) => m.label === "Span Sag")?.value,
      );

      setPatentPhysicsParam(id, "twistRate", 7);
      expect(getPatentPhysicsParams(id).twistsPerFoot).toBe(7);
      expect(getPatentPhysicsParams(id).twists).toBe(7);
      expect(getPatentPhysicsParams(id).twistRate).toBe(7);

      setPatentPhysicsParam(id, "pushForce", 200);
      expect(getPatentPhysicsParams(id).animalPushForceN).toBe(200);
      expect(getPatentPhysicsParams(id).pushForce).toBe(200);
      expect(getPatentPhysicsParams(id).pushForceN).toBe(200);
    } finally {
      unsubscribe();
      resetPatentPhysicsParams(id);
    }
  });

  test("Lincoln Buoyancy Chambers aliases update canonical controls, notify subscribers, and update metrics", () => {
    const id = "us-6469-lincoln-buoy";
    resetPatentPhysicsParams(id);
    const initial = PATENT_PHYSICS_REGISTRY[id].computeMetrics(getPatentPhysicsParams(id));
    const observations: number[] = [];
    const unsubscribe = subscribePatentPhysics(id, (params) =>
      observations.push(params.inflationPct),
    );
    try {
      setPatentPhysicsParam(id, "inflation", 90);
      const params = getPatentPhysicsParams(id);
      expect(params.inflationPct).toBe(90);
      expect(params.inflation).toBe(90);
      expect(params.expansionPct).toBe(90);
      expect(params.bellowsInflationPct).toBe(90);
      expect(observations).toEqual([90]);
      expect(getLastParamChange(id)?.id).toBe("inflationPct");

      const changed = PATENT_PHYSICS_REGISTRY[id].computeMetrics(params);
      expect(changed.find((m) => m.label === "Draft Reduction")?.value).not.toBe(
        initial.find((m) => m.label === "Draft Reduction")?.value,
      );

      setPatentPhysicsParam(id, "weight", 420);
      expect(getPatentPhysicsParams(id).weightTons).toBe(420);
      expect(getPatentPhysicsParams(id).weight).toBe(420);
      expect(getPatentPhysicsParams(id).steamboatWeightTons).toBe(420);

      setPatentPhysicsParam(id, "depth", 4.2);
      expect(getPatentPhysicsParams(id).shoalDepth).toBe(4.2);
      expect(getPatentPhysicsParams(id).depth).toBe(4.2);
      expect(getPatentPhysicsParams(id).depthFt).toBe(4.2);
    } finally {
      unsubscribe();
      resetPatentPhysicsParams(id);
    }
  });

  test("Howe Sewing Machine aliases update canonical controls, notify subscribers, and update metrics", () => {
    const id = "us-4750-howe-sewing-machine";
    resetPatentPhysicsParams(id);
    const initial = PATENT_PHYSICS_REGISTRY[id].computeMetrics(getPatentPhysicsParams(id));
    const observations: number[] = [];
    const unsubscribe = subscribePatentPhysics(id, (params) => observations.push(params.crankRpm));
    try {
      setPatentPhysicsParam(id, "speed", 320);
      const params = getPatentPhysicsParams(id);
      expect(params.crankRpm).toBe(320);
      expect(params.rpm).toBe(320);
      expect(params.speed).toBe(320);
      expect(params.sewingSpeedRpm).toBe(320);
      expect(observations).toEqual([320]);
      expect(getLastParamChange(id)?.id).toBe("crankRpm");

      const changed = PATENT_PHYSICS_REGISTRY[id].computeMetrics(params);
      expect(changed.find((m) => m.label === "Display Cadence")?.value).not.toBe(
        initial.find((m) => m.label === "Display Cadence")?.value,
      );

      setPatentPhysicsParam(id, "pitch", 4.0);
      expect(getPatentPhysicsParams(id).stitchPitchMm).toBe(4.0);
      expect(getPatentPhysicsParams(id).pitch).toBe(4.0);
      expect(getPatentPhysicsParams(id).feedPitch).toBe(4.0);

      setPatentPhysicsParam(id, "slack", 75);
      expect(getPatentPhysicsParams(id).loopSlackPct).toBe(75);
      expect(getPatentPhysicsParams(id).slack).toBe(75);
      expect(getPatentPhysicsParams(id).slackPct).toBe(75);
    } finally {
      unsubscribe();
      resetPatentPhysicsParams(id);
    }
  });

  test("Westinghouse Air Brake aliases update canonical controls, notify subscribers, and update metrics", () => {
    const id = "us-124404-westinghouse-air-brake";
    resetPatentPhysicsParams(id);
    const initial = PATENT_PHYSICS_REGISTRY[id].computeMetrics(getPatentPhysicsParams(id));
    const observations: number[] = [];
    const unsubscribe = subscribePatentPhysics(id, (params) =>
      observations.push(params.trainPipePressure),
    );
    try {
      setPatentPhysicsParam(id, "brakePressurePsi", 60);
      const params = getPatentPhysicsParams(id);
      expect(params.trainPipePressure).toBe(60);
      expect(params.trainPipePressurePsi).toBe(60);
      expect(params.brakePipePressure).toBe(60);
      expect(params.brakePressurePsi).toBe(60);
      expect(params.pipePressure).toBe(60);
      expect(observations).toEqual([60]);
      expect(getLastParamChange(id)?.id).toBe("trainPipePressure");

      const changed = PATENT_PHYSICS_REGISTRY[id].computeMetrics(params);
      expect(changed.find((m) => m.label === "Brake Cylinder Pressure (C)")?.value).not.toBe(
        initial.find((m) => m.label === "Brake Cylinder Pressure (C)")?.value,
      );

      setPatentPhysicsParam(id, "reservoirPressure", 70);
      expect(getPatentPhysicsParams(id).reservoirPipePressure).toBe(70);
      expect(getPatentPhysicsParams(id).reservoirPipePressurePsi).toBe(70);
      expect(getPatentPhysicsParams(id).reservoirPressure).toBe(70);

      setPatentPhysicsParam(id, "signalPulsePressurePsi", 1.5);
      expect(getPatentPhysicsParams(id).signalPulsePressure).toBe(1.5);
      expect(getPatentPhysicsParams(id).signalPulsePressurePsi).toBe(1.5);
    } finally {
      unsubscribe();
      resetPatentPhysicsParams(id);
    }
  });

  test("DeLaval Cream Separator aliases update canonical controls, notify subscribers, and update metrics", () => {
    const id = "us-247804-delaval-separator";
    resetPatentPhysicsParams(id);
    const initial = PATENT_PHYSICS_REGISTRY[id].computeMetrics(getPatentPhysicsParams(id));
    const observations: number[] = [];
    const unsubscribe = subscribePatentPhysics(id, (params) => observations.push(params.bowlRpm));
    try {
      setPatentPhysicsParam(id, "speed", 7200);
      const params = getPatentPhysicsParams(id);
      expect(params.bowlRpm).toBe(7200);
      expect(params.rotorRpm).toBe(7200);
      expect(params.rpm).toBe(7200);
      expect(params.speed).toBe(7200);
      expect(observations).toEqual([7200]);
      expect(getLastParamChange(id)?.id).toBe("bowlRpm");

      const changed = PATENT_PHYSICS_REGISTRY[id].computeMetrics(params);
      expect(changed.find((m) => m.label === "Centrifugal G-Force")?.value).not.toBe(
        initial.find((m) => m.label === "Centrifugal G-Force")?.value,
      );

      setPatentPhysicsParam(id, "feedFlow", 450);
      expect(getPatentPhysicsParams(id).rawMilkFlowLph).toBe(450);
      expect(getPatentPhysicsParams(id).feedRateLph).toBe(450);
      expect(getPatentPhysicsParams(id).flow).toBe(450);
      expect(getPatentPhysicsParams(id).milkFlowLph).toBe(450);
      expect(getPatentPhysicsParams(id).feedFlow).toBe(450);
    } finally {
      unsubscribe();
      resetPatentPhysicsParams(id);
    }
  });

  test("Hewitt Mercury Lamp aliases update canonical controls, notify subscribers, and update metrics", () => {
    const id = "us-682690-hewitt-mercury-lamp";
    resetPatentPhysicsParams(id);
    const initial = PATENT_PHYSICS_REGISTRY[id].computeMetrics(getPatentPhysicsParams(id));
    const observations: number[] = [];
    const unsubscribe = subscribePatentPhysics(id, (params) =>
      observations.push(params.mainsVoltageV),
    );
    try {
      setPatentPhysicsParam(id, "arcVoltage", 130);
      const params = getPatentPhysicsParams(id);
      expect(params.mainsVoltageV).toBe(130);
      expect(params.voltage).toBe(130);
      expect(params.vMains).toBe(130);
      expect(params.arcVoltage).toBe(130);
      expect(observations).toEqual([130]);
      expect(getLastParamChange(id)?.id).toBe("mainsVoltageV");

      const changed = PATENT_PHYSICS_REGISTRY[id].computeMetrics(params);
      expect(changed.find((m) => m.label === "Arc Tube Voltage")?.value).not.toBe(
        initial.find((m) => m.label === "Arc Tube Voltage")?.value,
      );

      setPatentPhysicsParam(id, "ballast", 18);
      expect(getPatentPhysicsParams(id).ballastResistanceOhms).toBe(18);
      expect(getPatentPhysicsParams(id).ballast).toBe(18);
      expect(getPatentPhysicsParams(id).ballastOhms).toBe(18);
      expect(getPatentPhysicsParams(id).rBallast).toBe(18);

      setPatentPhysicsParam(id, "length", 120);
      expect(getPatentPhysicsParams(id).tubeLengthCm).toBe(120);
      expect(getPatentPhysicsParams(id).tubeLength).toBe(120);
      expect(getPatentPhysicsParams(id).length).toBe(120);
    } finally {
      unsubscribe();
      resetPatentPhysicsParams(id);
    }
  });

  test("Linde Air Liquefaction aliases update canonical controls, notify subscribers, and update metrics", () => {
    const id = "us-727650-linde-air-liquefaction";
    resetPatentPhysicsParams(id);
    const initial = PATENT_PHYSICS_REGISTRY[id].computeMetrics(getPatentPhysicsParams(id));
    const observations: number[] = [];
    const unsubscribe = subscribePatentPhysics(id, (params) =>
      observations.push(params.inletPressureAtm),
    );
    try {
      setPatentPhysicsParam(id, "pHigh", 120);
      const params = getPatentPhysicsParams(id);
      expect(params.inletPressureAtm).toBe(120);
      expect(params.pressure).toBe(120);
      expect(params.inletPressure).toBe(120);
      expect(params.throttlePressureBar).toBe(120);
      expect(params.pHigh).toBe(120);
      expect(observations).toEqual([120]);
      expect(getLastParamChange(id)?.id).toBe("inletPressureAtm");

      const changed = PATENT_PHYSICS_REGISTRY[id].computeMetrics(params);
      expect(changed.find((m) => m.label === "High-pressure p")?.value).not.toBe(
        initial.find((m) => m.label === "High-pressure p")?.value,
      );

      setPatentPhysicsParam(id, "tCooler", -5);
      expect(getPatentPhysicsParams(id).coolerOutletC).toBe(-5);
      expect(getPatentPhysicsParams(id).coolerTempC).toBe(-5);
      expect(getPatentPhysicsParams(id).temperature).toBe(-5);
      expect(getPatentPhysicsParams(id).tCooler).toBe(-5);
    } finally {
      unsubscribe();
      resetPatentPhysicsParams(id);
    }
  });

  test("Carrier Air Conditioner aliases update canonical controls, notify subscribers, and update metrics", () => {
    const id = "us-808897-carrier-air-conditioner";
    resetPatentPhysicsParams(id);
    const initial = PATENT_PHYSICS_REGISTRY[id].computeMetrics(getPatentPhysicsParams(id));
    const observations: number[] = [];
    const unsubscribe = subscribePatentPhysics(id, (params) =>
      observations.push(params.airflowCfm),
    );
    try {
      setPatentPhysicsParam(id, "cfm", 22000);
      const params = getPatentPhysicsParams(id);
      expect(params.airflowCfm).toBe(22000);
      expect(params.airflow).toBe(22000);
      expect(params.cfm).toBe(22000);
      expect(params.flowRateCfm).toBe(22000);
      expect(observations).toEqual([22000]);
      expect(getLastParamChange(id)?.id).toBe("airflowCfm");

      const changed = PATENT_PHYSICS_REGISTRY[id].computeMetrics(params);
      expect(changed.find((m) => m.label === "Separator Pressure Loss")?.value).not.toBe(
        initial.find((m) => m.label === "Separator Pressure Loss")?.value,
      );

      setPatentPhysicsParam(id, "spray", 85);
      expect(getPatentPhysicsParams(id).sprayRatePct).toBe(85);
      expect(getPatentPhysicsParams(id).sprayRate).toBe(85);
      expect(getPatentPhysicsParams(id).spray).toBe(85);
      expect(getPatentPhysicsParams(id).sprayPct).toBe(85);

      setPatentPhysicsParam(id, "faces", 8);
      expect(getPatentPhysicsParams(id).separatorFaces).toBe(8);
      expect(getPatentPhysicsParams(id).plates).toBe(8);
      expect(getPatentPhysicsParams(id).faces).toBe(8);
      expect(getPatentPhysicsParams(id).turns).toBe(8);
    } finally {
      unsubscribe();
      resetPatentPhysicsParams(id);
    }
  });

  test("Lamarr Frequency Hopping aliases update canonical controls, notify subscribers, and update metrics", () => {
    const id = "us-2292387-lamarr-frequency-hopping";
    resetPatentPhysicsParams(id);
    const initial = PATENT_PHYSICS_REGISTRY[id].computeMetrics(getPatentPhysicsParams(id));
    const observations: number[] = [];
    const unsubscribe = subscribePatentPhysics(id, (params) =>
      observations.push(params.recordPosition),
    );
    try {
      setPatentPhysicsParam(id, "position", 4);
      const params = getPatentPhysicsParams(id);
      expect(params.recordPosition).toBe(4);
      expect(params.position).toBe(4);
      expect(params.pos).toBe(4);
      expect(params.recordIndex).toBe(4);
      expect(observations).toEqual([4]);
      expect(getLastParamChange(id)?.id).toBe("recordPosition");

      const changed = PATENT_PHYSICS_REGISTRY[id].computeMetrics(params);
      expect(changed.find((m) => m.label === "Transmitter record row")?.value).not.toBe(
        initial.find((m) => m.label === "Transmitter record row")?.value,
      );

      setPatentPhysicsParam(id, "tone", 500);
      expect(getPatentPhysicsParams(id).commandTone).toBe(500);
      expect(getPatentPhysicsParams(id).tone).toBe(500);
      expect(getPatentPhysicsParams(id).toneCycles).toBe(500);
    } finally {
      unsubscribe();
      resetPatentPhysicsParams(id);
    }
  });

  test("Carlson Electrophotography aliases update canonical controls, notify subscribers, and update metrics", () => {
    const id = "us-2297691-carlson-electrophotography";
    resetPatentPhysicsParams(id);
    const initial = PATENT_PHYSICS_REGISTRY[id].computeMetrics(getPatentPhysicsParams(id));
    const observations: number[] = [];
    const unsubscribe = subscribePatentPhysics(id, (params) =>
      observations.push(params.coronaVoltageKv),
    );
    try {
      setPatentPhysicsParam(id, "coronaKv", 7.5);
      const params = getPatentPhysicsParams(id);
      expect(params.coronaVoltageKv).toBe(7.5);
      expect(params.coronaVoltage).toBe(7.5);
      expect(params.coronaKv).toBe(7.5);
      expect(params.gridVoltage).toBe(7.5);
      expect(observations).toEqual([7.5]);
      expect(getLastParamChange(id)?.id).toBe("coronaVoltageKv");

      const changed = PATENT_PHYSICS_REGISTRY[id].computeMetrics(params);
      expect(changed.find((m) => m.label === "Initial Surface Charge")?.value).not.toBe(
        initial.find((m) => m.label === "Initial Surface Charge")?.value,
      );

      setPatentPhysicsParam(id, "exposureSec", 20);
      expect(getPatentPhysicsParams(id).exposureLuxSec).toBe(20);
      expect(getPatentPhysicsParams(id).exposureSec).toBe(20);
      expect(getPatentPhysicsParams(id).luxSec).toBe(20);

      setPatentPhysicsParam(id, "thicknessUm", 45);
      expect(getPatentPhysicsParams(id).layerThicknessUm).toBe(45);
      expect(getPatentPhysicsParams(id).layerThickness).toBe(45);
      expect(getPatentPhysicsParams(id).thicknessUm).toBe(45);

      setPatentPhysicsParam(id, "fuserTemp", 200);
      expect(getPatentPhysicsParams(id).fuserTemperatureC).toBe(200);
      expect(getPatentPhysicsParams(id).fuserTemp).toBe(200);
      expect(getPatentPhysicsParams(id).fuserTemperature).toBe(200);
    } finally {
      unsubscribe();
      resetPatentPhysicsParams(id);
    }
  });

  test("Baekeland Bakelite aliases update canonical controls, notify subscribers, and update metrics", () => {
    const id = "us-942699-baekeland-bakelite";
    resetPatentPhysicsParams(id);
    const initial = PATENT_PHYSICS_REGISTRY[id].computeMetrics(getPatentPhysicsParams(id));
    const observations: number[] = [];
    const unsubscribe = subscribePatentPhysics(id, (params) =>
      observations.push(params.curingTempC),
    );
    try {
      setPatentPhysicsParam(id, "cureTemp", 165);
      const params = getPatentPhysicsParams(id);
      expect(params.curingTempC).toBe(165);
      expect(params.temp).toBe(165);
      expect(params.temperature).toBe(165);
      expect(params.cureTemp).toBe(165);
      expect(observations).toEqual([165]);
      expect(getLastParamChange(id)?.id).toBe("curingTempC");

      const changed = PATENT_PHYSICS_REGISTRY[id].computeMetrics(params);
      expect(changed.find((m) => m.label === "Crosslink Conversion")?.value).not.toBe(
        initial.find((m) => m.label === "Crosslink Conversion")?.value,
      );

      setPatentPhysicsParam(id, "pressure", 140);
      expect(getPatentPhysicsParams(id).autoclavePressurePsi).toBe(140);
      expect(getPatentPhysicsParams(id).pressure).toBe(140);
      expect(getPatentPhysicsParams(id).pressurePsi).toBe(140);

      setPatentPhysicsParam(id, "catalyst", 3.5);
      expect(getPatentPhysicsParams(id).catalystPct).toBe(3.5);
      expect(getPatentPhysicsParams(id).catalyst).toBe(3.5);

      setPatentPhysicsParam(id, "curingTime", 90);
      expect(getPatentPhysicsParams(id).curingTimeMin).toBe(90);
      expect(getPatentPhysicsParams(id).curingTime).toBe(90);
      expect(getPatentPhysicsParams(id).timeMin).toBe(90);
    } finally {
      unsubscribe();
      resetPatentPhysicsParams(id);
    }
  });

  test("Nobel Dynamite aliases update canonical controls, notify subscribers, and update metrics", () => {
    const id = "us-78317-nobel-dynamite";
    resetPatentPhysicsParams(id);
    const initial = PATENT_PHYSICS_REGISTRY[id].computeMetrics(getPatentPhysicsParams(id));
    const observations: number[] = [];
    const unsubscribe = subscribePatentPhysics(id, (params) =>
      observations.push(params.ngConcentrationPct),
    );
    try {
      setPatentPhysicsParam(id, "absorption", 80);
      const params = getPatentPhysicsParams(id);
      expect(params.ngConcentrationPct).toBe(80);
      expect(params.ngPercentage).toBe(80);
      expect(params.ngPct).toBe(80);
      expect(params.nitroglycerinRatioPct).toBe(80);
      expect(params.absorption).toBe(80);
      expect(observations).toEqual([80]);
      expect(getLastParamChange(id)?.id).toBe("ngConcentrationPct");

      const changed = PATENT_PHYSICS_REGISTRY[id].computeMetrics(params);
      expect(changed.find((m) => m.label === "Detonation Velocity")?.value).not.toBe(
        initial.find((m) => m.label === "Detonation Velocity")?.value,
      );

      setPatentPhysicsParam(id, "primerEnergy", 2.4);
      expect(getPatentPhysicsParams(id).capEnergyJoules).toBe(2.4);
      expect(getPatentPhysicsParams(id).capEnergy).toBe(2.4);
      expect(getPatentPhysicsParams(id).capEnergyJ).toBe(2.4);
      expect(getPatentPhysicsParams(id).capJoules).toBe(2.4);
      expect(getPatentPhysicsParams(id).primerEnergy).toBe(2.4);

      // Claim 1 constraint toggle
      const claim1Param = claimConstraintStateParamId(1);
      setPatentPhysicsParam(id, claim1Param, 0);
      expect(getPatentPhysicsParams(id)[claim1Param]).toBe(0);
      expect(getEffectivePatentPhysicsParams(id).claim1Active).toBe(0);
      expect(getEffectivePatentPhysicsParams(id).isInitiated).toBe(0);
    } finally {
      unsubscribe();
      resetPatentPhysicsParams(id);
    }
  });

  test("Bardeen Transistor aliases update canonical controls, notify subscribers, and update metrics", () => {
    const id = "us-2524035-bardeen-transistor";
    resetPatentPhysicsParams(id);
    const initial = PATENT_PHYSICS_REGISTRY[id].computeMetrics(getPatentPhysicsParams(id));
    const observations: number[] = [];
    const unsubscribe = subscribePatentPhysics(id, (params) =>
      observations.push(params.pointSpacingMils),
    );
    try {
      setPatentPhysicsParam(id, "contactSpacing", 4.5);
      const params = getPatentPhysicsParams(id);
      expect(params.pointSpacingMils).toBe(4.5);
      expect(params.pointSpacing).toBe(4.5);
      expect(params.spacing).toBe(4.5);
      expect(params.spacingMils).toBe(4.5);
      expect(params.contactSpacing).toBe(4.5);
      expect(observations).toEqual([4.5]);
      expect(getLastParamChange(id)?.id).toBe("pointSpacingMils");

      const changed = PATENT_PHYSICS_REGISTRY[id].computeMetrics(params);
      expect(changed.find((m) => m.label === "Selected Contact Gap")?.value).not.toBe(
        initial.find((m) => m.label === "Selected Contact Gap")?.value,
      );

      setPatentPhysicsParam(id, "sample", 2);
      expect(getPatentPhysicsParams(id).operatingSample).toBe(2);
      expect(getPatentPhysicsParams(id).sample).toBe(2);
      expect(getPatentPhysicsParams(id).sampleNumber).toBe(2);
      expect(getPatentPhysicsParams(id).tableSample).toBe(2);

      const changedSample = PATENT_PHYSICS_REGISTRY[id].computeMetrics(getPatentPhysicsParams(id));
      expect(changedSample.find((m) => m.label === "Reported Voltage Gain")?.value).not.toBe(
        initial.find((m) => m.label === "Reported Voltage Gain")?.value,
      );

      // Claim 1 constraint toggle
      const claim1Param = claimConstraintStateParamId(1);
      setPatentPhysicsParam(id, claim1Param, 0);
      expect(getPatentPhysicsParams(id)[claim1Param]).toBe(0);
      expect(getEffectivePatentPhysicsParams(id).claim1Active).toBe(0);
    } finally {
      unsubscribe();
      resetPatentPhysicsParams(id);
    }
  });

  test("Zeppelin Airship aliases update canonical controls, notify subscribers, and update metrics", () => {
    const id = "us-621195-zeppelin-airship";
    resetPatentPhysicsParams(id);
    const initial = PATENT_PHYSICS_REGISTRY[id].computeMetrics(getPatentPhysicsParams(id));
    const observations: number[] = [];
    const unsubscribe = subscribePatentPhysics(id, (params) =>
      observations.push(params.gasInflation),
    );
    try {
      setPatentPhysicsParam(id, "inflation", 88);
      const params = getPatentPhysicsParams(id);
      expect(params.gasInflation).toBe(88);
      expect(params.gasInflationPct).toBe(88);
      expect(params.inflation).toBe(88);
      expect(params.inflationPct).toBe(88);
      expect(observations).toEqual([88]);
      expect(getLastParamChange(id)?.id).toBe("gasInflation");

      const changed = PATENT_PHYSICS_REGISTRY[id].computeMetrics(params);
      expect(changed.find((m) => m.label === "Gross Buoyancy")?.value).not.toBe(
        initial.find((m) => m.label === "Gross Buoyancy")?.value,
      );

      setPatentPhysicsParam(id, "speed", 35);
      expect(getPatentPhysicsParams(id).flightSpeedKnots).toBe(35);
      expect(getPatentPhysicsParams(id).speed).toBe(35);
      expect(getPatentPhysicsParams(id).speedKnots).toBe(35);
      expect(getPatentPhysicsParams(id).airspeedKnots).toBe(35);
      expect(getPatentPhysicsParams(id).flightSpeed).toBe(35);

      setPatentPhysicsParam(id, "altitude", 800);
      expect(getPatentPhysicsParams(id).flightAlt).toBe(800);
      expect(getPatentPhysicsParams(id).altitude).toBe(800);
      expect(getPatentPhysicsParams(id).altitudeM).toBe(800);
      expect(getPatentPhysicsParams(id).alt).toBe(800);

      setPatentPhysicsParam(id, "ballast", -8);
      expect(getPatentPhysicsParams(id).trimWeight).toBe(-8);
      expect(getPatentPhysicsParams(id).trimWeightPosM).toBe(-8);
      expect(getPatentPhysicsParams(id).trim).toBe(-8);
      expect(getPatentPhysicsParams(id).ballast).toBe(-8);

      // Claim 1 constraint toggle
      const claim1Param = claimConstraintStateParamId(1);
      setPatentPhysicsParam(id, claim1Param, 0);
      expect(getPatentPhysicsParams(id)[claim1Param]).toBe(0);
      expect(getEffectivePatentPhysicsParams(id).claim1Active).toBe(0);
    } finally {
      unsubscribe();
      resetPatentPhysicsParams(id);
    }
  });

  test("Sikorsky Helicopter aliases update canonical controls, notify subscribers, and update metrics", () => {
    const id = "us-2318259-sikorsky-helicopter";
    resetPatentPhysicsParams(id);
    const initial = PATENT_PHYSICS_REGISTRY[id].computeMetrics(getPatentPhysicsParams(id));
    const observations: number[] = [];
    const unsubscribe = subscribePatentPhysics(id, (params) =>
      observations.push(params.collectivePitchDeg),
    );
    try {
      setPatentPhysicsParam(id, "collective", 9.5);
      const params = getPatentPhysicsParams(id);
      expect(params.collectivePitchDeg).toBe(9.5);
      expect(params.collective).toBe(9.5);
      expect(params.collectivePitch).toBe(9.5);
      expect(params.pitchDeg).toBe(9.5);
      expect(observations).toEqual([9.5]);
      expect(getLastParamChange(id)?.id).toBe("collectivePitchDeg");

      const changed = PATENT_PHYSICS_REGISTRY[id].computeMetrics(params);
      expect(changed.find((m) => m.label === "Main Rotor Thrust")?.value).not.toBe(
        initial.find((m) => m.label === "Main Rotor Thrust")?.value,
      );

      setPatentPhysicsParam(id, "pedal", 25);
      expect(getPatentPhysicsParams(id).tailRotorPedalPercent).toBe(25);
      expect(getPatentPhysicsParams(id).pedal).toBe(25);
      expect(getPatentPhysicsParams(id).pedals).toBe(25);
      expect(getPatentPhysicsParams(id).tailPedal).toBe(25);
      expect(getPatentPhysicsParams(id).rudderPedals).toBe(25);
      expect(getPatentPhysicsParams(id).pedalPercent).toBe(25);

      setPatentPhysicsParam(id, "throttle", 92);
      expect(getPatentPhysicsParams(id).engineThrottlePercent).toBe(92);
      expect(getPatentPhysicsParams(id).throttle).toBe(92);
      expect(getPatentPhysicsParams(id).throttlePercent).toBe(92);
      expect(getPatentPhysicsParams(id).engineThrottle).toBe(92);

      setPatentPhysicsParam(id, "cyclicPitch", -3.5);
      expect(getPatentPhysicsParams(id).cyclicPitchForwardDeg).toBe(-3.5);
      expect(getPatentPhysicsParams(id).cyclicPitch).toBe(-3.5);
      expect(getPatentPhysicsParams(id).cyclicPitchDeg).toBe(-3.5);

      setPatentPhysicsParam(id, "cyclicRoll", 4.0);
      expect(getPatentPhysicsParams(id).cyclicRollRightDeg).toBe(4.0);
      expect(getPatentPhysicsParams(id).cyclicRoll).toBe(4.0);
      expect(getPatentPhysicsParams(id).cyclicRollDeg).toBe(4.0);

      // Claim 1 and Claim 2 constraint toggles
      const claim1Param = claimConstraintStateParamId(1);
      const claim2Param = claimConstraintStateParamId(2);

      setPatentPhysicsParam(id, claim1Param, 0);
      expect(getPatentPhysicsParams(id)[claim1Param]).toBe(0);
      expect(getEffectivePatentPhysicsParams(id).collectiveThrottleLinked).toBe(0);

      setPatentPhysicsParam(id, claim2Param, 0);
      expect(getPatentPhysicsParams(id)[claim2Param]).toBe(0);
      expect(getEffectivePatentPhysicsParams(id).auxiliaryRotorEnabled).toBe(0);
    } finally {
      unsubscribe();
      resetPatentPhysicsParams(id);
    }
  });

  test("Goodyear Rubber updates aliases, notifies reactive subscribers, and enforces Claim 1 constraint", () => {
    const id = "us-3633-goodyear-rubber";
    resetPatentPhysicsParams(id);
    const observations: number[] = [];
    const unsubscribe = subscribePatentPhysics(id, (p) => observations.push(p.vulcanTemp));

    try {
      setPatentPhysicsParam(id, "cureTemp", 160);
      const params = getPatentPhysicsParams(id);
      expect(params.vulcanTemp).toBe(160);
      expect(params.cureTemp).toBe(160);
      expect(params.vulcanizationTempC).toBe(160);
      expect(observations).toEqual([160]);

      setPatentPhysicsParam(id, "sulfur", 12);
      expect(getPatentPhysicsParams(id).sulfurPct).toBe(12);
      expect(getPatentPhysicsParams(id).sulfur).toBe(12);

      setPatentPhysicsParam(id, "specimenTemp", 45);
      expect(getPatentPhysicsParams(id).specimenTempC).toBe(45);
      expect(getPatentPhysicsParams(id).specimenTemp).toBe(45);

      setPatentPhysicsParam(id, "stretch", 2.0);
      expect(getPatentPhysicsParams(id).appliedTensileStretch).toBe(2.0);
      expect(getPatentPhysicsParams(id).stretch).toBe(2.0);

      // Claim 1 constraint toggle
      const claim1Param = claimConstraintStateParamId(1);
      setPatentPhysicsParam(id, claim1Param, 0);
      expect(getPatentPhysicsParams(id)[claim1Param]).toBe(0);
      const effective = getEffectivePatentPhysicsParams(id);
      expect(effective.claim1Active).toBe(0);
    } finally {
      unsubscribe();
      resetPatentPhysicsParams(id);
    }
  });

  test("Rillieux Evaporator updates aliases, notifies reactive subscribers, and enforces Claim 1 constraint", () => {
    const id = "us-3237-rillieux-evaporator";
    resetPatentPhysicsParams(id);
    const observations: number[] = [];
    const unsubscribe = subscribePatentPhysics(id, (p) => observations.push(p.juiceFeedRateKgPerH));

    try {
      setPatentPhysicsParam(id, "feedRate", 15000);
      const params = getPatentPhysicsParams(id);
      expect(params.juiceFeedRateKgPerH).toBe(15000);
      expect(params.juiceFeedRate).toBe(15000);
      expect(params.feedRate).toBe(15000);
      expect(observations).toEqual([15000]);

      setPatentPhysicsParam(id, "brixIn", 16.5);
      expect(getPatentPhysicsParams(id).initialBrixDeg).toBe(16.5);
      expect(getPatentPhysicsParams(id).initialBrix).toBe(16.5);
      expect(getPatentPhysicsParams(id).brixIn).toBe(16.5);

      setPatentPhysicsParam(id, "brixOut", 68.0);
      expect(getPatentPhysicsParams(id).targetBrixDeg).toBe(68.0);
      expect(getPatentPhysicsParams(id).targetBrix).toBe(68.0);
      expect(getPatentPhysicsParams(id).brixOut).toBe(68.0);

      setPatentPhysicsParam(id, "effects", 4);
      expect(getPatentPhysicsParams(id).numberOfEffects).toBe(4);
      expect(getPatentPhysicsParams(id).effects).toBe(4);

      // Claim 1 constraint toggle
      const claim1Param = claimConstraintStateParamId(1);
      setPatentPhysicsParam(id, claim1Param, 0);
      expect(getPatentPhysicsParams(id)[claim1Param]).toBe(0);
      const effective = getEffectivePatentPhysicsParams(id);
      expect(effective.claim1Active).toBe(0);
    } finally {
      unsubscribe();
      resetPatentPhysicsParams(id);
    }
  });

  test("Bell Telephone updates aliases, notifies reactive subscribers, and enforces Claim 1 constraint", () => {
    const id = "us-174465-bell-telephone";
    resetPatentPhysicsParams(id);
    const observations: number[] = [];
    const unsubscribe = subscribePatentPhysics(id, (p) => observations.push(p.batteryVoltage));

    try {
      setPatentPhysicsParam(id, "voltage", 9);
      const params = getPatentPhysicsParams(id);
      expect(params.batteryVoltage).toBe(9);
      expect(params.voltage).toBe(9);
      expect(params.volts).toBe(9);
      expect(observations).toEqual([9]);

      setPatentPhysicsParam(id, "spl", 82);
      expect(getPatentPhysicsParams(id).voiceAmplitude).toBe(82);
      expect(getPatentPhysicsParams(id).voiceLevelDb).toBe(82);
      expect(getPatentPhysicsParams(id).spl).toBe(82);

      setPatentPhysicsParam(id, "freq", 520);
      expect(getPatentPhysicsParams(id).acousticFrequencyHz).toBe(520);
      expect(getPatentPhysicsParams(id).frequency).toBe(520);
      expect(getPatentPhysicsParams(id).freq).toBe(520);

      setPatentPhysicsParam(id, "gap", 0.45);
      expect(getPatentPhysicsParams(id).airGap).toBe(0.45);
      expect(getPatentPhysicsParams(id).diaphragmGapMm).toBe(0.45);
      expect(getPatentPhysicsParams(id).gap).toBe(0.45);

      setPatentPhysicsParam(id, "sigma", 2.1);
      expect(getPatentPhysicsParams(id).liquidConductivity).toBe(2.1);
      expect(getPatentPhysicsParams(id).conductivity).toBe(2.1);
      expect(getPatentPhysicsParams(id).sigma).toBe(2.1);

      // Claim 1 constraint toggle
      const claim1Param = claimConstraintStateParamId(1);
      setPatentPhysicsParam(id, claim1Param, 0);
      expect(getPatentPhysicsParams(id)[claim1Param]).toBe(0);
      const effective = getEffectivePatentPhysicsParams(id);
      expect(effective.claim1Active).toBe(0);
    } finally {
      unsubscribe();
      resetPatentPhysicsParams(id);
    }
  });

  test("Diesel Engine updates aliases, notifies reactive subscribers, and enforces Claim 1 constraint", () => {
    const id = "us-542846-diesel-engine";
    resetPatentPhysicsParams(id);
    const observations: number[] = [];
    const unsubscribe = subscribePatentPhysics(id, (p) => observations.push(p.engineRpm));

    try {
      setPatentPhysicsParam(id, "rpm", 220);
      const params = getPatentPhysicsParams(id);
      expect(params.engineRpm).toBe(220);
      expect(params.rpm).toBe(220);
      expect(observations).toEqual([220]);

      setPatentPhysicsParam(id, "compressionRatio", 19.5);
      expect(getPatentPhysicsParams(id).compRatio).toBe(19.5);
      expect(getPatentPhysicsParams(id).compressionRatio).toBe(19.5);

      setPatentPhysicsParam(id, "blastPressure", 72);
      expect(getPatentPhysicsParams(id).blastAirPressure).toBe(72);
      expect(getPatentPhysicsParams(id).blastAirPressureBar).toBe(72);
      expect(getPatentPhysicsParams(id).blastPressure).toBe(72);

      setPatentPhysicsParam(id, "cutoff", 1.8);
      expect(getPatentPhysicsParams(id).cutoffRatio).toBe(1.8);
      expect(getPatentPhysicsParams(id).cutoff).toBe(1.8);

      // Claim 1 constraint toggle
      const claim1Param = claimConstraintStateParamId(1);
      setPatentPhysicsParam(id, claim1Param, 0);
      expect(getPatentPhysicsParams(id)[claim1Param]).toBe(0);
      const effective = getEffectivePatentPhysicsParams(id);
      expect(effective.claim1Active).toBe(0);
    } finally {
      unsubscribe();
      resetPatentPhysicsParams(id);
    }
  });
});
