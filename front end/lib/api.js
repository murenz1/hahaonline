import axios from 'axios';
import AsyncStorage from './storage';

const API_BASE_URL = 'http://10.110.24.5:3001';

// Add detailed logging
console.log('API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
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
