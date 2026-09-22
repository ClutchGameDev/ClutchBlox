import React from "react";
import { Trees, Sun, Moon, AlertTriangle, X } from "lucide-react";

interface VantageOverlayProps {
  currentNight: number;
  phase: "day" | "night";
  secondsRemaining: number;
  onSyncDay: () => void;
  onSyncNight: () => void;
  onClose: () => void;
}

export const VantageOverlay: React.FC<VantageOverlayProps> = ({
  currentNight,
  phase,
  secondsRemaining,
  onSyncDay,
  onSyncNight,
  onClose,
}) => {
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const isDuskAlert = phase === "day" && secondsRemaining <= 45;

  return (
    <div className="fixed top-6 right-6 z-50 select-none animate-in fade-in duration-200">
      <div
        className={`rounded-2xl border backdrop-blur-xl p-3 shadow-[0_12px_36px_rgba(0,0,0,0.8)] flex items-center gap-3 transition-colors ${
          phase === "night"
            ? "bg-red-950/90 border-red-500/60 shadow-red-900/30"
            : isDuskAlert
            ? "bg-amber-950/90 border-amber-500/80 shadow-amber-900/40 animate-pulse"
            : "bg-surface-900/90 border-emerald-500/50 shadow-emerald-900/20"
        }`}
      >
        {/* Night Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-surface-950/70 border border-white/10 text-xs font-black font-heading text-white">
          <Trees className="w-3.5 h-3.5 text-emerald-400" />
          <span>NIGHT {currentNight}</span>
        </div>

        {/* Phase & Timer */}
        <div className="flex items-center gap-2">
          {phase === "night" ? (
            <Moon className="w-4 h-4 text-red-400 animate-spin-slow" />
          ) : isDuskAlert ? (
            <AlertTriangle className="w-4 h-4 text-amber-400" />
          ) : (
            <Sun className="w-4 h-4 text-amber-300" />
          )}

          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-wider text-neutral-300">
              {phase === "night"
                ? "ENTITIES ACTIVE"
                : isDuskAlert
                ? "DUSK WARNING"
                : "DAYLIGHT SCAVENGE"}
            </span>
            <span className="text-base font-black font-mono tracking-tight text-white leading-none">
              {formattedTime}
            </span>
          </div>
        </div>

        {/* Quick Sync Buttons */}
        <div className="flex items-center gap-1 pl-1 border-l border-white/10">
          <button
            type="button"
            title="Sync Day Start (F6)"
            onClick={onSyncDay}
            className="p-1.5 rounded-lg bg-surface-800/80 hover:bg-emerald-500 hover:text-white text-neutral-300 transition-colors"
          >
            <Sun className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            title="Sync Nightfall (F7)"
            onClick={onSyncNight}
            className="p-1.5 rounded-lg bg-surface-800/80 hover:bg-red-500 hover:text-white text-neutral-300 transition-colors"
          >
            <Moon className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            title="Close Floating Widget"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-surface-800/80 hover:bg-surface-700 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
