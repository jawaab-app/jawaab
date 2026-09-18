import { InterTight_400Regular, InterTight_500Medium, InterTight_600SemiBold, InterTight_700Bold } from '@expo-google-fonts/inter-tight';
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
    InterTight_400Regular,
    InterTight_500Medium,
    InterTight_600SemiBold,
    InterTight_700Bold,
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
          <Stack.Screen
            name="settings"
            options={{
              presentation: 'formSheet',
              sheetAllowedDetents: [0.62, 1],
              sheetInitialDetentIndex: 0,
              sheetGrabberVisible: true,
              sheetCornerRadius: 28,
              contentStyle: { backgroundColor: colors.paper },
            }}
          />
          <Stack.Screen name="search" options={{ animation: 'fade' }} />
        </Stack.Protected>
      </Stack>
    </SafeAreaProvider>
  );
}
