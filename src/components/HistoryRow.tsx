import { Pressable, StyleSheet, Text, View } from 'react-native';
import { type, useTheme } from '@/theme';
import type { RowItem } from '@/api/format';

interface Props {
  item: RowItem;
  onPress?: () => void;
  last?: boolean;
}

// Hairline-separated row. No fills, no chevrons.
export function HistoryRow({ item, onPress, last }: Props) {
  const { colors } = useTheme();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, { borderBottomColor: last ? 'transparent' : colors.hair, opacity: pressed ? 0.5 : 1 }]}>
      <Text style={[type.question, { color: colors.ink }]}>{item.question}</Text>
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
