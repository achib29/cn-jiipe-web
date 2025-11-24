import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { EmailOtpType } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const url = new URL(request.url)

  const code = url.searchParams.get('code')
  const token_hash = url.searchParams.get('token_hash')
  const next = url.searchParams.get('next') || '/admin'

  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  console.log('[AUTH CALLBACK] hit', {
    hasCode: !!code,
    hasTokenHash: !!token_hash,
    next,
  })

  try {
    // 1) Tukar "code" / "token_hash" menjadi session Supabase
    if (code) {
      // Flow baru ({{ .ConfirmationURL }}) → pakai code
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (error) {
        console.error('[AUTH CALLBACK] exchangeCodeForSession error:', error)
        throw error
      }
    } else if (token_hash) {
      // Flow lama (token_hash di URL). Paksa type = 'magiclink'
      const type: EmailOtpType = 'magiclink'
      const { error } = await supabase.auth.verifyOtp({ token_hash, type })
      if (error) {
        console.error('[AUTH CALLBACK] verifyOtp error:', error)
        throw error
      }
    } else {
      console.warn('[AUTH CALLBACK] tanpa code & token_hash')
    }

    // 2) Ambil user yang baru login
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError) {
      console.error('[AUTH CALLBACK] getUser error:', userError)
    }

    // 3) Analytics login → JANGAN sampai menggagalkan login
    if (user) {
      const ip =
        request.headers.get('x-forwarded-for') ??
        request.headers.get('x-real-ip') ??
        null

      const userAgent = request.headers.get('user-agent') ?? null

      const { error: logError } = await supabase.from('login_events').insert({
        user_id: user.id,
        email: user.email,
        ip_address: ip,
        user_agent: userAgent,
      })

      if (logError) {
        console.error('[AUTH CALLBACK] insert login_events error:', logError)
      }
    }
  } catch (error) {
    console.error('[AUTH CALLBACK] unexpected error:', error)
    const redirect = new URL('/login', url.origin)
    redirect.searchParams.set('error', 'AuthCallbackFailed')
    return NextResponse.redirect(redirect)
  }

  // 4) Redirect ke halaman tujuan (default: /admin)
  const safeNext = next.startsWith('/') ? next : '/admin'
  const redirect = new URL(safeNext, url.origin)
  return NextResponse.redirect(redirect)
}
