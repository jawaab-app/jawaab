import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { ChoiceRow, OnboardingFrame } from '@/components/onboarding';
import { PUBLISHERS } from '@/data/onboarding';
import { usePrefs } from '@/store/prefs';
import { fonts, useTheme } from '@/theme';

export default function PublishersScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { prefs, update } = usePrefs();
  const next = () => router.push('/onboarding/done');

  const toggle = (key: string) =>
    update({ publishers: prefs.publishers.includes(key) ? prefs.publishers.filter((p) => p !== key) : [...prefs.publishers, key] });

  return (
    <OnboardingFrame
      step={5}
      title="Whose answers do you trust?"
      subtitle="Choose the publishers you already read. Their answers rank higher; nothing is hidden."
      primaryLabel="Continue"
      onPrimary={next}
      onSkip={next}
    >
      {PUBLISHERS.map((p) => (
        <ChoiceRow
          key={p.key}
          multi
          title={p.name}
          detail={`${p.schools} · ${p.region}`}
          selected={prefs.publishers.includes(p.key)}
          onPress={() => toggle(p.key)}
        />
      ))}
    </OnboardingFrame>
  );
}
