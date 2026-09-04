import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  DA_VINCI_INTERFACE_KERNEL_SOURCE,
  DA_VINCI_INTERFACE_SOURCE_BOUNDARY,
  readDaVinciInterfaceControls,
  resolveDaVinciInterfaceTopology,
} from "@/physics/daVinciInterfaceTopology";
import { daVinciInterfaceViewForViewport } from "./daVinciInterfaceCamera";
import { buildDaVinciInterfaceModel } from "./daVinciInterfaceModel";

const ROOT = process.cwd();

describe("US 6,331,181 source-bounded tool-interface visual", () => {
  test("only admits the ready topology when all disclosed interface records are present", () => {
    const ready = resolveDaVinciInterfaceTopology(
      readDaVinciInterfaceControls({
        compatibilitySignalPresent: 1,
        calibrationRecordAvailable: 1,
        engagementSignalPresent: 1,
      }),
    );
    expect(ready.processorCanConfigureTool).toBe(true);
    expect(ready.status).toBe("ready");

    expect(
      resolveDaVinciInterfaceTopology(
        readDaVinciInterfaceControls({
          compatibilitySignalPresent: 0,
          calibrationRecordAvailable: 1,
          engagementSignalPresent: 1,
        }),
      ).status,
    ).toBe("incompatible");
    expect(
      resolveDaVinciInterfaceTopology(
        readDaVinciInterfaceControls({
          compatibilitySignalPresent: 1,
          calibrationRecordAvailable: 0,
          engagementSignalPresent: 1,
        }),
      ).status,
    ).toBe("calibration-record-missing");
    expect(
      resolveDaVinciInterfaceTopology(
        readDaVinciInterfaceControls({
          compatibilitySignalPresent: 1,
          calibrationRecordAvailable: 1,
          engagementSignalPresent: 0,
        }),
      ).status,
    ).toBe("engagement-unconfirmed");
  });

  test("public dispatcher uses the source-bounded 2D and 3D visual, not the legacy contact simulator", () => {
    const dispatcher = readFileSync(
      join(ROOT, "src", "components", "patents", "visuals", "index.tsx"),
      "utf8",
    );
    expect(dispatcher).toContain("DaVinciInterfaceSim");
    expect(dispatcher).toContain("DaVinciInterface3D");
    expect(dispatcher).not.toContain('import("./DaVinciSim")');
    expect(dispatcher).not.toContain('import("./three/DaVinci3D")');
  });

  test("withholds unsupported clinical contact and SI performance telemetry", () => {
    const visual = readFileSync(
      join(ROOT, "src", "components", "patents", "visuals", "three", "DaVinciInterface3D.tsx"),
      "utf8",
    );
    const topology = readFileSync(
      join(ROOT, "src", "physics", "daVinciInterfaceTopology.ts"),
      "utf8",
    );

    expect(visual).toContain("isRefused: true");
    expect(visual).toContain("DA_VINCI_INTERFACE_SOURCE_BOUNDARY");
    expect(DA_VINCI_INTERFACE_SOURCE_BOUNDARY).toContain(
      "quantitative mechanics are therefore refused",
    );
    expect(visual).not.toContain("contactForceN");
    expect(visual).not.toContain("tipVelocity");
    expect(topology).not.toContain("CUP_MASS_KG");
    expect(topology).not.toContain("CONTACT_STIFFNESS");
  });

  test("seats every solid node and keeps the holder-to-tool bridge connected in every signal state", () => {
    const model = buildDaVinciInterfaceModel();
    try {
      for (const params of [
        {},
        { compatibilitySignalPresent: 0 },
        { calibrationRecordAvailable: 0 },
        { engagementSignalPresent: 0 },
      ]) {
        model.setTopologyState(
          resolveDaVinciInterfaceTopology(readDaVinciInterfaceControls(params)),
        );
        for (const connection of model.connectivityReceipt()) {
          expect(connection.gapSceneUnits).toBeLessThanOrEqual(2e-8);
        }
        expect(model.root.getObjectByName("Engagement structures and signals")?.visible).toBe(true);
      }
      expect(
        model.root.getObjectByName("Processor support seated on topology plinth"),
      ).toBeDefined();
      expect(model.root.getObjectByName("Holder support seated on topology plinth")).toBeDefined();
    } finally {
      model.dispose();
    }
  });

  test("exposes one auditable source-bounded state contract on both public projections", () => {
    const three = readFileSync(
      join(ROOT, "src", "components", "patents", "visuals", "three", "DaVinciInterface3D.tsx"),
      "utf8",
    );
    const two = readFileSync(
      join(ROOT, "src", "components", "patents", "visuals", "DaVinciInterfaceSim.tsx"),
      "utf8",
    );
    for (const source of [three, two]) {
      expect(source).toContain("data-interface-status");
      expect(source).toContain("data-processor-can-configure");
      expect(source).toContain('data-quantitative-mechanics="refused"');
      expect(source).toContain("DA_VINCI_INTERFACE_KERNEL_SOURCE");
    }
    expect(DA_VINCI_INTERFACE_KERNEL_SOURCE).toBe("source-bounded-ts");
    expect(three).not.toContain("ensureDaVinciTopologyWasm");
    expect(three).not.toContain("tryDaVinciTopologyWasmStep");
  });

  test("backs the camera away enough to retain the whole interface on a narrow phone", () => {
    for (const preset of ["overview", "processor", "tool"] as const) {
      const desktop = daVinciInterfaceViewForViewport(preset, 1214);
      const phone = daVinciInterfaceViewForViewport(preset, 286);
      const distance = (view: typeof desktop) =>
        Math.hypot(
          view.pos[0] - view.target[0],
          view.pos[1] - view.target[1],
          view.pos[2] - view.target[2],
        );
      expect(phone.target).toEqual(desktop.target);
      expect(distance(phone) / distance(desktop)).toBeCloseTo(1.55, 10);
    }
  });
});
