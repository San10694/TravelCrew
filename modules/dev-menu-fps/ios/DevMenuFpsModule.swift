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
  }
}
