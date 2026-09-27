import { Pressable, StyleSheet, Text, View } from 'react-native';
import { highlightRuns } from '@/api/highlight';
import { fonts, type, useTheme } from '@/theme';
import type { RowItem } from '@/api/format';

interface Props {
  item: RowItem;
  onPress?: () => void;
  last?: boolean;
  /** Query terms to set in a heavier weight inside the title. */
  highlight?: string[];
}

// Hairline-separated row. No fills, no chevrons. Titles clamp at three lines.
export function HistoryRow({ item, onPress, last, highlight }: Props) {
  const { colors } = useTheme();
  const runs = highlight?.length ? highlightRuns(item.question, highlight) : null;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, { borderBottomColor: last ? 'transparent' : colors.hair, opacity: pressed ? 0.5 : 1 }]}>
      <Text style={[type.question, { color: runs ? colors.ink2 : colors.ink }]} numberOfLines={3}>
        {runs
          ? runs.map((r, i) => (
              <Text key={i} style={r.hit ? { color: colors.ink, fontFamily: fonts.semibold } : undefined}>
                {r.text}
              </Text>
            ))
          : item.question}
      </Text>
      <View style={styles.meta}>
        <Text style={[type.meta, { color: colors.ink2, flex: 1, marginRight: 12 }]} numberOfLines={1}>
          {item.publisher} · {item.school}
        </Text>
        {!!item.when && <Text style={[item.live ? type.metaStrong : type.meta, { color: item.live ? colors.ink : colors.ink3 }]}>{item.when}</Text>}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { paddingVertical: 16, gap: 5, borderBottomWidth: StyleSheet.hairlineWidth },
  meta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});
