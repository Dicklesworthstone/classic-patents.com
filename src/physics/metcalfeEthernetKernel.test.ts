import { afterEach, describe, expect, test } from "bun:test";
import {
  createMetcalfeEthernetTransportUpdater,
  DEFAULT_ETHERNET_CONTROLS,
  ethernetDisplayWavePhase,
  getMetcalfeEthernetTapeFrame,
  INITIAL_ETHERNET_STATE,
  readEthernetControls,
  resetMetcalfeEthernetTape,
  stepMetcalfeEthernetSi,
} from "./metcalfeEthernetKernel";

afterEach(() => resetMetcalfeEthernetTape());

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

    // Both endpoints begin before the far carrier can arrive. Their -1 V
    // waves superpose immediately, but collision logic cannot fire until the
    // one-way propagation delay has elapsed.
    const collisionControls = readEthernetControls({
      station1Transmitting: true,
      station2Transmitting: true,
      triggerCollision: true,
    });
    const propagation = stepMetcalfeEthernetSi(INITIAL_ETHERNET_STATE, collisionControls, 0);
    const delaySec = propagation.metrics.oneWayPropDelayNs * 1e-9;
    const beforeArrival = stepMetcalfeEthernetSi(
      INITIAL_ETHERNET_STATE,
      collisionControls,
      delaySec * 0.75,
    );
    expect(beforeArrival.metrics.busVoltageVolts).toBe(-2.0);
    expect(beforeArrival.metrics.collisionDetected).toBe(false);

    const colResult = stepMetcalfeEthernetSi(
      beforeArrival.state,
      collisionControls,
      delaySec * 0.3,
    );
    expect(colResult.metrics.busVoltageVolts).toBe(-2.0);
    expect(colResult.metrics.collisionDetected).toBe(true);
    expect(colResult.state.totalCollisionCount).toBeGreaterThan(0);
    expect(colResult.state.station1State).toBe("jamming");
    expect(colResult.state.station1BackoffRemainingSec).toBeGreaterThanOrEqual(0);
    expect(colResult.state.station1JamRemainingSec).toBeGreaterThan(0);
    expect(colResult.state.station1BackoffSlot).toBeGreaterThanOrEqual(0);
    expect(colResult.state.station1BackoffSlot).toBeLessThanOrEqual(1);
    expect(colResult.state.station2BackoffSlot).toBeGreaterThanOrEqual(0);
    expect(colResult.state.station2BackoffSlot).toBeLessThanOrEqual(1);
    expect(colResult.state.rngCounter).toBe(2);
  });

  test("injects a simultaneous start on the command edge even after one carrier is established", () => {
    const stationA = readEthernetControls({
      station1Transmitting: true,
      station2Transmitting: false,
      triggerCollision: false,
    });
    const established = stepMetcalfeEthernetSi(INITIAL_ETHERNET_STATE, stationA, 0.001);
    expect(established.state.totalCollisionCount).toBe(0);

    const injected = readEthernetControls({
      ...stationA,
      station2Transmitting: true,
      triggerCollision: true,
    });
    const collision = stepMetcalfeEthernetSi(
      established.state,
      injected,
      established.metrics.oneWayPropDelayNs * 1e-9 + 1e-10,
    );
    expect(collision.state.triggerCollisionLatched).toBe(true);
    expect(collision.state.totalCollisionCount).toBe(1);
    expect(collision.state.station1State).toBe("jamming");
    expect(collision.state.station2State).toBe("jamming");
  });

  test("models RF power dissipation in 50-ohm terminator resistors", () => {
    const singleControls = readEthernetControls({ station1Transmitting: true });
    const single = stepMetcalfeEthernetSi(INITIAL_ETHERNET_STATE, singleControls, 0);
    // Two 50-ohm end terminators are 25 ohms in parallel: 1 V² / 25 Ω = 40 mW total.
    expect(single.metrics.terminatorDissipationMw).toBe(40.0);

    const collisionControls = readEthernetControls({
      station1Transmitting: true,
      station2Transmitting: true,
    });
    const collision = stepMetcalfeEthernetSi(INITIAL_ETHERNET_STATE, collisionControls, 0);
    // Analog collision superposition doubles voltage and therefore quadruples total dissipation.
    expect(collision.metrics.busVoltageVolts).toBe(-2);
    expect(collision.metrics.terminatorDissipationMw).toBe(160.0);
  });

  test("replays an identical event tape exactly from an explicit seed and state", () => {
    const controls = readEthernetControls({
      station1Transmitting: true,
      station2Transmitting: true,
      triggerCollision: true,
    });
    const initial = { ...INITIAL_ETHERNET_STATE, rngSeed: 0xdecafbad };

    const replay = () => {
      let state = initial;
      return [0.001, 0.002, 0.004, 0.008, 0.016].map((dt) => {
        const frame = stepMetcalfeEthernetSi(state, controls, dt);
        state = frame.state;
        return frame;
      });
    };

    expect(replay()).toEqual(replay());
  });

  test("uses the explicit seed for bounded backoff variation", () => {
    const controls = readEthernetControls({
      station1Transmitting: true,
      station2Transmitting: true,
      triggerCollision: true,
    });
    const slotPairs = new Set<string>();

    for (const rngSeed of [1, 2, 3, 4, 5, 6, 7, 8]) {
      const delayProbe = stepMetcalfeEthernetSi(
        { ...INITIAL_ETHERNET_STATE, rngSeed },
        controls,
        0,
      );
      const { state } = stepMetcalfeEthernetSi(
        { ...INITIAL_ETHERNET_STATE, rngSeed },
        controls,
        delayProbe.metrics.oneWayPropDelayNs * 1e-9 + 1e-10,
      );
      expect(state.station1BackoffSlot).toBeGreaterThanOrEqual(0);
      expect(state.station1BackoffSlot).toBeLessThanOrEqual(1);
      expect(state.station2BackoffSlot).toBeGreaterThanOrEqual(0);
      expect(state.station2BackoffSlot).toBeLessThanOrEqual(1);
      slotPairs.add(`${state.station1BackoffSlot}:${state.station2BackoffSlot}`);
    }

    expect(slotPairs.size).toBeGreaterThan(1);
  });

  test("counts serialized packet completion without frame-rate dependence", () => {
    const controls = readEthernetControls({
      dataRateMbps: 1,
      packetSizeBytes: 1_000,
      station1Transmitting: true,
      station2Transmitting: false,
    });
    const oneStep = stepMetcalfeEthernetSi(INITIAL_ETHERNET_STATE, controls, 0.016).state;

    let splitState = INITIAL_ETHERNET_STATE;
    for (let frame = 0; frame < 4; frame += 1) {
      splitState = stepMetcalfeEthernetSi(splitState, controls, 0.004).state;
    }

    expect(splitState.packetSuccessCount).toBe(oneStep.packetSuccessCount);
    expect(splitState.station1PacketProgressSec).toBeCloseTo(oneStep.station1PacketProgressSec, 12);
  });

  test("holds the coax carrier through its propagation tail and enforces the 96-bit gap", () => {
    const controls = readEthernetControls({
      cableLengthMeters: 500,
      dataRateMbps: 10,
      packetSizeBytes: 64,
      station1Transmitting: true,
      station2Transmitting: false,
    });
    const packetDurationSec = (controls.packetSizeBytes * 8) / (controls.dataRateMbps * 1e6);
    const completed = stepMetcalfeEthernetSi(INITIAL_ETHERNET_STATE, controls, packetDurationSec);

    expect(completed.state.packetSuccessCount).toBe(1);
    expect(completed.state.station1State).toBe("deferring");
    expect(completed.state.station1InterframeGapRemainingSec).toBeCloseTo(
      96 / (controls.dataRateMbps * 1e6),
      12,
    );
    expect(completed.state.station2CarrierTailRemainingSec).toBeGreaterThan(0);

    const sourceStopped = readEthernetControls({
      ...controls,
      station1Transmitting: false,
    });
    const withinTail = stepMetcalfeEthernetSi(
      completed.state,
      sourceStopped,
      completed.state.station2CarrierTailRemainingSec / 2,
    );
    expect(withinTail.metrics.carrierSensed).toBe(true);
    expect(withinTail.state.station2CarrierTailRemainingSec).toBeGreaterThan(0);

    const afterTail = stepMetcalfeEthernetSi(
      withinTail.state,
      sourceStopped,
      completed.state.station2CarrierTailRemainingSec,
    );
    expect(afterTail.state.station2CarrierTailRemainingSec).toBe(0);
  });

  test("lets a backed-off peer resume after jam, propagation tail, and idle gap", () => {
    const colliding = readEthernetControls({
      cableLengthMeters: 500,
      dataRateMbps: 10,
      packetSizeBytes: 64,
      station1Transmitting: true,
      station2Transmitting: true,
      triggerCollision: true,
    });
    const probe = stepMetcalfeEthernetSi(INITIAL_ETHERNET_STATE, colliding, 0);
    const collision = stepMetcalfeEthernetSi(
      { ...INITIAL_ETHERNET_STATE, rngSeed: 1 },
      colliding,
      probe.metrics.oneWayPropDelayNs * 1e-9 + 1e-10,
    );
    expect(collision.state.station1BackoffSlot).toBe(0);
    expect(collision.state.station2BackoffSlot).toBe(1);

    const peerOnly = readEthernetControls({
      ...colliding,
      triggerCollision: false,
      station1Transmitting: false,
      station2Transmitting: true,
    });
    const resumed = stepMetcalfeEthernetSi(collision.state, peerOnly, 0.0001);
    expect(resumed.state.station2BackoffRemainingSec).toBe(0);
    expect(resumed.state.packetSuccessCount).toBeGreaterThan(0);
    expect(resumed.state.station2State).toBe("transmitting");
  });

  test("keeps collision, jam, and BEB state invariant under display-frame splitting", () => {
    const controls = readEthernetControls({
      station1Transmitting: true,
      station2Transmitting: true,
      triggerCollision: true,
    });
    const oneStep = stepMetcalfeEthernetSi(INITIAL_ETHERNET_STATE, controls, 1 / 60).state;
    const half = stepMetcalfeEthernetSi(INITIAL_ETHERNET_STATE, controls, 1 / 120).state;
    const twoSteps = stepMetcalfeEthernetSi(half, controls, 1 / 120).state;

    expect(twoSteps.totalCollisionCount).toBe(oneStep.totalCollisionCount);
    expect(twoSteps.rngCounter).toBe(oneStep.rngCounter);
    expect(twoSteps.station1State).toBe(oneStep.station1State);
    expect(twoSteps.station2State).toBe(oneStep.station2State);
    expect(twoSteps.station1BackoffRemainingSec).toBeCloseTo(
      oneStep.station1BackoffRemainingSec,
      10,
    );
    expect(twoSteps.station2BackoffRemainingSec).toBeCloseTo(
      oneStep.station2BackoffRemainingSec,
      10,
    );
  });

  test("uses station count in the analytical contention-load projection", () => {
    const twoStations = stepMetcalfeEthernetSi(
      INITIAL_ETHERNET_STATE,
      readEthernetControls({ stationCount: 2 }),
      0,
    );
    const thirtyTwoStations = stepMetcalfeEthernetSi(
      INITIAL_ETHERNET_STATE,
      readEthernetControls({ stationCount: 32 }),
      0,
    );
    expect(thirtyTwoStations.metrics.channelEfficiencyPct).toBeLessThan(
      twoStations.metrics.channelEfficiencyPct,
    );
    expect(thirtyTwoStations.metrics.throughputMbps).toBeLessThan(
      twoStations.metrics.throughputMbps,
    );
  });

  test("continues one seeded event tape when the active visual owner is replaced", () => {
    const controls = readEthernetControls({
      station1Transmitting: true,
      station2Transmitting: true,
      triggerCollision: true,
    });
    const firstFace = createMetcalfeEthernetTransportUpdater(() => controls);
    const firstUpdate = firstFace({} as never, 1 / 60);
    const firstFrame = getMetcalfeEthernetTapeFrame();
    expect(firstUpdate?.network?.rngCounter).toBe(firstFrame?.state.rngCounter);

    const secondFace = createMetcalfeEthernetTransportUpdater(() => controls);
    secondFace({} as never, 1 / 60);
    const secondFrame = getMetcalfeEthernetTapeFrame();
    expect(secondFrame?.state.simTimeSec).toBeCloseTo(2 / 60, 12);
    expect(secondFrame?.state.rngCounter).toBeGreaterThanOrEqual(firstFrame?.state.rngCounter ?? 0);
    expect(secondFrame?.state.totalCollisionCount).toBeGreaterThanOrEqual(
      firstFrame?.state.totalCollisionCount ?? 0,
    );
  });

  test("replays shared network telemetry and its display phase exactly", () => {
    const replay = () => {
      resetMetcalfeEthernetTape();
      const updater = createMetcalfeEthernetTransportUpdater(() => DEFAULT_ETHERNET_CONTROLS);
      return Array.from({ length: 8 }, () => {
        const update = updater({} as never, 1 / 60);
        const state = getMetcalfeEthernetTapeFrame()?.state;
        return {
          update,
          state: structuredClone(state),
          phase: state ? ethernetDisplayWavePhase(state) : -1,
        };
      });
    };

    const first = replay();
    const second = replay();
    expect(first).toEqual(second);
    expect(first.at(-1)?.phase).toBeGreaterThan(first[0].phase);
  });
});
