import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  // Response dasar yang akan diteruskan
  const res = NextResponse.next()

  // Client Supabase berbasis request + response (untuk refresh cookie, dll.)
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  const path = req.nextUrl.pathname

  console.log('[MIDDLEWARE]', { path, hasSession: !!session, error })

  // 🔓 IZINKAN LOGOUT
  // Route /logout akan meng-handle signOut di server (route.ts sendiri)
  if (path === '/logout') {
    return NextResponse.next()
  }

  // 🔓 IZINKAN AUTH CALLBACK (supaya proses login bisa selesai)
  if (path.startsWith('/auth')) {
    return res
  }

  // 🔐 PROTEKSI HALAMAN ADMIN
  // Semua URL yang diawali /admin butuh session aktif
  if (path.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  // 🔄 JIKA SUDAH LOGIN, JANGAN BOLEHKAN BUKA /login LAGI
  if (path === '/login' && session) {
    return NextResponse.redirect(new URL('/admin', req.url))
  }

  // Default: teruskan request
  return res
}

// Middleware hanya aktif di route-route ini
export const config = {
  matcher: ['/admin/:path*', '/login', '/auth/:path*', '/logout'],
}
