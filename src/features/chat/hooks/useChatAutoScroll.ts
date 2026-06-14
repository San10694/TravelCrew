import {
  useScrollEventsHandlersDefault,
  type BottomSheetScrollViewMethods,
  type ScrollEventsHandlersHookType,
} from '@gorhom/bottom-sheet';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { Keyboard, Platform, type NativeScrollEvent } from 'react-native';
import { runOnJS } from 'react-native-reanimated';

import type { Message } from '@/features/chat/types/message';

const NEAR_BOTTOM_THRESHOLD = 120;
const SCROLL_RETRY_DELAYS_MS = [0, 50, 150] as const;

type ScrollEventContext = {
  initialContentOffsetY: number;
  shouldLockInitialPosition: boolean;
};

type UseChatAutoScrollParams = {
  messages: Message[];
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

export function useChatAutoScroll({ messages, isStreaming }: UseChatAutoScrollParams) {
  const scrollRef = useRef<BottomSheetScrollViewMethods>(null);
  const isNearBottomRef = useRef(true);
  const scrollGenerationRef = useRef(0);

  const lastMessage = messages.at(-1);
  const lastMessageSignature = lastMessage
    ? `${lastMessage.id}:${lastMessage.content.length}`
    : '';

  const updateNearBottom = useCallback((isNearBottom: boolean) => {
    isNearBottomRef.current = isNearBottom;
  }, []);

  const scrollEventsHandlersHook = useMemo(
    () => createChatScrollEventsHandlers(updateNearBottom),
    [updateNearBottom],
  );

  const scrollToLatest = useCallback(({ animated = true }: ScrollOptions = {}) => {
    const generation = ++scrollGenerationRef.current;

    for (const delay of SCROLL_RETRY_DELAYS_MS) {
      setTimeout(() => {
        if (generation !== scrollGenerationRef.current) {
          return;
        }

        scrollRef.current?.scrollToEnd({ animated });
      }, delay);
    }
  }, []);

  const onContentSizeChange = useCallback(() => {
    if (!isNearBottomRef.current) {
      return;
    }

    scrollToLatest({ animated: !isStreaming });
  }, [isStreaming, scrollToLatest]);

  useEffect(() => {
    const last = messages.at(-1);
    if (!last) {
      return;
    }

    if (last.role === 'user') {
      isNearBottomRef.current = true;
      scrollToLatest({ animated: true });
      return;
    }

    if (isNearBottomRef.current) {
      scrollToLatest({ animated: !isStreaming });
    }
  }, [messages, lastMessageSignature, isStreaming, scrollToLatest]);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const subscription = Keyboard.addListener(showEvent, () => {
      if (isNearBottomRef.current) {
        scrollToLatest({ animated: true });
      }
    });

    return () => subscription.remove();
  }, [scrollToLatest]);

  return {
    scrollRef,
    onContentSizeChange,
    scrollEventsHandlersHook,
  };
}
