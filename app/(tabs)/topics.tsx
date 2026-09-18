import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PILL_HEIGHT } from '@/components';
import { chapters } from '@/data/sample';
import { fonts, space, type, useTheme } from '@/theme';

export default function TopicsScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <ScrollView
      style={{ backgroundColor: colors.paper }}
      contentContainerStyle={{ paddingTop: insets.top + 18, paddingBottom: PILL_HEIGHT + insets.bottom + 40, paddingHorizontal: space.gutter }}
    >
      <Text style={[type.h1, { color: colors.ink }]}>The book</Text>
      <Text style={[type.meta, { color: colors.ink2, marginTop: 6, marginBottom: 20 }]}>24 chapters, ordered as the classical manuals order them.</Text>
      {chapters.map((c, i) => (
        <Pressable
          key={c.id}
          onPress={() => router.push(`/answer/${c.id}`)}
          style={({ pressed }) => [styles.row, { borderBottomColor: colors.hair, opacity: pressed ? 0.6 : 1 }]}
        >
          <Image source={c.art} style={styles.thumb} contentFit="cover" />
          <View style={{ flex: 1 }}>
            <Text style={[type.cardTitle, { color: colors.ink }]}>{c.name}</Text>
            <Text style={[styles.arabic, { color: colors.ink2 }]}>{c.arabic}</Text>
          </View>
          <Text style={[type.meta, { color: colors.ink3 }]}>{c.count}</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.ink3} />
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  thumb: { width: 52, height: 52, borderRadius: 10 },
  arabic: { fontFamily: fonts.body, fontSize: 15, marginTop: 2, writingDirection: 'rtl', textAlign: 'left' },
});
