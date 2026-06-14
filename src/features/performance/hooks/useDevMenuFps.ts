import { useEffect } from 'react';

import {
  addFpsUpdateListener,
  isDevMenuFpsAvailable,
  startMonitoring,
  stopMonitoring,
} from 'dev-menu-fps';

import { usePerformanceMetrics } from '@/features/performance/context/PerformanceMetricsContext';
import { startJsFpsCounter } from '@/features/performance/services/jsFpsCounter';

export function useDevMenuFps(isActive: boolean): void {
  const { uiFpsText, jsFpsText } = usePerformanceMetrics();
  const isAvailable = isDevMenuFpsAvailable();

  useEffect(() => {
    if (!isActive) {
      return;
    }

    if (!isAvailable) {
      uiFpsText.value = '—';
      jsFpsText.value = '—';
      return;
    }

    uiFpsText.value = '60';
    jsFpsText.value = '60';

    const nativeSubscription = addFpsUpdateListener(({ uiFps }) => {
      uiFpsText.value = String(uiFps);
    });

    const stopJsFpsCounter = startJsFpsCounter((fps) => {
      jsFpsText.value = String(fps);
    });

    startMonitoring();

    return () => {
      nativeSubscription.remove();
      stopJsFpsCounter();
      stopMonitoring();
    };
  }, [isActive, isAvailable, jsFpsText, uiFpsText]);
}
