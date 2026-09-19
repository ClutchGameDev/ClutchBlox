import React from "react";
import { 
  Check, 
  Sun, 
  Moon, 
  Sparkles, 
  Sunset, 
  Crosshair, 
  Gamepad2,
  Zap
} from "lucide-react";
import { GameModePreset } from "../types";

interface GameModeCardProps {
  preset: GameModePreset;
  isSelected: boolean;
  onSelect: () => void;
  onOpenAllowedGames: () => void;
  isFeatured?: boolean;
}

export const GameModeCard: React.FC<GameModeCardProps> = ({
  preset,
  isSelected,
  onSelect,
  onOpenAllowedGames,
  isFeatured = false,
}) => {
  return (
    <div
      onClick={onSelect}
      className={`
        card-3d relative flex flex-col w-full rounded-2xl overflow-hidden cursor-pointer
        shadow-[0_10px_25px_-4px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.1)]
        ${isSelected
          ? "bg-surface-850 border-2 border-brand-500 border-b-4 border-b-brand-600 shadow-[0_16px_32px_-4px_rgba(255,75,51,0.3),inset_0_1px_0_rgba(255,255,255,0.2)]"
          : "bg-surface-900 border border-surface-800 border-b-4 border-b-surface-950 hover:border-surface-600 hover:shadow-[0_16px_32px_-4px_rgba(0,0,0,0.7)]"
        }
      `}
    >
      {/* Featured Pro Badge */}
      {isFeatured && (
        <div className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/20 flex items-center gap-1.5 shadow-lg">
          <Zap className="w-3.5 h-3.5 text-brand-400 fill-brand-400 animate-pulse" />
          <span className="text-[11px] font-bold text-white tracking-wide uppercase font-heading">
            All Competitive Advantages
          </span>
        </div>
      )}

      {/* Active Checkmark */}
      {isSelected && (
        <div className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-brand-500 flex items-center justify-center shadow-lg border-2 border-white/30">
          <Check className="w-4 h-4 text-white stroke-[3.5]" />
        </div>
      )}

      {/* 3D Solid Preview Box with Centered Icon */}
      <div 
        className={`w-full flex items-center justify-center shadow-[inset_0_3px_8px_rgba(0,0,0,0.35),inset_0_-2px_4px_rgba(0,0,0,0.2)] ${
          isFeatured ? "h-36" : "h-28"
        }`}
        style={{ backgroundColor: preset.colorHex }}
      >
        {preset.iconType === "crosshair" && (
          <Crosshair className={`${isFeatured ? "w-16 h-16" : "w-11 h-11"} text-white stroke-[2.5] drop-shadow-lg`} />
        )}
        {preset.iconType === "sun" && (
          <Sun className={`${isFeatured ? "w-16 h-16" : "w-11 h-11"} text-white drop-shadow-lg`} />
        )}
        {preset.iconType === "moon" && (
          <Moon className={`${isFeatured ? "w-14 h-14" : "w-10 h-10"} text-white drop-shadow-lg`} />
        )}
        {preset.iconType === "stars" && (
          <Sparkles className={`${isFeatured ? "w-14 h-14" : "w-10 h-10"} text-white drop-shadow-lg`} />
        )}
        {preset.iconType === "sunset" && (
          <Sunset className={`${isFeatured ? "w-14 h-14" : "w-10 h-10"} text-white drop-shadow-lg`} />
        )}
      </div>

      {/* Card Content & Tactile Allowed Games Button */}
      <div className={`bg-surface-900 flex-1 flex flex-col justify-between ${isFeatured ? "p-4" : "p-3.5"}`}>
        <div>
          <div className="flex items-center justify-between gap-2">
            <h2 className={`font-bold text-white font-heading ${isFeatured ? "text-lg" : "text-base"}`}>
              {preset.name}
            </h2>
            {isFeatured && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30 uppercase tracking-wide">
                Active Tier
              </span>
            )}
          </div>
          <p className={`text-neutral-300 mt-1.5 leading-relaxed font-body ${isFeatured ? "text-xs font-normal" : "text-xs font-normal"}`}>
            {preset.simpleDescription}
          </p>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          {/* Pick Status Indicator */}
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded font-heading ${
              isSelected ? "bg-brand-500 text-white shadow-sm" : "bg-surface-800 text-neutral-400"
            }`}>
              {isSelected ? "Active Mode Selection" : "Click to Select"}
            </span>
          </div>

          {/* 3D Tactile "Allowed Games" Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenAllowedGames();
            }}
            className={`btn-3d w-full rounded-xl bg-surface-800 hover:bg-surface-700 active:bg-surface-850 text-neutral-200 hover:text-white font-bold font-heading flex items-center justify-center gap-1.5 border border-surface-700/80 border-b-2 border-b-surface-950 shadow-[0_2px_5px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.08)] ${
              isFeatured ? "py-2 px-3 text-xs" : "py-1.5 px-2 text-[11px]"
            }`}
          >
            <Gamepad2 className="w-4 h-4 text-brand-400" />
            <span>Game Details & Boosts</span>
          </button>
        </div>
      </div>
    </div>
  );
};
