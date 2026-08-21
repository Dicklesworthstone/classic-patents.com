import { describe, expect, it } from "bun:test";
import { allPatents, getPatentById } from "@/data/patents";
import { parsePatentCatalog } from "@/data/patents/schema";
import { PATENT_PHYSICS_REGISTRY } from "@/physics";
import { FrankenSimEngine } from "@/physics/engine";

describe("Classic Patents Catalog Integrity", () => {
  it("should contain all curated patents", () => {
    expect(allPatents.length).toBeGreaterThanOrEqual(55);
  });

  it("should have chronological order across all patents", () => {
    for (let i = 0; i < allPatents.length - 1; i++) {
      const curr = new Date(allPatents[i].grantDate).getTime();
      const next = new Date(allPatents[i + 1].grantDate).getTime();
      expect(curr).toBeLessThanOrEqual(next);
    }
  });

  it("should have valid required fields for every patent", () => {
    for (const patent of allPatents) {
      expect(patent.id).toBeTruthy();
      expect(patent.patentNumber).toBeTruthy();
      expect(patent.title).toBeTruthy();
      expect(patent.inventors.length).toBeGreaterThan(0);
      expect(patent.grantDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      const noFormalClaims =
        patent.archivalEdition?.claimStatus?.kind === "no-formal-claims-in-facsimile" ||
        (patent.claims.length === 0 && patent.stats?.totalClaims === 0 && !patent.archivalEdition);
      expect(patent.claims.length > 0 || noFormalClaims).toBeTrue();
      expect(patent.originalPdfUrl).toBeTruthy();
      expect(patent.plainEnglishExplanation.overview).toBeTruthy();
      expect(patent.plainEnglishExplanation.mechanicalBreakdown.length).toBeGreaterThan(0);
    }
  });

  it("should retrieve every patent by its canonical id", () => {
    for (const patent of allPatents) {
      const found = getPatentById(patent.id);
      expect(found).toBeDefined();
      expect(found?.id).toBe(patent.id);
    }
  });

  it("permits a documented unavailable filing date without inventing a substitute", () => {
    const source = allPatents[0];
    if (!source) throw new Error("Expected a catalog record for null filing-date validation");

    const [parsed] = parsePatentCatalog([{ ...source, filingDate: null }]);
    expect(parsed?.filingDate).toBeNull();
  });
});

describe("FrankenSim Physics Telemetry Gate", () => {
  it("should compute non-NaN SI metrics for every registered physics model", () => {
    for (const [_id, model] of Object.entries(PATENT_PHYSICS_REGISTRY)) {
      const defaultParams: Record<string, number> = {};
      for (const ctrl of model.controls) {
        defaultParams[ctrl.id] = ctrl.defaultValue;
      }
      const metrics = model.computeMetrics(defaultParams);
      expect(metrics.length).toBeGreaterThan(0);
      for (const m of metrics) {
        expect(m.label).toBeTruthy();
        if (typeof m.value === "number") {
          expect(Number.isNaN(m.value)).toBeFalse();
        }
      }
    }
  });

  it("should verify core physics functions execute without errors", () => {
    // Wright Flyer
    const wright = FrankenSimEngine.stepWrightFlyer(
      {
        airspeedMps: 13.4,
        altitudeMeters: 3.5,
        angleOfAttackRad: 0.073,
        sideslipRad: 0,
        wingWarpDeflectionDeg: 0,
        rudderDeflectionDeg: 0,
        elevatorDeflectionDeg: 0,
        liftNewtons: 3400,
        inducedDragNewtons: 480,
        parasiticDragNewtons: 120,
        thrustNewtons: 500,
        pitchRateRps: 0,
        rollRateRps: 0,
        yawRateRps: 0,
      },
      { wingWarpDeg: 5, rudderDeg: -3, elevatorDeg: 2, dt: 0.016 },
    );
    expect(wright.liftNewtons).toBeGreaterThan(0);

    // Tesla Motor
    const tesla = FrankenSimEngine.stepTeslaMotorFig9(60);
    expect(tesla.poleShiftRpm).toBe(tesla.generatorRpm);
    expect(tesla.usesGeneratorContactRings).toBe(true);

    // Einstein Refrigerator
    const einstein = FrankenSimEngine.stepEinsteinRefrigerator(200, 10, 0.65);
    expect(einstein.coolingPowerWatts).toBeGreaterThan(0);

    // Goddard Rocket
    const rocket = FrankenSimEngine.stepGoddardRocket(300, 2.5);
    expect(rocket.thrustNewtons).toBeGreaterThan(0);

    // Fermi Reactor
    const fermi = FrankenSimEngine.stepFermiReactor(40, 99.8, 0.72);
    expect(fermi.kEffective).toBeGreaterThan(0);

    // Kevlar Polymer Continuum
    const kevlar = FrankenSimEngine.stepKevlarContinuum(4.5, 400);
    expect(kevlar.elasticModulusGpa).toBeGreaterThan(0);
  });
});
