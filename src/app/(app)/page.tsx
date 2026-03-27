import type { Metadata } from "next";
import { getLocalizedHomePath } from "@/lib/locale";
import { createNoIndexMetadata } from "@/lib/metadata";
import { redirectToPreferredLocale } from "@/lib/publicLocaleRouting";

export const metadata: Metadata = createNoIndexMetadata({
  title: "Home Redirect",
  description: "Redirects visitors to the primary localized homepage.",
});

export default async function LegacyHomeRedirectPage() {
  return redirectToPreferredLocale(getLocalizedHomePath);
}
