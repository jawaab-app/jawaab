import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { fonts, type, useTheme } from '@/theme';
import type { Chapter } from '@/data/sample';

export const CHAPTER_CARD_WIDTH = 182;

export function ChapterCard({ chapter, onPress }: { chapter: Chapter; onPress?: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: colors.card, borderColor: colors.hair, transform: [{ scale: pressed ? 0.98 : 1 }] },
      ]}
    >
      <Image source={chapter.art} style={styles.art} contentFit="cover" contentPosition={chapter.artPosition as never} transition={200} />
      <View style={styles.text}>
        <Text style={[type.cardTitle, { color: colors.ink }]} numberOfLines={1}>
          {chapter.name}
        </Text>
        <Text style={[styles.count, { color: colors.ink3 }]}>{chapter.count}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CHAPTER_CARD_WIDTH,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  art: { width: '100%', height: 118 },
  text: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 14, gap: 3 },
  count: { fontFamily: fonts.body, fontSize: 15 },
});
