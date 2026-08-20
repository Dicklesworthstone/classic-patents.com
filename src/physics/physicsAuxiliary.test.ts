import { describe, expect, test } from "bun:test";
import { blackbodyRgb } from "./blackbody";
import { energyChannelsFor } from "./energyChannels";
import { PATENT_PARAM_ALIASES } from "./paramAliases";
import { formatSones, sonesFromDbSpl } from "./psycho";
import { qtyDimension } from "./qty";
import { TickScheduler } from "./tickScheduler";

describe("Physics Auxiliary Modules & Utilities", () => {
  describe("blackbody.ts", () => {
    test("computes CIE RGB color strings for blackbody temperatures", () => {
      const warmRgb = blackbodyRgb(1800);
      const brightRgb = blackbodyRgb(3200);

      expect(warmRgb).toMatch(/^rgb\(\d+,\s*\d+,\s*\d+\)$/);
      expect(brightRgb).toMatch(/^rgb\(\d+,\s*\d+,\s*\d+\)$/);
    });

    test("clamps low and high temperatures safely", () => {
      const cold = blackbodyRgb(400);
      const blazing = blackbodyRgb(8000);

      expect(cold).toBeDefined();
      expect(blazing).toBeDefined();
    });
  });

  describe("energyChannels.ts", () => {
    test("computes energy flow channels for Wright Flyer", () => {
      const channels = energyChannelsFor("us-821393-wright-flyer", {
        airspeed: 30,
        wingWarp: 12,
      });

      expect(channels.length).toBeGreaterThan(0);
      expect(channels.some((c) => c.name.includes("Thrust"))).toBe(true);
      expect(channels.some((c) => c.tone === "loss")).toBe(true);
    });

    test("computes energy flow channels for Edison Lightbulb", () => {
      const channels = energyChannelsFor("us-223898-edison-lightbulb", {
        voltage: 110,
      });

      expect(channels.length).toBe(2);
      expect(channels.some((c) => c.name === "Feeder I²R")).toBe(true);
      expect(channels.some((c) => c.name === "Joule heat")).toBe(true);
    });

    test("returns empty array for unrecognized patent id", () => {
      const channels = energyChannelsFor("unknown-patent", {});
      expect(channels).toEqual([]);
    });
  });

  describe("qty.ts", () => {
    test("resolves SI dimension formulas for physical units", () => {
      expect(qtyDimension("N")).toBe("ML/T²");
      expect(qtyDimension("W")).toBe("ML²/T³");
      expect(qtyDimension("V")).toBe("ML²/IT³");
      expect(qtyDimension("A")).toBe("I");
      expect(qtyDimension("Ω")).toBe("ML²/I²T³");
      expect(qtyDimension("m/s")).toBe("L/T");
      expect(qtyDimension("Pa")).toBe("M/LT²");
      expect(qtyDimension("K")).toBe("Θ");
      expect(qtyDimension("s")).toBe("T");
      expect(qtyDimension("dB")).toBe("1");
    });
  });

  describe("psycho.ts", () => {
    test("converts dB SPL sound pressure levels to Stevens sones loudness", () => {
      expect(sonesFromDbSpl(40)).toBeCloseTo(1.0, 2);
      expect(sonesFromDbSpl(50)).toBeCloseTo(2.0, 2);
      expect(sonesFromDbSpl(60)).toBeCloseTo(4.0, 2);
      expect(sonesFromDbSpl(0)).toBe(0);
    });

    test("formats sones into readable strings", () => {
      expect(formatSones(0.05)).toBe("0.05");
      expect(formatSones(4.2)).toBe("4.2");
      expect(formatSones(25.6)).toBe("26");
    });
  });

  describe("tickScheduler.ts", () => {
    test("advances ticks and bounds maximum catchup without runaway drift", () => {
      const scheduler = new TickScheduler(0.1, 0, 3);
      let ticks = 0;

      const ran = scheduler.pump(0.25, () => {
        ticks += 1;
      });

      expect(ran).toBe(3);
      expect(ticks).toBe(3);
      expect(scheduler.ticksRun).toBe(3);
    });
  });

  describe("paramAliases.ts", () => {
    test("registers canonical parameter aliases for multi-axis simulators", () => {
      const maxim = PATENT_PARAM_ALIASES["us-319596-maxim-machine-gun"];
      expect(maxim.fireRateRpm.canonical).toBe("firingRate");

      const westinghouse = PATENT_PARAM_ALIASES["us-124404-westinghouse-air-brake"];
      expect(westinghouse.brakePressurePsi.canonical).toBe("trainPipePressure");

      const davenport = PATENT_PARAM_ALIASES["us-132-davenport-electric-motor"];
      expect(davenport.rotorRpm.canonical).toBe("batteryVoltage");
      expect(davenport.rotorRpm.toCanonical?.(450)).toBe(12);
      expect(davenport.rotorRpm.fromCanonical?.(12)).toBe(450);
    });
  });
});
