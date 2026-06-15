/**
 * Wires dev-menu-fps native UI FPS + JS rAF counter into PerformanceMetricsContext.
 * Clamps both metrics to getMaxRefreshRate() to avoid round() overshoot on 60 Hz displays.
 */
import { useEffect } from 'react';

import {
  addFpsUpdateListener,
  getMaxRefreshRate,
  isDevMenuFpsAvailable,
  startMonitoring,
  stopMonitoring,
} from 'dev-menu-fps';

import { usePerformanceMetrics } from '@/features/performance/context/PerformanceMetricsContext';
import { clampFps } from '@/features/performance/services/clampFps';
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

    const maxRefreshRate = getMaxRefreshRate();
    const initialFps = String(maxRefreshRate);

    uiFpsText.value = initialFps;
    jsFpsText.value = initialFps;

    const nativeSubscription = addFpsUpdateListener(({ uiFps }) => {
      uiFpsText.value = String(clampFps(uiFps, maxRefreshRate));
    });

    const stopJsFpsCounter = startJsFpsCounter((fps) => {
      jsFpsText.value = String(fps);
    }, maxRefreshRate);

    startMonitoring();

    return () => {
      nativeSubscription.remove();
      stopJsFpsCounter();
      stopMonitoring();
    };
  }, [isActive, isAvailable, jsFpsText, uiFpsText]);
}
