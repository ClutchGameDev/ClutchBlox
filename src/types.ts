export interface GameModePreset {
  id: string;
  name: string;
  simpleDescription: string;
  colorHex: string;
  iconType: "sun" | "moon" | "stars" | "sunset" | "crosshair";
  whatItDoes: string;
  allowedGames: string[];
  extendedFeatures?: { title: string; description: string }[];
}

export type SkyboxPreset = GameModePreset;

export interface RobloxDetection {
  status: "idle" | "detecting" | "found" | "not_found" | "error";
  path: string | null;
  versionHash: string | null;
  errorMessage: string | null;
}

export type LaunchStatus = "idle" | "injecting" | "launching" | "running" | "error";

export interface EsportsHudState {
  active: boolean;
  gameTitle: string | null;
  placeId: string | null;
  serverRegion: string | null;
  pingMs: number | null;
  pCoreOptimized: boolean;
  timerResolution: string;
  profileMode: "Competitive" | "Visual" | "Standby";
  retryAttempt: number;
  maxRetries: number;
  statusText: string;
}

export interface ProGearSelection {
  crosshair: "default" | "green_dot" | "cyan_cross" | "red_circle";
  sound: "default" | "classic_oof" | "hitmarker" | "minecraft";
  font: "default" | "old_roblox" | "minecraft" | "esports";
}

export interface AndroidOverlayConfig {
  hasPermission: boolean;
  isActive: boolean;
  crosshairScale: number;
  crosshairOpacity: number;
  highRefreshEnabled: boolean;
  radarVisible: boolean;
}

export interface VantageConfig {
  trueSightEnabled: boolean;
  fov: number;
  dayDurationSeconds: number;
  nightDurationSeconds: number;
  currentNight: number;
  duskWarningAudio: boolean;
  quickKeySlotMap: Record<string, number>;
}



