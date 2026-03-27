import { notFound, redirect } from "next/navigation";
import { DEFAULT_LANGUAGE } from "@/lib/i18n";
import { isPublicLocale } from "@/lib/locale";
import { getPreferredLanguage } from "@/lib/server/preferredLanguage";
import type { Language } from "@/types/i18n";

export function resolvePublicLocale(locale?: string): Language {
  return locale && isPublicLocale(locale) ? locale : DEFAULT_LANGUAGE;
}

export function requirePublicLocale(locale?: string): Language {
  if (!locale || !isPublicLocale(locale)) {
    notFound();
  }

  return locale;
}

export async function redirectToPreferredLocale(
  buildPath: (locale: Language) => string,
): Promise<never> {
  const preferredLanguage = await getPreferredLanguage();
  redirect(buildPath(preferredLanguage));
}

export async function redirectToPreferredLocaleWithParams<T>(
  paramsPromise: Promise<T>,
  buildPath: (params: T, locale: Language) => string,
): Promise<never> {
  const [params, preferredLanguage] = await Promise.all([
    paramsPromise,
    getPreferredLanguage(),
  ]);

  redirect(buildPath(params, preferredLanguage));
}
