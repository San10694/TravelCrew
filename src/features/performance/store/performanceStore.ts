import { create } from 'zustand';

import type { FrameStats } from '@/features/performance/services/frameStatsCalculator';
import { createSelectors } from '@/features/shared/utils/createSelectors';

export type JsThreadStatus = 'Healthy' | 'JS Busy';

type PerformanceState = {
  frameDrops: number;
  jsThreadStatus: JsThreadStatus;
  p50FrameTime: number;
  p95FrameTime: number;
  worstFrameTime: number;
  isOverlayVisible: boolean;
  updateFrameStats: (stats: FrameStats) => void;
  syncFrameDrops: (drops: number) => void;
  setJsThreadStatus: (status: JsThreadStatus) => void;
  toggleOverlay: () => void;
};

const usePerformanceStoreBase = create<PerformanceState>((set) => ({
  frameDrops: 0,
  jsThreadStatus: 'Healthy',
  p50FrameTime: 0,
  p95FrameTime: 0,
  worstFrameTime: 0,
  isOverlayVisible: false,

  updateFrameStats: (stats) => {
    set((state) => {
      if (
        state.p50FrameTime === stats.p50FrameTime &&
        state.p95FrameTime === stats.p95FrameTime &&
        state.worstFrameTime === stats.worstFrameTime
      ) {
        return state;
      }

      return {
        p50FrameTime: stats.p50FrameTime,
        p95FrameTime: stats.p95FrameTime,
        worstFrameTime: stats.worstFrameTime,
      };
    });
  },

  syncFrameDrops: (drops) => {
    set((state) => (state.frameDrops === drops ? state : { frameDrops: drops }));
  },

  setJsThreadStatus: (status) => {
    set((state) => (state.jsThreadStatus === status ? state : { jsThreadStatus: status }));
  },

  toggleOverlay: () => {
    set((state) => ({ isOverlayVisible: !state.isOverlayVisible }));
  },
}));

export const usePerformanceStore = createSelectors(usePerformanceStoreBase);
