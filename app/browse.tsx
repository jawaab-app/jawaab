import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '@/api/client';
import { madhabFilter, schoolLabel, toRow } from '@/api/format';
import { usePaged } from '@/api/hooks';
import { HistoryRow, IconButton, LoadState } from '@/components';
import { chapterById } from '@/data/chapters';
import { usePrefs } from '@/store/prefs';
import { space, type, useTheme } from '@/theme';

const PAGE = 20;

// Answers in a chapter (?chapter=prayer) or under a tag (?tag=umrah&title=Umrah).
export default function BrowseScreen() {
  const { chapter: chapterId, tag, title } = useLocalSearchParams<{ chapter?: string; tag?: string; title?: string }>();
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { prefs } = usePrefs();
  const madhab = madhabFilter(prefs.school);
  const chapter = chapterById(chapterId);

  const key = chapter ? `chapter:${chapter.id}:${madhab ?? '*'}` : tag ? `tag:${tag}:${madhab ?? '*'}` : null;
  const load = useCallback(
    (offset: number, signal: AbortSignal) =>
      chapter ? api.search(chapter.query, { madhab, limit: PAGE, offset }, signal) : api.questions({ tag, madhab, limit: PAGE, offset }, signal),
    [chapter, tag, madhab],
  );
  const list = usePaged(key, load);
  const heading = chapter?.name ?? title ?? tag ?? 'Answers';

  return (
    <View style={{ flex: 1, backgroundColor: colors.paper }}>
      <View style={[styles.nav, { paddingTop: insets.top + 8 }]}>
        <IconButton name="chevron-back" label="Back" onPress={() => router.back()} />
      </View>
      <FlatList
        data={list.items}
        keyExtractor={(q) => String(q.id)}
        contentContainerStyle={{ paddingHorizontal: space.gutter, paddingBottom: insets.bottom + 40 }}
        ListHeaderComponent={
          <View style={{ paddingTop: 12, paddingBottom: 8 }}>
            <Text style={[type.largeTitle, { color: colors.ink }]}>{heading}</Text>
            {chapter && <Text style={[styles.arabic, { color: colors.ink2 }]}>{chapter.arabic}</Text>}
            <Text style={[type.body, { color: colors.ink2, marginTop: 8 }]}>
              {list.total !== null ? `${list.total.toLocaleString()} answers` : ' '}
              {madhab ? ` · ${schoolLabel(madhab)}` : ''}
            </Text>
          </View>
        }
        renderItem={({ item, index }) => (
          <HistoryRow item={toRow(item)} last={index === list.items.length - 1} onPress={() => router.push(`/answer/${item.id}`)} />
        )}
        onEndReached={list.loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          <LoadState
            loading={list.loading}
            error={list.error}
            onRetry={list.retry}
            empty={!key ? 'Nothing to show.' : list.total === 0 ? 'No answers here yet.' : null}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  nav: { paddingHorizontal: space.gutter, paddingBottom: 8, flexDirection: 'row', alignItems: 'center' },
  arabic: { fontSize: 20, marginTop: 4, writingDirection: 'rtl', textAlign: 'left' },
});
