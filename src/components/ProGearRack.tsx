import React, { useState } from "react";
import { Crosshair, Volume2, Type, ChevronRight, Lock } from "lucide-react";
import { ProGearSelection } from "../types";
import { playAudioPreview } from "../utils/audioPreview";

interface ProGearRackProps {
  gear: ProGearSelection;
  onChange: (gear: ProGearSelection) => void;
  isUnlocked: boolean;
}

const CROSSHAIR_OPTIONS: { id: ProGearSelection["crosshair"]; name: string; desc: string; color: string }[] = [
  { id: "green_dot", name: "Neon Green Dot", desc: "CS-style shooter pro dot", color: "#00FF66" },
  { id: "cyan_cross", name: "Cyan Cross (+)", desc: "Precision shooter crosshair", color: "#00F0FF" },
  { id: "red_circle", name: "Red Circle (○)", desc: "High-contrast tracking ring", color: "#FF3344" },
  { id: "default", name: "Default Arrow", desc: "Original white mouse pointer", color: "#FFFFFF" },
];

const SOUND_OPTIONS: { id: ProGearSelection["sound"]; name: string; desc: string }[] = [
  { id: "classic_oof", name: "Classic 2006 'OOF'", desc: "The legendary classic Roblox death sound!" },
  { id: "hitmarker", name: "CoD Hitmarker", desc: "Crisp metallic hit chime" },
  { id: "minecraft", name: "Minecraft Hit", desc: "Classic retro punch impact" },
  { id: "default", name: "Default Sound", desc: "Standard Roblox sound" },
];

const FONT_OPTIONS: { id: ProGearSelection["font"]; name: string; desc: string; styleClass: string }[] = [
  { id: "old_roblox", name: "Old Roblox Font", desc: "Classic 2006 cartoon block lettering!", styleClass: "tracking-wider font-extrabold" },
  { id: "minecraft", name: "Minecraft Pixel", desc: "Retro 8-bit block text", styleClass: "tracking-widest font-mono font-bold" },
  { id: "esports", name: "Clean Esports", desc: "Sharp, ultra-readable leaderboard text", styleClass: "tracking-tight font-sans font-bold" },
  { id: "default", name: "Default Roblox", desc: "Standard BuilderSans font", styleClass: "font-normal" },
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
    <div className="mt-5 mb-3 font-body">
      {/* Section Header */}
      <div className="mb-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider font-heading">
            2. Pick Your Pro Gear (Optional)
          </span>
          {!isUnlocked && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-surface-800 text-neutral-400 border border-surface-700 flex items-center gap-1 font-heading">
              <Lock className="w-2.5 h-2.5" />
              Locked to Stock Roblox
            </span>
          )}
        </div>
        <span className="text-[11px] text-neutral-500 font-normal lowercase">
          safe built-in crosshair, sounds, and fonts
        </span>
      </div>

      {/* 3-Card Pro Gear Rack */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Card 1: Aim Crosshair */}
        <div
          onClick={cycleCrosshair}
          className={`
            card-3d p-3.5 rounded-2xl border transition-all flex flex-col justify-between
            shadow-[0_4px_12px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.06)]
            ${isUnlocked
              ? "bg-surface-900 border-surface-800 border-b-2 border-b-surface-950 hover:border-brand-500/50 hover:bg-surface-850 cursor-pointer"
              : "bg-surface-900/60 border-surface-850 opacity-60 cursor-not-allowed"
            }
          `}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-surface-800 flex items-center justify-center border border-surface-700/80 text-brand-400">
                  <Crosshair className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider font-heading">
                  Aim Crosshair
                </span>
              </div>

              {/* Live Preview Swatch */}
              <div className="w-6 h-6 rounded-md bg-surface-950 border border-surface-750 flex items-center justify-center shadow-inner">
                {gear.crosshair === "green_dot" && (
                  <span className="w-2 h-2 rounded-full bg-[#00FF66] shadow-[0_0_6px_#00FF66]" />
                )}
                {gear.crosshair === "cyan_cross" && (
                  <span className="text-xs font-bold text-[#00F0FF] leading-none select-none">+</span>
                )}
                {gear.crosshair === "red_circle" && (
                  <span className="w-2.5 h-2.5 rounded-full border-2 border-[#FF3344] shadow-[0_0_6px_#FF3344]" />
                )}
                {gear.crosshair === "default" && (
                  <span className="text-[10px] text-white">↖</span>
                )}
              </div>
            </div>

            <div className="text-xs font-bold text-white font-heading">
              {isUnlocked ? activeCrosshair.name : "Default Arrow"}
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5 leading-snug">
              {isUnlocked ? activeCrosshair.desc : "Standard Roblox arrow cursor"}
            </p>
          </div>

          <div className="mt-2.5 pt-2 border-t border-surface-800/80 flex items-center justify-between text-[10px] font-bold text-brand-400 font-heading">
            <span>{isUnlocked ? "Click to change" : "Default"}</span>
            <ChevronRight className="w-3 h-3 text-neutral-500" />
          </div>
        </div>

        {/* Card 2: Hit & Death Sound */}
        <div
          onClick={cycleSound}
          className={`
            card-3d p-3.5 rounded-2xl border transition-all flex flex-col justify-between
            shadow-[0_4px_12px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.06)]
            ${isUnlocked
              ? "bg-surface-900 border-surface-800 border-b-2 border-b-surface-950 hover:border-brand-500/50 hover:bg-surface-850 cursor-pointer"
              : "bg-surface-900/60 border-surface-850 opacity-60 cursor-not-allowed"
            }
          `}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-surface-800 flex items-center justify-center border border-surface-700/80 text-brand-400">
                  <Volume2 className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider font-heading">
                  Hit & Death Sound
                </span>
              </div>

              {/* Interactive Audio Preview Button */}
              {isUnlocked && (
                <button
                  type="button"
                  onClick={handleTestAudio}
                  title="Click to test sound"
                  className={`btn-3d px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 font-heading border shadow-sm ${
                    isPlayingSound
                      ? "bg-brand-500 text-white border-brand-400 scale-95"
                      : "bg-surface-800 hover:bg-surface-700 text-brand-400 border-surface-700"
                  }`}
                >
                  <Volume2 className={`w-3 h-3 ${isPlayingSound ? "animate-pulse" : ""}`} />
                  <span>TEST</span>
                </button>
              )}
            </div>

            <div className="text-xs font-bold text-white font-heading">
              {isUnlocked ? activeSound.name : "Default Sound"}
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5 leading-snug">
              {isUnlocked ? activeSound.desc : "Standard Roblox sound"}
            </p>
          </div>

          <div className="mt-2.5 pt-2 border-t border-surface-800/80 flex items-center justify-between text-[10px] font-bold text-brand-400 font-heading">
            <span>{isUnlocked ? "Click to change" : "Default"}</span>
            <ChevronRight className="w-3 h-3 text-neutral-500" />
          </div>
        </div>

        {/* Card 3: Game Text Font */}
        <div
          onClick={cycleFont}
          className={`
            card-3d p-3.5 rounded-2xl border transition-all flex flex-col justify-between
            shadow-[0_4px_12px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.06)]
            ${isUnlocked
              ? "bg-surface-900 border-surface-800 border-b-2 border-b-surface-950 hover:border-brand-500/50 hover:bg-surface-850 cursor-pointer"
              : "bg-surface-900/60 border-surface-850 opacity-60 cursor-not-allowed"
            }
          `}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-surface-800 flex items-center justify-center border border-surface-700/80 text-brand-400">
                  <Type className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider font-heading">
                  Game Text Font
                </span>
              </div>

              {/* Sample Typography Preview Pill */}
              <div className="px-2 py-0.5 rounded bg-surface-950 border border-surface-750 text-[10px] text-brand-300 font-bold shadow-inner">
                Aa 123
              </div>
            </div>

            <div className={`text-xs font-bold text-white font-heading ${activeFont.styleClass}`}>
              {isUnlocked ? activeFont.name : "Default Roblox"}
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5 leading-snug">
              {isUnlocked ? activeFont.desc : "Standard BuilderSans font"}
            </p>
          </div>

          <div className="mt-2.5 pt-2 border-t border-surface-800/80 flex items-center justify-between text-[10px] font-bold text-brand-400 font-heading">
            <span>{isUnlocked ? "Click to change" : "Default"}</span>
            <ChevronRight className="w-3 h-3 text-neutral-500" />
          </div>
        </div>
      </div>
    </div>
  );
};
