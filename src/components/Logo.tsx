import { Image } from 'expo-image';
import { useTheme } from '@/theme';

// The mark is the masthead. Ink in light, paper-white in dark.
export function Logo({ size = 48 }: { size?: number }) {
  const { isDark } = useTheme();
  return (
    <Image
      source={require('../../assets/images/logo.webp')}
      style={{ width: size, height: size, tintColor: isDark ? '#F5F5F7' : '#111111' }}
      contentFit="contain"
      accessibilityLabel="Jawāb"
    />
  );
}
