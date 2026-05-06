import { NextResponse } from 'next/server';

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Set current path in header for server components
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-pathname', pathname);

  // Allow admin routes and assets
  if (
    pathname.startsWith('/admin') || 
    pathname.startsWith('/api') || 
    pathname.startsWith('/_next') || 
    pathname.includes('.')
  ) {
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  
  try {
    // Fetch settings to check maintenance mode
    const res = await fetch(`${apiUrl}/settings`, { 
      next: { revalidate: 60 } // Cache for 1 minute in middleware
    });
    
    if (res.ok) {
      const settings = await res.json();
      if (settings?.config?.maintenanceMode) {
        // You could redirect to a /maintenance page if you create one
        // For now, we handle it in layout, but this middleware could block access
      }
    }
  } catch (e) {
    console.error('Middleware Settings Fetch Error:', e.message);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
