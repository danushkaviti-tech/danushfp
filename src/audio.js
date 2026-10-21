// ==========================================================================
// IMMERSIVE CYBER WORLD AUDIO SYNTHESIZER (Web Audio API)
// Atmospheric Living Ambient Soundscape + Sci-Fi Procedural SFX
// Zero external audio files, pure real-time mathematical synthesis
// ==========================================================================

class CyberAudioManager {
  constructor() {
    this.ctx = null;
    this.enabled = true; // Audio enabled on by default
    this.ambientRunning = false;
    this.ambientMasterGain = null;
    this.ambientOscillators = [];
    this.stardustTimer = null;
    this.hasUserInteracted = false;
  }

  init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    } catch (e) {
      console.warn('Web Audio API not supported', e);
    }
  }

  ensureContext() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => { });
    }
  }

  toggle() {
    this.ensureContext();
    this.enabled = !this.enabled;
    this.hasUserInteracted = true;

    if (this.enabled) {
      this.startAmbientSoundscape();
      this.playSuccess();
    } else {
      this.stopAmbientSoundscape();
    }
    return this.enabled;
  }

  // ------------------------------------------------------------------------
  // AI WELCOME VOICE SYNTHESIS ("Welcome to the Dhanush Portfolio")
  // ------------------------------------------------------------------------
  playWelcomeVoice() {
    this.ensureContext();
    this.playSuccess();
    this.playAIVocalChime();

    if ('speechSynthesis' in window) {
      try {
        // Clear any lingering or paused speech queues
        window.speechSynthesis.cancel();
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }

        const utterance = new SpeechSynthesisUtterance("Welcome to the Dhanush Portfolio");
        utterance.rate = 0.95;
        utterance.pitch = 1.05;
        utterance.volume = 1.0;
        utterance.lang = 'en-US';

        const assignPreferredVoice = () => {
          try {
            const voices = window.speechSynthesis.getVoices() || [];
            if (voices.length > 0) {
              const preferred = voices.find(v =>
                v.lang && v.lang.startsWith('en') &&
                (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Zira') || v.name.includes('Jenny') || v.name.includes('David') || v.name.includes('English'))
              ) || voices.find(v => v.lang && v.lang.startsWith('en'));

              if (preferred) utterance.voice = preferred;
            }
          } catch (e) { }
        };

        assignPreferredVoice();

        // Crucial bugfix for Chromium/Windows: Anchor utterance to window to prevent GC collection mid-speech
        window.__portfolioAIUtterance = utterance;

        utterance.onstart = () => {
          console.log('[AI Voice Engine] Speaking: "Welcome to the Dhanush Portfolio"');
        };
        utterance.onend = () => {
          window.__portfolioAIUtterance = null;
        };
        utterance.onerror = (e) => {
          console.warn('[AI Voice Engine] Utterance event error:', e);
          window.__portfolioAIUtterance = null;
        };

        // CRITICAL: Call speak immediately. Do NOT block waiting for onvoiceschanged!
        window.speechSynthesis.speak(utterance);

        // Resume call immediately after speak in case browser suspended speech engine
        setTimeout(() => {
          if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
          }
        }, 50);

        // Fallback listener in case voices were still loading asynchronously
        if (!window.speechSynthesis.getVoices() || window.speechSynthesis.getVoices().length === 0) {
          window.speechSynthesis.onvoiceschanged = () => {
            window.speechSynthesis.onvoiceschanged = null;
            if (!window.speechSynthesis.speaking) {
              assignPreferredVoice();
              window.speechSynthesis.speak(utterance);
            }
          };
        }
      } catch (err) {
        console.warn('Speech synthesis error:', err);
      }
    }
  }

  // Futuristic AI Melodic Boot Motif (Harmonic chime bed)
  playAIVocalChime() {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const notes = [587.33, 739.99, 880.00, 1174.66]; // D5, F#5, A5, D6
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = now + idx * 0.08;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.045, start);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 0.35);
      });
    } catch (e) { }
  }

  // ------------------------------------------------------------------------
  // LIVING SCI-FI AMBIENT SOUNDSCAPE (Procedural Drone + Shimmer)
  // ------------------------------------------------------------------------
  startAmbientSoundscape() {
    if (!this.ctx || this.ambientRunning) return;
    this.ensureContext();

    try {
      this.ambientRunning = true;
      const now = this.ctx.currentTime;

      // Master ambient gain with smooth fade in
      this.ambientMasterGain = this.ctx.createGain();
      this.ambientMasterGain.gain.setValueAtTime(0.0001, now);
      this.ambientMasterGain.gain.exponentialRampToValueAtTime(0.05, now + 2.5);
      this.ambientMasterGain.connect(this.ctx.destination);

      // Organic low-pass filter with slow breathing LFO
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, now);
      filter.Q.setValueAtTime(3.5, now);
      filter.connect(this.ambientMasterGain);

      // LFO for filter breath (0.12 Hz rate)
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.setValueAtTime(0.12, now);
      lfoGain.gain.setValueAtTime(140, now); // Sweeps filter between 180Hz and 460Hz
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start(now);
      this.ambientOscillators.push(lfo);

      // Drone Layers (Ethereal Cosmic Chord: Sub-bass 55Hz, Pad 110Hz, 5th 164.8Hz, 9th 246.9Hz)
      const droneFreqs = [55, 110, 164.81, 246.94];
      droneFreqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();

        osc.type = idx === 0 ? 'sine' : 'triangle';
        // Slight detune for rich celestial chorus
        osc.frequency.setValueAtTime(freq + (idx * 0.35 - 0.5), now);

        const layerVol = idx === 0 ? 0.08 : 0.035 / (idx + 1);
        oscGain.gain.setValueAtTime(layerVol, now);

        osc.connect(oscGain);
        oscGain.connect(filter);

        osc.start(now);
        this.ambientOscillators.push(osc);
      });

      // Periodic Stardust Chime Generator (cosmic particles passing by)
      this.scheduleStardustChimes();

    } catch (e) {
      console.warn('Failed to start ambient soundscape', e);
    }
  }

  scheduleStardustChimes() {
    if (!this.ambientRunning) return;
    const nextInterval = 3500 + Math.random() * 4500;
    this.stardustTimer = setTimeout(() => {
      if (this.ambientRunning && this.enabled) {
        this.playStardustChime();
        this.scheduleStardustChimes();
      }
    }, nextInterval);
  }

  playStardustChime() {
    if (!this.ctx || !this.enabled) return;
    try {
      const celestialPitches = [880, 1108.73, 1318.51, 1661.22, 1975.53, 2217.46];
      const freq = celestialPitches[Math.floor(Math.random() * celestialPitches.length)];
      const now = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.012, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

      osc.connect(gain);
      gain.connect(this.ambientMasterGain || this.ctx.destination);

      osc.start(now);
      osc.stop(now + 2.2);
    } catch (e) { }
  }

  stopAmbientSoundscape() {
    if (!this.ambientRunning) return;
    if (this.stardustTimer) clearTimeout(this.stardustTimer);
    this.ambientRunning = false;

    if (this.ambientMasterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.ambientMasterGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
      setTimeout(() => {
        this.ambientOscillators.forEach(osc => {
          try { osc.stop(); osc.disconnect(); } catch (e) { }
        });
        this.ambientOscillators = [];
      }, 1250);
    }
  }

  // ------------------------------------------------------------------------
  // PROCEDURAL INTERACTIVE SOUND FX
  // ------------------------------------------------------------------------
  playHover() {
    if (!this.enabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(920, now);
      osc.frequency.exponentialRampToValueAtTime(1440, now + 0.05);

      gain.gain.setValueAtTime(0.015, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch (e) { }
  }

  playClick() {
    if (!this.enabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(460, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.07);

      gain.gain.setValueAtTime(0.035, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.07);
    } catch (e) { }
  }

  playPhotonFlash() {
    if (!this.enabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const sub = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const subGain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(2600, now);
      osc.frequency.exponentialRampToValueAtTime(160, now + 0.35);

      sub.type = 'sine';
      sub.frequency.setValueAtTime(110, now);
      sub.frequency.exponentialRampToValueAtTime(40, now + 0.45);

      gain.gain.setValueAtTime(0.045, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      subGain.gain.setValueAtTime(0.05, now);
      subGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

      osc.connect(gain);
      sub.connect(subGain);
      gain.connect(this.ctx.destination);
      subGain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
      sub.start(now);
      sub.stop(now + 0.45);
    } catch (e) { }
  }

  playTyping() {
    if (!this.enabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      const keyPitch = 600 + Math.random() * 300;
      osc.frequency.setValueAtTime(keyPitch, now);
      osc.frequency.exponentialRampToValueAtTime(keyPitch * 0.5, now + 0.03);

      gain.gain.setValueAtTime(0.02, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.03);
    } catch (e) { }
  }

  playScan() {
    if (!this.enabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(1800, now + 0.35);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(900, now);
      filter.Q.setValueAtTime(4, now);

      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) { }
  }

  playPulse() {
    if (!this.enabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.2);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch (e) { }
  }

  playTabSwitch() {
    if (!this.enabled || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(540, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);

      gain.gain.setValueAtTime(0.025, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) { }
  }

  playSuccess() {
    if (!this.ctx) return;
    try {
      const chord = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
      const now = this.ctx.currentTime;

      chord.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = now + idx * 0.05;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.03, start);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + 0.45);
      });
    } catch (e) { }
  }
}

export const audio = new CyberAudioManager();
