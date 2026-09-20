import React from "react";
import { Crosshair, Zap, ShieldCheck, Play, Sliders, Smartphone, AlertTriangle, Download, Loader2, Check, Rocket } from "lucide-react";
import { AndroidOverlayConfig, ProGearSelection, LaunchStatus } from "../types";

interface AndroidOverlayControlsProps {
  config: AndroidOverlayConfig;
  onChange: (config: AndroidOverlayConfig) => void;
  selectedGear: ProGearSelection;
  onGearChange: (gear: ProGearSelection) => void;
  launchStatus: LaunchStatus;
  onStartAndLaunch: () => void;
  onLaunchWithoutOverlay: () => void;
  onRequestPermission: () => void;
}

const CROSSHAIR_CHOICES: {
  id: ProGearSelection["crosshair"];
  name: string;
  desc: string;
  color: string;
}[] = [
  {
    id: "green_dot",
    name: "Neon Green Dot",
    desc: "CS-style shooter pro dot with dark outline",
    color: "#00FF66",
  },
  {
    id: "cyan_cross",
    name: "Cyan Cross (+)",
    desc: "Precision tracking crosshair with center gap",
    color: "#00F0FF",
  },
  {
    id: "red_circle",
    name: "Red Circle (○)",
    desc: "High-contrast tracking ring for fast mobile flicking",
    color: "#FF3344",
  },
];

export const AndroidOverlayControls: React.FC<AndroidOverlayControlsProps> = ({
  config,
  onChange,
  selectedGear,
  onGearChange,
  launchStatus,
  onStartAndLaunch,
  onLaunchWithoutOverlay,
  onRequestPermission,
}) => {
  return (
    <div className="p-5 rounded-2xl bg-surface-900 border border-surface-800 shadow-[0_8px_30px_rgba(0,0,0,0.5)] font-body space-y-5">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-surface-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 border border-brand-500/30 flex items-center justify-center shadow-inner">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
                Android Pro Esports Suite
              </h2>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 font-heading">
                100% Ban-Proof
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">
              Hardware crosshair overlay & 120Hz touch boost over Roblox Mobile.
            </p>
          </div>
        </div>

        {/* Action Badges & APK Download */}
        <div className="flex items-center gap-2 flex-wrap">
          <a
            href="/clutchblox.apk"
            download="ClutchBlox.apk"
            className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 font-heading transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            Download APK
          </a>

          {config.hasPermission ? (
            <span className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 font-heading">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Overlay: Ready
            </span>
          ) : (
            <button
              type="button"
              onClick={onRequestPermission}
              className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 font-heading transition-colors cursor-pointer"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
              Grant Overlay Permission
            </button>
          )}
        </div>
      </div>

      {/* Section 1: Choose Your Hardware Aim Crosshair */}
      <div>
        <div className="mb-2.5 flex items-center justify-between">
          <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider font-heading flex items-center gap-1.5">
            <Crosshair className="w-3.5 h-3.5 text-brand-400" />
            1. Select Your Hardware Crosshair
          </span>
          <span className="text-[11px] text-neutral-500 font-normal">
            renders directly over Roblox Mobile center
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {CROSSHAIR_CHOICES.map((opt) => {
            const isSelected = selectedGear.crosshair === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => onGearChange({ ...selectedGear, crosshair: opt.id })}
                className={`
                  p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between
                  shadow-[0_4px_12px_rgba(0,0,0,0.25)]
                  ${
                    isSelected
                      ? "bg-surface-850 border-brand-500 ring-2 ring-brand-500/30 shadow-[0_0_15px_rgba(255,75,51,0.2)]"
                      : "bg-surface-850/70 border-surface-750 hover:border-brand-500/40 hover:bg-surface-850"
                  }
                `}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white font-heading">
                    {opt.name}
                  </span>
                  {/* Visual Preview */}
                  <div className="w-7 h-7 rounded-lg bg-surface-950 border border-surface-700 flex items-center justify-center shadow-inner">
                    {opt.id === "green_dot" && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#00FF66] shadow-[0_0_8px_#00FF66]" />
                    )}
                    {opt.id === "cyan_cross" && (
                      <span className="text-sm font-bold text-[#00F0FF] leading-none select-none drop-shadow-[0_0_6px_#00F0FF]">
                        +
                      </span>
                    )}
                    {opt.id === "red_circle" && (
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-[#FF3344] shadow-[0_0_8px_#FF3344]" />
                    )}
                  </div>
                </div>

                <p className="text-[11px] text-neutral-400 leading-snug">
                  {opt.desc}
                </p>

                <div className="mt-2.5 pt-2 border-t border-surface-800 flex items-center justify-between text-[10px] font-bold font-heading">
                  <span className={isSelected ? "text-brand-400" : "text-neutral-500"}>
                    {isSelected ? "● Selected" : "Click to pick"}
                  </span>
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: opt.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Hardware Tuning & Display Refresh */}
      <div>
        <div className="mb-2.5 flex items-center justify-between">
          <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider font-heading flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-brand-400" />
            2. Crosshair Tuning & Touch Polling
          </span>
          <span className="text-[11px] text-neutral-500 font-normal">
            fine-tune scale & visibility
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {/* Tuning 1: Crosshair Size */}
          <div className="p-3.5 rounded-xl bg-surface-850 border border-surface-750 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-300 font-heading">
                <Sliders className="w-3.5 h-3.5 text-brand-400" />
                Crosshair Size
              </div>
              <span className="text-xs font-extrabold text-brand-400 font-mono">
                {Math.round(config.crosshairScale * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.7"
              max="1.8"
              step="0.05"
              value={config.crosshairScale}
              onChange={(e) =>
                onChange({ ...config, crosshairScale: parseFloat(e.target.value) })
              }
              className="w-full accent-brand-500 cursor-pointer h-1.5 bg-surface-700 rounded-lg appearance-none"
            />
            <span className="text-[10px] text-neutral-400 mt-2">
              Adjust size for phone or tablet screen
            </span>
          </div>

          {/* Tuning 2: Crosshair Opacity */}
          <div className="p-3.5 rounded-xl bg-surface-850 border border-surface-750 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-300 font-heading">
                <Crosshair className="w-3.5 h-3.5 text-brand-400" />
                Crosshair Visibility
              </div>
              <span className="text-xs font-extrabold text-brand-400 font-mono">
                {Math.round(config.crosshairOpacity * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.4"
              max="1.0"
              step="0.05"
              value={config.crosshairOpacity}
              onChange={(e) =>
                onChange({ ...config, crosshairOpacity: parseFloat(e.target.value) })
              }
              className="w-full accent-brand-500 cursor-pointer h-1.5 bg-surface-700 rounded-lg appearance-none"
            />
            <span className="text-[10px] text-neutral-400 mt-2">
              Set transparency against bright skies
            </span>
          </div>

          {/* Tuning 3: 120Hz & Touch Polling Booster */}
          <div
            onClick={() =>
              onChange({ ...config, highRefreshEnabled: !config.highRefreshEnabled })
            }
            className="p-3.5 rounded-xl bg-surface-850 border border-surface-750 flex flex-col justify-between cursor-pointer hover:border-brand-500/40 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-300 font-heading">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                120Hz Touch Boost
              </div>
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded font-heading ${
                  config.highRefreshEnabled
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-surface-700 text-neutral-400"
                }`}
              >
                {config.highRefreshEnabled ? "ON" : "OFF"}
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 mt-2 leading-snug">
              Forces display refresh rate to 90Hz/120Hz for zero touch latency
            </p>
          </div>
        </div>
      </div>

      {/* Action Footer: Primary & Secondary Launch Controls */}
      <div className="pt-3 border-t border-surface-800/80 flex flex-col md:flex-row items-center justify-between gap-3.5">
        <div className="text-[11px] text-neutral-400 text-center md:text-left">
          <p>
            Active Crosshair:{" "}
            <span className="font-bold text-white font-heading capitalize">
              {selectedGear.crosshair.replace("_", " ")}
            </span>{" "}
            • 100% Touch Pass-Through
          </p>
          <p className="text-[10px] text-neutral-500 mt-0.5">
            Zero screen deadzones • Direct launch to official Roblox Mobile
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto">
          {/* Secondary Button: Launch Roblox without overlay */}
          <button
            type="button"
            onClick={onLaunchWithoutOverlay}
            disabled={launchStatus === "launching"}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-neutral-300 hover:text-white bg-surface-800 hover:bg-surface-750 border border-surface-700 font-heading font-bold text-xs tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Rocket className="w-3.5 h-3.5 text-neutral-400" />
            <span>PLAY ROBLOX (NO OVERLAY)</span>
          </button>

          {/* Primary Action Button: Start Overlay and Launch Roblox */}
          <button
            type="button"
            onClick={onStartAndLaunch}
            disabled={launchStatus === "launching"}
            className={`w-full sm:w-auto btn-3d px-6 py-2.5 rounded-xl text-white font-heading font-extrabold text-xs tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer ${
              launchStatus === "launching"
                ? "bg-amber-600 opacity-90 cursor-wait shadow-amber-500/20"
                : launchStatus === "running"
                ? "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20"
                : "bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 hover:shadow-brand-500/25"
            }`}
          >
            {launchStatus === "launching" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>LAUNCHING ROBLOX MOBILE...</span>
              </>
            ) : launchStatus === "running" ? (
              <>
                <Check className="w-4 h-4 text-white" />
                <span>ROBLOX LAUNCHED & ACTIVE!</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>START OVERLAY & PLAY ROBLOX</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
