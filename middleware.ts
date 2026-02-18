import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

async function verifyJWT(token: string): Promise<boolean> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Allow logout route
  if (path === '/logout') {
    return NextResponse.next();
  }

  // Protect admin routes
  if (path.startsWith('/admin')) {
    const token = req.cookies.get('admin_token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    const isValid = await verifyJWT(token);
    if (!isValid) {
      // Clear invalid token and redirect
      const response = NextResponse.redirect(new URL('/login', req.url));
      response.cookies.delete('admin_token');
      return response;
    }
  }

  // If already logged in, redirect /login to /admin
  if (path === '/login') {
    const token = req.cookies.get('admin_token')?.value;
    if (token) {
      const isValid = await verifyJWT(token);
      if (isValid) {
        return NextResponse.redirect(new URL('/admin', req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login', '/logout'],
};
