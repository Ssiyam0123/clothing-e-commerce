import { router } from 'expo-router';

/**
 * Safely navigates back if there is a history stack,
 * otherwise falls back to the main tabs home screen.
 */
export const safeBack = () => {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace('/(tabs)');
  }
};
