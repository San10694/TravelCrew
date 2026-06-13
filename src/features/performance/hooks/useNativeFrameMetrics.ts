import { useCallback, useEffect, useRef } from 'react';
import { runOnJS, useFrameCallback, useSharedValue } from 'react-native-reanimated';

import { usePerformanceMetrics } from '@/features/performance/context/PerformanceMetricsContext';
import { calculateFrameStats } from '@/features/performance/services/frameStatsCalculator';
import {
  createFrameTimeBuffer,
  isFrameDropWorklet,
  maybeUpdateFpsDisplay,
  PERCENTILE_WINDOW_SAMPLES,
  pushFrameTime,
  snapshotRecentFrameTimes,
  updateSmoothedFrameTime,
  WARMUP_DURATION_MS,
  type FrameTimeBuffer,
} from '@/features/performance/services/frameBuffer.worklet';
import { usePerformanceStore } from '@/features/performance/store/performanceStore';

const BUFFER_SIZE = 120;
const STATS_INTERVAL_MS = 1000;
const ZUSTAND_SYNC_INTERVAL_MS = 1000;
const JS_SAMPLE_INTERVAL_MS = 32;
const JS_EMA_ALPHA = 0.08;
const JS_DISPLAY_INTERVAL_MS = 500;
const JS_FPS_HYSTERESIS = 1;
const JS_CALIBRATION_SAMPLES = 20;
const JS_CALIBRATION_RATIO_THRESHOLD = 1.35;
const MIN_STABLE_UI_FRAME_TIME_MS = 8;

function loopJsAnimationFrame(onFrame: (deltaMs: number) => void): () => void {
  let lastTime = 0;
  let rafId: number | null = null;
  let isRunning = true;

  const loop = (time: number) => {
    if (!isRunning) {
      return;
    }

    if (lastTime > 0) {
      onFrame(time - lastTime);
    }

    lastTime = time;
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

export function useNativeFrameMetrics(isActive: boolean): void {
  const { uiFpsText, jsFpsText, frameDropsCount } = usePerformanceMetrics();

  const updateFrameStats = usePerformanceStore((state) => state.updateFrameStats);
  const syncFrameDrops = usePerformanceStore((state) => state.syncFrameDrops);

  const updateFrameStatsRef = useRef(updateFrameStats);
  const syncFrameDropsRef = useRef(syncFrameDrops);

  updateFrameStatsRef.current = updateFrameStats;
  syncFrameDropsRef.current = syncFrameDrops;

  const uiSmoothedFrameTime = useSharedValue(0);
  const lastUiDisplayUpdate = useSharedValue(0);
  const frameTimeBuffer = useSharedValue<FrameTimeBuffer | null>(null);
  const lastStatsTimestamp = useSharedValue(0);
  const lastSyncTimestamp = useSharedValue(0);
  const warmupEndTimestamp = useSharedValue(0);

  const jsLoopCleanupRef = useRef<(() => void) | null>(null);
  const jsSmoothedDeltaRef = useRef(0);
  const lastJsSampleRef = useRef(0);
  const lastJsDisplayRef = useRef(0);
  const jsFpsMultiplierRef = useRef(1);
  const jsCalibrationCountRef = useRef(0);
  const jsCalibrationRatioSumRef = useRef(0);
  const isJsCalibrationCompleteRef = useRef(false);
  const warmupEndWallClockRef = useRef(0);

  const pushStatsFromSnapshot = useCallback((snapshot: number[]) => {
    updateFrameStatsRef.current(calculateFrameStats(snapshot));
  }, []);

  const pushFrameDropsToStore = useCallback((drops: number) => {
    syncFrameDropsRef.current(drops);
  }, []);

  const resetMetrics = useCallback(() => {
    uiSmoothedFrameTime.value = 0;
    lastUiDisplayUpdate.value = 0;
    lastStatsTimestamp.value = 0;
    lastSyncTimestamp.value = 0;
    warmupEndTimestamp.value = 0;
    frameTimeBuffer.value = null;
    frameDropsCount.value = 0;
    uiFpsText.value = '60';
    jsFpsText.value = '60';
    jsFpsMultiplierRef.current = 1;
    jsCalibrationCountRef.current = 0;
    jsCalibrationRatioSumRef.current = 0;
    isJsCalibrationCompleteRef.current = false;
    warmupEndWallClockRef.current = performance.now() + WARMUP_DURATION_MS;
    syncFrameDropsRef.current(0);
  }, [
    frameDropsCount,
    frameTimeBuffer,
    jsFpsText,
    lastStatsTimestamp,
    lastSyncTimestamp,
    lastUiDisplayUpdate,
    uiFpsText,
    uiSmoothedFrameTime,
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

      updateSmoothedFrameTime(uiSmoothedFrameTime, frameTimeMs);
      maybeUpdateFpsDisplay(uiSmoothedFrameTime, uiFpsText, lastUiDisplayUpdate, timestamp);

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
    jsLoopCleanupRef.current?.();
    jsLoopCleanupRef.current = null;
  }, [frameCallback, isActive, resetMetrics]);

  useEffect(() => {
    if (!isActive) {
      return;
    }

    jsSmoothedDeltaRef.current = 0;
    lastJsSampleRef.current = 0;
    lastJsDisplayRef.current = 0;
    jsFpsMultiplierRef.current = 1;
    jsCalibrationCountRef.current = 0;
    jsCalibrationRatioSumRef.current = 0;
    isJsCalibrationCompleteRef.current = false;

    jsLoopCleanupRef.current = loopJsAnimationFrame((deltaMs) => {
      const timestamp = performance.now();

      if (timestamp < warmupEndWallClockRef.current) {
        return;
      }

      if (timestamp - lastJsSampleRef.current < JS_SAMPLE_INTERVAL_MS) {
        return;
      }

      lastJsSampleRef.current = timestamp;

      const clampedDelta = Math.min(200, Math.max(1, deltaMs));
      jsSmoothedDeltaRef.current =
        jsSmoothedDeltaRef.current <= 0
          ? clampedDelta
          : jsSmoothedDeltaRef.current * (1 - JS_EMA_ALPHA) + clampedDelta * JS_EMA_ALPHA;

      const uiFrameTime = uiSmoothedFrameTime.value;
      if (
        !isJsCalibrationCompleteRef.current &&
        uiFrameTime >= MIN_STABLE_UI_FRAME_TIME_MS
      ) {
        jsCalibrationRatioSumRef.current += jsSmoothedDeltaRef.current / uiFrameTime;
        jsCalibrationCountRef.current += 1;

        if (jsCalibrationCountRef.current >= JS_CALIBRATION_SAMPLES) {
          const averageRatio =
            jsCalibrationRatioSumRef.current / JS_CALIBRATION_SAMPLES;
          // Reanimated applies ×2 when JS rAF fires every other display frame.
          // Default to ×1; only double when rAF delta is consistently ~2× UI frame time.
          jsFpsMultiplierRef.current =
            averageRatio >= JS_CALIBRATION_RATIO_THRESHOLD ? 2 : 1;
          isJsCalibrationCompleteRef.current = true;
        }
      }

      if (!isJsCalibrationCompleteRef.current) {
        return;
      }

      if (timestamp - lastJsDisplayRef.current < JS_DISPLAY_INTERVAL_MS) {
        return;
      }

      const rawFps = 1000 / jsSmoothedDeltaRef.current;
      const nextFps = Math.round(rawFps * jsFpsMultiplierRef.current);
      const currentFps = Number.parseInt(jsFpsText.value, 10);

      if (
        Number.isFinite(currentFps) &&
        Math.abs(nextFps - currentFps) < JS_FPS_HYSTERESIS
      ) {
        lastJsDisplayRef.current = timestamp;
        return;
      }

      jsFpsText.value = String(nextFps);
      lastJsDisplayRef.current = timestamp;
    });

    return () => {
      jsLoopCleanupRef.current?.();
      jsLoopCleanupRef.current = null;
    };
  }, [isActive, jsFpsText, uiSmoothedFrameTime]);
}
