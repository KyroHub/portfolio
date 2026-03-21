import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { antinoou } from "@/lib/fonts";
import { getSiteUrl, siteConfig } from "@/lib/site";

import { LanguageProvider } from "@/components/LanguageProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const siteUrl = getSiteUrl();
const socialImages = siteUrl
  ? [
      {
        url: new URL("/opengraph-image", siteUrl).toString(),
        width: 1200,
        height: 630,
        alt: "Wannes Portfolio social preview",
      },
    ]
  : undefined;

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: siteConfig.keywords,
  authors: [
    {
      name: siteConfig.author.name,
      url: siteConfig.author.github,
    },
  ],
  creator: siteConfig.author.name,
  publisher: siteConfig.author.name,
  category: "education",
  openGraph: {
    type: "website",
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: siteConfig.name,
    locale: "en_US",
    url: siteUrl?.toString(),
    images: socialImages,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    creator: siteConfig.author.twitter,
    images: socialImages?.map((image) => image.url),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={antinoou.variable}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <LanguageProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
