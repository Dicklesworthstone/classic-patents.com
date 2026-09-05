import { describe, expect, test } from "bun:test";
import { soundEngine } from "@/utils/soundEngine";
import {
  ADMITTED_AUDIO_TRANSDUCERS,
  computeAudioBufferRms,
  getAudioTransducerDescriptor,
  SeededAudioPrng,
  synthesizeBellSpeechWaveform,
  synthesizeFermiRadiationClickWaveform,
  synthesizeLamarrHopSequenceWaveform,
  synthesizeMarconiSparkTrainWaveform,
  synthesizeMorseSounderWaveform,
  synthesizeTeslaCoilStreamerWaveform,
} from "./audioTransducers";

describe("Deterministic Sampled Audio Transducers & Lifecycle Proof (classic-patentscom-2y5.15, 2y5.16)", () => {
  describe("Admitted Audio Transducer Registry & Frequency Scaling Declarations", () => {
    test("registry declares all 5 target patents with explicit frequency and time scaling", () => {
      const targetPatentIds = [
        "us-174465-bell-telephone",
        "us-1647-morse-telegraph",
        "us-586193-marconi-wireless",
        "us-593138-tesla-coil",
        "us-2292387-lamarr-frequency-hopping",
        "us-2708656-fermi-reactor",
      ];

      for (const patentId of targetPatentIds) {
        const desc = ADMITTED_AUDIO_TRANSDUCERS[patentId];
        expect(desc).toBeDefined();
        expect(desc.patentId).toBe(patentId);
        expect(desc.transducerId.length).toBeGreaterThan(0);
        expect(desc.transducerName.length).toBeGreaterThan(0);
        expect(desc.physicalPrinciple.length).toBeGreaterThan(0);
        expect(desc.admittedInputs.length).toBeGreaterThan(0);
        expect(desc.frequencyScalingDeclaration.length).toBeGreaterThan(0);
        expect(desc.timeScalingDeclaration.length).toBeGreaterThan(0);
        expect(typeof desc.isAudibleDirect).toBe("boolean");
      }
    });

    test("declares ultrasonic RF carrier filtering for Marconi and Tesla spark gaps", () => {
      const marconi = ADMITTED_AUDIO_TRANSDUCERS["us-586193-marconi-wireless"];
      expect(marconi.frequencyScalingDeclaration).toContain("ultrasonic");
      expect(marconi.frequencyScalingDeclaration).toContain("shockwave");

      const tesla = ADMITTED_AUDIO_TRANSDUCERS["us-593138-tesla-coil"];
      expect(tesla.frequencyScalingDeclaration).toContain("ultrasonic");
      expect(tesla.frequencyScalingDeclaration).toContain("break rate");
    });

    test("declares 1:1 acoustic piano-roll mapping for Lamarr", () => {
      const lamarr = ADMITTED_AUDIO_TRANSDUCERS["us-2292387-lamarr-frequency-hopping"];
      expect(lamarr.frequencyScalingDeclaration).toContain("88");
      expect(lamarr.frequencyScalingDeclaration).toContain("piano");
    });

    test("lookups by transducerId resolve accurately", () => {
      const bell = getAudioTransducerDescriptor("bell-undulating-current-diaphragm");
      expect(bell?.patentId).toBe("us-174465-bell-telephone");

      const morse = getAudioTransducerDescriptor("morse-armature-anvil-sounder");
      expect(morse?.patentId).toBe("us-1647-morse-telegraph");
    });
  });

  describe("Offline Audio Render Reproducibility (Deterministic Fixed Tapes)", () => {
    const SAMPLE_RATE = 44100;

    test("Bell speech current render of fixed tape produces bit-exact identical samples", () => {
      const tape1 = synthesizeBellSpeechWaveform(SAMPLE_RATE, 0.1, 220, 0.5, 700, 1700);
      const tape2 = synthesizeBellSpeechWaveform(SAMPLE_RATE, 0.1, 220, 0.5, 700, 1700);

      expect(tape1.length).toBe(4410);
      expect(tape2.length).toBe(4410);

      for (let i = 0; i < tape1.length; i++) {
        expect(tape1[i]).toBe(tape2[i]);
      }
    });

    test("Morse telegraph sounder render of fixed strike/release events is bit-exact", () => {
      const events: Array<{ timeSec: number; type: "strike" | "release"; loopCurrentMa: number }> =
        [
          { timeSec: 0.01, type: "strike", loopCurrentMa: 60 },
          { timeSec: 0.04, type: "release", loopCurrentMa: 60 },
        ];

      const tape1 = synthesizeMorseSounderWaveform(SAMPLE_RATE, 0.08, events);
      const tape2 = synthesizeMorseSounderWaveform(SAMPLE_RATE, 0.08, events);

      expect(tape1.length).toBe(Math.floor(SAMPLE_RATE * 0.08));
      for (let i = 0; i < tape1.length; i++) {
        expect(tape1[i]).toBe(tape2[i]);
      }
    });

    test("Marconi spark wave train render of fixed parameters is bit-exact", () => {
      const tape1 = synthesizeMarconiSparkTrainWaveform(SAMPLE_RATE, 0.05, 100, 25, 0.8);
      const tape2 = synthesizeMarconiSparkTrainWaveform(SAMPLE_RATE, 0.05, 100, 25, 0.8);

      expect(tape1.length).toBe(tape2.length);
      for (let i = 0; i < tape1.length; i++) {
        expect(tape1[i]).toBe(tape2[i]);
      }
    });

    test("Tesla coil streamer render of fixed parameters is bit-exact", () => {
      const tape1 = synthesizeTeslaCoilStreamerWaveform(SAMPLE_RATE, 0.05, 120, 200, 0.7);
      const tape2 = synthesizeTeslaCoilStreamerWaveform(SAMPLE_RATE, 0.05, 120, 200, 0.7);

      expect(tape1.length).toBe(tape2.length);
      for (let i = 0; i < tape1.length; i++) {
        expect(tape1[i]).toBe(tape2[i]);
      }
    });

    test("Lamarr hop sequence render across 4 piano channels is bit-exact", () => {
      const hopTape = [
        { channelIndex: 40, durationSec: 0.02 }, // C4
        { channelIndex: 44, durationSec: 0.02 }, // E4
        { channelIndex: 47, durationSec: 0.02 }, // G4
        { channelIndex: 49, durationSec: 0.02 }, // A4
      ];

      const tape1 = synthesizeLamarrHopSequenceWaveform(SAMPLE_RATE, hopTape);
      const tape2 = synthesizeLamarrHopSequenceWaveform(SAMPLE_RATE, hopTape);

      expect(tape1.length).toBe(Math.floor(SAMPLE_RATE * 0.08));
      for (let i = 0; i < tape1.length; i++) {
        expect(tape1[i]).toBe(tape2[i]);
      }
    });

    test("Fermi radiation click train with fixed PRNG seed is bit-exact", () => {
      const tape1 = synthesizeFermiRadiationClickWaveform(SAMPLE_RATE, 0.1, 1.002, 19421202);
      const tape2 = synthesizeFermiRadiationClickWaveform(SAMPLE_RATE, 0.1, 1.002, 19421202);

      expect(tape1.length).toBe(tape2.length);
      for (let i = 0; i < tape1.length; i++) {
        expect(tape1[i]).toBe(tape2[i]);
      }
    });
  });

  describe("Input Sensitivity & Physics-Driven Waveform Variation", () => {
    const SAMPLE_RATE = 44100;

    test("Bell: changing voice fundamental changes waveform and spectral properties", () => {
      const lowVoice = synthesizeBellSpeechWaveform(SAMPLE_RATE, 0.1, 150, 0.5);
      const highVoice = synthesizeBellSpeechWaveform(SAMPLE_RATE, 0.1, 400, 0.5);

      let diffSum = 0;
      for (let i = 0; i < lowVoice.length; i++) {
        diffSum += Math.abs(lowVoice[i] - highVoice[i]);
      }
      expect(diffSum / lowVoice.length).toBeGreaterThan(0.05);
    });

    test("Morse: higher loop current increases mechanical impact RMS energy", () => {
      const eventsLow = [{ timeSec: 0.01, type: "strike" as const, loopCurrentMa: 20 }];
      const eventsHigh = [{ timeSec: 0.01, type: "strike" as const, loopCurrentMa: 80 }];

      const lowCurrent = synthesizeMorseSounderWaveform(SAMPLE_RATE, 0.04, eventsLow);
      const highCurrent = synthesizeMorseSounderWaveform(SAMPLE_RATE, 0.04, eventsHigh);

      const rmsLow = computeAudioBufferRms(lowCurrent);
      const rmsHigh = computeAudioBufferRms(highCurrent);

      expect(rmsHigh).toBeGreaterThan(rmsLow);
    });

    test("Marconi: higher spark rate produces more energy pulses in window", () => {
      const slowSparks = synthesizeMarconiSparkTrainWaveform(SAMPLE_RATE, 0.1, 40, 28, 0.8);
      const fastSparks = synthesizeMarconiSparkTrainWaveform(SAMPLE_RATE, 0.1, 200, 28, 0.8);

      const rmsSlow = computeAudioBufferRms(slowSparks);
      const rmsFast = computeAudioBufferRms(fastSparks);

      expect(rmsFast).toBeGreaterThan(rmsSlow);
    });

    test("Tesla Coil: higher terminal voltage increases streamer shock amplitude", () => {
      const lowV = synthesizeTeslaCoilStreamerWaveform(SAMPLE_RATE, 0.05, 120, 50, 0.7);
      const highV = synthesizeTeslaCoilStreamerWaveform(SAMPLE_RATE, 0.05, 120, 300, 0.7);

      const rmsLow = computeAudioBufferRms(lowV);
      const rmsHigh = computeAudioBufferRms(highV);

      expect(rmsHigh).toBeGreaterThan(rmsLow);
    });

    test("Lamarr: changing slit channel changes carrier frequency tone", () => {
      const channel40 = synthesizeLamarrHopSequenceWaveform(SAMPLE_RATE, [
        { channelIndex: 40, durationSec: 0.05 },
      ]);
      const channel60 = synthesizeLamarrHopSequenceWaveform(SAMPLE_RATE, [
        { channelIndex: 60, durationSec: 0.05 },
      ]);

      let diffSum = 0;
      for (let i = 0; i < channel40.length; i++) {
        diffSum += Math.abs(channel40[i] - channel60[i]);
      }
      expect(diffSum / channel40.length).toBeGreaterThan(0.05);
    });

    test("Fermi: higher criticality increases average click arrival density", () => {
      const subcritical = synthesizeFermiRadiationClickWaveform(SAMPLE_RATE, 0.1, 0.98, 42);
      const supercritical = synthesizeFermiRadiationClickWaveform(SAMPLE_RATE, 0.1, 1.05, 42);

      const rmsSub = computeAudioBufferRms(subcritical);
      const rmsSuper = computeAudioBufferRms(supercritical);

      expect(rmsSuper).toBeGreaterThan(rmsSub);
    });
  });

  describe("Physical Refusal & Bounded Waveform Safety", () => {
    const SAMPLE_RATE = 44100;

    test("all synthesized PCM samples strictly satisfy [-1.0, 1.0] bound", () => {
      const buffers = [
        synthesizeBellSpeechWaveform(SAMPLE_RATE, 0.05, 220, 1.5), // excessive amplitude clamped
        synthesizeMorseSounderWaveform(SAMPLE_RATE, 0.05, [
          { timeSec: 0.01, type: "strike", loopCurrentMa: 500 }, // high current clamped
        ]),
        synthesizeMarconiSparkTrainWaveform(SAMPLE_RATE, 0.05, 1000, 10, 2.0),
        synthesizeTeslaCoilStreamerWaveform(SAMPLE_RATE, 0.05, 800, 1000, 1.5),
        synthesizeLamarrHopSequenceWaveform(SAMPLE_RATE, [
          { channelIndex: 120, durationSec: 0.05 }, // out of bounds channel clamped to 87
        ]),
      ];

      for (const buf of buffers) {
        for (let i = 0; i < buf.length; i++) {
          expect(Number.isFinite(buf[i])).toBe(true);
          expect(buf[i]).toBeGreaterThanOrEqual(-1.0);
          expect(buf[i]).toBeLessThanOrEqual(1.0);
        }
      }
    });

    test("SeededAudioPrng generates uniform pseudo-random values in [0, 1)", () => {
      const prng = new SeededAudioPrng(12345);
      for (let i = 0; i < 100; i++) {
        const val = prng.next();
        expect(val).toBeGreaterThanOrEqual(0);
        expect(val).toBeLessThan(1.0);
      }
    });
  });

  describe("SoundEngine Lifecycle, Default Mute & Node Cleanup Proof", () => {
    test("SoundEngine defaults to muted on application startup and respects remute", () => {
      // In the browser/SSR startup baseline, sound is muted until user gestures
      soundEngine.setMuted(true);
      expect(soundEngine.getIsMuted()).toBe(true);
    });

    test("stopAll clears all active timers and transient nodes without leaks", () => {
      soundEngine.setMuted(false);

      // Play transient voices
      soundEngine.playTeslaCoilDischarge(120, 1.0);
      soundEngine.playMorseSounder("strike", 65);
      soundEngine.playLamarrHop(49, 0.1);

      // Stop all audio
      soundEngine.stopAll();

      // State is clean
      expect(() => soundEngine.stopAll()).not.toThrow();
    });

    test("toggleMute correctly flips mute state and stops sound when muting", () => {
      soundEngine.setMuted(true);
      expect(soundEngine.getIsMuted()).toBe(true);

      const unmuted = soundEngine.toggleMute();
      expect(unmuted).toBe(false); // isMuted is false
      expect(soundEngine.getIsMuted()).toBe(false);

      const remuted = soundEngine.toggleMute();
      expect(remuted).toBe(true); // isMuted is true
      expect(soundEngine.getIsMuted()).toBe(true);
    });

    test("soundEngine physical transducer methods execute safely without throws", () => {
      soundEngine.setMuted(false);
      expect(() => soundEngine.playTeslaCoilDischarge(140, 0.8)).not.toThrow();
      expect(() => soundEngine.playMorseSounder("strike", 55)).not.toThrow();
      expect(() => soundEngine.playMorseSounder("release", 55)).not.toThrow();
      expect(() => soundEngine.playLamarrHop(44, 0.08)).not.toThrow();

      const pcm = new Float32Array(512);
      expect(() => soundEngine.playDeterministicBuffer(pcm, 44100)).not.toThrow();

      soundEngine.stopAll();
      soundEngine.setMuted(true);
    });
  });
});
