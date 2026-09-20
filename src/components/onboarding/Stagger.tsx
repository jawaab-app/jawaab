import type { ReactNode } from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';

// Rise-and-fade for list items, offset by index.
export function Stagger({ index, children }: { index: number; children: ReactNode }) {
  return <Animated.View entering={FadeInDown.duration(320).delay(80 + index * 45)}>{children}</Animated.View>;
}
