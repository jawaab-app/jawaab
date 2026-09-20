import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { fonts, useTheme } from '@/theme';

interface Props {
  label: string;
  value?: string;
  onPress?: () => void;
  last?: boolean;
}

export function SettingsRow({ label, value, onPress, last }: Props) {
  const { colors } = useTheme();
  return (
    <Pressable onPress={onPress} disabled={!onPress} style={({ pressed }) => [styles.row, { borderBottomColor: last ? 'transparent' : colors.hair, opacity: pressed ? 0.5 : 1 }]}>
      <Text style={[styles.label, { color: colors.ink }]}>{label}</Text>
      <View style={styles.right}>
        {value ? <Text style={[styles.value, { color: colors.ink2 }]}>{value}</Text> : null}
        {onPress ? <Ionicons name="chevron-forward" size={16} color={colors.ink3} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 15, borderBottomWidth: StyleSheet.hairlineWidth },
  label: { fontFamily: fonts.medium, fontSize: 17, letterSpacing: -0.4 },
  right: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  value: { fontFamily: fonts.regular, fontSize: 16, letterSpacing: -0.3 },
});
