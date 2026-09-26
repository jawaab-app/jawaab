import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Linking, Pressable, ScrollView, Share, StyleSheet, Text, View, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { publisherName, readMinutes, schoolLabel, titleCase, topicTag } from '@/api/format';
import { useQuestion } from '@/api/hooks';
import { jmuText } from '@/api/jmu';
import { IconButton, JmuView, LoadState } from '@/components';
import { useLibrary } from '@/store/library';
import { fonts, space, type, useTheme } from '@/theme';

export default function AnswerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: answer, loading, error, reload } = useQuestion(id);
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isSaved, toggleSaved, markRead } = useLibrary();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (answer) markRead(answer);
    // Record once per loaded answer, not on every library change.
  }, [answer?.id]);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const max = contentSize.height - layoutMeasurement.height;
    setProgress(max > 0 ? Math.min(1, Math.max(0, contentOffset.y / max)) : 0);
  };

  const saved = answer ? isSaved(answer.id) : false;
  const source = answer ? answer.original_source_url || answer.url : null;
  const topic = answer ? topicTag(answer.tags) : null;
  const publisher = answer ? publisherName(answer.source_slug) : '';

  return (
    <View style={[styles.root, { backgroundColor: colors.paper }]}>
      <View style={[styles.nav, { paddingTop: insets.top + 8 }]}>
        <IconButton name="chevron-back" label="Back" onPress={() => router.back()} />
        <View style={styles.navRight}>
          <IconButton name={saved ? 'bookmark' : 'bookmark-outline'} label="Save" onPress={() => answer && toggleSaved(answer)} />
          <IconButton name="share-outline" label="Share" onPress={() => answer && Share.share({ message: `${answer.title}\n${answer.url}` }).catch(() => {})} />
        </View>
      </View>
      <View style={styles.progress}>
        <View style={[styles.progressFill, { backgroundColor: colors.ink, width: `${progress * 100}%` }]} />
      </View>

      {!answer ? (
        <LoadState loading={loading} error={error} empty={!loading && !error ? 'This answer could not be found.' : null} onRetry={reload} />
      ) : (
        <ScrollView onScroll={onScroll} scrollEventThrottle={32} contentContainerStyle={[styles.art, { paddingBottom: insets.bottom + 110 }]} showsVerticalScrollIndicator={false}>
          <Text style={[type.meta, { color: colors.ink2 }]}>
            {topic ? `${titleCase(topic.name)} · ` : ''}
            {schoolLabel(answer.madhab)}
          </Text>
          <Text style={[type.h1, { color: colors.ink, marginTop: 10 }]}>{answer.title}</Text>

          <View style={[styles.byline, { borderColor: colors.hair }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.pub, { color: colors.ink }]}>{publisher}</Text>
              <Text style={[type.meta, { color: colors.ink2, marginTop: 2 }]}>
                {answer.scholar ? `${answer.scholar} · ` : ''}
                {readMinutes(jmuText(answer.content_jmu))} min
              </Text>
            </View>
            {source && (
              <Pressable hitSlop={8} onPress={() => Linking.openURL(source).catch(() => {})}>
                <Text style={[styles.original, { color: colors.ink }]}>Original ↗</Text>
              </Pressable>
            )}
          </View>

          {answer.question ? <Text style={[type.lede, { color: colors.ink, marginTop: 28 }]}>{answer.question}</Text> : null}
          <View style={{ marginTop: answer.question ? 4 : 14 }}>
            <JmuView jmu={answer.content_jmu} />
          </View>

          <View style={[styles.credit, { borderTopColor: colors.hair }]}>
            <Text style={[type.meta, { color: colors.ink2 }]}>
              From {publisher}, via islamqa.org. Jawāb shows the answer as published and adds only the formatting.
            </Text>
          </View>
        </ScrollView>
      )}

      {topic && (
        <View style={[styles.dock, { bottom: insets.bottom + 14 }]}>
          <Pressable
            onPress={() => router.push({ pathname: '/browse', params: { tag: topic.slug, title: titleCase(topic.name) } })}
            style={({ pressed }) => [styles.dockMain, { backgroundColor: colors.button, opacity: pressed ? 0.85 : 1 }]}
          >
            <Ionicons name="layers-outline" size={18} color={colors.buttonInk} />
            <Text style={[styles.dockText, { color: colors.buttonInk }]}>More on {titleCase(topic.name)}</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  nav: { paddingHorizontal: space.gutter, paddingBottom: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  navRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  progress: { height: 2 },
  progressFill: { height: 2 },
  art: { paddingHorizontal: space.gutter, paddingTop: 24 },
  byline: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 22, paddingVertical: 14, borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth },
  pub: { fontFamily: fonts.medium, fontSize: 15, letterSpacing: -0.3 },
  original: { fontFamily: fonts.medium, fontSize: 14, letterSpacing: -0.2 },
  credit: { marginTop: 40, paddingTop: 18, borderTopWidth: StyleSheet.hairlineWidth },
  dock: { position: 'absolute', left: space.gutter, right: space.gutter, alignItems: 'center' },
  dockMain: { height: 52, paddingHorizontal: 24, borderRadius: space.pill, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  dockText: { fontFamily: fonts.medium, fontSize: 16, letterSpacing: -0.3 },
});
