import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { OnboardingFrame, TraceCard } from '@/components/onboarding';
import { type, useTheme } from '@/theme';

export default function TraceScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <OnboardingFrame step={1} title="Every answer is traced." primaryLabel="Continue" onPrimary={() => router.push('/onboarding/school')}>
      <Animated.View entering={FadeInDown.duration(360).delay(120)}>
        <TraceCard open={open} onToggle={() => setOpen((o) => !o)} />
      </Animated.View>
      <Animated.Text key={open ? 'after' : 'before'} entering={FadeIn.duration(300)} style={[type.body, { color: colors.ink2, marginTop: 18 }]}>
        {open ? 'Every answer in Jawāb carries this. Nothing is rewritten.' : 'Tap the byline.'}
      </Animated.Text>
    </OnboardingFrame>
  );
}
