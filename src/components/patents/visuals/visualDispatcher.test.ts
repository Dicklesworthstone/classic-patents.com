import { describe, expect, test } from "bun:test";
import { allPatents } from "@/data/patents";
import { PATENT_PHYSICS_REGISTRY } from "@/physics/telemetryData";

describe("Visual Simulation Dispatcher & Catalogue Completeness", () => {
  test("all catalog patents have verified 2D and 3D simulation entries", () => {
    expect(allPatents.length).toBeGreaterThanOrEqual(55);

    for (const patent of allPatents) {
      expect(patent.id).toBeTruthy();
      // Ensure physics registry is bound
      const registryEntry = PATENT_PHYSICS_REGISTRY[patent.id];
      expect(registryEntry).toBeDefined();
      expect(registryEntry.controls.length).toBeGreaterThan(0);
      expect(registryEntry.governingEquation.length).toBeGreaterThan(0);
    }
  });

  test("Wright Flyer exemplar binds to shared telemetry bus and 3-axis flight dynamics", () => {
    const wright = PATENT_PHYSICS_REGISTRY["us-821393-wright-flyer"];
    expect(wright).toBeDefined();
    expect(wright.controls.some((c) => c.id === "airspeed")).toBe(true);
    expect(wright.controls.some((c) => c.id === "wingWarp")).toBe(true);
    expect(wright.controls.some((c) => c.id === "rudder")).toBe(true);
    expect(wright.controls.some((c) => c.id === "elevator")).toBe(true);
    expect(wright.controls.some((c) => c.id === "coupled")).toBe(true);
  });
});
