/**
 * Dev performance instrumentation orchestrator.
 *
 * Activates all perf monitors only when the overlay is visible: native UI FPS,
 * JS rAF FPS, Reanimated frame percentiles/drops, and JS scheduling heuristic.
 */
import { usePerformanceStore } from '@/features/performance/store/performanceStore';
import { useDevMenuFps } from '@/features/performance/hooks/useDevMenuFps';
import { useJsLagDetector } from '@/features/performance/hooks/useJsLagDetector';
import { useNativeFrameMetrics } from '@/features/performance/hooks/useNativeFrameMetrics';

export function usePerformanceInstrumentation(): void {
  const isOverlayVisible = usePerformanceStore((state) => state.isOverlayVisible);

  useDevMenuFps(isOverlayVisible);
  useNativeFrameMetrics(isOverlayVisible);
  useJsLagDetector(isOverlayVisible);
}
