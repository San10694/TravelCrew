import { create } from 'zustand';

import { generateBundles } from '@/features/feed/data/generateBundles';
import type { TravelBundle } from '@/features/feed/types/travelBundle';
import { createSelectors } from '@/features/shared/utils/createSelectors';

type FeedState = {
  bundles: TravelBundle[];
};

const useFeedStoreBase = create<FeedState>(() => ({
  bundles: generateBundles(120),
}));

export const useFeedStore = createSelectors(useFeedStoreBase);
