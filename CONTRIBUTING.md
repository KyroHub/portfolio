# Contributing

Thanks for helping improve the digital learning tools.

## Local Setup

Use the pinned Node.js version before installing dependencies:

```bash
nvm use
```

If you need auth, email, or rate limiting locally, copy the example environment file and fill in your own values:

```bash
cp .env.example .env.local
```

Do not commit `.env.local`. It is gitignored by default, while [`.env.example`](./.env.example) is tracked with placeholder values only.

## What Contributions Are Most Helpful

- Dictionary corrections, additions, or metadata cleanup
- UI improvements for readability and pedagogy
- Grammar and learning content
- README, documentation, and accessibility improvements

## Dictionary Workflow

The current source-of-truth workflow is Excel-first.

1. Update your local source spreadsheet.
2. Regenerate the dictionary JSON:

   ```bash
   npm run data:parse -- /absolute/path/to/source.xlsx
   ```

   Alternatively, set `DICTIONARY_SOURCE_PATH` before running the script.

3. If you also need to refresh the Dutch dataset, run:

   ```bash
   npm run data:translate
   ```

4. Review the generated diffs in:
   - `public/data/dictionary.json`
   - `public/data/woordenboek.json`

## Pull Request Notes

Please keep PRs focused and explain:

- what changed
- why it changed
- whether the update is editorial, lexical, technical, or visual
- any source or scholarly rationale behind dictionary edits

## Suggested Validation

Before opening a PR, run:

```bash
npm run lint
npm run test
npm run build
```

## Style Guidelines

- Preserve Coptic spelling and dialect notation exactly unless the change is intentional
- Prefer small, reviewable commits over broad unrelated changes
- Flag uncertain readings or reconstructions clearly in the PR description
- Keep UI additions consistent with the academic and reference-focused character of the app
