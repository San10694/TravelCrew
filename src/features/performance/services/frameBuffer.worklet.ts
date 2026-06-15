/**
 * UI-thread ring buffer for frame times (Reanimated worklets).
 * Used by useNativeFrameMetrics for P50/P95/worst and drop detection (>22.2ms).
 */
export type FrameTimeBuffer = {
  next: number;
  buffer: Float32Array;
  size: number;
  count: number;
};

export const PERCENTILE_WINDOW_SAMPLES = 60;
export const WARMUP_DURATION_MS = 500;

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

export function isFrameDropWorklet(frameTimeMs: number): boolean {
  'worklet';

  return frameTimeMs > 22.2;
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
