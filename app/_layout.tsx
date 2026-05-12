import { Stack, type ErrorBoundaryProps } from 'expo-router';
import { useFonts, PlayfairDisplay_700Bold, PlayfairDisplay_400Regular } from '@expo-google-fonts/playfair-display';
import { Lato_400Regular, Lato_700Bold } from '@expo-google-fonts/lato';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Sentry from '@sentry/react-native';
import { colors } from '../constants/theme';

Sentry.init({
  dsn: 'https://d8840ada6b853e1195dd2aa659535f97@o266931.ingest.us.sentry.io/4511350487777280',
  sendDefaultPii: true,
  enableLogs: true,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],
});

SplashScreen.preventAutoHideAsync();

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <SafeAreaView style={errorStyles.safeArea} edges={['top', 'bottom']}>
      <View style={errorStyles.container}>
        <Text style={errorStyles.emoji}>{'💔'}</Text>
        <Text style={errorStyles.title}>Something went wrong</Text>
        <Text style={errorStyles.message}>
          We've logged the error. Try again, or head back to the home screen.
        </Text>
        <TouchableOpacity style={errorStyles.button} onPress={retry} activeOpacity={0.85}>
          <Text style={errorStyles.buttonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function RootLayout() {
  const [fontsLoaded] = useFonts({
    PlayfairDisplay_700Bold,
    PlayfairDisplay_400Regular,
    Lato_400Regular,
    Lato_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false, gestureEnabled: false }} />
    </>
  );
}

export default Sentry.wrap(RootLayout);

const errorStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  title: {
    fontFamily: 'PlayfairDisplay_700Bold',
    fontSize: 28,
    color: colors.maroon,
    textAlign: 'center',
    marginBottom: 12,
  },
  message: {
    fontFamily: 'Lato_400Regular',
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
    maxWidth: 360,
  },
  button: {
    backgroundColor: colors.maroon,
    borderRadius: 50,
    paddingVertical: 16,
    paddingHorizontal: 36,
  },
  buttonText: {
    fontFamily: 'Lato_700Bold',
    fontSize: 17,
    color: colors.white,
    letterSpacing: 0.3,
  },
});
