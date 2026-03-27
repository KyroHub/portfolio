import type { Metadata } from "next";
import { LegalDocumentPage } from "@/features/legal/components/LegalDocumentPage";
import { getPrivacyDocument } from "@/features/legal/lib/legalDocuments";
import { createLocalizedPageMetadata } from "@/lib/metadata";
import { resolvePublicLocale } from "@/lib/publicLocaleRouting";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const resolvedLocale = resolvePublicLocale(locale);
  const document = getPrivacyDocument(resolvedLocale);

  return createLocalizedPageMetadata({
    title: document.title,
    description: document.description,
    path: "/privacy",
    locale: resolvedLocale,
  });
}

export default async function LocalizedPrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <LegalDocumentPage {...getPrivacyDocument(resolvePublicLocale(locale))} />;
}
