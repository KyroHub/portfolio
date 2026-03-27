import { stripLocaleFromPathname } from "@/lib/locale";

const AUTH_SESSION_ROUTE_PREFIXES = ["/admin", "/dashboard"] as const;

export function requiresAuthSessionProxy(pathname: string) {
  const normalizedPathname = stripLocaleFromPathname(pathname);

  if (normalizedPathname === "/update-password") {
    return true;
  }

  return AUTH_SESSION_ROUTE_PREFIXES.some(
    (routePrefix) =>
      normalizedPathname === routePrefix ||
      normalizedPathname.startsWith(`${routePrefix}/`),
  );
}
