import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Only protect /community/create, /community/edit, /news (events removed)
  if (
    path.startsWith('/community/create') ||
    path.startsWith('/community/edit') ||
    path.startsWith('/news')
  ) {
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
    // '/strategies/:path*', // <-- removed so strategies are public
    '/news/:path*',
    '/community/create',
    '/community/edit/:path*',
  ],
}; 