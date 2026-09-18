import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HistoryRow, IconButton, Logo, SearchField } from '@/components';
import { SCHOOLS } from '@/data/onboarding';
import { history, trending } from '@/data/sample';
import { usePrefs } from '@/store/prefs';
import { fonts, space, type, useTheme } from '@/theme';

type Segment = 'recent' | 'trending';

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return 'Good night.';
  if (h < 12) return 'Good morning.';
  if (h < 17) return 'Good afternoon.';
  if (h < 21) return 'Good evening.';
  return 'Good night.';
}

const COMPOSER_SPACE = 150;

export default function HomeScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { prefs } = usePrefs();
  const [segment, setSegment] = useState<Segment>('recent');
  const rows = segment === 'trending' ? trending : history;
  const school = SCHOOLS.find((s) => s.key === prefs.school);
  const chip = school && school.key !== 'unsure' ? school.name : 'All schools';

  return (
    <View style={[styles.root, { backgroundColor: colors.paper }]}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: COMPOSER_SPACE }} showsVerticalScrollIndicator={false}>
        <View style={[styles.pad, styles.nav]}>
          <Logo size={30} />
          <IconButton name="options-outline" label="Settings" onPress={() => router.push('/settings')} />
        </View>

        <View style={styles.hero}>
          <Text style={[type.largeTitle, { color: colors.ink, textAlign: 'center' }]}>{greeting()}</Text>
          <Text style={[type.body, { color: colors.ink2, textAlign: 'center', marginTop: 6 }]}>What are you looking for?</Text>
        </View>

        <View style={styles.pad}>
          <View style={styles.toggle}>
            {(['recent', 'trending'] as Segment[]).map((k) => (
              <Pressable key={k} onPress={() => setSegment(k)} hitSlop={8}>
                <Text style={[styles.toggleText, { color: segment === k ? colors.ink : colors.ink3 }]}>{k === 'recent' ? 'Recent' : 'Trending'}</Text>
              </Pressable>
            ))}
          </View>
          {rows.map((item, i) => (
            <HistoryRow key={item.id} item={item} last={i === rows.length - 1} onPress={() => router.push(`/answer/${item.id}`)} />
          ))}
        </View>
      </ScrollView>

      <View pointerEvents="box-none" style={styles.composer}>
        <LinearGradient pointerEvents="none" colors={[`${colors.paper}00`, colors.paper]} locations={[0, 0.55]} style={styles.fade} />
        <View style={[styles.pad, { paddingBottom: 12 }]}>
          <SearchField placeholder="Ask anything…" chip={chip} onPress={() => router.push('/search')} onChip={() => router.push('/settings')} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  pad: { paddingHorizontal: space.gutter },
  nav: { height: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  hero: { paddingTop: 96, paddingBottom: 72, paddingHorizontal: space.gutter, alignItems: 'center' },
  toggle: { flexDirection: 'row', gap: 18, paddingBottom: 4 },
  toggleText: { fontFamily: fonts.medium, fontSize: 15, letterSpacing: -0.3 },
  composer: { position: 'absolute', left: 0, right: 0, bottom: 0 },
  fade: { position: 'absolute', left: 0, right: 0, top: -50, bottom: 0 },
});
