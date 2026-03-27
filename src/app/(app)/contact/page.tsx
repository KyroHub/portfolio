import type { Metadata } from "next";
import { getContactPath } from "@/lib/locale";
import { createNoIndexMetadata } from "@/lib/metadata";
import { redirectToPreferredLocale } from "@/lib/publicLocaleRouting";

export const metadata: Metadata = createNoIndexMetadata({
  title: "Contact Redirect",
  description: "Redirects visitors to the primary localized contact route.",
});

export default async function LegacyContactRedirectPage() {
  return redirectToPreferredLocale(getContactPath);
}
