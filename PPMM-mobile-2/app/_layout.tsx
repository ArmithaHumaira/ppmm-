import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import { useAuthStore } from '../src/store/authStore';
import { COLORS } from '../src/constants/theme';
import 'react-native-reanimated';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  const { isAuthenticated, isLoading, checkAuth } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  // Run session check once when the app mounts
  useEffect(() => {
    checkAuth();
  }, []);

  // Reactive redirect logic based on authentication state
  useEffect(() => {
    if (isLoading) return;

    const inProtectedGroup =
      segments[0] === '(tabs)' ||
      segments[0] === 'buat-laporan' ||
      segments[0] === 'detail-laporan';

    if (!isAuthenticated && inProtectedGroup) {
      // Redirect unauthenticated user to welcome screen
      router.replace('/');
    } else if (isAuthenticated && !inProtectedGroup) {
      // Redirect authenticated user to the main dashboard
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="buat-laporan" options={{ presentation: 'modal', gestureEnabled: true }} />
        <Stack.Screen name="detail-laporan/[id]" />
      </Stack>
      <StatusBar style="auto" />
    </View>
  );
}
