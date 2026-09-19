import React from "react";
import { Play, Check, Globe, RefreshCw } from "lucide-react";
import { LaunchStatus } from "../types";

interface FooterProps {
  selectedPresetName: string;
  isReady: boolean;
  launchStatus: LaunchStatus;
  onLaunch: () => void;
  serverRegion?: string | null;
  pingMs?: number | null;
  retryAttempt?: number;
  maxRetries?: number;
}

export const Footer: React.FC<FooterProps> = ({
  selectedPresetName,
  isReady,
  launchStatus,
  onLaunch,
  serverRegion,
  pingMs,
  retryAttempt,
  maxRetries,
}) => {
  const isButtonDisabled = !isReady || launchStatus === "injecting" || launchStatus === "launching";

  return (
    <footer className="pt-4 border-t border-surface-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div>
        <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider font-heading mb-0.5">
          3. Start Playing
        </div>
        <div className="text-xs text-neutral-300 font-body">
          Selected Mode: <span className="text-sm font-bold text-brand-500 font-heading">{selectedPresetName}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
        {/* Server Status Module (To the left of Play Roblox) */}
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-surface-900 border border-surface-800 shadow-[0_2px_8px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.06)]">
          <div className="w-7 h-7 rounded-lg bg-surface-800 flex items-center justify-center border border-surface-700/80 text-brand-400 shrink-0">
            <Globe className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider font-heading leading-none">
                SERVER
              </span>
              {retryAttempt !== undefined && retryAttempt > 0 && retryAttempt <= (maxRetries || 3) && (
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1 font-heading leading-tight">
                  <RefreshCw className="w-2.5 h-2.5 animate-spin" />
                  Try {retryAttempt}/{maxRetries || 3}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs font-bold text-white font-heading truncate max-w-[150px] sm:max-w-[170px]">
                {serverRegion || "Auto (Fastest Server)"}
              </span>
              {pingMs !== null && pingMs !== undefined ? (
                <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded font-mono leading-none ${
                  pingMs <= 60 
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : pingMs <= 100
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    : "bg-red-500/20 text-red-300 border border-red-500/30"
                }`}>
                  {pingMs}ms
                </span>
              ) : (
                <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded font-heading uppercase leading-none bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-sm">
                  AUTO
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Play Roblox Button */}
        <button
          onClick={onLaunch}
          disabled={isButtonDisabled}
          className={`
            btn-3d w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide
            flex items-center justify-center gap-2 font-heading
            shadow-[0_8px_16px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.2)] border-b-4 border-b-brand-700
            ${!isButtonDisabled
              ? "bg-brand-500 hover:bg-brand-600 text-white cursor-pointer shadow-brand-500/20"
              : "bg-surface-800 text-neutral-500 cursor-not-allowed border-b-surface-950"
            }
          `}
        >
          {launchStatus === "idle" && (
            <>
              <Play className="w-5 h-5 fill-white" />
              <span>PLAY ROBLOX</span>
            </>
          )}
          {launchStatus === "injecting" && (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Applying Boosts...
            </span>
          )}
          {launchStatus === "launching" && (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Starting Roblox...
            </span>
          )}
          {launchStatus === "running" && (
            <span className="flex items-center gap-2 text-emerald-300">
              <Check className="w-5 h-5 stroke-[3]" />
              Game Started!
            </span>
          )}
          {launchStatus === "error" && (
            <span>Try Again</span>
          )}
        </button>
      </div>
    </footer>
  );
};
