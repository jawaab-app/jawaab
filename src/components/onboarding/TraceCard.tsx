import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, LinearTransition } from 'react-native-reanimated';
import { TRACE_ANSWER } from '@/data/onboardingDemo';
import { fonts, space, type, useTheme } from '@/theme';

interface Props {
  open: boolean;
  onToggle: () => void;
}

// One answer. Tap the byline and its provenance unfolds.
export function TraceCard({ open, onToggle }: Props) {
  const { colors } = useTheme();
  const a = TRACE_ANSWER;

  const rows = [
    { label: 'Publisher', value: a.publisher },
    { label: 'Scholar', value: a.scholar },
    { label: 'School', value: a.school },
    { label: 'Published', value: a.published },
    { label: 'Source', value: `${a.source} ↗` },
  ];

  return (
    <Animated.View layout={LinearTransition.springify().damping(18)} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.hair }]}>
      <Text style={[type.question, { color: colors.ink }]}>{a.question}</Text>
      <Text style={[type.body, { color: colors.ink, marginTop: 10 }]}>{a.answer}</Text>

      <Pressable
        onPress={() => {
          Haptics.selectionAsync();
          onToggle();
        }}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        style={({ pressed }) => [styles.byline, { borderTopColor: colors.hair, opacity: pressed ? 0.5 : 1 }]}
      >
        <Text style={[type.meta, { color: colors.ink2, flex: 1 }]} numberOfLines={1}>
          {a.publisher} · {a.school} · {a.published.slice(-4)}
        </Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={16} color={colors.ink2} />
      </Pressable>

      {open && (
        <Animated.View entering={FadeIn.duration(220)} style={{ marginTop: 4 }}>
          {rows.map((r, i) => (
            <Animated.View key={r.label} entering={FadeInDown.duration(260).delay(i * 40)} style={[styles.row, { borderBottomColor: i === rows.length - 1 ? 'transparent' : colors.hair }]}>
              <Text style={[type.meta, { color: colors.ink2 }]}>{r.label}</Text>
              <Text style={[styles.value, { color: colors.ink }]}>{r.value}</Text>
            </Animated.View>
          ))}
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: space.radiusLg, borderWidth: 1, padding: 18, overflow: 'hidden' },
  byline: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 16, paddingTop: 14, borderTopWidth: StyleSheet.hairlineWidth },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth },
  value: { fontFamily: fonts.medium, fontSize: 15, letterSpacing: -0.3 },
});
