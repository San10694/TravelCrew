import type { FlashListProps } from '@shopify/flash-list';

/**
 * FlashList v2 auto-sizes on New Architecture. estimatedItemSize is retained
 * for spec compliance and documents intended row height for profiling.
 */
export type FlashListPropsWithEstimate<T> = FlashListProps<T> & {
  estimatedItemSize?: number;
};

export function withEstimatedItemSize<T>(
  props: FlashListProps<T>,
  estimatedItemSize: number,
): FlashListPropsWithEstimate<T> {
  return {
    ...props,
    estimatedItemSize,
  };
}
