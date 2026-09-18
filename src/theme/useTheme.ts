import { useColorScheme } from 'react-native';
import { palette, type Colors, type Scheme } from './tokens';

export function useTheme(): { colors: Colors; scheme: Scheme; isDark: boolean } {
  const system = useColorScheme();
  const scheme: Scheme = system === 'dark' ? 'dark' : 'light';
  return { colors: palette[scheme], scheme, isDark: scheme === 'dark' };
}
