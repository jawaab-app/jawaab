import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HistoryRow } from '@/components';
import { history, trending } from '@/data/sample';
import { space, type, useTheme } from '@/theme';

export default function SavedScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const saved = [...history, ...trending];

  return (
    <ScrollView style={{ backgroundColor: colors.paper }} contentContainerStyle={{ paddingTop: insets.top + 24, paddingBottom: 40, paddingHorizontal: space.gutter }}>
      <Text style={[type.largeTitle, { color: colors.ink }]}>Saved</Text>
      <Text style={[type.body, { color: colors.ink2, marginTop: 8, marginBottom: 12 }]}>{saved.length} answers, kept on this device.</Text>
      <View>
        {saved.map((item, i) => (
          <HistoryRow key={item.id} item={{ ...item, live: false }} last={i === saved.length - 1} onPress={() => router.push(`/answer/${item.id}`)} />
        ))}
      </View>
    </ScrollView>
  );
}
