import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HistoryRow, PILL_HEIGHT } from '@/components';
import { history, trending } from '@/data/sample';
import { space, type, useTheme } from '@/theme';

export default function SavedScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const saved = [...history, ...trending];

  return (
    <ScrollView
      style={{ backgroundColor: colors.paper }}
      contentContainerStyle={{ paddingTop: insets.top + 18, paddingBottom: PILL_HEIGHT + insets.bottom + 40, paddingHorizontal: space.gutter }}
    >
      <Text style={[type.h1, { color: colors.ink }]}>Saved</Text>
      <Text style={[type.meta, { color: colors.ink2, marginTop: 6, marginBottom: 8 }]}>{saved.length} answers, kept on this device.</Text>
      <View>
        {saved.map((item, i) => (
          <HistoryRow key={item.id} item={{ ...item, live: false }} last={i === saved.length - 1} onPress={() => router.push(`/answer/${item.id}`)} />
        ))}
      </View>
    </ScrollView>
  );
}
