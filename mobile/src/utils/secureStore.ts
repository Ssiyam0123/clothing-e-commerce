import * as ExpoSecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export const getItemAsync = async (key: string): Promise<string | null> => {
  if (Platform.OS === 'web') {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }
  try {
    if (typeof ExpoSecureStore.getItemAsync === 'function') {
      return await ExpoSecureStore.getItemAsync(key);
    }
    return localStorage.getItem(key);
  } catch (err) {
    console.warn('SecureStore.getItemAsync error, falling back:', err);
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }
};

export const setItemAsync = async (key: string, value: string): Promise<void> => {
  if (Platform.OS === 'web') {
    try {
      localStorage.setItem(key, value);
    } catch {}
    return;
  }
  try {
    if (typeof ExpoSecureStore.setItemAsync === 'function') {
      await ExpoSecureStore.setItemAsync(key, value);
    } else {
      localStorage.setItem(key, value);
    }
  } catch (err) {
    console.warn('SecureStore.setItemAsync error, falling back:', err);
    try {
      localStorage.setItem(key, value);
    } catch {}
  }
};

export const deleteItemAsync = async (key: string): Promise<void> => {
  if (Platform.OS === 'web') {
    try {
      localStorage.removeItem(key);
    } catch {}
    return;
  }
  try {
    if (typeof ExpoSecureStore.deleteItemAsync === 'function') {
      await ExpoSecureStore.deleteItemAsync(key);
    } else {
      localStorage.removeItem(key);
    }
  } catch (err) {
    console.warn('SecureStore.deleteItemAsync error, falling back:', err);
    try {
      localStorage.removeItem(key);
    } catch {}
  }
};
