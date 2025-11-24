import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { EmailOtpType } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const url = new URL(request.url)

  const code = url.searchParams.get('code')
  const token_hash = url.searchParams.get('token_hash')
  const type = (url.searchParams.get('type') as EmailOtpType) ?? 'magiclink'
  const next = url.searchParams.get('next') || '/admin'

  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  try {
    console.log('[AUTH CALLBACK] hit', {
      hasCode: !!code,
      hasTokenHash: !!token_hash,
      next,
    })

    // 1) Tukar "code" / "token_hash" menjadi session Supabase
    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (error) {
        console.error('[AUTH CALLBACK] exchangeCodeForSession error:', error)
        throw error
      }
    } else if (token_hash) {
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
    } = await supabase.auth.getUser()

    if (user) {
      // 3) Catat login ke tabel login_events (opsional analytics)
      const ip =
        request.headers.get('x-forwarded-for') ??
        request.headers.get('x-real-ip') ??
        null

      const userAgent = request.headers.get('user-agent') ?? null

      await supabase.from('login_events').insert({
        user_id: user.id,
        email: user.email,
        ip_address: ip,
        user_agent: userAgent,
        // login_at pakai default now() di database
      })
    }
  } catch (error) {
    console.error('[AUTH CALLBACK] unexpected error:', error)
    return NextResponse.redirect(`${url.origin}/login?error=AuthCallbackFailed`)
  }

  // 4) Redirect ke halaman tujuan (default: /admin)
  const safeNext = next.startsWith('/') ? next : '/admin'
  return NextResponse.redirect(`${url.origin}${safeNext}`)
}
