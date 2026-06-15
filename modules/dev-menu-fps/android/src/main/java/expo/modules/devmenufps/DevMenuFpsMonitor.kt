package expo.modules.devmenufps

import android.os.Handler
import android.os.Looper
import android.view.Choreographer
import kotlin.math.roundToInt

/**
 * UI FPS via Choreographer (RN FpsView pattern). JS FPS is measured in JS via rAF.
 */
internal class DevMenuFpsMonitor(
  private val maxRefreshRate: Int,
  private val onUpdate: (uiFps: Int) -> Unit,
) : Choreographer.FrameCallback {

  private val choreographer = Choreographer.getInstance()
  private val mainHandler = Handler(Looper.getMainLooper())
  private var isRunning = false

  private var firstFrameTime = -1L
  private var lastFrameTime = -1L
  private var numUiFrameCallbacks = 0

  private val emitHandler = Handler(Looper.getMainLooper())
  private val emitRunnable = Runnable {
    if (!isRunning) {
      return@Runnable
    }

    emitCurrentFps()
    resetCounters()
    scheduleEmit()
  }

  fun start() {
    if (isRunning) {
      return
    }

    isRunning = true
    resetCounters()
    mainHandler.post {
      choreographer.postFrameCallback(this)
    }
    scheduleEmit()
  }

  fun stop() {
    if (!isRunning) {
      return
    }

    isRunning = false
    mainHandler.post {
      choreographer.removeFrameCallback(this)
    }
    emitHandler.removeCallbacks(emitRunnable)
  }

  override fun doFrame(frameTimeNanos: Long) {
    if (!isRunning) {
      return
    }

    if (firstFrameTime < 0) {
      firstFrameTime = frameTimeNanos
    }
    lastFrameTime = frameTimeNanos
    numUiFrameCallbacks += 1
    choreographer.postFrameCallback(this)
  }

  private fun emitCurrentFps() {
    if (firstFrameTime < 0 || lastFrameTime <= firstFrameTime) {
      onUpdate(0)
      return
    }

    val elapsedNanos = lastFrameTime - firstFrameTime
    val uiFps = ((numUiFrameCallbacks - 1).coerceAtLeast(0) * 1e9 / elapsedNanos).roundToInt()
    onUpdate(uiFps.coerceIn(0, maxRefreshRate))
  }

  private fun resetCounters() {
    firstFrameTime = -1
    lastFrameTime = -1
    numUiFrameCallbacks = 0
  }

  private fun scheduleEmit() {
    emitHandler.removeCallbacks(emitRunnable)
    emitHandler.postDelayed(emitRunnable, UPDATE_INTERVAL_MS)
  }

  private companion object {
    private const val UPDATE_INTERVAL_MS = 500L
  }
}
