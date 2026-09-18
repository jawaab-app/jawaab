import { Pressable, StyleSheet, Text } from 'react-native';
import { fonts, space, useTheme } from '@/theme';
import type { Chapter } from '@/data/sample';

// Chapters read as a row of hairline pills.
export function ChapterCard({ chapter, onPress }: { chapter: Chapter; onPress?: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.pill, { borderColor: colors.hair, opacity: pressed ? 0.5 : 1 }]}>
      <Text style={[styles.name, { color: colors.ink }]}>{chapter.name}</Text>
      <Text style={[styles.count, { color: colors.ink3 }]}>{chapter.count}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: { height: 40, paddingHorizontal: 16, borderRadius: space.pill, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { fontFamily: fonts.medium, fontSize: 15, letterSpacing: -0.4 },
  count: { fontFamily: fonts.regular, fontSize: 13, letterSpacing: -0.1 },
});
