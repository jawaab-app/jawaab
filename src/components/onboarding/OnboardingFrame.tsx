import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fonts, space, type, useTheme } from '@/theme';

export const ONBOARDING_STEPS = 6;

interface Props {
  step: number; // 1-based, for the progress row
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
    <View style={[styles.root, { backgroundColor: colors.paper, paddingTop: insets.top }]}>
      <View style={styles.nav}>
        <Pressable onPress={() => router.back()} hitSlop={12} accessibilityLabel="Back" style={styles.navSide}>
          <Ionicons name="chevron-back" size={26} color={colors.ink} />
        </Pressable>
        <View style={styles.dots}>
          {Array.from({ length: ONBOARDING_STEPS }, (_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                { backgroundColor: i < step ? colors.accent : colors.hair },
                i === step - 1 && styles.dotActive,
              ]}
            />
          ))}
        </View>
        <View style={[styles.navSide, { alignItems: 'flex-end' }]}>
          {onSkip && (
            <Pressable onPress={onSkip} hitSlop={12}>
              <Text style={[styles.skip, { color: colors.ink2 }]}>{skipLabel}</Text>
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <Text style={[type.h1, { color: colors.ink }]}>{title}</Text>
        {subtitle && <Text style={[type.body, { color: colors.ink2, marginTop: 10 }]}>{subtitle}</Text>}
        <View style={{ marginTop: 26 }}>{children}</View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) + 8 }]}>
        <PrimaryButton label={primaryLabel} onPress={onPrimary} disabled={primaryDisabled} />
      </View>
    </View>
  );
}

export function PrimaryButton({ label, onPress, disabled }: { label: string; onPress: () => void; disabled?: boolean }) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: colors.accent, opacity: disabled ? 0.35 : pressed ? 0.85 : 1 },
      ]}
    >
      <Text style={[styles.buttonText, { color: '#FFFFFF' }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  nav: { height: 52, paddingHorizontal: space.gutter - 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  navSide: { width: 60, justifyContent: 'center' },
  dots: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  dot: { width: 6, height: 6, borderRadius: 3 },
  dotActive: { width: 18 },
  skip: { fontFamily: fonts.medium, fontSize: 15 },
  content: { paddingHorizontal: space.gutter, paddingTop: 18, paddingBottom: 24 },
  footer: { paddingHorizontal: space.gutter, paddingTop: 10 },
  button: { height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center' },
  buttonText: { fontFamily: fonts.semibold, fontSize: 16.5 },
});
