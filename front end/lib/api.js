import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from './storage';

// Dynamic API URL configuration to work on both web and iOS devices
let API_BASE_URL;

// Detect platform and environment to use the appropriate API URL
// Use the same API URL for both web and mobile platforms
API_BASE_URL = 'http://10.110.24.5:3001';

// Log the API URL for debugging
console.log('Using API URL:', API_BASE_URL);

// Allow overriding the API URL through environment variables or settings
if (process.env.EXPO_PUBLIC_API_URL) {
  API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;
}

// Add detailed logging
console.log('API Base URL:', API_BASE_URL);

const api = axios.create({
  // Configure timeout and retry logic
  timeout: 15000,
  retryTimes: 3,
  retryDelay: 1000,
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // Increased timeout to 15 seconds
  // Allow absolute URLs in case we need to switch endpoints
  allowAbsoluteUrls: true
});

// Add a request interceptor to include auth token if available
api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Error getting token from AsyncStorage:', error);
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Add detailed error logging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.data);
    return response;
  },
  async (error) => {
    const errorDetails = {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: error.config,
    };
    
    console.error('API Error:', errorDetails);

    if (error.response?.status === 401) {
      try {
        // Remove the invalid token
        await AsyncStorage.removeItem('userToken');
      } catch (storageError) {
        console.error('Error removing token from AsyncStorage:', storageError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
