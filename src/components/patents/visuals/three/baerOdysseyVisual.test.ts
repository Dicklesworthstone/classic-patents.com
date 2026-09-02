import { describe, expect, test } from "bun:test";
import {
  DEFAULT_BAER_CONTROLS,
  INITIAL_BAER_STATE,
  stepBaerOdysseySi,
} from "@/physics/baerOdysseyKernel";
import { buildBaerOdysseyModel } from "./baerOdysseyModel";

describe("US 3,728,480 Ralph Baer Magnavox Odyssey 3D Procedural Model", () => {
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
