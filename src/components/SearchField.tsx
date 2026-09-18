import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { fonts, space, useTheme } from '@/theme';

interface Props {
  placeholder: string;
  onPress?: () => void;
  onMic?: () => void;
}

// A search bar. One line, tall, pill. Search left, mic right.
export function SearchField({ placeholder, onPress, onMic }: Props) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="search"
      style={({ pressed }) => [styles.bar, { backgroundColor: colors.field, opacity: pressed ? 0.7 : 1 }]}
    >
      <Ionicons name="search" size={20} color={colors.ink} />
      <Text style={[styles.placeholder, { color: colors.ink2 }]} numberOfLines={1}>
        {placeholder}
      </Text>
      <Pressable onPress={onMic} hitSlop={10} accessibilityLabel="Voice search">
        <Ionicons name="mic-outline" size={21} color={colors.ink} />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: { height: 54, borderRadius: space.pill, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', gap: 10 },
  placeholder: { flex: 1, fontFamily: fonts.regular, fontSize: 17, letterSpacing: -0.3 },
});
