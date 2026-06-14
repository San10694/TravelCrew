import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  useFonts,
} from '@expo-google-fonts/plus-jakarta-sans';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';

import type { ChatBottomSheetRef } from '@/components/organisms/chat/ChatBottomSheet';

SplashScreen.preventAutoHideAsync();

type AppShellViewModel = {
  fontsLoaded: boolean;
  chatSheetRef: RefObject<ChatBottomSheetRef | null>;
  openChat: () => void;
  isChatOpen: boolean;
  setIsChatOpen: (isOpen: boolean) => void;
};

export function useAppShell(): AppShellViewModel {
  const chatSheetRef = useRef<ChatBottomSheetRef>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  const openChat = useCallback(() => {
    setIsChatOpen(true);
    chatSheetRef.current?.open();
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  return {
    fontsLoaded,
    chatSheetRef,
    openChat,
    isChatOpen,
    setIsChatOpen,
  };
}
