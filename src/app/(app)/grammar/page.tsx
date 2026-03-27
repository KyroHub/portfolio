import type { Metadata } from "next";
import { getGrammarPath } from "@/lib/locale";
import { createNoIndexMetadata } from "@/lib/metadata";
import { redirectToPreferredLocale } from "@/lib/publicLocaleRouting";

export const metadata: Metadata = createNoIndexMetadata({
  title: "Grammar Redirect",
  description: "Redirects visitors to the primary localized grammar route.",
});

export default async function LegacyGrammarRedirectPage() {
  return redirectToPreferredLocale(getGrammarPath);
}
