import { cache } from 'react';

/**
 * 📂 Category Server Utility
 * Handles server-side fetching for the category hub.
 */
export const getCategories = cache(async () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  try {
    const res = await fetch(`${apiUrl}/categories`, { 
      next: { 
        revalidate: 3600, // Cache for 1 hour
        tags: ['categories']
      }, 
      signal: AbortSignal.timeout(3000),
    });
    
    if (!res.ok) {
      console.warn('⚠️ Category fetch failed');
      return [];
    }
    
    return res.json();
  } catch (error) {
    console.error('🚨 Category Sync Error:', error.message);
    return [];
  }
});
