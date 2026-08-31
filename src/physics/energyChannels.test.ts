import { describe, expect, it } from "bun:test";
import { allPatents } from "@/data/patents";
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

  it("derives valid, positive SI watt values for all 79 catalogue patents", () => {
    for (const patent of allPatents) {
      const channels = energyChannelsFor(patent.id, {});
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

  it("handles unknown patent IDs safely returning an empty array", () => {
    expect(energyChannelsFor("unknown-patent-xyz", {})).toEqual([]);
    expect(energyChannelsFor("bogus-id-12345", {})).toEqual([]);
  });
});
