import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { fonts, useTheme } from '@/theme';

interface Props {
  placeholder: string;
  onPress?: () => void;
  onMic?: () => void;
}

export function SearchField({ placeholder, onPress, onMic }: Props) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="search"
      style={({ pressed }) => [styles.field, { backgroundColor: colors.field, opacity: pressed ? 0.7 : 1 }]}
    >
      <Ionicons name="search-outline" size={20} color={colors.ink2} />
      <Text style={[styles.placeholder, { color: colors.ink2 }]} numberOfLines={1}>
        {placeholder}
      </Text>
      <Pressable onPress={onMic} hitSlop={10} accessibilityLabel="Voice search">
        <Ionicons name="mic-outline" size={21} color={colors.ink2} />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  field: {
    height: 50,
    borderRadius: 14,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  placeholder: { flex: 1, fontFamily: fonts.body, fontSize: 17 },
});
