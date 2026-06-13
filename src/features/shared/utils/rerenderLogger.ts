import { useRef } from 'react';

export function useRerenderLogger(componentName: string): void {
  const count = useRef(0);

  if (__DEV__) {
    count.current += 1;
    console.log(`[Rerender] ${componentName} #${count.current}`);
  }
}
