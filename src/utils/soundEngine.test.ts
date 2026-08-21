import { describe, expect, test } from "bun:test";
import { soundEngine } from "./soundEngine";

describe("Procedural Sound Synthesizer Engine (soundEngine.ts)", () => {
  test("manages mute state and idempotently toggles mute", () => {
    soundEngine.setMuted(true);
    expect(soundEngine.getIsMuted()).toBe(true);

    const toggled = soundEngine.toggleMute();
    expect(toggled).toBe(false);
    expect(soundEngine.getIsMuted()).toBe(false);

    soundEngine.setMuted(false);
    expect(soundEngine.getIsMuted()).toBe(false);
  });

  test("executes stopAll cleanly without errors when no audio is playing", () => {
    expect(() => soundEngine.stopAll()).not.toThrow();
  });

  test("executes continuous tones and stops cleanly", () => {
    expect(() => soundEngine.playContinuousTone(440, "sine", 0.05)).not.toThrow();
    expect(() => soundEngine.playTeslaGeneratorTone(60, 3600)).not.toThrow();
    expect(() =>
      soundEngine.playFieldTransducer({ kind: "am", sample: 0.4, carrierHz: 1000 }),
    ).not.toThrow();
    expect(() =>
      soundEngine.playFieldTransducer({ kind: "photocurrent", sample: 0.2, carrierHz: 800 }),
    ).not.toThrow();
    expect(() =>
      soundEngine.playFieldTransducer({ kind: "rf", sample: 0.5, carrierHz: 90 }),
    ).not.toThrow();
    expect(() => soundEngine.stopContinuousTone()).not.toThrow();
  });

  test("executes all transient audio cues safely in muted and active modes", () => {
    // When muted
    soundEngine.setMuted(true);
    expect(() => soundEngine.playMorseClick()).not.toThrow();
    expect(() => soundEngine.playSwitchClick()).not.toThrow();
    expect(() => soundEngine.playMicroswitchClick()).not.toThrow();
    expect(() => soundEngine.playLockstitchClack()).not.toThrow();
    expect(() => soundEngine.playPianoKeyHop(523.25)).not.toThrow();
    expect(() => soundEngine.playElastomerSnap(1.5)).not.toThrow();
    expect(() => soundEngine.playImpactThud(1.2)).not.toThrow();
    expect(() => soundEngine.playSparkDischarge(1.0)).not.toThrow();
    expect(() => soundEngine.playTone(880, 0.05, "triangle", 0.1)).not.toThrow();
    expect(() => soundEngine.playCameraClick()).not.toThrow();
    expect(() => soundEngine.playPneumaticPuff()).not.toThrow();
    expect(() => soundEngine.playGunshot()).not.toThrow();
    expect(() => soundEngine.playSparks()).not.toThrow();
    expect(() => soundEngine.playPopcornPop()).not.toThrow();

    // When unmuted
    soundEngine.setMuted(false);
    expect(() => soundEngine.playMorseClick()).not.toThrow();
    expect(() => soundEngine.playSwitchClick()).not.toThrow();
    expect(() => soundEngine.playMicroswitchClick()).not.toThrow();
    expect(() => soundEngine.playLockstitchClack()).not.toThrow();
    expect(() => soundEngine.playPianoKeyHop(523.25)).not.toThrow();
    expect(() => soundEngine.playElastomerSnap(1.5)).not.toThrow();
    expect(() => soundEngine.playImpactThud(1.2)).not.toThrow();
    expect(() => soundEngine.playSparkDischarge(1.0)).not.toThrow();
    expect(() => soundEngine.playTone(880, 0.05, "triangle", 0.1)).not.toThrow();
    expect(() => soundEngine.playCameraClick()).not.toThrow();
    expect(() => soundEngine.playPneumaticPuff()).not.toThrow();
    expect(() => soundEngine.playGunshot()).not.toThrow();
    expect(() => soundEngine.playSparks()).not.toThrow();
    expect(() => soundEngine.playPopcornPop()).not.toThrow();

    soundEngine.stopAll();
  });
});
