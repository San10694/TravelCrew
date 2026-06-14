import { usePerformanceMetrics } from '@/features/performance/context/PerformanceMetricsContext';
import { usePerformanceStore } from '@/features/performance/store/performanceStore';
import type { SharedValue } from 'react-native-reanimated';

type PerformanceOverlayViewModel = {
  isOverlayVisible: boolean;
  uiFpsText: SharedValue<string>;
  jsFpsText: SharedValue<string>;
  jsThreadStatusText: SharedValue<string>;
  p50FrameTime: number;
  p95FrameTime: number;
  worstFrameTime: number;
  frameDrops: number;
};

export function usePerformanceOverlay(): PerformanceOverlayViewModel {
  const isOverlayVisible = usePerformanceStore((state) => state.isOverlayVisible);
  const p50FrameTime = usePerformanceStore((state) => state.p50FrameTime);
  const p95FrameTime = usePerformanceStore((state) => state.p95FrameTime);
  const worstFrameTime = usePerformanceStore((state) => state.worstFrameTime);
  const frameDrops = usePerformanceStore((state) => state.frameDrops);
  const { uiFpsText, jsFpsText, jsThreadStatusText } = usePerformanceMetrics();

  return {
    isOverlayVisible,
    uiFpsText,
    jsFpsText,
    jsThreadStatusText,
    p50FrameTime,
    p95FrameTime,
    worstFrameTime,
    frameDrops,
  };
}

type DevOverlayToggleViewModel = {
  isOverlayVisible: boolean;
  toggleOverlay: () => void;
};

export function useDevOverlayToggle(): DevOverlayToggleViewModel {
  const isOverlayVisible = usePerformanceStore((state) => state.isOverlayVisible);
  const toggleOverlay = usePerformanceStore((state) => state.toggleOverlay);

  return {
    isOverlayVisible,
    toggleOverlay,
  };
}
