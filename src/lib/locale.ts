import { isLanguage, DEFAULT_LANGUAGE } from "@/lib/i18n";
import type { Language } from "@/types/i18n";

export const PUBLIC_LOCALES = ["en", "nl"] as const satisfies readonly Language[];

function normalizePath(path: string) {
  if (!path) {
    return "/";
  }

  return path.startsWith("/") ? path : `/${path}`;
}

export function isPublicLocale(value: string): value is Language {
  return isLanguage(value);
}

export function getLocalizedPath(locale: Language, path = "/") {
  const normalizedPath = normalizePath(path);
  return normalizedPath === "/" ? `/${locale}` : `/${locale}${normalizedPath}`;
}

export function getLocalizedHomePath(locale: Language) {
  return getLocalizedPath(locale);
}

export function getDictionaryPath(locale?: Language) {
  return locale ? getLocalizedPath(locale, "/dictionary") : "/dictionary";
}

export function getEntryPath(id: string, locale?: Language) {
  const path = `/entry/${id}`;
  return locale ? getLocalizedPath(locale, path) : path;
}

export function getGrammarPath(locale?: Language) {
  return locale ? getLocalizedPath(locale, "/grammar") : "/grammar";
}

export function getPublicationsPath(locale?: Language) {
  return locale ? getLocalizedPath(locale, "/publications") : "/publications";
}

export function getContactPath(locale?: Language) {
  return locale ? getLocalizedPath(locale, "/contact") : "/contact";
}

export function getAnalyticsPath(locale?: Language) {
  return locale ? getLocalizedPath(locale, "/analytics") : "/analytics";
}

export function getDashboardPath(locale?: Language) {
  return locale ? getLocalizedPath(locale, "/dashboard") : "/dashboard";
}

export function getDevelopersPath(locale?: Language) {
  return locale ? getLocalizedPath(locale, "/developers") : "/developers";
}

export function getPrivacyPath(locale?: Language) {
  return locale ? getLocalizedPath(locale, "/privacy") : "/privacy";
}

export function getTermsPath(locale?: Language) {
  return locale ? getLocalizedPath(locale, "/terms") : "/terms";
}

export function stripLocaleFromPathname(pathname: string) {
  const normalizedPath = normalizePath(pathname);

  for (const locale of PUBLIC_LOCALES) {
    if (normalizedPath === `/${locale}`) {
      return "/";
    }

    if (normalizedPath.startsWith(`/${locale}/`)) {
      return normalizedPath.slice(locale.length + 1);
    }
  }

  return normalizedPath;
}

export function switchLocalePath(pathname: string, nextLocale: Language) {
  return getLocalizedPath(nextLocale, stripLocaleFromPathname(pathname));
}

export function appendSearchAndHash(pathname: string, search = "", hash = "") {
  const normalizedPathname = normalizePath(pathname);
  const normalizedSearch = !search
    ? ""
    : search.startsWith("?")
      ? search
      : `?${search}`;
  const normalizedHash = !hash ? "" : hash.startsWith("#") ? hash : `#${hash}`;

  return `${normalizedPathname}${normalizedSearch}${normalizedHash}`;
}

export function createLanguageAlternates(path: string) {
  return Object.fromEntries(
    PUBLIC_LOCALES.map((locale) => [locale, getLocalizedPath(locale, path)]),
  ) as Record<Language, string>;
}

export function getOpenGraphLocale(locale: Language) {
  return locale === "nl" ? "nl_BE" : "en_US";
}

export function getDefaultPublicLocale() {
  return DEFAULT_LANGUAGE;
}
