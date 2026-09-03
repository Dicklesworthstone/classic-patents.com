import { describe, expect, test } from "bun:test";
import * as THREE from "three";
import {
  DEFAULT_BAER_CONTROLS,
  INITIAL_BAER_STATE,
  stepBaerOdysseySi,
} from "@/physics/baerOdysseyKernel";
import { baerViewForViewport } from "./baerOdysseyCamera";
import { buildBaerOdysseyModel } from "./baerOdysseyModel";

describe("US 3,728,480 Ralph Baer source-apparatus 3D model", () => {
  test("keeps both visual faces on the shared transport owner", async () => {
    const [twoDimensionalSource, threeDimensionalSource, ownerSource, dispatcherSource] =
      await Promise.all([
        Bun.file(new URL("../BaerOdysseySim.tsx", import.meta.url)).text(),
        Bun.file(new URL("./BaerOdyssey3D.tsx", import.meta.url)).text(),
        Bun.file(new URL("../PatentPhysicsRuntimeOwner.tsx", import.meta.url)).text(),
        Bun.file(new URL("../index.tsx", import.meta.url)).text(),
      ]);
    for (const source of [twoDimensionalSource, threeDimensionalSource]) {
      expect(source).toContain("readBaerOdysseyTapeFrame");
      expect(source).not.toContain("createBaerOdysseyTransportUpdater");
      expect(source).not.toContain("stepBaerOdysseySi");
      expect(source).not.toContain("simStateRef");
    }
    expect(ownerSource.match(/createBaerOdysseyTransportUpdater/g)).toHaveLength(2);
    expect(dispatcherSource).toContain("<BaerOdysseyPhysicsRuntimeOwner patentId={patentId} />");
    expect(twoDimensionalSource).not.toContain("setTimeout");
    expect(threeDimensionalSource).not.toContain("sm:absolute sm:bottom-16");
    expect(threeDimensionalSource).toContain('className="shrink-0 p-4');
    expect(threeDimensionalSource).toContain('aria-label="Dot 20 horizontal potentiometer"');
    expect(threeDimensionalSource).not.toContain("English / Ball Spin");
    expect(threeDimensionalSource).not.toContain("Program Card");
  });

  test("backs the overview camera out for portrait phones without changing desktop framing", () => {
    const desktop = baerViewForViewport("overview", 1000);
    const phone = baerViewForViewport("overview", 320);
    const distance = (view: typeof desktop) =>
      Math.hypot(
        view.position[0] - view.target[0],
        view.position[1] - view.target[1],
        view.position[2] - view.target[2],
      );
    expect(distance(phone) / distance(desktop)).toBeCloseTo(1.55, 8);
    expect(desktop.position).toEqual([0, 3.25, 5.65]);
  });

  test("instantiates the source-labelled receiver, master unit, control units, gun, and dots", () => {
    const model = buildBaerOdysseyModel();
    expect(model.root.name).toBe("US 3,728,480 Figure 1 and 1B Source Apparatus");

    for (const name of [
      "Television Receiver 10",
      "Master Control Unit 21",
      "Individual Control Unit 22",
      "Individual Control Unit 23",
      "Photoelectric Light Gun 27",
      "Light gun 27 photoelectric cell lens",
      "Light gun 27 grip",
      "Light gun 27 trigger",
      "Generated dot 20",
      "Generated dot 20-1",
    ]) {
      expect(model.root.getObjectByName(name), name).toBeDefined();
    }
    expect(model.root.getObjectByName("Program Card")).toBeUndefined();

    model.dispose();
  });

  test("rests every apparatus housing on the table and seats each physical control", () => {
    const model = buildBaerOdysseyModel();
    model.root.updateMatrixWorld(true);
    const bounds = (name: string) => {
      const object = model.root.getObjectByName(name);
      expect(object, name).toBeDefined();
      return new THREE.Box3().setFromObject(object as THREE.Object3D);
    };

    expect(bounds("Supporting table surface").max.y).toBeCloseTo(0, 8);
    for (const name of [
      "Receiver 10 cabinet",
      "Master unit 21 housing",
      "Control unit 22 housing",
      "Control unit 23 housing",
      "Photoelectric Light Gun 27",
    ]) {
      expect(bounds(name).min.y, name).toBeCloseTo(0, 2);
    }

    for (const [housingName, controlNames] of [
      ["Master unit 21 housing", ["Reset switch 26", "Background color knob 15"]],
      ["Control unit 22 housing", ["Control 22 vertical knob 16", "Control 22 horizontal knob 17"]],
      [
        "Control unit 23 housing",
        ["Control 23 vertical knob 16-1", "Control 23 horizontal knob 17-1"],
      ],
    ] as const) {
      const housing = bounds(housingName).expandByScalar(0.006);
      for (const controlName of controlNames) {
        expect(housing.intersectsBox(bounds(controlName)), controlName).toBe(true);
      }
    }
    expect(model.root.getObjectByName("Control 22 vertical knob 16")?.position.x).not.toBe(
      model.root.getObjectByName("Control 22 horizontal knob 17")?.position.x,
    );

    model.dispose();
  });

  test("tethers every detached unit to a housing and routes each cable onto the table", () => {
    const model = buildBaerOdysseyModel();
    model.root.updateMatrixWorld(true);
    const bounds = (name: string) => {
      const object = model.root.getObjectByName(name);
      expect(object, name).toBeDefined();
      return new THREE.Box3().setFromObject(object as THREE.Object3D).expandByScalar(0.02);
    };
    const connections = [
      ["Shielded connection means 12", "Master unit 21 housing", "Receiver 10 cabinet"],
      ["Control unit 22 cable", "Control unit 22 housing", "Master unit 21 housing"],
      ["Control unit 23 cable", "Control unit 23 housing", "Master unit 21 housing"],
      ["Light gun 27 electrical cable", "Photoelectric Light Gun 27", "Master unit 21 housing"],
    ] as const;

    for (const [cableName, startName, endName] of connections) {
      const cable = model.root.getObjectByName(cableName);
      expect(cable, cableName).toBeDefined();
      expect(cable?.children.length, cableName).toBeGreaterThan(0);
      const start = new THREE.Vector3().fromArray(cable?.userData.start ?? []);
      const end = new THREE.Vector3().fromArray(cable?.userData.end ?? []);
      expect(bounds(startName).containsPoint(start), `${cableName} start`).toBe(true);
      expect(bounds(endName).containsPoint(end), `${cableName} end`).toBe(true);
      expect(new THREE.Box3().setFromObject(cable as THREE.Object3D).min.y, cableName).toBeLessThan(
        0.025,
      );
    }

    model.dispose();
  });

  test("updates both generated dots and visibly withholds the Claim 1 topology", () => {
    const model = buildBaerOdysseyModel();
    const result = stepBaerOdysseySi(INITIAL_BAER_STATE, DEFAULT_BAER_CONTROLS, 0.016);
    const dot20 = model.root.getObjectByName("Generated dot 20");
    const dot20Prime = model.root.getObjectByName("Generated dot 20-1");
    expect(dot20).toBeDefined();
    expect(dot20Prime).toBeDefined();

    model.updateState(result.metrics, DEFAULT_BAER_CONTROLS);
    const initialPosition = dot20?.position.clone();
    expect(dot20?.visible).toBe(true);
    expect(dot20Prime?.visible).toBe(true);

    const movedControls = {
      ...DEFAULT_BAER_CONTROLS,
      player1PotX: 0.65,
      player1PotY: 0.85,
    };
    const movedResult = stepBaerOdysseySi(result.state, movedControls, 0.016);
    model.updateState(movedResult.metrics, movedControls);
    expect(dot20?.position.equals(initialPosition ?? new THREE.Vector3())).toBe(false);

    const withheldControls = { ...movedControls, claim1Active: false };
    const withheld = stepBaerOdysseySi(movedResult.state, withheldControls, 0.016);
    model.updateState(withheld.metrics, withheldControls);
    expect(dot20?.visible).toBe(false);
    expect(dot20Prime?.visible).toBe(false);

    const cableSegment = model.root.getObjectByName("Shielded connection means 12 segment 1");
    expect(cableSegment).toBeInstanceOf(THREE.Mesh);
    expect(
      ((cableSegment as THREE.Mesh).material as THREE.MeshStandardMaterial).emissiveIntensity,
    ).toBe(0);

    model.dispose();
  });
});
