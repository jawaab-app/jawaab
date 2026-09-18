import { Pressable, StyleSheet, Text, View } from 'react-native';
import { fonts, type, useTheme } from '@/theme';
import type { HistoryItem } from '@/data/sample';

interface Props {
  item: HistoryItem;
  onPress?: () => void;
  last?: boolean;
}

export function HistoryRow({ item, onPress, last }: Props) {
  const { colors } = useTheme();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, { opacity: pressed ? 0.6 : 1 }]}>
      <View style={styles.marker}>
        {item.live && <View style={[styles.dot, { backgroundColor: colors.accent }]} />}
      </View>
      <View style={[styles.body, { borderBottomColor: last ? 'transparent' : colors.hair }]}>
        <Text style={[type.question, { color: colors.ink }]}>{item.question}</Text>
        <View style={styles.byline}>
          <Text style={[styles.pub, { color: colors.ink2 }]}>{item.publisher}</Text>
          <Dot color={colors.ink3} />
          <Text style={[type.meta, { color: colors.ink2 }]}>{item.school}</Text>
          <Dot color={colors.ink3} />
          <Text style={[item.live ? type.metaStrong : type.meta, { color: item.live ? colors.accent : colors.ink3 }]}>{item.when}</Text>
        </View>
      </View>
    </Pressable>
  );
}

function Dot({ color }: { color: string }) {
  return <View style={[styles.sep, { backgroundColor: color }]} />;
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  marker: { width: 28, paddingTop: 8, alignItems: 'flex-start' },
  dot: { width: 8, height: 8, borderRadius: 4 },
  body: { flex: 1, paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth, gap: 5 },
  byline: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  pub: { fontFamily: fonts.medium, fontSize: 13.5, lineHeight: 18 },
  sep: { width: 3, height: 3, borderRadius: 2, opacity: 0.7 },
});
