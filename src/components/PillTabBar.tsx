import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { type, useTheme } from '@/theme';

type IconName = keyof typeof Ionicons.glyphMap;

// expo-router ships its own bottom-tabs typings; derive the tabBar props from it.
type BottomTabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

const ICONS: Record<string, { off: IconName; on: IconName }> = {
  index: { off: 'home-outline', on: 'home' },
  topics: { off: 'list-outline', on: 'list' },
  saved: { off: 'bookmark-outline', on: 'bookmark' },
};

export const PILL_HEIGHT = 74;

export function PillTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const bottom = Math.max(insets.bottom, 12) + 6;

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { bottom }]}>
      <View
        style={[
          styles.pill,
          {
            backgroundColor: colors.pill,
            borderColor: colors.hair,
            shadowColor: colors.pillShadow,
            shadowOpacity: isDark ? 0.5 : 0.14,
          },
        ]}
      >
        {state.routes.map((route, i) => {
          const focused = state.index === i;
          const { options } = descriptors[route.key];
          const label = typeof options.title === 'string' ? options.title : route.name;
          const icon = ICONS[route.name] ?? ICONS.index;
          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
          };
          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
              accessibilityLabel={label}
              style={[styles.tab, focused && { backgroundColor: colors.accentSoft }]}
            >
              <Ionicons name={focused ? icon.on : icon.off} size={24} color={focused ? colors.accent : colors.ink2} />
              <Text style={[type.tab, { color: focused ? colors.accent : colors.ink2 }]}>{label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, alignItems: 'center' },
  pill: {
    flexDirection: 'row',
    height: PILL_HEIGHT,
    borderRadius: PILL_HEIGHT / 2,
    padding: 6,
    gap: 4,
    borderWidth: StyleSheet.hairlineWidth,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 22,
    ...Platform.select({ android: { elevation: 10 } }),
  },
  tab: {
    width: 108,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
});
