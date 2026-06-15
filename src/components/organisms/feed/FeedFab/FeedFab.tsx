/** Feed FAB — opens Travel Crew chat via AnimatedFab; hidden while chat sheet is open. */

import { AnimatedFab } from '@/components/molecules/common/AnimatedFab';

type FeedFabProps = {
  onPress: () => void;
  visible?: boolean;
};

export function FeedFab({ onPress, visible = true }: FeedFabProps) {
  return (
    <AnimatedFab label="Ask Travel Crew" icon="✦" onPress={onPress} visible={visible} />
  );
}

