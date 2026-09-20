import { StyleSheet, View } from 'react-native';
import { Chip, OnboardingFrame } from '@/components/onboarding';
import { TOPICS } from '@/data/onboarding';
import { usePrefs } from '@/store/prefs';

export default function TopicsScreen() {
  const { prefs, update } = usePrefs();
  const finish = () => update({ onboarded: true });

  const toggle = (key: string) =>
    update({ topics: prefs.topics.includes(key) ? prefs.topics.filter((t) => t !== key) : [...prefs.topics, key] });

  return (
    <OnboardingFrame step={2} title="What do you ask about?" primaryLabel="Done" onPrimary={finish} onSkip={finish}>
      <View style={styles.wrap}>
        {TOPICS.map((t) => (
          <Chip key={t.key} label={t.name} selected={prefs.topics.includes(t.key)} onPress={() => toggle(t.key)} />
        ))}
      </View>
    </OnboardingFrame>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
