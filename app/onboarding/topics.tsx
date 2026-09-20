import * as Haptics from 'expo-haptics';
import { StyleSheet, View } from 'react-native';
import { ChapterStrip, Chip, OnboardingFrame, Stagger } from '@/components/onboarding';
import { TOPICS } from '@/data/onboarding';
import { usePrefs } from '@/store/prefs';

export default function TopicsScreen() {
  const { prefs, update } = usePrefs();
  const finish = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    update({ onboarded: true });
  };

  const toggle = (key: string) => {
    Haptics.selectionAsync();
    update({ topics: prefs.topics.includes(key) ? prefs.topics.filter((t) => t !== key) : [...prefs.topics, key] });
  };

  return (
    <OnboardingFrame step={3} title="What do you ask about?" hint="Shapes what you see first." primaryLabel="Done" onPrimary={finish} onSkip={finish}>
      <View style={styles.wrap}>
        {TOPICS.map((t, i) => (
          <Stagger key={t.key} index={i}>
            <Chip label={t.name} selected={prefs.topics.includes(t.key)} onPress={() => toggle(t.key)} />
          </Stagger>
        ))}
      </View>
      <ChapterStrip topics={prefs.topics} />
    </OnboardingFrame>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
