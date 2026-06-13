import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { memo, useCallback, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import {
  colors,
  fontFamily,
  layout,
  radii,
  shadows,
  spacing,
  typography,
} from '@/features/shared/constants/theme';

type ChatInputProps = {
  onSend: (message: string) => void;
  disabled?: boolean;
};

function ChatInputComponent({ onSend, disabled = false }: ChatInputProps) {
  const [value, setValue] = useState('');

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || disabled) {
      return;
    }

    onSend(trimmed);
    setValue('');
  }, [disabled, onSend, value]);

  return (
    <View style={styles.container}>
      <View style={styles.composer}>
        <BottomSheetTextInput
          value={value}
          onChangeText={setValue}
          placeholder="Ask about destinations, budgets, or trip types..."
          placeholderTextColor={colors.textMuted}
          style={styles.input}
          multiline
          editable={!disabled}
          textAlignVertical="center"
        />
        <Pressable
          onPress={handleSend}
          style={({ pressed }) => [
            styles.sendButton,
            disabled && styles.sendButtonDisabled,
            pressed && styles.sendButtonPressed,
          ]}
          disabled={disabled}
          accessibilityLabel="Send message"
        >
          <Text style={styles.sendIcon}>↑</Text>
        </Pressable>
      </View>
    </View>
  );
}

export const ChatInput = memo(ChatInputComponent);

const styles = StyleSheet.create({
  composer: {
    alignItems: 'center',
    backgroundColor: colors.inputBackground,
    borderRadius: radii.pill,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingLeft: spacing.md,
    paddingRight: spacing.xs,
    paddingVertical: spacing.xs,
    ...shadows.input,
  },
  container: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  input: {
    color: colors.text,
    flex: 1,
    fontFamily: fontFamily.regular,
    fontSize: typography.body,
    maxHeight: 100,
    minHeight: layout.inputHeight - spacing.sm,
    paddingVertical: Platform.OS === 'ios' ? spacing.sm : spacing.xs,
  },
  sendButton: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: radii.pill,
    height: layout.inputHeight,
    justifyContent: 'center',
    width: layout.inputHeight,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonPressed: {
    opacity: 0.85,
  },
  sendIcon: {
    color: colors.surface,
    fontFamily: fontFamily.bold,
    fontSize: 18,
    lineHeight: 20,
  },
});
