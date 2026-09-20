import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SettingsPage, SettingsRow } from '@/components';
import { LANGUAGES, SCHOOLS, TOPICS } from '@/data/onboarding';
import { usePrefs } from '@/store/prefs';
import { fonts, space, TIMES, type, useTheme } from '@/theme';

const APPEARANCE: Record<string, string> = { system: 'System', light: 'Light', dark: 'Dark' };

export default function SettingsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { prefs, reset, update } = usePrefs();

  const school = SCHOOLS.find((s) => s.key === prefs.school);
  const topicCount = TOPICS.filter((t) => prefs.topics.includes(t.key)).length;

  return (
    <SettingsPage title="Settings" root>
      <Text style={[type.meta, { color: colors.ink2, marginBottom: 4 }]}>Ranking</Text>
      <SettingsRow label="School" value={school && school.key !== 'unsure' ? school.name : 'All schools'} onPress={() => router.push('/settings/school')} />
      <SettingsRow label="Language" value={LANGUAGES.find((l) => l.key === prefs.language)?.name ?? 'English'} onPress={() => router.push('/settings/language')} />
      <SettingsRow label="Topics" value={topicCount ? `${topicCount} chosen` : 'All'} onPress={() => router.push('/settings/topics')} last />

      <Text style={[type.meta, { color: colors.ink2, marginTop: 32, marginBottom: 4 }]}>Reading</Text>
      <SettingsRow label="Appearance" value={APPEARANCE[prefs.appearance]} onPress={() => router.push('/settings/appearance')} last />

      <View style={{ marginTop: 32 }}>
        <Text style={[type.meta, { color: colors.ink2, marginBottom: 12 }]}>Developer</Text>
        <Text style={[styles.label, { color: colors.ink }]}>Home sky</Text>
        <View style={styles.chips}>
          {[null, ...TIMES].map((t) => {
            const on = prefs.skyOverride === t;
            return (
              <Pressable
                key={t ?? 'auto'}
                onPress={() => update({ skyOverride: t })}
                style={[styles.chip, { backgroundColor: on ? colors.button : 'transparent', borderColor: on ? colors.button : colors.hair }]}
              >
                <Text style={[styles.chipText, { color: on ? colors.buttonInk : colors.ink }]}>{t ? t[0].toUpperCase() + t.slice(1) : 'Clock'}</Text>
              </Pressable>
            );
          })}
        </View>
        <Pressable onPress={reset} style={{ marginTop: 24 }} hitSlop={8}>
          <Text style={[styles.label, { color: colors.ink }]}>Run setup again</Text>
          <Text style={[type.meta, { color: colors.ink2, marginTop: 4 }]}>Clears your school and topics, then shows onboarding again.</Text>
        </Pressable>
      </View>
    </SettingsPage>
  );
}

const styles = StyleSheet.create({
  label: { fontFamily: fonts.medium, fontSize: 17, letterSpacing: -0.4 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 12 },
  chip: { height: 34, paddingHorizontal: 14, borderRadius: space.pill, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  chipText: { fontFamily: fonts.medium, fontSize: 14, letterSpacing: -0.3 },
});
