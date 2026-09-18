import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { fonts, space, useTheme } from '@/theme';

interface Props {
  placeholder: string;
  chip?: string; // e.g. the school answers are ranked by
  onPress?: () => void;
  onChip?: () => void;
  onMic?: () => void;
}

// Composer-style field: prompt on top, school chip left, mic and go on the right.
export function SearchField({ placeholder, chip, onPress, onChip, onMic }: Props) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="search"
      style={({ pressed }) => [styles.card, { backgroundColor: colors.card, borderColor: colors.hair, opacity: pressed ? 0.8 : 1 }]}
    >
      <Text style={[styles.placeholder, { color: colors.ink2 }]} numberOfLines={1}>
        {placeholder}
      </Text>
      <View style={styles.actions}>
        {chip ? (
          <Pressable onPress={onChip} hitSlop={8} style={[styles.chip, { borderColor: colors.hair }]}>
            <Text style={[styles.chipText, { color: colors.ink }]}>{chip}</Text>
            <Ionicons name="chevron-down" size={12} color={colors.ink2} />
          </Pressable>
        ) : (
          <View />
        )}
        <View style={styles.right}>
          <Pressable onPress={onMic} hitSlop={10} accessibilityLabel="Voice search">
            <Ionicons name="mic-outline" size={22} color={colors.ink} />
          </Pressable>
          <View style={[styles.go, { backgroundColor: colors.button }]}>
            <Ionicons name="arrow-up" size={18} color={colors.buttonInk} />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: space.radiusLg + 2,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    gap: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  placeholder: { fontFamily: fonts.regular, fontSize: 16, letterSpacing: -0.3, paddingHorizontal: 2 },
  actions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  chip: { height: 30, paddingLeft: 12, paddingRight: 8, borderRadius: space.pill, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 4 },
  chipText: { fontFamily: fonts.medium, fontSize: 13, letterSpacing: -0.2 },
  right: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  go: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
});
