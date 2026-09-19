import React from "react";
import { RotateCcw, X, AlertTriangle } from "lucide-react";
import { GameModePreset } from "../types";

interface RestartRobloxModalProps {
  preset: GameModePreset;
  onClose: () => void;
  onConfirmRestart: () => void;
  isRestarting: boolean;
}

export const RestartRobloxModal: React.FC<RestartRobloxModalProps> = ({
  preset,
  onClose,
  onConfirmRestart,
  isRestarting,
}) => {
  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity"
      onClick={onClose}
    >
      <div 
        className="animate-flip-y w-full max-w-md rounded-2xl bg-surface-900 border border-surface-700/80 border-b-8 border-b-surface-950 shadow-[0_30px_70px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.15)] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-surface-850 border-b border-surface-750/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
            </div>
            <h2 className="text-sm font-bold text-white font-heading">
              Roblox is Open
            </h2>
          </div>

          <button
            onClick={onClose}
            disabled={isRestarting}
            className="w-7 h-7 rounded-full bg-surface-800 hover:bg-surface-700 text-neutral-400 hover:text-white flex items-center justify-center text-xs"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 font-body flex flex-col gap-3">
          <p className="text-xs text-neutral-200 leading-relaxed font-body">
            Roblox is currently running. To install and see <strong className="text-brand-400 font-heading">{preset.name}</strong>, Roblox must be closed and restarted.
          </p>

          <div className="p-3 rounded-xl bg-surface-850 border border-surface-750/80">
            <p className="text-[11px] text-neutral-400 font-body">
              Clicking below will automatically close your open Roblox game, install <strong className="text-white">{preset.name}</strong>, and launch Roblox back up!
            </p>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="p-4 bg-surface-950 border-t border-surface-800 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            disabled={isRestarting}
            className="btn-3d px-4 py-2 rounded-xl bg-surface-800 hover:bg-surface-700 text-neutral-300 hover:text-white text-xs font-bold font-heading border border-surface-700 border-b-2 border-b-surface-900"
          >
            Cancel
          </button>

          <button
            onClick={onConfirmRestart}
            disabled={isRestarting}
            className="btn-3d px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold font-heading border-b-2 border-b-brand-700 shadow-[0_4px_10px_rgba(255,75,51,0.3)] flex items-center gap-1.5"
          >
            {isRestarting ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Restarting Roblox...</span>
              </>
            ) : (
              <>
                <RotateCcw className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Close & Restart Roblox</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
