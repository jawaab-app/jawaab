import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HistoryRow } from '@/components';
import { history, trending } from '@/data/sample';
import { fonts, space, type, useTheme } from '@/theme';

export default function SearchScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [q, setQ] = useState('');
  const all = [...history, ...trending];
  const results = q.trim() ? all.filter((a) => a.question.toLowerCase().includes(q.toLowerCase())) : all;

  return (
    <View style={{ flex: 1, backgroundColor: colors.paper, paddingTop: insets.top + 8, paddingHorizontal: space.gutter }}>
      <View style={styles.bar}>
        <View style={[styles.field, { backgroundColor: colors.field }]}>
          <Ionicons name="search" size={18} color={colors.ink2} />
          <TextInput
            autoFocus
            value={q}
            onChangeText={setQ}
            placeholder="Search answers"
            placeholderTextColor={colors.ink2}
            style={[styles.input, { color: colors.ink }]}
            returnKeyType="search"
          />
        </View>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Text style={[styles.cancel, { color: colors.ink }]}>Cancel</Text>
        </Pressable>
      </View>
      {results.length === 0 ? (
        <Text style={[type.body, { color: colors.ink2, marginTop: 40, textAlign: 'center' }]}>Nothing for “{q}”.</Text>
      ) : (
        results.map((item, i) => (
          <HistoryRow key={item.id} item={{ ...item, live: false }} last={i === results.length - 1} onPress={() => router.push(`/answer/${item.id}`)} />
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 8 },
  field: { flex: 1, height: 44, borderRadius: space.pill, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 8 },
  input: { flex: 1, fontFamily: fonts.regular, fontSize: 17, letterSpacing: -0.3, paddingVertical: 0 },
  cancel: { fontFamily: fonts.medium, fontSize: 16, letterSpacing: -0.3 },
});
