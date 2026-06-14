import { useEffect, useState } from 'react';

import { FEED_SIMULATED_LOAD_MS } from '@/features/shared/constants/loadingTimings';

export function useSimulatedFeedLoad(): { isReady: boolean } {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsReady(true);
    }, FEED_SIMULATED_LOAD_MS);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  return { isReady };
}
