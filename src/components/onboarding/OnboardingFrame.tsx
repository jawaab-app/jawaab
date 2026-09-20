import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from '../Button';
import { IconButton } from '../IconButton';
import { fonts, space, type, useTheme } from '@/theme';

export const ONBOARDING_STEPS = 3;

interface Props {
  step: number; // 1-based
  title: string;
  hint?: string; // one short line under the title
  children: ReactNode;
  primaryLabel: string;
  onPrimary: () => void;
  primaryDisabled?: boolean;
  onSkip?: () => void;
}

export function OnboardingFrame({ step, title, hint, children, primaryLabel, onPrimary, primaryDisabled, onSkip }: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.root, { backgroundColor: colors.paper, paddingTop: insets.top + 8 }]}>
      <View style={styles.nav}>
        <IconButton name="chevron-back" label="Back" onPress={() => router.back()} />
        <View style={styles.dots}>
          {Array.from({ length: ONBOARDING_STEPS }, (_, i) => (
            <View key={i} style={[styles.dot, { backgroundColor: i < step ? colors.ink : colors.hair }]} />
          ))}
        </View>
        <View style={styles.navSide}>
          {onSkip && (
            <Pressable onPress={onSkip} hitSlop={12}>
              <Text style={[styles.skip, { color: colors.ink2 }]}>Skip</Text>
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Animated.View entering={FadeInDown.duration(360)}>
          <Text style={[type.largeTitle, { color: colors.ink }]}>{title}</Text>
          {hint ? <Text style={[type.body, { color: colors.ink2, marginTop: 6 }]}>{hint}</Text> : null}
        </Animated.View>
        <View style={{ marginTop: 28 }}>{children}</View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) + 8 }]}>
        <Button label={primaryLabel} onPress={onPrimary} disabled={primaryDisabled} />
      </View>
    </View>
  );
}

export { Button as PrimaryButton } from '../Button';

const styles = StyleSheet.create({
  root: { flex: 1 },
  nav: { height: 44, paddingHorizontal: space.gutter, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  navSide: { width: 44, alignItems: 'flex-end' },
  dots: { flexDirection: 'row', gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 3 },
  skip: { fontFamily: fonts.medium, fontSize: 15, letterSpacing: -0.3 },
  content: { paddingHorizontal: space.gutter, paddingTop: 28, paddingBottom: 24 },
  footer: { paddingHorizontal: space.gutter, paddingTop: 10 },
});
