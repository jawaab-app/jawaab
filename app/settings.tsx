import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LANGUAGES, PUBLISHERS, SCHOOLS, TOPICS } from '@/data/onboarding';
import { usePrefs } from '@/store/prefs';
import { fonts, space, type, useTheme } from '@/theme';

export default function SettingsScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { prefs, reset } = usePrefs();

  const rows: { label: string; value: string }[] = [
    { label: 'School', value: SCHOOLS.find((s) => s.key === prefs.school)?.name ?? 'Every school' },
    { label: 'Language', value: LANGUAGES.find((l) => l.key === prefs.language)?.name ?? 'English' },
    { label: 'Topics', value: prefs.topics.length ? `${TOPICS.filter((t) => prefs.topics.includes(t.key)).length} chosen` : 'Everything' },
    { label: 'Publishers', value: prefs.publishers.length ? `${PUBLISHERS.filter((p) => prefs.publishers.includes(p.key)).length} chosen` : 'All' },
    { label: 'Text size', value: 'Default' },
    { label: 'Appearance', value: 'System' },
  ];

  return (
    <ScrollView style={{ backgroundColor: colors.paper }} contentContainerStyle={{ paddingTop: insets.top + 14, paddingHorizontal: space.gutter, paddingBottom: insets.bottom + 40 }}>
      <View style={styles.head}>
        <Text style={[type.h1, { color: colors.ink }]}>Settings</Text>
        <Pressable onPress={() => router.back()} hitSlop={12} accessibilityLabel="Close">
          <Ionicons name="close" size={26} color={colors.ink} />
        </Pressable>
      </View>
      {rows.map((r) => (
        <View key={r.label} style={[styles.row, { borderBottomColor: colors.hair }]}>
          <Text style={[styles.label, { color: colors.ink }]}>{r.label}</Text>
          <Text style={[type.meta, { color: colors.ink2 }]}>{r.value}</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.ink3} />
        </View>
      ))}
      <Pressable onPress={reset} style={styles.reset} hitSlop={8}>
        <Text style={[styles.resetText, { color: colors.accent }]}>Run setup again</Text>
        <Text style={[type.meta, { color: colors.ink3 }]}>Clears your school, language, topics and publishers.</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 16, borderBottomWidth: StyleSheet.hairlineWidth },
  label: { flex: 1, fontFamily: fonts.medium, fontSize: 16 },
  reset: { marginTop: 28, gap: 4 },
  resetText: { fontFamily: fonts.medium, fontSize: 16 },
});
