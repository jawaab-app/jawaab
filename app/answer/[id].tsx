import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconButton } from '@/components';
import { getAnswer } from '@/data/sample';
import { fonts, space, type, useTheme } from '@/theme';

export default function AnswerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const answer = getAnswer(id ?? '');
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [saved, setSaved] = useState(false);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    const max = contentSize.height - layoutMeasurement.height;
    setProgress(max > 0 ? Math.min(1, Math.max(0, contentOffset.y / max)) : 0);
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.paper }]}>
      <View style={[styles.nav, { paddingTop: insets.top + 8 }]}>
        <IconButton name="chevron-back" label="Back" onPress={() => router.back()} />
        <View style={styles.navRight}>
          <IconButton name={saved ? 'bookmark' : 'bookmark-outline'} label="Save" onPress={() => setSaved((s) => !s)} />
          <IconButton name="share-outline" label="Share" />
        </View>
      </View>
      <View style={styles.progress}>
        <View style={[styles.progressFill, { backgroundColor: colors.ink, width: `${progress * 100}%` }]} />
      </View>

      <ScrollView onScroll={onScroll} scrollEventThrottle={32} contentContainerStyle={[styles.art, { paddingBottom: insets.bottom + 110 }]} showsVerticalScrollIndicator={false}>
        <Text style={[type.meta, { color: colors.ink2 }]}>
          {answer.topic} · {answer.school}
        </Text>
        <Text style={[type.h1, { color: colors.ink, marginTop: 10 }]}>{answer.question}</Text>

        <View style={[styles.byline, { borderColor: colors.hair }]}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.pub, { color: colors.ink }]}>{answer.publisher}</Text>
            <Text style={[type.meta, { color: colors.ink2, marginTop: 2 }]}>
              {answer.team} · {answer.published} · {answer.readMinutes} min
            </Text>
          </View>
          <Pressable hitSlop={8}>
            <Text style={[styles.original, { color: colors.ink }]}>Original ↗</Text>
          </Pressable>
        </View>

        <Text style={[type.lede, { color: colors.ink, marginTop: 28 }]}>{answer.lede}</Text>
        <Text style={[type.body, { color: colors.ink, marginTop: 18 }]}>{answer.paragraphs[0]}</Text>

        {answer.aya && (
          <View style={[styles.aya, { backgroundColor: colors.aya }]}>
            <Text style={[styles.arabic, { color: colors.ink }]}>{answer.aya.arabic}</Text>
            <Text style={[type.body, { color: colors.ink2, marginTop: 12 }]}>{answer.aya.english}</Text>
            <Text style={[type.meta, { color: colors.ink3, marginTop: 10 }]}>{answer.aya.ref}</Text>
          </View>
        )}

        {answer.quote && (
          <View style={[styles.quote, { borderLeftColor: colors.ink }]}>
            <Text style={[type.body, { color: colors.ink }]}>{answer.quote.text}</Text>
            <Text style={[type.meta, { color: colors.ink2, marginTop: 8 }]}>{answer.quote.attribution}</Text>
          </View>
        )}

        <Text style={[type.title, { color: colors.ink, marginTop: 32 }]}>When the concession ends</Text>
        {answer.paragraphs.slice(1).map((p, i) => (
          <Text key={i} style={[type.body, { color: colors.ink, marginTop: 14 }]}>
            {p}
          </Text>
        ))}

        <View style={[styles.credit, { borderTopColor: colors.hair }]}>
          <Text style={[type.meta, { color: colors.ink2 }]}>
            Reproduced in full under licence from {answer.publisher}. Nothing has been edited, shortened or re-worded. Jawāb adds only the headings and the links.
          </Text>
          <Text style={[type.meta, { color: colors.ink3, marginTop: 8 }]}>Report an error</Text>
        </View>
      </ScrollView>

      <View style={[styles.dock, { bottom: insets.bottom + 14 }]}>
        <Pressable style={({ pressed }) => [styles.dockMain, { backgroundColor: colors.button, opacity: pressed ? 0.85 : 1 }]}>
          <Ionicons name="layers-outline" size={18} color={colors.buttonInk} />
          <Text style={[styles.dockText, { color: colors.buttonInk }]}>{answer.otherAnswers} other answers</Text>
        </Pressable>
      </View>
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
  aya: { marginTop: 26, padding: 20, borderRadius: space.radiusLg },
  arabic: { fontSize: 24, lineHeight: 42, textAlign: 'right', writingDirection: 'rtl' },
  quote: { marginTop: 26, paddingLeft: 16, borderLeftWidth: 1.5 },
  credit: { marginTop: 40, paddingTop: 18, borderTopWidth: StyleSheet.hairlineWidth },
  dock: { position: 'absolute', left: space.gutter, right: space.gutter, alignItems: 'center' },
  dockMain: { height: 52, paddingHorizontal: 24, borderRadius: space.pill, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  dockText: { fontFamily: fonts.medium, fontSize: 16, letterSpacing: -0.3 },
});
