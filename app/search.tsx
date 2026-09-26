import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '@/api/client';
import { madhabFilter, relativeTime, toRow } from '@/api/format';
import { usePaged } from '@/api/hooks';
import { HistoryRow, LoadState } from '@/components';
import { useLibrary } from '@/store/library';
import { usePrefs } from '@/store/prefs';
import { fonts, space, type, useTheme } from '@/theme';

const PAGE = 20;
const DEBOUNCE_MS = 300;

export default function SearchScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { prefs } = usePrefs();
  const { history } = useLibrary();
  const madhab = madhabFilter(prefs.school);
  const [q, setQ] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setQuery(q.trim()), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [q]);

  // The API needs at least two characters.
  const active = query.length >= 2;
  const load = useCallback((offset: number, signal: AbortSignal) => api.search(query, { madhab, limit: PAGE, offset }, signal), [query, madhab]);
  const results = usePaged(active ? `search:${madhab ?? '*'}:${query}` : null, load);

  const recent = history.slice(0, 8);

  return (
    <View style={{ flex: 1, backgroundColor: colors.paper, paddingTop: insets.top + 8, paddingHorizontal: space.gutter }}>
      <View style={styles.bar}>
        <View style={[styles.field, { backgroundColor: colors.field }]}>
          <Ionicons name="search" size={18} color={colors.ink2} />
          <TextInput
            autoFocus
            value={q}
            onChangeText={setQ}
            onSubmitEditing={() => setQuery(q.trim())}
            placeholder="Ask anything…"
            placeholderTextColor={colors.ink2}
            style={[styles.input, { color: colors.ink }]}
            returnKeyType="search"
            autoCorrect={false}
          />
        </View>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Text style={[styles.cancel, { color: colors.ink }]}>Cancel</Text>
        </Pressable>
      </View>

      {active ? (
        <FlatList
          data={results.items}
          keyExtractor={(item) => String(item.id)}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
          ListHeaderComponent={
            results.total !== null ? (
              <Text style={[type.meta, { color: colors.ink3, marginTop: 8 }]}>{results.total.toLocaleString()} answers</Text>
            ) : null
          }
          renderItem={({ item, index }) => (
            <HistoryRow item={toRow(item)} last={index === results.items.length - 1} onPress={() => router.push(`/answer/${item.id}`)} />
          )}
          onEndReached={results.loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            <LoadState loading={results.loading} error={results.error} onRetry={results.retry} empty={results.total === 0 ? `Nothing for “${query}”.` : null} />
          }
        />
      ) : recent.length ? (
        <FlatList
          data={recent}
          keyExtractor={(e) => String(e.question.id)}
          keyboardShouldPersistTaps="handled"
          ListHeaderComponent={<Text style={[type.meta, { color: colors.ink3, marginTop: 8 }]}>Recently read</Text>}
          renderItem={({ item, index }) => (
            <HistoryRow item={toRow(item.question, relativeTime(item.at))} last={index === recent.length - 1} onPress={() => router.push(`/answer/${item.question.id}`)} />
          )}
        />
      ) : (
        <LoadState empty="Search every answer by question, topic or keyword." />
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
