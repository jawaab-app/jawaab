import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Logo } from '@/components';
import { PrimaryButton } from '@/components/onboarding';
import { usePrefs } from '@/store/prefs';
import { fonts, space, useTheme } from '@/theme';

export default function WelcomeScreen() {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { update } = usePrefs();

  return (
    <View style={[styles.root, { backgroundColor: colors.paper }]}>
      <View style={styles.hero}>
        <Image source={require('../../assets/images/bg.webp')} style={StyleSheet.absoluteFill} contentFit="cover" contentPosition="top" />
        <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.paper, opacity: isDark ? 0.6 : 0.35 }]} />
        <LinearGradient colors={['transparent', colors.paper]} locations={[0.35, 1]} style={StyleSheet.absoluteFill} />
      </View>

      <View style={[styles.body, { paddingBottom: Math.max(insets.bottom, 16) + 8 }]}>
        <Logo size={92} />
        <Text style={[styles.title, { color: colors.ink }]}>Jawāb</Text>
        <Text style={[styles.tagline, { color: colors.ink }]}>Every answer, with its author.</Text>
        <Text style={[styles.lede, { color: colors.ink2 }]}>
          An index of answers written by scholars and publishers you can name. Each one carries its publisher, its school and its date, and the original is always one tap away.
        </Text>

        <View style={{ height: 28 }} />
        <PrimaryButton label="Get started" onPress={() => router.push('/onboarding/school')} />
        <Pressable
          onPress={() => update({ onboarded: true })}
          hitSlop={10}
          style={styles.secondary}
        >
          <Text style={[styles.secondaryText, { color: colors.ink2 }]}>Skip for now</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  hero: { height: '46%' },
  body: { flex: 1, paddingHorizontal: space.gutter, justifyContent: 'flex-end' },
  title: { fontFamily: fonts.display, fontSize: 44, marginTop: 14, letterSpacing: -0.5 },
  tagline: { fontFamily: fonts.display, fontSize: 24, marginTop: 4 },
  lede: { fontFamily: fonts.body, fontSize: 15.5, lineHeight: 24, marginTop: 14 },
  secondary: { alignSelf: 'center', paddingVertical: 16 },
  secondaryText: { fontFamily: fonts.medium, fontSize: 15 },
});
