import { memo, type RefObject } from 'react';
import { StyleSheet, View } from 'react-native';

import {
  ChatBottomSheet,
  type ChatBottomSheetRef,
} from '@/features/chat/components/ChatBottomSheet';
import { FeedFab } from '@/features/feed/components/FeedFab';
import { DevOverlayToggle } from '@/features/performance/components/DevOverlayToggle';
import { PerformanceOverlay } from '@/features/performance/components/PerformanceOverlay';

type AppOverlaysProps = {
  chatSheetRef: RefObject<ChatBottomSheetRef | null>;
  openChat: () => void;
  isChatOpen: boolean;
  onChatOpenChange: (isOpen: boolean) => void;
};

function AppOverlaysComponent({
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

export const AppOverlays = memo(AppOverlaysComponent);

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
  },
});
