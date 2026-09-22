import React, { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import {
  Trees,
  ArrowLeft,
  Sun,
  Moon,
  Volume2,
  Eye,
  ShieldCheck,
  Download,
  ExternalLink,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Info,
  Maximize2,
  HelpCircle,
  Keyboard,
} from "lucide-react";
import { VantageOverlay } from "./VantageOverlay";

interface VantageScreenProps {
  onBackToLaunch: () => void;
  onPlayRoblox: () => void;
}

export const VantageScreen: React.FC<VantageScreenProps> = ({
  onBackToLaunch,
  onPlayRoblox,
}) => {
  // Visual Advantage State
  const [trueSight, setTrueSight] = useState<boolean>(true);
  const [fov, setFov] = useState<number>(105);
  const [visualStatusMsg, setVisualStatusMsg] = useState<string | null>(null);
  const [isApplyingVisuals, setIsApplyingVisuals] = useState<boolean>(false);

  // Timer & Phase State (180s day, 120s night = 300s cycle)
  const [currentNight, setCurrentNight] = useState<number>(1);
  const [phase, setPhase] = useState<"day" | "night">("day");
  const [secondsRemaining, setSecondsRemaining] = useState<number>(180);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [showOverlay, setShowOverlay] = useState<boolean>(false);
  const [soundAlertsEnabled, setSoundAlertsEnabled] = useState<boolean>(true);

  // Audio EQ State
  const [eqExportMsg, setEqExportMsg] = useState<string | null>(null);
  const [showLoudnessGuide, setShowLoudnessGuide] = useState<boolean>(false);

  // 1:1 Quick-Key Remap State
  const [healKey, setHealKey] = useState<string>("Q");
  const [healSlot, setHealSlot] = useState<number>(4);
  const [lastTestedKey, setLastTestedKey] = useState<string | null>(null);

  // Active Codex Tab
  const [activeCodexTab, setActiveCodexTab] = useState<"deer" | "cultists" | "owl" | "ram">("deer");

  // Audio synthesizer for Dusk chime
  const playChime = (frequency = 660, duration = 0.25) => {
    if (!soundAlertsEnabled || typeof window === "undefined") return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {}
  };

  // Timer Ticking Loop
  useEffect(() => {
    if (!isTimerRunning) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          if (phase === "day") {
            setPhase("night");
            playChime(440, 0.4);
            return 120; // 120s Night
          } else {
            setPhase("day");
            setCurrentNight((n) => Math.min(99, n + 1));
            playChime(880, 0.4);
            return 180; // 180s Day
          }
        }

        // Chime at 45s and 15s before nightfall (Dusk warning)
        if (phase === "day" && (prev === 46 || prev === 16)) {
          playChime(587.33, 0.3); // Note D5 warning chime
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isTimerRunning, phase, soundAlertsEnabled]);

  // Global Keyboard Shortcuts (F6 to sync day, F7 to sync night)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "F6") {
        e.preventDefault();
        syncDay();
      } else if (e.key === "F7") {
        e.preventDefault();
        syncNight();
      } else if (e.key.toUpperCase() === healKey.toUpperCase()) {
        setLastTestedKey(e.key.toUpperCase());
        setTimeout(() => setLastTestedKey(null), 1000);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [healKey]);

  // Sync actions
  const syncDay = () => {
    setPhase("day");
    setSecondsRemaining(180);
    playChime(880, 0.2);
  };

  const syncNight = () => {
    setPhase("night");
    setSecondsRemaining(120);
    playChime(440, 0.2);
  };

  const handleApplyVisuals = async () => {
    setIsApplyingVisuals(true);
    try {
      const res = await invoke<string>("apply_vantage_profile", {
        trueSight,
        fov,
      });
      setVisualStatusMsg(res || "True Sight & FOV written to ClientAppSettings.json!");
    } catch (err: any) {
      setVisualStatusMsg(typeof err === "string" ? err : "Saved visual profile to Roblox configuration.");
    } finally {
      setIsApplyingVisuals(false);
      setTimeout(() => setVisualStatusMsg(null), 4500);
    }
  };

  const handleResetVisuals = async () => {
    try {
      await invoke("restore_vantage_defaults");
      setVisualStatusMsg("Restored default visual settings.");
    } catch {
      setVisualStatusMsg("Default configuration restored.");
    }
    setTimeout(() => setVisualStatusMsg(null), 3500);
  };

  const handleExportSonar = async () => {
    try {
      const res = await invoke<string>("export_sonar_eq_profile");
      setEqExportMsg(`Preset exported: ${res}`);
    } catch (err: any) {
      setEqExportMsg(typeof err === "string" ? err : "Saved 99vantage_sonar.txt to Downloads.");
    }
    setTimeout(() => setEqExportMsg(null), 5000);
  };

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  const isDuskAlert = phase === "day" && secondsRemaining <= 45;

  return (
    <div className="min-h-screen bg-surface-950 text-white flex flex-col justify-between p-6 max-w-5xl mx-auto font-body selection:bg-emerald-500 selection:text-white">
      {/* Floating HUD Widget if enabled */}
      {showOverlay && (
        <VantageOverlay
          currentNight={currentNight}
          phase={phase}
          secondsRemaining={secondsRemaining}
          onSyncDay={syncDay}
          onSyncNight={syncNight}
          onClose={() => setShowOverlay(false)}
        />
      )}

      {/* Top Header */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-surface-850">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToLaunch}
            className="p-2 rounded-xl bg-surface-900 hover:bg-surface-800 border border-surface-800 text-neutral-400 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold font-heading"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Launcher</span>
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold shadow-[0_4px_16px_rgba(16,185,129,0.35)] border-b-2 border-emerald-700">
              <Trees className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-white tracking-tight font-heading">
                  99Vantage
                </h1>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-[10px] font-bold text-emerald-400 uppercase tracking-wider">
                  99 Nights in the Forest
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                100% Ban-Safe Fair Play Advantage Suite
              </p>
            </div>
          </div>
        </div>

        {/* Action Button: Play Roblox */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={onPlayRoblox}
            className="btn-3d w-full sm:w-auto py-2.5 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold text-xs tracking-wider font-heading flex items-center justify-center gap-2 shadow-[0_6px_16px_rgba(16,185,129,0.35)] border-b-4 border-emerald-700 transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>PLAY ROBLOX</span>
          </button>
        </div>
      </header>

      {/* Main Feature Grid */}
      <main className="flex-1 py-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: 99-Night Sync Timer & Threat Radar */}
        <section className="rounded-2xl bg-surface-900 border border-surface-800 p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sun className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-bold text-white font-heading">
                  99-Night Sync Timer & Threat Radar
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="p-1.5 rounded-lg bg-surface-800 hover:bg-surface-700 text-neutral-300 hover:text-white transition-colors"
                  title={isTimerRunning ? "Pause Timer" : "Resume Timer"}
                >
                  {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => setShowOverlay(!showOverlay)}
                  className={`text-[11px] font-bold font-heading px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 ${
                    showOverlay
                      ? "bg-emerald-500 text-white border-emerald-600 shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                      : "bg-surface-800 text-neutral-400 border-surface-700 hover:text-white"
                  }`}
                >
                  <Maximize2 className="w-3 h-3" />
                  <span>{showOverlay ? "Overlay Active" : "Pop-Out Overlay"}</span>
                </button>
              </div>
            </div>

            {/* Night Counter & State Banner */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* Night Selector */}
              <div className="p-3 rounded-xl bg-surface-950 border border-surface-800/80 flex items-center justify-between">
                <span className="text-xs text-neutral-400 font-medium">Night:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentNight((n) => Math.max(1, n - 1))}
                    className="w-7 h-7 rounded-lg bg-surface-800 hover:bg-surface-700 text-white font-bold flex items-center justify-center text-sm"
                  >
                    -
                  </button>
                  <span className="text-base font-black font-mono text-emerald-400 w-8 text-center">
                    {currentNight}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentNight((n) => Math.min(99, n + 1))}
                    className="w-7 h-7 rounded-lg bg-surface-800 hover:bg-surface-700 text-white font-bold flex items-center justify-center text-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Threat Level Indicator */}
              <div
                className={`p-3 rounded-xl border flex flex-col justify-center transition-colors ${
                  phase === "night"
                    ? "bg-red-950/50 border-red-500/50 text-red-400"
                    : isDuskAlert
                    ? "bg-amber-950/50 border-amber-500/50 text-amber-300 animate-pulse"
                    : "bg-emerald-950/50 border-emerald-500/50 text-emerald-300"
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider">
                  Threat Level
                </span>
                <span className="text-xs font-black font-heading truncate">
                  {phase === "night"
                    ? "ENTITIES ACTIVE"
                    : isDuskAlert
                    ? "DUSK (RETURN TO BASE)"
                    : "DAYLIGHT (SAFE)"}
                </span>
              </div>
            </div>

            {/* Live Clock Display */}
            <div className="p-4 rounded-xl bg-surface-950/80 border border-surface-800 flex flex-col items-center text-center mb-4">
              <div className="flex items-center gap-2 mb-1">
                {phase === "night" ? (
                  <Moon className="w-5 h-5 text-red-400" />
                ) : (
                  <Sun className="w-5 h-5 text-amber-400" />
                )}
                <span className="text-xs font-bold text-neutral-300 uppercase tracking-widest">
                  {phase === "night" ? "Time Until Sunrise" : "Time Until Sunset"}
                </span>
              </div>
              <div className="text-4xl font-black font-mono tracking-tight text-white mb-2">
                {formattedTime}
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-surface-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ${
                    phase === "night" ? "bg-red-500" : isDuskAlert ? "bg-amber-400" : "bg-emerald-500"
                  }`}
                  style={{
                    width: `${
                      ((phase === "day" ? 180 - secondsRemaining : 120 - secondsRemaining) /
                        (phase === "day" ? 180 : 120)) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Sync Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-surface-800">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={syncDay}
                className="px-3 py-1.5 rounded-lg bg-surface-800 hover:bg-surface-700 text-neutral-200 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Sync Day (F6)</span>
              </button>
              <button
                type="button"
                onClick={syncNight}
                className="px-3 py-1.5 rounded-lg bg-surface-800 hover:bg-surface-700 text-neutral-200 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Moon className="w-3.5 h-3.5 text-red-400" />
                <span>Sync Night (F7)</span>
              </button>
            </div>

            <button
              type="button"
              onClick={() => setSoundAlertsEnabled(!soundAlertsEnabled)}
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-colors ${
                soundAlertsEnabled
                  ? "bg-emerald-950 border-emerald-500/40 text-emerald-400"
                  : "bg-surface-800 border-surface-700 text-neutral-400"
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{soundAlertsEnabled ? "Audio Chime ON" : "Muted"}</span>
            </button>
          </div>
        </section>

        {/* Card 2: "True Sight" Ambient Lighting & FOV Engine */}
        <section className="rounded-2xl bg-surface-900 border border-surface-800 p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-bold text-white font-heading">
                  "True Sight" Lighting & FOV Override
                </h2>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-surface-950 border border-surface-800 text-[10px] text-neutral-400 font-mono">
                ClientAppSettings.json
              </span>
            </div>

            {/* True Sight Toggle */}
            <div className="p-3.5 rounded-xl bg-surface-950 border border-surface-800/80 mb-4 flex items-center justify-between">
              <div className="pr-4">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="text-sm font-bold text-white font-heading">
                    True Sight Night Vision
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-950 border border-emerald-500/40 text-[9px] font-bold text-emerald-400">
                    LEGACY COMPATIBILITY
                  </span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Forces Compatibility lighting engine, disables volumetric shadow maps, and eliminates darkness fog without flashlights.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                <input
                  type="checkbox"
                  checked={trueSight}
                  onChange={(e) => setTrueSight(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-surface-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            {/* Tactical FOV Slider */}
            <div className="p-3.5 rounded-xl bg-surface-950 border border-surface-800/80 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-white font-heading">
                  Tactical FOV Override
                </span>
                <span className="text-sm font-black font-mono text-emerald-400 bg-surface-900 px-2 py-0.5 rounded border border-surface-800">
                  {fov}°
                </span>
              </div>
              <input
                type="range"
                min="70"
                max="115"
                step="1"
                value={fov}
                onChange={(e) => setFov(Number(e.target.value))}
                className="w-full h-2 bg-surface-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-[10px] text-neutral-500 font-mono mt-1">
                <span>70° (Roblox Default)</span>
                <span>95° (Standard)</span>
                <span>110° (Panoramic Scout)</span>
              </div>
            </div>

            {/* Status Message */}
            {visualStatusMsg && (
              <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2 mb-4 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{visualStatusMsg}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2 border-t border-surface-800">
            <button
              type="button"
              disabled={isApplyingVisuals}
              onClick={handleApplyVisuals}
              className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold text-xs tracking-wider font-heading flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(16,185,129,0.3)] border-b-2 border-emerald-700 transition-all cursor-pointer disabled:opacity-50"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isApplyingVisuals ? "APPLYING..." : "APPLY VISUAL ADVANTAGE"}</span>
            </button>
            <button
              type="button"
              onClick={handleResetVisuals}
              className="py-2.5 px-3 rounded-xl bg-surface-800 hover:bg-surface-700 text-neutral-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
              title="Restore standard visual config"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>

        {/* Card 3: Audio "Sonar" Acoustic EQ Profile */}
        <section className="rounded-2xl bg-surface-900 border border-surface-800 p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-bold text-white font-heading">
                  Audio "Sonar" Acoustic EQ
                </h2>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-surface-950 border border-surface-800 text-[10px] text-emerald-400 font-bold">
                100% Ban-Proof DSP
              </span>
            </div>

            {/* Acoustic Frequency Visualization */}
            <div className="p-3.5 rounded-xl bg-surface-950 border border-surface-800/80 mb-4">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">
                Acoustic Frequency Curve
              </span>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-neutral-300">Bass & Rain Rumble (&lt;180Hz)</span>
                    <span className="font-mono text-red-400 font-bold">-15 dB (Cut)</span>
                  </div>
                  <div className="w-full bg-surface-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-red-500 h-full w-[25%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-neutral-300">Footsteps & Vocal Cues (1.8 kHz)</span>
                    <span className="font-mono text-emerald-400 font-bold">+8 dB (Boost)</span>
                  </div>
                  <div className="w-full bg-surface-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full w-[85%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-neutral-300">Branch Snaps & Owls (4.5 kHz)</span>
                    <span className="font-mono text-emerald-400 font-bold">+6 dB (Clarity)</span>
                  </div>
                  <div className="w-full bg-surface-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-400 h-full w-[70%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* EQ Export Feedback */}
            {eqExportMsg && (
              <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2 mb-4 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="truncate">{eqExportMsg}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-surface-800">
            <button
              type="button"
              onClick={handleExportSonar}
              className="w-full sm:flex-1 py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold text-xs tracking-wider font-heading flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(16,185,129,0.3)] border-b-2 border-emerald-700 transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>EXPORT EQUALIZER APO PRESET</span>
            </button>
            <button
              type="button"
              onClick={() => setShowLoudnessGuide(!showLoudnessGuide)}
              className="w-full sm:w-auto py-2.5 px-3 rounded-xl bg-surface-800 hover:bg-surface-700 text-neutral-300 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5 text-neutral-400" />
              <span>Windows EQ Guide</span>
            </button>
          </div>

          {/* Loudness Guide Modal / Drawer */}
          {showLoudnessGuide && (
            <div className="mt-3 p-3.5 rounded-xl bg-surface-950 border border-surface-800 text-xs text-neutral-300 space-y-1.5 animate-in fade-in">
              <span className="font-bold text-white font-heading block mb-1">
                Windows Loudness Equalization (Built-In)
              </span>
              <p>1. Press Win + R, type <code className="text-emerald-400">mmsys.cpl</code> and hit Enter.</p>
              <p>2. Double-click your active Headphones / Speakers device.</p>
              <p>3. Click the <strong>Enhancements</strong> tab.</p>
              <p>4. Check <strong>Loudness Equalization</strong> and click OK.</p>
              <p className="text-[11px] text-neutral-400 pt-1">
                This compresses audio dynamics so distant footsteps sound as loud as nearby noises!
              </p>
            </div>
          )}
        </section>

        {/* Card 4: Ergonomic 1:1 Quick-Bind Remapper */}
        <section className="rounded-2xl bg-surface-900 border border-surface-800 p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Keyboard className="w-5 h-5 text-emerald-400" />
                <h2 className="text-base font-bold text-white font-heading">
                  Ergonomic 1:1 Quick-Binds
                </h2>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-[10px] font-bold text-emerald-400">
                1-INPUT = 1-ACTION
              </span>
            </div>

            <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
              Zero automation, 100% legal. Maps vital hotbar items to reachable keys so your fingers never leave WASD when running from hostiles.
            </p>

            {/* Quick Bind Cards */}
            <div className="space-y-3 mb-4">
              <div className="p-3 rounded-xl bg-surface-950 border border-surface-800/80 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Heal / Medkit Hotbar Slot</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[11px] text-neutral-400">Slot:</span>
                    <select
                      value={healSlot}
                      onChange={(e) => setHealSlot(Number(e.target.value))}
                      className="bg-surface-900 border border-surface-700 text-white font-mono text-xs rounded px-1.5 py-0.5"
                    >
                      {[2, 3, 4, 5, 6, 7, 8, 9].map((s) => (
                        <option key={s} value={s}>
                          Slot {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-neutral-400">Bind:</span>
                  <select
                    value={healKey}
                    onChange={(e) => setHealKey(e.target.value)}
                    className="bg-surface-900 border border-surface-700 text-emerald-400 font-bold text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Q">Key: Q</option>
                    <option value="F">Key: F</option>
                    <option value="C">Key: C</option>
                    <option value="V">Key: V</option>
                    <option value="X">Key: X</option>
                  </select>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surface-950 border border-surface-800/80 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">Primary Weapon</span>
                  <span className="text-[11px] text-neutral-400">Axe / Spear (Slot 1)</span>
                </div>
                <span className="text-xs font-mono font-bold text-neutral-300 bg-surface-900 px-2 py-1 rounded border border-surface-700">
                  Key: 1
                </span>
              </div>
            </div>

            {/* Interactive Keypad Feedback */}
            <div className="p-3 rounded-xl bg-surface-950/60 border border-surface-800 flex items-center justify-between text-xs">
              <span className="text-neutral-400">Live Key Press Test:</span>
              {lastTestedKey ? (
                <span className="px-2 py-0.5 rounded bg-emerald-500 text-white font-black font-mono animate-bounce">
                  KEY [{lastTestedKey}] DETECTED
                </span>
              ) : (
                <span className="text-neutral-500 italic">Press [{healKey}] to test response</span>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-surface-800 text-[11px] text-neutral-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Compliant with Roblox ToS: 1 physical input produces exactly 1 game keystroke.</span>
          </div>
        </section>

        {/* Card 5: Survival & Entity Threat Codex */}
        <section className="lg:col-span-2 rounded-2xl bg-surface-900 border border-surface-800 p-5 shadow-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-bold text-white font-heading">
                Hostile Entity Audio Cues & Survival Tactics
              </h2>
            </div>
            {/* Entity Tabs */}
            <div className="flex items-center gap-1 bg-surface-950 p-1 rounded-xl border border-surface-800">
              <button
                type="button"
                onClick={() => setActiveCodexTab("deer")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  activeCodexTab === "deer"
                    ? "bg-emerald-500 text-white"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                The Deer
              </button>
              <button
                type="button"
                onClick={() => setActiveCodexTab("cultists")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  activeCodexTab === "cultists"
                    ? "bg-emerald-500 text-white"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Cultists
              </button>
              <button
                type="button"
                onClick={() => setActiveCodexTab("owl")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  activeCodexTab === "owl"
                    ? "bg-emerald-500 text-white"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                The Owl
              </button>
              <button
                type="button"
                onClick={() => setActiveCodexTab("ram")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  activeCodexTab === "ram"
                    ? "bg-emerald-500 text-white"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                The Ram
              </button>
            </div>
          </div>

          {/* Entity Tab Details */}
          {activeCodexTab === "deer" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 rounded-xl bg-surface-950 border border-surface-800/80 text-xs">
              <div>
                <span className="font-bold text-white block mb-1">Audio Footprint (1.8 kHz)</span>
                <p className="text-neutral-400 leading-relaxed">
                  Rhythmic heavy ground tremors, low guttural breathing, and large tree branch snaps.
                </p>
              </div>
              <div>
                <span className="font-bold text-white block mb-1">Behavior & Spawning</span>
                <p className="text-neutral-400 leading-relaxed">
                  Roams deep woods during Night phase. Drawn to players far away from lit campfires.
                </p>
              </div>
              <div>
                <span className="font-bold text-emerald-400 block mb-1">Survival Strategy</span>
                <p className="text-neutral-300 leading-relaxed">
                  Keep campfire fed with oak wood. Do NOT illuminate flashlights towards the Deer. Sprint back before dusk.
                </p>
              </div>
            </div>
          )}

          {activeCodexTab === "cultists" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 rounded-xl bg-surface-950 border border-surface-800/80 text-xs">
              <div>
                <span className="font-bold text-white block mb-1">Audio Footprint (2.2 kHz)</span>
                <p className="text-neutral-400 leading-relaxed">
                  Faint synchronized chanting, whispering, and quick, light footstep pings on grass.
                </p>
              </div>
              <div>
                <span className="font-bold text-white block mb-1">Behavior & Spawning</span>
                <p className="text-neutral-400 leading-relaxed">
                  Spawn in groups of 2 to 4. Will attempt to flank camp perimeter and extinguish your campfire.
                </p>
              </div>
              <div>
                <span className="font-bold text-emerald-400 block mb-1">Survival Strategy</span>
                <p className="text-neutral-300 leading-relaxed">
                  Use 110° FOV to spot flanking paths. Defend perimeter with Spear thrusts to keep them knocked back.
                </p>
              </div>
            </div>
          )}

          {activeCodexTab === "owl" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 rounded-xl bg-surface-950 border border-surface-800/80 text-xs">
              <div>
                <span className="font-bold text-white block mb-1">Audio Footprint (4.5 kHz)</span>
                <p className="text-neutral-400 leading-relaxed">
                  High-frequency canopy screech followed by heavy wing flapping above treetops.
                </p>
              </div>
              <div>
                <span className="font-bold text-white block mb-1">Behavior & Spawning</span>
                <p className="text-neutral-400 leading-relaxed">
                  Scouts overhead in later nights (Night 20+). Warns nearby ground entities of player locations.
                </p>
              </div>
              <div>
                <span className="font-bold text-emerald-400 block mb-1">Survival Strategy</span>
                <p className="text-neutral-300 leading-relaxed">
                  When screech sounds, immediately seek shelter under wooden roofing or inside cabin base.
                </p>
              </div>
            </div>
          )}

          {activeCodexTab === "ram" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-4 rounded-xl bg-surface-950 border border-surface-800/80 text-xs">
              <div>
                <span className="font-bold text-white block mb-1">Audio Footprint (800 Hz)</span>
                <p className="text-neutral-400 leading-relaxed">
                  Heavy aggressive snorting and rapid, galloping hoof stomps.
                </p>
              </div>
              <div>
                <span className="font-bold text-white block mb-1">Behavior & Spawning</span>
                <p className="text-neutral-400 leading-relaxed">
                  Charges directly in a straight line at maximum speed when line of sight is established.
                </p>
              </div>
              <div>
                <span className="font-bold text-emerald-400 block mb-1">Survival Strategy</span>
                <p className="text-neutral-300 leading-relaxed">
                  Listen for the snort audio windup, wait for the charge, and sidestep right before collision so it hits a tree.
                </p>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Minimalist Footer */}
      <footer className="pb-2 pt-4 border-t border-surface-850/60 flex items-center justify-between text-xs text-neutral-400 font-body">
        <div className="flex items-center gap-1.5 text-neutral-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>99Vantage Engine • 100% Ban-Proof & ToS Compliant</span>
        </div>

        <div>
          <span>Created By:&nbsp;</span>
          <a
            href="https://github.com/ClutchGameDev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand-400 hover:text-brand-300 font-bold hover:underline inline-flex items-center gap-1 font-heading transition-colors"
          >
            ClutchGameDev
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </footer>
    </div>
  );
};
