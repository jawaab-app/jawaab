import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChapterCard, CoverCard, HistoryRow, IconButton, Logo, SearchField, SectionHeader, SegmentTabs } from '@/components';
import { chapters, history, TOTAL_ANSWERS, trending } from '@/data/sample';
import { space, useTheme } from '@/theme';

type Segment = 'recent' | 'trending';

// One cover per time of day. Placeholders until the generated set lands in assets/images/covers.
const COVERS = {
  morning: require('../../assets/images/madrasa-goodall.jpg'),
  afternoon: require('../../assets/images/madrasa-deutsch.jpg'),
  evening: require('../../assets/images/ferraris-greeting.jpg'),
  night: require('../../assets/images/ferraris-greeting.jpg'),
} as const;

function timeOfDay(): keyof typeof COVERS {
  const h = new Date().getHours();
  if (h < 5) return 'night';
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  if (h < 21) return 'evening';
  return 'night';
}

const GREETING: Record<keyof typeof COVERS, string> = {
  morning: 'Good morning.',
  afternoon: 'Good afternoon.',
  evening: 'Good evening.',
  night: 'Good night.',
};

export default function HomeScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [segment, setSegment] = useState<Segment>('recent');
  const rows = segment === 'trending' ? trending : history;
  const tod = timeOfDay();

  return (
    <ScrollView
      style={{ backgroundColor: colors.paper }}
      contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.pad, styles.nav]}>
        <Logo size={30} />
        <IconButton name="options-outline" label="Settings" onPress={() => router.push('/settings')} />
      </View>

      <View style={[styles.pad, { marginTop: 16 }]}>
        <CoverCard source={COVERS[tod]} title={GREETING[tod]} subtitle={`${TOTAL_ANSWERS.toLocaleString()} answers, each with its author.`} />
      </View>

      <View style={[styles.pad, { marginTop: 14 }]}>
        <SearchField placeholder="Ask anything…" onPress={() => router.push('/search')} />
      </View>

      <View style={[styles.pad, { marginTop: 36 }]}>
        <SegmentTabs
          segments={[
            { key: 'recent', label: 'Recent' },
            { key: 'trending', label: 'Trending' },
          ]}
          active={segment}
          onChange={(k) => setSegment(k as Segment)}
        />
        <View style={{ marginTop: 6 }}>
          {rows.map((item, i) => (
            <HistoryRow key={item.id} item={item} last={i === rows.length - 1} onPress={() => router.push(`/answer/${item.id}`)} />
          ))}
        </View>
      </View>

      <View style={[styles.pad, { marginTop: 32 }]}>
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
  rail: { paddingHorizontal: space.gutter, paddingTop: 14, gap: 8 },
});
