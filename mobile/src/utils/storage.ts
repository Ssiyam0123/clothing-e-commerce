import AsyncStorage from '@react-native-async-storage/async-storage';

const memoryStore = new Map<string, string>();
let isNativeStorageAvailable = true;

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
    if (!isNativeStorageAvailable) {
      return memoryStore.get(key) || null;
    }
    try {
      return await AsyncStorage.getItem(key);
    } catch (e: any) {
      if (
        e?.message?.includes('Native module is null') ||
        e?.message?.includes('cannot access legacy storage')
      ) {
        isNativeStorageAvailable = false;
        return memoryStore.get(key) || null;
      }
      throw e;
    }
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (!isNativeStorageAvailable) {
      memoryStore.set(key, value);
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
        memoryStore.set(key, value);
        return;
      }
      throw e;
    }
  },
  removeItem: async (key: string): Promise<void> => {
    if (!isNativeStorageAvailable) {
      memoryStore.delete(key);
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
        memoryStore.delete(key);
        return;
      }
      throw e;
    }
  },
  clear: async (): Promise<void> => {
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
