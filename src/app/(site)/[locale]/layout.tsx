import "../../globals.css";
import { AppFrame } from "@/components/AppFrame";
import { createRootLayoutMetadata } from "@/lib/metadata";
import { PUBLIC_LOCALES } from "@/lib/locale";
import { requirePublicLocale } from "@/lib/publicLocaleRouting";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = requirePublicLocale((await params).locale);
  return createRootLayoutMetadata(locale);
}

export function generateStaticParams() {
  return PUBLIC_LOCALES.map((locale) => ({ locale }));
}

export default async function SiteLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const locale = requirePublicLocale((await params).locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <AppFrame initialLanguage={locale} localeRouting>
        {children}
      </AppFrame>
    </html>
  );
}
