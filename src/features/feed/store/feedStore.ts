import { create } from 'zustand';

import type { TravelBundle } from '@/features/feed/types/travelBundle';
import { createSelectors } from '@/features/shared/utils/createSelectors';

export type FeedStatus = 'idle' | 'loading' | 'ready' | 'error';

type FeedState = {
  bundles: TravelBundle[];
  status: FeedStatus;
  setBundles: (bundles: TravelBundle[]) => void;
  setStatus: (status: FeedStatus) => void;
};

const useFeedStoreBase = create<FeedState>((set) => ({
  bundles: [],
  status: 'idle',

  setBundles: (bundles) => {
    set({ bundles });
  },

  setStatus: (status) => {
    set({ status });
  },
}));

export const useFeedStore = createSelectors(useFeedStoreBase);
