// Expo module entry for iOS. Bridges DevMenuFpsMonitor to JS via onFpsUpdate events.
// Exposes start/stop monitoring and getMaxRefreshRate (UIScreen.maximumFramesPerSecond).
import ExpoModulesCore

private let onFpsUpdate = "onFpsUpdate"

public class DevMenuFpsModule: Module {
  public func definition() -> ModuleDefinition {
    Name("DevMenuFps")

    Events(onFpsUpdate)

    Function("startMonitoring") {
#if DEBUG
      DevMenuFpsMonitor.shared().start(onUpdate: { uiFps in
        self.sendEvent(onFpsUpdate, [
          "uiFps": uiFps,
        ])
      })
#endif
    }

    Function("stopMonitoring") {
      DevMenuFpsMonitor.shared().stop()
    }

    Function("getMaxRefreshRate") { () -> Int in
      Int(UIScreen.main.maximumFramesPerSecond)
    }
  }
}
