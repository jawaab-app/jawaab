import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, IconButton } from '@/components';
import { fonts, space, type, useTheme } from '@/theme';

export const ONBOARDING_STEPS = 6;

interface Props {
  step: number;
  title: string;
  subtitle?: string;
  children: ReactNode;
  primaryLabel: string;
  onPrimary: () => void;
  primaryDisabled?: boolean;
  onSkip?: () => void;
  skipLabel?: string;
}

export function OnboardingFrame({ step, title, subtitle, children, primaryLabel, onPrimary, primaryDisabled, onSkip, skipLabel = 'Skip' }: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={[styles.root, { backgroundColor: colors.paper, paddingTop: insets.top + 8 }]}>
      <View style={styles.nav}>
        <IconButton name="chevron-back" label="Back" onPress={() => router.back()} />
        <Text style={[type.meta, { color: colors.ink3 }]}>
          {step - 1} / {ONBOARDING_STEPS - 1}
        </Text>
        <View style={styles.navSide}>
          {onSkip && (
            <Pressable onPress={onSkip} hitSlop={12}>
              <Text style={[styles.skip, { color: colors.ink }]}>{skipLabel}</Text>
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Text style={[type.largeTitle, { color: colors.ink }]}>{title}</Text>
        {subtitle && <Text style={[type.body, { color: colors.ink2, marginTop: 10 }]}>{subtitle}</Text>}
        <View style={{ marginTop: 32 }}>{children}</View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) + 8 }]}>
        <Button label={primaryLabel} onPress={onPrimary} disabled={primaryDisabled} />
      </View>
    </View>
  );
}

export { Button as PrimaryButton } from '@/components';

const styles = StyleSheet.create({
  root: { flex: 1 },
  nav: { height: 44, paddingHorizontal: space.gutter, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  navSide: { width: 44, alignItems: 'flex-end' },
  skip: { fontFamily: fonts.medium, fontSize: 15, letterSpacing: -0.3 },
  content: { paddingHorizontal: space.gutter, paddingTop: 28, paddingBottom: 24 },
  footer: { paddingHorizontal: space.gutter, paddingTop: 10 },
});
