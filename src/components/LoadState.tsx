import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import type { ApiError } from '@/api/client';
import { fonts, type, useTheme } from '@/theme';

interface Props {
  loading?: boolean;
  error?: ApiError | null;
  empty?: string | null;
  onRetry?: () => void;
}

// Inline loading / error / empty message for API-backed lists and pages.
export function LoadState({ loading, error, empty, onRetry }: Props) {
  const { colors } = useTheme();
  if (loading) {
    return (
      <View style={styles.box}>
        <ActivityIndicator color={colors.ink2} />
      </View>
    );
  }
  if (error) {
    return (
      <View style={styles.box}>
        <Text style={[type.body, { color: colors.ink2, textAlign: 'center' }]}>{error.message}</Text>
        {onRetry && (
          <Pressable onPress={onRetry} hitSlop={10} style={{ marginTop: 12 }}>
            <Text style={[styles.retry, { color: colors.ink }]}>Try again</Text>
          </Pressable>
        )}
      </View>
    );
  }
  if (empty) {
    return (
      <View style={styles.box}>
        <Text style={[type.body, { color: colors.ink2, textAlign: 'center' }]}>{empty}</Text>
      </View>
    );
  }
  return null;
}

const styles = StyleSheet.create({
  box: { paddingVertical: 32, alignItems: 'center' },
  retry: { fontFamily: fonts.medium, fontSize: 15, letterSpacing: -0.3 },
});
