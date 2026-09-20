import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { chapters } from '@/data/sample';
import { TOPIC_TO_CHAPTER } from '@/data/onboardingDemo';
import { fonts, space, type, useTheme } from '@/theme';

// The home rail, previewed. Chapters matching chosen topics fill in.
export function ChapterStrip({ topics }: { topics: string[] }) {
  const { colors } = useTheme();
  const active = new Set(topics.map((t) => TOPIC_TO_CHAPTER[t]).filter(Boolean));
  const ordered = [...chapters].sort((a, b) => Number(active.has(b.id)) - Number(active.has(a.id)));

  return (
    <View style={styles.wrap}>
      <Text style={[type.meta, { color: colors.ink2, marginBottom: 10, marginLeft: space.gutter }]}>Your home rail</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rail}>
        {ordered.map((c) => {
          const on = active.has(c.id);
          return (
            <Animated.View
              key={c.id}
              layout={LinearTransition.springify().damping(20).stiffness(180)}
              style={[styles.pill, { backgroundColor: on ? colors.button : 'transparent', borderColor: on ? colors.button : colors.hair }]}
            >
              <Text style={[styles.name, { color: on ? colors.buttonInk : colors.ink }]}>{c.name}</Text>
              <Text style={[styles.count, { color: on ? colors.buttonInk : colors.ink3, opacity: on ? 0.7 : 1 }]}>{c.count}</Text>
            </Animated.View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 32, marginHorizontal: -space.gutter },
  rail: { paddingHorizontal: space.gutter, gap: 8 },
  pill: { height: 40, paddingHorizontal: 16, borderRadius: space.pill, borderWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { fontFamily: fonts.medium, fontSize: 15, letterSpacing: -0.4 },
  count: { fontFamily: fonts.regular, fontSize: 13, letterSpacing: -0.1 },
});
