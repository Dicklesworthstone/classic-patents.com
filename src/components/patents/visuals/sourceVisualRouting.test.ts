import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { allPatents } from "@/data/patents";

const dispatcherSource = readFileSync(
  join(process.cwd(), "src/components/patents/visuals/index.tsx"),
  "utf8",
);

describe("complete patent visual dispatcher routing", () => {
  test("registers all 54 classic patents in the visual dispatcher", () => {
    for (const patent of allPatents) {
      expect(dispatcherSource).toContain(`case "${patent.id}":`);
    }
  });

  test("routes every patent to its appropriate public visual face", () => {
    expect(dispatcherSource).toContain('case "us-2981877-noyce-ic":');
    expect(dispatcherSource).toContain("NoycePlanarIC3D");
    expect(dispatcherSource).toContain("NoycePlanarICSim");

    expect(dispatcherSource).toContain('case "us-1102653-goddard-rocket":');
    expect(dispatcherSource).toContain("GoddardRocket3D");
    expect(dispatcherSource).toContain("GoddardRocketSim");

    expect(dispatcherSource).toContain('case "us-3541541-engelbart-mouse":');
    expect(dispatcherSource).toContain("EngelbartMouse3D");
    expect(dispatcherSource).toContain("EngelbartMouseSim");

    expect(dispatcherSource).toContain('case "us-2292387-lamarr-frequency-hopping":');
    expect(dispatcherSource).toContain("LamarrFrequencyHopping3D");
    expect(dispatcherSource).toContain("LamarrFrequencyHoppingSim");

    expect(dispatcherSource).toContain('case "us-2708656-fermi-reactor":');
    expect(dispatcherSource).toContain("FermiReactor3D");
    expect(dispatcherSource).toContain("FermiReactorSim");

    expect(dispatcherSource).toContain('case "us-313224-mergenthaler-linotype":');
    expect(dispatcherSource).toContain("MergenthalerLinotype3D");
    expect(dispatcherSource).toContain("MergenthalerLinotypeSim");

    expect(dispatcherSource).toContain('case "us-395781-hollerith-tabulating":');
    expect(dispatcherSource).toContain("HollerithTabulating3D");
    expect(dispatcherSource).toContain("HollerithTabulatingSim");

    expect(dispatcherSource).toContain('case "us-542846-diesel-engine":');
    expect(dispatcherSource).toContain("DieselEngine3D");
    expect(dispatcherSource).toContain("DieselEngineSim");

    expect(dispatcherSource).toContain('case "us-586193-marconi-radio":');
    expect(dispatcherSource).toContain("MarconiRadio3D");
    expect(dispatcherSource).toContain("MarconiRadioSim");

    expect(dispatcherSource).toContain('case "us-608969-parsons-turbine":');
    expect(dispatcherSource).toContain("ParsonsTurbine3D");
    expect(dispatcherSource).toContain("ParsonsTurbineSim");

    expect(dispatcherSource).toContain('case "us-808897-carrier-air-conditioner":');
    expect(dispatcherSource).toContain("CarrierAirConditioner3D");
    expect(dispatcherSource).toContain("CarrierAirConditionerSim");

    expect(dispatcherSource).toContain('case "us-3671542-kwolek-kevlar":');
    expect(dispatcherSource).toContain("SourceVisualUnavailable");
    expect(dispatcherSource).toContain("nine checked drawing sheets");
    expect(dispatcherSource).not.toContain("KwolekKevlar3D");
    expect(dispatcherSource).not.toContain("KwolekKevlarSim");

    expect(dispatcherSource).toContain('case "us-3858232-boyle-smith-ccd":');
    expect(dispatcherSource).toContain("BoyleSmithCcd3D");
    expect(dispatcherSource).toContain("BoyleSmithCcdSim");
  });
});
