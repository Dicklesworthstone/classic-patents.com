/**
 * soundEngine.ts
 *
 * Procedural Web Audio API sound synthesizer for interactive patent physics.
 * Generates continuous tones, electromagnetic AC hums, and procedural popcorn pops
 * with zero external audio assets or network requests.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private isMuted: boolean = false;
  private activeTimers: Set<number> = new Set();
  private transientNodes: Set<AudioNode> = new Set();

  constructor() {
    if (typeof window !== "undefined") {
      window.addEventListener("pagehide", () => this.stopAll());
      window.addEventListener("beforeunload", () => this.stopAll());
      window.addEventListener("popstate", () => this.stopAll());
    }
  }

  private initContext() {
    if (typeof window === "undefined") return;
    if (!this.ctx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    return this.setMuted(!this.isMuted);
  }

  public setMuted(muted: boolean): boolean {
    this.isMuted = muted;
    if (this.isMuted) {
      this.stopAll();
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Stop ALL audio immediately and clean up all active oscillators and gain nodes.
   * Called during page transitions, route changes, or component unmounting.
   */
  public stopAll() {
    // Clear any scheduled audio release timers
    for (const timer of this.activeTimers) {
      window.clearTimeout(timer);
    }
    this.activeTimers.clear();

    // Disconnect and stop continuous oscillator
    if (this.oscillator) {
      try {
        this.oscillator.stop();
      } catch {
        // May already be stopped
      }
      try {
        this.oscillator.disconnect();
      } catch {
        // Ignored
      }
      this.oscillator = null;
    }

    if (this.gainNode) {
      try {
        this.gainNode.disconnect();
      } catch {
        // Ignored
      }
      this.gainNode = null;
    }

    // Clean up any transient nodes
    for (const node of this.transientNodes) {
      try {
        if ("stop" in node && typeof (node as { stop?: () => void }).stop === "function") {
          (node as { stop: () => void }).stop();
        }
        node.disconnect();
      } catch {
        // Ignored
      }
    }
    this.transientNodes.clear();
  }

  /**
   * Continuous sine/triangle wave synthesizer (for Bell Telephone simulation)
   */
  public playContinuousTone(
    frequency: number,
    waveType: OscillatorType = "sine",
    gainVolume = 0.08,
  ) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    if (!this.oscillator) {
      this.oscillator = this.ctx.createOscillator();
      this.gainNode = this.ctx.createGain();

      this.oscillator.type = waveType;
      this.oscillator.frequency.setValueAtTime(frequency, this.ctx.currentTime);

      this.gainNode.gain.setValueAtTime(gainVolume, this.ctx.currentTime);

      this.oscillator.connect(this.gainNode);
      this.gainNode.connect(this.ctx.destination);

      this.oscillator.start();
    } else {
      this.oscillator.frequency.setTargetAtTime(frequency, this.ctx.currentTime, 0.05);
      this.oscillator.type = waveType;
      if (this.gainNode) {
        this.gainNode.gain.setTargetAtTime(gainVolume, this.ctx.currentTime, 0.05);
      }
    }
  }

  public stopContinuousTone() {
    this.stopAll();
  }

  /**
   * Tesla AC Induction Motor dual-phase harmonic hum
   */
  public playTeslaMotorHum(frequency: number, rotorSpeedRpm: number) {
    if (this.isMuted) return;
    const baseFreq = Math.max(30, frequency);
    this.playContinuousTone(baseFreq, "triangle", 0.04 + (rotorSpeedRpm / 1800) * 0.03);
  }

  /**
   * Live field transducer. Frequency and gain come from the latest kernel
   * sample, not a canned one-shot. Default mute is enforced by isMuted.
   */
  public playFieldTransducer(opts: {
    kind: "am" | "photocurrent" | "rf";
    sample: number;
    carrierHz: number;
  }) {
    if (this.isMuted) return;
    const sample = Math.max(0, Math.min(1, Math.abs(opts.sample)));
    if (opts.kind === "am") {
      const audio = Math.max(80, opts.carrierHz);
      this.playContinuousTone(audio * (0.85 + 0.3 * sample), "sine", 0.02 + 0.06 * sample);
      return;
    }
    if (opts.kind === "photocurrent") {
      this.playContinuousTone(Math.max(120, opts.carrierHz), "sine", 0.015 + 0.07 * sample);
      return;
    }
    this.playContinuousTone(Math.max(60, Math.min(240, opts.carrierHz)), "sawtooth", 0.02 * sample);
  }

  /**
   * Procedural Popcorn Pop (short burst of bandpass filtered noise) for Spencer Microwave
   */
  public playPopcornPop() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const bufferSize = this.ctx.sampleRate * 0.05; // 50ms burst
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 800 + Math.random() * 600;
    filter.Q.value = 3;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.onended = () => {
      noise.disconnect();
      filter.disconnect();
      gain.disconnect();
    };
    noise.start();
    noise.stop(this.ctx.currentTime + 0.08);
  }

  /**
   * Helper to construct and track transient Web Audio voices with automatic node graph cleanup.
   */
  private playTransientVoice(
    setup: (osc: OscillatorNode, gain: GainNode, ctx: AudioContext) => number,
  ) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const duration = setup(osc, gain, this.ctx);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    this.transientNodes.add(osc);
    this.transientNodes.add(gain);

    const cleanup = () => {
      try {
        osc.disconnect();
        gain.disconnect();
      } catch {
        // Ignored
      }
      this.transientNodes.delete(osc);
      this.transientNodes.delete(gain);
    };

    osc.onended = cleanup;
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  /**
   * Morse telegraph key click sound
   */
  public playMorseClick() {
    this.playTransientVoice((osc, gain, ctx) => {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.015);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.015);
      return 0.02;
    });
  }

  /**
   * Filament click / contact switch sound
   */
  public playSwitchClick() {
    this.playTransientVoice((osc, gain, ctx) => {
      osc.type = "sine";
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.02);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02);
      return 0.03;
    });
  }

  /**
   * Authentic mechanical microswitch click (Engelbart Mouse)
   */
  public playMicroswitchClick() {
    this.playTransientVoice((osc, gain, ctx) => {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(1800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(450, ctx.currentTime + 0.012);

      gain.gain.setValueAtTime(0.22, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.012);
      return 0.015;
    });
  }

  /**
   * Mechanical shuttle & needle lockstitch clack (Howe Sewing Machine)
   */
  public playLockstitchClack() {
    this.playTransientVoice((osc, gain, ctx) => {
      osc.type = "square";
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.025);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.025);
      return 0.03;
    });
  }

  /**
   * Spread-spectrum carrier frequency hop chime (Lamarr Piano Roll)
   */
  public playPianoKeyHop(frequencyHz: number) {
    this.playTransientVoice((osc, gain, ctx) => {
      osc.type = "sine";
      osc.frequency.setValueAtTime(Math.max(100, Math.min(2000, frequencyHz)), ctx.currentTime);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      return 0.07;
    });
  }

  /**
   * Elastic polymer snap / relaxation sound (Goodyear Rubber)
   */
  public playElastomerSnap(stretchFactor = 1.0) {
    this.playTransientVoice((osc, gain, ctx) => {
      const pitch = 200 + stretchFactor * 180;
      osc.type = "sine";
      osc.frequency.setValueAtTime(pitch, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      return 0.05;
    });
  }

  /**
   * Heavy mechanical impact / ratchet arrest thud (Otis Elevator Safety Catch)
   */
  public playImpactThud(intensity = 1.0) {
    this.playTransientVoice((osc, gain, ctx) => {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(140 * intensity, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.3 * intensity, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      return 0.1;
    });
  }

  /**
   * High-voltage spark gap discharge click / pop (Tesla Teleautomaton / Marconi Radio / Tesla Coil)
   */
  public playSparkDischarge(intensity = 1.0) {
    this.playTransientVoice((osc, gain, ctx) => {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(2400 * intensity, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.02);

      gain.gain.setValueAtTime(0.25 * intensity, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02);
      return 0.025;
    });
  }

  /**
   * General-purpose parameterized tone synthesizer
   */
  public playTone(
    frequencyHz = 440,
    durationSec = 0.1,
    type: OscillatorType = "sine",
    gainLevel = 0.1,
  ) {
    this.playTransientVoice((osc, gain, ctx) => {
      osc.type = type;
      osc.frequency.setValueAtTime(Math.max(20, Math.min(8000, frequencyHz)), ctx.currentTime);

      gain.gain.setValueAtTime(gainLevel, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationSec);
      return durationSec + 0.02;
    });
  }

  /**
   * Camera shutter click (Eastman Kodak)
   */
  public playCameraClick() {
    if (this.isMuted) return;
    this.playMicroswitchClick();
  }

  /**
   * Steam engine pneumatic puff / exhaust stroke (Corliss Engine)
   */
  public playPneumaticPuff() {
    this.playTransientVoice((osc, gain, ctx) => {
      osc.type = "sine";
      osc.frequency.setValueAtTime(160, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      return 0.08;
    });
  }

  /**
   * Rapid ballistic report / percussion cap discharge (Gatling Gun / Colt Revolver)
   */
  public playGunshot() {
    this.playTransientVoice((osc, gain, ctx) => {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(450, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.28, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      return 0.07;
    });
  }

  /**
   * Alias for rapid firing spark / ignition sound
   */
  public playSparks() {
    this.playGunshot();
  }

  /**
   * Bell Undulating Electrical Speech Current Synthesizer (US 174,465)
   * Synthesizes human vocal formant harmonics driven by microphonic variable carbon resistance.
   */
  public playBellSpeechCurrent(amplitude = 0.15, fundamentalHz = 220) {
    if (this.isMuted) return;
    this.playTransientVoice((osc, gain, ctx) => {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(fundamentalHz, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(fundamentalHz * 1.08, ctx.currentTime + 0.05);
      osc.frequency.linearRampToValueAtTime(fundamentalHz * 0.96, ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(amplitude * 0.1, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(amplitude * 0.8, ctx.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);
      return 0.16;
    });
  }

  /**
   * Marconi Damped Spark Wave Train (US 586,193) & Tesla High-Potential Spark
   * Generates exponentially decaying high-frequency RF spark burst.
   */
  public playMarconiSparkTrain(rfFreqHz = 850, dampingRate = 28) {
    if (this.isMuted) return;
    const decaySec = Math.max(0.02, Math.min(0.2, 1 / Math.max(1, dampingRate)));
    this.playTransientVoice((osc, gain, ctx) => {
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(rfFreqHz, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(rfFreqHz * 0.6, ctx.currentTime + decaySec);

      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + decaySec);
      return decaySec + 0.02;
    });
  }

  /**
   * Enrico Fermi Chicago Pile-1 Stochastic Geiger Radiation Click Train (US 2,708,656)
   * Plays a sharp ionization discharge click whose probability scales with neutron flux.
   */
  public playFermiRadiationClicks(fluxScale = 1.0) {
    if (this.isMuted) return;
    this.playTransientVoice((osc, gain, ctx) => {
      osc.type = "square";
      const clickPitch = 1200 + ((Math.sin(ctx.currentTime * 1000) * 400 + 400) % 600);
      osc.frequency.setValueAtTime(clickPitch, ctx.currentTime);

      const vol = Math.min(0.2, 0.05 + fluxScale * 0.05);
      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.008);
      return 0.015;
    });
  }

  /**
   * Wright Flyer Twin Contra-Rotating Propeller Harmonic (US 821,393)
   * Blade passage frequency tone modulated by engine RPM and airspeed Doppler.
   */
  public playWrightPropellerPass(engineRpm = 1020, airspeedKts = 28) {
    if (this.isMuted) return;
    const gearRatio = 12 / 33; // Sprocket reduction
    const propRpm = engineRpm * gearRatio;
    const bpfHz = (propRpm * 2) / 60; // 2-bladed propeller BPF (~ 12.3 Hz fundamental)
    const dopplerShift = 1 + (airspeedKts / 60) * 0.08;

    this.playTone(bpfHz * 4 * dopplerShift, 0.08, "triangle", 0.06);
  }
}

export const soundEngine = new SoundEngine();
