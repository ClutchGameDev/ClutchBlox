import React, { useState } from "react";
import { Crosshair, Volume2, Type } from "lucide-react";
import { ProGearSelection } from "../types";
import { playAudioPreview } from "../utils/audioPreview";

interface ProGearRackProps {
  gear: ProGearSelection;
  onChange: (gear: ProGearSelection) => void;
  isUnlocked: boolean;
}

const CROSSHAIR_OPTIONS: { id: ProGearSelection["crosshair"]; name: string; color: string }[] = [
  { id: "green_dot", name: "Neon Green Dot", color: "#00FF66" },
  { id: "cyan_cross", name: "Cyan Cross (+)", color: "#00F0FF" },
  { id: "red_circle", name: "Red Circle (○)", color: "#FF3344" },
  { id: "default", name: "Default Arrow", color: "#FFFFFF" },
];

const SOUND_OPTIONS: { id: ProGearSelection["sound"]; name: string }[] = [
  { id: "classic_oof", name: "Classic 2006 'OOF'" },
  { id: "hitmarker", name: "CoD Hitmarker" },
  { id: "minecraft", name: "Minecraft Hit" },
  { id: "default", name: "Default Sound" },
];

const FONT_OPTIONS: { id: ProGearSelection["font"]; name: string; styleClass: string }[] = [
  { id: "old_roblox", name: "Old Roblox Font", styleClass: "tracking-wider font-extrabold" },
  { id: "minecraft", name: "Minecraft Pixel", styleClass: "tracking-widest font-mono font-bold" },
  { id: "esports", name: "Clean Esports", styleClass: "tracking-tight font-sans font-bold" },
  { id: "default", name: "Default Roblox", styleClass: "font-normal" },
];

export const ProGearRack: React.FC<ProGearRackProps> = ({
  gear,
  onChange,
  isUnlocked,
}) => {
  const [isPlayingSound, setIsPlayingSound] = useState(false);

  const activeCrosshair = CROSSHAIR_OPTIONS.find((c) => c.id === gear.crosshair) || CROSSHAIR_OPTIONS[0];
  const activeSound = SOUND_OPTIONS.find((s) => s.id === gear.sound) || SOUND_OPTIONS[0];
  const activeFont = FONT_OPTIONS.find((f) => f.id === gear.font) || FONT_OPTIONS[0];

  const cycleCrosshair = () => {
    if (!isUnlocked) return;
    const currentIndex = CROSSHAIR_OPTIONS.findIndex((c) => c.id === gear.crosshair);
    const nextIndex = (currentIndex + 1) % CROSSHAIR_OPTIONS.length;
    onChange({ ...gear, crosshair: CROSSHAIR_OPTIONS[nextIndex].id });
  };

  const cycleSound = () => {
    if (!isUnlocked) return;
    const currentIndex = SOUND_OPTIONS.findIndex((s) => s.id === gear.sound);
    const nextIndex = (currentIndex + 1) % SOUND_OPTIONS.length;
    const nextSound = SOUND_OPTIONS[nextIndex].id;
    onChange({ ...gear, sound: nextSound });
    playAudioPreview(nextSound);
  };

  const cycleFont = () => {
    if (!isUnlocked) return;
    const currentIndex = FONT_OPTIONS.findIndex((f) => f.id === gear.font);
    const nextIndex = (currentIndex + 1) % FONT_OPTIONS.length;
    onChange({ ...gear, font: FONT_OPTIONS[nextIndex].id });
  };

  const handleTestAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlayingSound(true);
    playAudioPreview(gear.sound);
    setTimeout(() => setIsPlayingSound(false), 450);
  };

  return (
    <div className="mt-4 mb-2 font-body">
      {/* 3-Card Streamlined Pro Gear Rack */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Card 1: Aim Crosshair */}
        <div
          onClick={cycleCrosshair}
          className={`
            card-3d p-3 rounded-xl border transition-all flex items-center justify-between
            shadow-[0_4px_12px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.06)]
            ${isUnlocked
              ? "bg-surface-900 border-surface-800 hover:border-brand-500/50 hover:bg-surface-850 cursor-pointer"
              : "bg-surface-900/60 border-surface-850 opacity-60 cursor-not-allowed"
            }
          `}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-surface-800 flex items-center justify-center border border-surface-700/80 text-brand-400 shrink-0">
              <Crosshair className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider font-heading block">
                Crosshair
              </span>
              <span className="text-xs font-bold text-white font-heading">
                {isUnlocked ? activeCrosshair.name : "Default"}
              </span>
            </div>
          </div>

          {/* Swatch Preview */}
          <div className="w-7 h-7 rounded-md bg-surface-950 border border-surface-750 flex items-center justify-center shadow-inner shrink-0">
            {gear.crosshair === "green_dot" && (
              <span className="w-2.5 h-2.5 rounded-full bg-[#00FF66] shadow-[0_0_6px_#00FF66]" />
            )}
            {gear.crosshair === "cyan_cross" && (
              <span className="text-sm font-bold text-[#00F0FF] leading-none select-none">+</span>
            )}
            {gear.crosshair === "red_circle" && (
              <span className="w-3 h-3 rounded-full border-2 border-[#FF3344] shadow-[0_0_6px_#FF3344]" />
            )}
            {gear.crosshair === "default" && (
              <span className="text-xs text-white">↖</span>
            )}
          </div>
        </div>

        {/* Card 2: Hit & Death Sound */}
        <div
          onClick={cycleSound}
          className={`
            card-3d p-3 rounded-xl border transition-all flex items-center justify-between
            shadow-[0_4px_12px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.06)]
            ${isUnlocked
              ? "bg-surface-900 border-surface-800 hover:border-brand-500/50 hover:bg-surface-850 cursor-pointer"
              : "bg-surface-900/60 border-surface-850 opacity-60 cursor-not-allowed"
            }
          `}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-surface-800 flex items-center justify-center border border-surface-700/80 text-brand-400 shrink-0">
              <Volume2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider font-heading block">
                Sound
              </span>
              <span className="text-xs font-bold text-white font-heading">
                {isUnlocked ? activeSound.name : "Default"}
              </span>
            </div>
          </div>

          {/* Test Audio Button */}
          {isUnlocked && (
            <button
              type="button"
              onClick={handleTestAudio}
              className={`btn-3d px-2 py-1 rounded-md text-[10px] font-bold font-heading border shadow-sm shrink-0 ${
                isPlayingSound
                  ? "bg-brand-500 text-white border-brand-400 scale-95"
                  : "bg-surface-800 hover:bg-surface-700 text-brand-400 border-surface-700"
              }`}
            >
              <Volume2 className={`w-3 h-3 ${isPlayingSound ? "animate-pulse" : ""}`} />
            </button>
          )}
        </div>

        {/* Card 3: Game Text Font */}
        <div
          onClick={cycleFont}
          className={`
            card-3d p-3 rounded-xl border transition-all flex items-center justify-between
            shadow-[0_4px_12px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.06)]
            ${isUnlocked
              ? "bg-surface-900 border-surface-800 hover:border-brand-500/50 hover:bg-surface-850 cursor-pointer"
              : "bg-surface-900/60 border-surface-850 opacity-60 cursor-not-allowed"
            }
          `}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-surface-800 flex items-center justify-center border border-surface-700/80 text-brand-400 shrink-0">
              <Type className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider font-heading block">
                Font
              </span>
              <span className={`text-xs font-bold text-white font-heading ${activeFont.styleClass}`}>
                {isUnlocked ? activeFont.name : "Default"}
              </span>
            </div>
          </div>

          {/* Font Pill */}
          <div className="px-2 py-1 rounded bg-surface-950 border border-surface-750 text-[10px] text-brand-300 font-bold shadow-inner shrink-0">
            Aa
          </div>
        </div>
      </div>
    </div>
  );
};
