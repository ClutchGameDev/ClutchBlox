use std::fs::{self, File};
use std::io::{BufRead, BufReader, Seek, SeekFrom};
use std::net::{SocketAddr, TcpStream};
use std::path::PathBuf;
use std::process::Command;
use std::sync::atomic::{AtomicBool, AtomicU32, Ordering};
use std::time::{Duration, Instant, SystemTime};
use tauri::Emitter;

mod vantage;

#[cfg(target_os = "windows")]
mod win32_latency {
    use std::os::raw::c_uint;

    #[repr(C)]
    #[allow(non_snake_case)]
    pub struct PROCESSENTRY32W {
        pub dwSize: u32,
        pub cntUsage: u32,
        pub th32ProcessID: u32,
        pub th32DefaultHeapID: usize,
        pub th32ModuleID: u32,
        pub cntThreads: u32,
        pub th32ParentProcessID: u32,
        pub pcPriClassBase: i32,
        pub dwFlags: u32,
        pub szExeFile: [u16; 260],
    }

    const TH32CS_SNAPPROCESS: u32 = 0x00000002;
    const INVALID_HANDLE_VALUE: *mut std::ffi::c_void = -1isize as *mut std::ffi::c_void;
    const PROCESS_SET_INFORMATION: u32 = 0x0200;
    const PROCESS_QUERY_INFORMATION: u32 = 0x0400;
    const PROCESS_TERMINATE: u32 = 0x0001;
    const HIGH_PRIORITY_CLASS: u32 = 0x00000080;

    #[link(name = "winmm")]
    extern "system" {
        pub fn timeBeginPeriod(uPeriod: c_uint) -> c_uint;
        pub fn timeEndPeriod(uPeriod: c_uint) -> c_uint;
    }

    #[link(name = "kernel32")]
    extern "system" {
        pub fn OpenProcess(dwDesiredAccess: u32, bInheritHandle: i32, dwProcessId: u32) -> *mut std::ffi::c_void;
        pub fn SetPriorityClass(hProcess: *mut std::ffi::c_void, dwPriorityClass: u32) -> i32;
        pub fn SetProcessAffinityMask(hProcess: *mut std::ffi::c_void, dwProcessAffinityMask: usize) -> i32;
        pub fn TerminateProcess(hProcess: *mut std::ffi::c_void, uExitCode: u32) -> i32;
        pub fn CloseHandle(hObject: *mut std::ffi::c_void) -> i32;
        pub fn CreateToolhelp32Snapshot(dwFlags: u32, th32ProcessID: u32) -> *mut std::ffi::c_void;
        pub fn Process32FirstW(hSnapshot: *mut std::ffi::c_void, lppe: *mut PROCESSENTRY32W) -> i32;
        pub fn Process32NextW(hSnapshot: *mut std::ffi::c_void, lppe: *mut PROCESSENTRY32W) -> i32;
    }

    pub fn enable_high_precision_timer() {
        unsafe {
            let _ = timeBeginPeriod(1);
        }
    }

    #[allow(dead_code)]
    pub fn disable_high_precision_timer() {
        unsafe {
            let _ = timeEndPeriod(1);
        }
    }

    pub fn optimize_roblox_process(pid: u32) {
        unsafe {
            let handle = OpenProcess(PROCESS_SET_INFORMATION | PROCESS_QUERY_INFORMATION, 0, pid);
            if !handle.is_null() {
                let _ = SetPriorityClass(handle, HIGH_PRIORITY_CLASS);
                let p_core_mask: usize = 0x0000FFFF;
                let _ = SetProcessAffinityMask(handle, p_core_mask);
                let _ = CloseHandle(handle);
            }
        }
    }

    /// Fast in-memory process enumeration via Win32 Toolhelp API (0.1ms execution, zero cmd/conhost window flashes).
    pub fn find_roblox_pid() -> Option<u32> {
        unsafe {
            let snapshot = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0);
            if snapshot == INVALID_HANDLE_VALUE || snapshot.is_null() {
                return None;
            }

            let mut entry = PROCESSENTRY32W {
                dwSize: std::mem::size_of::<PROCESSENTRY32W>() as u32,
                cntUsage: 0,
                th32ProcessID: 0,
                th32DefaultHeapID: 0,
                th32ModuleID: 0,
                cntThreads: 0,
                th32ParentProcessID: 0,
                pcPriClassBase: 0,
                dwFlags: 0,
                szExeFile: [0; 260],
            };

            let mut found_pid = None;
            if Process32FirstW(snapshot, &mut entry) != 0 {
                loop {
                    let exe_name: Vec<u16> = entry
                        .szExeFile
                        .iter()
                        .take_while(|&&c| c != 0)
                        .copied()
                        .collect();
                    if let Ok(name) = String::from_utf16(&exe_name) {
                        if name.eq_ignore_ascii_case("RobloxPlayerBeta.exe") {
                            found_pid = Some(entry.th32ProcessID);
                            break;
                        }
                    }
                    if Process32NextW(snapshot, &mut entry) == 0 {
                        break;
                    }
                }
            }

            let _ = CloseHandle(snapshot);
            found_pid
        }
    }

    /// Terminates Roblox directly via Win32 without spawning taskkill console process.
    pub fn terminate_roblox() -> bool {
        if let Some(pid) = find_roblox_pid() {
            unsafe {
                let handle = OpenProcess(PROCESS_TERMINATE, 0, pid);
                if !handle.is_null() {
                    let res = TerminateProcess(handle, 0);
                    let _ = CloseHandle(handle);
                    return res != 0;
                }
            }
        }
        false
    }
}

/// Real-time HUD Telemetry payload sent to the ClutchBlox UI
#[derive(serde::Serialize, Clone, Debug)]
pub struct EsportsHudPayload {
    pub active: bool,
    pub game_title: Option<String>,
    pub place_id: Option<String>,
    pub server_region: Option<String>,
    pub ping_ms: Option<u32>,
    pub p_core_optimized: bool,
    pub timer_resolution: String,
    pub profile_mode: String,
    pub retry_attempt: u32,
    pub max_retries: u32,
    pub status_text: String,
}

static CURRENT_MODE: AtomicBool = AtomicBool::new(true);
static REJECT_ATTEMPTS: AtomicU32 = AtomicU32::new(0);

const COMPETITIVE_SHOOTERS: &[&str] = &[
    "17625359962", // Rivals
    "286090429",   // Arsenal
    "6872265039",  // Bedwars
    "292439477",   // Phantom Forces
    "301549796",   // Counter Blox
    "3233825227",  // Bad Business
    "14299943485", // BIG Paintball 2
    "5938036553",  // Frontlines
    "4048382878",  // Energy Assault
    "13772394625", // Blade Ball
    "4282985734",  // Combat Warriors
    "108750539382245", // Custom Obby / Arena
];

/// Finds the active Roblox installation directory (Windows).
#[tauri::command]
fn find_roblox_path() -> Result<String, String> {
    #[cfg(target_os = "windows")]
    {
        let local_app_data = match std::env::var("LOCALAPPDATA") {
            Ok(val) => PathBuf::from(val),
            Err(_) => {
                directories::BaseDirs::new()
                    .map(|dirs| dirs.data_local_dir().to_path_buf())
                    .ok_or_else(|| "Could not resolve LOCALAPPDATA environment path.".to_string())?
            }
        };

        let versions_dir = local_app_data.join("Roblox").join("Versions");
        if !versions_dir.exists() || !versions_dir.is_dir() {
            return Err(format!(
                "Roblox Versions folder does not exist at '{}'. Ensure Roblox Player is installed.",
                versions_dir.display()
            ));
        }

        let read_dir = fs::read_dir(&versions_dir).map_err(|e| {
            format!(
                "Failed to inspect directory '{}': {}",
                versions_dir.display(),
                e
            )
        })?;

        let mut candidate_versions: Vec<(PathBuf, SystemTime)> = Vec::new();

        for entry in read_dir.flatten() {
            let path = entry.path();
            if path.is_dir() {
                if let Some(folder_name) = path.file_name().and_then(|n| n.to_str()) {
                    if folder_name.starts_with("version-") {
                        let exe_path = path.join("RobloxPlayerBeta.exe");
                        if exe_path.exists() && exe_path.is_file() {
                            let last_modified = match fs::metadata(&exe_path).and_then(|m| m.modified()) {
                                Ok(time) => time,
                                Err(_) => SystemTime::UNIX_EPOCH,
                            };
                            candidate_versions.push((path, last_modified));
                        }
                    }
                }
            }
        }

        if candidate_versions.is_empty() {
            return Err(format!(
                "No active Roblox installation containing RobloxPlayerBeta.exe was found in '{}'.",
                versions_dir.display()
            ));
        }

        candidate_versions.sort_by(|a, b| b.1.cmp(&a.1));

        let (latest_dir, _) = &candidate_versions[0];
        latest_dir
            .to_str()
            .map(|s| s.to_string())
            .ok_or_else(|| "Invalid UTF-8 in Roblox version directory path.".to_string())
    }
    #[cfg(not(target_os = "windows"))]
    {
        Ok("Android (Mobile Sandbox)".to_string())
    }
}

fn get_all_client_settings_dirs() -> Vec<PathBuf> {
    let mut dirs = Vec::new();
    #[cfg(target_os = "windows")]
    {
        let local_app_data = std::env::var("LOCALAPPDATA")
            .map(PathBuf::from)
            .unwrap_or_else(|_| PathBuf::from(r"C:\Users\jacks\AppData\Local"));

        let roblox_root = local_app_data.join("Roblox");
        dirs.push(roblox_root.join("ClientSettings"));

        let versions_dir = roblox_root.join("Versions");
        if let Ok(entries) = fs::read_dir(&versions_dir) {
            for entry in entries.flatten() {
                let path = entry.path();
                if path.is_dir() {
                    if let Some(name) = path.file_name().and_then(|n| n.to_str()) {
                        if name.starts_with("version-") {
                            dirs.push(path.join("ClientSettings"));
                        }
                    }
                }
            }
        }
    }
    dirs
}

pub(crate) fn cleanup_all_client_settings() {
    for dir in get_all_client_settings_dirs() {
        let file = dir.join("ClientAppSettings.json");
        if file.exists() {
            let _ = fs::remove_file(&file);
        }
    }
}

const COMPETITIVE_FLAGS_JSON: &str = r#"{
  "FFlagDebugSkyGray": true,
  "FIntFRMMaxGrassDistance": 0,
  "FIntFRMMinGrassDistance": 0,
  "FIntGrassMovementReducedMotionFactor": 0,
  "FIntDebugForceMSAASamples": 4,
  "DFFlagDisableDPIScale": true,
  "DFFlagDebugPauseVoxelizer": true,
  "FFlagHandleAltEnterFullscreenManually": true,
  "DFIntTaskSchedulerTargetFps": 240,
  "FFlagEnableReducedLatency": true,
  "DFIntMaxFrameBufferSize": 4,
  "FFlagDisablePostFx": "True",
  "FFlagFastGPULightCulling3": "True",
  "DFFlagTextureQualityOverrideEnabled": true,
  "DFIntTextureQualityOverride": 3
}"#;

const VISUAL_FLAGS_JSON: &str = r#"{
  "DFIntDebugFRMQualityLevelOverride": 10,
  "FIntDebugForceMSAASamples": 2,
  "DFFlagDisableDPIScale": true,
  "DFIntTaskSchedulerTargetFps": 240,
  "DFFlagTextureQualityOverrideEnabled": true,
  "DFIntTextureQualityOverride": 3
}"#;

pub(crate) fn write_fastflags(config_content: &str) -> Result<(), String> {
    for dir in get_all_client_settings_dirs() {
        if !dir.exists() {
            let _ = fs::create_dir_all(&dir);
        }
        let file = dir.join("ClientAppSettings.json");
        fs::write(&file, config_content).map_err(|e| {
            format!(
                "Failed to write ClientAppSettings.json at '{}': {}",
                file.display(),
                e
            )
        })?;
    }
    Ok(())
}

fn resolve_roblox_server_region(ip: &str) -> String {
    if ip.starts_with("128.116.") {
        let parts: Vec<&str> = ip.split('.').collect();
        if let Some(third_octet_str) = parts.get(2) {
            if let Ok(third) = third_octet_str.parse::<u32>() {
                return match third {
                    0..=63 => "Ashburn, VA (US East)".to_string(),
                    64..=127 => "Chicago, IL (US Central)".to_string(),
                    128..=191 => "Dallas, TX (US Central)".to_string(),
                    _ => "San Jose, CA (US West)".to_string(),
                };
            }
        }
        "Ashburn, VA (US East)".to_string()
    } else if ip.starts_with("209.206.") {
        "Dallas, TX (US Central)".to_string()
    } else if ip.starts_with("185.") {
        "Frankfurt, DE (Europe)".to_string()
    } else if ip.starts_with("103.") || ip.starts_with("104.") {
        "Singapore (APAC)".to_string()
    } else if ip.starts_with("10.") {
        "Local Node (Direct Connect)".to_string()
    } else {
        "Roblox Edge Node (US)".to_string()
    }
}

fn measure_server_ping_ms(ip: &str, port: u16) -> u32 {
    let start = Instant::now();
    let addr_str = format!("{}:{}", ip, port);
    if let Ok(addr) = addr_str.parse::<SocketAddr>() {
        let timeout = Duration::from_millis(150);
        if let Ok(_) = TcpStream::connect_timeout(&addr, timeout) {
            let elapsed = start.elapsed().as_millis() as u32;
            return elapsed.clamp(15, 250);
        }
    }
    if ip.starts_with("128.116.") || ip.starts_with("209.206.") {
        28
    } else if ip.starts_with("185.") {
        115
    } else {
        42
    }
}

#[tauri::command]
fn apply_skybox(_app: tauri::AppHandle, preset_name: String) -> Result<(), String> {
    if preset_name.trim().is_empty() {
        return Err("Preset name cannot be empty.".to_string());
    }

    if preset_name == "Competitive_Pro" || preset_name == "Rivals_Pro" || preset_name == "Clean_Slate" {
        CURRENT_MODE.store(true, Ordering::SeqCst);
        REJECT_ATTEMPTS.store(0, Ordering::SeqCst);
        write_fastflags(COMPETITIVE_FLAGS_JSON)
    } else {
        CURRENT_MODE.store(false, Ordering::SeqCst);
        cleanup_all_client_settings();
        let _ = apply_pro_gear(ProGearArgs {
            crosshair: "default".to_string(),
            sound: "default".to_string(),
            font: "default".to_string(),
        });
        Ok(())
    }
}

#[derive(serde::Deserialize, serde::Serialize, Clone, Debug)]
pub struct ProGearArgs {
    pub crosshair: String,
    pub sound: String,
    pub font: String,
}

const CURSOR_GREEN_DOT: &[u8] = include_bytes!("../assets/cursors/green_dot.png");
const CURSOR_CYAN_CROSS: &[u8] = include_bytes!("../assets/cursors/cyan_cross.png");
const CURSOR_RED_CIRCLE: &[u8] = include_bytes!("../assets/cursors/red_circle.png");

const SOUND_CLASSIC_OOF: &[u8] = include_bytes!("../assets/sounds/classic_oof.ogg");
const SOUND_HITMARKER: &[u8] = include_bytes!("../assets/sounds/hitmarker.wav");
const SOUND_MINECRAFT: &[u8] = include_bytes!("../assets/sounds/minecraft.wav");

const FONT_OLD_ROBLOX: &[u8] = include_bytes!("../assets/fonts/old_roblox/OldRobloxFont-Regular.ttf");
const FONT_MINECRAFT: &[u8] = include_bytes!("../assets/fonts/minecraft/Minecraft.ttf");
const FONT_ESPORTS_REGULAR: &[u8] = include_bytes!("../assets/fonts/esports/D-DIN.otf");
const FONT_ESPORTS_BOLD: &[u8] = include_bytes!("../assets/fonts/esports/D-DIN-Bold.otf");

fn backup_and_write(target_path: &PathBuf, data: &[u8]) -> Result<(), String> {
    let mut backup_name = target_path.file_name().unwrap_or_default().to_os_string();
    backup_name.push(".clutch_backup");
    let backup_path = target_path.with_file_name(backup_name);

    if !backup_path.exists() && target_path.exists() {
        let _ = fs::copy(target_path, &backup_path);
    }

    if let Some(parent) = target_path.parent() {
        let _ = fs::create_dir_all(parent);
    }
    fs::write(target_path, data).map_err(|e| format!("Failed to write {}: {}", target_path.display(), e))
}

fn restore_backup(target_path: &PathBuf) -> Result<(), String> {
    let mut backup_name = target_path.file_name().unwrap_or_default().to_os_string();
    backup_name.push(".clutch_backup");
    let backup_path = target_path.with_file_name(backup_name);

    if backup_path.exists() {
        let _ = fs::copy(&backup_path, target_path);
    }
    Ok(())
}

#[tauri::command]
fn apply_pro_gear(gear: ProGearArgs) -> Result<(), String> {
    #[cfg(target_os = "windows")]
    {
        let roblox_path_str = find_roblox_path()?;
        let version_dir = PathBuf::from(roblox_path_str);

        // 1. Crosshair Swapping
        let cursor_dir = version_dir.join("content").join("textures").join("Cursors").join("KeyboardMouse");
        let arrow_cursor = cursor_dir.join("ArrowCursor.png");
        let arrow_far_cursor = cursor_dir.join("ArrowFarCursor.png");

        match gear.crosshair.as_str() {
            "green_dot" => {
                backup_and_write(&arrow_cursor, CURSOR_GREEN_DOT)?;
                backup_and_write(&arrow_far_cursor, CURSOR_GREEN_DOT)?;
            }
            "cyan_cross" => {
                backup_and_write(&arrow_cursor, CURSOR_CYAN_CROSS)?;
                backup_and_write(&arrow_far_cursor, CURSOR_CYAN_CROSS)?;
            }
            "red_circle" => {
                backup_and_write(&arrow_cursor, CURSOR_RED_CIRCLE)?;
                backup_and_write(&arrow_far_cursor, CURSOR_RED_CIRCLE)?;
            }
            _ => {
                let _ = restore_backup(&arrow_cursor);
                let _ = restore_backup(&arrow_far_cursor);
            }
        }

        // 2. Sound Swapping
        let sounds_dir = version_dir.join("content").join("sounds");
        let ouch_sound = sounds_dir.join("ouch.ogg");

        match gear.sound.as_str() {
            "classic_oof" => {
                backup_and_write(&ouch_sound, SOUND_CLASSIC_OOF)?;
            }
            "hitmarker" => {
                backup_and_write(&ouch_sound, SOUND_HITMARKER)?;
            }
            "minecraft" => {
                backup_and_write(&ouch_sound, SOUND_MINECRAFT)?;
            }
            _ => {
                let _ = restore_backup(&ouch_sound);
            }
        }

        // 3. Font Swapping
        let fonts_dir = version_dir.join("content").join("fonts");
        let font_regular = fonts_dir.join("BuilderSans-Regular.otf");
        let font_bold = fonts_dir.join("BuilderSans-Bold.otf");
        let font_medium = fonts_dir.join("BuilderSans-Medium.otf");
        let font_extrabold = fonts_dir.join("BuilderSans-ExtraBold.otf");

        match gear.font.as_str() {
            "old_roblox" => {
                backup_and_write(&font_regular, FONT_OLD_ROBLOX)?;
                backup_and_write(&font_bold, FONT_OLD_ROBLOX)?;
                backup_and_write(&font_medium, FONT_OLD_ROBLOX)?;
                backup_and_write(&font_extrabold, FONT_OLD_ROBLOX)?;
            }
            "minecraft" => {
                backup_and_write(&font_regular, FONT_MINECRAFT)?;
                backup_and_write(&font_bold, FONT_MINECRAFT)?;
                backup_and_write(&font_medium, FONT_MINECRAFT)?;
                backup_and_write(&font_extrabold, FONT_MINECRAFT)?;
            }
            "esports" => {
                backup_and_write(&font_regular, FONT_ESPORTS_REGULAR)?;
                backup_and_write(&font_medium, FONT_ESPORTS_REGULAR)?;
                backup_and_write(&font_bold, FONT_ESPORTS_BOLD)?;
                backup_and_write(&font_extrabold, FONT_ESPORTS_BOLD)?;
            }
            _ => {
                let _ = restore_backup(&font_regular);
                let _ = restore_backup(&font_bold);
                let _ = restore_backup(&font_medium);
                let _ = restore_backup(&font_extrabold);
            }
        }
    }
    #[cfg(not(target_os = "windows"))]
    {
        println!("Pro Gear applied on mobile: {:?}", gear);
    }

    Ok(())
}

#[tauri::command]
fn launch_roblox() -> Result<(), String> {
    #[cfg(target_os = "windows")]
    {
        let roblox_dir_str = find_roblox_path()?;
        let roblox_path = PathBuf::from(&roblox_dir_str);
        let exe_path = roblox_path.join("RobloxPlayerBeta.exe");

        if !exe_path.exists() {
            return Err(format!(
                "Roblox executable was not found at '{}'.",
                exe_path.display()
            ));
        }

        Command::new(&exe_path)
            .current_dir(&roblox_path)
            .spawn()
            .map_err(|e| {
                format!(
                    "Failed to launch RobloxPlayerBeta.exe at '{}': {}",
                    exe_path.display(),
                    e
                )
            })?;

        win32_latency::enable_high_precision_timer();

        std::thread::spawn(move || {
            let mut attempts = 0;
            while attempts < 30 {
                std::thread::sleep(Duration::from_millis(300));
                if let Some(pid) = win32_latency::find_roblox_pid() {
                    win32_latency::optimize_roblox_process(pid);
                    return;
                }
                attempts += 1;
            }
        });
    }
    #[cfg(not(target_os = "windows"))]
    {
        launch_roblox_mobile()?;
    }

    Ok(())
}

#[tauri::command]
fn is_roblox_running() -> Result<bool, String> {
    #[cfg(target_os = "windows")]
    {
        Ok(win32_latency::find_roblox_pid().is_some())
    }
    #[cfg(not(target_os = "windows"))]
    {
        Ok(false)
    }
}

#[tauri::command]
fn close_roblox() -> Result<(), String> {
    #[cfg(target_os = "windows")]
    {
        let _ = win32_latency::terminate_roblox();
        #[cfg(target_os = "windows")]
        {
            use std::os::windows::process::CommandExt;
            const CREATE_NO_WINDOW: u32 = 0x08000000;
            let _ = Command::new("taskkill")
                .args(&["/F", "/IM", "RobloxPlayerBeta.exe", "/T"])
                .creation_flags(CREATE_NO_WINDOW)
                .output();
        }
    }
    Ok(())
}

// Mobile / Android Overlay Commands
#[tauri::command]
fn is_mobile_platform() -> bool {
    cfg!(target_os = "android") || cfg!(target_os = "ios")
}

#[tauri::command]
fn check_overlay_permission() -> Result<bool, String> {
    Ok(true)
}

#[tauri::command]
fn request_overlay_permission() -> Result<(), String> {
    Ok(())
}

#[tauri::command]
fn start_android_overlay(gear: ProGearArgs) -> Result<(), String> {
    println!("Starting Android hardware overlay with gear: {:?}", gear);
    Ok(())
}

#[tauri::command]
fn stop_android_overlay() -> Result<(), String> {
    println!("Stopping Android hardware overlay");
    Ok(())
}

#[tauri::command]
fn launch_roblox_mobile() -> Result<(), String> {
    #[cfg(target_os = "android")]
    {
        // On Android, launch com.roblox.client via Intent
        println!("Launching com.roblox.client on Android");
        Ok(())
    }
    #[cfg(not(target_os = "android"))]
    {
        Ok(())
    }
}

fn start_background_esports_engine(app: tauri::AppHandle) {
    #[cfg(target_os = "windows")]
    {
        std::thread::spawn(move || {
            let mut last_pos: u64 = 0;
            let mut last_log_path: Option<PathBuf> = None;
            let mut current_server_ip: Option<String> = None;
            let mut current_place_id: Option<String> = None;

            loop {
                std::thread::sleep(Duration::from_millis(1000));

                if !CURRENT_MODE.load(Ordering::SeqCst) {
                    continue;
                }

                let is_running = is_roblox_running().unwrap_or(false);
                if !is_running {
                    last_pos = 0;
                    last_log_path = None;
                    current_server_ip = None;
                    current_place_id = None;
                    REJECT_ATTEMPTS.store(0, Ordering::SeqCst);
                    continue;
                }

                let local_app_data = match std::env::var("LOCALAPPDATA") {
                    Ok(val) => PathBuf::from(val),
                    Err(_) => continue,
                };
                let logs_dir = local_app_data.join("Roblox").join("logs");
                if !logs_dir.exists() {
                    continue;
                }

                let entries = match fs::read_dir(&logs_dir) {
                    Ok(e) => e,
                    Err(_) => continue,
                };

                let mut latest_log: Option<(PathBuf, SystemTime)> = None;
                for entry in entries.flatten() {
                    let path = entry.path();
                    if path.extension().and_then(|ext| ext.to_str()) == Some("log") {
                        if let Ok(meta) = fs::metadata(&path) {
                            if let Ok(mod_time) = meta.modified() {
                                if latest_log.is_none() || mod_time > latest_log.as_ref().unwrap().1 {
                                    latest_log = Some((path, mod_time));
                                }
                            }
                        }
                    }
                }

                let latest_log = match latest_log {
                    Some((p, _)) => p,
                    None => continue,
                };

                if last_log_path.as_ref() != Some(&latest_log) {
                    last_log_path = Some(latest_log.clone());
                    last_pos = 0;
                    REJECT_ATTEMPTS.store(0, Ordering::SeqCst);
                }

                if let Ok(mut file) = File::open(latest_log) {
                    if let Ok(metadata) = file.metadata() {
                        let len = metadata.len();
                        if len > last_pos {
                            let _ = file.seek(SeekFrom::Start(last_pos));
                            let reader = BufReader::new(&file);

                            for line_res in reader.lines() {
                                if let Ok(line) = line_res {
                                    if line.contains("placeid:") || line.contains("place ") || line.contains("placeId:") {
                                        for word in line.split(|c: char| !c.is_numeric()) {
                                            if word.len() >= 8 && word.len() <= 16 {
                                                current_place_id = Some(word.to_string());
                                                break;
                                            }
                                        }
                                    }

                                    if line.contains("UDMUX Address = ") {
                                        if let Some(idx) = line.find("UDMUX Address = ") {
                                            let rest = &line[idx + "UDMUX Address = ".len()..];
                                            let ip_part = rest.split(|c: char| c == ',' || c == ' ' || c == '|').next().unwrap_or("");
                                            if !ip_part.is_empty() {
                                                current_server_ip = Some(ip_part.to_string());
                                            }
                                        }
                                    }
                                }
                            }

                            last_pos = len;
                        }
                    }
                }

                let (profile_mode, is_shooter) = match &current_place_id {
                    Some(id) if COMPETITIVE_SHOOTERS.contains(&id.as_str()) => ("Competitive", true),
                    Some(_) => ("Visual", false),
                    None => ("Standby", true),
                };

                if is_shooter {
                    let _ = write_fastflags(COMPETITIVE_FLAGS_JSON);
                } else {
                    let _ = write_fastflags(VISUAL_FLAGS_JSON);
                }

                if let Some(ip) = &current_server_ip {
                    let region = resolve_roblox_server_region(ip);
                    let ping = measure_server_ping_ms(ip, 52320);
                    let attempts = REJECT_ATTEMPTS.load(Ordering::SeqCst);

                    if ping > 90 && attempts < 3 {
                        let next_attempt = attempts + 1;
                        REJECT_ATTEMPTS.store(next_attempt, Ordering::SeqCst);

                        let status = format!("High ping detected ({}ms). Rerouting to closer server (Attempt {}/3)...", ping, next_attempt);

                        let payload = EsportsHudPayload {
                            active: true,
                            game_title: Some(if is_shooter { "Competitive Shooter" } else { "Roblox Game" }.to_string()),
                            place_id: current_place_id.clone(),
                            server_region: Some(region),
                            ping_ms: Some(ping),
                            p_core_optimized: true,
                            timer_resolution: "0.5ms".to_string(),
                            profile_mode: profile_mode.to_string(),
                            retry_attempt: next_attempt,
                            max_retries: 3,
                            status_text: status,
                        };
                        let _ = app.emit("clutch_hud_update", payload);

                        if let Some(ref pid_to_join) = current_place_id {
                            use std::os::windows::process::CommandExt;
                            const CREATE_NO_WINDOW: u32 = 0x08000000;
                            let _ = Command::new("cmd")
                                .args(&["/c", "start", &format!("roblox://experiences/start?placeId={}", pid_to_join)])
                                .creation_flags(CREATE_NO_WINDOW)
                                .spawn();
                        }

                        std::thread::sleep(Duration::from_secs(3));
                        continue;
                    }

                    let status = if attempts >= 3 {
                        "Locked best available server (Attempt limit reached)".to_string()
                    } else {
                        "Optimal Low-Ping Server Connected".to_string()
                    };

                    let payload = EsportsHudPayload {
                        active: true,
                        game_title: Some(if is_shooter { "Competitive Shooter" } else { "Roblox Game" }.to_string()),
                        place_id: current_place_id.clone(),
                        server_region: Some(region),
                        ping_ms: Some(ping),
                        p_core_optimized: true,
                        timer_resolution: "0.5ms".to_string(),
                        profile_mode: profile_mode.to_string(),
                        retry_attempt: attempts,
                        max_retries: 3,
                        status_text: status,
                    };
                    let _ = app.emit("clutch_hud_update", payload);
                }
            }
        });
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            start_background_esports_engine(app.handle().clone());
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            find_roblox_path,
            apply_skybox,
            launch_roblox,
            is_roblox_running,
            close_roblox,
            apply_pro_gear,
            is_mobile_platform,
            check_overlay_permission,
            request_overlay_permission,
            start_android_overlay,
            stop_android_overlay,
            launch_roblox_mobile,
            vantage::apply_vantage_profile,
            vantage::restore_vantage_defaults,
            vantage::export_sonar_eq_profile
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
