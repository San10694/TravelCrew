export type FrameTimeBuffer = {
  next: number;
  buffer: Float32Array;
  size: number;
  count: number;
};

export const PERCENTILE_WINDOW_SAMPLES = 60;
export const WARMUP_DURATION_MS = 500;

const EMA_ALPHA = 0.08;
const MIN_FRAME_TIME_MS = 1;
const MAX_FRAME_TIME_MS = 200;
const DISPLAY_UPDATE_INTERVAL_MS = 500;
const FPS_DISPLAY_HYSTERESIS = 1;

export function createFrameTimeBuffer(size: number): FrameTimeBuffer {
  'worklet';

  return {
    next: 0,
    buffer: new Float32Array(size),
    size,
    count: 0,
  };
}

export function pushFrameTime(buffer: FrameTimeBuffer, frameTimeMs: number): void {
  'worklet';

  buffer.buffer[buffer.next] = frameTimeMs;
  buffer.next = (buffer.next + 1) % buffer.size;
  buffer.count = Math.min(buffer.size, buffer.count + 1);
}

export function updateSmoothedFrameTime(
  smoothedFrameTime: { value: number },
  frameTimeMs: number,
): void {
  'worklet';

  const clampedFrameTime = Math.min(
    MAX_FRAME_TIME_MS,
    Math.max(MIN_FRAME_TIME_MS, frameTimeMs),
  );

  if (smoothedFrameTime.value <= 0) {
    smoothedFrameTime.value = clampedFrameTime;
    return;
  }

  smoothedFrameTime.value =
    smoothedFrameTime.value * (1 - EMA_ALPHA) + clampedFrameTime * EMA_ALPHA;
}

export function frameTimeToFps(frameTimeMs: number): number {
  'worklet';

  if (frameTimeMs <= 0) {
    return 60;
  }

  return Math.round(1000 / frameTimeMs);
}

export function maybeUpdateFpsDisplay(
  smoothedFrameTime: { value: number },
  displayText: { value: string },
  lastDisplayUpdate: { value: number },
  timestamp: number,
): void {
  'worklet';

  if (smoothedFrameTime.value <= 0) {
    return;
  }

  if (timestamp - lastDisplayUpdate.value < DISPLAY_UPDATE_INTERVAL_MS) {
    return;
  }

  const nextFps = frameTimeToFps(smoothedFrameTime.value);
  const currentFps = Number.parseInt(displayText.value, 10);

  if (
    Number.isFinite(currentFps) &&
    Math.abs(nextFps - currentFps) < FPS_DISPLAY_HYSTERESIS
  ) {
    lastDisplayUpdate.value = timestamp;
    return;
  }

  displayText.value = String(nextFps);
  lastDisplayUpdate.value = timestamp;
}

export function isFrameDropWorklet(frameTimeMs: number): boolean {
  'worklet';

  return frameTimeMs > 22.2;
}

export function snapshotFrameTimes(buffer: FrameTimeBuffer): number[] {
  'worklet';

  return snapshotRecentFrameTimes(buffer, buffer.count);
}

export function snapshotRecentFrameTimes(
  buffer: FrameTimeBuffer,
  maxSamples: number,
): number[] {
  'worklet';

  const result: number[] = [];
  const sampleCount = Math.min(buffer.count, maxSamples);

  for (let index = 0; index < sampleCount; index += 1) {
    const bufferIndex =
      (buffer.next - sampleCount + index + buffer.size) % buffer.size;
    result.push(buffer.buffer[bufferIndex] as number);
  }

  return result;
}
