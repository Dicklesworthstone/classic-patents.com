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
});
