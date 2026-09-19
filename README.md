<div align="center">

# ⚡ ClutchBlox

**The Ultimate Competitive Roblox Client & Esports Gaming Assist**

[![Release](https://img.shields.io/badge/version-1.4.0-ff4b33.svg?style=for-the-badge)](CHANGELOG.md)
[![Platform](https://img.shields.io/badge/platform-Windows%20x64%20|%20Android%20arm64-00f0ff.svg?style=for-the-badge)](#-downloads)
[![Anti-Cheat](https://img.shields.io/badge/security-100%25%20Ban--Proof-00ff66.svg?style=for-the-badge)](SECURITY.md)
[![License](https://img.shields.io/badge/license-MIT-purple.svg?style=for-the-badge)](LICENSE)

*ClutchBlox is an ultra-lightweight, tournament-safe performance client built for competitive Roblox players across PC and mobile.*

[Downloads](#-downloads) • [PC Features](#-windows-pc-features) • [Android Features](#-android-tablet-features) • [Safety & Anti-Cheat](#-100-ban-proof-guarantee) • [FAQ](#-frequently-asked-questions)

</div>

---

## 🎮 Overview

Whether you are clutching in **Rivals**, dominating in **Arsenal**, or grinding **Bedwars**, ClutchBlox gives you the edge with pro-grade optimization:

* **Maximum Visibility**: Strips out distracting tall grass, stops blinding sun glare, and simplifies backgrounds for crystal-clear enemy tracking.
* **Ultra-Low Latency Engine**: Uncaps frame rates up to 240+ FPS and engages 0.5ms high-precision Windows hardware timer resolution.
* **Pro Gear Customizer**: Equip CS-style precision crosshairs, restore the legendary classic 2006 'OOF' death sound, and switch to retro or esports fonts.
* **Auto Low-Ping Server Routing**: Automatically measures server latency and re-queues you into the closest edge node (Dallas, Chicago, Ashburn, San Jose, Europe, APAC).
* **Android Tablet Assist**: Floating hardware crosshair with 100% touch pass-through (`FLAG_NOT_TOUCHABLE`) and 120Hz display touch booster.

---

## 📥 Downloads

| Platform | Package | Size | Description |
| :--- | :--- | :--- | :--- |
| **Windows 10/11 (64-bit)** | [**`ClutchBlox_1.4.0_x64-setup.exe`**](https://github.com/ClutchGameDev/ClutchBlox/releases/latest/download/ClutchBlox_1.4.0_x64-setup.exe) | **1.9 MB** | Standard Windows installer with auto-updates |
| **Windows 10/11 (Portable)** | [**`clutchblox.exe`**](https://github.com/ClutchGameDev/ClutchBlox/releases/latest/download/clutchblox.exe) | **8.4 MB** | Single standalone executable (no install required) |
| **Windows Enterprise** | [**`ClutchBlox_1.4.0_x64_en-US.msi`**](https://github.com/ClutchGameDev/ClutchBlox/releases/latest/download/ClutchBlox_1.4.0_x64_en-US.msi) | **2.8 MB** | MSI enterprise & silent deployment installer |
| **Android Tablets & Phones** | [**`ClutchBlox_1.4.0_Android_arm64.apk`**](https://github.com/ClutchGameDev/ClutchBlox/releases/latest/download/ClutchBlox_1.4.0_Android_arm64.apk) | **134 MB** | Native Android package with overlay service |
| **Any Device (PWA)** | Web App via Chrome / Safari | **Instant** | Add to Home Screen directly from your browser |

---

## 🖥️ Windows PC Features

### 1. Competitive Gaming Pro Mode
* **FPS Uncapped (240+ FPS)**: Removes Roblox's 60 FPS lock natively.
* **No Tall Grass**: Clears thick terrain grass so players can't hide behind cover.
* **Anti-Glare & Gray Sky**: Replaces cluttered sky graphics with clean high-contrast backgrounds.
* **Reduced Input Latency**: Engages `FFlagEnableReducedLatency` and 4x MSAA antialiasing.
* **P-Core Thread Affinity**: Assigns Roblox processes to high-performance CPU cores.
* **0.5ms High-Precision Timer**: Engages Win32 multimedia timer (`timeBeginPeriod`) for instantaneous mouse polling.

### 2. Pro Gear Customizer (1-Click Swap & Restore)
* **Aim Crosshairs**: Neon Green Dot, Cyan Cross (+), and Red Circle (○).
* **Death & Hit Sounds**: Classic 2006 'OOF', FPS Hitmarker, and Minecraft hit sound (with live audio preview button).
* **Game Text Fonts**: Old Roblox (classic 2006 cartoon font), Minecraft, and Esports D-DIN.
* **Factory Reset**: Tap **Stock Roblox** anytime to restore 100% of default Roblox files.

---

## 📱 Android Tablet Features

Because Android enforces strict security sandboxing around app folders, ClutchBlox provides the **Hardware Gaming Assist Engine**:

* **Precision Aim Overlay**: Centers a floating crosshair directly over Roblox Mobile.
* **100% Touch Pass-Through (`FLAG_NOT_TOUCHABLE`)**: Every touch, drag, and tap passes straight to Roblox with zero deadzones.
* **120Hz Display Touch Boost**: Requests your tablet screen's maximum refresh rate (90Hz / 120Hz) for instant touch aiming response.
* **Server Ping Radar**: Live floating HUD badge displaying your current server ping and region.

---

## 🛡️ 100% Ban-Proof Guarantee

ClutchBlox is strictly built to comply with Roblox anti-cheat systems (including Byfron / Hyperion):

* **NO DLL Injection**: ClutchBlox never injects code or hooks into Roblox memory.
* **NO Cheat Exploits**: No wallhacks, no aimbots, no memory manipulation.
* **Official FastFlags**: Graphic and performance tweaks use Roblox's native `ClientAppSettings.json` engine.
* **Standard Android OS APIs**: Android assist operates via standard `SYSTEM_ALERT_WINDOW` permissions (the exact same system used by Discord and Samsung Game Booster).

*For complete technical security details, see [SECURITY.md](SECURITY.md).*

---

## 🚀 Quick-Start Guide

### Windows PC:
1. Download and run [**`ClutchBlox_1.4.0_x64-setup.exe`**](https://github.com/ClutchGameDev/ClutchBlox/releases/latest/download/ClutchBlox_1.4.0_x64-setup.exe).
2. Select **Competitive Gaming Pro** (or customize your crosshair, sound, and font under **Step 2**).
3. Click **LAUNCH ROBLOX & ACTIVATE BOOSTS**.

### Android Tablet:
1. Download [**`ClutchBlox_1.4.0_Android_arm64.apk`**](https://github.com/ClutchGameDev/ClutchBlox/releases/latest/download/ClutchBlox_1.4.0_Android_arm64.apk) onto your tablet.
2. Tap the downloaded file to install (allow unknown apps if prompted).
3. Open ClutchBlox, switch to **[ 📱 Android ]** in the header, and tap **START OVERLAY & PLAY ROBLOX**.

---

## 🛠️ Tech Stack

* **Frontend**: React 18, TypeScript, TailwindCSS, Vite
* **Desktop Core**: Tauri v2, Rust (Win32 low-latency APIs)
* **Mobile Core**: Kotlin, Android `SYSTEM_ALERT_WINDOW`, Android NDK (ARM64)
* **Design Tokens**: `#ff4b33` (Brand Accent), `#090d16` (Deep Cyberpunk Dark Mode)

---

## ❓ Frequently Asked Questions

**Q: Can I get banned for using ClutchBlox?**  
**A:** No. ClutchBlox does not touch game memory or inject DLLs. It uses Roblox's own built-in FastFlag engine on PC and standard Android overlay tools on mobile.

**Q: How do I switch back to normal Roblox?**  
**A:** Simply open ClutchBlox and click **Stock Roblox**. It will restore default grass, regular skies, default sounds, and original fonts instantly.

**Q: How does the auto-server routing work?**  
**A:** ClutchBlox monitors your local connection to the Roblox server. If your ping is higher than 90ms, it automatically re-routes you to a closer server (up to 3 times) to ensure you play on the fastest server found.

---

## ⚖️ Legal & Disclaimer

ClutchBlox is an independent community project and is **not affiliated with, authorized by, or endorsed by Roblox Corporation**. See [DISCLAIMER.md](DISCLAIMER.md) for full trademark notices.

Licensed under the [MIT License](LICENSE).
