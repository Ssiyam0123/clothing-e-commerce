/**
 * 🛠️ Site Settings Server Utility
 * Handles server-side fetching for dynamic metadata and SEO.
 */

export async function getSettings() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  try {
    const res = await fetch(`${apiUrl}/settings`, { 
      next: { 
        revalidate: 60,
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
}
