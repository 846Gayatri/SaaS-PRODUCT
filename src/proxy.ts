import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('session_token')?.value;
  const { pathname } = request.nextUrl;

  // Protect dashboard, billing, and history pages
  const isProtectedRoute = 
    pathname.startsWith('/dashboard') || 
    pathname.startsWith('/billing') || 
    pathname.startsWith('/history');

  const isAuthRoute = 
    pathname.startsWith('/login') || 
    pathname.startsWith('/signup');

  if (isProtectedRoute && !token) {
    // Redirect to login page if trying to access protected route without token
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && token) {
    // Redirect to dashboard if logged-in user tries to visit login/signup
    const url = request.nextUrl.clone();
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/billing/:path*',
    '/history/:path*',
    '/login',
    '/signup',
  ],
};
