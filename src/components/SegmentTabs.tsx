import { Pressable, StyleSheet, Text, View } from 'react-native';
import { fonts, space, useTheme } from '@/theme';

export interface Segment {
  key: string;
  label: string;
}

interface Props {
  segments: Segment[];
  active: string;
  onChange: (key: string) => void;
}

// Small pills: selected is ink-filled, others hairline.
export function SegmentTabs({ segments, active, onChange }: Props) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      {segments.map((s) => {
        const on = s.key === active;
        return (
          <Pressable
            key={s.key}
            onPress={() => onChange(s.key)}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            style={[styles.pill, { backgroundColor: on ? colors.button : 'transparent', borderColor: on ? colors.button : colors.hair }]}
          >
            <Text style={[styles.label, { color: on ? colors.buttonInk : colors.ink }]}>{s.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
  pill: { height: 34, paddingHorizontal: 16, borderRadius: space.pill, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  label: { fontFamily: fonts.medium, fontSize: 14, letterSpacing: -0.3 },
});
