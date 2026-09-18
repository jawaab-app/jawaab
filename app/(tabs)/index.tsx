import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChapterCard, HistoryRow, Logo, SearchField, SectionHeader, SegmentTabs } from '@/components';
import { chapters, history, TOTAL_ANSWERS, TOTAL_CHAPTERS, trending } from '@/data/sample';
import { fonts, space, useTheme } from '@/theme';

// The band ends just under the search field; the list below sits on plain paper.
const BAND_HEIGHT = 190;

type Segment = 'history' | 'trending';

export default function HomeScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [segment, setSegment] = useState<Segment>('history');

  const rows = segment === 'trending' ? trending : history;
  const paper = colors.paper;

  return (
    <View style={[styles.root, { backgroundColor: paper }]}>
      {/* Header band: the tile hero, bleeding out into paper. */}
      <View pointerEvents="none" style={[styles.band, { height: BAND_HEIGHT + insets.top }]}>
        <Image source={require('../../assets/images/hero.webp')} style={StyleSheet.absoluteFill} contentFit="cover" contentPosition="top" />
        <View style={[StyleSheet.absoluteFill, { backgroundColor: paper, opacity: isDark ? 0.8 : 0.7 }]} />
        <LinearGradient colors={['transparent', paper]} locations={[0.3, 1]} style={StyleSheet.absoluteFill} />
      </View>

      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Masthead: mark centred, settings opposite. */}
        <View style={styles.nav}>
          <View style={styles.navSide} />
          <Logo size={76} />
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
    height: 84,
    marginTop: 2,
    marginBottom: 10,
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
