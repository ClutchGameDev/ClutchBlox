import React from "react";
import { 
  Check, 
  Sun, 
  Moon, 
  Sparkles, 
  Sunset, 
  Crosshair, 
  Gamepad2
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
        card-3d relative flex flex-col justify-between w-full rounded-2xl overflow-hidden cursor-pointer transition-all
        shadow-[0_10px_25px_-4px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.08)]
        ${isSelected
          ? "bg-surface-850 border-2 border-brand-500 border-b-4 border-b-brand-600 shadow-[0_16px_32px_-4px_rgba(255,75,51,0.25),inset_0_1px_0_rgba(255,255,255,0.15)]"
          : "bg-surface-900 border border-surface-800 border-b-4 border-b-surface-950 hover:border-surface-700 hover:shadow-[0_16px_32px_-4px_rgba(0,0,0,0.7)]"
        }
      `}
    >
      {/* Active Indicator Checkmark */}
      {isSelected && (
        <div className="absolute top-3 right-3 z-10 w-6 h-6 rounded-full bg-brand-500 flex items-center justify-center shadow-md border-2 border-white/30">
          <Check className="w-3.5 h-3.5 text-white stroke-[3.5]" />
        </div>
      )}

      {/* Solid Color Banner with Centered Icon */}
      <div 
        className={`w-full flex items-center justify-center shadow-[inset_0_3px_8px_rgba(0,0,0,0.35),inset_0_-2px_4px_rgba(0,0,0,0.2)] ${
          isFeatured ? "h-28" : "h-24"
        }`}
        style={{ backgroundColor: preset.colorHex }}
      >
        {preset.iconType === "crosshair" && (
          <Crosshair className={`${isFeatured ? "w-12 h-12" : "w-10 h-10"} text-white stroke-[2.5] drop-shadow-md`} />
        )}
        {preset.iconType === "sun" && (
          <Sun className={`${isFeatured ? "w-12 h-12" : "w-10 h-10"} text-white drop-shadow-md`} />
        )}
        {preset.iconType === "moon" && (
          <Moon className={`${isFeatured ? "w-11 h-11" : "w-9 h-9"} text-white drop-shadow-md`} />
        )}
        {preset.iconType === "stars" && (
          <Sparkles className={`${isFeatured ? "w-11 h-11" : "w-9 h-9"} text-white drop-shadow-md`} />
        )}
        {preset.iconType === "sunset" && (
          <Sunset className={`${isFeatured ? "w-11 h-11" : "w-9 h-9"} text-white drop-shadow-md`} />
        )}
      </div>

      {/* Card Body: ONLY Title and Details Button */}
      <div className="bg-surface-900 p-4 flex flex-col justify-between gap-4 flex-1">
        <h2 className="font-bold text-white font-heading text-lg tracking-tight text-center">
          {preset.name}
        </h2>

        {/* Tactile "Details" Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenAllowedGames();
          }}
          className="btn-3d w-full py-2 px-3 rounded-xl bg-surface-800 hover:bg-surface-750 active:bg-surface-850 text-neutral-200 hover:text-white font-bold font-heading text-xs flex items-center justify-center gap-1.5 border border-surface-700/80 border-b-2 border-b-surface-950 shadow-[0_2px_5px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.08)] transition-all cursor-pointer"
        >
          <Gamepad2 className="w-3.5 h-3.5 text-brand-400" />
          <span>Details</span>
        </button>
      </div>
    </div>
  );
};
