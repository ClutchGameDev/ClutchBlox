// Web Audio API instant sound synthesizer for ClutchBlox audio preview
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export function playAudioPreview(sound: "default" | "classic_oof" | "hitmarker" | "minecraft") {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    if (sound === "classic_oof") {
      // Iconic Classic Roblox "OOF" sound: downward pitch sweep with formant resonance
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(360, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.38);

      // Formant filtering to give it the classic vocal "oof" timbre
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(750, now);
      filter.frequency.exponentialRampToValueAtTime(350, now + 0.38);
      filter.Q.setValueAtTime(3.0, now);

      gain.gain.setValueAtTime(0.7, now);
      gain.gain.linearRampToValueAtTime(0.8, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.38);
    } else if (sound === "hitmarker") {
      // High-frequency crisp metallic hitmarker tick
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(2200, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.04);

      gain.gain.setValueAtTime(0.8, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);

      // Second micro-click for the double-tap feel
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(2400, now + 0.025);
      osc2.frequency.exponentialRampToValueAtTime(1000, now + 0.065);
      gain2.gain.setValueAtTime(0.0, now);
      gain2.gain.setValueAtTime(0.6, now + 0.025);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.065);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.025);
      osc2.stop(now + 0.065);
    } else if (sound === "minecraft") {
      // Classic Minecraft hurt sound (punch impact)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(65, now + 0.18);

      gain.gain.setValueAtTime(0.9, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.18);
    } else {
      // Default soft puff sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.12);

      gain.gain.setValueAtTime(0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    }
  } catch (err) {
    console.warn("Could not play audio preview:", err);
  }
}
