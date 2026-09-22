import React from "react";
import { Crosshair, Play, Trees, ExternalLink, ShieldCheck } from "lucide-react";

interface LaunchScreenProps {
  onLaunchClutchBlox: () => void;
  onLaunchVantage: () => void;
}

export const LaunchScreen: React.FC<LaunchScreenProps> = ({
  onLaunchClutchBlox,
  onLaunchVantage,
}) => {
  return (
    <div className="min-h-screen bg-surface-950 text-white flex flex-col justify-between p-6 max-w-5xl mx-auto font-body selection:bg-brand-500 selection:text-white">
      {/* Top Bar / Brand Minimalist Header */}
      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-500 flex items-center justify-center text-white font-bold shadow-[0_4px_12px_rgba(255,75,51,0.35)] border-b-2 border-brand-700">
            <Crosshair className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="text-base font-bold text-white tracking-tight font-heading">
            Clutch Launcher
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-900 border border-surface-800 text-[11px] text-neutral-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>100% Ban-Safe Engine</span>
        </div>
      </div>

      {/* Center Launcher Card Grid */}
      <main className="flex-1 flex items-center justify-center py-10">
        <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: ClutchBlox Primary Card */}
          <div className="card-3d relative rounded-2xl bg-surface-900 border border-surface-800 border-b-4 border-b-surface-950 p-6 shadow-[0_12px_30px_-4px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.08)] flex flex-col items-center text-center group hover:border-brand-500/50 transition-all">
            {/* Card Icon Glow */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-b from-brand-500 to-brand-600 flex items-center justify-center text-white shadow-[0_8px_24px_rgba(255,75,51,0.4),inset_0_1px_0_rgba(255,255,255,0.3)] border-b-4 border-brand-700 mb-4 transition-transform group-hover:scale-105">
              <Crosshair className="w-11 h-11 stroke-[2.5]" />
            </div>

            {/* Card Title & Subtitle */}
            <h1 className="text-2xl font-black text-white tracking-tight font-heading mb-1">
              ClutchBlox
            </h1>
            <p className="text-xs font-medium text-neutral-400 mb-6 uppercase tracking-wider">
              Competitive FPS Client
            </p>

            {/* Launch Action Button */}
            <button
              type="button"
              onClick={onLaunchClutchBlox}
              className="btn-3d w-full py-3.5 px-6 rounded-xl bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-bold text-sm tracking-wider font-heading flex items-center justify-center gap-2.5 shadow-[0_8px_20px_rgba(255,75,51,0.35),inset_0_1px_0_rgba(255,255,255,0.25)] border-b-4 border-brand-700 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>LAUNCH</span>
            </button>
          </div>

          {/* Card 2: 99Vantage Suite Card */}
          <div className="card-3d relative rounded-2xl bg-surface-900 border border-surface-800 border-b-4 border-b-surface-950 p-6 shadow-[0_12px_30px_-4px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.08)] flex flex-col items-center text-center group hover:border-emerald-500/50 transition-all">
            {/* Card Icon Glow */}
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-b from-emerald-500 to-emerald-600 flex items-center justify-center text-white shadow-[0_8px_24px_rgba(16,185,129,0.4),inset_0_1px_0_rgba(255,255,255,0.3)] border-b-4 border-emerald-700 mb-4 transition-transform group-hover:scale-105">
              <Trees className="w-11 h-11 stroke-[2.5]" />
            </div>

            {/* Card Title & Subtitle */}
            <h1 className="text-2xl font-black text-white tracking-tight font-heading mb-1">
              99Vantage
            </h1>
            <p className="text-xs font-medium text-emerald-400 mb-6 uppercase tracking-wider">
              99 Nights in the Forest
            </p>

            {/* Launch Action Button */}
            <button
              type="button"
              onClick={onLaunchVantage}
              className="btn-3d w-full py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold text-sm tracking-wider font-heading flex items-center justify-center gap-2.5 shadow-[0_8px_20px_rgba(16,185,129,0.35),inset_0_1px_0_rgba(255,255,255,0.25)] border-b-4 border-emerald-700 transition-all cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>LAUNCH</span>
            </button>
          </div>
        </div>
      </main>

      {/* Minimalist Footer */}
      <footer className="pb-2 pt-4 border-t border-surface-850/60 flex items-center justify-center text-xs text-neutral-400 font-body">
        <span>Created By:&nbsp;</span>
        <a
          href="https://github.com/ClutchGameDev"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-400 hover:text-brand-300 font-bold hover:underline inline-flex items-center gap-1 font-heading transition-colors"
        >
          ClutchGameDev
          <ExternalLink className="w-3 h-3" />
        </a>
      </footer>
    </div>
  );
};
