import { Ionicons } from '@expo/vector-icons';
import { Icon, Label, VectorIcon } from 'expo-router';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { fonts, useTheme } from '@/theme';

type IoniconName = keyof typeof Ionicons.glyphMap;

function tabIcon(outline: IoniconName, filled: IoniconName) {
  return {
    default: <VectorIcon family={Ionicons} name={outline} />,
    selected: <VectorIcon family={Ionicons} name={filled} />,
  };
}

export default function TabsLayout() {
  const { colors } = useTheme();
  return (
    <NativeTabs
      backgroundColor={colors.paper}
      tintColor={colors.accent}
      iconColor={{ default: colors.ink2, selected: colors.accent }}
      indicatorColor={colors.accentSoft}
      labelVisibilityMode="labeled"
      labelStyle={{
        default: { color: colors.ink2, fontFamily: fonts.medium, fontSize: 12 },
        selected: { color: colors.accent, fontFamily: fonts.medium, fontSize: 12 },
      }}
    >
      <NativeTabs.Trigger name="index">
        <Label>Home</Label>
        <Icon src={tabIcon('home-outline', 'home')} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="topics">
        <Label>Topics</Label>
        <Icon src={tabIcon('list-outline', 'list')} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="saved">
        <Label>Saved</Label>
        <Icon src={tabIcon('bookmark-outline', 'bookmark')} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
