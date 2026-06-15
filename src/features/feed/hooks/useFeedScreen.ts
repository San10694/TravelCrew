/**
 * Feed screen ViewModel. Loads bundles on mount, exposes ready state and bottom padding
 * for FAB clearance. Subscribes to feedStore; triggers loadFeedBundles via repository.
 */
import { useCallback, useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { loadFeedBundles } from '@/features/feed/repositories/feedRepository';
import { useFeedStore } from '@/features/feed/store/feedStore';
import type { TravelBundle } from '@/features/feed/types/travelBundle';
import { layout, spacing } from '@/features/shared/constants/theme';

type FeedScreenViewModel = {
  bundles: TravelBundle[];
  isReady: boolean;
  isRefreshing: boolean;
  refresh: () => void;
  contentBottomPadding: number;
};

export function useFeedScreen(): FeedScreenViewModel {
  const bundles = useFeedStore((state) => state.bundles);
  const status = useFeedStore((state) => state.status);
  const setBundles = useFeedStore((state) => state.setBundles);
  const setStatus = useFeedStore((state) => state.setStatus);
  const insets = useSafeAreaInsets();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    let cancelled = false;

    setStatus('loading');

    loadFeedBundles()
      .then((loadedBundles) => {
        if (cancelled) {
          return;
        }

        setBundles(loadedBundles);
        setStatus('ready');
      })
      .catch(() => {
        if (cancelled) {
          return;
        }

        setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, [setBundles, setStatus]);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);

    try {
      const loadedBundles = await loadFeedBundles();
      setBundles(loadedBundles);
    } finally {
      setIsRefreshing(false);
    }
  }, [setBundles]);

  return {
    bundles,
    isReady: status === 'ready',
    isRefreshing,
    refresh,
    contentBottomPadding: layout.fabSize + spacing.lg * 2 + insets.bottom,
  };
}
