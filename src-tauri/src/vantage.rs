use std::fs;
use std::path::PathBuf;

#[tauri::command]
pub fn apply_vantage_profile(true_sight: bool, fov: u32) -> Result<String, String> {
    let clamped_fov = fov.clamp(70, 120);
    let fov_modifier = clamped_fov.saturating_sub(70);

    let config_json = if true_sight {
        format!(
            r#"{{
  "FFlagDebugForceFutureIsBrightPhase": "1",
  "FFlagDebugDisableShadows": "True",
  "FIntRenderShadowIntensity": 0,
  "FFlagDisablePostFx": "True",
  "DFFlagDebugPauseVoxelizer": true,
  "DFIntTaskSchedulerTargetFps": 240,
  "DFIntFieldOfViewModifier": {},
  "FIntCameraMaxFOV": {},
  "FIntCameraMinFOV": 70
}}"#,
            fov_modifier, clamped_fov
        )
    } else {
        format!(
            r#"{{
  "DFIntTaskSchedulerTargetFps": 240,
  "DFIntFieldOfViewModifier": {},
  "FIntCameraMaxFOV": {},
  "FIntCameraMinFOV": 70
}}"#,
            fov_modifier, clamped_fov
        )
    };

    crate::write_fastflags(&config_json)?;
    Ok(format!(
        "Applied 99Vantage profile (True Sight: {}, FOV: {}°)",
        if true_sight { "Active" } else { "Off" },
        clamped_fov
    ))
}

#[tauri::command]
pub fn restore_vantage_defaults() -> Result<(), String> {
    crate::cleanup_all_client_settings();
    Ok(())
}

#[tauri::command]
pub fn export_sonar_eq_profile() -> Result<String, String> {
    let eq_content = r#"# 99Vantage Acoustic Sonar Profile — 99 Nights in the Forest
# Designed to suppress rain/wind ambient noise and amplify hostile entity footsteps/vocal cues.
Preamp: -3.0 dB
Filter 1: ON HP Fc 180 Hz
Filter 2: ON PK Fc 1800 Hz Gain 8.0 dB Q 1.20
Filter 3: ON HSC Fc 4500 Hz Gain 6.0 dB Q 0.70
"#;

    let mut saved_paths = Vec::new();

    // Check Equalizer APO standard directory
    let apo_dir = PathBuf::from(r"C:\Program Files\EqualizerAPO\config");
    if apo_dir.exists() {
        let apo_file = apo_dir.join("99vantage_sonar.txt");
        if fs::write(&apo_file, eq_content).is_ok() {
            saved_paths.push(apo_file.to_string_lossy().to_string());
        }
    }

    // Always write a copy to User Downloads or Documents
    let user_profile = std::env::var("USERPROFILE").unwrap_or_else(|_| r"C:\Users\jacks".to_string());
    let downloads_dir = PathBuf::from(&user_profile).join("Downloads");
    let target_file = if downloads_dir.exists() {
        downloads_dir.join("99vantage_sonar.txt")
    } else {
        PathBuf::from(&user_profile).join("99vantage_sonar.txt")
    };

    fs::write(&target_file, eq_content)
        .map_err(|e| format!("Failed to export EQ preset: {}", e))?;
    saved_paths.push(target_file.to_string_lossy().to_string());

    Ok(saved_paths.join(" and "))
}
