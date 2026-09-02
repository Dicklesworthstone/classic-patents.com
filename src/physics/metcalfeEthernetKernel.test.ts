import { describe, expect, test } from "bun:test";
import {
  INITIAL_ETHERNET_STATE,
  readEthernetControls,
  stepMetcalfeEthernetSi,
} from "./metcalfeEthernetKernel";

describe("US 4,063,220 Metcalfe Ethernet CSMA/CD Physics Kernel", () => {
  test("clamps controls to valid operational physics bounds", () => {
    const raw = {
      cableLengthMeters: 5000, // exceeds max 1000m
      dataRateMbps: 100, // exceeds 10 Mbps
      stationCount: 100, // exceeds 32
      offeredLoad: -5,
      packetSizeBytes: 10, // below min 64 bytes
    };
    const controls = readEthernetControls(raw);
    expect(controls.cableLengthMeters).toBe(1000);
    expect(controls.dataRateMbps).toBe(10.0);
    expect(controls.stationCount).toBe(32);
    expect(controls.offeredLoad).toBe(0.01);
    expect(controls.packetSizeBytes).toBe(64);
  });

  test("computes accurate electromagnetic propagation velocity and delay in coaxial dielectric", () => {
    const controls = readEthernetControls({ cableLengthMeters: 500, dataRateMbps: 2.94 });
    const { metrics } = stepMetcalfeEthernetSi(INITIAL_ETHERNET_STATE, controls, 0.016);

    // Propagation velocity ~ 1.9986e8 m/s (~0.66c in polyethylene)
    expect(metrics.propVelocityMps).toBeGreaterThan(1.9e8);
    expect(metrics.propVelocityMps).toBeLessThan(2.1e8);

    // 500 meters at ~2e8 m/s = ~2500 ns
    expect(metrics.oneWayPropDelayNs).toBeGreaterThan(2400);
    expect(metrics.oneWayPropDelayNs).toBeLessThan(2600);

    // Bit period at 2.94 Mbps = 1 / 2.94e6 ≈ 340.1 ns
    expect(metrics.bitPeriodNs).toBeGreaterThan(330);
    expect(metrics.bitPeriodNs).toBeLessThan(350);

    // Slot time includes round trip + transceiver turnaround = 2 * 2500ns + 40ns = ~5.04 µs
    expect(metrics.slotTimeMicrosec).toBeGreaterThan(4.8);
    expect(metrics.slotTimeMicrosec).toBeLessThan(5.5);
  });

  test("detects analog voltage superposition collision and executes Binary Exponential Backoff", () => {
    // Normal single transmission: 1 station transmitting -> -1.0V bus
    const singleTxControls = readEthernetControls({
      station1Transmitting: true,
      station2Transmitting: false,
      triggerCollision: false,
    });
    const singleResult = stepMetcalfeEthernetSi(INITIAL_ETHERNET_STATE, singleTxControls, 0.016);
    expect(singleResult.metrics.busVoltageVolts).toBe(-1.0);
    expect(singleResult.metrics.collisionDetected).toBe(false);
    expect(singleResult.metrics.carrierSensed).toBe(true);

    // Collision state: Both stations transmitting simultaneously -> -2.0V bus
    const collisionControls = readEthernetControls({
      station1Transmitting: true,
      station2Transmitting: true,
      triggerCollision: true,
    });
    const colResult = stepMetcalfeEthernetSi(INITIAL_ETHERNET_STATE, collisionControls, 0.016);
    expect(colResult.metrics.busVoltageVolts).toBe(-2.0);
    expect(colResult.metrics.collisionDetected).toBe(true);
    expect(colResult.state.totalCollisionCount).toBeGreaterThan(0);
    expect(colResult.state.station1State).toBe("jamming");
    expect(colResult.state.station1BackoffRemainingSec).toBeGreaterThan(0);
  });

  test("models RF power dissipation in 50-ohm terminator resistors", () => {
    const controls = readEthernetControls({ station1Transmitting: true });
    const { metrics } = stepMetcalfeEthernetSi(INITIAL_ETHERNET_STATE, controls, 0.016);
    // P = V^2 / R = (-1.0)^2 / 50 = 20 mW
    expect(metrics.terminatorDissipationMw).toBe(20.0);
  });

  test("replays packet-completion trials exactly without ambient randomness", () => {
    const controls = readEthernetControls({
      dataRateMbps: 0.5,
      packetSizeBytes: 1518,
      station1Transmitting: true,
      station2Transmitting: false,
    });
    let replayA = INITIAL_ETHERNET_STATE;
    let replayB = INITIAL_ETHERNET_STATE;

    for (let frame = 0; frame < 64; frame += 1) {
      const resultA = stepMetcalfeEthernetSi(replayA, controls, 0.0001);
      const resultB = stepMetcalfeEthernetSi(replayB, controls, 0.0001);

      expect(resultA).toEqual(resultB);
      replayA = resultA.state;
      replayB = resultB.state;
    }
  });
});
