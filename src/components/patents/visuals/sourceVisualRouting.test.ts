import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const dispatcherSource = readFileSync(
  join(process.cwd(), "src/components/patents/visuals/index.tsx"),
  "utf8",
);

describe("source-integrity visual routing", () => {
  test("refuses models known to depict a different patent or unverified mechanism", () => {
    for (const patentId of [
      "us-608969-parsons-turbine",
      "us-808897-carrier-air-conditioner",
      "us-586193-marconi-radio",
      "us-2292387-lamarr-frequency-hopping",
      "us-2708656-fermi-reactor",
      "us-313224-mergenthaler-linotype",
      "us-3541541-engelbart-mouse",
      "us-3671542-kwolek-kevlar",
      "us-3858232-boyle-smith-ccd",
    ]) {
      expect(dispatcherSource).toContain(`case "${patentId}":`);
    }
    expect(dispatcherSource).toContain("<SourceVisualUnavailable");
    expect(dispatcherSource).toContain("a different Parsons patent");
    expect(dispatcherSource).toContain("inherited chilled-dew-point air-conditioning model");
    expect(dispatcherSource).toContain("unreviewed antenna dimensions, power, range");
    expect(dispatcherSource).toContain("unreviewed bandwidth, hop-rate, processing-gain");
    expect(dispatcherSource).toContain(
      "unreviewed delayed-neutron kinetics, control-rod operation",
    );
    expect(dispatcherSource).toContain("later matrix magazine, binary distributor, alloy recipe");
    expect(dispatcherSource).toContain("unreviewed materials, dimensions, sampling, friction");
    expect(dispatcherSource).toContain("Information Storage Devices");
  });

  test("does not keep the contradicted model in the corrected route branch", () => {
    const parsonsBranch = dispatcherSource
      .split('case "us-608969-parsons-turbine":')[1]
      ?.split('case "us-613809-tesla-teleautomaton":')[0];
    const kwolekBranch = dispatcherSource
      .split('case "us-3671542-kwolek-kevlar":')[1]
      ?.split('case "us-3923554-boyle-smith-ccd":')[0];
    const boyleBranch = dispatcherSource
      .split('case "us-3858232-boyle-smith-ccd":')[1]
      ?.split('case "us-4136359-wozniak-apple":')[0];
    const carrierBranch = dispatcherSource
      .split('case "us-808897-carrier-air-conditioner":')[1]
      ?.split('case "us-821393-wright-flyer":')[0];
    const marconiBranch = dispatcherSource
      .split('case "us-586193-marconi-radio":')[1]
      ?.split('case "us-608969-parsons-turbine":')[0];
    const lamarrBranch = dispatcherSource
      .split('case "us-2292387-lamarr-frequency-hopping":')[1]
      ?.split('case "us-2495429-spencer-microwave":')[0];
    const fermiBranch = dispatcherSource
      .split('case "us-2708656-fermi-reactor":')[1]
      ?.split('case "us-2981877-noyce-ic":')[0];
    const engelbartBranch = dispatcherSource
      .split('case "us-3541541-engelbart-mouse":')[1]
      ?.split('case "us-3671542-kwolek-kevlar":')[0];
    const mergenthalerBranch = dispatcherSource
      .split('case "us-313224-mergenthaler-linotype":')[1]
      ?.split('case "us-319596-maxim-machine-gun":')[0];

    expect(parsonsBranch).toBeDefined();
    expect(kwolekBranch).toBeDefined();
    expect(boyleBranch).toBeDefined();
    expect(carrierBranch).toBeDefined();
    expect(marconiBranch).toBeDefined();
    expect(lamarrBranch).toBeDefined();
    expect(fermiBranch).toBeDefined();
    expect(engelbartBranch).toBeDefined();
    expect(mergenthalerBranch).toBeDefined();
    expect(parsonsBranch).not.toContain("ParsonsTurbine");
    expect(kwolekBranch).not.toContain("KwolekKevlar");
    expect(boyleBranch).not.toContain("BoyleSmithCcd");
    expect(carrierBranch).not.toContain("CarrierAirConditioner");
    expect(marconiBranch).not.toContain("MarconiRadio");
    expect(lamarrBranch).not.toContain("LamarrFrequencyHopping");
    expect(fermiBranch).not.toContain("FermiReactor");
    expect(engelbartBranch).not.toContain("EngelbartMouse");
    expect(mergenthalerBranch).not.toContain("MergenthalerLinotype");
  });
});
