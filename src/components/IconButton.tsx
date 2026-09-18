import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet } from 'react-native';
import { useTheme } from '@/theme';

type Name = keyof typeof Ionicons.glyphMap;

export function IconButton({ name, onPress, label, size = 38 }: { name: Name; onPress?: () => void; label: string; size?: number }) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      hitSlop={8}
      accessibilityLabel={label}
      accessibilityRole="button"
      style={({ pressed }) => [styles.btn, { width: size, height: size, borderRadius: size / 2, backgroundColor: colors.field, opacity: pressed ? 0.6 : 1 }]}
    >
      <Ionicons name={name} size={size * 0.5} color={colors.ink} />
    </Pressable>
  );
}

const styles = StyleSheet.create({ btn: { alignItems: 'center', justifyContent: 'center' } });
