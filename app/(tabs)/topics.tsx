import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { madhabFilter } from '@/api/format';
import { useSearchCount } from '@/api/hooks';
import { CHAPTERS, type Chapter } from '@/data/chapters';
import { usePrefs } from '@/store/prefs';
import { fonts, space, type, useTheme } from '@/theme';

export default function TopicsScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { prefs } = usePrefs();
  const madhab = madhabFilter(prefs.school);

  return (
    <ScrollView style={{ backgroundColor: colors.paper }} contentContainerStyle={{ paddingTop: insets.top + 24, paddingBottom: 40, paddingHorizontal: space.gutter }}>
      <Text style={[type.largeTitle, { color: colors.ink }]}>Chapters</Text>
      <Text style={[type.body, { color: colors.ink2, marginTop: 8, marginBottom: 24 }]}>In the order of the classical manuals.</Text>
      {CHAPTERS.map((c, i) => (
        <ChapterRow
          key={c.id}
          chapter={c}
          index={i}
          last={i === CHAPTERS.length - 1}
          madhab={madhab}
          onPress={() => router.push({ pathname: '/browse', params: { chapter: c.id } })}
        />
      ))}
    </ScrollView>
  );
}

function ChapterRow({ chapter, index, last, madhab, onPress }: { chapter: Chapter; index: number; last: boolean; madhab: string | null; onPress: () => void }) {
  const { colors } = useTheme();
  const { data } = useSearchCount(chapter.query, madhab);
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, { borderBottomColor: last ? 'transparent' : colors.hair, opacity: pressed ? 0.5 : 1 }]}>
      <Text style={[styles.index, { color: colors.ink3 }]}>{String(index + 1).padStart(2, '0')}</Text>
      <View style={{ flex: 1 }}>
        <Text style={[type.question, { color: colors.ink }]}>{chapter.name}</Text>
        <Text style={[type.meta, { color: colors.ink2, marginTop: 2 }]}>{data ? `${data.total.toLocaleString()} answers` : ' '}</Text>
      </View>
      <Text style={[styles.arabic, { color: colors.ink2 }]}>{chapter.arabic}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 16, borderBottomWidth: StyleSheet.hairlineWidth },
  index: { width: 24, fontFamily: fonts.regular, fontSize: 13, letterSpacing: -0.1 },
  arabic: { fontSize: 17, writingDirection: 'rtl' },
});
