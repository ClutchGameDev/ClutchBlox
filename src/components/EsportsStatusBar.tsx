import React from "react";
import { Globe, Cpu, Target, Sparkles, RefreshCw, Zap } from "lucide-react";
import { EsportsHudState } from "../types";

interface EsportsStatusBarProps {
  hud: EsportsHudState;
}

export const EsportsStatusBar: React.FC<EsportsStatusBarProps> = ({ hud }) => {
  return (
    <div className="mb-4 p-3 rounded-2xl bg-surface-900/95 border border-surface-750/90 shadow-[0_8px_20px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-sm flex flex-wrap items-center justify-between gap-3 font-body">
      {/* 1. Server Region & Ping */}
      <div className="flex items-center gap-2.5 min-w-[200px]">
        <div className="w-8 h-8 rounded-xl bg-surface-800 flex items-center justify-center border border-surface-700 text-brand-400 shrink-0">
          <Globe className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider font-heading">
              Server Radar
            </span>
            {hud.retryAttempt > 0 && hud.retryAttempt <= hud.maxRetries && (
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 font-heading">
                <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                Try {hud.retryAttempt}/{hud.maxRetries}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs font-bold text-white font-heading">
              {hud.serverRegion || "Waiting for Game Join"}
            </span>
            {hud.pingMs !== null && (
              <span className={`text-[11px] font-extrabold px-1.5 py-0.5 rounded font-mono ${
                hud.pingMs <= 60 
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : hud.pingMs <= 100
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "bg-red-500/20 text-red-300 border border-red-500/30"
              }`}>
                {hud.pingMs}ms
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. P-Core & 0.5ms Timer Latency Status */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-surface-800 flex items-center justify-center border border-surface-700 text-brand-400 shrink-0">
          <Cpu className="w-4 h-4" />
        </div>
        <div>
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider font-heading">
            Speed & Click Response
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
            <span className="text-xs font-bold text-neutral-200 font-heading">
              P-Cores Pinned • 0.5ms Timer
            </span>
          </div>
        </div>
      </div>

      {/* 3. Per-Game Dynamic Mode */}
      <div className="flex items-center gap-2.5">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center border shrink-0 ${
          hud.profileMode === "Competitive" 
            ? "bg-brand-500/20 border-brand-500/40 text-brand-400"
            : hud.profileMode === "Visual"
            ? "bg-purple-500/20 border-purple-500/40 text-purple-400"
            : "bg-surface-800 border-surface-700 text-neutral-400"
        }`}>
          {hud.profileMode === "Competitive" && <Target className="w-4 h-4" />}
          {hud.profileMode === "Visual" && <Sparkles className="w-4 h-4" />}
          {hud.profileMode === "Standby" && <Zap className="w-4 h-4" />}
        </div>
        <div>
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider font-heading">
            Active Game Boost
          </span>
          <div className="mt-0.5">
            <span className="text-xs font-bold text-white font-heading">
              {hud.profileMode === "Competitive" && "Shooter Mode (Clean Vision)"}
              {hud.profileMode === "Visual" && "Visual Mode (Pretty Graphics)"}
              {hud.profileMode === "Standby" && "Armed & Ready"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
