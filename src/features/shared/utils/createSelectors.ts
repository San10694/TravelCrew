import type { StoreApi, UseBoundStore } from 'zustand';

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

export function createSelectors<S extends UseBoundStore<StoreApi<object>>>(
  store: S,
): WithSelectors<S> {
  const storeWithSelectors = store as WithSelectors<S>;
  storeWithSelectors.use = {} as WithSelectors<S>['use'];

  for (const key of Object.keys(store.getState())) {
    (storeWithSelectors.use as Record<string, () => unknown>)[key] = () =>
      store((state) => state[key as keyof typeof state]);
  }

  return storeWithSelectors;
}
