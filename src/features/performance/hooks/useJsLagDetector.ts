import { useEffect, useRef } from 'react';

import { usePerformanceMetrics } from '@/features/performance/context/PerformanceMetricsContext';
import type { JsThreadStatus } from '@/features/performance/store/performanceStore';
import { usePerformanceStore } from '@/features/performance/store/performanceStore';

const CHECK_INTERVAL_MS = 100;
const DRIFT_THRESHOLD_MS = 50;

export function useJsLagDetector(isActive: boolean): void {
  const { jsThreadStatusText } = usePerformanceMetrics();
  const setJsThreadStatus = usePerformanceStore((state) => state.setJsThreadStatus);
  const lastStatusRef = useRef<JsThreadStatus>('Healthy');

  useEffect(() => {
    if (!isActive) {
      return;
    }

    const updateStatus = (status: JsThreadStatus) => {
      if (lastStatusRef.current === status) {
        return;
      }

      lastStatusRef.current = status;
      jsThreadStatusText.value = status;
      setJsThreadStatus(status);
    };

    const intervalId = setInterval(() => {
      const start = performance.now();

      requestAnimationFrame(() => {
        const drift = performance.now() - start;
        updateStatus(drift > DRIFT_THRESHOLD_MS ? 'JS Busy' : 'Healthy');
      });
    }, CHECK_INTERVAL_MS);

    return () => {
      clearInterval(intervalId);
    };
  }, [isActive, jsThreadStatusText, setJsThreadStatus]);
}
