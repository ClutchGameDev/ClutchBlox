import React from "react";
import { Crosshair, Zap, ShieldCheck, Play, Sliders, Smartphone, AlertTriangle, Download, Loader2, Check } from "lucide-react";
import { AndroidOverlayConfig, ProGearSelection, LaunchStatus } from "../types";

interface AndroidOverlayControlsProps {
  config: AndroidOverlayConfig;
  onChange: (config: AndroidOverlayConfig) => void;
  selectedGear: ProGearSelection;
  launchStatus: LaunchStatus;
  onStartAndLaunch: () => void;
  onRequestPermission: () => void;
}

export const AndroidOverlayControls: React.FC<AndroidOverlayControlsProps> = ({
  config,
  onChange,
  selectedGear,
  launchStatus,
  onStartAndLaunch,
  onRequestPermission,
}) => {
  return (
    <div className="mt-4 p-4 rounded-2xl bg-surface-900 border border-surface-800 shadow-[0_6px_20px_rgba(0,0,0,0.4)] font-body">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4 pb-3 border-b border-surface-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-500/20 text-brand-400 border border-brand-500/30 flex items-center justify-center">
            <Smartphone className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-heading">
              Android Pro Overlay & Gaming Assist
            </h3>
            <p className="text-[11px] text-neutral-400">
              Hardware crosshair & 120Hz touch boost over Roblox Mobile (100% Ban-Proof)
            </p>
          </div>
        </div>

        {/* Action Badges & APK Download */}
        <div className="flex items-center gap-2 flex-wrap">
          <a
            href="/clutchblox.apk"
            download="ClutchBlox.apk"
            className="text-[10px] font-bold px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 font-heading transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            Download APK (.apk)
          </a>

          {config.hasPermission ? (
            <span className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 font-heading">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              Overlay: Ready
            </span>
          ) : (
            <button
              type="button"
              onClick={onRequestPermission}
              className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 font-heading transition-colors"
            >
              <AlertTriangle className="w-3 h-3 text-amber-400" />
              Grant Overlay
            </button>
          )}
        </div>
      </div>

      {/* Grid of Mobile Tuning Sliders & Toggles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-4">
        {/* Tuning 1: Crosshair Size */}
        <div className="p-3 rounded-xl bg-surface-850 border border-surface-750 flex flex-col justify-between">
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
          <span className="text-[10px] text-neutral-400 mt-1.5">
            Scales dot or crosshair on mobile screen
          </span>
        </div>

        {/* Tuning 2: Crosshair Opacity */}
        <div className="p-3 rounded-xl bg-surface-850 border border-surface-750 flex flex-col justify-between">
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
          <span className="text-[10px] text-neutral-400 mt-1.5">
            Adjust transparency against bright skies
          </span>
        </div>

        {/* Tuning 3: 120Hz & Touch Polling Booster */}
        <div
          onClick={() =>
            onChange({ ...config, highRefreshEnabled: !config.highRefreshEnabled })
          }
          className="p-3 rounded-xl bg-surface-850 border border-surface-750 flex flex-col justify-between cursor-pointer hover:border-brand-500/40 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-300 font-heading">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              120Hz Touch Boost
            </div>
            <span
              className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded font-heading ${
                config.highRefreshEnabled
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "bg-surface-700 text-neutral-400"
              }`}
            >
              {config.highRefreshEnabled ? "ON" : "OFF"}
            </span>
          </div>
          <p className="text-[10px] text-neutral-400 mt-1.5 leading-snug">
            Forces screen to maximum refresh rate (90Hz/120Hz) for instant touch aiming
          </p>
        </div>
      </div>

      {/* Action Footer: Launch Roblox Mobile With Overlay */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-[11px] text-neutral-400 text-center sm:text-left">
          Active Crosshair:{" "}
          <span className="font-bold text-white font-heading capitalize">
            {selectedGear.crosshair.replace("_", " ")}
          </span>{" "}
          • 100% Touch Pass-Through (Zero Deadzones)
        </div>

        <button
          type="button"
          onClick={onStartAndLaunch}
          disabled={launchStatus === "launching"}
          className={`w-full sm:w-auto btn-3d px-6 py-2.5 rounded-xl text-white font-heading font-extrabold text-xs tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all ${
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
  );
};
