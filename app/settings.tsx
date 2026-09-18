import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconButton } from '@/components';
import { LANGUAGES, PUBLISHERS, SCHOOLS, TOPICS } from '@/data/onboarding';
import { usePrefs } from '@/store/prefs';
import { fonts, space, type, useTheme } from '@/theme';

export default function SettingsScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { prefs, reset } = usePrefs();

  const groups: { title: string; rows: { label: string; value: string }[] }[] = [
    {
      title: 'Ranking',
      rows: [
        { label: 'School', value: SCHOOLS.find((s) => s.key === prefs.school)?.name ?? 'Every school' },
        { label: 'Language', value: LANGUAGES.find((l) => l.key === prefs.language)?.name ?? 'English' },
        { label: 'Topics', value: prefs.topics.length ? `${TOPICS.filter((t) => prefs.topics.includes(t.key)).length} chosen` : 'All' },
        { label: 'Publishers', value: prefs.publishers.length ? `${PUBLISHERS.filter((p) => prefs.publishers.includes(p.key)).length} chosen` : 'All' },
      ],
    },
    {
      title: 'Reading',
      rows: [
        { label: 'Text size', value: 'Default' },
        { label: 'Appearance', value: 'System' },
      ],
    },
  ];

  return (
    <ScrollView style={{ backgroundColor: colors.paper }} contentContainerStyle={{ paddingTop: 8, paddingHorizontal: space.gutter, paddingBottom: insets.bottom + 40 }}>
      <View style={styles.nav}>
        <View />
        <IconButton name="close" label="Close" onPress={() => router.back()} />
      </View>
      <Text style={[type.largeTitle, { color: colors.ink, marginTop: 8 }]}>Settings</Text>
      {groups.map((g) => (
        <View key={g.title} style={{ marginTop: 32 }}>
          <Text style={[type.meta, { color: colors.ink2, marginBottom: 4 }]}>{g.title}</Text>
          {g.rows.map((r, i) => (
            <View key={r.label} style={[styles.row, { borderBottomColor: i === g.rows.length - 1 ? 'transparent' : colors.hair }]}>
              <Text style={[styles.label, { color: colors.ink }]}>{r.label}</Text>
              <Text style={[styles.value, { color: colors.ink2 }]}>{r.value}</Text>
            </View>
          ))}
        </View>
      ))}
      <Pressable onPress={reset} style={{ marginTop: 40 }} hitSlop={8}>
        <Text style={[styles.label, { color: colors.ink }]}>Run setup again</Text>
        <Text style={[type.meta, { color: colors.ink2, marginTop: 4 }]}>Clears school, language, topics and publishers.</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  nav: { height: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 15, borderBottomWidth: StyleSheet.hairlineWidth },
  label: { fontFamily: fonts.medium, fontSize: 17, letterSpacing: -0.4 },
  value: { fontFamily: fonts.regular, fontSize: 16, letterSpacing: -0.3 },
});
