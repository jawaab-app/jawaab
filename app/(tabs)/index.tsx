import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChapterCard, FilterChip, HistoryRow, IconButton, Logo, SearchField, SectionHeader } from '@/components';
import { LANGUAGES, SCHOOLS } from '@/data/onboarding';
import { chapters, history, TOTAL_ANSWERS, trending } from '@/data/sample';
import { usePrefs } from '@/store/prefs';
import { fonts, space, type, useTheme } from '@/theme';

type Segment = 'recent' | 'trending';

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return 'Good night.';
  if (h < 12) return 'Good morning.';
  if (h < 17) return 'Good afternoon.';
  if (h < 21) return 'Good evening.';
  return 'Good night.';
}

export default function HomeScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { prefs } = usePrefs();
  const [segment, setSegment] = useState<Segment>('recent');
  const rows = segment === 'trending' ? trending : history;

  const school = SCHOOLS.find((s) => s.key === prefs.school);
  const schoolLabel = school && school.key !== 'unsure' ? school.name : 'All schools';
  const languageLabel = LANGUAGES.find((l) => l.key === prefs.language)?.name ?? 'English';

  return (
    <ScrollView style={{ backgroundColor: colors.paper }} contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
      <View style={[styles.pad, styles.nav]}>
        <Logo size={30} />
        <IconButton name="options-outline" label="Settings" onPress={() => router.push('/settings')} />
      </View>

      <View style={[styles.pad, { marginTop: 32 }]}>
        <Text style={[type.hero, { color: colors.ink }]}>{greeting()}</Text>
        <Text style={[type.body, { color: colors.ink2, marginTop: 8 }]}>{TOTAL_ANSWERS.toLocaleString()} answers, each with its author.</Text>
      </View>

      <View style={[styles.pad, { marginTop: 24 }]}>
        <SearchField placeholder="Search answers" onPress={() => router.push('/search')} />
        <View style={styles.filters}>
          <FilterChip label={schoolLabel} onPress={() => router.push('/settings')} />
          <FilterChip label={languageLabel} onPress={() => router.push('/settings')} />
        </View>
      </View>

      <View style={[styles.pad, { marginTop: 36 }]}>
        <View style={styles.toggle}>
          {(['recent', 'trending'] as Segment[]).map((k) => (
            <Pressable key={k} onPress={() => setSegment(k)} hitSlop={8}>
              <Text style={[styles.toggleText, { color: segment === k ? colors.ink : colors.ink3 }]}>{k === 'recent' ? 'Recent' : 'Trending'}</Text>
            </Pressable>
          ))}
        </View>
        {rows.map((item, i) => (
          <HistoryRow key={item.id} item={item} last={i === rows.length - 1} onPress={() => router.push(`/answer/${item.id}`)} />
        ))}
      </View>

      <View style={[styles.pad, { marginTop: 28 }]}>
        <SectionHeader title="Chapters" action="All 24" onAction={() => router.push('/topics')} />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rail}>
        {chapters.map((c) => (
          <ChapterCard key={c.id} chapter={c} onPress={() => router.push('/topics')} />
        ))}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  pad: { paddingHorizontal: space.gutter },
  nav: { height: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  filters: { flexDirection: 'row', gap: 8, marginTop: 12 },
  toggle: { flexDirection: 'row', gap: 18, paddingBottom: 4 },
  toggleText: { fontFamily: fonts.medium, fontSize: 15, letterSpacing: -0.3 },
  rail: { paddingHorizontal: space.gutter, paddingTop: 14, gap: 8 },
});
