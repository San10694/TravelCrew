import { useEffect, useRef } from 'react';

import {
  calculateFrameStats,
  isFrameDrop,
} from '@/features/performance/services/frameStatsCalculator';
import { usePerformanceStore } from '@/features/performance/store/performanceStore';

const BUFFER_SIZE = 300;
const STATS_INTERVAL_MS = 1000;

export function useFpsTracker(): void {
  const updateFps = usePerformanceStore((state) => state.updateFps);
  const incrementFrameDrops = usePerformanceStore((state) => state.incrementFrameDrops);
  const updateFrameStats = usePerformanceStore((state) => state.updateFrameStats);

  const bufferRef = useRef<number[]>([]);
  const writeIndexRef = useRef(0);
  const sampleCountRef = useRef(0);
  const lastTimestampRef = useRef<number | null>(null);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    const pushSample = (frameTime: number) => {
      const buffer = bufferRef.current;
      const writeIndex = writeIndexRef.current;

      if (buffer.length < BUFFER_SIZE) {
        buffer.push(frameTime);
      } else {
        buffer[writeIndex] = frameTime;
      }

      writeIndexRef.current = (writeIndex + 1) % BUFFER_SIZE;
      sampleCountRef.current = Math.min(sampleCountRef.current + 1, BUFFER_SIZE);
    };

    const tick = (timestamp: number) => {
      if (lastTimestampRef.current !== null) {
        const frameTime = timestamp - lastTimestampRef.current;
        const fps = frameTime > 0 ? 1000 / frameTime : 60;

        updateFps(Math.round(fps));

        if (isFrameDrop(frameTime, fps)) {
          incrementFrameDrops();
        }

        pushSample(frameTime);
      }

      lastTimestampRef.current = timestamp;
      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);

    const statsInterval = setInterval(() => {
      const count = sampleCountRef.current;
      if (count === 0) {
        return;
      }

      const buffer = bufferRef.current;
      const snapshot =
        buffer.length <= count
          ? buffer.slice()
          : [...buffer.slice(writeIndexRef.current), ...buffer.slice(0, writeIndexRef.current)];

      updateFrameStats(calculateFrameStats(snapshot));
    }, STATS_INTERVAL_MS);

    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
      clearInterval(statsInterval);
    };
  }, [incrementFrameDrops, updateFps, updateFrameStats]);
}
