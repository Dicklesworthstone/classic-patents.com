import { describe, expect, test } from "bun:test";
import { allPatents } from "@/data/patents";
import { PATENT_PHYSICS_REGISTRY } from "./telemetryData";
import {
  getLastParamChange,
  getPatentPhysicsParams,
  getPhysicsTick,
  resetPatentPhysicsParams,
  setPatentPhysicsParam,
} from "./usePatentPhysics";

const SHARED_CONTROL_PATENT_IDS = [
  "us-200521-edison-phonograph",
  "us-2846084-goertz-electronic-master-slave-manipulator",
  "us-2988237-devol-programmed-transfer",
  "us-3260375-lemelson-adjustable-manipulator",
] as const;

function metricEnvelope(
  patentId: (typeof SHARED_CONTROL_PATENT_IDS)[number],
  params: Record<string, number>,
) {
  return JSON.stringify(
    PATENT_PHYSICS_REGISTRY[patentId]
      .computeMetrics(params)
      .map((metric) => [metric.label, metric.value, metric.unit, metric.provenance]),
  );
}

function liveMetricEnvelope(patentId: string, params: Record<string, number>) {
  return PATENT_PHYSICS_REGISTRY[patentId]
    .computeMetrics(params)
    .map((metric) => `${metric.label} ${metric.value} ${metric.unit}`)
    .join("; ");
}

describe("shared-control telemetry sensitivity", () => {
  test("every catalogue patent's primary declared control changes the live telemetry envelope", () => {
    for (const patent of allPatents) {
      const registry = PATENT_PHYSICS_REGISTRY[patent.id];
      const control = registry.controls[0];
      if (!control) continue;
      const defaults = Object.fromEntries(
        registry.controls.map((candidate) => [candidate.id, candidate.defaultValue]),
      );
      const nextValue =
        control.defaultValue === control.max
          ? control.defaultValue - control.step
          : control.defaultValue + control.step;

      expect(
        liveMetricEnvelope(patent.id, { ...defaults, [control.id]: nextValue }),
        `${patent.id} ${control.id} must affect the exact value/unit envelope rendered by PhysicsTelemetryBadge`,
      ).not.toBe(liveMetricEnvelope(patent.id, defaults));
    }
  });

  test("every declared control changes the canonical telemetry envelope by one legal step", () => {
    for (const patentId of SHARED_CONTROL_PATENT_IDS) {
      const registry = PATENT_PHYSICS_REGISTRY[patentId];
      const defaults = Object.fromEntries(
        registry.controls.map((control) => [control.id, control.defaultValue]),
      );
      const baseline = metricEnvelope(patentId, defaults);

      for (const control of registry.controls) {
        const nextValue =
          control.defaultValue === control.max
            ? control.defaultValue - control.step
            : control.defaultValue + control.step;
        expect(
          metricEnvelope(patentId, { ...defaults, [control.id]: nextValue }),
          `${patentId} ${control.id} must affect a source-honest metric or refusal state`,
        ).not.toBe(baseline);
      }
    }
  });

  test("Devol's recorded program slot commits once to the canonical shared state", () => {
    const patentId = "us-2988237-devol-programmed-transfer";
    resetPatentPhysicsParams(patentId);
    const tickBefore = getPhysicsTick(patentId);

    setPatentPhysicsParam(patentId, "recordedSlot", 12);

    expect(getPatentPhysicsParams(patentId).recordedSlot).toBe(12);
    expect(getPhysicsTick(patentId)).toBe(tickBefore + 1);
    expect(getLastParamChange(patentId)).toMatchObject({
      id: "recordedSlot",
      from: 11,
      to: 12,
    });
    resetPatentPhysicsParams(patentId);
  });
});
