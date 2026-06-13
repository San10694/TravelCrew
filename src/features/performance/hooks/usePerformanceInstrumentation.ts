import { usePerformanceStore } from '@/features/performance/store/performanceStore';
import { useJsLagDetector } from '@/features/performance/hooks/useJsLagDetector';
import { useNativeFrameMetrics } from '@/features/performance/hooks/useNativeFrameMetrics';

export function usePerformanceInstrumentation(): void {
  const isOverlayVisible = usePerformanceStore((state) => state.isOverlayVisible);

  useNativeFrameMetrics(isOverlayVisible);
  useJsLagDetector(isOverlayVisible);
}
