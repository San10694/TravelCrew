import { BottomSheetTextInput } from '@gorhom/bottom-sheet';
import { memo, useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/features/shared/constants/theme';

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
      <BottomSheetTextInput
        value={value}
        onChangeText={setValue}
        placeholder="Ask about destinations, budgets, or trip types..."
        placeholderTextColor={colors.textSecondary}
        style={styles.input}
        multiline
        editable={!disabled}
      />
      <Pressable
        onPress={handleSend}
        style={[styles.sendButton, disabled && styles.sendButtonDisabled]}
        disabled={disabled}
      >
        <Text style={styles.sendLabel}>Send</Text>
      </Pressable>
    </View>
  );
}

export const ChatInput = memo(ChatInputComponent);

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    borderTopColor: colors.border,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  input: {
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    color: colors.text,
    flex: 1,
    fontSize: typography.body,
    maxHeight: 100,
    minHeight: 44,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  sendButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendLabel: {
    color: colors.surface,
    fontSize: typography.body,
    fontWeight: '600',
  },
});
