import { Pressable, StyleSheet, Text, View } from 'react-native';
import { fonts, useTheme } from '@/theme';

export interface Segment {
  key: string;
  label: string;
  count?: number;
}

interface Props {
  segments: Segment[];
  active: string;
  onChange: (key: string) => void;
}

export function SegmentTabs({ segments, active, onChange }: Props) {
  const { colors } = useTheme();
  return (
    <View style={[styles.row, { borderBottomColor: colors.hair }]}>
      {segments.map((s) => {
        const on = s.key === active;
        return (
          <Pressable key={s.key} onPress={() => onChange(s.key)} style={styles.tab} accessibilityRole="tab" accessibilityState={{ selected: on }}>
            <View style={styles.labelRow}>
              <Text style={[styles.label, { color: on ? colors.ink : colors.ink3 }]}>{s.label}</Text>
              {s.count != null && (
                <View style={[styles.count, { backgroundColor: colors.field }]}>
                  <Text style={[styles.countText, { color: colors.ink2 }]}>{s.count}</Text>
                </View>
              )}
            </View>
            <View style={[styles.underline, { backgroundColor: on ? colors.accent : 'transparent' }]} />
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 26, borderBottomWidth: StyleSheet.hairlineWidth },
  tab: { paddingTop: 6 },
  labelRow: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingBottom: 9 },
  label: { fontFamily: fonts.medium, fontSize: 20, letterSpacing: -0.2 },
  count: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  countText: { fontFamily: fonts.medium, fontSize: 12.5 },
  underline: { height: 2.5, borderRadius: 2 },
});
