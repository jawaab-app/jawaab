import { Pressable, StyleSheet, Text } from 'react-native';
import { fonts, useTheme } from '@/theme';

export function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: selected ? colors.accent : colors.card,
          borderColor: selected ? colors.accent : colors.hair,
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <Text style={[styles.label, { color: selected ? '#FFFFFF' : colors.ink }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: { paddingHorizontal: 16, paddingVertical: 11, borderRadius: 22, borderWidth: 1 },
  label: { fontFamily: fonts.medium, fontSize: 15 },
});
