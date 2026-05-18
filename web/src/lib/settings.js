import { cache } from 'react';
import api from './api';

/**
 * 🛠️ Site Settings Server Utility
 * Handles server-side fetching for dynamic metadata and SEO.
 * Optimized with Request Memoization and Edge Caching.
 */
export const getSettings = cache(async () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  try {
    const res = await fetch(`${apiUrl}/settings`, { 
      next: { 
        revalidate: 3600, // Cache for 1 hour, bust with revalidateTag('settings')
        tags: ['settings']
      }, 
    });
    
    if (!res.ok) {
      console.warn('⚠️ Settings fetch failed, using fallbacks');
      return null;
    }
    
    return res.json();
  } catch (error) {
    console.error('🚨 Site Settings Sync Error:', error.message);
    return null;
  }
});

// ==========================================
// ⚙️ Central Client settings & layout Operations (Delegated)
// ==========================================

export * from '@/app/admin/settings/lib/settings';
