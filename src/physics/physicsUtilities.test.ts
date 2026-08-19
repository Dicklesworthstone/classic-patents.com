import { describe, expect, test } from "bun:test";
import { blackbodyRgb } from "./blackbody";
import { energyChannelsFor } from "./energyChannels";
import { canonicalizeParam, expandParamAliases } from "./paramAliases";
import { formatSones, sonesFromDbSpl } from "./psycho";
import { qtyDimension } from "./qty";

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
    expect(wrightChannels.length).toBe(3);
    expect(wrightChannels[0].tone).toBe("in");
    expect(wrightChannels[1].tone).toBe("useful");
    expect(wrightChannels[2].tone).toBe("loss");

    const edisonChannels = energyChannelsFor("us-223898-edison-lightbulb", { voltage: 110 });
    expect(edisonChannels.length).toBe(3);
    const sumEdison = edisonChannels[1].watts + edisonChannels[2].watts;
    expect(sumEdison).toBeCloseTo(edisonChannels[0].watts, 1);

    expect(energyChannelsFor("us-1102653-goddard-rocket", {})).toEqual([]);
    expect(energyChannelsFor("us-2981877-noyce-ic", {})).toEqual([]);
    expect(energyChannelsFor("us-808897-carrier-air-conditioner", {})).toEqual([]);
    expect(energyChannelsFor("us-608969-parsons-turbine", {})).toEqual([]);
    expect(energyChannelsFor("us-3858232-boyle-smith-ccd", {})).toEqual([]);
    expect(energyChannelsFor("us-3671542-kwolek-kevlar", {})).toEqual([]);
  });

  test("canonicalizeParam and expandParamAliases normalize 3D private slider keys", () => {
    const canonical = canonicalizeParam("us-319596-maxim-machine-gun", "fireRateRpm", 600);
    expect(canonical.id).toBe("firingRate");
    expect(canonical.value).toBe(600);

    const expanded = expandParamAliases("us-319596-maxim-machine-gun", { firingRate: 600 });
    expect(expanded.fireRateRpm).toBe(600);
    expect(expanded.firingRate).toBe(600);
  });
});
