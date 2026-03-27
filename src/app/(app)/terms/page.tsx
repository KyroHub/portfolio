import type { Metadata } from "next";
import { getTermsPath } from "@/lib/locale";
import { createNoIndexMetadata } from "@/lib/metadata";
import { redirectToPreferredLocale } from "@/lib/publicLocaleRouting";

export const metadata: Metadata = createNoIndexMetadata({
  title: "Terms Redirect",
  description: "Redirects visitors to the primary localized terms route.",
});

export default async function LegacyTermsRedirectPage() {
  return redirectToPreferredLocale(getTermsPath);
}
