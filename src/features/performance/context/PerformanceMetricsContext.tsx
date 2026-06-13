import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { type SharedValue, useSharedValue } from 'react-native-reanimated';

export type PerformanceMetricsContextValue = {
  uiFpsText: SharedValue<string>;
  jsFpsText: SharedValue<string>;
  jsThreadStatusText: SharedValue<string>;
  frameDropsCount: SharedValue<number>;
};

const PerformanceMetricsContext = createContext<PerformanceMetricsContextValue | null>(null);

type PerformanceMetricsProviderProps = {
  children: ReactNode;
};

export function PerformanceMetricsProvider({ children }: PerformanceMetricsProviderProps) {
  const uiFpsText = useSharedValue('60');
  const jsFpsText = useSharedValue('60');
  const jsThreadStatusText = useSharedValue('Healthy');
  const frameDropsCount = useSharedValue(0);

  const value = useMemo(
    () => ({
      uiFpsText,
      jsFpsText,
      jsThreadStatusText,
      frameDropsCount,
    }),
    [frameDropsCount, jsFpsText, jsThreadStatusText, uiFpsText],
  );

  return (
    <PerformanceMetricsContext.Provider value={value}>
      {children}
    </PerformanceMetricsContext.Provider>
  );
}

export function usePerformanceMetrics(): PerformanceMetricsContextValue {
  const context = useContext(PerformanceMetricsContext);

  if (context === null) {
    throw new Error('usePerformanceMetrics must be used within PerformanceMetricsProvider');
  }

  return context;
}
