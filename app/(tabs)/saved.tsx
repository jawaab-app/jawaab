import { useRouter } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { relativeTime, toRow } from '@/api/format';
import { HistoryRow, LoadState } from '@/components';
import { useLibrary } from '@/store/library';
import { space, type, useTheme } from '@/theme';

export default function SavedScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { saved } = useLibrary();

  return (
    <ScrollView style={{ backgroundColor: colors.paper }} contentContainerStyle={{ paddingTop: insets.top + 24, paddingBottom: 40, paddingHorizontal: space.gutter }}>
      <Text style={[type.largeTitle, { color: colors.ink }]}>Saved</Text>
      <Text style={[type.body, { color: colors.ink2, marginTop: 8, marginBottom: 12 }]}>
        {saved.length === 1 ? '1 answer' : `${saved.length} answers`}, kept on this device.
      </Text>
      <View>
        {saved.map((e, i) => (
          <HistoryRow key={e.question.id} item={toRow(e.question, relativeTime(e.at))} last={i === saved.length - 1} onPress={() => router.push(`/answer/${e.question.id}`)} />
        ))}
      </View>
      {saved.length === 0 && <LoadState empty="Tap the bookmark on any answer to keep it here." />}
    </ScrollView>
  );
}
