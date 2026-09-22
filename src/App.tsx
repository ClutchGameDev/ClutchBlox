import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { AlertCircle } from "lucide-react";
import { GameModePreset, RobloxDetection, LaunchStatus, EsportsHudState, ProGearSelection, AndroidOverlayConfig } from "./types";
import { PRESETS } from "./constants/presets";
import { Header } from "./components/Header";
import { LaunchScreen } from "./components/LaunchScreen";
import { GameModeCard } from "./components/GameModeCard";
import { ProGearRack } from "./components/ProGearRack";
import { AndroidOverlayControls } from "./components/AndroidOverlayControls";
import { AllowedGamesModal } from "./components/AllowedGamesModal";
import { RestartRobloxModal } from "./components/RestartRobloxModal";
import { VantageScreen } from "./components/VantageScreen";
import { Footer } from "./components/Footer";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<"launch" | "clutchblox" | "99vantage">("launch");

  const [platformMode, setPlatformMode] = useState<"windows" | "android">(() => {
    if (typeof window !== "undefined" && (window as any).ClutchAndroid) {
      return "android";
    }
    if (typeof navigator !== "undefined") {
      if (/android|iphone|ipad|ipod|clutchblox/i.test(navigator.userAgent)) {
        return "android";
      }
    }
    return "windows";
  });

  const [androidConfig, setAndroidConfig] = useState<AndroidOverlayConfig>({
    hasPermission: true,
    isActive: false,
    crosshairScale: 1.0,
    crosshairOpacity: 1.0,
    highRefreshEnabled: true,
    radarVisible: true,
  });

  const [activeMode, setActiveMode] = useState<string>("Competitive_Pro");
  const [modalPreset, setModalPreset] = useState<GameModePreset | null>(null);
  const [restartPromptPreset, setRestartPromptPreset] = useState<GameModePreset | null>(null);
  const [isRestarting, setIsRestarting] = useState<boolean>(false);
  const [gear, setGear] = useState<ProGearSelection>({
    crosshair: "green_dot",
    sound: "classic_oof",
    font: "old_roblox",
  });
  const [detection, setDetection] = useState<RobloxDetection>({
    status: "idle",
    path: null,
    versionHash: null,
    errorMessage: null,
  });
  const [launchStatus, setLaunchStatus] = useState<LaunchStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [hudState, setHudState] = useState<EsportsHudState>({
    active: true,
    gameTitle: null,
    placeId: null,
    serverRegion: "Auto (Fastest Server)",
    pingMs: null,
    pCoreOptimized: true,
    timerResolution: "0.5ms",
    profileMode: "Standby",
    retryAttempt: 0,
    maxRetries: 3,
    statusText: "Ready",
  });

  // Initial environment detection & telemetry listener
  useEffect(() => {
    const detectEnvironment = async () => {
      // 1. Check if native Android bridge is attached
      if (typeof window !== "undefined" && (window as any).ClutchAndroid) {
        setPlatformMode("android");
        try {
          const hasPerm = (window as any).ClutchAndroid.hasOverlayPermission();
          setAndroidConfig((prev) => ({ ...prev, hasPermission: hasPerm }));
        } catch {}
        return;
      }

      // 2. Check user agent
      if (typeof navigator !== "undefined" && /android|iphone|ipad|ipod|clutchblox/i.test(navigator.userAgent)) {
        setPlatformMode("android");
        return;
      }

      // 3. Check if Tauri reports mobile platform
      try {
        const isMobile = await invoke<boolean>("is_mobile_platform");
        if (isMobile) {
          setPlatformMode("android");
          return;
        }
      } catch {}
    };

    detectEnvironment();

    // Listen for live telemetry from ClutchBlox Rust backend
    const unlistenPromise = listen<EsportsHudState>("clutch_hud_update", (event) => {
      if (event.payload) {
        setHudState(event.payload);
      }
    });

    return () => {
      unlistenPromise.then((unlisten) => unlisten()).catch(() => {});
    };
  }, []);

  // Platform mode reactions: Windows file scanner vs Android permission check
  useEffect(() => {
    if (platformMode === "windows") {
      checkRobloxInstallation();
      invoke("apply_skybox", { presetName: "Competitive_Pro" }).catch(() => {});
      invoke("apply_pro_gear", { gear: { crosshair: "green_dot", sound: "classic_oof", font: "old_roblox" } }).catch(() => {});
    } else {
      // Android mode: query native bridge for overlay permission
      if (typeof window !== "undefined" && (window as any).ClutchAndroid?.hasOverlayPermission) {
        try {
          const hasPerm = (window as any).ClutchAndroid.hasOverlayPermission();
          setAndroidConfig((prev) => ({ ...prev, hasPermission: hasPerm }));
        } catch {}
      }
    }
  }, [platformMode]);

  const checkRobloxInstallation = async () => {
    setDetection((prev) => ({ ...prev, status: "detecting" }));
    try {
      const activePath = await invoke<string>("find_roblox_path");
      const parts = activePath.split(/[\\/]/);
      const versionFolder = parts[parts.length - 1] || activePath;

      setDetection({
        status: "found",
        path: activePath,
        versionHash: versionFolder,
        errorMessage: null,
      });
    } catch (err: any) {
      setDetection({
        status: "not_found",
        path: null,
        versionHash: null,
        errorMessage: String(err),
      });
    }
  };

  const handleGearChange = async (newGear: ProGearSelection) => {
    setGear(newGear);
    if (platformMode === "windows" && activeMode === "Competitive_Pro") {
      try {
        await invoke("apply_pro_gear", { gear: newGear });
      } catch (err: any) {
        console.warn("Could not apply pro gear:", err);
      }
    }
  };

  const handleSelectMode = async (preset: GameModePreset) => {
    try {
      const isRunning = await invoke<boolean>("is_roblox_running");
      if (isRunning) {
        setRestartPromptPreset(preset);
        return;
      }
    } catch {
      // In browser preview, is_roblox_running is unhandled
    }

    setActiveMode(preset.id);

    try {
      await invoke("apply_skybox", { presetName: preset.id });
      if (preset.id === "Competitive_Pro") {
        await invoke("apply_pro_gear", { gear });
      } else {
        await invoke("apply_pro_gear", {
          gear: { crosshair: "default", sound: "default", font: "default" },
        });
      }
    } catch (err: any) {
      console.warn("Could not auto-apply mode on select:", err);
    }
  };

  const handleConfirmRestart = async () => {
    if (!restartPromptPreset) return;
    setIsRestarting(true);
    setErrorMessage(null);

    try {
      // 1. Force close running Roblox instance to free file locks
      await invoke("close_roblox");

      // 2. Apply chosen mode files/settings and pro gear
      await invoke("apply_skybox", { presetName: restartPromptPreset.id });
      if (restartPromptPreset.id === "Competitive_Pro") {
        await invoke("apply_pro_gear", { gear });
      } else {
        await invoke("apply_pro_gear", {
          gear: { crosshair: "default", sound: "default", font: "default" },
        });
      }
      setActiveMode(restartPromptPreset.id);

      // 3. Relaunch Roblox with the new settings active
      setLaunchStatus("launching");
      await invoke("launch_roblox");

      setRestartPromptPreset(null);
      setIsRestarting(false);
      setLaunchStatus("running");
      setTimeout(() => {
        setLaunchStatus("idle");
      }, 4000);
    } catch (err: any) {
      setIsRestarting(false);
      setRestartPromptPreset(null);
      setLaunchStatus("error");
      setErrorMessage(String(err));
    }
  };

  const launchRobloxMobileUnified = async (withOverlay: boolean) => {
    setLaunchStatus("launching");
    setErrorMessage(null);

    // 1. Start Android Hardware Overlay if requested
    if (withOverlay) {
      if (typeof window !== "undefined" && (window as any).ClutchAndroid?.startOverlay) {
        try {
          const started = (window as any).ClutchAndroid.startOverlay(
            gear.crosshair,
            androidConfig.crosshairScale,
            androidConfig.crosshairOpacity,
            androidConfig.highRefreshEnabled
          );
          if (!started) {
            // Permission not granted yet! Native code has opened the system overlay screen.
            setAndroidConfig((prev) => ({ ...prev, hasPermission: false }));
            setLaunchStatus("idle");
            return;
          }
        } catch (e) {
          console.warn("Native startOverlay notice:", e);
        }
      }
      const isTauriApp = typeof window !== "undefined" && Boolean((window as any).__TAURI_INTERNALS__);
      if (isTauriApp) {
        invoke("start_android_overlay", {
          gear: { crosshair: gear.crosshair, sound: gear.sound, font: gear.font },
        }).catch(() => {});
      }
      setAndroidConfig((prev) => ({ ...prev, isActive: true, hasPermission: true }));
    }

    // 2. Launch Roblox using Native Android Bridge (com.roblox.client Intent on UI thread)
    if (typeof window !== "undefined" && (window as any).ClutchAndroid?.launchRoblox) {
      try {
        const launched = (window as any).ClutchAndroid.launchRoblox();
        if (launched) {
          setLaunchStatus("running");
          setTimeout(() => setLaunchStatus("idle"), 4000);
          return;
        }
      } catch (err: any) {
        console.warn("Native launchRoblox error:", err);
      }
    }

    // 3. Tauri Rust invocation fallback
    const isTauriApp = typeof window !== "undefined" && Boolean((window as any).__TAURI_INTERNALS__);
    if (isTauriApp) {
      try {
        await invoke("launch_roblox_mobile");
      } catch (err: any) {
        console.warn("Tauri Android invoke notice:", err);
      }
    }

    // 4. Intent & deep link fallback for mobile browser / PWA
    try {
      window.location.href = "roblox://";
      setTimeout(() => {
        window.location.href = "intent://#Intent;scheme=roblox;package=com.roblox.client;end";
      }, 300);
    } catch (e) {
      console.warn("Deep link fallback:", e);
      window.location.href = "roblox://";
    }

    setLaunchStatus("running");
    setTimeout(() => {
      setLaunchStatus("idle");
    }, 4500);
  };

  const handleLaunchRoblox = async () => {
    setErrorMessage(null);

    // On mobile or when native Android bridge is detected, use the unified Android launcher
    if (platformMode === "android" || (typeof window !== "undefined" && (window as any).ClutchAndroid)) {
      await launchRobloxMobileUnified(false);
      return;
    }

    try {
      const isRunning = await invoke<boolean>("is_roblox_running");
      if (isRunning) {
        const current = PRESETS.find((p) => p.id === activeMode) || PRESETS[0];
        setRestartPromptPreset(current);
        return;
      }
    } catch {
      // Fallback in browser
    }

    setLaunchStatus("injecting");

    try {
      await invoke("apply_skybox", { presetName: activeMode });
      if (activeMode === "Competitive_Pro") {
        await invoke("apply_pro_gear", { gear });
      } else {
        await invoke("apply_pro_gear", {
          gear: { crosshair: "default", sound: "default", font: "default" },
        });
      }
      setLaunchStatus("launching");
      await invoke("launch_roblox");

      setLaunchStatus("running");
      setTimeout(() => {
        setLaunchStatus("idle");
      }, 4000);
    } catch (err: any) {
      setLaunchStatus("error");
      setErrorMessage(String(err));
    }
  };

  const handleStartAndLaunchAndroid = async () => {
    await launchRobloxMobileUnified(true);
  };

  const handleRequestOverlayPermission = () => {
    if (typeof window !== "undefined" && (window as any).ClutchAndroid?.requestOverlayPermission) {
      (window as any).ClutchAndroid.requestOverlayPermission();
      setTimeout(() => {
        if ((window as any).ClutchAndroid?.hasOverlayPermission) {
          const hasPerm = (window as any).ClutchAndroid.hasOverlayPermission();
          setAndroidConfig((prev) => ({ ...prev, hasPermission: hasPerm }));
        }
      }, 1500);
      return;
    }

    const isTauriApp = typeof window !== "undefined" && Boolean((window as any).__TAURI_INTERNALS__);
    if (isTauriApp) {
      try {
        invoke("request_overlay_permission");
        setAndroidConfig((prev) => ({ ...prev, hasPermission: true }));
      } catch (err: any) {
        console.warn("Could not request overlay permission:", err);
      }
    } else {
      alert("Floating overlay permissions are managed by the standalone Android APK. Tap 'Download APK' above to install the full native app!");
    }
  };

  // If on Launch Screen, render the pre-flight screen
  if (currentScreen === "launch") {
    return (
      <LaunchScreen
        onLaunchClutchBlox={() => setCurrentScreen("clutchblox")}
        onLaunchVantage={() => setCurrentScreen("99vantage")}
      />
    );
  }

  if (currentScreen === "99vantage") {
    return (
      <VantageScreen
        onBackToLaunch={() => setCurrentScreen("launch")}
        onPlayRoblox={handleLaunchRoblox}
      />
    );
  }

  const selectedPreset = PRESETS.find((p) => p.id === activeMode) || PRESETS[0];
  const competitivePreset = PRESETS.find((p) => p.id === "Competitive_Pro") || PRESETS[0];
  const defaultPreset = PRESETS.find((p) => p.id === "Default") || PRESETS[1];

  return (
    <div className="min-h-screen bg-surface-950 text-white flex flex-col justify-between p-6 max-w-4xl mx-auto font-body selection:bg-brand-500 selection:text-white">
      {/* Top Header with Platform Mode Switcher & Mobile Ready Status */}
      <Header
        detection={detection}
        platformMode={platformMode}
        onTogglePlatform={setPlatformMode}
        androidHasPermission={androidConfig.hasPermission}
        onRequestOverlayPermission={handleRequestOverlayPermission}
        onBackToLaunch={() => setCurrentScreen("launch")}
      />

      {/* Main Content Area */}
      <main className="flex-1 py-6 flex flex-col justify-center">
        {/* Error Alert Box */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-500/50 flex items-start gap-3 shadow-lg">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1 font-body">
              <p className="text-xs font-bold text-red-200 uppercase tracking-wide font-heading">
                Notice
              </p>
              <p className="text-xs text-neutral-300 mt-0.5">
                {errorMessage}
              </p>
            </div>
            <button 
              onClick={() => setErrorMessage(null)} 
              className="text-neutral-400 hover:text-white text-sm font-bold px-1"
            >
              ✕
            </button>
          </div>
        )}

        {/* Windows PC Mode Layout */}
        {platformMode === "windows" && (
          <div className="space-y-4">
            {/* 2-Card Layout: Competitive Gaming Pro & Stock Roblox */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-stretch">
              {competitivePreset && (
                <div className="flex">
                  <GameModeCard
                    preset={competitivePreset}
                    isSelected={activeMode === competitivePreset.id}
                    onSelect={() => handleSelectMode(competitivePreset)}
                    onOpenAllowedGames={() => setModalPreset(competitivePreset)}
                    isFeatured={true}
                  />
                </div>
              )}

              {defaultPreset && (
                <div className="flex">
                  <GameModeCard
                    preset={defaultPreset}
                    isSelected={activeMode === defaultPreset.id}
                    onSelect={() => handleSelectMode(defaultPreset)}
                    onOpenAllowedGames={() => setModalPreset(defaultPreset)}
                    isFeatured={false}
                  />
                </div>
              )}
            </div>

            {/* Pro Gear */}
            <ProGearRack
              gear={gear}
              onChange={handleGearChange}
              isUnlocked={activeMode === "Competitive_Pro"}
            />
          </div>
        )}

        {/* Android Mode Dedicated Esports Layout */}
        {platformMode === "android" && (
          <AndroidOverlayControls
            config={androidConfig}
            onChange={setAndroidConfig}
            selectedGear={gear}
            onGearChange={handleGearChange}
            launchStatus={launchStatus}
            onStartAndLaunch={handleStartAndLaunchAndroid}
            onLaunchWithoutOverlay={() => launchRobloxMobileUnified(false)}
            onRequestPermission={handleRequestOverlayPermission}
          />
        )}
      </main>

      {/* Clean Bottom Footer (Windows PC Mode Only) */}
      {platformMode === "windows" && (
        <Footer
          selectedPresetName={selectedPreset.name}
          isReady={detection.status === "found"}
          launchStatus={launchStatus}
          onLaunch={handleLaunchRoblox}
          serverRegion={hudState.serverRegion}
          pingMs={hudState.pingMs}
          retryAttempt={hudState.retryAttempt}
          maxRetries={hudState.maxRetries}
        />
      )}

      {/* 3D Horizontal Spin Flip Overlay Modal */}
      {modalPreset && (
        <AllowedGamesModal
          preset={modalPreset}
          onClose={() => setModalPreset(null)}
          onSelectAndClose={(id) => {
            const p = PRESETS.find((preset) => preset.id === id);
            setModalPreset(null);
            if (p) handleSelectMode(p);
          }}
        />
      )}

      {/* Restart Roblox Confirmation & Automated Relaunch Modal */}
      {restartPromptPreset && (
        <RestartRobloxModal
          preset={restartPromptPreset}
          isRestarting={isRestarting}
          onClose={() => {
            if (!isRestarting) setRestartPromptPreset(null);
          }}
          onConfirmRestart={handleConfirmRestart}
        />
      )}
    </div>
  );
}
