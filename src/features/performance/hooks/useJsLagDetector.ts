import { useEffect } from 'react';

import { usePerformanceStore } from '@/features/performance/store/performanceStore';

const CHECK_INTERVAL_MS = 100;
const DRIFT_THRESHOLD_MS = 50;

export function useJsLagDetector(): void {
  const setJsThreadStatus = usePerformanceStore((state) => state.setJsThreadStatus);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const start = performance.now();

      requestAnimationFrame(() => {
        const drift = performance.now() - start;
        setJsThreadStatus(drift > DRIFT_THRESHOLD_MS ? 'JS Busy' : 'Healthy');
      });
    }, CHECK_INTERVAL_MS);

    return () => {
      clearInterval(intervalId);
    };
  }, [setJsThreadStatus]);
}
