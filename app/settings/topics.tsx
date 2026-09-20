import { StyleSheet, View } from 'react-native';
import { SettingsPage } from '@/components';
import { Chip } from '@/components/onboarding';
import { TOPICS } from '@/data/onboarding';
import { usePrefs } from '@/store/prefs';

export default function TopicsSetting() {
  const { prefs, update } = usePrefs();
  const toggle = (key: string) =>
    update({ topics: prefs.topics.includes(key) ? prefs.topics.filter((t) => t !== key) : [...prefs.topics, key] });
  return (
    <SettingsPage title="Topics" hint="Shapes what Trending shows you.">
      <View style={styles.wrap}>
        {TOPICS.map((t) => (
          <Chip key={t.key} label={t.name} selected={prefs.topics.includes(t.key)} onPress={() => toggle(t.key)} />
        ))}
      </View>
    </SettingsPage>
  );
}

const styles = StyleSheet.create({ wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 } });
