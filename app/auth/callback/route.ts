// app/auth/callback/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import type { EmailOtpType } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const url = new URL(request.url)

  // Parameter yang mungkin dikirim Supabase
  const code = url.searchParams.get('code')
  const tokenHash =
    url.searchParams.get('token_hash') ?? url.searchParams.get('token')
  const type = (url.searchParams.get('type') as EmailOtpType) ?? 'magiclink'
  const next = url.searchParams.get('next') || '/admin'

  // ⛔ JANGAN pakai cookies() manual
  // ✅ Langsung pass fungsi cookies dari next/headers
  const supabase = createRouteHandlerClient({ cookies })

  try {
    console.log('[AUTH CALLBACK] hit', {
      hasCode: !!code,
      hasTokenHash: !!tokenHash,
      type,
      next,
    })

    // 1) Flow utama: magic link dengan `code`
    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (error) {
        console.error(
          '[AUTH CALLBACK] exchangeCodeForSession error:',
          error
        )
        throw error
      }
    }
    // 2) Fallback: kalau yang dikirim token_hash / token
    else if (tokenHash) {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type,
      })
      if (error) {
        console.error('[AUTH CALLBACK] verifyOtp error:', error)
        throw error
      }
    } else {
      console.warn('[AUTH CALLBACK] tanpa code & token_hash/token')
    }

    // 3) Ambil user yang baru login
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      // 4) Catat ke login_events (analytics)
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
        // login_at pakai default now() di DB
      })
    }
  } catch (error) {
    console.error('[AUTH CALLBACK] unexpected error:', error)
    return NextResponse.redirect(`${url.origin}/login?error=AuthCallbackFailed`)
  }

  // 5) Redirect ke halaman tujuan (default /admin)
  const safeNext = next.startsWith('/') ? next : '/admin'
  return NextResponse.redirect(`${url.origin}${safeNext}`)
}
