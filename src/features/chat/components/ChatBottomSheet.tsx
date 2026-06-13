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

import { ChatMessageList } from '@/features/chat/components/ChatMessageList';
import { ChatSheetFooter } from '@/features/chat/components/ChatSheetFooter';
import { colors } from '@/features/shared/constants/theme';

export type ChatBottomSheetRef = {
  open: () => void;
  close: () => void;
};

function ChatBottomSheetComponent(_: object, ref: Ref<ChatBottomSheetRef>) {
  const bottomSheetRef = useRef<BottomSheet>(null);

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
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.45} />
    ),
    [],
  );

  const renderFooter = useCallback(
    (props: BottomSheetFooterProps) => <ChatSheetFooter {...props} />,
    [],
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      enablePanDownToClose
      keyboardBehavior="interactive"
      android_keyboardInputMode="adjustResize"
      backdropComponent={renderBackdrop}
      footerComponent={renderFooter}
      backgroundStyle={styles.sheetBackground}
      handleIndicatorStyle={styles.handle}
      style={styles.sheet}
    >
      <ChatMessageList />
    </BottomSheet>
  );
}

export const ChatBottomSheet = memo(forwardRef(ChatBottomSheetComponent));

const styles = StyleSheet.create({
  handle: {
    backgroundColor: colors.border,
    width: 40,
  },
  sheet: {
    zIndex: 100,
  },
  sheetBackground: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
});
