import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Keyboard, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '@/api/client';
import { madhabFilter, relativeTime, schoolLabel, toRow } from '@/api/format';
import { queryTerms } from '@/api/highlight';
import { usePaged } from '@/api/hooks';
import type { QuestionSummary } from '@/api/types';
import { HistoryRow, LoadState } from '@/components';
import { SEARCH_SUGGESTIONS } from '@/data/suggestions';
import { useLibrary } from '@/store/library';
import { usePrefs } from '@/store/prefs';
import { fonts, space, type, useTheme } from '@/theme';

const PAGE = 20;
const DEBOUNCE_MS = 250;

type Scope = 'school' | 'all';

export default function SearchScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { prefs } = usePrefs();
  const { history, searches, addSearch, clearSearches } = useLibrary();
  const inputRef = useRef<TextInput>(null);

  const school = madhabFilter(prefs.school);
  // Default: every school, the reader's ranked first. 'school' narrows to it.
  const [scope, setScope] = useState<Scope>('all');
  const madhab = scope === 'school' ? school : null;
  const prefer = scope === 'all' ? school : null;

  const [q, setQ] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setQuery(q.trim()), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [q]);

  const active = query.length >= 2;
  const terms = useMemo(() => queryTerms(query), [query]);
  const load = useCallback(
    (offset: number, signal: AbortSignal) => api.search(query, { madhab, prefer, limit: PAGE, offset }, signal),
    [query, madhab, prefer],
  );
  const results = usePaged(active ? `search:${madhab ?? '*'}:${prefer ?? '*'}:${query}` : null, load);
  // The archive holds the same answer more than once under different ids; show each title once.
  const items = useMemo(() => {
    const seen = new Set<string>();
    return results.items.filter((q) => {
      const k = q.title.trim().toLowerCase();
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  }, [results.items]);

  const submit = (text: string) => {
    const next = text.trim();
    setQ(next);
    setQuery(next);
    if (next.length >= 2) addSearch(next);
    Keyboard.dismiss();
  };

  const open = (item: QuestionSummary) => {
    if (query.length >= 2) addSearch(query);
    router.push(`/answer/${item.id}`);
  };

  const recent = history.slice(0, 6);
  const noResults = active && !results.loading && !results.error && results.total === 0;

  return (
    <View style={{ flex: 1, backgroundColor: colors.paper, paddingTop: insets.top + 8 }}>
      <View style={[styles.bar, styles.pad]}>
        <View style={[styles.field, { backgroundColor: colors.field }]}>
          <Ionicons name="search" size={18} color={colors.ink2} />
          <TextInput
            ref={inputRef}
            autoFocus
            value={q}
            onChangeText={setQ}
            onSubmitEditing={() => submit(q)}
            placeholder="Ask anything…"
            placeholderTextColor={colors.ink2}
            style={[styles.input, { color: colors.ink }]}
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
          />
          {q.length > 0 && (
            <Pressable
              onPress={() => {
                setQ('');
                setQuery('');
                inputRef.current?.focus();
              }}
              hitSlop={10}
              accessibilityLabel="Clear"
            >
              <Ionicons name="close-circle" size={18} color={colors.ink3} />
            </Pressable>
          )}
        </View>
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Text style={[styles.cancel, { color: colors.ink }]}>Cancel</Text>
        </Pressable>
      </View>

      {active ? (
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.id)}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={[styles.pad, { paddingBottom: insets.bottom + 40 }]}
          ListHeaderComponent={
            <View style={styles.header}>
              <Text style={[type.meta, { color: colors.ink3 }]}>
                {results.total === null
                  ? results.loading
                    ? 'Searching…'
                    : ''
                  : results.fuzzy
                    ? `Close matches · ${results.total.toLocaleString()}`
                    : `${results.total.toLocaleString()} answers`}
              </Text>
              {school && (
                <View style={styles.scope}>
                  {(['school', 'all'] as Scope[]).map((s) => (
                    <Pressable key={s} onPress={() => setScope(s)} hitSlop={6}>
                      <Text style={[styles.scopeText, { color: scope === s ? colors.ink : colors.ink3, fontFamily: scope === s ? fonts.semibold : fonts.medium }]}>
                        {s === 'school' ? `${schoolLabel(school)} only` : 'All schools'}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          }
          renderItem={({ item, index }) => (
            <HistoryRow item={toRow(item)} highlight={results.fuzzy ? undefined : terms} last={index === items.length - 1} onPress={() => open(item)} />
          )}
          onEndReached={results.loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            noResults ? (
              <View style={styles.empty}>
                <Text style={[type.body, { color: colors.ink2 }]}>Nothing for “{query}”.</Text>
                {scope === 'school' && school ? (
                  <Pressable onPress={() => setScope('all')} hitSlop={8} style={{ marginTop: 10 }}>
                    <Text style={[styles.link, { color: colors.ink }]}>Search all schools</Text>
                  </Pressable>
                ) : (
                  <Text style={[type.meta, { color: colors.ink3, marginTop: 8 }]}>Try fewer or simpler words.</Text>
                )}
              </View>
            ) : (
              <LoadState loading={results.loading} error={results.error} onRetry={results.retry} />
            )
          }
        />
      ) : (
        <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag" contentContainerStyle={[styles.pad, { paddingBottom: insets.bottom + 40 }]}>
          {searches.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHead}>
                <Text style={[type.meta, { color: colors.ink3 }]}>Recent searches</Text>
                <Pressable onPress={clearSearches} hitSlop={8}>
                  <Text style={[type.meta, { color: colors.ink2 }]}>Clear</Text>
                </Pressable>
              </View>
              <View style={styles.chips}>
                {searches.map((s) => (
                  <Chip key={s} label={s} icon="time-outline" onPress={() => submit(s)} />
                ))}
              </View>
            </View>
          )}

          <View style={styles.section}>
            <Text style={[type.meta, { color: colors.ink3 }]}>Try</Text>
            <View style={styles.chips}>
              {SEARCH_SUGGESTIONS.map((s) => (
                <Chip key={s} label={s} onPress={() => submit(s)} />
              ))}
            </View>
          </View>

          {recent.length > 0 && (
            <View style={styles.section}>
              <Text style={[type.meta, { color: colors.ink3, marginBottom: 2 }]}>Recently read</Text>
              {recent.map((e, i) => (
                <HistoryRow key={e.question.id} item={toRow(e.question, relativeTime(e.at))} last={i === recent.length - 1} onPress={() => router.push(`/answer/${e.question.id}`)} />
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

function Chip({ label, icon, onPress }: { label: string; icon?: keyof typeof Ionicons.glyphMap; onPress: () => void }) {
  const { colors } = useTheme();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.chip, { borderColor: colors.hair, opacity: pressed ? 0.5 : 1 }]}>
      {icon && <Ionicons name={icon} size={14} color={colors.ink3} />}
      <Text style={[styles.chipText, { color: colors.ink }]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pad: { paddingHorizontal: space.gutter },
  bar: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 4 },
  field: { flex: 1, height: 44, borderRadius: space.pill, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 8 },
  input: { flex: 1, fontFamily: fonts.regular, fontSize: 17, letterSpacing: -0.3, paddingVertical: 0 },
  cancel: { fontFamily: fonts.medium, fontSize: 16, letterSpacing: -0.3 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, paddingBottom: 4 },
  scope: { flexDirection: 'row', gap: 14 },
  scopeText: { fontSize: 13, letterSpacing: -0.2 },
  empty: { paddingVertical: 28 },
  link: { fontFamily: fonts.medium, fontSize: 15, letterSpacing: -0.3 },
  section: { marginTop: 22 },
  sectionHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  chip: { height: 36, paddingHorizontal: 14, borderRadius: space.pill, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 6, maxWidth: '100%' },
  chipText: { fontFamily: fonts.medium, fontSize: 14, letterSpacing: -0.3 },
});
