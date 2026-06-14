package expo.modules.devmenufps

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class DevMenuFpsModule : Module() {
  private var monitor: DevMenuFpsMonitor? = null

  override fun definition() = ModuleDefinition {
    Name("DevMenuFps")

    Events("onFpsUpdate")

    Function("startMonitoring") {
      monitor?.stop()
      monitor = DevMenuFpsMonitor { uiFps ->
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
}
