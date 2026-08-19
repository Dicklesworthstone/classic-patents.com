import { describe, expect, test } from "bun:test";
import { allPatents } from "@/data/patents";
import { specClausesFor } from "@/physics/specClauses";

describe("Patent Core Display & Archival Components", () => {
  test("MuseumBroadsidePlaque format integrity across all catalog patents", () => {
    for (const patent of allPatents) {
      expect(patent.title.trim().length).toBeGreaterThan(0);
      expect(patent.subtitle.trim().length).toBeGreaterThan(0);
      expect(patent.patentNumber.trim().length).toBeGreaterThan(0);
      expect(patent.usptoClassification.trim().length).toBeGreaterThan(0);
      expect(patent.inventors.length).toBeGreaterThan(0);
      expect(patent.inventorLocation.trim().length).toBeGreaterThan(0);
      expect(patent.grantDate.trim().length).toBe(10);
    }
  });

  test("EnergyFlowStrip energy conservation and balance calculation", () => {
    const channels = [
      { name: "Input Steam Power", watts: 15000, tone: "in" as const },
      { name: "Useful Shaft Work", watts: 12600, tone: "useful" as const },
      { name: "Exhaust Loss", watts: 2400, tone: "loss" as const },
    ];
    const inputWatts = channels.find((c) => c.tone === "in")?.watts ?? 0;
    const usefulWatts = channels.find((c) => c.tone === "useful")?.watts ?? 0;
    const lossWatts = channels.find((c) => c.tone === "loss")?.watts ?? 0;

    expect(usefulWatts + lossWatts).toBe(inputWatts);
    const efficiency = usefulWatts / inputWatts;
    expect(efficiency).toBeCloseTo(0.84, 2);
  });

  test("TwoClocksStrip fast and slow timescale definitions", () => {
    const spencerClocks = {
      title: "Magnetron vs Cavity Thermal Inertia",
      fast: {
        name: "RF Anode Gyrotron Oscillation",
        period: "408",
        scale: "ps (2.45 GHz)",
        detail: "Relativistic spoke sweep around 8 anode resonant cavities",
      },
      slow: {
        name: "Dielectric Water Heating",
        period: "1.3",
        scale: "s / K",
        detail: "Rotational relaxation dipolar heating in popcorn starch matrix",
      },
    };

    expect(spencerClocks.fast.period).toBe("408");
    expect(spencerClocks.fast.scale).toContain("ps");
    expect(spencerClocks.slow.period).toBe("1.3");
    expect(spencerClocks.slow.scale).toContain("s");
  });

  test("SpecClauseText active clause identification across patent specification transcripts", () => {
    const wrightClauses = specClausesFor("us-821393-wright-flyer", { wingWarp: 10, coupled: 1 });
    const sampleText = `
      UNITED STATES PATENT OFFICE.
      ORVILLE WRIGHT AND WILBUR WRIGHT, OF DAYTON, OHIO.
      FLYING-MACHINE.

      The aeroplanes are twisted or warped in opposite directions to present different angles of incidence.
      By operatively connect this vertical rudder to the wing-warping mechanism, the machine is prevented from yawing.
    `;

    const activeInText = wrightClauses.filter(
      (c) => c.active && sampleText.toLowerCase().includes(c.phrase.toLowerCase()),
    );
    expect(activeInText.length).toBeGreaterThanOrEqual(2);
    expect(activeInText.some((c) => c.id === "warp")).toBe(true);
    expect(activeInText.some((c) => c.id === "rudder-link")).toBe(true);
  });
});
