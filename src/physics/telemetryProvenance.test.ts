import { describe, expect, it } from "bun:test";
import { PATENT_PHYSICS_REGISTRY } from "./telemetryData";
import { getProvenanceLabel } from "./telemetryProvenance";

describe("Telemetry Provenance Classification", () => {
  it("provides valid labels for all 5 classification categories", () => {
    const categories = [
      "source-disclosed",
      "scenario-modern",
      "scenario-reader",
      "topology-normalized",
      "refusal-bounded",
    ] as const;

    for (const cat of categories) {
      const label = getProvenanceLabel(cat);
      expect(label.key).toBe(cat);
      expect(label.shortLabel.length).toBeGreaterThan(0);
      expect(label.description.length).toBeGreaterThan(0);
      expect(label.badgeClass.length).toBeGreaterThan(0);
    }
  });

  it("ensures every registered patent computes finite and valid telemetry", () => {
    for (const [_patentId, meta] of Object.entries(PATENT_PHYSICS_REGISTRY)) {
      expect(meta.domain).toBeDefined();
      expect(meta.governingEquation).toBeDefined();
      expect(Array.isArray(meta.controls)).toBe(true);

      const metrics = meta.computeMetrics({});
      expect(Array.isArray(metrics)).toBe(true);
      expect(metrics.length).toBeGreaterThan(0);

      for (const m of metrics) {
        expect(m.label).toBeDefined();
        expect(m.value).toBeDefined();
        expect(m.unit).toBeDefined();
        expect(m.value).not.toBe("NaN");
        expect(m.value).not.toBe("Infinity");
      }
    }
  });
});
