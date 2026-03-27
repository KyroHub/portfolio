import type { Metadata } from "next";
import { DashboardPageContent } from "@/features/dashboard/components/DashboardPageContent";
import { getDashboardCopy } from "@/features/dashboard/lib/dashboardCopy";
import { createNoIndexMetadata } from "@/lib/metadata";
import { resolvePublicLocale } from "@/lib/publicLocaleRouting";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const resolvedLocale = resolvePublicLocale(locale);
  const copy = getDashboardCopy(resolvedLocale);

  return createNoIndexMetadata({
    title: copy.metaTitle,
    description: copy.metaDescription,
  });
}

export default async function LocalizedDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const resolvedLocale = resolvePublicLocale(locale);

  return <DashboardPageContent locale={resolvedLocale} />;
}
