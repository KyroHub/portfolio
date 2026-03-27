import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/proxy'

export async function proxy(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
    "/update-password",
    "/en/dashboard/:path*",
    "/nl/dashboard/:path*",
  ],
}
