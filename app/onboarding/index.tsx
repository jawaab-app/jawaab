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
      <LinearGradient colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.85)', '#FFFFFF']} locations={[0.55, 0.8, 1]} style={StyleSheet.absoluteFill} />

      <View style={[styles.top, { paddingTop: insets.top + 12 }]}>
        <Logo size={34} color="#0A0A0A" />
      </View>

      <View style={styles.centre}>
        <Text style={styles.headline}>Every answer,{'\n'}with its author.</Text>
        <Text style={styles.sub}>A search engine for Islamic answers. Publisher, scholar, school and date on every one.</Text>
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
  centre: { flex: 1, alignItems: 'center', justifyContent: 'flex-start', paddingTop: 72, paddingHorizontal: space.gutter + 8 },
  headline: { fontFamily: fonts.semibold, fontSize: 46, lineHeight: 48, letterSpacing: -2.2, color: '#0A0A0A', textAlign: 'center' },
  sub: { fontFamily: fonts.regular, fontSize: 15, lineHeight: 20, letterSpacing: -0.2, color: '#3A3A3F', textAlign: 'center', marginTop: 16, maxWidth: 300 },
  footer: { paddingHorizontal: space.gutter },
  legal: { fontFamily: fonts.regular, fontSize: 11, letterSpacing: -0.1, color: '#6F6F73', textAlign: 'center', marginTop: 16 },
});
