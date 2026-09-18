import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Logo } from '@/components';
import { usePrefs } from '@/store/prefs';
import { fonts, space } from '@/theme';

// Full-bleed meadow, dark type on the pale sky, two pills on a white fade.
export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { update } = usePrefs();

  return (
    <View style={styles.root}>
      <Image source={require('../../assets/images/welcome.jpg')} style={StyleSheet.absoluteFill} contentFit="cover" contentPosition="bottom" />
      {/* Light scrim at the top for the headline, white fade at the foot for the pills. */}
      <LinearGradient colors={['rgba(255,255,255,0.55)', 'rgba(255,255,255,0)']} locations={[0, 0.5]} style={StyleSheet.absoluteFill} />
      <LinearGradient colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.85)', '#FFFFFF']} locations={[0.55, 0.8, 1]} style={StyleSheet.absoluteFill} />

      <View style={[styles.top, { paddingTop: insets.top + 12 }]}>
        <Logo size={34} color="#0A0A0A" />
      </View>

      <View style={styles.centre}>
        <Text style={styles.headline}>Know who{'\n'}answered.</Text>
        <Text style={styles.sub}>Search fatwas, each traced to its scholar, its school and its source.</Text>
      </View>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) + 10 }]}>
        <Button label="Get started" onPress={() => router.push('/onboarding/school')} />
        <View style={{ height: 10 }} />
        <Button label="Set up later" variant="secondary" onPress={() => update({ onboarded: true })} />
        <Text style={styles.legal}>Answers are reproduced under licence and never edited.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFFFFF' },
  top: { paddingHorizontal: space.gutter },
  centre: { flex: 1, alignItems: 'center', justifyContent: 'flex-start', paddingTop: 64, paddingHorizontal: space.gutter + 8 },
  headline: { fontFamily: fonts.medium, fontSize: 48, lineHeight: 52, letterSpacing: -1.6, color: '#0A0A0A', textAlign: 'center' },
  sub: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 22, letterSpacing: -0.3, color: '#2C2C30', textAlign: 'center', marginTop: 14, maxWidth: 300 },
  footer: { paddingHorizontal: space.gutter },
  legal: { fontFamily: fonts.regular, fontSize: 11, letterSpacing: -0.1, color: '#6F6F73', textAlign: 'center', marginTop: 16 },
});
