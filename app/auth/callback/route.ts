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
    // 1. SELESAIKAN LOGIN DULU
    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (error) throw error
    } else if (token_hash) {
      const { error } = await supabase.auth.verifyOtp({ token_hash, type })
      if (error) throw error
    } else {
      console.warn('Auth callback tanpa code atau token_hash')
    }

    // 2. AMBIL USER YANG BARU LOGIN
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      // 3. KUMPULKAN INFO TAMBAHAN (IP & USER AGENT)
      const ip =
        request.headers.get('x-forwarded-for') ??
        request.headers.get('x-real-ip') ??
        null

      const userAgent = request.headers.get('user-agent') ?? null

      // 4. SIMPAN KE TABEL login_events
      await supabase.from('login_events').insert({
        user_id: user.id,
        email: user.email,
        ip_address: ip,
        user_agent: userAgent,
        // login_at otomatis pakai default now()
      })
    }
  } catch (e) {
    console.error('Auth callback error:', e)
    return NextResponse.redirect(`${url.origin}/login?error=AuthCallbackFailed`)
  }

  // 5. LANJUTKAN KE DASHBOARD
  return NextResponse.redirect(`${url.origin}${next}`)
}
