import { useRouter } from 'expo-router';
import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconButton } from './IconButton';
import { space, type, useTheme } from '@/theme';

// Shell for a page inside the settings sheet. Back on sub-pages, close on the root.
export function SettingsPage({ title, hint, root, children }: { title: string; hint?: string; root?: boolean; children: ReactNode }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  return (
    <ScrollView style={{ backgroundColor: colors.paper }} contentContainerStyle={{ paddingTop: 8, paddingHorizontal: space.gutter, paddingBottom: insets.bottom + 40 }}>
      <View style={styles.nav}>
        {root ? <View /> : <IconButton name="chevron-back" label="Back" onPress={() => router.back()} />}
        {root ? <IconButton name="close" label="Close" onPress={() => router.back()} /> : <View />}
      </View>
      <Text style={[type.largeTitle, { color: colors.ink, marginTop: 8 }]}>{title}</Text>
      {hint ? <Text style={[type.body, { color: colors.ink2, marginTop: 6 }]}>{hint}</Text> : null}
      <View style={{ marginTop: 24 }}>{children}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  nav: { height: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
