import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './lib/auth';

// Add paths that require authentication
const protectedPaths = ['/strategies', '/news', '/events', '/community'];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Check if the path requires authentication
  if (protectedPaths.some(protectedPath => path.startsWith(protectedPath))) {
    const token = request.cookies.get('token')?.value;

    if (!token) {
      // Instead of redirecting, let the client handle showing the auth modal
      return NextResponse.next();
    }

    // Verify token
    const payload = await verifyToken(token);
    if (!payload) {
      // Instead of redirecting, let the client handle showing the auth modal
      return NextResponse.next();
    }
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