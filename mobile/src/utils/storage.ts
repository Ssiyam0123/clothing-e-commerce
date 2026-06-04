import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import * as ExpoSecureStore from 'expo-secure-store';

const memoryStore = new Map<string, string>();
let isNativeStorageAvailable = true;
const fallbackKey = (key: string) => `fallback_${key}`;

const getSecureFallback = async (key: string) => {
  try {
    return await ExpoSecureStore.getItemAsync(fallbackKey(key));
  } catch {
    return memoryStore.get(key) || null;
  }
};

const setSecureFallback = async (key: string, value: string) => {
  memoryStore.set(key, value);
  try {
    await ExpoSecureStore.setItemAsync(fallbackKey(key), value);
  } catch {
    // Memory fallback keeps current session alive if secure fallback is unavailable.
  }
};

const removeSecureFallback = async (key: string) => {
  memoryStore.delete(key);
  try {
    await ExpoSecureStore.deleteItemAsync(fallbackKey(key));
  } catch {}
};

// Proactively test if native AsyncStorage is working
const testStorage = async () => {
  try {
    await AsyncStorage.getItem('__test_storage__');
  } catch (e: any) {
    if (
      e?.message?.includes('Native module is null') ||
      e?.message?.includes('cannot access legacy storage')
    ) {
      isNativeStorageAvailable = false;
      console.warn('[Storage] Native AsyncStorage is not available. Falling back to in-memory storage.');
    }
  }
};

testStorage();

export const safeStorage = {
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      try {
        return localStorage.getItem(key);
      } catch {
        return memoryStore.get(key) || null;
      }
    }
    if (!isNativeStorageAvailable) {
      return getSecureFallback(key);
    }
    try {
      return await AsyncStorage.getItem(key);
    } catch (e: any) {
      if (
        e?.message?.includes('Native module is null') ||
        e?.message?.includes('cannot access legacy storage')
      ) {
        isNativeStorageAvailable = false;
        return getSecureFallback(key);
      }
      throw e;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      try {
        localStorage.setItem(key, value);
      } catch {
        memoryStore.set(key, value);
      }
      return;
    }
    if (!isNativeStorageAvailable) {
      await setSecureFallback(key, value);
      return;
    }
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e: any) {
      if (
        e?.message?.includes('Native module is null') ||
        e?.message?.includes('cannot access legacy storage')
      ) {
        isNativeStorageAvailable = false;
        await setSecureFallback(key, value);
        return;
      }
      throw e;
    }
  },
  removeItem: async (key: string): Promise<void> => {
    if (Platform.OS === 'web') {
      try {
        localStorage.removeItem(key);
      } catch {
        memoryStore.delete(key);
      }
      return;
    }
    if (!isNativeStorageAvailable) {
      await removeSecureFallback(key);
      return;
    }
    try {
      await AsyncStorage.removeItem(key);
    } catch (e: any) {
      if (
        e?.message?.includes('Native module is null') ||
        e?.message?.includes('cannot access legacy storage')
      ) {
        isNativeStorageAvailable = false;
        await removeSecureFallback(key);
        return;
      }
      throw e;
    }
  },
  clear: async (): Promise<void> => {
    if (Platform.OS === 'web') {
      try {
        localStorage.clear();
      } catch {
        memoryStore.clear();
      }
      return;
    }
    if (!isNativeStorageAvailable) {
      memoryStore.clear();
      return;
    }
    try {
      await AsyncStorage.clear();
    } catch (e: any) {
      if (
        e?.message?.includes('Native module is null') ||
        e?.message?.includes('cannot access legacy storage')
      ) {
        isNativeStorageAvailable = false;
        memoryStore.clear();
        return;
      }
      throw e;
    }
  }
};
