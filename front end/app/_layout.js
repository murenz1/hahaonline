import React from 'react';
import { Slot } from 'expo-router';
import { View, Text } from 'react-native';
import { useFonts } from 'expo-font';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    ...Ionicons.font,
    ...MaterialIcons.font,
    ...FontAwesome.font,
  });

  // Wait for fonts to load
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return <Slot />;
}