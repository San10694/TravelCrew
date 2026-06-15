// Expo module entry for Android. Bridges DevMenuFpsMonitor to JS via onFpsUpdate events.
package expo.modules.devmenufps

import android.content.Context
import android.os.Build
import android.view.Display
import android.view.WindowManager
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import kotlin.math.roundToInt

class DevMenuFpsModule : Module() {
  private var monitor: DevMenuFpsMonitor? = null

  override fun definition() = ModuleDefinition {
    Name("DevMenuFps")

    Events("onFpsUpdate")

    Function("getMaxRefreshRate") {
      resolveMaxRefreshRate()
    }

    Function("startMonitoring") {
      val maxRefreshRate = resolveMaxRefreshRate()
      monitor?.stop()
      monitor = DevMenuFpsMonitor(maxRefreshRate) { uiFps ->
        sendEvent(
          "onFpsUpdate",
          mapOf(
            "uiFps" to uiFps,
          ),
        )
      }
      monitor?.start()
    }

    Function("stopMonitoring") {
      monitor?.stop()
      monitor = null
    }
  }

  private fun resolveMaxRefreshRate(): Int {
    val activity = appContext.currentActivity
    if (activity != null) {
      val display = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
        activity.display
      } else {
        @Suppress("DEPRECATION")
        activity.windowManager.defaultDisplay
      }
      return display?.refreshRate?.roundToInt()?.coerceAtLeast(60) ?: 60
    }

    val context = appContext.reactContext?.applicationContext ?: return 60
    val windowManager = context.getSystemService(Context.WINDOW_SERVICE) as WindowManager
    val display: Display? =
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
        context.display
      } else {
        @Suppress("DEPRECATION")
        windowManager.defaultDisplay
      }

    return display?.refreshRate?.roundToInt()?.coerceAtLeast(60) ?: 60
  }
}
