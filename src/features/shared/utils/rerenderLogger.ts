import { useRef } from 'react';

import { ENABLE_RERENDER_LOGS } from '@/features/shared/constants/devFlags';

export function useRerenderLogger(componentName: string): void {
  const count = useRef(0);

  if (__DEV__ && ENABLE_RERENDER_LOGS) {
    count.current += 1;
    console.log(`[Rerender] ${componentName} #${count.current}`);
  }
}
