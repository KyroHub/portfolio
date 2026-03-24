# Kyrillos Wannes | Coptic Dictionary, Grammar, and Publications

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![API](https://img.shields.io/badge/Public_Grammar_API-Live-0ea5e9)

Digital Coptic language platform by Kyrillos Wannes, bringing together a searchable dictionary, published grammar lessons, academic publications, and a public grammar API.

> Live site: [kyrilloswannes.com](https://kyrilloswannes.com)
>
> Repository: [github.com/KyroHub/portfolio](https://github.com/KyroHub/portfolio)

## What the Site Includes

- A searchable Coptic dictionary with 3,342 entries and support for Coptic, English, and Greek lookup.
- Published grammar lessons with exercises, endnotes, concept glossaries, and links back to dictionary entries and sources.
- A publications section for published and forthcoming books connected to the broader Coptic project.
- A public grammar API with JSON endpoints and OpenAPI documentation for reuse in other tools and teaching workflows.
- English and Dutch interfaces for broader classroom and research accessibility.

## Highlights

- Fast lexical browsing with support for Coptic script and a built-in virtual keyboard.
- Rich entry pages with grammatical detail, dialect forms, and related content.
- Grammar lessons that connect terminology, examples, sources, and dictionary entries in one reading flow.
- Publication pages that tie research output back into the teaching and reference material.
- Developer-facing grammar endpoints for lessons, concepts, examples, exercises, footnotes, and sources.

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
- Language: TypeScript
- UI: React 19 + Tailwind CSS 4
- Charts and analytics: Recharts
- Theme support: `next-themes`
- Data delivery: static JSON generated from typed source data and transformation scripts

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

Copy the example file only if you want to enable Supabase auth, contact email, or distributed rate limiting locally:

```bash
cp .env.example .env.local
```

Then replace the placeholder values in `.env.local` with your own local credentials.

Important:

- `.env.local` is gitignored and should never be committed.
- [`.env.example`](./.env.example) contains placeholders only and is safe to track.
- If you skip environment setup, public pages still work, but auth and email-backed features may be unavailable.

Useful commands:

```bash
npm run lint
npm run test
npm run test:e2e:local
npm run build
```

## Data Workflows

### Dictionary

Dictionary content is generated and maintained through local scripts.

```bash
npm run data:parse
npm run data:dictionary:derive
npm run data:dictionary:validate-config
npm run data:dictionary:audit-related
```

Additional maintenance helpers:

```bash
npm run data:translate
npm run data:rewrite
```

### Grammar

Grammar lesson data is exported into public JSON files used by the site and API.

```bash
npm run data:grammar:export
```

This export also runs automatically before production builds.

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
- `/en/developers`
- `/nl/developers`

## Project Status

Currently live in production:

- Searchable Coptic dictionary
- Published grammar lesson system
- Publications section
- Public grammar API and API docs
- English and Dutch localized UI

Current areas of growth:

- More published grammar lessons
- Expanded publication metadata and coverage
- Submission and editorial workflows
- Further polish for contributor and developer documentation

## Contributing

Contributions are welcome, especially around lexical corrections, metadata cleanup, UI refinements, and teaching-oriented improvements.

If you want to propose a correction or addition, start with [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

This repository uses a split licensing model:

- Source code: [MIT License](./LICENSE)
- Dictionary data: please preserve scholarly attribution when reusing or adapting lexical material
