import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  const path = req.nextUrl.pathname

  console.log('[MIDDLEWARE]', { path, hasSession: !!session, error })

  // 🔓 Izinkan /logout (signOut di-handle route /logout sendiri)
  if (path === '/logout') {
    return res
  }

  // 🔓 Izinkan semua /auth/* (callback, dsb)
  if (path.startsWith('/auth')) {
    return res
  }

  // 🔐 Proteksi /admin/*
  if (path.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  // 🔄 Kalau sudah login, jangan boleh buka /login
  if (path === '/login' && session) {
    return NextResponse.redirect(new URL('/admin', req.url))
  }

  return res
}

// Middleware aktif hanya di route berikut
export const config = {
  matcher: ['/admin/:path*', '/login', '/auth/:path*', '/logout'],
}
