# Changelog

All notable changes to **ClutchBlox** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.4.1] - 2026-09-19

### ⚡ Fixed
- **Windows Console Shell Glitch**: Replaced repeated subprocess `tasklist` spawning with zero-subprocess in-memory Win32 process snapshotting (`CreateToolhelp32Snapshot`). Completely eliminates flashing command prompt windows on Windows.
- **Android Play Roblox Inactivity**: Added native `ClutchAndroidBridge` in `MainActivity.kt` with explicit Intent dispatch for `com.roblox.client` and fallback Google Play Store redirection.
- **Android Floating Overlay Control**: Connected mobile assist UI directly to `ClutchOverlayService` foreground service and overlay permission manager.

## [1.4.0] - 2026-09-05

### 🚀 Added
- **Android Platform Support**:
  - Full-screen standalone PWA installation via modern mobile browsers.
  - Native Android ARM64 package (`ClutchBlox_1.4.0_Android_arm64.apk`).
  - Native `ClutchOverlayService.kt` utilizing `SYSTEM_ALERT_WINDOW` with `FLAG_NOT_TOUCHABLE` for zero touch deadzones over Roblox Mobile.
  - Hardware 120Hz display refresh rate assist requesting maximum touch polling rate.
- **Pro Gear Customization Suite**:
  - **Precision Crosshairs**: Neon Green Dot, Cyan Cross (+), and Red Circle (○).
  - **Hit & Death Sounds**: Classic 2006 'OOF', FPS Hitmarker, and Minecraft hit sound with built-in audio test previews.
  - **Game Fonts**: Old Roblox (2006 cartoon lettering), Minecraft, and Esports D-DIN.
- **Dual Platform Header Switcher**: Seamless 1-click toggle between `[ 💻 PC ]` and `[ 📱 Android ]` control layouts.
- **One-Click APK Download**: Direct download button embedded in the mobile interface.

### ⚡ Optimized
- **Ultra-Lightweight Windows Bundle**:
  - Purged 50+ MB of legacy sky textures and prototype scripts.
  - Reduced Windows installer size from 15.0 MB down to **1.9 MB** (`ClutchBlox_1.4.0_x64-setup.exe`).
- **Dynamic Server Telemetry**: Standby badge updated to `"Auto (Fastest Server)"` with live ping indicators.

---

## [1.3.0] - 2026-09-03

### 🚀 Added
- **Dynamic Server Location Rerouting**:
  - Automatically identifies Roblox server regions across US Central (Dallas, TX / Chicago, IL), US East (Ashburn, VA), US West (San Jose, CA), Europe (Frankfurt), and APAC (Singapore).
  - Auto-reroutes high-ping connections (>90ms) up to 3 times to lock the closest low-latency match.

---

## [1.2.0] - 2026-09-02

### 🚀 Added
- **Esports HUD Telemetry**: Live ping measurement, real-time Place ID detection, and automated profile switching between competitive shooters (Rivals, Arsenal, Bedwars) and casual experiences.
- **Windows Latency Engine**: Process priority boost (`HIGH_PRIORITY_CLASS`), Intel/AMD P-core thread affinity, and 0.5ms high-precision Windows timer resolution (`timeBeginPeriod`).

---

## [1.1.0] - 2026-09-01

### 🚀 Added
- Two-tier mode architecture: **Competitive Gaming Pro** (maximum visibility, zero tall grass, FPS uncap) vs. **Stock Roblox** (factory reset).
- FastFlag JSON generator writing to multiple `ClientSettings` directories across Roblox version trees.

---

## [1.0.0] - 2026-08-30

### 🚀 Initial Release
- Core client launcher with dark-mode cyberpunk UI.
- Direct Roblox process detection and launch management.
