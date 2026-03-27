import type { Metadata } from "next";
import { notFound } from "next/navigation";
import StructuredData from "@/components/StructuredData";
import PublicationDetailPageClient from "@/features/publications/components/PublicationDetailPageClient";
import {
  buildPublicationDescription,
  buildPublicationTitle,
  getPublicationById,
  getPublicationPath,
  getRelatedPublications,
  publications,
} from "@/features/publications/lib/publications";
import { listPublishedGrammarLessonsForPublication } from "@/features/grammar/lib/grammarContentGraph";
import { getTranslation } from "@/lib/i18n";
import {
  createLanguageAlternates,
  getLocalizedHomePath,
  getOpenGraphLocale,
  getPublicationsPath,
} from "@/lib/locale";
import { buildPageTitle, siteConfig } from "@/lib/site";
import { resolvePublicLocale } from "@/lib/publicLocaleRouting";
import {
  createBreadcrumbStructuredData,
  createPublicationStructuredData,
} from "@/lib/structuredData";

export const dynamicParams = false;

export async function generateStaticParams() {
  return publications.map((publication) => ({
    id: publication.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = resolvePublicLocale(resolvedParams.locale);
  const publication = getPublicationById(resolvedParams.id);

  if (!publication) {
    return {
      title:
        locale === "nl" ? "Publicatie niet gevonden" : "Publication Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title = buildPublicationTitle(publication);
  const description = buildPublicationDescription(publication, locale);
  const path = getPublicationPath(publication.id, locale);
  const imageUrl = publication.image
    ? `${siteConfig.liveUrl}${publication.image}`
    : undefined;
  const shouldIndex = publication.status === "published";

  return {
    metadataBase: new URL(siteConfig.liveUrl),
    title,
    description,
    robots: shouldIndex
      ? undefined
      : {
          index: false,
          follow: true,
        },
    alternates: {
      canonical: path,
      languages: createLanguageAlternates(`/publications/${publication.id}`),
    },
    openGraph: {
      title: buildPageTitle(title),
      description,
      url: `${siteConfig.liveUrl}${path}`,
      locale: getOpenGraphLocale(locale),
      ...(imageUrl
        ? {
            images: [
              {
                url: imageUrl,
                alt: title,
              },
            ],
          }
        : {}),
    },
    twitter: {
      title: buildPageTitle(title),
      description,
      ...(imageUrl ? { images: [imageUrl] } : {}),
    },
  };
}

export default async function PublicationDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const resolvedParams = await params;
  const locale = resolvePublicLocale(resolvedParams.locale);
  const publication = getPublicationById(resolvedParams.id);

  if (!publication) {
    notFound();
  }

  const publicationPath = getPublicationPath(publication.id, locale);
  const grammarLessons = listPublishedGrammarLessonsForPublication(publication.id);
  const relatedPublications = getRelatedPublications(publication.id);

  return (
    <>
      <StructuredData
        data={[
          createBreadcrumbStructuredData([
            { name: getTranslation(locale, "nav.home"), path: getLocalizedHomePath(locale) },
            { name: getTranslation(locale, "nav.publications"), path: getPublicationsPath(locale) },
            { name: publication.title, path: publicationPath },
          ]),
          createPublicationStructuredData(publication, locale),
        ]}
      />
      <PublicationDetailPageClient
        grammarLessons={grammarLessons}
        publication={publication}
        relatedPublications={relatedPublications}
      />
    </>
  );
}
