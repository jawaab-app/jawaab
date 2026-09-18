import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text } from 'react-native';
import { fonts, space, useTheme } from '@/theme';

// Small hairline pill with a caret. For the school / language filters.
export function FilterChip({ label, onPress }: { label: string; onPress?: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable onPress={onPress} hitSlop={6} style={({ pressed }) => [styles.chip, { borderColor: colors.hair, opacity: pressed ? 0.5 : 1 }]}>
      <Text style={[styles.text, { color: colors.ink }]}>{label}</Text>
      <Ionicons name="chevron-down" size={12} color={colors.ink2} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: { height: 32, paddingLeft: 12, paddingRight: 8, borderRadius: space.pill, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 4 },
  text: { fontFamily: fonts.medium, fontSize: 13, letterSpacing: -0.2 },
});
