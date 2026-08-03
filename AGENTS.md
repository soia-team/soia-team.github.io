# AGENTS.md — SOIA public website

## Project rules

- This repository is the public SOIA brand and product website plus its Pages deployment output.
- The source of truth for the React application is `soia-site/src/`; generated Pages files at the repository root must not be hand-edited.
- Public pages explain user outcomes, available capabilities, evidence, and ways to begin.
- Internal pricing tests, revenue plans, lead scoring, private repository details, customer material, credentials, and operational task boards never belong here.
- Label claims as Available, Preview, or Roadmap and link to public evidence.
- Codex, Claude Code, and WorkBuddy are host or agent environments, not models.
- Keep the shared visual system in `soia-site/src/styles.css` and preserve the existing Open Design-derived visual language.
- Do not copy third-party code, wording, branding, screenshots, or visual assets. Review `soia-site/THIRD_PARTY_NOTICES.md` for the limited neutral assets used.
- Preserve keyboard navigation, reduced-motion behavior, responsive layout, semantic HTML, and the bilingual route family.
- Run `pnpm validate` and `python3 scripts/validate_site.py` before publishing.
- Confirm before changing repository visibility or publishing a direct change to `main`.

## Deployment shape

GitHub Pages serves the repository root from `main`. `soia-site` is the
maintainable React/Vite source; `pnpm build` produces the root `index.html`,
hashed assets, `favicon.svg`, and `404.html` fallback used by Pages.
