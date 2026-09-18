import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View, type ImageSourcePropType } from 'react-native';
import { fonts, space } from '@/theme';

interface Props {
  source: ImageSourcePropType;
  title: string;
  subtitle?: string;
}

// The one picture on the home screen: a rounded cover with the greeting set
// in white at its foot. Swap `source` by time of day once the covers exist.
export function CoverCard({ source, title, subtitle }: Props) {
  return (
    <View style={styles.card}>
      <Image source={source} style={StyleSheet.absoluteFill} contentFit="cover" contentPosition="center" transition={300} />
      <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.55)']} locations={[0.35, 1]} style={StyleSheet.absoluteFill} />
      <View style={styles.text}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { height: 250, borderRadius: space.radiusLg + 4, overflow: 'hidden', backgroundColor: '#111', justifyContent: 'flex-end' },
  text: { padding: 20, paddingBottom: 18 },
  title: { fontFamily: fonts.semibold, fontSize: 36, lineHeight: 40, letterSpacing: -1.6, color: '#FFFFFF' },
  subtitle: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 19, letterSpacing: -0.2, color: 'rgba(255,255,255,0.85)', marginTop: 4 },
});
