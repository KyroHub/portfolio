import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const antinoou = localFont({
  src: [
    {
      path: "../fonts/AntinoouFont-1.0.6/Antinoou.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/AntinoouFont-1.0.6/AntinoouItalic.ttf",
      weight: "400",
      style: "italic",
    },
  ],
  variable: "--font-coptic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Coptic Dictionary",
  description: "Advanced digital Coptic-English dictionary and lexicon analyzer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${antinoou.variable} font-sans antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
