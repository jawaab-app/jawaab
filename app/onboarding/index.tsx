import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Logo } from '@/components';
import { usePrefs } from '@/store/prefs';
import { fonts, space } from '@/theme';

// Full-bleed painting, white type, two pills. The only image in the app.
export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { update } = usePrefs();

  return (
    <View style={styles.root}>
      <Image source={require('../../assets/images/ferraris-greeting.jpg')} style={StyleSheet.absoluteFill} contentFit="cover" contentPosition="center" />
      <LinearGradient colors={['rgba(0,0,0,0.35)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0.55)']} locations={[0, 0.45, 1]} style={StyleSheet.absoluteFill} />

      <View style={[styles.top, { paddingTop: insets.top + 12 }]}>
        <Logo size={34} color="#FFFFFF" />
      </View>

      <View style={styles.centre}>
        <Text style={styles.headline}>Every answer,{'\n'}with its author.</Text>
        <Text style={styles.sub}>A search engine for Islamic answers. Publisher, scholar, school and date on every one.</Text>
      </View>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) + 10 }]}>
        <Button label="Get started" variant="onImage" onPress={() => router.push('/onboarding/school')} />
        <View style={{ height: 10 }} />
        <Button label="Set up later" onPress={() => update({ onboarded: true })} />
        <Text style={styles.legal}>Answers are reproduced under licence and never edited.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000' },
  top: { paddingHorizontal: space.gutter },
  centre: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: space.gutter + 8 },
  headline: { fontFamily: fonts.semibold, fontSize: 46, lineHeight: 48, letterSpacing: -2.2, color: '#FFFFFF', textAlign: 'center' },
  sub: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 19, letterSpacing: -0.2, color: 'rgba(255,255,255,0.85)', textAlign: 'center', marginTop: 16, maxWidth: 280 },
  footer: { paddingHorizontal: space.gutter },
  legal: { fontFamily: fonts.regular, fontSize: 11, letterSpacing: -0.1, color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginTop: 16 },
});
