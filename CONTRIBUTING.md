# Contributing

Thanks for helping improve the digital learning tools.

## Local Setup

Use the pinned Node.js version before installing dependencies:

```bash
nvm use
npm install
```

If you need auth, profile avatars, contact email, or distributed rate limiting locally, copy the example environment file and fill in your own values:

```bash
cp .env.example .env.local
```

Do not commit `.env.local`. It is gitignored by default, while [`.env.example`](./.env.example) is tracked with placeholder values only.

If you plan to run the browser smoke tests locally, install the Playwright browser once:

```bash
npx playwright install chromium
```

## What Contributions Are Most Helpful

- Dictionary corrections, additions, or metadata cleanup
- Grammar and learning content
- UI improvements for readability, pedagogy, and accessibility
- Student or instructor workflow refinements
- README, API docs, localization, and test coverage improvements

## Repository Workflows

### App, UI, and Routing Changes

Run the app locally with:

```bash
npm run dev
```

Public pages live under `/en` and `/nl`, and the legacy non-localized routes redirect to their localized equivalents.

If your change touches auth, dashboard, admin review, profile avatars, or contact email, make sure `.env.local` is populated first.

### Grammar Content Changes

Grammar source lives under `src/content/grammar`. After editing grammar source files or the export/build logic, run:

```bash
npm run data:grammar:export
```

Then review the generated files under `public/data/grammar/v1` and spot-check the relevant surfaces:

- `/api/v1/grammar`
- `/api/v1/grammar/lessons`
- `/api-docs`

### Dictionary Changes

The site currently serves the checked-in dataset at `public/data/dictionary.json`.

For lexical corrections, include the scholarly or source rationale in your PR. For larger source-data refreshes, coordinate the ingest workflow separately with the maintainer.

### Supabase-Backed Changes

If you change auth, profiles, learner progress, submissions, or avatar storage, include the necessary SQL in `supabase/migrations` and describe any setup or rollout steps in your PR.

## Security Policy

Report security issues privately to `kyrilloswannes@gmail.com`, via the contact page, or by opening an issue if the report is not sensitive.

Do not commit real Supabase credentials to the repository. Public anon configuration belongs in environment variables and deployment settings, while service-role or other secret keys must never be committed.

## Pull Request Notes

Please keep PRs focused and explain:

- what changed
- why it changed
- whether the update is editorial, lexical, technical, visual, or schema-related
- any source or scholarly rationale behind dictionary or grammar edits
- any required environment variables, migrations, or follow-up steps
- screenshots for visible UI changes when they help reviewers

## Suggested Validation

Before opening a PR, run:

```bash
npm run lint
npm run test
npm run build
```

If you changed grammar content or the export/build pipeline, also run:

```bash
npm run data:grammar:export
```

If you changed routing, auth, redirects, metadata, dashboard/admin flows, or major UI flows, also run:

```bash
npm run test:e2e:local
```

## Style Guidelines

- Preserve Coptic spelling and dialect notation exactly unless the change is intentional
- Prefer small, reviewable commits over broad unrelated changes
- Flag uncertain readings or reconstructions clearly in the PR description
- Keep UI additions consistent with the academic and reference-focused character of the app
- Keep English and Dutch user-facing copy aligned when editing localized content
