import { create } from 'zustand';

import type { FrameStats } from '@/features/performance/services/frameStatsCalculator';
import { createSelectors } from '@/features/shared/utils/createSelectors';

export type JsThreadStatus = 'Healthy' | 'JS Busy';

type PerformanceState = {
  fps: number;
  frameDrops: number;
  jsThreadStatus: JsThreadStatus;
  p50FrameTime: number;
  p95FrameTime: number;
  worstFrameTime: number;
  isOverlayVisible: boolean;
  updateFps: (fps: number) => void;
  incrementFrameDrops: () => void;
  updateFrameStats: (stats: FrameStats) => void;
  setJsThreadStatus: (status: JsThreadStatus) => void;
  toggleOverlay: () => void;
};

const usePerformanceStoreBase = create<PerformanceState>((set) => ({
  fps: 60,
  frameDrops: 0,
  jsThreadStatus: 'Healthy',
  p50FrameTime: 0,
  p95FrameTime: 0,
  worstFrameTime: 0,
  isOverlayVisible: false,

  updateFps: (fps) => {
    set({ fps });
  },

  incrementFrameDrops: () => {
    set((state) => ({ frameDrops: state.frameDrops + 1 }));
  },

  updateFrameStats: (stats) => {
    set({
      p50FrameTime: stats.p50FrameTime,
      p95FrameTime: stats.p95FrameTime,
      worstFrameTime: stats.worstFrameTime,
    });
  },

  setJsThreadStatus: (status) => {
    set({ jsThreadStatus: status });
  },

  toggleOverlay: () => {
    set((state) => ({ isOverlayVisible: !state.isOverlayVisible }));
  },
}));

export const usePerformanceStore = createSelectors(usePerformanceStoreBase);
