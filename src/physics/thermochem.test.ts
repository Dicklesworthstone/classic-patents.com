import { describe, expect, test } from "bun:test";
import { deLavalMeridian, goddardNozzleMatch, goddardThermo, vulcanKinetics } from "./thermochem";

describe("Thermochemical Kinetics & Nozzle Expansion Physics", () => {
  test("goddardThermo computes isentropic LOX-gasoline chamber temperature and exhaust velocity", () => {
    const thermo = goddardThermo(350, 3.5);
    expect(thermo.chamberTempK).toBeGreaterThan(2500);
    expect(thermo.exhaustTempK).toBeLessThan(thermo.chamberTempK);
    expect(thermo.veMps).toBeGreaterThan(1500);
    expect(thermo.ispSec).toBeGreaterThan(150);
    expect(thermo.gamma).toBe(1.24);
  });

  test("goddardNozzleMatch computes altitude-dependent optimal expansion ratio", () => {
    const seaLevel = goddardNozzleMatch(0, 3.5);
    expect(seaLevel.optimalEpsilon).toBeCloseTo(3.5, 1);
    expect(seaLevel.expansionEfficiencyPct).toBe(100);

    const highAlt = goddardNozzleMatch(20, 3.5);
    expect(highAlt.optimalEpsilon).toBeGreaterThan(seaLevel.optimalEpsilon);
  });

  test("deLavalMeridian generates converging-diverging nozzle geometry points", () => {
    const pts = deLavalMeridian(4.0);
    expect(pts.length).toBe(7);
    // Point 0 is chamber radius, Point 3 is throat (rt = 0.32), Point 6 is exit (re)
    const [rChamber] = pts[0];
    const [rThroat] = pts[3];
    const [rExit] = pts[6];

    expect(rThroat).toBe(0.32);
    expect(rChamber).toBeGreaterThan(rThroat);
    expect(rExit).toBeGreaterThan(rThroat);
  });

  test("vulcanKinetics computes Goodyear Arrhenius crosslink reaction rate across temperature regimes", () => {
    // Cold unreacted rubber (< 120 C)
    const cold = vulcanKinetics(80, 8);
    expect(cold.regime).toBe("too-cold");
    expect(cold.rateRel).toBeLessThan(0.1);

    // Optimal vulcanization cure window (145 C)
    const optimal = vulcanKinetics(145, 8);
    expect(optimal.regime).toBe("cure");
    expect(optimal.crosslinkMolCm3).toBeGreaterThan(0.1);

    // Thermal degradation / scorch regime (> 170 C)
    const scorch = vulcanKinetics(190, 8);
    expect(scorch.regime).toBe("scorch");
  });
});
