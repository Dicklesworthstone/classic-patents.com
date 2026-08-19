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

  test("returns empty array for unregistered patent without throwing", () => {
    const unknown = specClausesFor("us-unknown-id", {});
    expect(unknown).toEqual([]);
  });
});
