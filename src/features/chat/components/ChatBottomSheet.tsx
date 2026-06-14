import BottomSheet, {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  type BottomSheetFooterProps,
} from '@gorhom/bottom-sheet';
import {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  type Ref,
} from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ChatMessageList } from '@/features/chat/components/ChatMessageList';
import { ChatSheetFooter } from '@/features/chat/components/ChatSheetFooter';
import { ChatSheetProvider } from '@/features/chat/context/ChatSheetContext';
import { colors, radii, shadows } from '@/features/shared/constants/theme';

export type ChatBottomSheetRef = {
  open: () => void;
  close: () => void;
};

type ChatBottomSheetProps = {
  onOpenChange?: (isOpen: boolean) => void;
};

function ChatBottomSheetComponent(
  { onOpenChange }: ChatBottomSheetProps,
  ref: Ref<ChatBottomSheetRef>,
) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();

  const snapPoints = useMemo(() => ['50%', '92%'], []);

  const open = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(0);
  }, []);

  const close = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  useImperativeHandle(ref, () => ({ open, close }), [close, open]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.2}
        pressBehavior="none"
        enableTouchThrough
      />
    ),
    [],
  );

  const renderFooter = useCallback(
    (props: BottomSheetFooterProps) => <ChatSheetFooter {...props} />,
    [],
  );

  const handleSheetChange = useCallback(
    (index: number) => {
      onOpenChange?.(index >= 0);
    },
    [onOpenChange],
  );

  return (
    <ChatSheetProvider>
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        enablePanDownToClose
        topInset={insets.top}
        keyboardBehavior="extend"
        keyboardBlurBehavior="restore"
        android_keyboardInputMode="adjustResize"
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
}

export const ChatBottomSheet = memo(forwardRef(ChatBottomSheetComponent));

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
