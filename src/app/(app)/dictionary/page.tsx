import type { Metadata } from "next";
import { getDictionaryPath } from "@/lib/locale";
import { createNoIndexMetadata } from "@/lib/metadata";
import { redirectToPreferredLocale } from "@/lib/publicLocaleRouting";

export const metadata: Metadata = createNoIndexMetadata({
  title: "Dictionary Redirect",
  description: "Redirects visitors to the primary localized dictionary route.",
});

export default async function LegacyDictionaryRedirectPage() {
  return redirectToPreferredLocale(getDictionaryPath);
}
