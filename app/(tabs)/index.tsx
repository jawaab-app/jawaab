import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChapterCard, HistoryRow, Logo, PILL_HEIGHT, SearchField, SectionHeader, SegmentTabs } from '@/components';
import { chapters, history, TOTAL_ANSWERS, TOTAL_CHAPTERS, trending } from '@/data/sample';
import { fonts, space, useTheme } from '@/theme';

const BAND_HEIGHT = 300;

type Segment = 'history' | 'trending' | 'saved';

export default function HomeScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [segment, setSegment] = useState<Segment>('history');

  const rows = segment === 'trending' ? trending : segment === 'saved' ? history.slice(0, 2) : history;
  const paper = colors.paper;

  return (
    <View style={[styles.root, { backgroundColor: paper }]}>
      {/* Header band: the tile hero, bleeding out into paper. */}
      <View pointerEvents="none" style={[styles.band, { height: BAND_HEIGHT + insets.top }]}>
        <Image source={require('../../assets/images/hero.webp')} style={StyleSheet.absoluteFill} contentFit="cover" contentPosition="top" />
        <View style={[StyleSheet.absoluteFill, { backgroundColor: paper, opacity: isDark ? 0.72 : 0.58 }]} />
        <LinearGradient colors={['transparent', paper]} locations={[0.25, 1]} style={StyleSheet.absoluteFill} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top, paddingBottom: PILL_HEIGHT + insets.bottom + 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Masthead: mark centred, settings opposite. */}
        <View style={styles.nav}>
          <View style={styles.navSide} />
          <Logo size={52} />
          <View style={[styles.navSide, { alignItems: 'flex-end' }]}>
            <Pressable onPress={() => router.push('/settings')} hitSlop={12} accessibilityLabel="Settings">
              <Ionicons name="options-outline" size={24} color={colors.ink} />
            </Pressable>
          </View>
        </View>

        <View style={styles.pad}>
          <SearchField placeholder={`Search ${TOTAL_ANSWERS.toLocaleString()} answers`} onPress={() => router.push('/search')} />
        </View>

        <View style={[styles.pad, { marginTop: 18 }]}>
          <SegmentTabs
            segments={[
              { key: 'history', label: 'History' },
              { key: 'trending', label: 'Trending' },
              { key: 'saved', label: 'Saved', count: 18 },
            ]}
            active={segment}
            onChange={(k) => setSegment(k as Segment)}
          />
        </View>

        <View style={[styles.pad, { marginTop: 4 }]}>
          {rows.map((item, i) => (
            <HistoryRow key={item.id} item={item} last={i === rows.length - 1} onPress={() => router.push(`/answer/${item.id}`)} />
          ))}
        </View>

        <View style={[styles.pad, { marginTop: 30 }]}>
          <SectionHeader title="The book" />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chapterRail}
          decelerationRate="fast"
          snapToInterval={182 + 14}
          snapToAlignment="start"
        >
          {chapters.map((c) => (
            <ChapterCard key={c.id} chapter={c} onPress={() => router.push('/topics')} />
          ))}
        </ScrollView>

        <Pressable onPress={() => router.push('/topics')} style={[styles.pad, styles.allChapters]}>
          <Text style={[styles.allText, { color: colors.accent }]}>All {TOTAL_CHAPTERS} chapters</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.accent} />
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  band: { position: 'absolute', top: 0, left: 0, right: 0 },
  nav: {
    height: 62,
    marginTop: 6,
    marginBottom: 14,
    paddingHorizontal: space.gutter,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navSide: { width: 60 },
  pad: { paddingHorizontal: space.gutter },
  chapterRail: { paddingHorizontal: space.gutter, paddingTop: 16, gap: 14 },
  allChapters: { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 18 },
  allText: { fontFamily: fonts.medium, fontSize: 18 },
});
