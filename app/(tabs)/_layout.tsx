import { Tabs } from 'expo-router';
import { FlatTabBar } from '@/components';

export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <FlatTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="topics" options={{ title: 'Chapters' }} />
      <Tabs.Screen name="saved" options={{ title: 'Saved' }} />
    </Tabs>
  );
}
