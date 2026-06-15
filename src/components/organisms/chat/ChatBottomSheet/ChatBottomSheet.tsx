/**
 * Gorhom bottom sheet hosting the Travel Crew AI chat.
 *
 * Snap points 50% / 92%. Wraps children in ChatSheetProvider, uses footerComponent
 * for input. Exposes imperative open/close via ref for FeedFab.
 */
import BottomSheet, {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  type BottomSheetFooterProps,
} from '@gorhom/bottom-sheet';
import { forwardRef, useImperativeHandle, useRef, type Ref } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ChatMessageList } from '@/components/organisms/chat/ChatMessageList';
import { ChatSheetFooter } from '@/components/organisms/chat/ChatSheetFooter';
import { ChatSheetProvider } from '@/features/chat/context/ChatSheetContext';
import { colors, radii, shadows } from '@/features/shared/constants/theme';

export type ChatBottomSheetRef = {
  open: () => void;
  close: () => void;
};

type ChatBottomSheetProps = {
  onOpenChange?: (isOpen: boolean) => void;
};

const SNAP_POINTS = ['50%', '92%'];

export const ChatBottomSheet = forwardRef(function ChatBottomSheet(
  { onOpenChange }: ChatBottomSheetProps,
  ref: Ref<ChatBottomSheetRef>,
) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();

  function open() {
    bottomSheetRef.current?.snapToIndex(0);
  }

  function close() {
    bottomSheetRef.current?.close();
  }

  useImperativeHandle(ref, () => ({ open, close }));

  function renderBackdrop(props: BottomSheetBackdropProps) {
    return (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.2}
        pressBehavior="none"
        enableTouchThrough
      />
    );
  }

  function renderFooter(props: BottomSheetFooterProps) {
    return <ChatSheetFooter {...props} />;
  }

  function handleSheetChange(index: number) {
    onOpenChange?.(index >= 0);
  }

  return (
    <ChatSheetProvider>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={SNAP_POINTS}
        enableDynamicSizing={false}
        enablePanDownToClose
        topInset={insets.top}
        bottomInset={0}
        keyboardBehavior={Platform.OS === 'ios' ? 'extend' : 'interactive'}
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustPan"
        onChange={handleSheetChange}
        backdropComponent={renderBackdrop}
        footerComponent={renderFooter}
        backgroundStyle={styles.sheetBackground}
        handleIndicatorStyle={styles.handle}
        style={styles.sheet}
      >
        <ChatMessageList />
      </BottomSheet>
    </ChatSheetProvider>
  );
});

const styles = StyleSheet.create({
  handle: {
    backgroundColor: colors.textMuted,
    width: 40,
  },
  sheet: {
    zIndex: 100,
  },
  sheetBackground: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radii.xl,
    borderTopRightRadius: radii.xl,
    ...shadows.sheet,
  },
});
