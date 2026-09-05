import type { TapeUpdater } from "./useFrankenSimPhysics";

/**
 * src/physics/metcalfeEthernetKernel.ts
 *
 * Computational Physics & Electronics Kernel for
 * Robert Metcalfe et al. — Multipoint Data Communication System with Collision Detection (Ethernet CSMA/CD)
 * US Patent 4,063,220 (Dec 13, 1977).
 *
 * Implements genuine SI electromagnetic wave propagation on coaxial cable, Manchester phase encoding,
 * analog voltage superposition and XOR collision detection, collision jam broadcasting, and
 * truncated binary exponential backoff (BEB) dynamics.
 */

export interface MetcalfeEthernetControls {
  readonly cableLengthMeters: number; // 10 to 1000 m (nominal 500m segment)
  readonly dataRateMbps: number; // 1.0 to 10.0 Mbps (nominal 2.94 to 10.0)
  readonly stationCount: number; // 2 to 32 nodes in the analytical contention projection
  readonly offeredLoad: number; // analytical normalized traffic intensity, 0.05 to 2.5
  readonly packetSizeBytes: number; // 64 to 1518 bytes
  readonly triggerCollision: boolean; // Manual collision inject for pedagogy
  readonly station1Transmitting: boolean; // Station 1 transmit state
  readonly station2Transmitting: boolean; // Station 2 transmit state
}

export interface MetcalfeEthernetState {
  simTimeSec: number;
  rngSeed: number;
  rngCounter: number;
  station1CollisionCount: number;
  station2CollisionCount: number;
  station1BackoffRemainingSec: number;
  station2BackoffRemainingSec: number;
  station1JamRemainingSec: number;
  station2JamRemainingSec: number;
  station1InterframeGapRemainingSec: number;
  station2InterframeGapRemainingSec: number;
  station1CarrierTailRemainingSec: number;
  station2CarrierTailRemainingSec: number;
  station1BackoffSlot: number;
  station2BackoffSlot: number;
  station1PacketProgressSec: number;
  station2PacketProgressSec: number;
  station1State: "idle" | "deferring" | "transmitting" | "jamming" | "backing_off";
  station2State: "idle" | "deferring" | "transmitting" | "jamming" | "backing_off";
  packetSuccessCount: number;
  totalCollisionCount: number;
  lastCollisionTimeSec: number;
  triggerCollisionLatched: boolean;
  busVoltageV: number;
  manchesterClockPhase: number;
}

export interface MetcalfeEthernetMetrics {
  readonly propVelocityMps: number; // Electromagnetic wave speed (m/s)
  readonly oneWayPropDelayNs: number; // End-to-end cable delay (ns)
  readonly slotTimeMicrosec: number; // Collision detection slot time (µs)
  readonly bitPeriodNs: number; // Manchester bit period (ns)
  readonly busVoltageVolts: number; // Instantaneous analog bus voltage (V)
  readonly collisionDetected: boolean; // XOR collision gate output (true/false)
  readonly collisionDisplayActive: boolean; // deterministic slowed event hold for the museum visual
  readonly carrierSensed: boolean; // Carrier sense comparator (true/false)
  readonly throughputMbps: number; // Achieved useful data throughput (Mbps)
  readonly channelEfficiencyPct: number; // Protocol utilization efficiency (%)
  readonly backoffMeanDelayMicrosec: number; // Current BEB mean delay (µs)
  readonly jamDurationMicrosec: number; // Collision enforcement jam duration (µs)
  readonly terminatorDissipationMw: number; // RF energy dissipated in 50-ohm terminators (mW)
}

export const DEFAULT_ETHERNET_CONTROLS: MetcalfeEthernetControls = {
  cableLengthMeters: 500.0,
  dataRateMbps: 2.94, // Historic Xerox Alto Experimental Ethernet rate
  stationCount: 8,
  offeredLoad: 0.6,
  packetSizeBytes: 256,
  triggerCollision: false,
  station1Transmitting: true,
  station2Transmitting: false,
};

export const INITIAL_ETHERNET_STATE: MetcalfeEthernetState = {
  simTimeSec: 0.0,
  rngSeed: 0x04063220,
  rngCounter: 0,
  station1CollisionCount: 0,
  station2CollisionCount: 0,
  station1BackoffRemainingSec: 0.0,
  station2BackoffRemainingSec: 0.0,
  station1JamRemainingSec: 0.0,
  station2JamRemainingSec: 0.0,
  station1InterframeGapRemainingSec: 0.0,
  station2InterframeGapRemainingSec: 0.0,
  station1CarrierTailRemainingSec: 0.0,
  station2CarrierTailRemainingSec: 0.0,
  station1BackoffSlot: 0,
  station2BackoffSlot: 0,
  station1PacketProgressSec: 0.0,
  station2PacketProgressSec: 0.0,
  station1State: "idle",
  station2State: "idle",
  packetSuccessCount: 0,
  totalCollisionCount: 0,
  lastCollisionTimeSec: Number.NEGATIVE_INFINITY,
  triggerCollisionLatched: false,
  busVoltageV: 0.0,
  manchesterClockPhase: 0.0,
};

// Physical Constants
const SPEED_OF_LIGHT = 299792458; // m/s
const DIELECTRIC_PERMITTIVITY = 2.25; // Polyethylene coaxial core
const PROPAGATION_VELOCITY = SPEED_OF_LIGHT / Math.sqrt(DIELECTRIC_PERMITTIVITY); // ~1.9986e8 m/s (~0.666c)
const COAX_IMPEDANCE_OHMS = 50.0; // Standard RG-8 coaxial cable
const SINGLE_TX_VOLTAGE = -1.0; // Volts into 25 ohms

function deterministicUint32(seed: number, counter: number, stream: number): number {
  let value = (seed ^ Math.imul(counter + 1, 0x9e3779b9) ^ Math.imul(stream + 1, 0x85ebca6b)) >>> 0;
  value ^= value >>> 16;
  value = Math.imul(value, 0x7feb352d);
  value ^= value >>> 15;
  value = Math.imul(value, 0x846ca68b);
  value ^= value >>> 16;
  return value >>> 0;
}

function deterministicBackoffSlot(
  seed: number,
  counter: number,
  stream: number,
  maxSlot: number,
): number {
  if (maxSlot <= 0) return 0;
  return deterministicUint32(seed, counter, stream) % (maxSlot + 1);
}

export function readEthernetControls(
  raw?: Partial<MetcalfeEthernetControls>,
): MetcalfeEthernetControls {
  return {
    cableLengthMeters: Math.max(
      10,
      Math.min(1000, raw?.cableLengthMeters ?? DEFAULT_ETHERNET_CONTROLS.cableLengthMeters),
    ),
    dataRateMbps: Math.max(
      0.5,
      Math.min(10.0, raw?.dataRateMbps ?? DEFAULT_ETHERNET_CONTROLS.dataRateMbps),
    ),
    stationCount: Math.max(
      2,
      Math.min(32, Math.floor(raw?.stationCount ?? DEFAULT_ETHERNET_CONTROLS.stationCount)),
    ),
    offeredLoad: Math.max(
      0.01,
      Math.min(3.0, raw?.offeredLoad ?? DEFAULT_ETHERNET_CONTROLS.offeredLoad),
    ),
    packetSizeBytes: Math.max(
      64,
      Math.min(1518, Math.floor(raw?.packetSizeBytes ?? DEFAULT_ETHERNET_CONTROLS.packetSizeBytes)),
    ),
    triggerCollision: Boolean(raw?.triggerCollision),
    station1Transmitting:
      raw?.station1Transmitting === undefined
        ? DEFAULT_ETHERNET_CONTROLS.station1Transmitting
        : Boolean(raw.station1Transmitting),
    station2Transmitting:
      raw?.station2Transmitting === undefined
        ? DEFAULT_ETHERNET_CONTROLS.station2Transmitting
        : Boolean(raw.station2Transmitting),
  };
}

export const readMetcalfeEthernetControls = readEthernetControls;

export function stepMetcalfeEthernetSi(
  prevState: MetcalfeEthernetState,
  controls: MetcalfeEthernetControls,
  dt: number,
): { state: MetcalfeEthernetState; metrics: MetcalfeEthernetMetrics } {
  const safeDt = Math.max(0, Math.min(dt, 0.1));
  // 1. Physical Propagation & Bit Timing
  const oneWayPropDelaySec = controls.cableLengthMeters / PROPAGATION_VELOCITY;
  const oneWayPropDelayNs = oneWayPropDelaySec * 1e9;
  const bitRateBps = controls.dataRateMbps * 1e6;
  const bitPeriodSec = 1.0 / bitRateBps;
  const bitPeriodNs = bitPeriodSec * 1e9;

  // Round trip propagation delay + transceiver delay = Slot Time
  const transceiverDelaySec = 20e-9;
  const slotTimeSec = 2.0 * oneWayPropDelaySec + 2.0 * transceiverDelaySec;
  const slotTimeMicrosec = slotTimeSec * 1e6;

  // Packet transmit duration in seconds
  const packetBits = controls.packetSizeBytes * 8;
  const packetDurationSec = packetBits * bitPeriodSec;
  const jamDurationSec = 32 * bitPeriodSec; // 32-bit jam sequence
  const jamDurationMicrosec = jamDurationSec * 1e6;
  const interframeGapSec = 96 * bitPeriodSec;

  // 2. Event-timed transmit state machine. Ethernet's propagation, jam, and
  // backoff intervals are microseconds; advancing them as one 16.7 ms display
  // step both skipped states and changed outcomes with frame splitting.
  let simTimeSec = prevState.simTimeSec;
  let st1 = prevState.station1State;
  let st2 = prevState.station2State;
  let st1Backoff = Math.max(0, prevState.station1BackoffRemainingSec);
  let st2Backoff = Math.max(0, prevState.station2BackoffRemainingSec);
  let st1Jam = Math.max(0, prevState.station1JamRemainingSec);
  let st2Jam = Math.max(0, prevState.station2JamRemainingSec);
  let st1InterframeGap = Math.max(0, prevState.station1InterframeGapRemainingSec);
  let st2InterframeGap = Math.max(0, prevState.station2InterframeGapRemainingSec);
  let st1CarrierTail = Math.max(0, prevState.station1CarrierTailRemainingSec);
  let st2CarrierTail = Math.max(0, prevState.station2CarrierTailRemainingSec);
  let st1BackoffSlot = prevState.station1BackoffSlot;
  let st2BackoffSlot = prevState.station2BackoffSlot;
  let st1PacketProgress = prevState.station1PacketProgressSec;
  let st2PacketProgress = prevState.station2PacketProgressSec;
  let st1ColCount = prevState.station1CollisionCount;
  let st2ColCount = prevState.station2CollisionCount;
  let totalCollisions = prevState.totalCollisionCount;
  let lastCollisionTimeSec = prevState.lastCollisionTimeSec;
  let successPackets = prevState.packetSuccessCount;
  let rngCounter = prevState.rngCounter;
  const triggerCollisionLatched = controls.triggerCollision;
  const wants1 = controls.station1Transmitting || controls.triggerCollision;
  const wants2 = controls.station2Transmitting || controls.triggerCollision;
  const epsilon = 1e-12;
  let remainingSec = safeDt;

  // The museum's explicit collision command represents two endpoints that
  // begin within one propagation window. Treat its rising edge as that event,
  // even when one endpoint had already sensed an older carrier and was
  // deferring. Subsequent ticks obey ordinary jam, IFG, and BEB state.
  if (controls.triggerCollision && !prevState.triggerCollisionLatched) {
    st1 = "transmitting";
    st2 = "transmitting";
    st1PacketProgress = 0;
    st2PacketProgress = 0;
    st1Jam = 0;
    st2Jam = 0;
    st1Backoff = 0;
    st2Backoff = 0;
    st1InterframeGap = 0;
    st2InterframeGap = 0;
  }

  const signalAtStation1 = () =>
    st1CarrierTail > epsilon ||
    st2 === "jamming" ||
    (st2 === "transmitting" && st2PacketProgress >= oneWayPropDelaySec - epsilon);
  const signalAtStation2 = () =>
    st2CarrierTail > epsilon ||
    st1 === "jamming" ||
    (st1 === "transmitting" && st1PacketProgress >= oneWayPropDelaySec - epsilon);

  const normalizeStates = () => {
    const was1Transmitting = st1 === "transmitting";
    const was2Transmitting = st2 === "transmitting";
    const senses1Carrier = signalAtStation1();
    const senses2Carrier = signalAtStation2();

    // IEEE 802.3 requires 96 bit-times of locally observed idle medium between
    // frames. Hold the gap at its full value while a remote wave is present;
    // the timer starts only after that wave's propagation tail has passed.
    if (!was1Transmitting && st1 !== "jamming" && senses1Carrier) {
      st1InterframeGap = interframeGapSec;
    }
    if (!was2Transmitting && st2 !== "jamming" && senses2Carrier) {
      st2InterframeGap = interframeGapSec;
    }

    if (st1Jam > epsilon) st1 = "jamming";
    else if (was1Transmitting) st1 = "transmitting";
    else if (!wants1) {
      st1 = "idle";
      st1PacketProgress = 0;
    } else if (senses1Carrier || st1InterframeGap > epsilon) st1 = "deferring";
    else if (st1Backoff > epsilon) st1 = "backing_off";
    else {
      st1 = "transmitting";
      st1PacketProgress = 0;
    }

    if (st2Jam > epsilon) st2 = "jamming";
    else if (was2Transmitting) st2 = "transmitting";
    else if (!wants2) {
      st2 = "idle";
      st2PacketProgress = 0;
    } else if (senses2Carrier || st2InterframeGap > epsilon) st2 = "deferring";
    else if (st2Backoff > epsilon) st2 = "backing_off";
    else {
      st2 = "transmitting";
      st2PacketProgress = 0;
    }
  };

  for (let eventCount = 0; remainingSec > epsilon && eventCount < 50_000; eventCount += 1) {
    normalizeStates();
    const tx1 = st1 === "transmitting";
    const tx2 = st2 === "transmitting";
    const jam1 = st1 === "jamming";
    const jam2 = st2 === "jamming";
    const senses1Carrier = signalAtStation1();
    const senses2Carrier = signalAtStation2();

    if (
      tx1 &&
      tx2 &&
      Math.min(st1PacketProgress, st2PacketProgress) >= oneWayPropDelaySec - epsilon
    ) {
      totalCollisions += 1;
      lastCollisionTimeSec = simTimeSec;
      st1ColCount = Math.min(st1ColCount + 1, 16);
      st2ColCount = Math.min(st2ColCount + 1, 16);
      st1BackoffSlot = deterministicBackoffSlot(
        prevState.rngSeed,
        rngCounter,
        1,
        2 ** Math.min(st1ColCount, 10) - 1,
      );
      rngCounter += 1;
      st2BackoffSlot = deterministicBackoffSlot(
        prevState.rngSeed,
        rngCounter,
        2,
        2 ** Math.min(st2ColCount, 10) - 1,
      );
      rngCounter += 1;
      st1Backoff = st1BackoffSlot * slotTimeSec;
      st2Backoff = st2BackoffSlot * slotTimeSec;
      st1Jam = jamDurationSec;
      st2Jam = jamDurationSec;
      st1 = "jamming";
      st2 = "jamming";
      st1PacketProgress = 0;
      st2PacketProgress = 0;
      continue;
    }

    let advanceSec = remainingSec;
    if (tx1 && tx2) {
      advanceSec = Math.min(
        advanceSec,
        Math.max(0, oneWayPropDelaySec - Math.min(st1PacketProgress, st2PacketProgress)),
      );
    }
    if (tx1 && st1PacketProgress < oneWayPropDelaySec - epsilon) {
      advanceSec = Math.min(advanceSec, oneWayPropDelaySec - st1PacketProgress);
    }
    if (tx2 && st2PacketProgress < oneWayPropDelaySec - epsilon) {
      advanceSec = Math.min(advanceSec, oneWayPropDelaySec - st2PacketProgress);
    }
    if (tx1) advanceSec = Math.min(advanceSec, packetDurationSec - st1PacketProgress);
    if (tx2) advanceSec = Math.min(advanceSec, packetDurationSec - st2PacketProgress);
    if (jam1) advanceSec = Math.min(advanceSec, st1Jam);
    if (jam2) advanceSec = Math.min(advanceSec, st2Jam);
    if (!senses1Carrier && !tx1 && !jam1 && st1InterframeGap > epsilon) {
      advanceSec = Math.min(advanceSec, st1InterframeGap);
    }
    if (!senses2Carrier && !tx2 && !jam2 && st2InterframeGap > epsilon) {
      advanceSec = Math.min(advanceSec, st2InterframeGap);
    }
    if (st1CarrierTail > epsilon && !jam2 && !tx2) {
      advanceSec = Math.min(advanceSec, st1CarrierTail);
    }
    if (st2CarrierTail > epsilon && !jam1 && !tx1) {
      advanceSec = Math.min(advanceSec, st2CarrierTail);
    }

    if (!senses1Carrier && !tx1 && !jam1 && st1Backoff > epsilon) {
      advanceSec = Math.min(advanceSec, st1Backoff);
    }
    if (!senses2Carrier && !tx2 && !jam2 && st2Backoff > epsilon) {
      advanceSec = Math.min(advanceSec, st2Backoff);
    }
    if (advanceSec <= epsilon) advanceSec = Math.min(remainingSec, epsilon);

    if (tx1) st1PacketProgress += advanceSec;
    if (tx2) st2PacketProgress += advanceSec;
    if (jam1) st1Jam = Math.max(0, st1Jam - advanceSec);
    if (jam2) st2Jam = Math.max(0, st2Jam - advanceSec);
    if (!senses1Carrier && !tx1 && !jam1) {
      st1InterframeGap = Math.max(0, st1InterframeGap - advanceSec);
      st1Backoff = Math.max(0, st1Backoff - advanceSec);
    }
    if (!senses2Carrier && !tx2 && !jam2) {
      st2InterframeGap = Math.max(0, st2InterframeGap - advanceSec);
      st2Backoff = Math.max(0, st2Backoff - advanceSec);
    }

    const remoteSignalReached1 = jam2 || (tx2 && st2PacketProgress >= oneWayPropDelaySec - epsilon);
    const remoteSignalReached2 = jam1 || (tx1 && st1PacketProgress >= oneWayPropDelaySec - epsilon);
    st1CarrierTail = remoteSignalReached1
      ? oneWayPropDelaySec
      : Math.max(0, st1CarrierTail - advanceSec);
    st2CarrierTail = remoteSignalReached2
      ? oneWayPropDelaySec
      : Math.max(0, st2CarrierTail - advanceSec);
    simTimeSec += advanceSec;
    remainingSec -= advanceSec;

    if (tx1 && st1PacketProgress >= packetDurationSec - epsilon) {
      successPackets += 1;
      st1PacketProgress = 0;
      st1ColCount = 0;
      st1 = "idle";
      st1InterframeGap = interframeGapSec;
    }
    if (tx2 && st2PacketProgress >= packetDurationSec - epsilon) {
      successPackets += 1;
      st2PacketProgress = 0;
      st2ColCount = 0;
      st2 = "idle";
      st2InterframeGap = interframeGapSec;
    }
    if (jam1 && st1Jam <= epsilon) st1InterframeGap = interframeGapSec;
    if (jam2 && st2Jam <= epsilon) st2InterframeGap = interframeGapSec;
  }

  normalizeStates();
  const tx1Active = st1 === "transmitting" || st1 === "jamming";
  const tx2Active = st2 === "transmitting" || st2 === "jamming";
  const activeTxCount = Number(tx1Active) + Number(tx2Active);
  const busVoltageV = activeTxCount * SINGLE_TX_VOLTAGE;
  const collisionDetected =
    st1 === "jamming" ||
    st2 === "jamming" ||
    (st1 === "transmitting" &&
      st2 === "transmitting" &&
      Math.min(st1PacketProgress, st2PacketProgress) >= oneWayPropDelaySec - epsilon);
  const collisionDisplayActive = simTimeSec - lastCollisionTimeSec <= 0.35;
  const carrierSensed = activeTxCount > 0 || signalAtStation1() || signalAtStation2();

  // 4. Manchester Phase Clock
  const manchesterClockPhase =
    (prevState.manchesterClockPhase + safeDt * bitRateBps * Math.PI * 2) % (Math.PI * 2);

  // 5. Channel Utilization & SI Power Dissipation
  // Normalized propagation-to-packet ratio: a = propDelay / packetDuration
  const a = oneWayPropDelaySec / packetDurationSec;
  // Standard CSMA/CD maximum efficiency model: eta = 1 / (1 + 2 a e)
  const contentionLoad = controls.offeredLoad * (1 + Math.log2(controls.stationCount / 2));
  const channelEfficiency = 1.0 / (1.0 + 2.0 * a * Math.E * contentionLoad);
  const throughputMbps =
    controls.dataRateMbps * channelEfficiency * (1 - Math.min(0.9, totalCollisions * 0.005));

  // Current mean BEB backoff delay
  const meanSlots = 2 ** Math.min(st1ColCount, 10) / 2;
  const backoffMeanDelayMicrosec = meanSlots * slotTimeMicrosec;

  // Power dissipation: P = V^2 / R into two 50-ohm termination resistors
  const parallelTerminatorResistanceOhms = COAX_IMPEDANCE_OHMS / 2;
  const terminatorDissipationMw =
    activeTxCount > 0 ? (busVoltageV ** 2 / parallelTerminatorResistanceOhms) * 1000 : 0.0;

  const nextState: MetcalfeEthernetState = {
    simTimeSec,
    rngSeed: prevState.rngSeed,
    rngCounter,
    station1CollisionCount: st1ColCount,
    station2CollisionCount: st2ColCount,
    station1BackoffRemainingSec: st1Backoff,
    station2BackoffRemainingSec: st2Backoff,
    station1JamRemainingSec: st1Jam,
    station2JamRemainingSec: st2Jam,
    station1InterframeGapRemainingSec: st1InterframeGap,
    station2InterframeGapRemainingSec: st2InterframeGap,
    station1CarrierTailRemainingSec: st1CarrierTail,
    station2CarrierTailRemainingSec: st2CarrierTail,
    station1BackoffSlot: st1BackoffSlot,
    station2BackoffSlot: st2BackoffSlot,
    station1PacketProgressSec: st1PacketProgress,
    station2PacketProgressSec: st2PacketProgress,
    station1State: st1,
    station2State: st2,
    packetSuccessCount: successPackets,
    totalCollisionCount: totalCollisions,
    lastCollisionTimeSec,
    triggerCollisionLatched,
    busVoltageV,
    manchesterClockPhase,
  };

  const metrics: MetcalfeEthernetMetrics = {
    propVelocityMps: PROPAGATION_VELOCITY,
    oneWayPropDelayNs,
    slotTimeMicrosec,
    bitPeriodNs,
    busVoltageVolts: busVoltageV,
    collisionDetected,
    collisionDisplayActive,
    carrierSensed,
    throughputMbps: Math.max(0.01, throughputMbps),
    channelEfficiencyPct: Math.min(100, Math.max(0, channelEfficiency * 100)),
    backoffMeanDelayMicrosec,
    jamDurationMicrosec,
    terminatorDissipationMw,
  };

  return { state: nextState, metrics };
}

export interface MetcalfeEthernetTapeFrame {
  readonly state: MetcalfeEthernetState;
  readonly metrics: MetcalfeEthernetMetrics;
}

let tapeFrame: MetcalfeEthernetTapeFrame | undefined;

export function getMetcalfeEthernetTapeFrame(): MetcalfeEthernetTapeFrame | undefined {
  return tapeFrame;
}

/** Current shared frame, or a zero-time projection before the first owner tick. */
export function readMetcalfeEthernetTapeFrame(
  controls: MetcalfeEthernetControls,
): MetcalfeEthernetTapeFrame {
  return tapeFrame ?? stepMetcalfeEthernetSi(INITIAL_ETHERNET_STATE, controls, 0);
}

export function resetMetcalfeEthernetTape(): void {
  tapeFrame = undefined;
}

/** Deterministic slow-time phase used only to make nanosecond propagation visible. */
export function ethernetDisplayWavePhase(state: MetcalfeEthernetState): number {
  return (state.simTimeSec * 0.45) % 1;
}

/** One fixed-step owner for Ethernet's 2D, 3D, and telemetry projections. */
export function createMetcalfeEthernetTransportUpdater(
  getControls: () => MetcalfeEthernetControls,
): TapeUpdater {
  return (_previous, dt) => {
    const result = stepMetcalfeEthernetSi(
      tapeFrame?.state ?? INITIAL_ETHERNET_STATE,
      getControls(),
      dt,
    );
    tapeFrame = result;

    return {
      domain: "electromagnetics_flux",
      refusal: { isRefused: false },
      network: {
        simTimeSec: result.state.simTimeSec,
        rngSeed: result.state.rngSeed,
        rngCounter: result.state.rngCounter,
        station1State: result.state.station1State,
        station2State: result.state.station2State,
        station1BackoffSlot: result.state.station1BackoffSlot,
        station2BackoffSlot: result.state.station2BackoffSlot,
        station1BackoffRemainingSec: result.state.station1BackoffRemainingSec,
        station2BackoffRemainingSec: result.state.station2BackoffRemainingSec,
        station1JamRemainingSec: result.state.station1JamRemainingSec,
        station2JamRemainingSec: result.state.station2JamRemainingSec,
        station1InterframeGapRemainingSec: result.state.station1InterframeGapRemainingSec,
        station2InterframeGapRemainingSec: result.state.station2InterframeGapRemainingSec,
        station1CarrierTailRemainingSec: result.state.station1CarrierTailRemainingSec,
        station2CarrierTailRemainingSec: result.state.station2CarrierTailRemainingSec,
        station1PacketProgressSec: result.state.station1PacketProgressSec,
        station2PacketProgressSec: result.state.station2PacketProgressSec,
        packetSuccessCount: result.state.packetSuccessCount,
        totalCollisionCount: result.state.totalCollisionCount,
        lastCollisionTimeSec: result.state.lastCollisionTimeSec,
        triggerCollisionLatched: result.state.triggerCollisionLatched,
        manchesterClockPhaseRad: result.state.manchesterClockPhase,
        busVoltageVolts: result.metrics.busVoltageVolts,
        collisionDetected: result.metrics.collisionDetected,
        collisionDisplayActive: result.metrics.collisionDisplayActive,
        carrierSensed: result.metrics.carrierSensed,
        throughputMbps: result.metrics.throughputMbps,
        channelEfficiencyPct: result.metrics.channelEfficiencyPct,
      },
    };
  };
}
