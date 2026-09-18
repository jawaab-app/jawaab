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
      tintColor={colors.ink}
      iconColor={{ default: colors.ink3, selected: colors.ink }}
      indicatorColor="transparent"
      labelVisibilityMode="labeled"
      labelStyle={{
        default: { color: colors.ink3, fontFamily: fonts.medium, fontSize: 11 },
        selected: { color: colors.ink, fontFamily: fonts.medium, fontSize: 11 },
      }}
    >
      <NativeTabs.Trigger name="index">
        <Label>Home</Label>
        <Icon src={tabIcon('home-outline', 'home')} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="topics">
        <Label>Chapters</Label>
        <Icon src={tabIcon('book-outline', 'book')} />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="saved">
        <Label>Saved</Label>
        <Icon src={tabIcon('bookmark-outline', 'bookmark')} />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
