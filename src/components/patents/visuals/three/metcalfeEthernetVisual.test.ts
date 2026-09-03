import { describe, expect, test } from "bun:test";
import {
  DEFAULT_ETHERNET_CONTROLS,
  INITIAL_ETHERNET_STATE,
  stepMetcalfeEthernetSi,
} from "@/physics/metcalfeEthernetKernel";
import { metcalfeViewForViewport } from "./metcalfeEthernetCamera";
import { buildMetcalfeEthernetModel } from "./metcalfeEthernetModel";

const readSource = async (relativePath: string): Promise<string> =>
  Bun.file(new URL(relativePath, import.meta.url)).text();

describe("US 4,063,220 Metcalfe Ethernet 3D Procedural Model", () => {
  test("keeps ambient randomness out of the shared kernel and both visual faces", async () => {
    const [
      kernelSource,
      twoDimensionalSource,
      threeDimensionalSource,
      modelSource,
      ownerSource,
      dispatcherSource,
    ] = await Promise.all([
      readSource("../../../../physics/metcalfeEthernetKernel.ts"),
      readSource("../MetcalfeEthernetSim.tsx"),
      readSource("./MetcalfeEthernet3D.tsx"),
      readSource("./metcalfeEthernetModel.ts"),
      readSource("../PatentPhysicsRuntimeOwner.tsx"),
      readSource("../index.tsx"),
    ]);

    expect(kernelSource).not.toContain("Math.random");
    expect(twoDimensionalSource).not.toContain("Math.random");
    expect(twoDimensionalSource).not.toContain("Date.now");
    expect(twoDimensionalSource).not.toContain("stepMetcalfeEthernetSi");
    expect(threeDimensionalSource).not.toContain("stepMetcalfeEthernetSi");
    expect(threeDimensionalSource).not.toContain("simStateRef");
    expect(twoDimensionalSource).not.toContain("createMetcalfeEthernetTransportUpdater");
    expect(threeDimensionalSource).not.toContain("createMetcalfeEthernetTransportUpdater");
    expect(twoDimensionalSource).toContain("readMetcalfeEthernetTapeFrame");
    expect(threeDimensionalSource).toContain("readMetcalfeEthernetTapeFrame");
    expect(ownerSource.match(/createMetcalfeEthernetTransportUpdater/g)).toHaveLength(2);
    expect(dispatcherSource).toContain(
      "<MetcalfeEthernetPhysicsRuntimeOwner patentId={patentId} />",
    );
    expect(modelSource).not.toContain("waveProgress1 = (waveProgress1 +");
    expect(modelSource).toContain("ethernetDisplayWavePhase(state)");
    expect(modelSource).toContain("metrics.collisionDisplayActive");
    expect(twoDimensionalSource).toContain("new ResizeObserver(render)");
    expect(twoDimensionalSource).not.toContain("width={800}");
    expect(twoDimensionalSource).toContain('aria-label="Coaxial cable length"');
    expect(threeDimensionalSource).toContain('id="metcalfe-3d-cable-length"');
    expect(threeDimensionalSource).toContain('updateParam("station1Transmitting", 1)');
    expect(threeDimensionalSource).toContain(
      'updateParam("station2Transmitting", activate ? 1 : 0)',
    );
    expect(threeDimensionalSource).not.toContain("w-full h-[540px]");
    expect(threeDimensionalSource).toContain('className="shrink-0 p-4');
  });

  test("instantiates full procedural 3D hierarchy: coaxial bus, terminators, vampire taps, Alto stations", () => {
    const model = buildMetcalfeEthernetModel();
    expect(model.root.name).toBe("US 4,063,220 Ethernet 3D Studio Model");
    expect(model.root.children.length).toBeGreaterThan(4);
    model.dispose();
  });

  test("backs the overview camera out enough for both Alto stations on portrait phones", () => {
    const desktop = metcalfeViewForViewport("overview", 1000);
    const phone = metcalfeViewForViewport("overview", 320);
    const distance = (view: typeof desktop) =>
      Math.hypot(
        view.position[0] - view.target[0],
        view.position[1] - view.target[1],
        view.position[2] - view.target[2],
      );
    expect(distance(phone) / distance(desktop)).toBeCloseTo(1.95, 8);
    expect(desktop.position).toEqual([0, 3.2, 5.8]);
  });

  test("updates 3D packet waves and collision effects from SI physics telemetry", () => {
    const model = buildMetcalfeEthernetModel();
    const result = stepMetcalfeEthernetSi(INITIAL_ETHERNET_STATE, DEFAULT_ETHERNET_CONTROLS, 0.016);

    expect(() => {
      model.updateState(result.state, result.metrics, DEFAULT_ETHERNET_CONTROLS);
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
      model.updateState(colResult.state, colResult.metrics, colControls);
    }).not.toThrow();

    model.dispose();
  });
});
