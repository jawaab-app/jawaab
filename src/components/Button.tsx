import { Pressable, StyleSheet, Text } from 'react-native';
import { fonts, space, useTheme } from '@/theme';

interface Props {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'onImage';
  disabled?: boolean;
}

// Pill buttons. Primary is ink on paper, secondary is hairline, onImage is white.
export function Button({ label, onPress, variant = 'primary', disabled }: Props) {
  const { colors } = useTheme();
  const bg = variant === 'primary' ? colors.button : variant === 'onImage' ? '#FFFFFF' : 'transparent';
  const fg = variant === 'primary' ? colors.buttonInk : variant === 'onImage' ? '#0A0A0A' : colors.ink;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.btn,
        { backgroundColor: bg, borderColor: variant === 'secondary' ? colors.hair : 'transparent', opacity: disabled ? 0.3 : pressed ? 0.8 : 1 },
      ]}
    >
      <Text style={[styles.label, { color: fg }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { height: 54, borderRadius: space.pill, borderWidth: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  label: { fontFamily: fonts.medium, fontSize: 17, letterSpacing: -0.4 },
});
