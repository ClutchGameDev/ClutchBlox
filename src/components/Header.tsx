import React from "react";
import { Crosshair, ArrowLeft } from "lucide-react";
import { RobloxDetection } from "../types";

interface HeaderProps {
  detection: RobloxDetection;
  platformMode?: "windows" | "android";
  onTogglePlatform?: (mode: "windows" | "android") => void;
  androidHasPermission?: boolean;
  onRequestOverlayPermission?: () => void;
  onBackToLaunch?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  detection,
  platformMode = "windows",
  onTogglePlatform,
  androidHasPermission = true,
  onRequestOverlayPermission,
  onBackToLaunch,
}) => {
  return (
    <header className="flex items-center justify-between border-b border-surface-800/80 pb-3">
      {/* Left Side: Back button & Brand */}
      <div className="flex items-center gap-3">
        {onBackToLaunch && (
          <button
            type="button"
            onClick={onBackToLaunch}
            className="p-2 rounded-xl bg-surface-900 hover:bg-surface-800 border border-surface-800 hover:border-surface-700 text-neutral-400 hover:text-white transition-all cursor-pointer flex items-center gap-1 text-xs font-bold font-heading shadow-sm"
            title="Return to Launcher"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Launcher</span>
          </button>
        )}

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center text-white font-bold text-lg shadow-[0_4px_12px_rgba(255,75,51,0.35)] border-b-2 border-brand-700">
            <Crosshair className="w-5 h-5 stroke-[2.5]" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight font-heading">
            ClutchBlox
          </h1>
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
          !androidHasPermission && onRequestOverlayPermission ? (
            <button
              type="button"
              onClick={onRequestOverlayPermission}
              className="text-xs text-amber-300 hover:text-white flex items-center gap-1.5 font-medium px-2.5 py-1 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 shadow-sm font-body cursor-pointer transition-colors"
              title="Click to grant overlay permission"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              Grant Overlay
            </button>
          ) : (
            <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 shadow-sm font-body">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Mobile Ready
            </span>
          )
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
