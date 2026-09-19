package com.clutchblox.client

import android.content.Context
import android.content.Intent
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
   * Launch official Roblox Mobile app (com.roblox.client) via explicit native Intent.
   * If Roblox is not installed, seamlessly routes the user to the Google Play Store.
   */
  fun launchRobloxApp(): Boolean {
    var launched = false
    try {
      // 1. Try launching official package directly
      val launchIntent = packageManager.getLaunchIntentForPackage("com.roblox.client")
      if (launchIntent != null) {
        launchIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_RESET_TASK_IF_NEEDED)
        startActivity(launchIntent)
        launched = true
      } else {
        // 2. Try deep link scheme roblox://
        val deepLinkIntent = Intent(Intent.ACTION_VIEW, Uri.parse("roblox://")).apply {
          addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        if (deepLinkIntent.resolveActivity(packageManager) != null) {
          startActivity(deepLinkIntent)
          launched = true
        } else {
          // 3. Roblox is not installed on the device -> Open Google Play Store
          val playStoreIntent = Intent(Intent.ACTION_VIEW, Uri.parse("market://details?id=com.roblox.client")).apply {
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
          }
          if (playStoreIntent.resolveActivity(packageManager) != null) {
            startActivity(playStoreIntent)
          } else {
            val webPlayIntent = Intent(Intent.ACTION_VIEW, Uri.parse("https://play.google.com/store/apps/details?id=com.roblox.client")).apply {
              addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            startActivity(webPlayIntent)
          }
          Handler(Looper.getMainLooper()).post {
            Toast.makeText(this, "Roblox Mobile is not installed. Opening Google Play Store...", Toast.LENGTH_LONG).show()
          }
        }
      }
    } catch (e: Exception) {
      e.printStackTrace()
      Handler(Looper.getMainLooper()).post {
        Toast.makeText(this, "Error launching Roblox: ${e.localizedMessage}", Toast.LENGTH_SHORT).show()
      }
    }
    return launched
  }

  fun isRobloxInstalled(): Boolean {
    return try {
      packageManager.getLaunchIntentForPackage("com.roblox.client") != null
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
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M && !Settings.canDrawOverlays(this)) {
      val intent = Intent(
        Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
        Uri.parse("package:$packageName")
      ).apply {
        addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
      }
      startActivity(intent)
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
