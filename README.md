# Junshu Sha · Personal Space

## Requirements

- Node.js `22.12.0` (the repository declares `>=22.12.0`).
- npm, Git, and a Chromium installation that Playwright can manage.

The site is a static Astro project. Editable content is Markdown/MDX under `src/content/`; generated files stay out of version control.

## Install and run

Install the lockfile's exact dependency tree, then start the local development server:

```bash
npm ci
npm run dev
```

Astro serves the Chinese site at `/` and the English site under `/en/`. Content is organized into five collections:

- `src/content/projects/` — software project case studies.
- `src/content/articles/` — technical writing.
- `src/content/journal/` — photography and life entries.
- `src/content/profile/` — the About/profile page.
- `src/content/resume/` — the web résumé and optional PDF link.

The collection directories may be empty. When no confirmed input has been supplied, keep the corresponding page unpublished and let the route show its intentional empty state; do not invent placeholder biography, résumé, article, journal, or project claims.

## Validate

Run the full local gate before opening a pull request:

```bash
npm run validate
```

This checks formatting, Astro/content schemas, translation-key uniqueness, unit tests, the static build, local links, and Playwright browser tests. The CI workflow installs Chromium and runs the same command on pull requests and pushes to `main`.

The Lighthouse command remains available as `npm run test:lighthouse`. On this Windows workspace, Lighthouse cleanup has failed with `EPERM` for both the default `%LOCALAPPDATA%\\Temp\\lighthouse.*` directory and the project-local `.lighthouse-tmp/` workaround. The original `0.90` category threshold is unchanged; Task 11 must run this gate in Linux/GitHub Actions and record the result before production release.

## Add or translate a project

Create a Markdown file under `src/content/projects/zh/` or `src/content/projects/en/` with the project schema fields, a tracked local `cover`, and confirmed repository/evidence links. Use the same `translationKey` in both locale files to pair translations; locale files may use different slugs, but each locale must have a unique `translationKey` within the collection.

Set `draft: true` while a project is being reviewed. Draft entries are excluded from pages, RSS, and sitemap. Change it to `draft: false` only after the content, claims, links, and images are confirmed. Keep images in the repository (normally under `src/assets/`) and reference them with the schema's local image paths so Astro can optimize them during the build; do not hotlink unreviewed remote assets.

## Publish a technical article

Add the Chinese source at `src/content/articles/zh/<lowercase-hyphenated-slug>.md`. Include a confirmed title, a summary of at least 20 characters, publication/update dates, tags, and a stable `translationKey`. Add the English translation under `src/content/articles/en/` with the same key when it is ready; if it is absent, the English route intentionally shows the Chinese fallback notice. Keep `draft: true` until the author, text, dates, links, and any cover image are confirmed, then set `draft: false`.

## Publish a journal entry

Add bilingual Markdown entries under `src/content/journal/zh/` and `src/content/journal/en/` with the same `translationKey`, confirmed dates/metadata, and local images. Every photo needs meaningful, non-empty alt text; captions and `place` must also be confirmed safe to publish. Do not add precise locations or private context merely to fill a field. Use `draft: true` until the complete photo set and metadata have been reviewed.

## Update profile, résumé, and contacts

Profile and résumé Markdown belongs in `src/content/profile/<locale>/` and `src/content/resume/<locale>/`, paired by `translationKey`. Leave these collections empty when the user has not supplied confirmed biography or résumé text. The résumé schema may declare `pdfPath`, but only replace the PDF after copying the confirmed file to `public/resume/junshu-sha-resume.pdf`, updating the entry, and manually opening the generated link in a PDF viewer to verify that it is the intended document.

Public contact destinations are the typed `SITE.contacts` array in `src/config/site.ts`. Add only links explicitly confirmed for publication; GitHub is currently the sole confirmed contact. Never add a private email address, phone number, home address, legal identifier, or unconfirmed profile URL.

## Deploy to GitHub Pages

In the repository settings, set GitHub Pages **Source** to **GitHub Actions**. A push to `main` starts `deploy-pages.yml`: its `build` job checks out the commit, installs Node `22.12.0` dependencies and Playwright Chromium, runs `npm run validate`, and only then uploads the validated `dist/` directory with `actions/upload-pages-artifact`. The dependent `deploy` job publishes that artifact through the protected `github-pages` environment using `actions/deploy-pages`.

Pull requests run `ci.yml` with read-only `contents: read` permission. Deployment is artifact-based and does not create or reference a `gh-pages` branch. Keep `cancel-in-progress: false` so Pages deployments are not silently cancelled; protect the `github-pages` environment in repository settings as needed.

## Content privacy checklist

- Publish only information, claims, contact links, images, captions, and locations that the author has confirmed.
- Never commit secrets, API keys, tokens, credentials, private messages, or private personal data.
- Do not commit unconfirmed email/phone/address/legal identity details or precise photo locations.
- Keep unfinished material at `draft: true`; if no input is provided, leave the collection unpublished/empty.
- Keep local images and confirmed PDFs in their intended tracked paths. Review the generated page and manually open any replacement PDF before publishing.
- Keep `.superpowers/`, `node_modules/`, `dist/`, test reports, `.lighthouseci/`, and `.lighthouse-tmp/` out of commits; do not broaden ignores to hide `public/` or `src/content/`.
