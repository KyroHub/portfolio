import type { Metadata } from "next";
import { LegalDocumentPage } from "@/features/legal/components/LegalDocumentPage";
import { getTermsDocument } from "@/features/legal/lib/legalDocuments";
import { createLocalizedPageMetadata } from "@/lib/metadata";
import { resolvePublicLocale } from "@/lib/publicLocaleRouting";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const resolvedLocale = resolvePublicLocale(locale);
  const document = getTermsDocument(resolvedLocale);

  return createLocalizedPageMetadata({
    title: document.title,
    description: document.description,
    path: "/terms",
    locale: resolvedLocale,
  });
}

export default async function LocalizedTermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <LegalDocumentPage {...getTermsDocument(resolvePublicLocale(locale))} />;
}
