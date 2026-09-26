import { Linking, StyleSheet, Text, View } from 'react-native';
import { parseJmu, type Inline } from '@/api/jmu';
import { fonts, type, useTheme } from '@/theme';

const ARABIC = /[؀-ۿ]/;

// Renders an answer body compiled to JMU by the backend.
export function JmuView({ jmu }: { jmu: string }) {
  const { colors } = useTheme();
  const blocks = parseJmu(jmu);

  const inline = (nodes: Inline[], keyPrefix = ''): React.ReactNode[] =>
    nodes.map((n, i) => {
      const key = `${keyPrefix}${i}`;
      switch (n.kind) {
        case 'text':
          return n.text;
        case 'bold':
          return (
            <Text key={key} style={{ fontFamily: fonts.semibold }}>
              {inline(n.children, `${key}.`)}
            </Text>
          );
        case 'italic':
          return (
            <Text key={key} style={{ fontStyle: 'italic' }}>
              {inline(n.children, `${key}.`)}
            </Text>
          );
        case 'link':
          return (
            <Text key={key} style={{ textDecorationLine: 'underline' }} onPress={() => Linking.openURL(n.url).catch(() => {})}>
              {n.text}
            </Text>
          );
      }
    });

  return (
    <View>
      {blocks.map((b, i) => {
        switch (b.kind) {
          case 'heading':
            return (
              <Text key={i} style={[b.level === 2 ? type.title : type.question, { color: colors.ink, marginTop: 28 }]}>
                {inline(b.inlines)}
              </Text>
            );
          case 'quote':
            return (
              <View key={i} style={[styles.quote, { borderLeftColor: colors.ink }]}>
                <Text style={[type.body, { color: colors.ink }, isArabic(b.inlines) && styles.arabic]}>{inline(b.inlines)}</Text>
              </View>
            );
          case 'listItem':
            return (
              <View key={i} style={styles.item}>
                <Text style={[type.body, styles.marker, { color: colors.ink2 }]}>{b.marker}</Text>
                <Text style={[type.body, { color: colors.ink, flex: 1 }]}>{inline(b.inlines)}</Text>
              </View>
            );
          case 'paragraph':
            return (
              <Text key={i} style={[type.body, { color: colors.ink, marginTop: 14 }, isArabic(b.inlines) && styles.arabic]}>
                {inline(b.inlines)}
              </Text>
            );
        }
      })}
    </View>
  );
}

function isArabic(nodes: Inline[]): boolean {
  const first = nodes.find((n) => n.kind === 'text');
  return !!first && first.kind === 'text' && ARABIC.test(first.text.trim().charAt(0));
}

const styles = StyleSheet.create({
  quote: { marginTop: 18, paddingLeft: 16, borderLeftWidth: 1.5 },
  item: { flexDirection: 'row', gap: 10, marginTop: 8 },
  marker: { minWidth: 18 },
  arabic: { fontSize: 20, lineHeight: 36, textAlign: 'right', writingDirection: 'rtl' },
});
