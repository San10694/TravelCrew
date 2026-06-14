import { useCallback, useEffect, useRef } from 'react';
import { runOnJS, useFrameCallback, useSharedValue } from 'react-native-reanimated';

import { calculateFrameStats } from '@/features/performance/services/frameStatsCalculator';
import {
  createFrameTimeBuffer,
  isFrameDropWorklet,
  PERCENTILE_WINDOW_SAMPLES,
  pushFrameTime,
  snapshotRecentFrameTimes,
  WARMUP_DURATION_MS,
  type FrameTimeBuffer,
} from '@/features/performance/services/frameBuffer.worklet';
import { usePerformanceStore } from '@/features/performance/store/performanceStore';

const BUFFER_SIZE = 120;
const STATS_INTERVAL_MS = 1000;
const ZUSTAND_SYNC_INTERVAL_MS = 1000;

export function useNativeFrameMetrics(isActive: boolean): void {
  const updateFrameStats = usePerformanceStore((state) => state.updateFrameStats);
  const syncFrameDrops = usePerformanceStore((state) => state.syncFrameDrops);

  const updateFrameStatsRef = useRef(updateFrameStats);
  const syncFrameDropsRef = useRef(syncFrameDrops);

  updateFrameStatsRef.current = updateFrameStats;
  syncFrameDropsRef.current = syncFrameDrops;

  const frameTimeBuffer = useSharedValue<FrameTimeBuffer | null>(null);
  const lastStatsTimestamp = useSharedValue(0);
  const lastSyncTimestamp = useSharedValue(0);
  const warmupEndTimestamp = useSharedValue(0);
  const frameDropsCount = useSharedValue(0);

  const pushStatsFromSnapshot = useCallback((snapshot: number[]) => {
    updateFrameStatsRef.current(calculateFrameStats(snapshot));
  }, []);

  const pushFrameDropsToStore = useCallback((drops: number) => {
    syncFrameDropsRef.current(drops);
  }, []);

  const resetMetrics = useCallback(() => {
    lastStatsTimestamp.value = 0;
    lastSyncTimestamp.value = 0;
    warmupEndTimestamp.value = 0;
    frameTimeBuffer.value = null;
    frameDropsCount.value = 0;
    syncFrameDropsRef.current(0);
  }, [
    frameDropsCount,
    frameTimeBuffer,
    lastStatsTimestamp,
    lastSyncTimestamp,
    warmupEndTimestamp,
  ]);

  const frameCallback = useFrameCallback(
    (frameInfo) => {
      'worklet';

      if (frameInfo.timeSincePreviousFrame === null) {
        return;
      }

      if (frameTimeBuffer.value === null) {
        frameTimeBuffer.value = createFrameTimeBuffer(BUFFER_SIZE);
      }

      const frameTimeMs = frameInfo.timeSincePreviousFrame;
      const timestamp = Math.round(frameInfo.timestamp);

      if (warmupEndTimestamp.value === 0) {
        warmupEndTimestamp.value = timestamp + WARMUP_DURATION_MS;
      }

      const isWarmupComplete = timestamp >= warmupEndTimestamp.value;

      if (isWarmupComplete) {
        pushFrameTime(frameTimeBuffer.value, frameTimeMs);

        if (isFrameDropWorklet(frameTimeMs)) {
          frameDropsCount.value += 1;
        }
      }

      if (isWarmupComplete && timestamp - lastSyncTimestamp.value >= ZUSTAND_SYNC_INTERVAL_MS) {
        lastSyncTimestamp.value = timestamp;
        runOnJS(pushFrameDropsToStore)(frameDropsCount.value);
      }

      if (isWarmupComplete && timestamp - lastStatsTimestamp.value >= STATS_INTERVAL_MS) {
        lastStatsTimestamp.value = timestamp;
        const snapshot = snapshotRecentFrameTimes(
          frameTimeBuffer.value,
          PERCENTILE_WINDOW_SAMPLES,
        );
        runOnJS(pushStatsFromSnapshot)(snapshot);
      }
    },
    false,
  );

  useEffect(() => {
    if (isActive) {
      resetMetrics();
      frameCallback.setActive(true);
      return;
    }

    frameCallback.setActive(false);
  }, [frameCallback, isActive, resetMetrics]);
}
