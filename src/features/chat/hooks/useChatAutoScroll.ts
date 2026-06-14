import {
  useScrollEventsHandlersDefault,
  type BottomSheetFlatListMethods,
  type ScrollEventsHandlersHookType,
} from '@gorhom/bottom-sheet';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { NativeScrollEvent } from 'react-native';
import { runOnJS } from 'react-native-reanimated';

import type { Message } from '@/features/chat/types/message';

const NEAR_BOTTOM_THRESHOLD = 120;

type ScrollEventContext = {
  initialContentOffsetY: number;
  shouldLockInitialPosition: boolean;
};

type UseChatAutoScrollParams = {
  messages: Message[];
  isThinking: boolean;
  isStreaming: boolean;
};

type ScrollOptions = {
  animated?: boolean;
};

function createChatScrollEventsHandlers(
  onNearBottomChange: (isNearBottom: boolean) => void,
): ScrollEventsHandlersHookType {
  return (scrollableRef, scrollableContentOffsetY) => {
    const defaultHandlers = useScrollEventsHandlersDefault(
      scrollableRef,
      scrollableContentOffsetY,
    );

    const handleOnScroll = useCallback(
      (event: NativeScrollEvent, context: ScrollEventContext) => {
        'worklet';
        const defaultOnScroll = defaultHandlers.handleOnScroll as
          | ((payload: NativeScrollEvent, ctx: ScrollEventContext) => void)
          | undefined;
        defaultOnScroll?.(event, context);

        const distanceFromBottom =
          event.contentSize.height -
          event.layoutMeasurement.height -
          event.contentOffset.y;

        runOnJS(onNearBottomChange)(distanceFromBottom <= NEAR_BOTTOM_THRESHOLD);
      },
      [defaultHandlers.handleOnScroll, onNearBottomChange],
    );

    return {
      ...defaultHandlers,
      handleOnScroll,
    };
  };
}

export function useChatAutoScroll({
  messages,
  isThinking,
  isStreaming,
}: UseChatAutoScrollParams) {
  const listRef = useRef<BottomSheetFlatListMethods>(null);
  const isNearBottomRef = useRef(true);
  const forceScrollRef = useRef(false);
  const wasStreamingRef = useRef(false);

  const updateNearBottom = useCallback((isNearBottom: boolean) => {
    isNearBottomRef.current = isNearBottom;
  }, []);

  const scrollEventsHandlersHook = useMemo(
    () => createChatScrollEventsHandlers(updateNearBottom),
    [updateNearBottom],
  );

  const scrollToLatest = useCallback(({ animated = true }: ScrollOptions = {}) => {
    listRef.current?.scrollToEnd({ animated });
  }, []);

  const onContentSizeChange = useCallback(() => {
    if (!isNearBottomRef.current && !forceScrollRef.current) {
      return;
    }

    scrollToLatest({ animated: forceScrollRef.current || !isStreaming });
    forceScrollRef.current = false;
  }, [isStreaming, scrollToLatest]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];

    if (lastMessage?.role !== 'user') {
      return;
    }

    forceScrollRef.current = true;
    isNearBottomRef.current = true;
    scrollToLatest({ animated: true });
  }, [messages, scrollToLatest]);

  useEffect(() => {
    if (!isThinking || !isNearBottomRef.current) {
      return;
    }

    scrollToLatest({ animated: true });
  }, [isThinking, scrollToLatest]);

  useEffect(() => {
    if (wasStreamingRef.current && !isStreaming && isNearBottomRef.current) {
      scrollToLatest({ animated: true });
    }

    wasStreamingRef.current = isStreaming;
  }, [isStreaming, scrollToLatest]);

  return {
    listRef,
    onContentSizeChange,
    scrollEventsHandlersHook,
  };
}
