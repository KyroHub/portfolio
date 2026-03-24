const AUTH_UNAVAILABLE_STATE = "auth-unavailable";

function getSafeRedirectTarget(redirectTo?: string) {
  if (!redirectTo || !redirectTo.startsWith("/") || redirectTo.startsWith("//")) {
    return null;
  }

  return redirectTo;
}

export function getSupabaseRuntimeEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return { url, anonKey };
}

export function hasSupabaseRuntimeEnv() {
  return getSupabaseRuntimeEnv() !== null;
}

export function getLoginPath(redirectTo?: string) {
  const safeRedirectTarget = getSafeRedirectTarget(redirectTo);

  if (!safeRedirectTarget) {
    return "/login";
  }

  const params = new URLSearchParams({
    redirect_to: safeRedirectTarget,
  });

  return `/login?${params.toString()}`;
}

export function getAuthUnavailableLoginPath(redirectTo?: string) {
  const params = new URLSearchParams({
    state: AUTH_UNAVAILABLE_STATE,
    messageType: "error",
  });

  const safeRedirectTarget = getSafeRedirectTarget(redirectTo);

  if (safeRedirectTarget) {
    params.set("redirect_to", safeRedirectTarget);
  }

  return `/login?${params.toString()}`;
}
