import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme';

type IconName = keyof typeof Ionicons.glyphMap;
type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

const ICONS: Record<string, { off: IconName; on: IconName }> = {
  index: { off: 'home-outline', on: 'home' },
  topics: { off: 'book-outline', on: 'book' },
  saved: { off: 'bookmark-outline', on: 'bookmark' },
};

// Flat, icon-only bar. A hairline on top, nothing else.
export function FlatTabBar({ state, descriptors, navigation }: TabBarProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { backgroundColor: colors.paper, borderTopColor: colors.hair, paddingBottom: Math.max(insets.bottom, 10) }]}>
      {state.routes.map((route, i) => {
        const focused = state.index === i;
        const icon = ICONS[route.name] ?? ICONS.index;
        const label = descriptors[route.key].options.title ?? route.name;
        const onPress = () => {
          const e = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !e.defaultPrevented) navigation.navigate(route.name);
        };
        return (
          <Pressable key={route.key} onPress={onPress} accessibilityRole="tab" accessibilityLabel={label} accessibilityState={{ selected: focused }} style={styles.tab} hitSlop={8}>
            <Ionicons name={focused ? icon.on : icon.off} size={24} color={focused ? colors.ink : colors.ink3} />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 10 },
  tab: { flex: 1, height: 40, alignItems: 'center', justifyContent: 'center' },
});
