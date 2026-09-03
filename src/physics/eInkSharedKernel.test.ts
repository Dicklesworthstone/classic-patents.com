import { afterEach, describe, expect, test } from "bun:test";
import {
  createEInkTransportUpdater,
  DEFAULT_EINK_RUNTIME_CONTROLS,
  getEInkTapeFrame,
  readEInkRuntimeControls,
  resetEInkTape,
} from "./eInkSharedKernel";

afterEach(() => resetEInkTape());

describe("US 6,120,588 shared electrophoresis tape", () => {
  test("replays one deterministic particle state across fixed transport ticks", () => {
    const replay = () => {
      resetEInkTape();
      const updater = createEInkTransportUpdater(() => DEFAULT_EINK_RUNTIME_CONTROLS);
      return Array.from({ length: 12 }, () => {
        const telemetry = updater({} as never, 1 / 60);
        return { telemetry, frame: structuredClone(getEInkTapeFrame()) };
      });
    };

    expect(replay()).toEqual(replay());
  });

  test("freezes particle time while paused, publishes one control reprojection, then idles", () => {
    let controls = DEFAULT_EINK_RUNTIME_CONTROLS;
    const updater = createEInkTransportUpdater(() => controls);
    updater({} as never, 1 / 60);
    const running = getEInkTapeFrame();

    controls = readEInkRuntimeControls({ ...controls, running: false, electrodeVoltageVolts: -15 });
    const changed = updater({} as never, 1 / 60);
    const paused = getEInkTapeFrame();
    expect(changed?.em?.voltageVolts).toBe(-15);
    expect(paused?.simTimeSec).toBe(running?.simTimeSec);
    expect(paused?.state.electricFieldVperUm).toBe(-0.3);

    expect(updater({} as never, 1 / 60)).toBeNull();
    expect(getEInkTapeFrame()).toEqual(paused);
  });

  test("clamps physical controls and normalizes numeric run flags", () => {
    expect(
      readEInkRuntimeControls({
        running: 0 as never,
        electrodeVoltageVolts: 100,
        fluidViscosityCp: 0,
        particleChargeCoupled: 100,
      }),
    ).toEqual({
      running: false,
      electrodeVoltageVolts: 15,
      fluidViscosityCp: 0.5,
      particleChargeCoupled: 2,
    });
  });
});
