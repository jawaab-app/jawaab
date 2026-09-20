import { useColorScheme } from 'react-native';
import { usePrefsOptional } from '@/store/prefs';
import { palette, type Colors, type Scheme } from './tokens';

export function useTheme(): { colors: Colors; scheme: Scheme; isDark: boolean } {
  const system = useColorScheme();
  const appearance = usePrefsOptional()?.prefs.appearance ?? 'system';
  const scheme: Scheme = appearance === 'system' ? (system === 'dark' ? 'dark' : 'light') : appearance;
  return { colors: palette[scheme], scheme, isDark: scheme === 'dark' };
}
