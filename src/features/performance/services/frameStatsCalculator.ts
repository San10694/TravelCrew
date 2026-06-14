export type FrameStats = {
  p50FrameTime: number;
  p95FrameTime: number;
  worstFrameTime: number;
};

function quickselect(values: number[], k: number): number {
  const arr = values.slice();

  const partition = (left: number, right: number): number => {
    const pivot = arr[right] as number;
    let storeIndex = left;

    for (let index = left; index < right; index += 1) {
      if ((arr[index] as number) < pivot) {
        const temp = arr[storeIndex] as number;
        arr[storeIndex] = arr[index] as number;
        arr[index] = temp;
        storeIndex += 1;
      }
    }

    const pivotValue = arr[storeIndex] as number;
    arr[storeIndex] = arr[right] as number;
    arr[right] = pivotValue;

    return storeIndex;
  };

  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const pivotIndex = partition(left, right);

    if (pivotIndex === k) {
      return arr[k] as number;
    }

    if (pivotIndex < k) {
      left = pivotIndex + 1;
    } else {
      right = pivotIndex - 1;
    }
  }

  return arr[k] as number;
}

export function calculateFrameStats(samples: number[]): FrameStats {
  if (samples.length === 0) {
    return {
      p50FrameTime: 0,
      p95FrameTime: 0,
      worstFrameTime: 0,
    };
  }

  const p50Index = Math.floor(samples.length * 0.5);
  const p95Index = Math.min(samples.length - 1, Math.floor(samples.length * 0.95));

  const p50FrameTime = quickselect(samples, p50Index);
  const p95FrameTime = quickselect(samples, p95Index);
  const worstFrameTime = Math.max(...samples);

  return {
    p50FrameTime: Math.round(p50FrameTime * 10) / 10,
    p95FrameTime: Math.round(p95FrameTime * 10) / 10,
    worstFrameTime: Math.round(worstFrameTime * 10) / 10,
  };
}
