import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public routes that don't require authentication
const publicRoutes = ['/', '/pricing', '/sign-in', '/sign-up', '/test-pocketbase'];

// Auth routes that should redirect to dashboard if already authenticated
const authRoutes = ['/sign-in', '/sign-up'];

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// Check if route is public
	const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));

	// Check if route is an auth route
	const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));

	// Get auth token from cookies (PocketBase stores it as 'pb_auth')
	const authToken = request.cookies.get('pb_auth')?.value;
	const isAuthenticated = !!authToken;

	// If accessing auth route while authenticated, redirect to dashboard
	if (isAuthRoute && isAuthenticated) {
		return NextResponse.redirect(new URL('/dashboard', request.url));
	}

	// If accessing protected route without auth, redirect to sign-in
	if (!isPublicRoute && !isAuthenticated) {
		const signInUrl = new URL('/sign-in', request.url);
		signInUrl.searchParams.set('redirect', pathname);
		return NextResponse.redirect(signInUrl);
	}

	// Check if user has selected an organization (for authenticated routes)
	if (isAuthenticated && !isPublicRoute && pathname !== '/select-organization') {
		// We can't access localStorage in middleware, so we'll handle this client-side
		// This is just a placeholder for future server-side org checking
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		// Skip Next.js internals and all static files
		'/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
		// Always run for API routes
		'/(api|trpc)(.*)',
	],
};
