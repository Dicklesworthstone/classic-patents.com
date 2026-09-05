import { describe, expect, test } from "bun:test";
import {
  ControlTapeRecorder,
  ControlTapeReplayer,
  computeTapeDigest,
  LAMARR_HOPPING_TEACHING_TAPE,
  MAX_TAPE_EVENTS,
  quantizeFloat,
  validateTapeCompatibility,
  WRIGHT_FLYER_TEACHING_TAPE,
} from "./controlTape";

describe("Control Tape, Checkpoints, and Deterministic Replayer", () => {
  // --------------------------------------------------------------------------
  // 1. Float Quantization & Deterministic Digestion
  // --------------------------------------------------------------------------
  describe("Float Quantization & Canonical Digestion", () => {
    test("quantizeFloat rounds to 6 decimal places and handles non-finite values", () => {
      expect(quantizeFloat(0.123456789)).toBe(0.123457);
      expect(quantizeFloat(10.0)).toBe(10);
      expect(quantizeFloat(Number.NaN)).toBe(0);
      expect(quantizeFloat(Number.POSITIVE_INFINITY)).toBe(0);
    });

    test("state digestion is deterministic and prefixed with 'host:' by default", () => {
      const state = { wingWarp: 12.0000001, airspeed: 30 };
      const d1 = computeTapeDigest(state, 10, 1903);
      const d2 = computeTapeDigest(state, 10, 1903);

      expect(d1.digestKind).toBe("host");
      expect(d1.digest.startsWith("host:")).toBe(true);
      expect(d1.digest).toBe(d2.digest);
    });

    test("never prefixes 'blake3:' without stepped WASM module evidence", () => {
      const state = { wingWarp: 12 };
      const res = computeTapeDigest(state, 10, 0, false);
      expect(res.digestKind).toBe("host");
      expect(res.digest.startsWith("blake3:")).toBe(false);
    });

    test("preserves 'blake3:' when provided by an admitted WASM module", () => {
      const state = { wingWarp: 12 };
      const res = computeTapeDigest(state, 10, 0, true, "blake3:deadbeef01234567");
      expect(res.digestKind).toBe("blake3");
      expect(res.digest).toBe("blake3:deadbeef01234567");
    });

    test("changed seed produces distinct state digest", () => {
      const state = { wingWarp: 12 };
      const d1 = computeTapeDigest(state, 10, 100);
      const d2 = computeTapeDigest(state, 10, 200);
      expect(d1.digest).not.toBe(d2.digest);
    });
  });

  // --------------------------------------------------------------------------
  // 2. Tape Recording & Bounded Memory
  // --------------------------------------------------------------------------
  describe("Tape Recording & Memory Bounds", () => {
    test("records events and checkpoints within memory bounds", () => {
      const recorder = new ControlTapeRecorder(
        "us-821393-wright-flyer",
        "wrightKernel.ts@v1",
        { airspeed: 30, wingWarp: 0 },
        1903,
      );

      recorder.start();
      recorder.advanceTick(10);
      recorder.recordEvent("wingWarp", 4.5);
      recorder.advanceTick(50); // Tick 60 -> triggers auto-checkpoint

      const tape = recorder.exportTape("Test Flight", "Recording test");
      expect(tape.events.length).toBe(1);
      expect(tape.events[0].tick).toBe(10);
      expect(tape.events[0].paramId).toBe("wingWarp");
      expect(tape.events[0].value).toBe(4.5);
      expect(tape.events[0].previousValue).toBe(0);

      // Initial checkpoint at 0 plus auto-checkpoint at 60
      expect(tape.checkpoints.length).toBe(2);
      expect(tape.checkpoints[0].tick).toBe(0);
      expect(tape.checkpoints[1].tick).toBe(60);
      expect(tape.totalTicks).toBe(60);
    });

    test("enforces bounded memory capacity (MAX_TAPE_EVENTS)", () => {
      const recorder = new ControlTapeRecorder("us-821393-wright-flyer", "wrightKernel.ts@v1", {
        airspeed: 30,
      });

      recorder.start();
      // Record more than MAX_TAPE_EVENTS
      for (let i = 0; i < MAX_TAPE_EVENTS + 100; i++) {
        recorder.recordEvent("airspeed", 30 + (i % 5));
      }

      const tape = recorder.exportTape();
      expect(tape.events.length).toBe(MAX_TAPE_EVENTS);
    });
  });

  // --------------------------------------------------------------------------
  // 3. Deterministic Replay & Scrubbing
  // --------------------------------------------------------------------------
  describe("Deterministic Replay & Scrubbing", () => {
    test("forward and backward scrubbing produces identical state and digest", () => {
      const replayer = new ControlTapeReplayer(
        WRIGHT_FLYER_TEACHING_TAPE,
        "us-821393-wright-flyer",
        "wrightKernel.ts@v1",
      );

      expect(replayer.refused).toBe(false);

      // Seek directly to tick 75
      const direct = replayer.seekTo(75);
      expect(direct.state.coupled).toBe(1);
      expect(direct.state.wingWarp).toBe(12);
      expect(direct.state.rudder).toBe(-5.4);

      // Step forward to 120
      replayer.seekTo(120);

      // Scrub backwards to 75
      const scrubbed = replayer.seekTo(75);
      expect(scrubbed.state).toEqual(direct.state);
      expect(scrubbed.digest).toBe(direct.digest);
    });

    test("rewind restores initial conditions at tick 0", () => {
      const replayer = new ControlTapeReplayer(
        WRIGHT_FLYER_TEACHING_TAPE,
        "us-821393-wright-flyer",
        "wrightKernel.ts@v1",
      );

      replayer.seekTo(100);
      const rewound = replayer.rewind();

      expect(rewound.tick).toBe(0);
      expect(rewound.state.wingWarp).toBe(0);
      expect(rewound.state.rudder).toBe(0);
      expect(rewound.state.coupled).toBe(0);
      expect(rewound.digest).toBe(WRIGHT_FLYER_TEACHING_TAPE.checkpoints[0].digest);
    });
  });

  // --------------------------------------------------------------------------
  // 4. Compatibility Validation & Refusal Boundaries
  // --------------------------------------------------------------------------
  describe("Compatibility Validation & Refusal Boundaries", () => {
    test("refuses replay when patentId does not match tape", () => {
      const replayer = new ControlTapeReplayer(
        WRIGHT_FLYER_TEACHING_TAPE,
        "us-381968-tesla-motor", // Wrong patent
        "wrightKernel.ts@v1",
      );

      expect(replayer.refused).toBe(true);
      expect(replayer.reason).toContain("cannot replay on 'us-381968-tesla-motor'");

      // Seeking on a refused replayer returns safe fallback without inventing state
      const result = replayer.seekTo(50);
      expect(result.refused).toBe(true);
      expect(result.tick).toBe(0);
      expect(result.state).toEqual(WRIGHT_FLYER_TEACHING_TAPE.initialConditions);
    });

    test("refuses replay when model identity does not match", () => {
      const replayer = new ControlTapeReplayer(
        WRIGHT_FLYER_TEACHING_TAPE,
        "us-821393-wright-flyer",
        "wrightKernel.ts@v2-incompatible", // Incompatible version
      );

      expect(replayer.refused).toBe(true);
      expect(replayer.reason).toContain("Incompatible model identity");
    });

    test("validateTapeCompatibility rejects unsupported tape version", () => {
      const invalidVersionTape = {
        ...WRIGHT_FLYER_TEACHING_TAPE,
        version: 2 as any,
      };
      const val = validateTapeCompatibility(
        invalidVersionTape,
        "us-821393-wright-flyer",
        "wrightKernel.ts@v1",
      );
      expect(val.valid).toBe(false);
      expect(val.reason).toContain("Unsupported tape version");
    });
  });

  // --------------------------------------------------------------------------
  // 5. Authored Teaching Sequences
  // --------------------------------------------------------------------------
  describe("Authored Teaching Sequences Verification", () => {
    test("Wright Flyer Lateral Control & Rudder Coordination teaching tape", () => {
      const replayer = new ControlTapeReplayer(
        WRIGHT_FLYER_TEACHING_TAPE,
        "us-821393-wright-flyer",
        "wrightKernel.ts@v1",
      );

      // Verify each checkpoint
      for (const cp of WRIGHT_FLYER_TEACHING_TAPE.checkpoints) {
        const res = replayer.seekTo(cp.tick);
        expect(res.tick).toBe(cp.tick);
        expect(res.state).toEqual(cp.state);
        expect(res.digest).toBe(cp.digest);
        expect(res.activeCheckpoint?.label).toBe(cp.label);
        expect(res.activeCheckpoint?.teachingNote).toBe(cp.teachingNote);
      }
    });

    test("Lamarr Frequency Hopping Secret Communications teaching tape", () => {
      const replayer = new ControlTapeReplayer(
        LAMARR_HOPPING_TEACHING_TAPE,
        "us-2292387-lamarr-frequency-hopping",
        "lamarrSharedKernel.ts@v1",
      );

      // Verify each checkpoint
      for (const cp of LAMARR_HOPPING_TEACHING_TAPE.checkpoints) {
        const res = replayer.seekTo(cp.tick);
        expect(res.tick).toBe(cp.tick);
        expect(res.state).toEqual(cp.state);
        expect(res.digest).toBe(cp.digest);
        expect(res.activeCheckpoint?.label).toBe(cp.label);
        expect(res.activeCheckpoint?.teachingNote).toBe(cp.teachingNote);
      }
    });
  });
});
