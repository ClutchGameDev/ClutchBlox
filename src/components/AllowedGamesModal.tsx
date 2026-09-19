import { 
  Check, 
  Sun, 
  Moon, 
  Sparkles, 
  Sunset, 
  Crosshair, 
  Gamepad2, 
  Zap,
  X 
} from "lucide-react";
import { GameModePreset } from "../types";

interface AllowedGamesModalProps {
  preset: GameModePreset;
  onClose: () => void;
  onSelectAndClose: (id: string) => void;
}

export const AllowedGamesModal: React.FC<AllowedGamesModalProps> = ({
  preset,
  onClose,
  onSelectAndClose,
}) => {
  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity"
      onClick={onClose}
    >
      <div 
        className="animate-flip-y w-full max-w-lg rounded-2xl bg-surface-900 border border-surface-700/80 border-b-8 border-b-surface-950 shadow-[0_30px_70px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.15)] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 3D Header Banner */}
        <div 
          className="p-5 flex items-center justify-between relative shadow-[inset_0_-2px_6px_rgba(0,0,0,0.3)]"
          style={{ backgroundColor: preset.colorHex }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black/30 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner">
              {preset.iconType === "crosshair" && <Crosshair className="w-6 h-6 text-white stroke-[2.5]" />}
              {preset.iconType === "sun" && <Sun className="w-6 h-6 text-white" />}
              {preset.iconType === "moon" && <Moon className="w-6 h-6 text-white" />}
              {preset.iconType === "stars" && <Sparkles className="w-6 h-6 text-white" />}
              {preset.iconType === "sunset" && <Sunset className="w-6 h-6 text-white" />}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-heading drop-shadow-md">
                {preset.name}
              </h2>
              <p className="text-xs text-white/90 font-medium font-body">
                Allowed Games & Extended Features
              </p>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="btn-3d w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center border border-white/20 shadow-md"
          >
            <X className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 flex-1 flex flex-col gap-4 font-body max-h-[65vh] overflow-y-auto no-scrollbar">
          {/* Section 1: What It Does */}
          <div className="p-3.5 rounded-xl bg-surface-850 border border-surface-750/80 shadow-inner">
            <h3 className="text-xs font-bold text-brand-400 uppercase tracking-wider font-heading mb-1 flex items-center gap-1.5">
              <span>What This Mode Does</span>
            </h3>
            <p className="text-xs text-neutral-200 leading-relaxed font-body">
              {preset.whatItDoes}
            </p>
          </div>

          {/* Section 2: Allowed Games */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider font-heading flex items-center gap-1.5">
                <Gamepad2 className="w-3.5 h-3.5 text-brand-400" />
                <span>Allowed Games</span>
              </h3>
              <span className="text-[11px] text-green-400 font-semibold font-body">
                Universal Support
              </span>
            </div>

            <div className="rounded-xl bg-surface-850 border border-surface-750/80 shadow-inner">
              <ul className="divide-y divide-surface-800/80">
                {preset.allowedGames.map((game, idx) => (
                  <li 
                    key={idx}
                    className="px-4 py-2.5 text-xs text-neutral-200 font-bold font-body flex items-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-green-500 shrink-0 shadow-[0_0_6px_rgba(34,197,94,0.6)]" />
                    <span>{game}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Section 3: Extended Features Box */}
          {preset.extendedFeatures && preset.extendedFeatures.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider font-heading flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-brand-400" />
                  <span>Extended Features</span>
                </h3>
                <span className="text-[11px] text-brand-400 font-medium font-body">
                  {preset.extendedFeatures.length} advantages
                </span>
              </div>

              <div className="rounded-xl bg-surface-850 border border-surface-750/80 shadow-inner max-h-56 overflow-y-auto no-scrollbar divide-y divide-surface-800/80">
                {preset.extendedFeatures.map((feature, idx) => (
                  <div key={idx} className="p-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-brand-500 shrink-0 shadow-[0_0_6px_rgba(255,75,51,0.6)]" />
                      <span className="text-xs font-bold text-white font-heading">
                        {feature.title}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-300 font-body mt-1 pl-4 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-surface-950 border-t border-surface-800 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="btn-3d px-4 py-2 rounded-xl bg-surface-800 hover:bg-surface-700 text-neutral-300 hover:text-white text-xs font-bold font-heading border border-surface-700 border-b-2 border-b-surface-900"
          >
            Close
          </button>

          <button
            onClick={() => onSelectAndClose(preset.id)}
            className="btn-3d px-5 py-2 rounded-xl bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold font-heading border-b-2 border-b-brand-700 shadow-[0_4px_10px_rgba(255,75,51,0.3)] flex items-center gap-1.5"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Activate This Mode</span>
          </button>
        </div>
      </div>
    </div>
  );
};
