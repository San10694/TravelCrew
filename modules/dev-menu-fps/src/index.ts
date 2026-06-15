/**
 * JS bridge for the dev-menu-fps Expo native module.
 *
 * Responsibility: lazy-load the native module in __DEV__ only and expose a safe API
 * for UI FPS monitoring. Returns no-ops when unavailable (Expo Go, web, production).
 *
 * UI FPS is sampled natively (CADisplayLink / Choreographer). JS FPS is measured
 * separately in jsFpsCounter.ts via requestAnimationFrame.
 */
import { requireNativeModule } from 'expo-modules-core';
import { Platform } from 'react-native';

export type FpsUpdateEvent = {
  uiFps: number;
};

type FpsUpdateSubscription = {
  remove: () => void;
};

type DevMenuFpsNativeModule = {
  getMaxRefreshRate: () => number;
  startMonitoring: () => void;
  stopMonitoring: () => void;
  addListener: (
    eventName: 'onFpsUpdate',
    listener: (event: FpsUpdateEvent) => void,
  ) => FpsUpdateSubscription;
  removeListeners: (count: number) => void;
};

const isNativeSupported = Platform.OS === 'ios' || Platform.OS === 'android';

let nativeModule: DevMenuFpsNativeModule | null = null;

function getNativeModule(): DevMenuFpsNativeModule | null {
  if (!__DEV__ || !isNativeSupported) {
    return null;
  }

  if (nativeModule === null) {
    try {
      nativeModule = requireNativeModule<DevMenuFpsNativeModule>('DevMenuFps');
    } catch {
      nativeModule = null;
    }
  }

  return nativeModule;
}

export function isDevMenuFpsAvailable(): boolean {
  return getNativeModule() !== null;
}

export function getMaxRefreshRate(): number {
  return getNativeModule()?.getMaxRefreshRate() ?? 60;
}

export function startMonitoring(): void {
  getNativeModule()?.startMonitoring();
}

export function stopMonitoring(): void {
  getNativeModule()?.stopMonitoring();
}

export function addFpsUpdateListener(
  listener: (event: FpsUpdateEvent) => void,
): FpsUpdateSubscription {
  const module = getNativeModule();

  if (module === null) {
    return { remove: () => {} };
  }

  return module.addListener('onFpsUpdate', listener);
}
