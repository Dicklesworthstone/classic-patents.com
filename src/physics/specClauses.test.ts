import { describe, expect, test } from "bun:test";
import { specClausesFor } from "./specClauses";

describe("Specification Clauses & Interactive Telemetry Weave", () => {
  test("Watt's hot-cylinder clause follows the jacket and actual model temperatures", () => {
    const params = {
      boilerPressurePsi: 6,
      condenserTempC: 50,
      hasSeparateCondenser: 1,
      hasSteamJacket: 1,
    };
    const jacketed = specClausesFor("gb-913-watt-separate-condenser", params);
    const unjacketed = specClausesFor("gb-913-watt-separate-condenser", {
      ...params,
      hasSteamJacket: 0,
    });
    const newcomen = specClausesFor("gb-913-watt-separate-condenser", {
      ...params,
      hasSeparateCondenser: 0,
    });
    expect(jacketed.find((c) => c.id === "cylinder-hot")).toMatchObject({
      active: true,
      tone: "held",
    });
    expect(unjacketed.find((c) => c.id === "cylinder-hot")).toMatchObject({
      active: false,
      tone: "broken",
    });
    expect(unjacketed.find((c) => c.id === "cylinder-hot")?.caption).toContain("100.3°C");
    expect(unjacketed.find((c) => c.id === "cylinder-hot")?.caption).toContain("108.3°C");
    expect(newcomen.find((c) => c.id === "cylinder-hot")?.caption).toContain("79.1°C");
    expect(newcomen.find((c) => c.id === "separate-condenser")).toMatchObject({
      active: false,
      tone: "broken",
    });
    expect(newcomen.find((c) => c.id === "separate-condenser")?.caption).toContain(
      "50°C injection water",
    );
    expect(JSON.stringify(newcomen)).not.toContain("75%");
  });
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

  test("Fermi nuclear reactor lights the actual Claim 1 uranium-rod lattice clause", () => {
    const critical = specClausesFor("us-2708656-fermi-reactor", {
      rodWithdrawal: 90,
      moderatorPurity: 99.8,
    });
    expect(critical.length).toBe(1);
    expect(critical[0].phrase).toBe("natural uranium rods disposed in a geometric pattern therein");
    expect(critical[0].active).toBe(true);
    expect(specClausesFor("us-2708656-fermi-reactor", { claim1Active: 0 })[0].active).toBe(false);
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
    const clauses = specClausesFor("us-2981877-noyce-ic", {
      oxideThicknessUm: 1,
      leadStripWidthFraction: 0.12,
    });
    expect(clauses.length).toBe(3);
    expect(clauses[0].phrase).toContain("insulating surface layer");
    expect(clauses[0].active).toBe(true);
    expect(clauses[1].phrase).toContain("leads in the form of vacuum-deposited");
    expect(clauses[1].active).toBe(true);
    expect(clauses[2].phrase).toContain("dished, P-N junctions");
    expect(clauses[2].active).toBe(true);
    expect(clauses[2].caption).toContain("no bias voltage");
  });

  test("Kilby maps Claim 1 to the wafer, junction, resistor, and conductive-means clauses", () => {
    const held = specClausesFor("us-3138743-kilby-integrated-circuit", {
      claim1ConductiveMeansPresent: 1,
    });
    expect(held).toHaveLength(4);
    expect(held.map((clause) => clause.phrase)).toEqual([
      "plurality of electrical circuit components in a wafer of single-crystal semiconductor material",
      "plurality of junction transistors defined in the wafer",
      "plurality of thin elongated regions of the wafer exhibiting substantial resistance",
      "conductive means connecting selected ones of the elongated regions to regions of selected ones of the transistors",
    ]);
    expect(held.every((clause) => clause.active)).toBe(true);

    const withheld = specClausesFor("us-3138743-kilby-integrated-circuit", {
      claim1ConductiveMeansPresent: 0,
    });
    expect(withheld.slice(0, 3).every((clause) => clause.active)).toBe(true);
    expect(withheld[3]).toMatchObject({ active: false, tone: "broken" });
    expect(withheld[3]?.caption).toContain("no electrical performance is inferred");
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

  test("Kwolek withholds live spec-clause probes until the source edition is complete", () => {
    const clauses = specClausesFor("us-3671542-kwolek-kevlar", {
      polymerConcentrationPct: 18.5,
      drawRatio: 6.5,
    });
    expect(clauses).toEqual([]);
  });

  test("Tesla US 593,138 breaks the exact common-node clause when Claim 1 is opened", () => {
    const connected = specClausesFor("us-593138-tesla-coil", {
      disturbanceFrequencyHz: 925,
      secondaryLengthMiles: 50,
      claim1CommonNodeConnected: 1,
    });
    const heldBond = connected.find((clause) => clause.id === "primary-secondary-earth-bond");
    expect(heldBond?.phrase).toContain("I also connect it with the primary");
    expect(heldBond?.active).toBe(true);
    expect(heldBond?.tone).toBe("held");

    const opened = specClausesFor("us-593138-tesla-coil", {
      disturbanceFrequencyHz: 925,
      secondaryLengthMiles: 50,
      claim1CommonNodeConnected: 0,
    });
    const brokenBond = opened.find((clause) => clause.id === "primary-secondary-earth-bond");
    expect(brokenBond?.active).toBe(false);
    expect(brokenBond?.tone).toBe("broken");
    expect(brokenBond?.caption).toContain("without inventing a voltage or damage result");
  });

  test("AMF Versatran claim probes light and withhold their exact source clauses on the shared kernel state", () => {
    const live = specClausesFor("us-3212649-amf-versatran", {
      teachReplayMode: 1,
      gripperOperation: 0.8,
      claim1TopologyEnabled: 1,
      claim8RecordPlaybackEnabled: 1,
      claim12PinionGripperEnabled: 1,
    });
    expect(
      live.find((clause) => clause.id === "versatran-primary-and-supplemental-motions"),
    ).toMatchObject({
      active: true,
      tone: "live",
    });
    expect(live.find((clause) => clause.id === "versatran-continuous-path")).toMatchObject({
      active: true,
      tone: "live",
    });
    expect(live.find((clause) => clause.id === "versatran-coupled-pinion-gripper")).toMatchObject({
      active: true,
      tone: "live",
    });

    const withheld = specClausesFor("us-3212649-amf-versatran", {
      teachReplayMode: 1,
      gripperOperation: 0.8,
      claim1TopologyEnabled: 0,
      claim8RecordPlaybackEnabled: 0,
      claim12PinionGripperEnabled: 0,
    });
    expect(
      withheld.find((clause) => clause.id === "versatran-primary-and-supplemental-motions"),
    ).toMatchObject({
      active: false,
      tone: "broken",
    });
    expect(withheld.find((clause) => clause.id === "versatran-continuous-path")).toMatchObject({
      active: false,
      tone: "broken",
    });
    expect(
      withheld.find((clause) => clause.id === "versatran-coupled-pinion-gripper"),
    ).toMatchObject({
      active: false,
      tone: "broken",
    });
  });

  test("Kamen Transporter reads balance and cluster relationships without invented drive values", () => {
    const climb = specClausesFor("us-5701965-kamen-transporter", { topologyState: 4 });
    expect(climb).toHaveLength(3);
    expect(climb.find((clause) => clause.id === "dynamically-maintaining-stability")).toMatchObject(
      {
        active: true,
        tone: "held",
      },
    );
    expect(climb.find((clause) => clause.id === "cluster-of-wheels")).toMatchObject({
      active: true,
      tone: "live",
    });
    expect(climb.find((clause) => clause.id === "coordination-control-means")).toMatchObject({
      active: true,
      tone: "live",
    });
    expect(climb.map((clause) => clause.caption).join(" ")).not.toMatch(
      /N·m|m\/s|planetary|recovery limit/i,
    );

    const withdrawn = specClausesFor("us-5701965-kamen-transporter", {
      topologyState: 1,
      claim1BalanceEnabled: 0,
    });
    expect(
      withdrawn.find((clause) => clause.id === "dynamically-maintaining-stability"),
    ).toMatchObject({
      active: false,
      tone: "broken",
    });
    expect(
      withdrawn.find((clause) => clause.id === "dynamically-maintaining-stability")?.caption,
    ).toContain("does not predict a fall");
  });

  test("Da Vinci exposes only compatibility, calibration, and engagement topology", () => {
    const ready = specClausesFor("us-6331181-davinci", {
      compatibilitySignalPresent: 1,
      calibrationRecordAvailable: 1,
      engagementSignalPresent: 1,
    });
    expect(ready.find((clause) => clause.id === "processor-which-directs-movement")).toMatchObject({
      active: true,
      tone: "held",
    });
    expect(ready.map((clause) => clause.caption).join(" ")).not.toMatch(/3-entry|tremor/i);

    const calibrationMissing = specClausesFor("us-6331181-davinci", {
      compatibilitySignalPresent: 1,
      calibrationRecordAvailable: 0,
      engagementSignalPresent: 1,
    });
    expect(
      calibrationMissing.find((clause) => clause.id === "processor-which-directs-movement"),
    ).toMatchObject({ active: false, tone: "broken" });
  });

  test("Lemelson machine vision reads scan/gate/analyzing topology without false SI output", () => {
    const live = specClausesFor("us-3081379-lemelson-machine-vision", {});
    expect(live).toHaveLength(4);
    expect(live.every((clause) => clause.active)).toBe(true);
    expect(live.map((clause) => clause.caption).join(" ")).not.toMatch(
      /\d+\s*(?:Hz|µs|mm|V|N|ms)\b/,
    );

    const gateWithheld = specClausesFor("us-3081379-lemelson-machine-vision", {
      synchronizedGateEnabled: 0,
    });
    expect(gateWithheld.find((clause) => clause.id === "gated-analyzing-circuit")).toMatchObject({
      active: false,
      tone: "broken",
    });
  });

  test("Makino clauses follow the exact concentric, belt, and Y-link topology states", () => {
    const concentric = specClausesFor("us-4341502-makino-scara", {
      topologyVariant: 1,
      toolAttitudeDeg: 35,
    });
    expect(concentric).toHaveLength(3);
    expect(concentric.find((clause) => clause.id === "four-link-mechanism")).toMatchObject({
      active: true,
      tone: "held",
    });
    expect(concentric.find((clause) => clause.id === "belt-devices")).toMatchObject({
      active: true,
      tone: "live",
    });
    expect(concentric.find((clause) => clause.id === "belt-devices")?.caption).toContain("φ=35°");

    const yLink = specClausesFor("us-4341502-makino-scara", {
      topologyVariant: 3,
      toolAttitudeDeg: 90,
    });
    expect(yLink.find((clause) => clause.id === "belt-devices")).toMatchObject({
      active: false,
      tone: "held",
    });
    expect(yLink.find((clause) => clause.id === "y-shaped-link-mechanism")).toMatchObject({
      active: true,
      tone: "live",
    });
    expect(yLink.find((clause) => clause.id === "y-shaped-link-mechanism")?.caption).toContain(
      "φ fixed at 0°",
    );
    expect(yLink.map((clause) => clause.caption).join(" ")).not.toMatch(/N·m|metres|payload/i);
  });

  test("Milacron clauses expose the aperture interlock instead of impossible withdrawal", () => {
    const blocked = specClausesFor("us-4512709-milacron-robot-toolchanger", {
      toolBasePresent: 1,
      registrationFraction: 0.25,
      lockingSlideFraction: 1,
      claimFourTMember: 1,
    });
    expect(blocked.find((clause) => clause.id === "milacron-separation-interlock")).toMatchObject({
      active: false,
      tone: "broken",
    });
    expect(
      blocked.find((clause) => clause.id === "milacron-separation-interlock")?.caption,
    ).toContain("effective base remains seated");

    const released = specClausesFor("us-4512709-milacron-robot-toolchanger", {
      toolBasePresent: 1,
      registrationFraction: 1,
      lockingSlideFraction: 0,
      claimFourTMember: 1,
    });
    expect(released.find((clause) => clause.id === "milacron-separation-interlock")).toMatchObject({
      active: true,
      tone: "held",
    });
    expect(released.find((clause) => clause.id === "milacron-locking-slide")?.caption).toContain(
      "aligned",
    );
  });

  test("every patent in allPatents has at least one authored spec clause with valid SI metadata", async () => {
    const { allPatents } = await import("@/data/patents");
    expect(allPatents.length).toBeGreaterThanOrEqual(85);

    for (const patent of allPatents) {
      const clauses = specClausesFor(patent.id, {});
      if (patent.id === "us-3671542-kwolek-kevlar") {
        expect(clauses).toEqual([]);
        continue;
      }
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
