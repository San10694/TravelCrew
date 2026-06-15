/**
 * Global overlay layer mounted above all screens in root layout.
 *
 * Renders FeedFab (Ask Travel Crew), ChatBottomSheet, and __DEV__ performance HUD.
 * Uses pointerEvents="box-none" so touches pass through to the feed except on controls.
 */
import { type RefObject } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  ChatBottomSheet,
  type ChatBottomSheetRef,
} from '@/components/organisms/chat/ChatBottomSheet';
import { FeedFab } from '@/components/organisms/feed/FeedFab';
import { DevOverlayToggle } from '@/components/organisms/performance/DevOverlayToggle';
import { PerformanceOverlay } from '@/components/organisms/performance/PerformanceOverlay';

type AppOverlaysProps = {
  chatSheetRef: RefObject<ChatBottomSheetRef | null>;
  openChat: () => void;
  isChatOpen: boolean;
  onChatOpenChange: (isOpen: boolean) => void;
};

export function AppOverlays({
  chatSheetRef,
  openChat,
  isChatOpen,
  onChatOpenChange,
}: AppOverlaysProps) {
  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <FeedFab onPress={openChat} visible={!isChatOpen} />
      <ChatBottomSheet ref={chatSheetRef} onOpenChange={onChatOpenChange} />
      {__DEV__ ? (
        <>
          <DevOverlayToggle />
          <PerformanceOverlay />
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
  },
});
