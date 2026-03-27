import type { Metadata } from "next";
import ContactPageClient from "@/features/contact/components/ContactPageClient";
import { createLocalizedPageMetadata } from "@/lib/metadata";
import { resolvePublicLocale } from "@/lib/publicLocaleRouting";

function buildContactDescription(locale: "en" | "nl") {
  return locale === "nl"
    ? "Neem contact op met Kyrillos Wannes voor feedback over het woordenboek, grammaticavragen, onderzoekssamenwerking, vragen over publicaties of algemene wetenschappelijke correspondentie."
    : "Contact Kyrillos Wannes for dictionary feedback, grammar questions, research collaboration, publication inquiries, or general scholarly correspondence.";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const resolvedLocale = resolvePublicLocale(locale);

  return createLocalizedPageMetadata({
    title: resolvedLocale === "nl" ? "Contact" : "Contact",
    description: buildContactDescription(resolvedLocale),
    path: "/contact",
    locale: resolvedLocale,
  });
}

export default function ContactPage() {
  return <ContactPageClient />;
}
