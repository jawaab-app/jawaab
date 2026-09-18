import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { chapters } from '@/data/sample';
import { fonts, space, type, useTheme } from '@/theme';

export default function TopicsScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <ScrollView style={{ backgroundColor: colors.paper }} contentContainerStyle={{ paddingTop: insets.top + 24, paddingBottom: 40, paddingHorizontal: space.gutter }}>
      <Text style={[type.largeTitle, { color: colors.ink }]}>Chapters</Text>
      <Text style={[type.body, { color: colors.ink2, marginTop: 8, marginBottom: 24 }]}>Twenty-four, in the order of the classical manuals.</Text>
      {chapters.map((c, i) => (
        <Pressable
          key={c.id}
          onPress={() => router.push(`/answer/${c.id}`)}
          style={({ pressed }) => [styles.row, { borderBottomColor: i === chapters.length - 1 ? 'transparent' : colors.hair, opacity: pressed ? 0.5 : 1 }]}
        >
          <Text style={[styles.index, { color: colors.ink3 }]}>{String(i + 1).padStart(2, '0')}</Text>
          <View style={{ flex: 1 }}>
            <Text style={[type.question, { color: colors.ink }]}>{c.name}</Text>
            <Text style={[type.meta, { color: colors.ink2, marginTop: 2 }]}>{c.count} answers</Text>
          </View>
          <Text style={[styles.arabic, { color: colors.ink2 }]}>{c.arabic}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 16, paddingVertical: 16, borderBottomWidth: StyleSheet.hairlineWidth },
  index: { width: 24, fontFamily: fonts.regular, fontSize: 13, letterSpacing: -0.1 },
  arabic: { fontSize: 17, writingDirection: 'rtl' },
});
