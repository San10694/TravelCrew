/** Caps reported FPS to display refresh rate (fixes round() showing 61 on 60 Hz). */
export function clampFps(fps: number, maxRefreshRate: number): number {
  if (!Number.isFinite(fps) || fps <= 0) {
    return 0;
  }

  return Math.min(Math.round(fps), maxRefreshRate);
}
