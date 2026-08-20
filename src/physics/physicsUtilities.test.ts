import { describe, expect, test } from "bun:test";
import { blackbodyRgb } from "./blackbody";
import { energyChannelsFor } from "./energyChannels";
import { canonicalizeParam, expandParamAliases } from "./paramAliases";
import { formatSones, sonesFromDbSpl } from "./psycho";
import { qtyDimension } from "./qty";
import { TickScheduler } from "./tickScheduler";

describe("Shared Physics Mathematical Utilities & Conversions", () => {
  test("blackbodyRgb computes CIE RGB approximations across temperature ranges", () => {
    // Red-orange glow at low temperatures (~1200 K)
    const redGlow = blackbodyRgb(1200);
    expect(redGlow.startsWith("rgb(")).toBe(true);
    expect(redGlow).toContain("255");

    // White-hot incandescence (~2800 K)
    const incandescent = blackbodyRgb(2800);
    expect(incandescent.startsWith("rgb(")).toBe(true);

    // Bounded bounds check
    expect(blackbodyRgb(500)).toBe(blackbodyRgb(800));
    expect(blackbodyRgb(5000)).toBe(blackbodyRgb(4000));
  });

  test("sonesFromDbSpl and formatSones follow Stevens psychoacoustic power law", () => {
    // 40 dB SPL corresponds to 1 sone
    expect(sonesFromDbSpl(40)).toBeCloseTo(1.0, 2);

    // Doubling of perceived loudness every 10 dB above 40 dB
    expect(sonesFromDbSpl(50)).toBeCloseTo(2.0, 2);
    expect(sonesFromDbSpl(60)).toBeCloseTo(4.0, 2);
    expect(sonesFromDbSpl(70)).toBeCloseTo(8.0, 2);

    expect(formatSones(0.05)).toBe("0.05");
    expect(formatSones(4.2)).toBe("4.2");
    expect(formatSones(16.8)).toBe("17");
  });

  test("qtyDimension computes correct coarse dimensional analysis tags", () => {
    expect(qtyDimension("N")).toBe("ML/T²");
    expect(qtyDimension("N·m")).toBe("ML²/T²");
    expect(qtyDimension("W")).toBe("ML²/T³");
    expect(qtyDimension("J")).toBe("ML²/T²");
    expect(qtyDimension("V")).toBe("ML²/IT³");
    expect(qtyDimension("A")).toBe("I");
    expect(qtyDimension("Ω")).toBe("ML²/I²T³");
    expect(qtyDimension("K")).toBe("Θ");
    expect(qtyDimension("m/s")).toBe("L/T");
    expect(qtyDimension("Hz")).toBe("1/T");
    expect(qtyDimension("s")).toBe("T");
    expect(qtyDimension("m")).toBe("L");
    expect(qtyDimension("kg")).toBe("M");
    expect(qtyDimension("Pa")).toBe("M/LT²");
    expect(qtyDimension("dB")).toBe("1");
  });

  test("energyChannelsFor derives conservative energy flow partitions", () => {
    const wrightChannels = energyChannelsFor("us-821393-wright-flyer", { airspeed: 30 });
    expect(wrightChannels.map((c) => c.name)).toEqual([
      "Thrust · v",
      "Parasitic drag",
      "Induced drag",
    ]);
    expect(wrightChannels[1].watts + wrightChannels[2].watts).toBeCloseTo(
      wrightChannels[0].watts,
      1,
    );

    const edisonChannels = energyChannelsFor("us-223898-edison-lightbulb", { voltage: 110 });
    expect(edisonChannels.map((c) => c.name)).toEqual(["Joule heat", "Feeder I²R"]);
    expect(edisonChannels[0].tone).toBe("in");
    expect(edisonChannels[1].tone).toBe("loss");

    const goddardChannels = energyChannelsFor("us-1102653-goddard-rocket", {});
    expect(goddardChannels.length).toBe(2);
    expect(goddardChannels[0]?.name).toBe("Chem. enthalpy");
    expect(goddardChannels[1]?.name).toBe("Exhaust KE");
    expect(energyChannelsFor("us-2981877-noyce-ic", {})).toEqual([]);
    expect(energyChannelsFor("us-808897-carrier-air-conditioner", {})[0]?.name).toBe("Latent sink");
    expect(energyChannelsFor("us-608969-parsons-turbine", {})[0]?.name).toBe("Shaft");
    expect(energyChannelsFor("us-3858232-boyle-smith-ccd", {})).toEqual([]);
    expect(energyChannelsFor("us-3671542-kwolek-kevlar", {})).toEqual([]);
    expect(energyChannelsFor("us-586193-marconi-radio", {})[0]?.name).toBe("Spark RF");
    expect(energyChannelsFor("us-2292387-lamarr-frequency-hopping", {})).toEqual([]);
    expect(energyChannelsFor("us-2708656-fermi-reactor", {})[0]?.name).toBe("Fission heat");
    expect(energyChannelsFor("us-313224-mergenthaler-linotype", {})).toEqual([]);
    expect(energyChannelsFor("us-395781-hollerith-tabulating", {})).toEqual([]);
    expect(energyChannelsFor("us-542846-diesel-engine", {})).toEqual([]);
    expect(energyChannelsFor("us-3541541-engelbart-mouse", {})).toEqual([]);
    expect(energyChannelsFor("us-381968-tesla-motor", {})).toEqual([]);
    expect(energyChannelsFor("us-593138-tesla-coil", {})).toEqual([]);
    const davenport = energyChannelsFor("us-132-davenport-electric-motor", {});
    expect(davenport.map((c) => c.name)).toEqual(["Electrical", "Shaft", "Copper"]);
    expect(davenport[1].watts + davenport[2].watts).toBeCloseTo(davenport[0].watts, 1);
    expect(energyChannelsFor("us-347140-thomson-welding", {})[0]).toMatchObject({
      name: "I²R nugget",
      tone: "in",
    });
    expect(energyChannelsFor("us-347140-thomson-welding", {})[0]?.watts).toBeGreaterThan(0);
    expect(energyChannelsFor("us-194047-otto-engine", {})[0]?.name).toBe("Brake");
    expect(energyChannelsFor("us-6162-corliss-steam-engine", {})[0]?.name).toBe("Indicated");
    expect(energyChannelsFor("us-361931-daimler-engine", {})[0]?.name).toBe("Brake");
    expect(energyChannelsFor("us-233692-pelton-water-wheel", {})[0]?.name).toBe("Shaft");
    expect(energyChannelsFor("us-470918-reno-escalator", {})[0]?.name).toBe("Motor");
    expect(energyChannelsFor("us-319596-maxim-machine-gun", {})[0]).toMatchObject({
      name: "Jacket heat",
      tone: "loss",
    });
    expect(energyChannelsFor("us-319596-maxim-machine-gun", {})[0]?.watts).toBeGreaterThan(0);
    expect(energyChannelsFor("us-588-ericsson-propeller", {})[0]?.name).toBe("Thrust · v");
  });

  test("canonicalizeParam and expandParamAliases normalize 3D private slider keys", () => {
    const canonical = canonicalizeParam("us-319596-maxim-machine-gun", "fireRateRpm", 600);
    expect(canonical.id).toBe("firingRate");
    expect(canonical.value).toBe(600);

    const expanded = expandParamAliases("us-319596-maxim-machine-gun", { firingRate: 600 });
    expect(expanded.fireRateRpm).toBe(600);
    expect(expanded.firingRate).toBe(600);
  });

  test("TickScheduler manages fixed-step simulation time and bounds catch-up backlog", () => {
    const scheduler = new TickScheduler(0.016, 0.0, 3);
    let tickCount = 0;

    // Standard 3-tick pump step (t = 0.032s)
    const ran = scheduler.pump(0.032, () => {
      tickCount += 1;
    });
    expect(ran).toBe(3);
    expect(tickCount).toBe(3);
    expect(scheduler.ticksRun).toBe(3);
    expect(scheduler.reanchors).toBe(0);

    // Extreme lag (1.0s backlog) — bounds catch-up and records reanchor
    const lagRan = scheduler.pump(1.0, () => {
      tickCount += 1;
    });
    expect(lagRan).toBeLessThanOrEqual(3);
    expect(scheduler.reanchors).toBeGreaterThan(0);
  });
});
