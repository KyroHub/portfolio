import type { Metadata } from "next";
import Link from "next/link";
import StructuredData from "@/components/StructuredData";
import { PageHeader } from "@/components/PageHeader";
import { PageShell, pageShellAccents } from "@/components/PageShell";
import { SurfacePanel } from "@/components/SurfacePanel";
import { getTranslation } from "@/lib/i18n";
import { createLocalizedPageMetadata } from "@/lib/metadata";
import { resolvePublicLocale } from "@/lib/publicLocaleRouting";
import {
  getDevelopersPath,
  getGrammarPath,
  getLocalizedHomePath,
} from "@/lib/locale";
import {
  createBreadcrumbStructuredData,
} from "@/lib/structuredData";

const developerCopy = {
  en: {
    title: "Developers",
    seoTitle: "Coptic Grammar API for Developers",
    description:
      "Explore the public Coptic grammar API, OpenAPI schema, static JSON exports, and integration notes for developers building on the grammar dataset.",
    eyebrow: "Developer Platform",
    heroTitle: "Build on the Coptic grammar dataset",
    heroDescription:
      "The grammar API exposes a read-only, versioned dataset for lessons, concepts, examples, exercises, footnotes, and sources. Start with the developer guide, then move into Swagger or the raw OpenAPI document when you are ready to integrate.",
    primaryCta: "Open API Docs",
    secondaryCta: "View OpenAPI JSON",
    discoveryTitle: "Start here",
    discoveryDescription:
      "Most integrations should begin with the API index, which documents the available resource families and the current dataset version.",
    workflowTitle: "Typical workflow",
    workflowItems: [
      "Call /api/v1/grammar to discover the current endpoints and dataset version.",
      "Fetch /api/v1/grammar/lessons for the published lesson index.",
      "Load /api/v1/grammar/lessons/[slug] for full lesson payloads.",
      "Use /api/openapi.json when generating clients or importing the schema into tooling.",
    ],
    integrationTitle: "Integration notes",
    integrationItems: [
      "Responses are read-only and versioned with schemaVersion, datasetVersion, and generatedAt metadata.",
      "The public dataset only exposes published lessons and their related concepts, examples, exercises, footnotes, and sources.",
      "The lesson filter accepts either a lesson slug or a canonical lesson id.",
      "For browser apps on another origin, a backend proxy is the safest default.",
    ],
    endpointsTitle: "High-value endpoints",
    endpoints: [
      {
        href: "/api/v1/grammar",
        label: "/api/v1/grammar",
        description: "Discovery index for the public grammar API.",
      },
      {
        href: "/api/v1/grammar/lessons?status=published",
        label: "/api/v1/grammar/lessons?status=published",
        description: "Published lesson index for public integrations.",
      },
      {
        href: "/api/v1/grammar/manifest",
        label: "/api/v1/grammar/manifest",
        description: "Manifest with dataset-level metadata and counts.",
      },
      {
        href: "/api/openapi.json",
        label: "/api/openapi.json",
        description: "Machine-readable OpenAPI document.",
      },
    ],
    exampleTitle: "Example request",
    exampleCaption:
      "A minimal server-side fetch that lists published lesson titles.",
    resourcesTitle: "Related resources",
    resources: [
      {
        href: "/api-docs",
        label: "Swagger UI",
        description: "Interactive reference for exploring every endpoint.",
      },
      {
        href: "/api/openapi.json",
        label: "OpenAPI JSON",
        description: "Import into Postman, SDK generators, or internal tooling.",
      },
      {
        href: "/api/v1/grammar",
        label: "API index",
        description: "Read the current API capabilities and example routes.",
      },
      {
        href: getGrammarPath("en"),
        label: "Grammar hub",
        description: "See the public content the API is exposing.",
      },
    ],
    breadcrumbLabel: "Developers",
    code: `const response = await fetch(
  "https://kyrilloswannes.com/api/v1/grammar/lessons",
);

const payload = await response.json();
const lessonTitles = payload.data.map((lesson) => lesson.title.en);`,
  },
  nl: {
    title: "Ontwikkelaars",
    seoTitle: "Koptische grammatica-API voor ontwikkelaars",
    description:
      "Verken de publieke Koptische grammatica-API, het OpenAPI-schema, statische JSON-exports en integratienotities voor ontwikkelaars.",
    eyebrow: "Developerplatform",
    heroTitle: "Bouw voort op de grammatica-dataset",
    heroDescription:
      "De grammatica-API biedt een alleen-lezen, geversioneerde dataset voor lessen, begrippen, voorbeelden, oefeningen, voetnoten en bronnen. Begin met deze gids en ga daarna verder naar Swagger of het ruwe OpenAPI-document zodra je wilt integreren.",
    primaryCta: "Open API-docs",
    secondaryCta: "Bekijk OpenAPI JSON",
    discoveryTitle: "Begin hier",
    discoveryDescription:
      "De meeste integraties starten best bij de API-index, waar de beschikbare resourcefamilies en de huidige datasetversie worden uitgelegd.",
    workflowTitle: "Typische workflow",
    workflowItems: [
      "Roep /api/v1/grammar aan om de huidige endpoints en datasetversie te ontdekken.",
      "Gebruik /api/v1/grammar/lessons voor de index van gepubliceerde lessen.",
      "Laad /api/v1/grammar/lessons/[slug] voor volledige lespayloads.",
      "Gebruik /api/openapi.json om clients te genereren of het schema in tooling te importeren.",
    ],
    integrationTitle: "Integratienotities",
    integrationItems: [
      "Responses zijn alleen-lezen en bevatten schemaVersion, datasetVersion en generatedAt.",
      "De publieke dataset bevat alleen gepubliceerde lessen en de bijbehorende begrippen, voorbeelden, oefeningen, voetnoten en bronnen.",
      "De lesson-filter accepteert zowel een slug als een canonieke les-id.",
      "Voor browser-apps op een andere origin is een backendproxy de veiligste standaardoptie.",
    ],
    endpointsTitle: "Belangrijke endpoints",
    endpoints: [
      {
        href: "/api/v1/grammar",
        label: "/api/v1/grammar",
        description: "Ontdekkingsindex voor de publieke grammatica-API.",
      },
      {
        href: "/api/v1/grammar/lessons?status=published",
        label: "/api/v1/grammar/lessons?status=published",
        description: "Index van gepubliceerde lessen voor publieke integraties.",
      },
      {
        href: "/api/v1/grammar/manifest",
        label: "/api/v1/grammar/manifest",
        description: "Manifest met datasetmetadata en aantallen.",
      },
      {
        href: "/api/openapi.json",
        label: "/api/openapi.json",
        description: "Machineleesbaar OpenAPI-document.",
      },
    ],
    exampleTitle: "Voorbeeldrequest",
    exampleCaption:
      "Een minimale server-side fetch die de titels van gepubliceerde lessen ophaalt.",
    resourcesTitle: "Verwante bronnen",
    resources: [
      {
        href: "/api-docs",
        label: "Swagger UI",
        description: "Interactieve referentie om alle endpoints te verkennen.",
      },
      {
        href: "/api/openapi.json",
        label: "OpenAPI JSON",
        description: "Importeer in Postman, SDK-generators of interne tooling.",
      },
      {
        href: "/api/v1/grammar",
        label: "API-index",
        description: "Lees de huidige mogelijkheden en voorbeeldroutes.",
      },
      {
        href: getGrammarPath("nl"),
        label: "Grammatica-overzicht",
        description: "Bekijk de publieke inhoud die de API ontsluit.",
      },
    ],
    breadcrumbLabel: "Ontwikkelaars",
    code: `const response = await fetch(
  "https://kyrilloswannes.com/api/v1/grammar/lessons",
);

const payload = await response.json();
const lessonTitles = payload.data.map((lesson) => lesson.title.en);`,
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const resolvedLocale = resolvePublicLocale(locale);
  const copy = developerCopy[resolvedLocale];

  return createLocalizedPageMetadata({
    title: copy.seoTitle,
    description: copy.description,
    path: "/developers",
    locale: resolvedLocale,
  });
}

export default async function DevelopersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const resolvedLocale = resolvePublicLocale(locale);
  const copy = developerCopy[resolvedLocale];

  return (
    <PageShell
      className="min-h-screen px-6 py-14 md:px-10"
      contentClassName="mx-auto max-w-6xl space-y-10"
      accents={[
        pageShellAccents.topRightSkyOrb,
        pageShellAccents.bottomLeftEmeraldOrbSoft,
      ]}
    >
      <StructuredData
        data={createBreadcrumbStructuredData([
          {
            name: getTranslation(resolvedLocale, "nav.home"),
            path: getLocalizedHomePath(resolvedLocale),
          },
          { name: copy.breadcrumbLabel, path: getDevelopersPath(resolvedLocale) },
        ])}
      />

      <PageHeader
        eyebrow={copy.eyebrow}
        eyebrowVariant="badge"
        title={copy.heroTitle}
        description={copy.heroDescription}
        tone="sky"
        size="compact"
      />

      <section className="grid gap-4 md:grid-cols-[minmax(0,1.4fr)_minmax(18rem,1fr)]">
        <SurfacePanel rounded="3xl" variant="elevated" className="p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-700 dark:text-sky-300">
            {copy.discoveryTitle}
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-600 dark:text-stone-300">
            {copy.discoveryDescription}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/api-docs" className="btn-secondary">
              {copy.primaryCta}
            </Link>
            <Link href="/api/openapi.json" className="btn-secondary">
              {copy.secondaryCta}
            </Link>
            <Link href="/api/v1/grammar" className="btn-secondary">
              /api/v1/grammar
            </Link>
          </div>
        </SurfacePanel>

        <SurfacePanel rounded="3xl" variant="elevated" className="p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">
            {copy.workflowTitle}
          </p>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-stone-600 dark:text-stone-300">
            {copy.workflowItems.map((item) => (
              <li key={item} className="rounded-2xl border border-stone-200/80 bg-stone-50/80 px-4 py-3 dark:border-stone-800/80 dark:bg-stone-950/50">
                {item}
              </li>
            ))}
          </ul>
        </SurfacePanel>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]">
        <SurfacePanel rounded="3xl" variant="elevated" className="p-6 md:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">
                {copy.endpointsTitle}
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-stone-900 dark:text-stone-100">
                {copy.title}
              </h2>
            </div>
          </div>
          <div className="mt-6 grid gap-3">
            {copy.endpoints.map((endpoint) => (
              <Link
                key={endpoint.href}
                href={endpoint.href}
                className="rounded-2xl border border-stone-200/80 bg-stone-50/80 px-5 py-4 transition-colors hover:border-sky-200 hover:bg-sky-50/70 dark:border-stone-800/80 dark:bg-stone-950/50 dark:hover:border-sky-900/70 dark:hover:bg-sky-950/20"
              >
                <p className="font-mono text-sm text-sky-700 dark:text-sky-300">
                  {endpoint.label}
                </p>
                <p className="mt-2 text-sm leading-7 text-stone-600 dark:text-stone-300">
                  {endpoint.description}
                </p>
              </Link>
            ))}
          </div>
        </SurfacePanel>

        <SurfacePanel rounded="3xl" variant="elevated" className="p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">
            {copy.integrationTitle}
          </p>
          <ul className="mt-4 space-y-3 text-sm leading-7 text-stone-600 dark:text-stone-300">
            {copy.integrationItems.map((item) => (
              <li key={item} className="rounded-2xl border border-stone-200/80 bg-stone-50/80 px-4 py-3 dark:border-stone-800/80 dark:bg-stone-950/50">
                {item}
              </li>
            ))}
          </ul>
        </SurfacePanel>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)]">
        <SurfacePanel rounded="3xl" variant="elevated" className="p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">
            {copy.exampleTitle}
          </p>
          <p className="mt-3 text-sm leading-7 text-stone-600 dark:text-stone-300">
            {copy.exampleCaption}
          </p>
          <pre className="mt-5 overflow-x-auto rounded-2xl border border-stone-200/80 bg-stone-950 px-4 py-4 text-sm leading-6 text-stone-100 dark:border-stone-800/80">
            <code>{copy.code}</code>
          </pre>
        </SurfacePanel>

        <SurfacePanel rounded="3xl" variant="elevated" className="p-6 md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500 dark:text-stone-400">
            {copy.resourcesTitle}
          </p>
          <div className="mt-4 space-y-3">
            {copy.resources.map((resource) => (
              <Link
                key={resource.href}
                href={resource.href}
                className="block rounded-2xl border border-stone-200/80 bg-stone-50/80 px-4 py-4 transition-colors hover:border-sky-200 hover:bg-sky-50/70 dark:border-stone-800/80 dark:bg-stone-950/50 dark:hover:border-sky-900/70 dark:hover:bg-sky-950/20"
              >
                <p className="font-medium text-stone-900 dark:text-stone-100">
                  {resource.label}
                </p>
                <p className="mt-2 text-sm leading-7 text-stone-600 dark:text-stone-300">
                  {resource.description}
                </p>
              </Link>
            ))}
          </div>
        </SurfacePanel>
      </section>
    </PageShell>
  );
}
