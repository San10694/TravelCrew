import 'react-native-gesture-handler';

import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  useFonts,
} from '@expo-google-fonts/plus-jakarta-sans';
import { Slot } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import {
  ChatBottomSheet,
  type ChatBottomSheetRef,
} from '@/features/chat/components/ChatBottomSheet';
import { FeedFab } from '@/features/feed/components/FeedFab';
import { PerformanceMetricsProvider } from '@/features/performance/context/PerformanceMetricsContext';
import { DevOverlayToggle } from '@/features/performance/components/DevOverlayToggle';
import { PerformanceOverlay } from '@/features/performance/components/PerformanceOverlay';
import { usePerformanceInstrumentation } from '@/features/performance/hooks/usePerformanceInstrumentation';

SplashScreen.preventAutoHideAsync();

function PerformanceInstrumentation() {
  usePerformanceInstrumentation();
  return null;
}

export default function RootLayout() {
  const chatSheetRef = useRef<ChatBottomSheetRef>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  const openChat = useCallback(() => {
    chatSheetRef.current?.open();
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <PerformanceMetricsProvider>
          <PerformanceInstrumentation />
          <Slot />
          <View style={styles.overlay} pointerEvents="box-none">
            <FeedFab onPress={openChat} visible={!isChatOpen} />
            <ChatBottomSheet ref={chatSheetRef} onOpenChange={setIsChatOpen} />
            {__DEV__ ? (
              <>
                <DevOverlayToggle />
                <PerformanceOverlay />
              </>
            ) : null}
          </View>
        </PerformanceMetricsProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
  },
  root: {
    flex: 1,
  },
});
