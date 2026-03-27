import type { Metadata } from "next";
import { getPrivacyPath } from "@/lib/locale";
import { createNoIndexMetadata } from "@/lib/metadata";
import { redirectToPreferredLocale } from "@/lib/publicLocaleRouting";

export const metadata: Metadata = createNoIndexMetadata({
  title: "Privacy Redirect",
  description: "Redirects visitors to the primary localized privacy route.",
});

export default async function LegacyPrivacyRedirectPage() {
  return redirectToPreferredLocale(getPrivacyPath);
}
