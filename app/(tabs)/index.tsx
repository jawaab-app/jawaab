import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '@/api/client';
import { madhabFilter, relativeTime, toRow } from '@/api/format';
import { useApi, useQuestionCount, useSearchCount } from '@/api/hooks';
import { ChapterCard, HistoryRow, IconButton, LoadState, Logo, SearchField, SectionHeader } from '@/components';
import { CHAPTERS, type Chapter } from '@/data/chapters';
import { SCHOOLS } from '@/data/onboarding';
import { useLibrary } from '@/store/library';
import { usePrefs } from '@/store/prefs';
import { fonts, GREETING, SKY_ART, SKY_DARK_ART, space, timeOfDay, type, useTheme } from '@/theme';

type Segment = 'recent' | 'explore';

const EXPLORE_SIZE = 5;

export default function HomeScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { prefs } = usePrefs();
  const { history } = useLibrary();
  const [segment, setSegment] = useState<Segment>(history.length ? 'recent' : 'explore');
  const madhab = madhabFilter(prefs.school);
  const count = useQuestionCount(madhab);
  const total = count.data?.total;

  // A different handful of answers each day, from the reader's school.
  const exploreOffset = total ? dailyOffset(Math.max(0, total - EXPLORE_SIZE)) : null;
  const explore = useApi(
    segment === 'explore' && exploreOffset !== null ? `explore:${madhab ?? '*'}:${exploreOffset}` : null,
    (sig) => api.questions({ madhab, limit: EXPLORE_SIZE, offset: exploreOffset ?? 0 }, sig),
  );
  const rows =
    segment === 'recent'
      ? history.slice(0, 5).map((e) => toRow(e.question, relativeTime(e.at)))
      : (explore.data?.items ?? []).map((q) => toRow(q));

  const tod = prefs.skyOverride ?? timeOfDay();
  const school = SCHOOLS.find((s) => s.key === prefs.school);
  const schoolLabel = school && school.key !== 'unsure' ? school.name : 'All schools';
  const onDark = SKY_DARK_ART[tod] || isDark;
  const heroInk = onDark ? '#FFFFFF' : colors.ink;
  const heroInk2 = onDark ? 'rgba(255,255,255,0.8)' : 'rgba(10,10,10,0.72)';
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
            {total !== undefined
              ? `Search ${total.toLocaleString()} ${madhab ? `${schoolLabel} ` : ''}answers.`
              : count.error
                ? 'Answers are offline right now.'
                : 'Search the answers.'}
          </Text>
        </View>

        <View style={[styles.pad, { marginTop: 26 }]}>
          <SearchField placeholder="Ask anything…" chip={schoolLabel} onPress={() => router.push('/search')} onChip={() => router.push('/settings')} />
        </View>

        <View style={[styles.pad, { marginTop: 40 }]}>
          <View style={styles.toggle}>
            {(['recent', 'explore'] as Segment[]).map((k) => (
              <Pressable key={k} onPress={() => setSegment(k)} hitSlop={8}>
                <Text style={[styles.toggleText, { color: segment === k ? colors.ink : colors.ink3 }]}>{k === 'recent' ? 'Recent' : 'Explore'}</Text>
              </Pressable>
            ))}
          </View>
          {rows.map((item, i) => (
            <HistoryRow key={item.id} item={item} last={i === rows.length - 1} onPress={() => router.push(`/answer/${item.id}`)} />
          ))}
          {segment === 'recent' && rows.length === 0 && <LoadState empty="Answers you read will show up here." />}
          {segment === 'explore' && (
            <LoadState
              loading={explore.loading || (count.loading && !total)}
              error={explore.error ?? count.error}
              onRetry={() => (count.error ? count.reload() : explore.reload())}
              empty={!explore.loading && explore.data && rows.length === 0 ? 'No answers yet.' : null}
            />
          )}
        </View>

        <View style={[styles.pad, { marginTop: 28 }]}>
          <SectionHeader title="Chapters" action={`All ${CHAPTERS.length}`} onAction={() => router.push('/topics')} />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rail}>
          {CHAPTERS.slice(0, 6).map((c) => (
            <ChapterPill key={c.id} chapter={c} madhab={madhab} onPress={() => router.push({ pathname: '/browse', params: { chapter: c.id } })} />
          ))}
        </ScrollView>
      </ScrollView>
    </View>
  );
}

function ChapterPill({ chapter, madhab, onPress }: { chapter: Chapter; madhab: string | null; onPress: () => void }) {
  const { data } = useSearchCount(chapter.query, madhab);
  return <ChapterCard chapter={chapter} count={data?.total} onPress={onPress} />;
}

function dailyOffset(max: number): number {
  const day = Math.floor(Date.now() / 86_400_000);
  return max > 0 ? (day * 7919) % max : 0;
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
