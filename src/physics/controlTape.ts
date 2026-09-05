/**
 * controlTape.ts
 *
 * Bounded versioned tape of canonical control events at simulation ticks,
 * deterministic checkpoints, and replay engine for patent physics.
 *
 * Implements:
 * 1. Bounded versioned tape with model identity, initial conditions, and seeded state.
 * 2. Deterministic checkpoint/restore and backward/forward scrubbing.
 * 3. Float quantization policy (6 decimal places) preventing IEEE-754 drift.
 * 4. Honest state digestion (explicit 'host:' vs 'blake3:').
 * 5. Refusal on incompatible model identity or artifact mismatch without inventing state.
 * 6. Authored pedagogical teaching sequences for Wright Flyer (warp/rudder coordination)
 *    and Lamarr (perforated paper roll frequency hopping).
 */

export interface ControlTapeEvent {
  readonly tick: number;
  readonly paramId: string;
  readonly value: number;
  readonly previousValue?: number;
}

export interface ControlTapeCheckpoint {
  readonly tick: number;
  readonly state: Record<string, number>;
  readonly digest: string;
  readonly digestKind: "host" | "blake3";
  readonly label?: string;
  readonly teachingNote?: string;
}

export interface ControlTape {
  readonly version: 1;
  readonly tapeId: string;
  readonly patentId: string;
  readonly modelIdentity: string;
  readonly tickS: number;
  readonly initialConditions: Readonly<Record<string, number>>;
  readonly seed: number;
  readonly totalTicks: number;
  readonly events: readonly ControlTapeEvent[];
  readonly checkpoints: readonly ControlTapeCheckpoint[];
  readonly title?: string;
  readonly description?: string;
  readonly isTeachingSequence?: boolean;
}

export interface ReplayResult {
  readonly tick: number;
  readonly state: Record<string, number>;
  readonly digest: string;
  readonly digestKind: "host" | "blake3";
  readonly activeCheckpoint: ControlTapeCheckpoint | null;
  readonly refused: boolean;
  readonly refusalReason?: string;
}

export interface ValidationResult {
  readonly valid: boolean;
  readonly reason?: string;
}

/**
 * Maximum capacity for an in-memory visitor recording.
 * At 60 ticks per second, 3600 frames equals 60 seconds of recording.
 */
export const MAX_TAPE_EVENTS = 3600;

/**
 * Quantize floating point numbers to a canonical representation.
 * Prevents non-deterministic roundoff differences across JS engines and platforms.
 */
export function quantizeFloat(val: number, precision = 6): number {
  if (!Number.isFinite(val)) return 0;
  const factor = 10 ** precision;
  return Math.round(val * factor) / factor;
}

/**
 * Computes an honest digest over canonical state.
 * Never prefixes 'blake3:' unless an admitted WASM hasher actually stepped.
 */
export function computeTapeDigest(
  state: Record<string, number>,
  tick: number,
  seed = 0,
  hasWasmHasher = false,
  wasmBlake3Digest?: string,
): { digest: string; digestKind: "host" | "blake3" } {
  if (hasWasmHasher && wasmBlake3Digest) {
    const d = wasmBlake3Digest.startsWith("blake3:")
      ? wasmBlake3Digest
      : `blake3:${wasmBlake3Digest}`;
    return { digest: d, digestKind: "blake3" };
  }

  // Canonical FNV-1a over sorted, quantized key-value pairs
  const sortedKeys = Object.keys(state).sort();
  let h = (2166136261 ^ seed ^ tick) >>> 0;
  for (const k of sortedKeys) {
    for (let i = 0; i < k.length; i++) {
      h ^= k.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    const qVal = quantizeFloat(state[k]);
    const bits = Math.round(qVal * 1000000);
    h ^= bits;
    h = Math.imul(h, 16777619) >>> 0;
  }
  return {
    digest: `host:${(h >>> 0).toString(16).padStart(8, "0")}`,
    digestKind: "host",
  };
}

/**
 * Validates whether a tape is compatible with the target patent and model identity.
 */
export function validateTapeCompatibility(
  tape: ControlTape,
  currentPatentId: string,
  currentModelIdentity: string,
): ValidationResult {
  if (tape.version !== 1) {
    return { valid: false, reason: `Unsupported tape version ${tape.version}; expected 1` };
  }
  if (tape.patentId !== currentPatentId) {
    return {
      valid: false,
      reason: `Tape belongs to '${tape.patentId}', cannot replay on '${currentPatentId}'`,
    };
  }
  if (tape.modelIdentity !== currentModelIdentity) {
    return {
      valid: false,
      reason: `Incompatible model identity: tape requires '${tape.modelIdentity}', current is '${currentModelIdentity}'`,
    };
  }
  return { valid: true };
}

/**
 * Tape recorder that captures parameter changes into a bounded versioned tape.
 */
export class ControlTapeRecorder {
  private events: ControlTapeEvent[] = [];
  private checkpoints: ControlTapeCheckpoint[] = [];
  private currentState: Record<string, number>;
  private isRecording = false;
  private currentTick = 0;

  constructor(
    public readonly patentId: string,
    public readonly modelIdentity: string,
    public readonly initialConditions: Record<string, number>,
    public readonly seed = 0,
    public readonly tickS = 1 / 60,
  ) {
    this.currentState = { ...initialConditions };
    // Create initial checkpoint at tick 0
    const { digest, digestKind } = computeTapeDigest(this.currentState, 0, this.seed);
    this.checkpoints.push({
      tick: 0,
      state: { ...this.currentState },
      digest,
      digestKind,
      label: "Initial State",
    });
  }

  start() {
    this.isRecording = true;
  }

  stop() {
    this.isRecording = false;
  }

  get active(): boolean {
    return this.isRecording;
  }

  get tick(): number {
    return this.currentTick;
  }

  advanceTick(count = 1) {
    if (!this.isRecording) return;
    this.currentTick += count;

    // Auto-create checkpoint every 60 ticks (~1 second)
    if (this.currentTick % 60 === 0) {
      const { digest, digestKind } = computeTapeDigest(
        this.currentState,
        this.currentTick,
        this.seed,
      );
      this.checkpoints.push({
        tick: this.currentTick,
        state: { ...this.currentState },
        digest,
        digestKind,
      });
    }
  }

  recordEvent(paramId: string, value: number) {
    if (!this.isRecording) return;
    if (this.events.length >= MAX_TAPE_EVENTS) {
      // Memory bound reached: ignore further inputs to avoid runaway allocation
      return;
    }

    const previousValue = this.currentState[paramId];
    this.currentState[paramId] = quantizeFloat(value);

    this.events.push({
      tick: this.currentTick,
      paramId,
      value: this.currentState[paramId],
      previousValue: previousValue !== undefined ? quantizeFloat(previousValue) : undefined,
    });
  }

  addCheckpoint(label?: string, note?: string) {
    const { digest, digestKind } = computeTapeDigest(
      this.currentState,
      this.currentTick,
      this.seed,
    );
    this.checkpoints.push({
      tick: this.currentTick,
      state: { ...this.currentState },
      digest,
      digestKind,
      label,
      teachingNote: note,
    });
  }

  exportTape(title?: string, description?: string): ControlTape {
    return {
      version: 1,
      tapeId: `tape-${this.patentId}-${Date.now()}`,
      patentId: this.patentId,
      modelIdentity: this.modelIdentity,
      tickS: this.tickS,
      initialConditions: { ...this.initialConditions },
      seed: this.seed,
      totalTicks: Math.max(this.currentTick, 1),
      events: [...this.events],
      checkpoints: [...this.checkpoints],
      title,
      description,
      isTeachingSequence: false,
    };
  }
}

/**
 * Deterministic Replayer for Control Tapes.
 * Handles forward/backward seeking, checkpoint restoration, and refusal on model mismatch.
 */
export class ControlTapeReplayer {
  private currentTick = 0;
  private state: Record<string, number>;
  private lastValidCheckpoint: ControlTapeCheckpoint;
  private isRefused = false;
  private refusalReason?: string;

  constructor(
    public readonly tape: ControlTape,
    currentPatentId: string,
    currentModelIdentity: string,
  ) {
    const validation = validateTapeCompatibility(tape, currentPatentId, currentModelIdentity);
    if (!validation.valid) {
      this.isRefused = true;
      this.refusalReason = validation.reason;
      this.state = { ...tape.initialConditions };
      this.lastValidCheckpoint = {
        tick: 0,
        state: { ...tape.initialConditions },
        digest: "refused",
        digestKind: "host",
      };
      return;
    }

    this.state = { ...tape.initialConditions };
    const firstCp = tape.checkpoints.find((cp) => cp.tick === 0) ?? {
      tick: 0,
      state: { ...tape.initialConditions },
      ...computeTapeDigest(tape.initialConditions, 0, tape.seed),
    };
    this.lastValidCheckpoint = firstCp;
  }

  get tick(): number {
    return this.currentTick;
  }

  get currentState(): Readonly<Record<string, number>> {
    return this.state;
  }

  get refused(): boolean {
    return this.isRefused;
  }

  get reason(): string | undefined {
    return this.refusalReason;
  }

  /**
   * Seeks deterministically to targetTick.
   * If refused, refuses to step and returns last legal checkpoint state without inventing values.
   */
  seekTo(targetTick: number): ReplayResult {
    if (this.isRefused) {
      return {
        tick: this.lastValidCheckpoint.tick,
        state: { ...this.lastValidCheckpoint.state },
        digest: this.lastValidCheckpoint.digest,
        digestKind: this.lastValidCheckpoint.digestKind,
        activeCheckpoint: this.lastValidCheckpoint,
        refused: true,
        refusalReason: this.refusalReason,
      };
    }

    const clampedTick = Math.max(0, Math.min(targetTick, this.tape.totalTicks));

    // Find the closest prior checkpoint at t <= clampedTick
    let bestCp: ControlTapeCheckpoint | null = null;
    for (const cp of this.tape.checkpoints) {
      if (cp.tick <= clampedTick && (!bestCp || cp.tick > bestCp.tick)) {
        bestCp = cp;
      }
    }

    // Start state from closest checkpoint or initial conditions
    const startTick = bestCp ? bestCp.tick : 0;
    const workingState: Record<string, number> = bestCp
      ? { ...bestCp.state }
      : { ...this.tape.initialConditions };

    // Apply all events between startTick and clampedTick in strict chronological order
    for (const evt of this.tape.events) {
      if (evt.tick > startTick && evt.tick <= clampedTick) {
        workingState[evt.paramId] = quantizeFloat(evt.value);
      }
    }

    this.currentTick = clampedTick;
    this.state = workingState;
    if (bestCp) {
      this.lastValidCheckpoint = bestCp;
    }

    const { digest, digestKind } = computeTapeDigest(this.state, this.currentTick, this.tape.seed);
    const exactCp = this.tape.checkpoints.find((cp) => cp.tick === clampedTick) ?? bestCp;

    return {
      tick: this.currentTick,
      state: { ...this.state },
      digest,
      digestKind,
      activeCheckpoint: exactCp ?? null,
      refused: false,
    };
  }

  stepForward(delta = 1): ReplayResult {
    return this.seekTo(this.currentTick + delta);
  }

  stepBackward(delta = 1): ReplayResult {
    return this.seekTo(this.currentTick - delta);
  }

  rewind(): ReplayResult {
    return this.seekTo(0);
  }
}

// ----------------------------------------------------------------------------
// Authored Pedagogical Teaching Sequences
// (Author teaching aids; NOT historical experimental records)
// ----------------------------------------------------------------------------

/**
 * Wright Flyer 3-Axis Lateral Control and Adverse Yaw Compensation
 * Teaches Claim 1 (wing warp) and Claim 18 (cable linkage to coordinated rudder).
 */
export const WRIGHT_FLYER_TEACHING_TAPE: ControlTape = {
  version: 1,
  tapeId: "wright-flyer-warp-rudder-coordination-lesson",
  patentId: "us-821393-wright-flyer",
  modelIdentity: "wrightKernel.ts@v1",
  tickS: 1 / 60,
  seed: 19031217,
  totalTicks: 180, // 3 seconds at 60 Hz
  title: "Wright Flyer: Lateral Control & Rudder Coordination",
  description:
    "Authored pedagogical demonstration showing differential wing warping, resulting adverse yaw, and Claim 18 cable-linked rudder compensation.",
  isTeachingSequence: true,
  initialConditions: {
    airspeed: 30, // 30 mph trim
    wingWarp: 0, // Wings level
    rudder: 0, // Rudder centered
    elevator: 0, // Canard neutral
    coupled: 0, // Uncoupled initially to isolate adverse yaw
  },
  events: [
    // Phase 1: Uncoupled wing warping creates roll torque and adverse yaw
    { tick: 20, paramId: "wingWarp", value: 4 },
    { tick: 35, paramId: "wingWarp", value: 8 },
    { tick: 50, paramId: "wingWarp", value: 12 },

    // Phase 2: Visitor notices adverse yaw pulling opposite to turn; engages Claim 18 coupling
    { tick: 75, paramId: "coupled", value: 1 },
    { tick: 75, paramId: "rudder", value: -5.4 }, // Coupled: 12 deg warp * 0.45 = 5.4 deg opposite rudder

    // Phase 3: Coordinated banked turn held in equilibrium
    { tick: 110, paramId: "elevator", value: 2 }, // Slight up-pitch to hold altitude in bank

    // Phase 4: Return to level flight
    { tick: 140, paramId: "wingWarp", value: 4 },
    { tick: 140, paramId: "rudder", value: -1.8 },
    { tick: 160, paramId: "wingWarp", value: 0 },
    { tick: 160, paramId: "rudder", value: 0 },
    { tick: 170, paramId: "elevator", value: 0 },
  ],
  checkpoints: [
    {
      tick: 0,
      state: { airspeed: 30, wingWarp: 0, rudder: 0, elevator: 0, coupled: 0 },
      digest: "host:b859f218",
      digestKind: "host",
      label: "Straight and Level Trim",
      teachingNote: "Aircraft in trimmed 30 mph horizontal flight; wings level, zero yaw moment.",
    },
    {
      tick: 50,
      state: { airspeed: 30, wingWarp: 12, rudder: 0, elevator: 0, coupled: 0 },
      digest: "host:0bbb3bb2",
      digestKind: "host",
      label: "Adverse Yaw Demonstration (Uncoupled)",
      teachingNote:
        "High lift on twisted right wing creates high induced drag (Di ∝ L²). The aircraft banks left but yaws right—an uncoordinated slip.",
    },
    {
      tick: 75,
      state: { airspeed: 30, wingWarp: 12, rudder: -5.4, elevator: 0, coupled: 1 },
      digest: "host:9087976b",
      digestKind: "host",
      label: "Claim 18 Rudder Coupling Engaged",
      teachingNote:
        "Cables mechanically link the hip cradle to the vertical rudder, turning it into the slip to counteract adverse yaw (Claim 18).",
    },
    {
      tick: 120,
      state: { airspeed: 30, wingWarp: 12, rudder: -5.4, elevator: 2, coupled: 1 },
      digest: "host:39fef5e0",
      digestKind: "host",
      label: "Equilibrium Coordinated Bank",
      teachingNote:
        "Forces and moments balanced: roll angle steady, yaw rate zero, altitude maintained.",
    },
    {
      tick: 180,
      state: { airspeed: 30, wingWarp: 0, rudder: 0, elevator: 0, coupled: 1 },
      digest: "host:08925e64",
      digestKind: "host",
      label: "Return to Wings-Level Trim",
      teachingNote:
        "Pilot returns cradle to center; wing twist relaxes and rudder aligns with slipstream.",
    },
  ],
};

/**
 * Lamarr & Antheil Frequency Hopping Secret Communication System
 * Teaches Claim 1 (slotted paper rolls synchronizing carrier frequency hops).
 */
export const LAMARR_HOPPING_TEACHING_TAPE: ControlTape = {
  version: 1,
  tapeId: "lamarr-secret-communications-frequency-hop-lesson",
  patentId: "us-2292387-lamarr-frequency-hopping",
  modelIdentity: "lamarrSharedKernel.ts@v1",
  tickS: 1 / 60,
  seed: 19420811,
  totalTicks: 150, // 2.5 seconds
  title: "Hedy Lamarr: 88-Frequency Synchronized Hopping",
  description:
    "Authored pedagogical demonstration showing slotted piano-roll cylinders stepping radio frequency to evade narrow-band jamming.",
  isTeachingSequence: true,
  initialConditions: {
    recordPosition: 0, // Slot 0
    commandTone: 100, // 100 Hz steering tone
    claim1SynchronizedRecordsPresent: 1, // Synchronized paper rolls running
  },
  events: [
    // Stepping motor advances cylinder to Slot 1
    { tick: 30, paramId: "recordPosition", value: 1 },
    // Command tone shifts to 500 Hz (turn command)
    { tick: 60, paramId: "commandTone", value: 500 },
    // Stepping motor advances cylinder to Slot 2
    { tick: 90, paramId: "recordPosition", value: 2 },
    // Stepping motor advances cylinder to Slot 3
    { tick: 120, paramId: "recordPosition", value: 3 },
  ],
  checkpoints: [
    {
      tick: 0,
      state: { recordPosition: 0, commandTone: 100, claim1SynchronizedRecordsPresent: 1 },
      digest: "host:7eb898fd",
      digestKind: "host",
      label: "Baseline: Cylinder Slot 0 (Row A)",
      teachingNote:
        "Transmitter and receiver paper rolls are aligned at position 0. Radio carrier broadcasts on frequency band A.",
    },
    {
      tick: 40,
      state: { recordPosition: 1, commandTone: 100, claim1SynchronizedRecordsPresent: 1 },
      digest: "host:84753295",
      digestKind: "host",
      label: "First Frequency Hop (Row B)",
      teachingNote:
        "Spring-driven escapement advances the slotted roll by one step. Both transmitter and torpedo tune simultaneously to band B.",
    },
    {
      tick: 70,
      state: { recordPosition: 1, commandTone: 500, claim1SynchronizedRecordsPresent: 1 },
      digest: "host:fc2d7323",
      digestKind: "host",
      label: "Steering Command Transmitted",
      teachingNote:
        "500 Hz modulation tone energizes acoustic reed in torpedo steering engine to articulate rudder.",
    },
    {
      tick: 100,
      state: { recordPosition: 2, commandTone: 500, claim1SynchronizedRecordsPresent: 1 },
      digest: "host:fb0ac189",
      digestKind: "host",
      label: "Second Frequency Hop (Row C)",
      teachingNote:
        "Next perforation engages detector finger, stepping carrier to band C. Hostile jammer broadcasting on band B is evaded.",
    },
    {
      tick: 150,
      state: { recordPosition: 3, commandTone: 500, claim1SynchronizedRecordsPresent: 1 },
      digest: "host:405c1cf3",
      digestKind: "host",
      label: "Continuous Anti-Jam Tracking",
      teachingNote:
        "Synchronized paper rolls cycle through 88 discrete frequencies matching standard piano roll key width.",
    },
  ],
};
