import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { getSupabaseRuntimeEnv } from '@/lib/supabase/config'
import type { Database } from '@/types/supabase'

export async function createClient() {
  const env = getSupabaseRuntimeEnv()
  if (!env) {
    throw new Error('Supabase environment variables are not configured.')
  }

  const cookieStore = await cookies()

  return createServerClient<Database>(
    env.url,
    env.anonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Components may reject cookie writes, so the proxy layer is
            // responsible for refreshing the session on those requests instead.
          }
        },
      },
    }
  )
}
