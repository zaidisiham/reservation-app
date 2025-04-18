import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
<Stack>
  <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
  <Stack.Screen name="index" options={{ headerShown: false }} />
  <Stack.Screen name="register" options={{ headerShown: false }} /> 
  <Stack.Screen name="login" options={{ headerShown: false }} />
  <Stack.Screen name="home" options={{ title: "Accueil", headerShown: true }} />
  <Stack.Screen name="equipements_reservation" options={{ title: "Accueil", headerShown: true }} />
  <Stack.Screen name="reserver/[id]" options={{ title: "Équipements", headerShown: true }} />
  <Stack.Screen name="reservations" options={{ title: "Accueil", headerShown: true }} />
  <Stack.Screen name="profile" options={{ title: "Profil", headerShown: true }} />
  <Stack.Screen name="salles" options={{ title: "Salles", headerShown: true }} />
  <Stack.Screen name="reservsalle/[id]" options={{ title: "Salles", headerShown: true }} />
  <Stack.Screen name="+not-found" />
</Stack>


      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
