import React from "react";
import { Crosshair } from "lucide-react";
import { RobloxDetection } from "../types";

interface HeaderProps {
  detection: RobloxDetection;
  platformMode?: "windows" | "android";
  onTogglePlatform?: (mode: "windows" | "android") => void;
}

export const Header: React.FC<HeaderProps> = ({ detection, platformMode = "windows", onTogglePlatform }) => {
  return (
    <header className="flex items-center justify-between border-b border-surface-800/80 pb-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white font-bold text-xl shadow-[0_4px_12px_rgba(255,75,51,0.35),inset_0_1px_0_rgba(255,255,255,0.25)] border-b-2 border-brand-700 font-heading">
          <Crosshair className="w-6 h-6 stroke-[2.5]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight font-heading">
              ClutchBlox
            </h1>
            <span className="text-[10px] font-bold text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-full border border-brand-500/30 font-heading">
              v1.4.0
            </span>
            <span className="text-[9px] font-bold text-neutral-400 bg-surface-850 px-1.5 py-0.5 rounded uppercase tracking-wider font-heading">
              Competitive Client
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-0.5 font-body">
            Pick a mode below, then click Play Roblox.
          </p>
        </div>
      </div>

      {/* Right Side: Platform Selector & Status Indicator */}
      <div className="flex items-center gap-2.5">
        {onTogglePlatform && (
          <div className="flex items-center p-0.5 rounded-lg bg-surface-900 border border-surface-800 text-[10px] font-bold font-heading">
            <button
              type="button"
              onClick={() => onTogglePlatform("windows")}
              className={`px-2 py-1 rounded-md transition-all ${
                platformMode === "windows"
                  ? "bg-brand-500 text-white shadow-sm"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              💻 PC
            </button>
            <button
              type="button"
              onClick={() => onTogglePlatform("android")}
              className={`px-2 py-1 rounded-md transition-all ${
                platformMode === "android"
                  ? "bg-brand-500 text-white shadow-sm"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              📱 Android
            </button>
          </div>
        )}

        {platformMode === "android" ? (
          <span className="text-xs text-brand-400 flex items-center gap-1.5 font-medium px-2.5 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 shadow-sm font-body">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-pulse" />
            Mobile Ready
          </span>
        ) : (
          <>
            {detection.status === "detecting" && (
              <span className="text-xs text-neutral-400 font-body">Finding Roblox...</span>
            )}
            {detection.status === "found" && (
              <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/20 shadow-sm font-body">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Roblox Ready
              </span>
            )}
            {detection.status === "not_found" && (
              <span className="text-xs text-red-400 flex items-center gap-1.5 font-medium px-2.5 py-1 rounded-full bg-red-950/40 border border-red-500/20 shadow-sm font-body">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                Roblox Not Found
              </span>
            )}
          </>
        )}
      </div>
    </header>
  );
};
