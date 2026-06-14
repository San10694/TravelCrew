/**
 * RCTFPSGraph-equivalent tick counting via requestAnimationFrame.
 * Counts frames over >=1s windows: round(frameCount / elapsedSeconds).
 */
export function startJsFpsCounter(onFps: (fps: number) => void): () => void {
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
      const fps = Math.round(frameCount / (timestampSec - prevTimeSec));
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
