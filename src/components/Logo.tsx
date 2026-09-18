import { Image } from 'expo-image';
import { useTheme } from '@/theme';

export function Logo({ size = 32, color }: { size?: number; color?: string }) {
  const { colors } = useTheme();
  return (
    <Image
      source={require('../../assets/images/logo.webp')}
      style={{ width: size, height: size, tintColor: color ?? colors.ink }}
      contentFit="contain"
      accessibilityLabel="Jawāb"
    />
  );
}
