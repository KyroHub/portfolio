import type { Metadata } from "next";
import { getAnalyticsPath } from "@/lib/locale";
import { createNoIndexMetadata } from "@/lib/metadata";
import { redirectToPreferredLocale } from "@/lib/publicLocaleRouting";

export const metadata: Metadata = createNoIndexMetadata({
  title: "Analytics Redirect",
  description: "Redirects visitors to the primary localized analytics route.",
});

export default async function LegacyAnalyticsRedirectPage() {
  return redirectToPreferredLocale(getAnalyticsPath);
}
