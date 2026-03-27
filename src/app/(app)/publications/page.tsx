import type { Metadata } from "next";
import { getPublicationsPath } from "@/lib/locale";
import { createNoIndexMetadata } from "@/lib/metadata";
import { redirectToPreferredLocale } from "@/lib/publicLocaleRouting";

export const metadata: Metadata = createNoIndexMetadata({
  title: "Publications Redirect",
  description: "Redirects visitors to the primary localized publications route.",
});

export default async function LegacyPublicationsRedirectPage() {
  return redirectToPreferredLocale(getPublicationsPath);
}
