import { Belleza_400Regular } from '@expo-google-fonts/belleza';
import { Montserrat_400Regular, Montserrat_500Medium, Montserrat_600SemiBold } from '@expo-google-fonts/montserrat';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PrefsProvider, usePrefs } from '@/store/prefs';
import { useTheme } from '@/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <PrefsProvider>
      <RootNavigator />
    </PrefsProvider>
  );
}

function RootNavigator() {
  const { colors, isDark } = useTheme();
  const { prefs, ready } = usePrefs();
  const [loaded, error] = useFonts({
    Belleza_400Regular,
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
  });

  const fontsReady = loaded || !!error;

  useEffect(() => {
    if (fontsReady && ready) SplashScreen.hideAsync();
  }, [fontsReady, ready]);

  if (!fontsReady || !ready) return null;

  return (
    <SafeAreaProvider>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.paper },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Protected guard={!prefs.onboarded}>
          <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />
        </Stack.Protected>
        <Stack.Protected guard={prefs.onboarded}>
          <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
          <Stack.Screen name="answer/[id]" />
          <Stack.Screen name="settings" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
          <Stack.Screen name="search" options={{ animation: 'fade' }} />
        </Stack.Protected>
      </Stack>
    </SafeAreaProvider>
  );
}
