import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { fonts, type, useTheme } from '@/theme';

interface Props {
  title: string;
  detail?: string;
  trailing?: string;
  selected: boolean;
  onPress: () => void;
  multi?: boolean;
  last?: boolean;
}

// Hairline row with a check on the right. Selection is weight, not colour.
export function ChoiceRow({ title, detail, trailing, selected, onPress, last }: Props) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      style={({ pressed }) => [styles.row, { borderBottomColor: last ? 'transparent' : colors.hair, opacity: pressed ? 0.5 : 1 }]}
    >
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={[styles.title, { color: colors.ink, fontFamily: selected ? fonts.semibold : fonts.medium }]}>{title}</Text>
        {detail ? <Text style={[type.meta, { color: colors.ink2 }]}>{detail}</Text> : null}
      </View>
      {trailing ? <Text style={[styles.trailing, { color: colors.ink2 }]}>{trailing}</Text> : null}
      <View style={[styles.check, { backgroundColor: selected ? colors.button : 'transparent', borderColor: selected ? colors.button : colors.hair }]}>
        {selected && <Ionicons name="checkmark" size={14} color={colors.buttonInk} />}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 15, borderBottomWidth: StyleSheet.hairlineWidth },
  title: { fontSize: 17, letterSpacing: -0.4 },
  trailing: { fontSize: 16, writingDirection: 'rtl' },
  check: { width: 24, height: 24, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
});
