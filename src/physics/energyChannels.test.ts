import { describe, expect, it } from "bun:test";
import { allPatents } from "@/data/patents";
import { ENERGY_CHANNEL_OMISSION_REASONS, energyChannelsFor } from "./energyChannels";
import { readWattCondenserControls, stepWattCondenser } from "./wattCondenserKernel";

describe("Physics Energy Channels (SI Power & Heat Balances)", () => {
  it("Watt channels honor condenser and jacket controls without counting air-pump work twice", () => {
    for (const hasSeparateCondenser of [0, 1]) {
      for (const hasSteamJacket of [0, 1]) {
        const params = {
          boilerPressurePsi: 6,
          cylinderBoreInches: 60,
          pistonStrokeFeet: 8,
          strokesPerMinute: 20,
          hasSeparateCondenser,
          hasSteamJacket,
        };
        const state = stepWattCondenser(readWattCondenserControls(params));
        const channels = energyChannelsFor("gb-913-watt-separate-condenser", params);
        expect(channels.find((c) => c.name === "Furnace")?.watts).toBeCloseTo(
          state.heatInputRateKw * 1000,
          6,
        );
        expect(channels.find((c) => c.name === "Net shaft")?.watts).toBeCloseTo(
          state.netShaftPowerKw * 1000,
          6,
        );
        expect(
          channels.filter((c) => c.tone !== "in").reduce((sum, c) => sum + c.watts, 0),
        ).toBeCloseTo(state.indicatedPowerKw * 1000, 6);
      }
    }
  });
  it("derives conservative energy flow partitions for the Wright Flyer exemplar", () => {
    const channels = energyChannelsFor("us-821393-wright-flyer", { airspeed: 28 });
    expect(channels.length).toBe(3);
    expect(channels[0].name).toBe("Thrust · v");
    expect(channels[0].tone).toBe("in");
    expect(channels[1].name).toBe("Parasitic drag");
    expect(channels[1].tone).toBe("loss");
    expect(channels[2].name).toBe("Induced drag");
    expect(channels[2].tone).toBe("loss");
    expect(channels[0].watts).toBeGreaterThan(0);
    expect(channels[1].watts + channels[2].watts).toBeCloseTo(channels[0].watts, 1);
  });

  it("derives valid SI watt values or carries an explicit source-bounded omission", () => {
    for (const patent of allPatents) {
      const channels = energyChannelsFor(patent.id, {});
      if (patent.id in ENERGY_CHANNEL_OMISSION_REASONS) {
        expect(channels).toEqual([]);
        expect(
          ENERGY_CHANNEL_OMISSION_REASONS[patent.id as keyof typeof ENERGY_CHANNEL_OMISSION_REASONS]
            .length,
        ).toBeGreaterThan(80);
        continue;
      }
      expect(channels.length).toBeGreaterThan(0);
      for (const ch of channels) {
        expect(typeof ch.name).toBe("string");
        expect(ch.name.length).toBeGreaterThan(0);
        expect(["in", "useful", "loss"]).toContain(ch.tone);
        expect(typeof ch.watts).toBe("number");
        expect(Number.isFinite(ch.watts)).toBe(true);
        expect(ch.watts).toBeGreaterThanOrEqual(0);
      }
    }
    expect(Object.keys(ENERGY_CHANNEL_OMISSION_REASONS)).toEqual([
      "gb-931-arkwright-water-frame",
      "gb-1306-watt-rotary-engine",
      "gb-1420-cort-puddling-rolling",
      "us-x1-hopkins-potash",
      "us-x72-whitney-cotton-gin",
      "us-3138743-kilby-integrated-circuit",
      "us-2981877-noyce-ic",
      "us-2929922-townes-laser",
      "us-2717437-mestral-velcro",
      "us-2318259-sikorsky-helicopter",
      "us-2708656-fermi-reactor",
      "us-470918-reno-escalator",
      "us-586193-marconi-radio",
      "us-1102653-goddard-rocket",
      "us-361931-daimler-engine",
      "us-593138-tesla-coil",
      "us-194047-otto-engine",
      "us-6331181-davinci",
      "us-5701965-kamen-transporter",
      "us-6594844-roomba",
      "us-4750-howe-sewing-machine",
      "us-31128-otis-elevator",
      "us-4341502-makino-scara",
      "us-4512709-milacron-robot-toolchanger",
      "us-4575330-hull-stereolithography",
      "us-4765668-robot-end-effector",
      "us-2846084-goertz-electronic-master-slave-manipulator",
      "us-4921293-salisbury-robot-hand",
      "us-4976582-clavel-delta-robot",
      "us-5121329-crump-fdm",
      "us-2988237-devol-programmed-transfer",
      "us-3212649-amf-versatran",
      "us-3081379-lemelson-machine-vision",
      "us-3119501-lemelson-automatic-warehousing",
      "us-3260375-lemelson-adjustable-manipulator",
      "us-3313014-lemelson-automatic-production",
      "us-4098001-watson-rcc",
      "us-4098001-watson-remote-center-compliance",
      "us-3858581-kamen-medication-injection-device",
      "us-4068536-stackhouse-manipulator",
      "us-135245-pasteur-fermentation",
      "us-124404-westinghouse-air-brake",
      "us-78317-nobel-dynamite",
      "us-x9430-colt-revolver",
      "us-105338-hyatt-celluloid",
      "us-79265-sholes-typewriter",
      "us-247804-delaval-separator",
      "us-588-ericsson-propeller",
      "us-319596-maxim-machine-gun",
      "us-36836-gatling-gun",
      "us-971501-haber-ammonia",
      "us-1219881-sundback-zipper",
      "us-2495429-spencer-microwave",
      "us-2524035-bardeen-transistor",
      "us-6469-lincoln-buoy",
      "us-x8277-mccormick-reaper",
      "us-727650-linde-air-liquefaction",
      "us-307031-edison-indicator",
      "us-48475-yale-lock",
      "us-120057-gramme-dynamo",
      "us-613809-tesla-teleautomaton",
      "us-942699-baekeland-bakelite",
      "us-608969-parsons-turbine",
      "us-621195-zeppelin-airship",
      "us-2292387-lamarr-frequency-hopping",
      "us-3671542-kwolek-kevlar",
      "us-1773980-farnsworth-tv",
      "us-233692-pelton-water-wheel",
      "us-3541541-engelbart-mouse",
      "us-3728480-baer-odyssey",
      "us-3858232-boyle-smith-ccd",
      "us-395781-hollerith-tabulating",
      "us-706737-fessenden-wireless",
      "us-2543181-land-polaroid",
    ]);
  });

  it("handles unknown patent IDs safely returning an empty array", () => {
    expect(energyChannelsFor("unknown-patent-xyz", {})).toEqual([]);
    expect(energyChannelsFor("bogus-id-12345", {})).toEqual([]);
  });
});
