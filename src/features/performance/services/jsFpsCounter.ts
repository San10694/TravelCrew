/**
 * JS event-loop FPS sampler (RCTFPSGraph-equivalent via requestAnimationFrame).
 * Counts ticks over >=1s windows; output clamped to maxRefreshRate.
 */
import { clampFps } from '@/features/performance/services/clampFps';

export function startJsFpsCounter(
  onFps: (fps: number) => void,
  maxRefreshRate = 60,
): () => void {
  let frameCount = 0;
  let prevTimeSec = -1;
  let rafId: number | null = null;
  let isRunning = true;

  const loop = (timeMs: number) => {
    if (!isRunning) {
      return;
    }

    const timestampSec = timeMs / 1000;
    frameCount += 1;

    if (prevTimeSec < 0) {
      prevTimeSec = timestampSec;
    } else if (timestampSec - prevTimeSec >= 1) {
      const fps = clampFps(frameCount / (timestampSec - prevTimeSec), maxRefreshRate);
      onFps(fps);
      prevTimeSec = timestampSec;
      frameCount = 0;
    }

    rafId = requestAnimationFrame(loop);
  };

  rafId = requestAnimationFrame(loop);

  return () => {
    isRunning = false;
    if (rafId !== null) {
      cancelAnimationFrame(rafId);
    }
  };
}
