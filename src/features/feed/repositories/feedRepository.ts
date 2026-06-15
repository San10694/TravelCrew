/**
 * Feed data layer. Simulates async API fetch then returns generated bundles.
 * Swap generateBundles() for a real HTTP client without changing the ViewModel.
 */
import { generateBundles } from '@/features/feed/data/generateBundles';
import type { TravelBundle } from '@/features/feed/types/travelBundle';
import { FEED_SIMULATED_LOAD_MS } from '@/features/shared/constants/loadingTimings';

export async function loadFeedBundles(): Promise<TravelBundle[]> {
  await new Promise<void>((resolve) => {
    setTimeout(resolve, FEED_SIMULATED_LOAD_MS);
  });

  return generateBundles(120);
}
