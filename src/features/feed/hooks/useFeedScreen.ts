import { useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { loadFeedBundles } from '@/features/feed/repositories/feedRepository';
import { useFeedStore } from '@/features/feed/store/feedStore';
import type { TravelBundle } from '@/features/feed/types/travelBundle';
import { layout, spacing } from '@/features/shared/constants/theme';

type FeedScreenViewModel = {
  bundles: TravelBundle[];
  isReady: boolean;
  contentBottomPadding: number;
};

export function useFeedScreen(): FeedScreenViewModel {
  const bundles = useFeedStore((state) => state.bundles);
  const status = useFeedStore((state) => state.status);
  const setBundles = useFeedStore((state) => state.setBundles);
  const setStatus = useFeedStore((state) => state.setStatus);
  const insets = useSafeAreaInsets();

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

  return {
    bundles,
    isReady: status === 'ready',
    contentBottomPadding: layout.fabSize + spacing.lg * 2 + insets.bottom,
  };
}
