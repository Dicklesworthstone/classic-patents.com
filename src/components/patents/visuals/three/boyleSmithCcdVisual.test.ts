import { describe, expect, test } from "bun:test";
import * as THREE from "three";
import {
  DEFAULT_BOYLE_SMITH_CCD_SOURCE_CONTROLS,
  INITIAL_BOYLE_SMITH_CCD_SOURCE_STATE,
  stepBoyleSmithCcdSource,
} from "@/physics/boyleSmithCcdKernel";
import { createBoyleSmithCcdSourceModel } from "./boyleSmithCcdSourceModel";

describe("US 3,858,232 Boyle-Smith source-apparatus visual", () => {
  test("routes both faces through one shared owner and the new source-bounded components", async () => {
    const [twoDimensionalSource, threeDimensionalSource, ownerSource, dispatcherSource] =
      await Promise.all([
        Bun.file(new URL("../BoyleSmithCcdSourceSim.tsx", import.meta.url)).text(),
        Bun.file(new URL("./BoyleSmithCcdSource3D.tsx", import.meta.url)).text(),
        Bun.file(new URL("../PatentPhysicsRuntimeOwner.tsx", import.meta.url)).text(),
        Bun.file(new URL("../index.tsx", import.meta.url)).text(),
      ]);

    for (const source of [twoDimensionalSource, threeDimensionalSource]) {
      expect(source).toContain("readBoyleSmithCcdTapeFrame");
      expect(source).toContain("useFrankenSimPhysics");
      expect(source).not.toContain("createBoyleSmithCcdTransportUpdater");
      expect(source).not.toContain("stepBoyleSmithCcdSource");
    }
    expect(threeDimensionalSource).toContain("const toggleCutaway = () =>");
    expect(threeDimensionalSource).not.toContain("setCutaway((current)");
    expect(twoDimensionalSource).toContain("const phaseGateIndices = Array.from(");
    expect(twoDimensionalSource).not.toContain(".filter((index) => index % 3 === phaseIndex)");
    expect(ownerSource).toContain("createBoyleSmithCcdTransportUpdater");
    expect(dispatcherSource).toContain('import("./BoyleSmithCcdSourceSim")');
    expect(dispatcherSource).toContain('import("./three/BoyleSmithCcdSource3D")');
    expect(dispatcherSource).toContain(
      '<BoyleSmithCcdPhysicsRuntimeOwner patentId="us-3858232-boyle-smith-ccd" />',
    );
  });

  test("uses deterministic procedural geometry without package theater or private clocks", async () => {
    const [modelSource, studioSource] = await Promise.all([
      Bun.file(new URL("./boyleSmithCcdSourceModel.ts", import.meta.url)).text(),
      Bun.file(new URL("./BoyleSmithCcdSource3D.tsx", import.meta.url)).text(),
    ]);
    const routedSource = `${modelSource}\n${studioSource}`;
    for (const forbidden of [
      "GLTFLoader",
      ".gltf",
      ".glb",
      "Math.random()",
      "Date.now()",
      "performance.now()",
      "dipPackage",
      "bondWire",
      "clockFrequencyMhz",
      "gateVoltageV",
      "incidentLux",
      "fullWellCapacityElectrons",
    ]) {
      expect(routedSource).not.toContain(forbidden);
    }
    expect(studioSource).toContain("CTE, carrier count, and watts: not disclosed.");
  });

  test("instantiates every connected Figure 2 layer, phase conductor, and external circuit", () => {
    const model = createBoyleSmithCcdSourceModel();
    expect(model.root.name).toBe("US 3,858,232 Figure 2 source shift-register apparatus");
    for (const name of [
      "N-type single-conductivity storage medium 20",
      "Insulating layer 21",
      "Electrode sequence 22 23 24",
      "Three connected phase conductors 22-prime 23-prime 24-prime",
      "Charge input region 25",
      "Induced potential-energy minima 27",
      "Output depletion region 28 and p-n junction 29",
      "Output load 30",
      "Bias source 31",
      "Output electrode 32",
      "Regeneration circuit 33",
      "Figure 3 minority-carrier pattern 1101",
    ]) {
      expect(model.root.getObjectByName(name), name).toBeDefined();
    }
    expect(model.gateArray.children).toHaveLength(12);
    expect(model.phaseRails.children).toHaveLength(15);
    for (const phase of [22, 23, 24]) {
      expect(
        model.phaseRails.children.filter((child) =>
          child.name.startsWith(`Conductor ${phase}-prime`),
        ),
      ).toHaveLength(4);
    }
    expect(model.chargePackets.children).toHaveLength(3);
    model.dispose();
  });

  test("seats the semiconductor stack and physically connects every phase bus", () => {
    const model = createBoyleSmithCcdSourceModel();
    model.root.updateMatrixWorld(true);
    const bounds = (object: THREE.Object3D) => new THREE.Box3().setFromObject(object);

    expect(bounds(model.substrate).max.y).toBeCloseTo(0, 7);
    expect(bounds(model.oxide).min.y).toBeCloseTo(0, 7);
    expect(bounds(model.oxide).max.y).toBeCloseTo(0.12, 8);
    for (const gate of model.gateArray.children) {
      expect(bounds(gate).min.y, gate.name).toBeCloseTo(0.12, 8);
    }
    for (const conductor of model.phaseRails.children) {
      expect(bounds(conductor).min.y, conductor.name).toBeCloseTo(0.12, 8);
    }

    expect(bounds(model.inputRegion).intersectsBox(bounds(model.substrate))).toBe(true);
    expect(bounds(model.outputRegion).intersectsBox(bounds(model.substrate))).toBe(true);
    expect(bounds(model.inputRegion).intersectsBox(bounds(model.gateArray.children[0]))).toBe(true);
    expect(bounds(model.outputRegion).intersectsBox(bounds(model.gateArray.children[11]))).toBe(
      true,
    );

    for (let phase = 0; phase < 3; phase += 1) {
      const rail = model.root.getObjectByName(`Phase conductor ${22 + phase}-prime`);
      expect(rail).toBeDefined();
      for (let gateIndex = phase; gateIndex < 12; gateIndex += 3) {
        const connector = model.root.getObjectByName(
          `Conductor ${22 + phase}-prime to ${gateIndex + 1}`,
        );
        expect(connector).toBeDefined();
        expect(
          bounds(connector as THREE.Object3D).intersectsBox(bounds(rail as THREE.Object3D)),
        ).toBe(true);
        expect(
          bounds(connector as THREE.Object3D).intersectsBox(
            bounds(model.gateArray.children[gateIndex]),
          ),
        ).toBe(true);
      }
    }
    model.dispose();
  });

  test("tethers output load, bias, and regeneration loop to the device endpoints", () => {
    const model = createBoyleSmithCcdSourceModel();
    model.root.updateMatrixWorld(true);
    const bounds = (name: string) => {
      const object = model.root.getObjectByName(name);
      expect(object, name).toBeDefined();
      return new THREE.Box3().setFromObject(object as THREE.Object3D).expandByScalar(0.01);
    };

    expect(bounds("Output electrode 32").intersectsBox(bounds(model.outputRegion.name))).toBe(true);
    expect(bounds("Bias source 31").intersectsBox(bounds("Output load 30"))).toBe(true);

    for (const [wireName, startName, endName] of [
      ["Output electrode 32 to load 30", "Output electrode 32", "Output load 30"],
      [
        "Output electrode 32 to regeneration circuit 33",
        "Output electrode 32",
        "Regeneration circuit 33",
      ],
      ["Regeneration circuit 33 to input 25", "Regeneration circuit 33", model.inputRegion.name],
    ] as const) {
      const wire = model.root.getObjectByName(wireName);
      expect(wire, wireName).toBeDefined();
      const start = new THREE.Vector3().fromArray(wire?.userData.start ?? []);
      const end = new THREE.Vector3().fromArray(wire?.userData.end ?? []);
      expect(bounds(startName).containsPoint(start), `${wireName} start`).toBe(true);
      expect(bounds(endName).containsPoint(end), `${wireName} end`).toBe(true);
    }
    model.dispose();
  });

  test("moves visible packets only when timing and Claim 1 topology admit transfer", () => {
    const model = createBoyleSmithCcdSourceModel();
    const admitted = stepBoyleSmithCcdSource(
      INITIAL_BOYLE_SMITH_CCD_SOURCE_STATE,
      DEFAULT_BOYLE_SMITH_CCD_SOURCE_CONTROLS,
      0.1,
    );
    model.update(admitted.metrics);
    const packet = model.chargePackets.children[0];
    const admittedX = packet?.position.x;
    expect(packet?.visible).toBe(true);

    const refusedTiming = stepBoyleSmithCcdSource(
      admitted.state,
      { ...DEFAULT_BOYLE_SMITH_CCD_SOURCE_CONTROLS, pulseWidthToStepRatio: 0.2 },
      0.1,
    );
    model.update(refusedTiming.metrics);
    expect(packet?.visible).toBe(true);
    expect(packet?.position.x).toBe(admittedX);

    const withheld = stepBoyleSmithCcdSource(
      refusedTiming.state,
      { ...DEFAULT_BOYLE_SMITH_CCD_SOURCE_CONTROLS, claim1SingleConductivityPresent: false },
      0.1,
    );
    model.update(withheld.metrics);
    expect(packet?.visible).toBe(false);
    expect(model.potentialWells.children.every((well) => !well.visible)).toBe(true);
    model.dispose();
  });

  test("reveals the stored packets with a geometric gate cutaway rather than drawing through solids", () => {
    const model = createBoyleSmithCcdSourceModel();
    const firstGate = model.gateArray.children[0];
    const firstCarrier = model.chargePackets.children[0]?.children[0] as THREE.Mesh | undefined;
    expect(firstCarrier).toBeDefined();
    expect((firstCarrier as THREE.Mesh).material as THREE.MeshStandardMaterial).toMatchObject({
      depthTest: true,
    });

    model.setCutaway(true);
    expect(firstGate?.scale.z).toBe(0.5);
    expect(firstGate?.position.z).toBe(-0.7);

    model.setCutaway(false);
    expect(firstGate?.scale.z).toBe(1);
    expect(firstGate?.position.z).toBe(0);
    model.dispose();
  });
});
