import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getSiteUrl } from '@/lib/site'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  // if "next" is in param, use it as the redirect URL
  // this is used for password reset or dynamic redirects
  const next = searchParams.get('next') ?? '/'

  let baseUrl = getSiteUrl()?.toString() || origin;
  if (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      const isExternalNext = next.startsWith('http');
      
      if (isExternalNext && next.startsWith(baseUrl)) {
        return NextResponse.redirect(next)
      } else if (!isExternalNext && next.startsWith('/')) {
        return NextResponse.redirect(`${baseUrl}${next}`)
      }
      return NextResponse.redirect(`${baseUrl}/dashboard`)
    }
  }

  // Redirect to login if token exchange fails (e.g. invalid or expired link)
  return NextResponse.redirect(`${baseUrl}/login?state=login-error&messageType=error`)
}
