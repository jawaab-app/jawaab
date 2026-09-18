import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { fonts, space, useTheme } from '@/theme';

interface Props {
  placeholder: string;
  onPress?: () => void;
  onMic?: () => void;
}

// A quiet composer-style field: hairline card, prompt on top, actions below.
export function SearchField({ placeholder, onPress, onMic }: Props) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="search"
      style={({ pressed }) => [styles.card, { backgroundColor: colors.card, borderColor: colors.hair, opacity: pressed ? 0.7 : 1 }]}
    >
      <Text style={[styles.placeholder, { color: colors.ink2 }]} numberOfLines={1}>
        {placeholder}
      </Text>
      <View style={styles.actions}>
        <Ionicons name="search" size={20} color={colors.ink} />
        <View style={{ flex: 1 }} />
        <Pressable onPress={onMic} hitSlop={10} accessibilityLabel="Voice search">
          <Ionicons name="mic-outline" size={21} color={colors.ink} />
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: space.radiusLg,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 14,
    gap: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  placeholder: { fontFamily: fonts.regular, fontSize: 15, letterSpacing: -0.2 },
  actions: { flexDirection: 'row', alignItems: 'center' },
});
