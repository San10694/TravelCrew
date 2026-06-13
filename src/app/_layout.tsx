import 'react-native-gesture-handler';

import { Slot } from 'expo-router';
import { useCallback, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import {
  ChatBottomSheet,
  type ChatBottomSheetRef,
} from '@/features/chat/components/ChatBottomSheet';
import { FeedFab } from '@/features/feed/components/FeedFab';
import { DevOverlayToggle } from '@/features/performance/components/DevOverlayToggle';
import { PerformanceOverlay } from '@/features/performance/components/PerformanceOverlay';
import { usePerformanceInstrumentation } from '@/features/performance/hooks/usePerformanceInstrumentation';

export default function RootLayout() {
  const chatSheetRef = useRef<ChatBottomSheetRef>(null);

  usePerformanceInstrumentation();

  const openChat = useCallback(() => {
    chatSheetRef.current?.open();
  }, []);

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <Slot />
        <View style={styles.overlay} pointerEvents="box-none">
          <FeedFab onPress={openChat} />
          <ChatBottomSheet ref={chatSheetRef} />
          {__DEV__ ? (
            <>
              <DevOverlayToggle />
              <PerformanceOverlay />
            </>
          ) : null}
        </View>
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
