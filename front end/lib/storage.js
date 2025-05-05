/**
 * Storage utility to handle AsyncStorage compatibility issues
 */

// Try to import from the dedicated package first
let AsyncStorage;
try {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch (error) {
  // Fallback to React Native's AsyncStorage
  try {
    const ReactNative = require('react-native');
    AsyncStorage = ReactNative.AsyncStorage;
  } catch (fallbackError) {
    console.error('Failed to load AsyncStorage:', fallbackError);
    // Create a mock implementation if both fail
    AsyncStorage = {
      getItem: async (key) => {
        console.warn('Using mock AsyncStorage.getItem for key:', key);
        return null;
      },
      setItem: async (key, value) => {
        console.warn('Using mock AsyncStorage.setItem for key:', key);
        return null;
      },
      removeItem: async (key) => {
        console.warn('Using mock AsyncStorage.removeItem for key:', key);
        return null;
      },
      clear: async () => {
        console.warn('Using mock AsyncStorage.clear');
        return null;
      },
    };
  }
}

export default AsyncStorage;
