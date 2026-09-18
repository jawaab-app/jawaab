import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChapterCard, HistoryRow, IconButton, Logo, SearchField, SectionHeader, SegmentTabs } from '@/components';
import { chapters, history, TOTAL_ANSWERS, trending } from '@/data/sample';
import { space, type, useTheme } from '@/theme';

type Segment = 'recent' | 'trending';

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return 'Good night.';
  if (h < 12) return 'Good morning.';
  if (h < 17) return 'Good afternoon.';
  return 'Good evening.';
}

export default function HomeScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [segment, setSegment] = useState<Segment>('recent');
  const rows = segment === 'trending' ? trending : history;

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

      <View style={[styles.pad, { marginTop: 36 }]}>
        <Text style={[type.hero, { color: colors.ink }]}>{greeting()}</Text>
        <Text style={[type.body, { color: colors.ink2, marginTop: 10 }]}>{TOTAL_ANSWERS.toLocaleString()} answers, each with its author.</Text>
      </View>

      <View style={[styles.pad, { marginTop: 28 }]}>
        <SearchField placeholder="Ask anything…" onPress={() => router.push('/search')} />
      </View>

      <View style={[styles.pad, { marginTop: 40 }]}>
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
