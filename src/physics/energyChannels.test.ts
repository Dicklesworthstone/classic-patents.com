import { describe, expect, it } from "bun:test";
import { energyChannelsFor } from "./energyChannels";

describe("Physics Energy Channels (SI Power & Heat Balances)", () => {
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

  it("derives valid, positive SI watt values for all supported landmark patents", () => {
    const supportedPatentIds = [
      "us-821393-wright-flyer",
      "us-223898-edison-lightbulb",
      "us-1102653-goddard-rocket",
      "us-808897-carrier-air-conditioner",
      "us-586193-marconi-radio",
      "us-2708656-fermi-reactor",
      "us-608969-parsons-turbine",
      "us-1781541-einstein-refrigerator",
      "us-132-davenport-electric-motor",
      "us-347140-thomson-welding",
      "us-194047-otto-engine",
      "us-6162-corliss-steam-engine",
      "us-470918-reno-escalator",
      "us-319596-maxim-machine-gun",
      "us-588-ericsson-propeller",
      "us-400766-hall-aluminium",
      "us-879532-de-forest-audion",
      "gb-913-watt-separate-condenser",
      "gb-931-arkwright-water-frame",
      "gb-1306-watt-rotary-engine",
      "gb-1420-cort-puddling-rolling",
      "us-x72-whitney-cotton-gin",
      "us-x8277-mccormick-reaper",
      "us-x9430-colt-revolver",
      "us-1647-morse-telegraph",
      "us-174465-bell-telephone",
      "us-200521-edison-phonograph",
      "us-235199-bell-photophone",
      "us-247804-delaval-separator",
      "us-3237-rillieux-evaporator",
      "us-31128-otis-elevator",
      "us-36836-gatling-gun",
      "us-78317-nobel-dynamite",
      "us-621195-zeppelin-airship",
      "us-682690-hewitt-mercury-lamp",
      "us-942699-baekeland-bakelite",
      "us-971501-haber-ammonia",
      "us-2297691-carlson-electrophotography",
      "us-2929922-townes-laser",
      "us-2981877-noyce-ic",
      "us-3353115-maiman-ruby-laser",
      "us-3858232-boyle-smith-ccd",
      "us-4136359-wozniak-apple",
      "us-124404-westinghouse-air-brake",
      "us-1773980-farnsworth-tv",
      "us-2524035-bardeen-transistor",
      "us-3138743-kilby-integrated-circuit",
      "us-6120588-eink",
      "us-6331181-davinci",
      "us-6594844-roomba",
      "us-7479949-multitouch",
      "us-4750-howe-sewing-machine",
      "us-105338-hyatt-celluloid",
      "us-157124-glidden-barbed-wire",
      "us-706737-fessenden-wireless",
      "us-727650-linde-air-liquefaction",
      "us-x1-hopkins-potash",
    ];

    for (const id of supportedPatentIds) {
      const channels = energyChannelsFor(id, {});
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
  });

  it("handles unknown or source-refused patent IDs safely returning an empty array", () => {
    expect(energyChannelsFor("unknown-patent-xyz", {})).toEqual([]);
    expect(energyChannelsFor("us-381968-tesla-motor", {})).toEqual([]);
    expect(energyChannelsFor("us-361931-daimler-engine", {})).toEqual([]);
    expect(energyChannelsFor("us-233692-pelton-water-wheel", {})).toEqual([]);
    expect(energyChannelsFor("us-307031-edison-indicator", {})).toEqual([]);
  });
});
