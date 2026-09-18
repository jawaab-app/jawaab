import { Pressable, StyleSheet, Text, View } from 'react-native';
import { fonts, useTheme } from '@/theme';

interface Props {
  title: string;
  action?: string;
  onAction?: () => void;
}

export function SectionHeader({ title, action, onAction }: Props) {
  const { colors } = useTheme();
  return (
    <View style={styles.row}>
      <Text style={[styles.title, { color: colors.ink2 }]}>{title}</Text>
      {action && (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={[styles.action, { color: colors.ink }]}>{action}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between' },
  title: { fontFamily: fonts.medium, fontSize: 13, letterSpacing: -0.1 },
  action: { fontFamily: fonts.medium, fontSize: 13, letterSpacing: -0.1 },
});
