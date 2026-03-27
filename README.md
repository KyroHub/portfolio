# Kyrillos Wannes | Coptic Dictionary, Grammar, and Publications

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![API](https://img.shields.io/badge/Public_Grammar_API-Live-0ea5e9)

Digital Coptic language platform by Kyrillos Wannes, bringing together a searchable dictionary, published grammar lessons, academic publications, a public grammar API, and private learning workspaces for students and instructors.

> Live site: [kyrilloswannes.com](https://kyrilloswannes.com)
>
> Repository: [github.com/KyroHub/portfolio](https://github.com/KyroHub/portfolio)

## What the App Includes

- A searchable Coptic dictionary with 6,408 checked-in entries and support for Coptic, English, and Greek lookup.
- Published grammar lessons with exercises, footnotes, concept glossaries, and links back to dictionary entries and sources.
- A publications section for published and forthcoming books connected to the broader Coptic project.
- A public grammar API with JSON endpoints and OpenAPI documentation for reuse in other tools and teaching workflows.
- A private student dashboard for profile settings, grammar progress, bookmarks, notes, and exercise submissions.
- A private instructor workspace for reviewing and grading student submissions.
- English and Dutch interfaces, with legacy non-localized routes redirecting to localized pages.

## Highlights

- Fast lexical browsing with support for Coptic script and a built-in virtual keyboard.
- Rich entry pages with grammatical detail, dialect forms, and related content.
- Grammar lessons that connect terminology, examples, sources, learner progress, and dictionary entries in one reading flow.
- A versioned grammar dataset exported to `public/data/grammar/v1` and shared by the site, API, and developer docs.
- Private learner and instructor flows built around submissions, feedback, bookmarks, notes, and profile management.
- Developer-facing grammar endpoints and docs for lessons, concepts, examples, exercises, footnotes, sources, and the OpenAPI spec.

## Interface Preview

<p>
  <img src="public/readme/homepage-preview.png" alt="Homepage preview" width="49%" />
  <img src="public/readme/dictionary-search-preview.png" alt="Dictionary search interface preview" width="49%" />
</p>

<p>
  <img src="public/readme/lesson-preview.png" alt="Grammar lesson preview" width="49%" />
  <img src="public/readme/publications-preview.png" alt="Publications page preview" width="49%" />
</p>

## Stack

- Framework: Next.js 16 with the App Router
- Language and UI: TypeScript, React 19, Tailwind CSS 4
- Auth and storage: Supabase SSR, Postgres, and Storage
- Charts and analytics: Recharts
- Theme support: `next-themes`
- API docs: OpenAPI + Swagger UI
- Testing: Vitest + Playwright
- Data delivery: checked-in JSON in `public/data`, with grammar exports generated from typed source modules in `src/content/grammar`

## Runtime Assumptions

- Production is currently designed around Next.js running on the Node.js runtime, typically on Vercel.
- Cloudflare works well in front of the app as DNS, CDN, or proxy, but the app is not currently structured for Cloudflare Workers or other Edge-only runtimes.
- Some server modules read local project files at build or request time, including dictionary JSON files in `public/data`, grammar exports, and source timestamps used by the sitemap.
- If you later want to move more of the app to Edge or Worker runtimes, these filesystem reads should be replaced with build-time imports, generated manifests, or storage/API-backed lookups.

## Local Development

```bash
git clone https://github.com/KyroHub/portfolio.git
cd portfolio
nvm use
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

The repository includes [`.nvmrc`](./.nvmrc) to pin the local Node.js version used in CI.

For Playwright smoke tests, install the Chromium browser once:

```bash
npx playwright install chromium
```

### Environment Setup

Copy the example file only if you want to enable Supabase auth, profile avatars, contact email, or distributed rate limiting locally:

```bash
cp .env.example .env.local
```

Then replace the placeholder values in `.env.local` with your own local credentials.

Important:

- `.env.local` is gitignored and should never be committed.
- [`.env.example`](./.env.example) contains placeholders only and is safe to track.
- If you skip environment setup, public pages and the read-only grammar API still work, but auth, dashboards, avatar uploads, instructor review, and email-backed features may be unavailable.

Useful commands:

```bash
npm run lint
npm run test
npm run data:grammar:export
npm run test:e2e:local
npm run build
```

## Data Workflows

### Grammar

Grammar lesson source files live under `src/content/grammar`. They are exported into public JSON files used by the site and API.

```bash
npm run data:grammar:export
```

The export writes to `public/data/grammar/v1` and also runs automatically before production builds.

### Dictionary

The public dictionary currently ships from the checked-in dataset at `public/data/dictionary.json`.

## Public Grammar API

The repository exposes a read-only public grammar dataset.

Key entry points:

- `/api/v1/grammar`
- `/api/v1/grammar/manifest`
- `/api/v1/grammar/lessons`
- `/api/v1/grammar/concepts`
- `/api/v1/grammar/examples`
- `/api/v1/grammar/exercises`
- `/api/v1/grammar/footnotes`
- `/api/v1/grammar/sources`

Docs and developer pages:

- `/api-docs`
- `/api/openapi.json`
- `/en/developers`
- `/nl/developers`

## Project Status

Currently implemented in the app:

- Searchable Coptic dictionary
- Published grammar lesson system
- Publications section
- Public grammar API and API docs
- English and Dutch localized UI
- Student dashboard with profile and learning progress
- Instructor submission review workspace

Current areas of active maintenance:

- More published grammar lessons
- Expanded publication metadata and coverage
- Editorial and lexical data cleanup
- Submission and review workflow polish
- Further polish for contributor and developer documentation

## Contributing

Contributions are welcome, especially around lexical corrections, metadata cleanup, UI refinements, and teaching-oriented improvements.

If you want to propose a correction or addition, start with [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

This repository uses a split licensing model:

- Source code: [MIT License](./LICENSE)
- Grammar lesson content and dataset exports: all rights reserved unless stated otherwise in dataset rights metadata
- Dictionary data and publication metadata: please preserve scholarly attribution and source context when reusing or adapting material
