
import { AnimatedFab } from '@/components/molecules/common/AnimatedFab';

type FeedFabProps = {
  onPress: () => void;
  visible?: boolean;
};

export function FeedFab({ onPress, visible = true }: FeedFabProps) {
  return (
    <AnimatedFab label="Ask Crew" icon="✦" onPress={onPress} visible={visible} />
  );
}

