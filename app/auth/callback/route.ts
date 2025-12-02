import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { EmailOtpType } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const searchParams = url.searchParams

  const code = searchParams.get('code')
  const token_hash = searchParams.get('token_hash')
  const type = (searchParams.get('type') as EmailOtpType) ?? 'magiclink'
  const next = searchParams.get('next') || '/admin'

  // ✨ Supabase magic link modern: kirim access_token + refresh_token
  const access_token = searchParams.get('access_token')
  const refresh_token = searchParams.get('refresh_token')

  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  try {
    console.log('[AUTH CALLBACK] hit', {
      hasAccessToken: !!access_token,
      hasCode: !!code,
      hasTokenHash: !!token_hash,
      type,
      next,
    })

    // 1) Flow baru: pakai access_token + refresh_token
    if (access_token && refresh_token) {
      const { error } = await supabase.auth.setSession({
        access_token,
        refresh_token,
      })
      if (error) {
        console.error('[AUTH CALLBACK] setSession error:', error)
        throw error
      }

    // 2) Fallback: kalau pakai kode (mis. OAuth)
    } else if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (error) {
        console.error('[AUTH CALLBACK] exchangeCodeForSession error:', error)
        throw error
      }

    // 3) Fallback: kalau pakai token_hash (flow OTP lama)
    } else if (token_hash) {
      const { error } = await supabase.auth.verifyOtp({ token_hash, type })
      if (error) {
        console.error('[AUTH CALLBACK] verifyOtp error:', error)
        throw error
      }

    // 4) Tidak ada token apapun → gagal
    } else {
      console.error('[AUTH CALLBACK] tidak ada access_token / code / token_hash')
      throw new Error('Missing auth credentials in callback URL')
    }

    // 5) Ambil user yang baru login
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      // Opsional: catat ke login_events kalau tabelnya ada
      const ip =
        request.headers.get('x-forwarded-for') ??
        request.headers.get('x-real-ip') ??
        null

      const userAgent = request.headers.get('user-agent') ?? null

      try {
        await supabase.from('login_events').insert({
          user_id: user.id,
          email: user.email,
          ip_address: ip,
          user_agent: userAgent,
        })
      } catch (err) {
        console.warn('[AUTH CALLBACK] gagal insert login_events (boleh diabaikan):', err)
      }
    }
  } catch (error) {
    console.error('[AUTH CALLBACK] unexpected error:', error)
    return NextResponse.redirect(`${url.origin}/login?error=AuthCallbackFailed`)
  }

  // 6) Redirect ke dashboard (default: /admin)
  const safeNext = next.startsWith('/') ? next : '/admin'
  return NextResponse.redirect(`${url.origin}${safeNext}`)
}
