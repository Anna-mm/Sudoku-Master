/**
 * Sound Service for Sudoku Meadow
 * Generates subtle, thematic sounds using the Web Audio API.
 */

class SoundService {
  private audioCtx: AudioContext | null = null;
  private enabled: boolean = true;

  private init() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  private createOscillator(freq: number, type: OscillatorType = 'sine', duration: number = 0.1, volume: number = 0.1) {
    if (!this.enabled) return;
    this.init();
    if (!this.audioCtx) return;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

    gain.gain.setValueAtTime(volume, this.audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start();
    osc.stop(this.audioCtx.currentTime + duration);
  }

  playPlace() {
    // Soft pluck sound
    this.createOscillator(440, 'sine', 0.15, 0.05);
  }

  playClick() {
    // Very subtle click
    this.createOscillator(880, 'sine', 0.05, 0.02);
  }

  playMistake() {
    // Low, slightly dissonant sound
    this.createOscillator(150, 'triangle', 0.3, 0.1);
  }

  playHint() {
    // Upward chime
    this.createOscillator(523.25, 'sine', 0.2, 0.05);
    setTimeout(() => this.createOscillator(659.25, 'sine', 0.2, 0.05), 50);
  }

  playSuccess() {
    // Happy arpeggio
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((note, i) => {
      setTimeout(() => this.createOscillator(note, 'sine', 0.5, 0.05), i * 100);
    });
  }
}

export const soundService = new SoundService();
