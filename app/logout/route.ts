import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  console.log('🚪 [LOGOUT] /logout route HIT')

  // Ambil cookie store (sama pola dengan auth/callback)
  const cookieStore = cookies()
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore })

  // Hapus session Supabase (server-side)
  await supabase.auth.signOut()
  console.log('✅ [LOGOUT] supabase.auth.signOut() selesai')

  // Redirect ke /login dengan URL absolut
  const redirectUrl = new URL('/login', request.url)
  return NextResponse.redirect(redirectUrl)
}
