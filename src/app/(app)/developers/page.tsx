import type { Metadata } from "next";
import { getDevelopersPath } from "@/lib/locale";
import { createNoIndexMetadata } from "@/lib/metadata";
import { redirectToPreferredLocale } from "@/lib/publicLocaleRouting";

export const metadata: Metadata = createNoIndexMetadata({
  title: "Developers Redirect",
  description: "Redirects visitors to the primary localized developer guide.",
});

export default async function LegacyDevelopersRedirectPage() {
  return redirectToPreferredLocale(getDevelopersPath);
}
