import { describe, expect, test } from "bun:test";
import { specClausesFor } from "./specClauses";

describe("Specification Clauses & Interactive Telemetry Weave", () => {
  test("Wright Flyer lights exact specification phrases based on live roll/yaw kinematics", () => {
    // Coupled warp case
    const coupled = specClausesFor("us-821393-wright-flyer", { wingWarp: 8, coupled: 1 });
    expect(coupled.length).toBe(4);
    const warpClause = coupled.find((c) => c.id === "warp");
    expect(warpClause?.active).toBe(true);
    expect(warpClause?.tone).toBe("live");

    const adverseClause = coupled.find((c) => c.id === "adverse-yaw");
    expect(adverseClause?.active).toBe(false);

    const rudderClause = coupled.find((c) => c.id === "rudder-link");
    expect(rudderClause?.active).toBe(true);
    expect(rudderClause?.tone).toBe("held");

    const bankedTurnClause = coupled.find((c) => c.id === "banked-turn");
    expect(bankedTurnClause?.active).toBe(true);

    // Uncoupled warp case (adverse yaw is triggered)
    const uncoupled = specClausesFor("us-821393-wright-flyer", { wingWarp: 8, coupled: 0 });
    const uncoupledAdverse = uncoupled.find((c) => c.id === "adverse-yaw");
    expect(uncoupledAdverse?.active).toBe(true);
    expect(uncoupledAdverse?.tone).toBe("broken");
  });

  test("Tesla Electro-Magnetic Motor lights only printed independent-circuit and shifting clauses", () => {
    const tesla = specClausesFor("us-381968-tesla-motor", { frequency: 60, poles: 2 });
    expect(tesla.length).toBe(2);
    expect(tesla[0].phrase).toContain("two or more independent circuits");
    expect(tesla[0].active).toBe(true);
    expect(tesla[1].phrase).toContain("progressive shifting of the magnetism");
    expect(tesla[1].tone).toBe("live");
    expect(tesla[0].caption).toContain("3600 rpm");
    expect(tesla[1].caption).toContain("disk D follows at 3600 rpm");
    expect(tesla.map((clause) => clause.phrase).join(" ")).not.toContain("rotating magnetic field");
    expect(tesla.map((clause) => clause.caption).join(" ")).not.toContain("120 f / P");
  });

  test("Fermi nuclear reactor lights critical chain-reaction clause", () => {
    const critical = specClausesFor("us-2708656-fermi-reactor", {
      rodWithdrawal: 90,
      moderatorPurity: 99.8,
    });
    expect(critical.length).toBe(1);
    expect(critical[0].phrase).toBe("self-sustaining");
    expect(critical[0].active).toBe(true);
  });

  test("Marconi radio lights elevated aerial antenna clause", () => {
    const marconi = specClausesFor("us-586193-marconi-radio", { aerialHeight: 88 });
    expect(marconi.length).toBe(1);
    expect(marconi[0].phrase).toBe("elevated");
    expect(marconi[0].active).toBe(true);
  });

  test("Edison lightbulb lights source clauses under declared resistance telemetry", () => {
    const clauses = specClausesFor("us-223898-edison-lightbulb", {
      voltage: 110,
      hotResistanceOhm: 145,
    });
    expect(clauses.length).toBe(4);
    expect(clauses[0].phrase).toContain("high resistance");
    expect(clauses[0].active).toBe(true);
    expect(clauses[0].tone).toBe("live");
    expect(clauses[1].phrase).toBe("nearly perfect vacuum");
    expect(clauses[1].active).toBe(true);
    expect(clauses[2].phrase).toBe("fine platina wires for leading-wires");
    expect(clauses[3].phrase).toBe("coiled as a spiral and carbonized");
    expect(clauses[3].active).toBe(true);
    expect(clauses[3].tone).toBe("held");
  });

  test("Bell telephone lights undulatory current and air vibration undulation clauses", () => {
    const clauses = specClausesFor("us-174465-bell-telephone", {
      voiceAmplitude: 80,
      acousticFrequencyHz: 500,
    });
    expect(clauses.length).toBe(2);
    expect(clauses[0].phrase).toContain("vibratory or undulatory current");
    expect(clauses[0].active).toBe(true);
    expect(clauses[0].caption).toContain("500 Hz");
    expect(clauses[1].phrase).toContain("electrical undulations");
    expect(clauses[1].active).toBe(true);
  });

  test("Morse telegraph lights galvanic circuit and electromagnetic relay clauses", () => {
    const clauses = specClausesFor("us-1647-morse-telegraph", {
      currentMa: 60,
      lineLengthMiles: 50,
    });
    expect(clauses.length).toBe(2);
    expect(clauses[0].phrase).toContain("circuits of metallic conductors");
    expect(clauses[0].active).toBe(true);
    expect(clauses[1].phrase).toContain("produces an additional and original power");
    expect(clauses[1].active).toBe(true);
    expect(clauses[1].tone).toBe("live");
  });

  test("Goodyear rubber lights recipe and regulated thermal cure clauses", () => {
    const clauses = specClausesFor("us-3633-goodyear-rubber", { vulcanTemp: 145, sulfurPct: 8 });
    expect(clauses.length).toBe(2);
    expect(clauses[0].phrase).toContain("twenty-five parts of india-rubber");
    expect(clauses[0].active).toBe(true);
    expect(clauses[1].phrase).toBe("action of heat at a regulated temperature");
    expect(clauses[1].active).toBe(true);
    expect(clauses[1].tone).toBe("live");
  });

  test("Noyce monolithic IC lights planar oxide, vacuum leads, and dished junction clauses", () => {
    const clauses = specClausesFor("us-2981877-noyce-ic", { reverseBias: 5, oxideThickness: 0.5 });
    expect(clauses.length).toBe(3);
    expect(clauses[0].phrase).toContain("insulating surface layer");
    expect(clauses[0].active).toBe(true);
    expect(clauses[1].phrase).toContain("leads in the form of vacuum-deposited");
    expect(clauses[1].active).toBe(true);
    expect(clauses[2].phrase).toContain("dished, P-N junctions");
    expect(clauses[2].active).toBe(true);
    expect(clauses[2].caption).toContain("VR = 5 V");
  });

  test("Spencer microwave lights microwave region, push-pull, waveguide, and cavity resonator clauses", () => {
    const clauses = specClausesFor("us-2495429-spencer-microwave", { rfPowerSetting: 1 });
    expect(clauses.length).toBe(4);
    expect(clauses[0].phrase).toBe("microwave region");
    expect(clauses[1].phrase).toBe("push-pull operation");
    expect(clauses[2].phrase).toBe("wave guide");
    expect(clauses[3].phrase).toBe("cavity resonator");
    expect(clauses.every((c) => c.active)).toBe(true);
  });

  test("Bardeen transistor lights hole carrier, forward emitter, and reverse collector clauses", () => {
    const clauses = specClausesFor("us-2524035-bardeen-transistor", {
      emitterCurrent: 2.0,
      collectorBias: -40,
      pointSpacing: 40,
    });
    expect(clauses.length).toBe(4);
    expect(clauses[0].phrase).toContain("holes");
    expect(clauses[0].active).toBe(true);
    expect(clauses[1].phrase).toContain("direction of easy current flow");
    expect(clauses[2].phrase).toContain("reverse, or high resistance direction");
    expect(clauses[3].phrase).toContain("fraction of the emitter current enters the collector");
    expect(clauses[3].tone).toBe("live");
  });

  test("Kwolek Kevlar lights anisotropic dope and viscosity discontinuity clauses", () => {
    const clauses = specClausesFor("us-3671542-kwolek-kevlar", {
      polymerConcentrationPct: 18.5,
      drawRatio: 6.5,
    });
    expect(clauses.length).toBe(3);
    expect(clauses[0].phrase).toContain("Optically anisotropic dope");
    expect(clauses[1].phrase).toContain("decrease in viscosity with increasing concentration");
    expect(clauses[1].active).toBe(true);
    expect(clauses[2].phrase).toContain("liquid-crystalline domains undergo spontaneous");
  });

  test("every patent in allPatents has at least one authored spec clause with valid SI metadata", async () => {
    const { allPatents } = await import("@/data/patents");
    expect(allPatents.length).toBe(79);

    for (const patent of allPatents) {
      const clauses = specClausesFor(patent.id, {});
      expect(clauses.length).toBeGreaterThan(0);

      for (const clause of clauses) {
        expect(clause.id.length).toBeGreaterThan(0);
        expect(clause.phrase.length).toBeGreaterThan(0);
        expect(clause.caption.length).toBeGreaterThan(0);
        expect(["held", "broken", "live"]).toContain(clause.tone);
        expect(typeof clause.active).toBe("boolean");
      }
    }
  });

  test("returns empty array for unregistered patent without throwing", () => {
    const unknown = specClausesFor("us-unknown-id", {});
    expect(unknown).toEqual([]);
  });
});
