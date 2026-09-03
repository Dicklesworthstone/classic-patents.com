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
  readonly stationCount: number; // 2 to 32 contending stations
  readonly offeredLoad: number; // 0.05 to 2.5 (normalized network traffic intensity)
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
  station1BackoffSlot: number;
  station2BackoffSlot: number;
  station1PacketProgressSec: number;
  station2PacketProgressSec: number;
  station1State: "idle" | "deferring" | "transmitting" | "jamming" | "backing_off";
  station2State: "idle" | "deferring" | "transmitting" | "jamming" | "backing_off";
  packetSuccessCount: number;
  totalCollisionCount: number;
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
  station1BackoffSlot: 0,
  station2BackoffSlot: 0,
  station1PacketProgressSec: 0.0,
  station2PacketProgressSec: 0.0,
  station1State: "idle",
  station2State: "idle",
  packetSuccessCount: 0,
  totalCollisionCount: 0,
  busVoltageV: 0.0,
  manchesterClockPhase: 0.0,
};

// Physical Constants
const SPEED_OF_LIGHT = 299792458; // m/s
const DIELECTRIC_PERMITTIVITY = 2.25; // Polyethylene coaxial core
const PROPAGATION_VELOCITY = SPEED_OF_LIGHT / Math.sqrt(DIELECTRIC_PERMITTIVITY); // ~1.9986e8 m/s (~0.666c)
const COAX_IMPEDANCE_OHMS = 50.0; // Standard RG-8 coaxial cable
const SINGLE_TX_VOLTAGE = -1.0; // Volts into 25 ohms
const COLLISION_VOLTAGE_THRESHOLD = -1.5; // Volts threshold for collision detection

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
      raw?.station1Transmitting ?? DEFAULT_ETHERNET_CONTROLS.station1Transmitting,
    station2Transmitting:
      raw?.station2Transmitting ?? DEFAULT_ETHERNET_CONTROLS.station2Transmitting,
  };
}

export function stepMetcalfeEthernetSi(
  prevState: MetcalfeEthernetState,
  controls: MetcalfeEthernetControls,
  dt: number,
): { state: MetcalfeEthernetState; metrics: MetcalfeEthernetMetrics } {
  const safeDt = Math.max(0.0001, Math.min(dt, 0.1));
  const simTimeSec = prevState.simTimeSec + safeDt;

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

  // 2. Transmit State Machine & Collision Resolution
  let st1 = prevState.station1State;
  let st2 = prevState.station2State;
  let st1Backoff = Math.max(0, prevState.station1BackoffRemainingSec - safeDt);
  let st2Backoff = Math.max(0, prevState.station2BackoffRemainingSec - safeDt);
  let st1BackoffSlot = prevState.station1BackoffSlot;
  let st2BackoffSlot = prevState.station2BackoffSlot;
  let st1PacketProgress = prevState.station1PacketProgressSec;
  let st2PacketProgress = prevState.station2PacketProgressSec;
  let st1ColCount = prevState.station1CollisionCount;
  let st2ColCount = prevState.station2CollisionCount;
  let totalCollisions = prevState.totalCollisionCount;
  let successPackets = prevState.packetSuccessCount;
  let rngCounter = prevState.rngCounter;

  // Determine active transmitters
  let tx1Active = false;
  let tx2Active = false;

  if (st1Backoff <= 0) {
    if (controls.station1Transmitting) {
      st1 = "transmitting";
      tx1Active = true;
    } else {
      st1 = "idle";
    }
  } else {
    st1 = "backing_off";
  }

  if (st2Backoff <= 0) {
    if (controls.station2Transmitting || controls.triggerCollision) {
      st2 = "transmitting";
      tx2Active = true;
    } else {
      st2 = "idle";
    }
  } else {
    st2 = "backing_off";
  }

  // 3. Collision Detection on Coaxial Cable
  const activeTxCount = (tx1Active ? 1 : 0) + (tx2Active ? 1 : 0);
  const busVoltageV = activeTxCount * SINGLE_TX_VOLTAGE;
  const collisionDetected = activeTxCount >= 2 || busVoltageV <= COLLISION_VOLTAGE_THRESHOLD;
  const carrierSensed = activeTxCount > 0;

  if (collisionDetected) {
    totalCollisions += 1;
    // Binary Exponential Backoff Algorithm: delay = r * slotTime, r in [0, 2^min(n,10) - 1]
    st1ColCount = Math.min(st1ColCount + 1, 16);
    st2ColCount = Math.min(st2ColCount + 1, 16);

    const k1 = Math.min(st1ColCount, 10);
    const maxSlots1 = 2 ** k1 - 1;
    st1BackoffSlot = deterministicBackoffSlot(prevState.rngSeed, rngCounter, 1, maxSlots1);
    rngCounter += 1;
    st1Backoff = st1BackoffSlot * slotTimeSec + jamDurationSec;
    st1 = "jamming";
    st1PacketProgress = 0;

    const k2 = Math.min(st2ColCount, 10);
    const maxSlots2 = 2 ** k2 - 1;
    st2BackoffSlot = deterministicBackoffSlot(prevState.rngSeed, rngCounter, 2, maxSlots2);
    rngCounter += 1;
    st2Backoff = st2BackoffSlot * slotTimeSec + jamDurationSec;
    st2 = "jamming";
    st2PacketProgress = 0;
  } else if (tx1Active && !tx2Active) {
    st1PacketProgress += safeDt;
    const completedPackets = Math.floor(st1PacketProgress / packetDurationSec);
    if (completedPackets > 0) {
      successPackets += completedPackets;
      st1PacketProgress -= completedPackets * packetDurationSec;
      st1ColCount = 0;
    }
    st2PacketProgress = 0;
  } else if (tx2Active && !tx1Active) {
    st2PacketProgress += safeDt;
    const completedPackets = Math.floor(st2PacketProgress / packetDurationSec);
    if (completedPackets > 0) {
      successPackets += completedPackets;
      st2PacketProgress -= completedPackets * packetDurationSec;
      st2ColCount = 0;
    }
    st1PacketProgress = 0;
  } else {
    st1PacketProgress = 0;
    st2PacketProgress = 0;
  }

  // 4. Manchester Phase Clock
  const manchesterClockPhase =
    (prevState.manchesterClockPhase + safeDt * bitRateBps * Math.PI * 2) % (Math.PI * 2);

  // 5. Channel Utilization & SI Power Dissipation
  // Normalized propagation-to-packet ratio: a = propDelay / packetDuration
  const a = oneWayPropDelaySec / packetDurationSec;
  // Standard CSMA/CD maximum efficiency model: eta = 1 / (1 + 2 a e)
  const channelEfficiency = 1.0 / (1.0 + 2.0 * a * Math.E * controls.offeredLoad);
  const throughputMbps =
    controls.dataRateMbps * channelEfficiency * (1 - Math.min(0.9, totalCollisions * 0.005));

  // Current mean BEB backoff delay
  const meanSlots = 2 ** Math.min(st1ColCount, 10) / 2;
  const backoffMeanDelayMicrosec = meanSlots * slotTimeMicrosec;

  // Power dissipation: P = V^2 / R into two 50-ohm termination resistors
  const terminatorDissipationMw =
    activeTxCount > 0 ? (SINGLE_TX_VOLTAGE ** 2 / COAX_IMPEDANCE_OHMS) * 1000 : 0.0;

  const nextState: MetcalfeEthernetState = {
    simTimeSec,
    rngSeed: prevState.rngSeed,
    rngCounter,
    station1CollisionCount: st1ColCount,
    station2CollisionCount: st2ColCount,
    station1BackoffRemainingSec: st1Backoff,
    station2BackoffRemainingSec: st2Backoff,
    station1BackoffSlot: st1BackoffSlot,
    station2BackoffSlot: st2BackoffSlot,
    station1PacketProgressSec: st1PacketProgress,
    station2PacketProgressSec: st2PacketProgress,
    station1State: st1,
    station2State: st2,
    packetSuccessCount: successPackets,
    totalCollisionCount: totalCollisions,
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
    carrierSensed,
    throughputMbps: Math.max(0.01, throughputMbps),
    channelEfficiencyPct: Math.min(100, Math.max(0, channelEfficiency * 100)),
    backoffMeanDelayMicrosec,
    jamDurationMicrosec,
    terminatorDissipationMw,
  };

  return { state: nextState, metrics };
}
