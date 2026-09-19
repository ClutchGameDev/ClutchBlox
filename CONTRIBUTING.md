# Contributing to ClutchBlox

Thank you for your interest in contributing to **ClutchBlox**! We welcome contributions from developers, competitive players, and community members.

---

## 🛠️ Development Setup

### Prerequisites
* **Node.js**: v18 or newer
* **Rust**: 1.77+ (`rustup default stable-x86_64-pc-windows-msvc`)
* **Java**: OpenJDK 17 (for Android builds)
* **Android SDK**: Build-Tools 34+, Platform 34+

### Quick Start
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/clutchblox.git
   cd clutchblox
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Run the development environment:
   ```bash
   npm run dev
   ```
4. Or run with the native desktop wrapper:
   ```bash
   npm run tauri dev
   ```

---

## 📁 Repository Structure

```text
├── src/                      # React 18 + TypeScript Frontend
│   ├── components/           # UI Components (Header, GameModeCard, ProGearModal, AndroidOverlayControls)
│   ├── types.ts              # Global TypeScript interfaces
│   └── presets.ts            # FastFlag presets & shooter game IDs
├── src-tauri/                # Tauri 2 Native Rust Core
│   ├── src/lib.rs            # Desktop commands, log monitoring, latency engine
│   ├── assets/               # Bundled crosshairs, sounds, and fonts
│   └── gen/android/          # Generated Android Studio Gradle project
│       └── app/src/main/     # Kotlin Overlay Service & AndroidManifest.xml
├── public/                   # PWA manifest, favicons, and mobile assets
└── package.json              # Vite & React dependencies
```

---

## 🎯 How You Can Help

1. **Add Supported Competitive Games**: Add verified Place IDs into `COMPETITIVE_SHOOTERS` in [src-tauri/src/lib.rs](file:///c:/DEV/SkyBlox/src-tauri/src/lib.rs) and [src/presets.ts](file:///c:/DEV/SkyBlox/src/presets.ts).
2. **Add Precision Crosshairs**: Add new high-visibility crosshair SVGs/PNGs into `src-tauri/assets/cursors/` and canvas drawing routines in `ClutchOverlayService.kt`.
3. **Expand Server IP Ranges**: Improve regional mapping in `resolve_roblox_server_region()` to cover more global edge nodes.

---

## 📜 Pull Request Guidelines
- Ensure `npm run build` passes with zero TypeScript or Vite errors.
- Keep the user interface clean, high-contrast, and kid-friendly (5th-grade reading level).
- Strictly adhere to our [Security Policy](SECURITY.md) (no memory injection, no cheat exploits).
