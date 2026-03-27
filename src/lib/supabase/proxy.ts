import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import {
  getAuthUnavailableLoginPath,
  getLoginPath,
  getSupabaseRuntimeEnv,
} from '@/lib/supabase/config'
import { requiresAuthSessionProxy } from "@/lib/supabase/proxyRoutes";
import type { Database } from '@/types/supabase'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })
  const { pathname } = request.nextUrl
  const requiresAuthSession = requiresAuthSessionProxy(pathname)

  if (!requiresAuthSession) {
    return supabaseResponse
  }

  const env = getSupabaseRuntimeEnv()

  // Public pages should stay reachable even if auth is not configured, while
  // private routes still redirect to a login page that explains the issue.
  if (!env) {
    return NextResponse.redirect(new URL(getAuthUnavailableLoginPath(pathname), request.url))
  }

  const supabase = createServerClient<Database>(
    env.url,
    env.anonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // getUser() refreshes the auth session before route gating, so redirects are
  // based on the current cookie state rather than stale middleware data.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.redirect(new URL(getLoginPath(pathname), request.url))
  }

  return supabaseResponse
}
