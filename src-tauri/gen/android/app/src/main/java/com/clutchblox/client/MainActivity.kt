package com.clutchblox.client

import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Handler
import android.os.Looper
import android.provider.Settings
import android.webkit.JavascriptInterface
import android.webkit.WebView
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.core.content.ContextCompat

class MainActivity : TauriActivity() {

  companion object {
    @Volatile
    var instance: MainActivity? = null
  }

  override fun onCreate(savedInstanceState: Bundle?) {
    enableEdgeToEdge()
    super.onCreate(savedInstanceState)
    instance = this
  }

  override fun onDestroy() {
    super.onDestroy()
    if (instance == this) {
      instance = null
    }
  }

  override fun onWebViewCreate(webView: WebView) {
    super.onWebViewCreate(webView)
    // Register high-performance native Android bridge for Roblox launch & overlay services
    webView.addJavascriptInterface(ClutchAndroidBridge(this), "ClutchAndroid")
  }

  /**
   * Launch official Roblox Mobile app (com.roblox.client) via explicit native Intent on the UI thread.
   * If Roblox is not installed, seamlessly routes the user to the Google Play Store.
   */
  fun launchRobloxApp(): Boolean {
    runOnUiThread {
      try {
        // Strategy 1: Explicit launch intent for com.roblox.client
        var launchIntent = packageManager.getLaunchIntentForPackage("com.roblox.client")

        // Strategy 2: Intent Category Launcher resolution
        if (launchIntent == null) {
          val catIntent = Intent(Intent.ACTION_MAIN).apply {
            addCategory(Intent.CATEGORY_LAUNCHER)
            setPackage("com.roblox.client")
          }
          val resolveInfo = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            packageManager.queryIntentActivities(catIntent, PackageManager.ResolveInfoFlags.of(0))
          } else {
            @Suppress("DEPRECATION")
            packageManager.queryIntentActivities(catIntent, 0)
          }
          if (resolveInfo.isNotEmpty()) {
            val activityInfo = resolveInfo[0].activityInfo
            launchIntent = Intent(Intent.ACTION_MAIN).apply {
              addCategory(Intent.CATEGORY_LAUNCHER)
              setClassName(activityInfo.packageName, activityInfo.name)
            }
          }
        }

        if (launchIntent != null) {
          launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED)
          startActivity(launchIntent)
          Toast.makeText(this, "Launching Roblox Mobile...", Toast.LENGTH_SHORT).show()
        } else {
          // Strategy 3: Try deep link scheme roblox:// directly
          val deepLinkIntent = Intent(Intent.ACTION_VIEW, Uri.parse("roblox://")).apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
          }
          try {
            startActivity(deepLinkIntent)
            Toast.makeText(this, "Launching Roblox Mobile...", Toast.LENGTH_SHORT).show()
          } catch (e: Exception) {
            // Strategy 4: Roblox not found -> Open Google Play Store
            Toast.makeText(this, "Roblox Mobile not detected. Opening Google Play Store...", Toast.LENGTH_LONG).show()
            try {
              val playStoreIntent = Intent(Intent.ACTION_VIEW, Uri.parse("market://details?id=com.roblox.client")).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
              }
              startActivity(playStoreIntent)
            } catch (e2: Exception) {
              val webPlayIntent = Intent(Intent.ACTION_VIEW, Uri.parse("https://play.google.com/store/apps/details?id=com.roblox.client")).apply {
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
              }
              startActivity(webPlayIntent)
            }
          }
        }
      } catch (e: Exception) {
        e.printStackTrace()
        Toast.makeText(this, "Error launching Roblox: ${e.localizedMessage}", Toast.LENGTH_SHORT).show()
      }
    }
    return true
  }

  fun isRobloxInstalled(): Boolean {
    return try {
      if (packageManager.getLaunchIntentForPackage("com.roblox.client") != null) return true
      val catIntent = Intent(Intent.ACTION_MAIN).apply {
        addCategory(Intent.CATEGORY_LAUNCHER)
        setPackage("com.roblox.client")
      }
      val resolveInfo = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
        packageManager.queryIntentActivities(catIntent, PackageManager.ResolveInfoFlags.of(0))
      } else {
        @Suppress("DEPRECATION")
        packageManager.queryIntentActivities(catIntent, 0)
      }
      resolveInfo.isNotEmpty()
    } catch (e: Exception) {
      false
    }
  }

  fun hasOverlayPermission(): Boolean {
    return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
      Settings.canDrawOverlays(this)
    } else {
      true
    }
  }

  fun requestOverlayPermission() {
    runOnUiThread {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(this)) {
        try {
          val intent = Intent(
            Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
            Uri.parse("package:$packageName")
          ).apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
          }
          startActivity(intent)
          Toast.makeText(this, "Enable 'Allow display over other apps' for ClutchBlox", Toast.LENGTH_LONG).show()
        } catch (e: Exception) {
          try {
            val genericIntent = Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION).apply {
              addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            startActivity(genericIntent)
          } catch (e2: Exception) {
            Toast.makeText(this, "Could not open overlay settings: ${e2.localizedMessage}", Toast.LENGTH_SHORT).show()
          }
        }
      }
    }
  }

  fun startOverlayService(crosshair: String, scale: Float, opacity: Float, highRefresh: Boolean): Boolean {
    if (!hasOverlayPermission()) {
      requestOverlayPermission()
      return false
    }

    val serviceIntent = Intent(this, ClutchOverlayService::class.java).apply {
      putExtra("crosshair", crosshair)
      putExtra("scale", scale)
      putExtra("opacity", opacity)
      putExtra("high_refresh", highRefresh)
    }

    return try {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        ContextCompat.startForegroundService(this, serviceIntent)
      } else {
        startService(serviceIntent)
      }
      true
    } catch (e: Exception) {
      e.printStackTrace()
      false
    }
  }

  fun stopOverlayService(): Boolean {
    val serviceIntent = Intent(this, ClutchOverlayService::class.java).apply {
      action = "STOP_OVERLAY"
    }
    return try {
      startService(serviceIntent)
      true
    } catch (e: Exception) {
      e.printStackTrace()
      false
    }
  }
}

/**
 * High-performance JavaScript bridge exposed to Tauri WebView as `window.ClutchAndroid`.
 */
class ClutchAndroidBridge(private val activity: MainActivity) {

  @JavascriptInterface
  fun launchRoblox(): Boolean {
    return activity.launchRobloxApp()
  }

  @JavascriptInterface
  fun isRobloxInstalled(): Boolean {
    return activity.isRobloxInstalled()
  }

  @JavascriptInterface
  fun hasOverlayPermission(): Boolean {
    return activity.hasOverlayPermission()
  }

  @JavascriptInterface
  fun requestOverlayPermission() {
    activity.requestOverlayPermission()
  }

  @JavascriptInterface
  fun startOverlay(crosshair: String, scale: Float, opacity: Float, highRefresh: Boolean): Boolean {
    return activity.startOverlayService(crosshair, scale, opacity, highRefresh)
  }

  @JavascriptInterface
  fun stopOverlay(): Boolean {
    return activity.stopOverlayService()
  }

  @JavascriptInterface
  fun isAndroid(): Boolean {
    return true
  }
}
