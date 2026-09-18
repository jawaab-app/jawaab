import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { fonts, space, type, useTheme } from '@/theme';

const ROWS: { label: string; value: string }[] = [
  { label: 'School', value: 'Mālikī' },
  { label: 'Language', value: 'English' },
  { label: 'Text size', value: 'Default' },
  { label: 'Appearance', value: 'System' },
];

export default function SettingsScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  return (
    <ScrollView style={{ backgroundColor: colors.paper }} contentContainerStyle={{ paddingTop: insets.top + 14, paddingHorizontal: space.gutter }}>
      <View style={styles.head}>
        <Text style={[type.h1, { color: colors.ink }]}>Settings</Text>
        <Pressable onPress={() => router.back()} hitSlop={12} accessibilityLabel="Close">
          <Ionicons name="close" size={26} color={colors.ink} />
        </Pressable>
      </View>
      {ROWS.map((r) => (
        <View key={r.label} style={[styles.row, { borderBottomColor: colors.hair }]}>
          <Text style={[styles.label, { color: colors.ink }]}>{r.label}</Text>
          <Text style={[type.meta, { color: colors.ink2 }]}>{r.value}</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.ink3} />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 16, borderBottomWidth: StyleSheet.hairlineWidth },
  label: { flex: 1, fontFamily: fonts.medium, fontSize: 16 },
});
