import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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
      <View style={[styles.nav, { paddingTop: insets.top }]}>
        <Pressable onPress={() => router.back()} hitSlop={12} accessibilityLabel="Back" style={styles.navSide}>
          <Ionicons name="chevron-back" size={26} color={colors.ink} />
        </Pressable>
        <View style={[styles.navSide, styles.navRight]}>
          <Text style={[styles.aa, { color: colors.ink }]}>
            A<Text style={{ fontSize: 12 }}>a</Text>
          </Text>
          <Pressable onPress={() => setSaved((s) => !s)} hitSlop={10} accessibilityLabel="Save">
            <Ionicons name={saved ? 'bookmark' : 'bookmark-outline'} size={22} color={saved ? colors.accent : colors.ink} />
          </Pressable>
          <Ionicons name="share-outline" size={22} color={colors.ink} />
        </View>
      </View>
      <View style={[styles.progress, { backgroundColor: colors.hair }]}>
        <View style={[styles.progressFill, { backgroundColor: colors.accent, width: `${progress * 100}%` }]} />
      </View>

      <ScrollView onScroll={onScroll} scrollEventThrottle={32} contentContainerStyle={[styles.art, { paddingBottom: insets.bottom + 120 }]}>
        <View style={styles.kicker}>
          <Text style={[type.label, { color: colors.ink3 }]}>{answer.topic.toUpperCase()}</Text>
          <View style={[styles.kickerSep, { backgroundColor: colors.ink3 }]} />
          <Text style={[type.label, { color: colors.accent }]}>{answer.school.toUpperCase()}</Text>
        </View>
        <Text style={[type.h1, { color: colors.ink, marginTop: 10 }]}>{answer.question}</Text>

        <View style={[styles.byline, { borderColor: colors.hair }]}>
          <View style={[styles.mono, { backgroundColor: colors.field }]}>
            <Text style={[styles.monoText, { color: colors.ink }]}>{answer.publisherShort}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.pub, { color: colors.ink }]}>{answer.publisher}</Text>
            <Text style={[type.meta, { color: colors.ink2 }]}>
              {answer.team} · {answer.published} · {answer.readMinutes} min read
            </Text>
          </View>
          <Text style={[styles.out, { color: colors.accent }]}>Original</Text>
        </View>

        <Text style={[type.lede, { color: colors.ink, marginTop: 22 }]}>{answer.lede}</Text>
        <Text style={[type.body, { color: colors.ink, marginTop: 16 }]}>{answer.paragraphs[0]}</Text>

        {answer.aya && (
          <View style={[styles.aya, { backgroundColor: colors.aya }]}>
            <Text style={[styles.arabic, { color: colors.ink }]}>{answer.aya.arabic}</Text>
            <Text style={[styles.ayaEn, { color: colors.ink2 }]}>{answer.aya.english}</Text>
            <Text style={[type.label, { color: colors.ink3, marginTop: 10 }]}>{answer.aya.ref.toUpperCase()}</Text>
          </View>
        )}

        {answer.quote && (
          <View style={[styles.quote, { borderLeftColor: colors.accent }]}>
            <Text style={[styles.quoteText, { color: colors.ink }]}>{answer.quote.text}</Text>
            <Text style={[type.meta, { color: colors.ink3, marginTop: 8 }]}>{answer.quote.attribution}</Text>
          </View>
        )}

        <Text style={[styles.sub, { color: colors.ink }]}>When the concession ends</Text>
        {answer.paragraphs.slice(1).map((p, i) => (
          <Text key={i} style={[type.body, { color: colors.ink, marginTop: 12 }]}>
            {p}
          </Text>
        ))}

        <View style={[styles.credit, { borderColor: colors.hair, backgroundColor: colors.card }]}>
          <Text style={[type.meta, { color: colors.ink2 }]}>
            Reproduced in full under licence from the publisher. The text is theirs and has not been edited, shortened or re-worded. Jawāb adds only the headings and the links.
          </Text>
          <View style={styles.creditActs}>
            <Text style={[styles.creditLink, { color: colors.accent }]}>Read on {answer.publisher}</Text>
            <Text style={[styles.creditLink, { color: colors.ink3 }]}>Report an error</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.dock, { bottom: insets.bottom + 14 }]}>
        <Pressable style={[styles.dockMain, { backgroundColor: colors.ink }]}>
          <Ionicons name="layers-outline" size={18} color={colors.paper} />
          <Text style={[styles.dockText, { color: colors.paper }]}>{answer.otherAnswers} other answers</Text>
        </Pressable>
        <Pressable style={[styles.dockIcon, { backgroundColor: colors.card, borderColor: colors.hair }]} accessibilityLabel="Open original">
          <Ionicons name="open-outline" size={20} color={colors.ink} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  nav: { height: 52, paddingHorizontal: space.gutter - 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', },
  navSide: { minWidth: 60, justifyContent: 'center' },
  navRight: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 18 },
  aa: { fontFamily: fonts.semibold, fontSize: 18 },
  progress: { height: 2 },
  progressFill: { height: 2 },
  art: { paddingHorizontal: space.gutter, paddingTop: 22 },
  kicker: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  kickerSep: { width: 3, height: 3, borderRadius: 2 },
  byline: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 20, paddingVertical: 14, borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth },
  mono: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  monoText: { fontFamily: fonts.semibold, fontSize: 14 },
  pub: { fontFamily: fonts.medium, fontSize: 15 },
  out: { fontFamily: fonts.medium, fontSize: 14 },
  aya: { marginTop: 22, padding: 18, borderRadius: 14 },
  arabic: { fontSize: 24, lineHeight: 42, textAlign: 'right', writingDirection: 'rtl' },
  ayaEn: { fontFamily: fonts.display, fontSize: 17.5, lineHeight: 26, marginTop: 12 },
  quote: { marginTop: 22, paddingLeft: 16, borderLeftWidth: 2 },
  quoteText: { fontFamily: fonts.display, fontSize: 18, lineHeight: 27 },
  sub: { fontFamily: fonts.semibold, fontSize: 15, marginTop: 28 },
  credit: { marginTop: 32, padding: 16, borderRadius: 14, borderWidth: StyleSheet.hairlineWidth, gap: 14 },
  creditActs: { flexDirection: 'row', gap: 18 },
  creditLink: { fontFamily: fonts.medium, fontSize: 14 },
  dock: { position: 'absolute', left: space.gutter, right: space.gutter, flexDirection: 'row', gap: 10 },
  dockMain: { flex: 1, height: 52, borderRadius: 26, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  dockText: { fontFamily: fonts.medium, fontSize: 15 },
  dockIcon: { width: 52, height: 52, borderRadius: 26, borderWidth: StyleSheet.hairlineWidth, alignItems: 'center', justifyContent: 'center' },
});
