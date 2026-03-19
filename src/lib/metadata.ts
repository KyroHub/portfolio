import type { Metadata } from "next";
import { buildPageTitle, siteConfig } from "@/lib/site";

export function createPageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: buildPageTitle(title),
      description,
      url: `${siteConfig.liveUrl}${path}`,
    },
    twitter: {
      title: buildPageTitle(title),
      description,
    },
  };
}
