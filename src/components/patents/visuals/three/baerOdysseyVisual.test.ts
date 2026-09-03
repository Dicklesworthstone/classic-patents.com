import { describe, expect, test } from "bun:test";
import {
  DEFAULT_BAER_CONTROLS,
  INITIAL_BAER_STATE,
  stepBaerOdysseySi,
} from "@/physics/baerOdysseyKernel";
import { baerViewForViewport } from "./BaerOdyssey3D";
import { buildBaerOdysseyModel } from "./baerOdysseyModel";

describe("US 3,728,480 Ralph Baer Magnavox Odyssey 3D Procedural Model", () => {
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
    expect(threeDimensionalSource).toContain("sm:absolute sm:bottom-16");
    expect(threeDimensionalSource).toContain('className="shrink-0 p-4');
    expect(threeDimensionalSource).toContain('aria-label="Player 1 horizontal potentiometer"');
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
    expect(desktop.position).toEqual([0, 2.8, 4.6]);
  });

  test("instantiates full procedural 3D hierarchy: TV receiver, console, controllers, light gun", () => {
    const model = buildBaerOdysseyModel();
    expect(model.root.name).toBe("US 3,728,480 Magnavox Odyssey 3D Studio Model");

    const tvGroup = model.root.getObjectByName("Television Receiver 10");
    expect(tvGroup).toBeDefined();

    const consoleGroup = model.root.getObjectByName("Master Console 14");
    expect(consoleGroup).toBeDefined();

    const p1Group = model.root.getObjectByName("Player 1 Controller 22");
    expect(p1Group).toBeDefined();

    const p2Group = model.root.getObjectByName("Player 2 Controller 23");
    expect(p2Group).toBeDefined();

    const gunGroup = model.root.getObjectByName("Light Gun 27");
    expect(gunGroup).toBeDefined();

    model.dispose();
  });

  test("updates on-screen CRT paddle and ball coordinates from SI physics telemetry", () => {
    const model = buildBaerOdysseyModel();
    const result = stepBaerOdysseySi(INITIAL_BAER_STATE, DEFAULT_BAER_CONTROLS, 0.016);

    expect(() => {
      model.updateState(result.metrics, DEFAULT_BAER_CONTROLS);
    }).not.toThrow();

    // Move player 1 and step
    const movedControls = {
      ...DEFAULT_BAER_CONTROLS,
      player1PotX: 0.35,
      player1PotY: 0.85,
    };
    const movedResult = stepBaerOdysseySi(result.state, movedControls, 0.016);
    expect(() => {
      model.updateState(movedResult.metrics, movedControls);
    }).not.toThrow();

    model.dispose();
  });
});
