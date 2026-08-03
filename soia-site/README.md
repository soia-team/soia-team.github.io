# SOIA React site source

This directory contains the maintainable React/Vite source for the public SOIA
website. The repository root is the GitHub Pages deployment output; do not edit
the generated root files by hand.

## Local development

```bash
pnpm install
pnpm catalog:sync
pnpm dev
```

Open <http://127.0.0.1:4174/>.

## Build

```bash
pnpm typecheck
pnpm build:pages
```

The root repository wraps `build:pages` with `scripts/publish_pages.mjs` and
regenerates the root sitemap. `dist` and `dist-pages` are local build folders
and are intentionally ignored by Git.

## Catalog source

`pnpm catalog:sync` reads the public catalog from
`soia-open-skills/docs/skills/` and writes `src/data/catalog.generated.json`.
Override the checkout path with `SOIA_OPEN_SKILLS_ROOT` when needed.

## Attribution

The implementation was built from the local Open Design project while keeping
SOIA copy, taxonomy, capability data, diagrams, and application code original.
The selected neutral visual assets are stored in `public/visuals/`; the
corresponding Apache-2.0 license is in `THIRD_PARTY_LICENSES/`.
