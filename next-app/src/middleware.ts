import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add paths that require authentication
const protectedPaths = ['/strategies', '/news', '/events', '/community'];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Check if the path requires authentication
  if (protectedPaths.some(protectedPath => path.startsWith(protectedPath))) {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      // Redirect to login with redirect param if not authenticated
      const redirectUrl = new URL('/login', request.url);
      redirectUrl.searchParams.set('redirect', path);
      return NextResponse.redirect(redirectUrl);
    }
    // Optionally: verify token here
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/strategies/:path*',
    '/news/:path*',
    '/events/:path*',
    '/community/:path*',
  ],
}; 