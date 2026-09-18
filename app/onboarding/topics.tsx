import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Chip, OnboardingFrame } from '@/components/onboarding';
import { TOPICS } from '@/data/onboarding';
import { usePrefs } from '@/store/prefs';
import { type, useTheme } from '@/theme';

export default function TopicsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { prefs, update } = usePrefs();
  const next = () => router.push('/onboarding/publishers');

  const toggle = (key: string) =>
    update({ topics: prefs.topics.includes(key) ? prefs.topics.filter((t) => t !== key) : [...prefs.topics, key] });

  return (
    <OnboardingFrame
      step={4}
      title="What do you ask about most?"
      subtitle="Pick a few. These shape what Trending shows you on the home screen."
      primaryLabel={prefs.topics.length ? `Continue with ${prefs.topics.length}` : 'Continue'}
      onPrimary={next}
      onSkip={next}
    >
      <View style={styles.wrap}>
        {TOPICS.map((t) => (
          <Chip key={t.key} label={t.name} selected={prefs.topics.includes(t.key)} onPress={() => toggle(t.key)} />
        ))}
      </View>
      <Text style={[type.meta, { color: colors.ink3, marginTop: 20 }]}>Nothing here limits what you can search for.</Text>
    </OnboardingFrame>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
});
