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
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopContinuousTone();
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
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
    const oscillator = this.oscillator;
    const gainNode = this.gainNode;
    const ctx = this.ctx;

    if (!oscillator || !ctx) return;

    // Clear shared state before scheduling the release. A control change can start a
    // replacement oscillator before this short fade completes; the timeout must only
    // ever stop the oscillator it was created to retire.
    this.oscillator = null;
    this.gainNode = null;

    try {
      gainNode?.gain.setTargetAtTime(0, ctx.currentTime, 0.05);
      window.setTimeout(() => {
        try {
          oscillator.stop();
        } catch {
          // The oscillator may already have been stopped while the context was closing.
        }
        oscillator.disconnect();
        gainNode?.disconnect();
      }, 100);
    } catch {
      oscillator.disconnect();
      gainNode?.disconnect();
    }
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
   * Morse telegraph key click sound
   */
  public playMorseClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.015);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.015);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.02);
  }

  /**
   * Filament click / contact switch sound
   */
  public playSwitchClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, this.ctx.currentTime + 0.02);

    gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.02);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.03);
  }

  /**
   * Authentic mechanical microswitch click (Engelbart Mouse)
   */
  public playMicroswitchClick() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(1800, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(450, this.ctx.currentTime + 0.012);

    gain.gain.setValueAtTime(0.22, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.012);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.015);
  }

  /**
   * Mechanical shuttle & needle lockstitch clack (Howe Sewing Machine)
   */
  public playLockstitchClack() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(320, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.025);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.025);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.03);
  }

  /**
   * Spread-spectrum carrier frequency hop chime (Lamarr Piano Roll)
   */
  public playPianoKeyHop(frequencyHz: number) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(Math.max(100, Math.min(2000, frequencyHz)), this.ctx.currentTime);

    gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.07);
  }

  /**
   * Elastic polymer snap / relaxation sound (Goodyear Rubber)
   */
  public playElastomerSnap(stretchFactor = 1.0) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const pitch = 200 + stretchFactor * 180;
    osc.type = "sine";
    osc.frequency.setValueAtTime(pitch, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }
}

export const soundEngine = new SoundEngine();
