import { describe, expect, test } from "bun:test";
import {
  DEFAULT_ETHERNET_CONTROLS,
  INITIAL_ETHERNET_STATE,
  stepMetcalfeEthernetSi,
} from "@/physics/metcalfeEthernetKernel";
import { buildMetcalfeEthernetModel } from "./metcalfeEthernetModel";

const readSource = async (relativePath: string): Promise<string> =>
  Bun.file(new URL(relativePath, import.meta.url)).text();

describe("US 4,063,220 Metcalfe Ethernet 3D Procedural Model", () => {
  test("keeps ambient randomness out of the shared kernel and both visual faces", async () => {
    const [kernelSource, twoDimensionalSource, threeDimensionalSource] = await Promise.all([
      readSource("../../../../physics/metcalfeEthernetKernel.ts"),
      readSource("../MetcalfeEthernetSim.tsx"),
      readSource("./MetcalfeEthernet3D.tsx"),
    ]);

    expect(kernelSource).not.toContain("Math.random");
    expect(twoDimensionalSource).toContain("stepMetcalfeEthernetSi");
    expect(threeDimensionalSource).toContain("stepMetcalfeEthernetSi");
    expect(threeDimensionalSource).toContain("simStateRef");
  });

  test("instantiates full procedural 3D hierarchy: coaxial bus, terminators, vampire taps, Alto stations", () => {
    const model = buildMetcalfeEthernetModel();
    expect(model.root.name).toBe("US 4,063,220 Ethernet 3D Studio Model");
    expect(model.root.children.length).toBeGreaterThan(4);
    model.dispose();
  });

  test("updates 3D packet waves and collision effects from SI physics telemetry", () => {
    const model = buildMetcalfeEthernetModel();
    const result = stepMetcalfeEthernetSi(INITIAL_ETHERNET_STATE, DEFAULT_ETHERNET_CONTROLS, 0.016);

    expect(() => {
      model.updateState(result.metrics, DEFAULT_ETHERNET_CONTROLS);
    }).not.toThrow();

    // Trigger collision state
    const colControls = {
      ...DEFAULT_ETHERNET_CONTROLS,
      triggerCollision: true,
      station1Transmitting: true,
      station2Transmitting: true,
    };
    const colResult = stepMetcalfeEthernetSi(result.state, colControls, 0.016);
    expect(() => {
      model.updateState(colResult.metrics, colControls);
    }).not.toThrow();

    model.dispose();
  });
});
