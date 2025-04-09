import React, { useEffect, useState } from 'react';
import { Stack, SplashScreen } from 'expo-router';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [appIsReady, setAppIsReady] = useState(false);

  // Load fonts
  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
  });

  useEffect(() => {
    async function prepare() {
      try {
        // Check if user is authenticated
        const token = await AsyncStorage.getItem('userToken');
        setIsAuthenticated(!!token);
      } catch (e) {
        console.warn('Error preparing app:', e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady && fontsLoaded) {
      // Hide the splash screen once resources and authentication check are done
      SplashScreen.hideAsync();
    }
  }, [appIsReady, fontsLoaded]);

  if (!appIsReady || !fontsLoaded) {
    return null;
  }

  // The initialRouteName will determine the first screen to show
  // If user is not authenticated, show auth stack, otherwise show tabs
  return (
    <Stack 
      screenOptions={{ 
        headerShown: false,
        animation: 'fade',
      }}
      initialRouteName={isAuthenticated ? '(tabs)' : 'auth'}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="auth" />
      <Stack.Screen name="product/[id]" options={{ animation: 'slide_from_right' }} />
    </Stack>
  );
} 