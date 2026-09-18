import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { OnboardingFrame } from '@/components/onboarding';
import { LANGUAGES, PUBLISHERS, SCHOOLS, TOPICS } from '@/data/onboarding';
import { usePrefs } from '@/store/prefs';
import { fonts, type, useTheme } from '@/theme';

export default function DoneScreen() {
  const { colors } = useTheme();
  const { prefs, update } = usePrefs();

  const school = SCHOOLS.find((s) => s.key === prefs.school)?.name ?? 'Every school';
  const language = LANGUAGES.find((l) => l.key === prefs.language)?.name ?? 'English';
  const topics = TOPICS.filter((t) => prefs.topics.includes(t.key)).map((t) => t.name);
  const publishers = PUBLISHERS.filter((p) => prefs.publishers.includes(p.key)).map((p) => p.name);

  const rows: { icon: React.ComponentProps<typeof Ionicons>['name']; label: string; value: string }[] = [
    { icon: 'book-outline', label: 'School', value: school },
    { icon: 'language-outline', label: 'Language', value: language },
    { icon: 'pricetags-outline', label: 'Topics', value: topics.length ? topics.join(', ') : 'Everything' },
    { icon: 'people-outline', label: 'Publishers', value: publishers.length ? publishers.join(', ') : 'All publishers' },
  ];

  return (
    <OnboardingFrame
      step={6}
      title="You’re set."
      subtitle="Here is how Jawāb will rank answers for you. Every one of these can be changed in settings."
      primaryLabel="Start reading"
      onPrimary={() => update({ onboarded: true })}
    >
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.hair }]}>
        {rows.map((r, i) => (
          <View key={r.label} style={[styles.row, i < rows.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.hair }]}>
            <Ionicons name={r.icon} size={20} color={colors.accent} />
            <View style={{ flex: 1 }}>
              <Text style={[type.label, { color: colors.ink3 }]}>{r.label.toUpperCase()}</Text>
              <Text style={[styles.value, { color: colors.ink }]}>{r.value}</Text>
            </View>
          </View>
        ))}
      </View>
      <Text style={[type.meta, { color: colors.ink3, marginTop: 18 }]}>
        Jawāb never edits an answer. What you read is what the publisher wrote, with a link back to the original.
      </Text>
    </OnboardingFrame>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 16, borderWidth: StyleSheet.hairlineWidth, paddingHorizontal: 16 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 14 },
  value: { fontFamily: fonts.medium, fontSize: 15.5, marginTop: 3, lineHeight: 21 },
});
