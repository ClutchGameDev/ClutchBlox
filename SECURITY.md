# Security & Anti-Cheat Policy

## Supported Versions

| Version | Supported          | Platform            |
| ------- | ------------------ | ------------------- |
| 1.4.x   | :white_check_mark: | Windows x64 / Android arm64 |
| < 1.4   | :x:                | Deprecated          |

---

## The Ban-Proof Architecture

ClutchBlox is architected from the ground up to ensure 100% account safety, ban prevention, and zero conflicts with anti-cheat software (such as Roblox Byfron / Hyperion).

### 🖥️ Windows Architecture
* **No Process Memory Injection**: Unlike cheat tools or memory injectors, ClutchBlox never opens `RobloxPlayerBeta.exe` with `PROCESS_VM_WRITE` or `PROCESS_VM_OPERATION`.
* **Zero Hooking**: No DirectX or Vulkan DLL hooks are placed in memory.
* **Native FastFlags**: Performance optimizations (FPS uncap, reduced input delay, grass distance reduction) are configured strictly through Roblox's native `ClientSettings/ClientAppSettings.json` file format, which Roblox reads officially at startup.
* **Safe In-Place Assets**: Cursor, sound, and font adjustments are standard local asset overrides that can be reverted to factory defaults with a single click.

### 📱 Android Architecture
* **Sandboxed Isolation**: Android enforces strict SELinux application sandboxing. ClutchBlox respects this boundary and **never** attempts to read, write, or tamper with `/data/data/com.roblox.client/`.
* **Hardware-Accelerated Overlay**: The mobile crosshair HUD operates via Android's native `SYSTEM_ALERT_WINDOW` service with the `FLAG_NOT_TOUCHABLE` window flag. 
* **Zero Touch Deadzones**: 100% of touches pass directly through the overlay to Roblox Mobile.
* **High Refresh Rate API**: Utilizes Android's official `WindowManager.LayoutParams.preferredDisplayModeId` to request 90Hz/120Hz display modes without modifying game binaries.

---

## Reporting a Vulnerability

If you discover a security vulnerability or anti-cheat conflict in ClutchBlox:
1. Please **do NOT** open a public issue on GitHub.
2. Send a private report to the security maintainers or open a private GitHub Security Advisory.
3. We will review and publish a fix within 24 to 48 hours.
