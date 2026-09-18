import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChapterCard, HistoryRow, IconButton, Logo, SearchField, SectionHeader } from '@/components';
import { SCHOOLS } from '@/data/onboarding';
import { chapters, history, TOTAL_ANSWERS, TOTAL_PUBLISHERS, trending } from '@/data/sample';
import { usePrefs } from '@/store/prefs';
import { fonts, GREETING, SKY_ART, SKY_DARK_ART, space, timeOfDay, type, useTheme } from '@/theme';

type Segment = 'recent' | 'trending';

export default function HomeScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { prefs } = usePrefs();
  const [segment, setSegment] = useState<Segment>('recent');
  const rows = segment === 'trending' ? trending : history;

  const tod = prefs.skyOverride ?? timeOfDay();
  const school = SCHOOLS.find((s) => s.key === prefs.school);
  const schoolLabel = school && school.key !== 'unsure' ? school.name : 'All schools';
  const onDark = SKY_DARK_ART[tod] || isDark;
  const heroInk = onDark ? '#FFFFFF' : colors.ink;
  const heroInk2 = onDark ? 'rgba(255,255,255,0.78)' : colors.ink2;
  const bandHeight = 330 + insets.top;

  return (
    <View style={[styles.root, { backgroundColor: colors.paper }]}>
      <StatusBar style={onDark ? 'light' : 'dark'} />
      <View pointerEvents="none" style={[styles.sky, { height: bandHeight }]}>
        <Image source={SKY_ART[tod]} style={StyleSheet.absoluteFill} contentFit="cover" contentPosition="top" transition={400} />
        {isDark && !SKY_DARK_ART[tod] && <View style={[StyleSheet.absoluteFill, { backgroundColor: '#000', opacity: 0.55 }]} />}
        <LinearGradient colors={[`${colors.paper}00`, `${colors.paper}CC`, colors.paper]} locations={[0.5, 0.82, 1]} style={StyleSheet.absoluteFill} />
      </View>

      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={[styles.pad, styles.nav]}>
          <Logo size={36} color={heroInk} />
          <IconButton name="options-outline" label="Settings" onPress={() => router.push('/settings')} />
        </View>

        <View style={[styles.pad, { marginTop: 40 }]}>
          <Text style={[type.hero, { color: heroInk }]}>{GREETING[tod]}</Text>
          <Text style={[type.body, { color: heroInk2, marginTop: 8 }]}>
            Search {TOTAL_ANSWERS.toLocaleString()} answers from {TOTAL_PUBLISHERS} publishers.
          </Text>
        </View>

        <View style={[styles.pad, { marginTop: 26 }]}>
          <SearchField placeholder="Ask anything…" chip={schoolLabel} onPress={() => router.push('/search')} onChip={() => router.push('/settings')} />
        </View>

        <View style={[styles.pad, { marginTop: 40 }]}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  sky: { position: 'absolute', top: 0, left: 0, right: 0 },
  pad: { paddingHorizontal: space.gutter },
  nav: { height: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  toggle: { flexDirection: 'row', gap: 18, paddingBottom: 4 },
  toggleText: { fontFamily: fonts.medium, fontSize: 15, letterSpacing: -0.3 },
  rail: { paddingHorizontal: space.gutter, paddingTop: 14, gap: 8 },
});
