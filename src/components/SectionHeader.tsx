import { StyleSheet, Text, View } from 'react-native';
import { type, useTheme } from '@/theme';

export function SectionHeader({ title }: { title: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <Text style={[type.label, { color: colors.ink3 }]}>{title.toUpperCase()}</Text>
      <View style={[styles.line, { backgroundColor: colors.hair }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  line: { flex: 1, height: StyleSheet.hairlineWidth },
});
