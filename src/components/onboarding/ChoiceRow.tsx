import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { fonts, type, useTheme } from '@/theme';

interface Props {
  title: string;
  detail?: string;
  trailing?: string; // e.g. Arabic name, shown right-aligned
  selected: boolean;
  onPress: () => void;
  multi?: boolean;
}

export function ChoiceRow({ title, detail, trailing, selected, onPress, multi }: Props) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={multi ? 'checkbox' : 'radio'}
      accessibilityState={{ selected, checked: selected }}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: selected ? colors.accentSoft : colors.card,
          borderColor: selected ? colors.accent : colors.hair,
          opacity: pressed ? 0.75 : 1,
        },
      ]}
    >
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={[styles.title, { color: colors.ink }]}>{title}</Text>
        {detail ? <Text style={[type.meta, { color: colors.ink2 }]}>{detail}</Text> : null}
      </View>
      {trailing ? <Text style={[styles.trailing, { color: selected ? colors.accent : colors.ink3 }]}>{trailing}</Text> : null}
      <Ionicons
        name={selected ? (multi ? 'checkmark-circle' : 'radio-button-on') : multi ? 'ellipse-outline' : 'radio-button-off'}
        size={22}
        color={selected ? colors.accent : colors.ink3}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  title: { fontFamily: fonts.medium, fontSize: 16 },
  trailing: { fontSize: 16, writingDirection: 'rtl' },
});
