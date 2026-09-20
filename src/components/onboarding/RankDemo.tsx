import { StyleSheet, Text, View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { SCHOOL_DEMO } from '@/data/onboardingDemo';
import type { SchoolKey } from '@/store/prefs';
import { fonts, type, useTheme } from '@/theme';

// Four sample answers. The chosen school's answer rises to the top.
export function RankDemo({ school }: { school: SchoolKey | null }) {
  const { colors } = useTheme();
  const sorted = [...SCHOOL_DEMO].sort((a, b) => (a.school === school ? -1 : b.school === school ? 1 : 0));

  return (
    <View style={styles.wrap}>
      <Text style={[type.meta, { color: colors.ink2, marginBottom: 6 }]}>How results will rank</Text>
      {sorted.map((a, i) => {
        const first = i === 0 && a.school === school;
        return (
          <Animated.View
            key={a.school}
            layout={LinearTransition.springify().damping(20).stiffness(180)}
            style={[styles.row, { borderBottomColor: i === sorted.length - 1 ? 'transparent' : colors.hair, opacity: school && !first ? 0.55 : 1 }]}
          >
            <Text style={[styles.index, { color: first ? colors.ink : colors.ink3 }]}>{i + 1}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[type.question, { color: colors.ink, fontFamily: first ? fonts.semibold : fonts.medium }]} numberOfLines={1}>
                {a.question}
              </Text>
              <Text style={[type.meta, { color: colors.ink2, marginTop: 2 }]}>
                {a.publisher} · {a.schoolName}
              </Text>
            </View>
          </Animated.View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginTop: 28 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  index: { width: 16, fontFamily: fonts.regular, fontSize: 13 },
});
