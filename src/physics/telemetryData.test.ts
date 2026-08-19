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
});
