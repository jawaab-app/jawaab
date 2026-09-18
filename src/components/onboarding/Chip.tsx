import { Pressable, StyleSheet, Text } from 'react-native';
import { fonts, space, useTheme } from '@/theme';

export function Chip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      style={({ pressed }) => [
        styles.chip,
        { backgroundColor: selected ? colors.button : 'transparent', borderColor: selected ? colors.button : colors.hair, opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <Text style={[styles.label, { color: selected ? colors.buttonInk : colors.ink }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: { height: 40, paddingHorizontal: 16, borderRadius: space.pill, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  label: { fontFamily: fonts.medium, fontSize: 15, letterSpacing: -0.4 },
});
