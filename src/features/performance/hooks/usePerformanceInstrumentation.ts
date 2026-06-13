import { useFpsTracker } from '@/features/performance/hooks/useFpsTracker';
import { useJsLagDetector } from '@/features/performance/hooks/useJsLagDetector';

export function usePerformanceInstrumentation(): void {
  useFpsTracker();
  useJsLagDetector();
}
