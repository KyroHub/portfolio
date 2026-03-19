export const siteConfig = {
  name: "Wannes Portfolio",
  title: "Wannes Portfolio | Coptic Dictionary & Digital Humanities",
  description:
    "Scholarly portfolio and digital Coptic-English dictionary by Kyrillos Wannes, featuring 3,330 entries, bilingual UI, analytics, and learning tools.",
  liveUrl: "https://kyrilloswannes.com",
  repoUrl: "https://github.com/KyroHub/portfolio",
  cloneUrl: "https://github.com/KyroHub/portfolio.git",
  author: {
    name: "Kyrillos Wannes",
    twitter: "@kyrilloswannes",
    github: "https://github.com/KyroHub",
  },
  keywords: [
    "coptic",
    "linguistics",
    "dictionary",
    "digital humanities",
    "nextjs",
    "typescript",
    "tailwindcss",
    "recharts",
  ],
  dictionaryEntryCount: 3330,
};

export function buildPageTitle(title: string) {
  return `${title} | ${siteConfig.name}`;
}

export function getSiteUrl() {
  const rawUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined) ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ??
    siteConfig.liveUrl;

  if (!rawUrl) return undefined;

  try {
    return new URL(rawUrl);
  } catch {
    return undefined;
  }
}
