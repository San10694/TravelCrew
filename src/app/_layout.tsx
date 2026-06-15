/**
 * Root Expo Router layout.
 *
 * Wires global providers (gesture handler, safe area, performance metrics),
 * bootstraps fonts/splash via useAppShell, and mounts AppOverlays above all routes.
 * Screen content renders through <Slot />; overlays (chat sheet, FAB, dev perf HUD) sit on top.
 */
import 'react-native-gesture-handler';

import { Slot } from 'expo-router';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AppOverlays } from '@/components/organisms/common/AppOverlays';
import { PerformanceMetricsProvider } from '@/features/performance/context/PerformanceMetricsContext';
import { usePerformanceInstrumentation } from '@/features/performance/hooks/usePerformanceInstrumentation';
import { useAppShell } from '@/features/shared/hooks/useAppShell';

function PerformanceInstrumentation() {
  usePerformanceInstrumentation();
  return null;
}

export default function RootLayout() {
  const { fontsLoaded, chatSheetRef, openChat, isChatOpen, setIsChatOpen } = useAppShell();

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <PerformanceMetricsProvider>
          <PerformanceInstrumentation />
          <Slot />
          <AppOverlays
            chatSheetRef={chatSheetRef}
            openChat={openChat}
            isChatOpen={isChatOpen}
            onChatOpenChange={setIsChatOpen}
          />
        </PerformanceMetricsProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
